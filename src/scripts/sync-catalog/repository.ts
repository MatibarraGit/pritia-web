import type { Prisma, PrismaClient } from "@prisma/client";
import { nameKey } from "./plan";
import { SyncAbortError } from "./types";
import type { ExistingProduct, PlannedRow, PriceChange, SyncPlan } from "./types";

export type Tx = Prisma.TransactionClient;

// Todas las consultas usan tagged templates de $queryRaw: cada ${valor} viaja como parámetro
// enlazado ($1, $2...). Los nombres de tabla/columna son texto literal (ya conocemos el schema),
// no hay Prisma.raw ni métodos *Unsafe.

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Toma un advisory lock transaccional: se libera solo al terminar la transacción. */
export async function runLocked<R>(
  prisma: PrismaClient,
  timeoutMs: number,
  work: (tx: Tx) => Promise<R>,
): Promise<R> {
  return prisma.$transaction(
    async (tx) => {
      const rows = await tx.$queryRaw<{ locked: boolean }[]>`
        SELECT pg_try_advisory_xact_lock(hashtext('pritia:catalog-sync')) AS locked`;
      if (!rows[0]?.locked) throw new SyncAbortError(["Hay otra sincronización en curso"]);
      return work(tx);
    },
    { timeout: timeoutMs, maxWait: 10000 },
  );
}

/** FOR UPDATE: bloquea las filas vinculadas hasta el final de la transacción (edición del admin espera). */
export async function loadExisting(tx: Tx): Promise<Map<string, ExistingProduct>> {
  const rows = await tx.$queryRaw<
    { pid: string; cost: number; price: number | null; in_stock: boolean; description: string; deleted: boolean; images: string[] | null }[]
  >`
    SELECT provider_product_id AS pid,
           purchase_price      AS cost,
           sell_price          AS price,
           in_stock,
           product_description AS description,
           images,
           (deleted_at IS NOT NULL) AS deleted
    FROM products
    WHERE provider_product_id IS NOT NULL
    FOR UPDATE`;
  return new Map(
    rows.map((r) => [
      r.pid,
      {
        providerProductId: r.pid,
        costPesos: r.cost,
        pricePesos: r.price,
        inStock: r.in_stock,
        description: r.description,
        images: r.images ?? [],
        deleted: r.deleted,
      },
    ]),
  );
}

/** Incluye productos borrados lógicamente: product_name es UNIQUE para todas las filas. */
export async function loadNameKeys(tx: Tx): Promise<Set<string>> {
  const rows = await tx.$queryRaw<{ name: string }[]>`SELECT product_name AS name FROM products`;
  return new Set(rows.map((r) => nameKey(r.name)));
}

export async function getLastSuccessfulReceived(tx: Tx): Promise<number | null> {
  const rows = await tx.$queryRaw<{ received: number }[]>`
    SELECT received FROM catalog_sync_runs
    WHERE status = 'success' AND dry_run = false
    ORDER BY finished_at DESC LIMIT 1`;
  return rows[0]?.received ?? null;
}

async function labeled<T>(what: string, index: number, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw new Error(`Falló el lote ${what} #${index + 1}: ${e instanceof Error ? e.message.slice(0, 300) : "error"}`);
  }
}

function expectRows(what: string, index: number, got: number, expected: number): void {
  if (got !== expected) {
    throw new Error(`Lote ${what} #${index + 1}: se esperaban ${expected} filas y la base afectó ${got}`);
  }
}

/**
 * Escritura por lotes dentro de la transacción de runLocked (todo o nada).
 * Solo se tocan campos del proveedor: purchase_price, sell_price e in_stock.
 * El nombre solo se escribe al insertar (cambiarlo regeneraría el slug). `stock` no se toca.
 * updated_at solo se actualiza cuando cambia el costo o el precio.
 */
export async function applyPlan(tx: Tx, plan: SyncPlan, batchSize: number, providerId: number): Promise<void> {
  const toJson = (rows: PlannedRow[]) =>
    JSON.stringify(
      rows.map((r) => ({
        pid: r.providerProductId,
        name: r.name,
        cost: r.costPesos,
        price: r.pricePesos,
        in_stock: r.inStock,
        product_description: r.description,
        images: r.imageUrls,
      })),
    );

  for (const [i, batch] of chunk(plan.inserts, batchSize).entries()) {
    const json = toJson(batch);
    const done = await labeled("insert", i, () =>
      tx.$queryRaw<{ product_id: number }[]>`
        INSERT INTO products
          (provider_product_id, product_name, purchase_price, sell_price, in_stock, product_description, provider_ids, images, updated_at)
        SELECT v.pid, v.name, v.cost, v.price, v.in_stock, v.product_description,
          ARRAY[${providerId}::smallint],
          ARRAY(SELECT e FROM jsonb_array_elements_text(v.images) WITH ORDINALITY AS t(e, n) ORDER BY n),
          (now() AT TIME ZONE 'UTC')
        FROM jsonb_to_recordset(${json}::jsonb)
          AS v(pid text, name text, cost int, price int, in_stock boolean, product_description text, images jsonb)
        ON CONFLICT (provider_product_id) WHERE 2 = ANY (provider_ids) DO NOTHING
        RETURNING product_id`,
    );
    expectRows("insert", i, done.length, batch.length);
  }

  for (const [i, batch] of chunk(plan.updates, batchSize).entries()) {
    const json = toJson(batch);
    const done = await labeled("update", i, () =>
      tx.$queryRaw<{ product_id: number }[]>`
      UPDATE products AS p
      SET purchase_price      = v.cost,
          sell_price          = v.price,
          in_stock            = v.in_stock,
          product_description = v.product_description,
          images              = COALESCE(p.images, ARRAY[]::text[]) || ARRAY(
            SELECT e FROM jsonb_array_elements_text(v.images) WITH ORDINALITY AS t(e, n)
            WHERE e <> ALL(COALESCE(p.images, ARRAY[]::text[]))
            ORDER BY n),
          updated_at     = CASE
            WHEN p.purchase_price IS DISTINCT FROM v.cost
              OR p.sell_price     IS DISTINCT FROM v.price
            THEN (now() AT TIME ZONE 'UTC')
            ELSE p.updated_at
          END
      FROM jsonb_to_recordset(${json}::jsonb)
        AS v(pid text, cost int, price int, in_stock boolean, product_description text, images jsonb)
      WHERE p.provider_product_id = v.pid
      RETURNING p.product_id`,
    );
    expectRows("update", i, done.length, batch.length);
  }

  for (const [i, ids] of chunk(plan.markOutOfStockIds, batchSize).entries()) {
    const done = await labeled("sin-stock", i, () =>
      tx.$queryRaw<{ product_id: number }[]>`
        UPDATE products SET in_stock = false
        WHERE provider_product_id = ANY(${ids}::text[]) AND in_stock = true
        RETURNING product_id`,
    );
    expectRows("sin-stock", i, done.length, ids.length);
  }
}

// ---------- Registro de ejecuciones (fuera de la transacción de escritura) ----------

export async function markStaleRuns(prisma: PrismaClient): Promise<void> {
  await prisma.$queryRaw`
    UPDATE catalog_sync_runs
    SET status = 'failed', finished_at = now(), abort_reason = 'Ejecución interrumpida'
    WHERE status = 'running' AND started_at < now() - interval '2 hours'
    RETURNING id`;
}

export async function startRun(prisma: PrismaClient, dryRun: boolean): Promise<string> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    INSERT INTO catalog_sync_runs (status, dry_run) VALUES ('running', ${dryRun})
    RETURNING id::text AS id`;
  return rows[0].id;
}

export interface FinishRunData {
  status: "success" | "failed";
  durationMs: number;
  received: number;
  validated: number;
  inserted: number;
  updated: number;
  reactivated: number;
  markedOutOfStock: number;
  priceChanges: PriceChange[];
  warnings: string[];
  errors: string[];
  abortReason: string | null;
}

export async function finishRun(prisma: PrismaClient, runId: string, d: FinishRunData): Promise<void> {
  const detail = JSON.stringify(
    d.priceChanges.slice(0, 1000).map((c) => ({ id: c.providerProductId, old: c.oldPrice, new: c.newPrice })),
  );
  const warnings = JSON.stringify(d.warnings);
  const errors = JSON.stringify(d.errors);
  await prisma.$queryRaw`
    UPDATE catalog_sync_runs SET
      status = ${d.status}, finished_at = now(), duration_ms = ${d.durationMs},
      received = ${d.received}, validated = ${d.validated},
      inserted = ${d.inserted}, updated = ${d.updated}, reactivated = ${d.reactivated},
      marked_out_of_stock = ${d.markedOutOfStock}, price_changes = ${d.priceChanges.length},
      price_changes_detail = ${detail}::jsonb,
      warnings = ${warnings}::jsonb,
      errors = ${errors}::jsonb,
      abort_reason = ${d.abortReason}
    WHERE id = ${runId}::bigint
    RETURNING id`;
}