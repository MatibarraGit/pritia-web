import type { SyncConfig } from "./config";

export class SourceFetchError extends Error {
  retryable: boolean;
  status?: number;
  retryAfterMs?: number;
  constructor(message: string, retryable: boolean, status?: number) {
    super(message);
    this.name = "SourceFetchError";
    this.retryable = retryable;
    this.status = status;
  }
}

export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

export interface FetchDeps {
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

function toFetchError(err: unknown): SourceFetchError {
  if (err instanceof SourceFetchError) return err;
  // Red caída, DNS, timeout (AbortError): transitorio.
  return new SourceFetchError("Error de red o timeout al consultar al proveedor", true);
}

async function fetchOnce(cfg: SyncConfig, fetchImpl: typeof fetch): Promise<unknown[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.requestTimeoutMs);
  try {
    const headers: Record<string, string> = { apikey: cfg.sourceApiKey, Accept: "application/json" };
    if (cfg.sourceAuthorization) headers.Authorization = cfg.sourceAuthorization;
    if (cfg.sourceAcceptProfile) headers["Accept-Profile"] = cfg.sourceAcceptProfile;
    if (cfg.sourceBody) headers["Content-Type"] = "application/json";

    const res = await fetchImpl(cfg.sourceUrl, {
      method: cfg.sourceMethod,
      headers,
      body: cfg.sourceBody,
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = new SourceFetchError(`HTTP ${res.status}`, isRetryableStatus(res.status), res.status);
      const retryAfter = Number(res.headers.get("retry-after"));
      if (Number.isFinite(retryAfter) && retryAfter > 0) err.retryAfterMs = retryAfter * 1000;
      throw err;
    }

    let body: unknown;
    try {
      body = await res.json();
    } catch {
      throw new SourceFetchError("JSON inválido o respuesta cortada", true);
    }
    if (!Array.isArray(body)) throw new SourceFetchError("La respuesta no es un arreglo JSON", false);

    // Truncamiento: Content-Range de PostgREST ("0-799/800") o tope típico de filas.
    const total = /\/(\d+)$/.exec(res.headers.get("content-range") ?? "");
    if (total && Number(total[1]) > body.length) {
      throw new SourceFetchError(`Respuesta truncada: ${body.length} de ${total[1]} filas`, false);
    }
    if (body.length >= cfg.sourceRowCap) {
      throw new SourceFetchError(
        `Se recibieron ${body.length} filas (>= tope ${cfg.sourceRowCap}): posible truncamiento`,
        false,
      );
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCatalog(cfg: SyncConfig, deps: FetchDeps = {}): Promise<unknown[]> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));

  for (let attempt = 1; attempt <= cfg.maxAttempts; attempt++) {
    try {
      return await fetchOnce(cfg, fetchImpl);
    } catch (err) {
      const e = toFetchError(err);
      if (!e.retryable || attempt === cfg.maxAttempts) throw e;
      const backoff = Math.min(cfg.retryBaseMs * 2 ** (attempt - 1), 60000);
      await sleep(Math.max(backoff, e.retryAfterMs ?? 0));
    }
  }
  throw new SourceFetchError("Reintentos agotados", false);
}