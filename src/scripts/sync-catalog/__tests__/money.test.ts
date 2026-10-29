import assert from "node:assert/strict";
import test from "node:test";
import { centsToPesosCeil, computeSalePricePesos, parseCents } from "../money";

test("ejemplo del documento: costo 80.000 -> 107.000", () => {
  assert.equal(computeSalePricePesos(80000), 107000);
});

test("un múltiplo exacto no sube de más: costo 75.000 -> 100.000", () => {
  assert.equal(computeSalePricePesos(75000), 100000);
});

test("el redondeo nunca baja del 25% de margen y siempre es múltiplo de 500", () => {
  for (let c = 1000; c <= 400000; c += 7) {
    const p = computeSalePricePesos(c);
    assert.ok(p * 75 >= c * 100, `margen insuficiente para ${c}`);
    assert.equal(p % 500, 0);
  }
});

test("parseCents acepta válidos y rechaza inválidos", () => {
  assert.equal(parseCents(80000), 8_000_000);
  assert.equal(parseCents("1234.5"), 123_450);
  assert.equal(parseCents(" 10.99 "), 1099);
  for (const bad of [0, -5, "abc", "", null, undefined, NaN, Infinity, "1.234", "1,5", {}]) {
    assert.equal(parseCents(bad), null, `debería rechazar ${String(bad)}`);
  }
});

test("el costo se redondea hacia arriba al peso", () => {
  assert.equal(centsToPesosCeil(8_000_000), 80000);
  assert.equal(centsToPesosCeil(8_000_001), 80001);
});

test("computeSalePricePesos lanza con costo inválido", () => {
  assert.throws(() => computeSalePricePesos(0));
  assert.throws(() => computeSalePricePesos(-1));
  assert.throws(() => computeSalePricePesos(1.5));
});