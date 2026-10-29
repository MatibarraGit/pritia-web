import { loadConfig } from "./config";
import { fetchCatalog } from "./fetch-source";
import { computeSalePricePesos } from "./money";
import { nameKey } from "./plan";
import { validateCatalog } from "./validate";

// Solo para correr localmente: imprime costos de muestra, no lo uses en CI.
async function main(): Promise<void> {
  const cfg = loadConfig();
  const rows = await fetchCatalog(cfg);
  const v = validateCatalog(rows, cfg);

  const names = new Map<string, number>();
  for (const p of v.products) {
    const k = nameKey(p.name);
    names.set(k, (names.get(k) ?? 0) + 1);
  }
  const costs = v.products.map((p) => p.costPesos);

  console.log({
    recibidas: rows.length,
    muestra: v.products.slice(0,4),
    validas: v.products.length,
    enCuarentena: v.quarantinedIds.size,
    abortaPor: v.abortReasons,
    muestraInvalidas: v.invalidSamples,
    conStock: v.products.filter((p) => p.inStock).length,
    sinStock: v.products.filter((p) => !p.inStock).length,
    nombresRepetidos: [...names.values()].filter((n) => n > 1).length,
    // muestraNombresRepetidos: [...names].filter((n) => n[1] > 1),
    costoMin: Math.min(...costs),
    costoMax: Math.max(...costs),
  });
  console.table(
    v.products.slice(0, 5).map((p) => ({
      id: p.providerProductId,
      nombre: p.name,
      costo: p.costPesos,
      precio: computeSalePricePesos(p.costPesos),
      enStock: p.inStock,
    })),
  );
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});