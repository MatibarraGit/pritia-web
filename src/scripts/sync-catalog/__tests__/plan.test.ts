import assert from "node:assert/strict";
import test from "node:test";
import { buildPlan } from "../plan";
import type { ExistingProduct, SourceProduct } from "../types";

const src = (id: string, cost: number, inStock = true, name = `Producto ${id}`): SourceProduct => ({
  providerProductId: id,
  name,
  costPesos: cost,
  inStock,
});
const ex = (id: string, cost: number, price: number | null, inStock: boolean, deleted = false): ExistingProduct => ({
  providerProductId: id,
  costPesos: cost,
  pricePesos: price,
  inStock,
  deleted,
});
const map = (...items: ExistingProduct[]) => new Map(items.map((i) => [i.providerProductId, i]));
const none = new Set<string>();

test("producto nuevo se inserta con precio calculado", () => {
  const p = buildPlan([src("1", 80000)], none, map(), none);
  assert.equal(p.inserts.length, 1);
  assert.equal(p.inserts[0].pricePesos, 107000);
});

test("idempotente: misma fuente, sin cambios", () => {
  const p = buildPlan([src("1", 80000)], none, map(ex("1", 80000, 107000, true)), none);
  assert.equal(p.updates.length + p.inserts.length + p.markOutOfStockIds.length, 0);
  assert.equal(p.stats.unchanged, 1);
});

test("cambio de costo registra precio anterior y nuevo", () => {
  const p = buildPlan([src("1", 90000)], none, map(ex("1", 80000, 107000, true)), none);
  assert.equal(p.priceChanges.length, 1);
  assert.equal(p.priceChanges[0].oldPrice, 107000);
  assert.equal(p.priceChanges[0].newPrice, 120000);
});

test("producto ausente se marca sin stock (no se elimina)", () => {
  const p = buildPlan([], none, map(ex("1", 5000, 7000, true)), none);
  assert.deepEqual(p.markOutOfStockIds, ["1"]);
  assert.equal(p.stats.markedAbsent, 1);
});

test("ausente que ya estaba sin stock no genera escritura", () => {
  const p = buildPlan([], none, map(ex("1", 5000, 7000, false)), none);
  assert.equal(p.markOutOfStockIds.length, 0);
});

test("producto en cuarentena no se considera ausente", () => {
  const p = buildPlan([], new Set(["1"]), map(ex("1", 5000, 7000, true)), none);
  assert.equal(p.markOutOfStockIds.length, 0);
});

test("agotado en la fuente -> in_stock=false", () => {
  const p = buildPlan([src("1", 5000, false)], none, map(ex("1", 5000, 7000, true)), none);
  assert.equal(p.updates[0].inStock, false);
  assert.equal(p.stats.markedOutOfStock, 1);
});

test("reactivado cuando la fuente confirma stock", () => {
  const p = buildPlan([src("1", 5000, true)], none, map(ex("1", 5000, 7000, false)), none);
  assert.equal(p.updates[0].inStock, true);
  assert.equal(p.stats.reactivated, 1);
});

test("no inserta si el nombre ya existe en Pritia o se repite en la fuente", () => {
  const taken = new Set(["producto 1"]);
  const p = buildPlan([src("1", 5000), src("2", 5000, true, "Otro"), src("3", 5000, true, "otro ")], none, map(), taken);
  assert.equal(p.inserts.length, 1);
  assert.equal(p.skippedInserts.length, 2);
});

test("producto borrado lógicamente no se actualiza, reinserta ni marca como ausente", () => {
  const deleted = ex("1", 5000, 7000, true, true);
  const withSource = buildPlan([src("1", 9000, false)], none, map(deleted), none);
  assert.equal(withSource.updates.length + withSource.inserts.length, 0);
  assert.equal(withSource.stats.skippedDeleted, 1);

  const absent = buildPlan([], none, map(deleted), none);
  assert.equal(absent.markOutOfStockIds.length, 0);
});