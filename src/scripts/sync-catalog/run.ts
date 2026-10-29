import { PrismaClient } from "@prisma/client";
import { loadConfig } from "./config";
import { fetchCatalog } from "./fetch-source";
import { notify } from "./notify";
import { buildPlan } from "./plan";
import {
  applyPlan,
  finishRun,
  getLastSuccessfulReceived,
  // linkExistingByName,
  loadExisting,
  loadNameKeys,
  markStaleRuns,
  runLocked,
  startRun,
} from "./repository";
import { SyncAbortError } from "./types";
import type { SyncPlan } from "./types";
import { checkAbsentRatio, checkCountVsLastRun, validateCatalog } from "./validate";

// Solo contadores en consola: los logs de GitHub Actions son públicos en repos públicos
// y los costos del proveedor no deben aparecer ahí.
function log(event: string, data: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...data }));
}

const safeMessage = (e: unknown): string => (e instanceof Error ? e.message : String(e)).slice(0, 1000);

interface TxResult {
  plan: SyncPlan;
  // linked: number;
}

class DryRunComplete extends Error {
  result: TxResult;
  constructor(result: TxResult) {
    super("dry-run");
    this.name = "DryRunComplete";
    this.result = result;
  }
}

async function main(): Promise<number> {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run") || process.env.SYNC_DRY_RUN === "true";
  const allowManyInserts = args.has("--allow-many-inserts");
  const cfg = loadConfig();
  const prisma = new PrismaClient({ datasourceUrl: cfg.directUrl });
  const t0 = Date.now();
  let runId: string | null = null;
  let received = 0;
  let validated = 0;

  try {
    await markStaleRuns(prisma);
    runId = await startRun(prisma, dryRun);
    log("sync.start", { runId, dryRun });

    const rows = await fetchCatalog(cfg);
    received = rows.length;
    const validation = validateCatalog(rows, cfg);
    validated = validation.products.length;
    if (validation.abortReasons.length > 0) throw new SyncAbortError(validation.abortReasons);

    let outcome: TxResult;
    try {
      outcome = await runLocked(prisma, cfg.txTimeoutMs, async (tx) => {
        const existing = await loadExisting(tx);
        const takenNames = await loadNameKeys(tx);
        const lastReceived = await getLastSuccessfulReceived(tx);

        const plan = buildPlan(validation.products, validation.quarantinedIds, existing, takenNames);
        const inStockLinked = [...existing.values()].filter((p) => p.inStock && !p.deleted).length;
        const reasons = [
          checkCountVsLastRun(received, lastReceived, cfg),
          checkAbsentRatio(plan.stats.markedAbsent, inStockLinked, cfg.maxAbsentRatio),
          plan.stats.inserted > cfg.maxInserts && !allowManyInserts
            ? `El plan insertaría ${plan.stats.inserted} productos nuevos (tope ${cfg.maxInserts}). Revisá el vínculo por nombre o usá --allow-many-inserts`
            : null,
        ].filter((r): r is string => r !== null);
        if (reasons.length > 0) throw new SyncAbortError(reasons);

        const result = { plan };
        // En dry run se aborta la transacción a propósito: nada queda escrito (ni el vínculo por nombre).
        if (dryRun) throw new DryRunComplete(result);
        await applyPlan(tx, plan, cfg.batchSize, cfg.providerId);
        return result;
      });
    } catch (e) {
      if (e instanceof DryRunComplete) outcome = e.result;
      else throw e;
    }

    const { plan } = outcome;
    const warnings: string[] = [...validation.invalidSamples.map((s) => `Fila en cuarentena ${s}`)];
    if (plan.skippedInserts.length > 0) {
      warnings.push(`${plan.skippedInserts.length} productos nuevos omitidos por nombre repetido`);
    }
    for (const c of plan.priceChanges) {
      if (c.oldPrice && Math.abs(c.newPrice - c.oldPrice) / c.oldPrice > cfg.priceAlertRatio) {
        warnings.push(`Cambio de precio grande en ${c.providerProductId}: ${c.oldPrice} -> ${c.newPrice}`);
      }
    }

    const s = plan.stats;
    await finishRun(prisma, runId, {
      status: "success",
      durationMs: Date.now() - t0,
      received,
      validated,
      inserted: s.inserted,
      updated: s.updated,
      reactivated: s.reactivated,
      markedOutOfStock: s.markedOutOfStock + s.markedAbsent,
      priceChanges: plan.priceChanges,
      warnings,
      errors: [],
      abortReason: null,
    });
    log("sync.success", { runId, dryRun, received, validated, ...s, warnings: warnings.length });
    if (warnings.length > 0) {
      await notify(cfg.alertWebhookUrl, {
        text: `Sync de catálogo Pritia OK con ${warnings.length} advertencias${dryRun ? " (dry run)" : ""}`,
        warnings: warnings.slice(0, 20),
      });
    }
    return 0;
  } catch (err) {
    const aborted = err instanceof SyncAbortError;
    const reasons = aborted ? err.reasons : [safeMessage(err)];
    log("sync.failed", { runId, aborted, catalogUpdated: false, reasons: reasons.map((r) => r.slice(0, 300)) });
    if (runId) {
      await finishRun(prisma, runId, {
        status: "failed",
        durationMs: Date.now() - t0,
        received,
        validated,
        inserted: 0,
        updated: 0,
        reactivated: 0,
        markedOutOfStock: 0,
        priceChanges: [],
        warnings: [],
        errors: aborted ? [] : reasons,
        abortReason: aborted ? reasons.join(" | ") : null,
      }).catch(() => undefined);
    }
    await notify(cfg.alertWebhookUrl, {
      text: "Sync de catálogo Pritia FALLÓ: el catálogo NO se actualizó",
      reasons,
    });
    return 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (err) => {
    console.error("Error de configuración:", safeMessage(err));
    process.exitCode = 1;
  },
);
