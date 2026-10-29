import { normalizeRow } from "./normalize";
import type { SourceProduct } from "./types";

export interface ValidationResult {
  products: SourceProduct[];
  quarantinedIds: Set<string>;
  invalidSamples: string[];
  abortReasons: string[];
}

export function validateCatalog(raw: unknown, limits: { maxInvalidRatio: number }): ValidationResult {
  const empty = (reason: string): ValidationResult => ({
    products: [],
    quarantinedIds: new Set(),
    invalidSamples: [],
    abortReasons: [reason],
  });
  if (!Array.isArray(raw)) return empty("La respuesta no es un arreglo JSON");
  if (raw.length === 0) return empty("El catálogo recibido está vacío");

  const products: SourceProduct[] = [];
  const quarantinedIds = new Set<string>();
  const seen = new Set<string>();
  const dupes = new Set<string>();
  const invalidSamples: string[] = [];
  let missingId = 0;
  let unexpectedInvalid = 0;

  for (const row of raw) {
    const r = normalizeRow(row);
    const id = r.ok ? r.product.providerProductId : r.providerProductId;
    if (id === null) {
      missingId++;
      continue;
    }
    if (seen.has(id)) dupes.add(id);
    else seen.add(id);

    if (r.ok) {
      products.push(r.product);
    } else {
      quarantinedIds.add(id); // no se toca y NO se considera ausente
      if (!r.expected) {
        unexpectedInvalid++;
        if (invalidSamples.length < 5) invalidSamples.push(`${id}: ${r.reason}`);
      }
    }
  }

  const abortReasons: string[] = [];
  if (missingId > 0) abortReasons.push(`${missingId} filas sin ID válido`);
  if (dupes.size > 0) abortReasons.push(`${dupes.size} IDs duplicados en la respuesta`);
  const invalidCount = unexpectedInvalid + missingId;
  if (invalidCount / raw.length > limits.maxInvalidRatio) {
    abortReasons.push(`Demasiadas filas inválidas: ${invalidCount} de ${raw.length}`);
  }
  return { products, quarantinedIds, invalidSamples, abortReasons };
}

export function checkCountVsLastRun(
  received: number,
  lastReceived: number | null,
  limits: { minCountRatio: number; maxCountRatio: number },
): string | null {
  if (lastReceived === null || lastReceived <= 0) return null; // primera ejecución: sin referencia
  const ratio = received / lastReceived;
  if (ratio < limits.minCountRatio) {
    return `Cantidad por debajo del umbral: ${received} vs ${lastReceived} en la última sync válida`;
  }
  if (ratio > limits.maxCountRatio) {
    return `Cantidad por encima del umbral: ${received} vs ${lastReceived} en la última sync válida`;
  }
  return null;
}

/** Evita que una extracción "aparentemente plausible" pero incompleta desactive medio catálogo. */
export function checkAbsentRatio(markedAbsent: number, inStockLinked: number, maxRatio: number): string | null {
  if (inStockLinked <= 0) return null;
  if (markedAbsent / inStockLinked > maxRatio) {
    return `La sync dejaría sin stock ${markedAbsent} de ${inStockLinked} productos activos`;
  }
  return null;
}