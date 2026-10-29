// purchase_price y sell_price son Int en pesos: todo el cálculo es en pesos enteros.
const MARGIN_PERCENT = 25;
const STEP_PESOS = 500;
const MIN_PROFIT_PESOS = 9000;

/** Acepta number o string con hasta 2 decimales (como viene del proveedor). Devuelve centavos o null. */
export function parseCents(value: unknown): number | null {
  let text: string;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    text = String(value);
  } else if (typeof value === "string") {
    text = value.trim();
  } else {
    return null;
  }
  const m = /^(\d{1,10})(?:\.(\d{1,2}))?$/.exec(text);
  if (!m) return null;
  const cents = Number(m[1]) * 100 + Number((m[2] ?? "").padEnd(2, "0"));
  return cents > 0 ? cents : null;
}

export function ceilDiv(n: number, d: number): number {
  const r = n % d;
  return (n - r) / d + (r === 0 ? 0 : 1);
}

/** Costo guardado en purchase_price: se redondea hacia arriba al peso (criterio conservador). */
export function centsToPesosCeil(cents: number): number {
  return ceilDiv(cents, 100);
}

/**
 * precio_base = costo / 0.75, redondeado hacia arriba al siguiente múltiplo de ARS 500.
 * Aritmética entera exacta: ceil(costo*100 / (75*500)) * 500.
 */
export function computeSalePricePesos(costPesos: number): number {
  if (!costPesos) throw new RangeError("El producto no trae costo");
  if (!Number.isSafeInteger(costPesos) || costPesos <= 0) {
    throw new RangeError("Costo inválido para calcular precio");
  }
  const priceByMargin = ceilDiv(costPesos * 100, (100 - MARGIN_PERCENT) * STEP_PESOS) * STEP_PESOS;
  const priceByMinProfit = ceilDiv(costPesos + MIN_PROFIT_PESOS, STEP_PESOS) * STEP_PESOS;
  const price = Math.max(priceByMargin, priceByMinProfit);

  // Invariantes: el redondeo nunca puede bajar el margen del 25% ni la ganancia mínima.
  if (price * (100 - MARGIN_PERCENT) < costPesos * 100) {
    throw new Error("Violación de margen mínimo (bug en el cálculo)");
  }
  if (price - costPesos < MIN_PROFIT_PESOS) {
    throw new Error("Violación de ganancia mínima (bug en el cálculo)");
  }
  return price;
}