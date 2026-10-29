-- Vínculo con el ID del proveedor. 
-- UNIQUE evita duplicados; los NULL (sin vincular) no chocan entre sí.
ALTER TABLE products ADD COLUMN IF NOT EXISTS provider_product_id text;
CREATE UNIQUE INDEX IF NOT EXISTS products_provider_product_id_key
  ON products (provider_product_id)
  -- 2 porque es el provider_id de Electroben
  WHERE 2 = ANY(provider_ids);

CREATE TABLE IF NOT EXISTS catalog_sync_runs (
  id                   bigserial PRIMARY KEY,
  started_at           timestamptz NOT NULL DEFAULT now(),
  finished_at          timestamptz,
  duration_ms          integer,
  status               text NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  dry_run              boolean NOT NULL DEFAULT false,
  received             integer NOT NULL DEFAULT 0,
  validated            integer NOT NULL DEFAULT 0,
  inserted             integer NOT NULL DEFAULT 0,
  updated              integer NOT NULL DEFAULT 0,
  reactivated          integer NOT NULL DEFAULT 0,
  marked_out_of_stock  integer NOT NULL DEFAULT 0,
  price_changes        integer NOT NULL DEFAULT 0,
  price_changes_detail jsonb NOT NULL DEFAULT '[]',
  warnings             jsonb NOT NULL DEFAULT '[]',
  errors               jsonb NOT NULL DEFAULT '[]',
  abort_reason         text
);
CREATE INDEX IF NOT EXISTS catalog_sync_runs_lookup_idx
  ON catalog_sync_runs (status, dry_run, finished_at DESC);

-- Por si la base está expuesta vía PostgREST (Supabase): esta tabla no debe ser pública.
ALTER TABLE catalog_sync_runs ENABLE ROW LEVEL SECURITY;