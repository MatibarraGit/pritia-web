export interface SyncConfig {
    sourceUrl: string;
    sourceMethod: string;
    sourceBody?: string;
    sourceApiKey: string;
    sourceAuthorization?: string;
    sourceAcceptProfile?: string;
    syncDatabaseUrl: string;
    providerId: number; // providers.provider_id del proveedor sincronizado
    alertWebhookUrl?: string;
    maxAttempts: number;
    retryBaseMs: number;
    requestTimeoutMs: number;
    sourceRowCap: number;
    batchSize: number;
    txTimeoutMs: number;
    minCountRatio: number;
    maxCountRatio: number;
    maxInvalidRatio: number;
    maxAbsentRatio: number;
    maxInserts: number;
    priceAlertRatio: number;
  }
  
  type Env = Record<string, string | undefined>;
  
  function required(env: Env, key: string): string {
    const v = env[key];
    if (!v || v.trim() === "") throw new Error(`Falta la variable de entorno ${key}`);
    return v.trim();
  }
  
  function optional(env: Env, key: string): string | undefined {
    const v = env[key];
    return v && v.trim() !== "" ? v.trim() : undefined;
  }
  
  export function loadConfig(env: Env = process.env): SyncConfig {
    return {
      sourceUrl: required(env, "SYNC_SOURCE_URL"),
      sourceMethod: "GET",
      sourceBody: optional(env, "SYNC_SOURCE_BODY"),
      sourceApiKey: required(env, "SYNC_SOURCE_APIKEY"),
      sourceAuthorization: optional(env, "SYNC_SOURCE_AUTHORIZATION"),
      sourceAcceptProfile: optional(env, "SYNC_SOURCE_ACCEPT_PROFILE"),
      // Conexión DIRECTA a Postgres
      syncDatabaseUrl: required(env, "SYNC_DATABASE_URL"),
      providerId: 2,
      alertWebhookUrl: optional(env, "SYNC_ALERT_WEBHOOK_URL"),
      maxAttempts: 4,
      retryBaseMs: 2000,
      requestTimeoutMs: 30000,
      // PostgREST/Supabase corta en 1000 filas por defecto: si llegan >= cap, se asume truncado.
      sourceRowCap: 1000,
      batchSize: 200,
      txTimeoutMs: 120000,
      minCountRatio: 0.85,
      maxCountRatio: 1.5,
      maxInvalidRatio: 0.02,
      maxAbsentRatio: 0.15,
      maxInserts: 50,
      priceAlertRatio: 0.5,
    };
  }
    