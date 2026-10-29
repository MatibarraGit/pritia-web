import assert from "node:assert/strict";
import test from "node:test";
import { checkAbsentRatio, checkCountVsLastRun, validateCatalog } from "../validate";

const lim = { maxInvalidRatio: 0.5 };
const row = (id: number | undefined, over: Record<string, unknown> = {}) => ({
  id,
  nombre: `Producto ${id}`,
  marca: "Marca",
  modelo: "X1",
  categoria: "tostadoras",
  precio: 1500,
  precio_a_confirmar: false,
  disponible: true,
  oculto: false,
  stock: null,
  ...over,
});
const good = [row(1), row(2, { precio: "2000.50" }), row(3, { precio: 3000 })];

test("catálogo válido", () => {
  const r = validateCatalog(good, lim);
  assert.equal(r.products.length, 3);
  assert.deepEqual(r.abortReasons, []);
  assert.equal(r.products[1].costPesos, 2001); // 2000.50 -> hacia arriba
});

test("el nombre se compone con marca y modelo (como el producto real)", () => {
  const r = validateCatalog([row(363, { nombre: "SANDWICHERA 3 EN 1", marca: "Ultracomb ", modelo: "Sw2801", precio: 38400 })], lim);
  assert.equal(r.products[0].name, "SANDWICHERA 3 EN 1 Ultracomb Sw2801");
});

test("no repite marca/modelo que ya están en el nombre", () => {
  const r = validateCatalog([row(1, { nombre: "Tostadora Ultracomb SW2801", marca: "Ultracomb", modelo: "Sw2801" })], lim);
  assert.equal(r.products[0].name, "Tostadora Ultracomb SW2801");
});

test("disponible=false u oculto=true => sin stock", () => {
  const r = validateCatalog([row(1, { disponible: false }), row(2, { oculto: true }), row(3)], lim);
  assert.deepEqual(r.products.map((p) => p.inStock), [false, false, true]);
});

test("precio a confirmar: se saltea y NO cuenta como fila inválida", () => {
  const r = validateCatalog([row(1), row(2), row(3, { precio_a_confirmar: true, precio: null })], { maxInvalidRatio: 0.02 });
  assert.deepEqual(r.abortReasons, []);
  assert.ok(r.quarantinedIds.has("3"));
  assert.equal(r.products.length, 2);
});

test("respuesta vacía o que no es arreglo aborta", () => {
  assert.equal(validateCatalog([], lim).abortReasons.length, 1);
  assert.equal(validateCatalog({ data: [] }, lim).abortReasons.length, 1);
});

test("IDs duplicados abortan", () => {
  const r = validateCatalog([...good, row(1, { nombre: "Otro" })], lim);
  assert.ok(r.abortReasons.some((x) => x.includes("duplicados")));
});

test("fila sin ID aborta", () => {
  const r = validateCatalog([...good, row(undefined)], lim);
  assert.ok(r.abortReasons.some((x) => x.includes("sin ID")));
});

test("precio inválido, menor a 1000 o nombre largo van a cuarentena sin abortar", () => {
  const many = [...good, ...Array.from({ length: 6 }, (_, i) => row(20 + i, { precio: 4000 }))];
  const r = validateCatalog(
    [
      ...many,
      row(9, { precio: -5 }),
      row(10, { precio: 999 }),
      row(11, { nombre: "x".repeat(256) }),
    ],
    lim,
  );
  assert.deepEqual(r.abortReasons, []);
  for (const id of ["9", "10", "11"]) assert.ok(r.quarantinedIds.has(id));
  assert.equal(r.products.length, many.length);
});

test("disponibilidad inválida cuenta como fila inválida", () => {
  const r = validateCatalog([row(1), row(2, { disponible: "si" })], { maxInvalidRatio: 0.1 });
  assert.ok(r.abortReasons.some((x) => x.includes("inválidas")));
});

test("demasiadas filas inválidas abortan", () => {
  const r = validateCatalog([row(1), row(2, { nombre: "" , marca: "", modelo: "" }), row(3, { precio: "x" })], lim);
  assert.ok(r.abortReasons.some((x) => x.includes("inválidas")));
});

test("cantidad por debajo del umbral vs última ejecución", () => {
  const l = { minCountRatio: 0.85, maxCountRatio: 1.5 };
  assert.ok(checkCountVsLastRun(300, 800, l));
  assert.ok(checkCountVsLastRun(1500, 800, l));
  assert.equal(checkCountVsLastRun(790, 800, l), null);
  assert.equal(checkCountVsLastRun(10, null, l), null);
});

test("ausentes excesivos abortan", () => {
  assert.ok(checkAbsentRatio(200, 800, 0.15));
  assert.equal(checkAbsentRatio(20, 800, 0.15), null);
});