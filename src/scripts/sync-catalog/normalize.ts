import { centsToPesosCeil, parseCents } from "./money";
import type { SourceProduct } from "./types";

// Campos del JSON del proveedor (confirmados con un producto de ejemplo).
const FIELDS = {
  id: "id",
  name: "nombre",
  brand: "marca",
  model: "modelo",
  cost: "precio",
  priceToConfirm: "precio_a_confirmar",
  available: "disponible",
  description: "descripcion",
  hidden: "oculto",
  image: "imagen_url",
  images: "imagenes",
} as const;

// Mismos límites que tu API de productos / tu schema:
const MIN_COST_PESOS = 1000; // la API exige purchase_price >= 1000
const MAX_COST_PESOS = 1000000000; // sell_price es Int (int4): evita overflow
const MAX_NAME_LENGTH = 255; // product_name es VarChar(255)

export type RowResult =
  | { ok: true; product: SourceProduct }
  // expected = estado normal del proveedor (no es un error de datos): no cuenta para el umbral de inválidas
  | { ok: false; providerProductId: string | null; reason: string; expected?: boolean };

function toId(v: unknown): string | null {
  if (typeof v === "number" && Number.isSafeInteger(v)) return String(v);
  if (typeof v === "string" && v.trim() !== "") return v.trim();
  return null;
}

// src/scripts/sync-catalog/text.ts

function clean(v: unknown): string {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";
}

export function capitalizeName(name: unknown): string {
  return typeof name === "string" 
  ? name
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es-AR")
    .split(" ")
    .map((w) =>
      // Solo pone en mayúscula la primera letra si la palabra empieza con letra
      // (después de signos como "("). "400l" queda igual.
      w.replace(/^([^\p{L}\p{N}]*)(\p{L})/u, (_, pre, c) => pre + c.toLocaleUpperCase("es-AR")),
    )
    .join(" ")
  : "";
}

const EMOJI = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\u200D\uFE0F\u20E3]+/gu;
const SEP = "\u0001"; // marca interna: los emojis funcionan como separadores de ítems

function splitList(seg: string): string[] {
  // ";" siempre separa
  return seg.split(/;\s*/).flatMap((s) => {
    // Coma + espacio separa solo si parece una lista (3+ partes cortas).
    // "6,5 pulgadas" no se toca porque no hay espacio después de la coma.
    const parts = s.split(/,\s+/);
    return parts.length >= 3 && parts.every((p) => p.length <= 60) ? parts : [s];
  });
}

function tidy(item: string): string {
  return item
    .replace(/^[-–—•·●▪▫►▶]+\s*/, "")
    .replace(/\s+/g, " ")
    .replace(/[.,;\s]+$/, "")
    .trim()
    .replace(/^[^\p{Ll}]*$/u, (s) => s.toLocaleLowerCase("es-AR")) // solo si no tiene ninguna minúscula
    .replace(/^([^\p{L}\p{N}]*)(\p{L})/u, (_, pre, c) => pre + c.toLocaleUpperCase("es-AR"));
}

/** Acepta el string o el array que manda el proveedor y devuelve lista con "* " por línea. */
function formatDescription(raw: string | null | undefined): string {
  const text = Array.isArray(raw) ? raw.join("\n") : (raw ?? "");
  const items: string[] = [];
  const seen = new Set<string>();
  const push = (s: string) => {
    const t = tidy(s);
    if (t.length < 2 || seen.has(t.toLowerCase())) return;
    seen.add(t.toLowerCase());
    items.push(t);
  };

  for (const line of text.split(/\r?\n/)) {
    const segs = line
      .replace(EMOJI, SEP)
      .replace(/\s*[·•●▪]\s*/g, SEP)
      .replace(/[*~]+/g, "") // negrita/tachado de WhatsApp
      .replace(/(?<![\p{L}\p{N}])_+|_+(?![\p{L}\p{N}])/gu, "") // itálica, respeta snake_case
      .split(SEP)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!segs.length) continue;

    // "Incluye: 🧺 A 🛡️ B 💧 C" -> "Incluye: A, B, C"
    if (segs.length > 1 && segs[0].endsWith(":")) {
      push(`${segs[0]} ${segs.slice(1).join(", ")}`);
      continue;
    }
    for (const seg of segs) splitList(seg).forEach(push);
  }
  return items.map((i) => `* ${i}`).join("\n");
}

function toImageUrl(v: unknown): string | null {
  const raw =
    typeof v === "string"
      ? v
      : typeof v === "object" && v !== null && typeof (v as { url?: unknown }).url === "string"
        ? (v as { url: string }).url
        : null;
  if (!raw) return null;
  const url = raw.trim();
  try {
    return new URL(url).protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/** imagen_url (principal) primero, después imagenes[]; sin repetidas. */
function parseImageUrls(r: Record<string, unknown>): string[] {
  const extra = Array.isArray(r[FIELDS.images]) ? (r[FIELDS.images] as unknown[]) : [];
  const urls = [r[FIELDS.image], ...extra]
    .map(toImageUrl)
    .filter((u): u is string => u !== null);
  return [...new Set(urls)];
}

/** product_name es UNIQUE: "SANDWICHERA 3 EN 1" + "Ultracomb " + "Sw2801" -> "SANDWICHERA 3 EN 1 Ultracomb Sw2801". */
export function buildName(r: Record<string, unknown>): string {
  const base = capitalizeName(r[FIELDS.name]);
  if (!base) return "";
  const extras = [clean(r[FIELDS.brand]), clean(r[FIELDS.model])].filter(
    (part) => part !== "" && !base.toLowerCase().includes(part.toLowerCase()),
  );
  return [base, ...extras].join(" ");
}

/** disponible=false u oculto=true => sin stock. */
function parseInStock(available: unknown, hidden: unknown): boolean | null {
  if (typeof available !== "boolean") return null;
  return available && hidden !== true;
}

export function normalizeRow(row: unknown): RowResult {
  if (typeof row !== "object" || row === null || Array.isArray(row)) {
    return { ok: false, providerProductId: null, reason: "la fila no es un objeto" };
  }
  const r = row as Record<string, unknown>;
  const id = toId(r[FIELDS.id]);
  if (id === null) return { ok: false, providerProductId: null, reason: "ID ausente o inválido" };

  // El proveedor todavía no confirmó el precio: no se toca nada de este producto.
  if (r[FIELDS.priceToConfirm] === true) {
    return { ok: false, providerProductId: id, reason: "precio a confirmar", expected: true };
  }

  const name = buildName(r);
  if (!name) return { ok: false, providerProductId: id, reason: "nombre vacío" };
  if (name.length > MAX_NAME_LENGTH) return { ok: false, providerProductId: id, reason: "nombre demasiado largo" };

  const costCents = parseCents(r[FIELDS.cost]);
  if (costCents === null) return { ok: false, providerProductId: id, reason: "El producto no trae costo" };
  const costPesos = centsToPesosCeil(costCents);
  if (costPesos < MIN_COST_PESOS || costPesos > MAX_COST_PESOS) {
    return { ok: false, providerProductId: id, reason: "costo fuera de rango" };
  }

  const inStock = parseInStock(r[FIELDS.available], r[FIELDS.hidden]);
  if (inStock === null) return { ok: false, providerProductId: id, reason: "disponibilidad inválida" };

  const rawDescription = r[FIELDS.description];

  const description = formatDescription(
    typeof rawDescription === "string"
      ? rawDescription
      : null
  );
  
  return {
    ok: true,
    product: { providerProductId: id, name, costPesos, inStock, description, imageUrls: parseImageUrls(r) },
  };
}