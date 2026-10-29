import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "../config";
import { fetchCatalog } from "../fetch-source";

const cfg = {
  ...loadConfig({
    SYNC_SOURCE_URL: "http://localhost/fake-source",
    SYNC_SOURCE_APIKEY: "test-key",
    DIRECT_URL: "postgres://test:test@localhost:5432/test",
  }),
  maxAttempts: 3,
};
const noSleep = async () => undefined;

function fakeFetch(responses: Array<() => Response | Promise<Response>>) {
  let calls = 0;
  const impl = (async () => {
    const r = responses[Math.min(calls, responses.length - 1)];
    calls++;
    return r();
  }) as unknown as typeof fetch;
  return { impl, calls: () => calls };
}
const json = (body: unknown, init?: ResponseInit) => new Response(JSON.stringify(body), init);

test("reintenta 503 y 429 y termina bien", async () => {
  const f = fakeFetch([() => json({}, { status: 503 }), () => json({}, { status: 429 }), () => json([{ id: 1 }])]);
  const rows = await fetchCatalog(cfg, { fetchImpl: f.impl, sleep: noSleep });
  assert.equal(rows.length, 1);
  assert.equal(f.calls(), 3);
});

test("no reintenta errores de autenticación", async () => {
  const f = fakeFetch([() => json({}, { status: 401 })]);
  await assert.rejects(fetchCatalog(cfg, { fetchImpl: f.impl, sleep: noSleep }), /HTTP 401/);
  assert.equal(f.calls(), 1);
});

test("agota reintentos y falla", async () => {
  const f = fakeFetch([() => json({}, { status: 500 })]);
  await assert.rejects(fetchCatalog(cfg, { fetchImpl: f.impl, sleep: noSleep }));
  assert.equal(f.calls(), 3);
});

test("error de red se reintenta", async () => {
  let n = 0;
  const impl = (async () => {
    if (n++ === 0) throw new TypeError("fetch failed");
    return json([{ id: 1 }]);
  }) as unknown as typeof fetch;
  const rows = await fetchCatalog(cfg, { fetchImpl: impl, sleep: noSleep });
  assert.equal(rows.length, 1);
});

test("posible truncamiento (tope de filas) falla sin reintentar", async () => {
  const big = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
  const f = fakeFetch([() => json(big)]);
  await assert.rejects(fetchCatalog(cfg, { fetchImpl: f.impl, sleep: noSleep }), /truncamiento/);
  assert.equal(f.calls(), 1);
});

test("Content-Range que indica más filas que las recibidas falla", async () => {
  const f = fakeFetch([() => json([{ id: 1 }], { headers: { "content-range": "0-0/800" } })]);
  await assert.rejects(fetchCatalog(cfg, { fetchImpl: f.impl, sleep: noSleep }), /truncada/);
});

test("respuesta que no es arreglo falla", async () => {
  const f = fakeFetch([() => json({ message: "x" })]);
  await assert.rejects(fetchCatalog(cfg, { fetchImpl: f.impl, sleep: noSleep }), /arreglo/);
})
;