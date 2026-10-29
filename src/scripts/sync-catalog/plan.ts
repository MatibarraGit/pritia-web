import { computeSalePricePesos } from "./money";
import type { ExistingProduct, PlannedRow, SourceProduct, SyncPlan, Group } from "./types";

export function nameKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/** Mismo nombre normalizado + mismo costo => un solo producto con las imágenes de todos. */
function groupDuplicates(
  source: readonly SourceProduct[],
  existing: ReadonlyMap<string, ExistingProduct>,
): Group[] {
  const groups = new Map<string, Group>();
  for (const p of source) {
    const key = `${nameKey(p.name)}|${p.costPesos}`;
    const g = groups.get(key);
    if (!g) {
      groups.set(key, {
        product: { ...p, imageUrls: [...p.imageUrls] },
        memberIds: [p.providerProductId],
      });
      continue;
    }
    g.memberIds.push(p.providerProductId);
    const cur = existing.get(g.product.providerProductId);
    const cand = existing.get(p.providerProductId);
    // El representante es el que ya está vinculado en la base (y no borrado), si lo hay.
    const base = (!cur || cur.deleted) && cand && !cand.deleted ? p : g.product;
    g.product = {
      ...base,
      inStock: g.product.inStock || p.inStock,
      imageUrls: [...new Set([...g.product.imageUrls, ...p.imageUrls])],
    };
  }
  return [...groups.values()];
}

/** Función pura: no toca la base. */
export function buildPlan(
  source: readonly SourceProduct[],
  quarantinedIds: ReadonlySet<string>,
  existing: ReadonlyMap<string, ExistingProduct>,
  takenNameKeys: ReadonlySet<string>,
): SyncPlan {
  const plan: SyncPlan = {
    inserts: [],
    updates: [],
    markOutOfStockIds: [],
    priceChanges: [],
    skippedInserts: [],
    stats: {
      inserted: 0,
      updated: 0,
      unchanged: 0,
      reactivated: 0,
      markedOutOfStock: 0,
      markedAbsent: 0,
      priceChanges: 0,
      skippedDeleted: 0,
    },
  };
  const seen = new Set<string>();
  const newNameKeys = new Set<string>();

  for (const { product: p, memberIds } of groupDuplicates(source, existing)) {
    for (const id of memberIds) seen.add(id);
    const pricePesos = computeSalePricePesos(p.costPesos);
    const row: PlannedRow = {
      providerProductId: p.providerProductId,
      name: p.name,
      costPesos: p.costPesos,
      pricePesos,
      inStock: p.inStock,
      description: p.description,
      imageUrls: p.imageUrls,
    };
    const prev = existing.get(p.providerProductId);

    if (!prev) {
      const key = nameKey(p.name);
      if (takenNameKeys.has(key) || newNameKeys.has(key)) {
        plan.skippedInserts.push({
          providerProductId: p.providerProductId,
          reason: "ya existe un producto con ese nombre",
        });
        continue;
      }
      newNameKeys.add(key);
      plan.inserts.push(row);
      plan.stats.inserted++;
      continue;
    }

    // Borrado lógico en Pritia: ni se actualiza ni se vuelve a insertar.
    if (prev.deleted) {
      plan.stats.skippedDeleted!++;
      continue;
    }

    const newImages = p.imageUrls.filter((u) => !prev.images.includes(u));

    if (
      prev.costPesos === p.costPesos &&
      prev.pricePesos === pricePesos &&
      prev.inStock === p.inStock &&
      newImages.length === 0
    ) {
      plan.stats.unchanged++;
      continue;
    }

    plan.updates.push(row);
    plan.stats.updated++;
    if (prev.pricePesos !== pricePesos) {
      plan.priceChanges.push({
        providerProductId: p.providerProductId,
        oldPrice: prev.pricePesos,
        newPrice: pricePesos,
      });
      plan.stats.priceChanges++;
    }
    if (!prev.inStock && p.inStock) plan.stats.reactivated++;
    if (prev.inStock && !p.inStock) plan.stats.markedOutOfStock++;
  }

  // Ausentes: solo se llega acá con una extracción ya validada como completa.
  for (const prev of existing.values()) {
    if (prev.deleted) continue;
    if (seen.has(prev.providerProductId) || quarantinedIds.has(prev.providerProductId)) continue;
    if (prev.inStock) {
      plan.markOutOfStockIds.push(prev.providerProductId);
      plan.stats.markedAbsent++;
    }
  }
  return plan;
}