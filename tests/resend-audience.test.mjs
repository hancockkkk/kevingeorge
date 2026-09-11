import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { saveSubscriber, getSubscribers, updateSubscriberStatus, migrateSubscriber } from "../lib/resend-audience.mjs";

const originalFetch = globalThis.fetch;
process.env.RESEND_API_KEY = "test-key";
process.env.RESEND_SEGMENT_ID = "kevin-george-only";
afterEach(() => { globalThis.fetch = originalFetch; });

function mock(handler) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).hostname, "api.resend.com");
    const call = { path: new URL(url).pathname, query: new URL(url).searchParams, method: options.method, body: options.body && JSON.parse(options.body) };
    calls.push(call);
    const [status, data] = handler(call, calls.length);
    return new Response(JSON.stringify(data), { status });
  };
  return calls;
}

test("new signup saves consent and KG membership together, without Supabase", async () => {
  const calls = mock(call => call.method === "GET" ? [404, {}] : [200, { id: "new-contact" }]);
  assert.deepEqual(await saveSubscriber("fan@example.com"), { created: true });
  assert.deepEqual(calls[1].body.segments, [{ id: "kevin-george-only" }]);
  assert.equal(calls[1].body.properties.kg_consent_version, "2026-08-24");
  assert.equal(calls[1].body.properties.kg_source, "website");
});

test("failed Resend write cannot report signup success", async () => {
  mock(call => call.method === "GET" ? [404, {}] : [500, {}]);
  await assert.rejects(saveSubscriber("fan@example.com"), /500/);
});

test("existing subscriber is not new and other brand preferences are untouched", async () => {
  const calls = mock(call => call.path.endsWith("/segments") ? [200, { data: [{ id: "kevin-george-only" }, { id: "other-brand" }], has_more: false }] : [200, { unsubscribed: false, properties: { kg_created_at: { value: "2026-08-24", type: "string" } } }]);
  assert.deepEqual(await saveSubscriber("fan@example.com"), { created: false });
  assert.equal(calls.find(c => c.method === "PATCH").body.unsubscribed, undefined);
  assert.ok(calls.filter(c => c.method === "POST").every(c => c.path.endsWith("/kevin-george-only")));
});

test("public signup never reactivates an unsubscribed contact", async () => {
  const calls = mock(call => call.path.endsWith("/segments") ? [200, { data: [], has_more: false }] : [200, { unsubscribed: true, properties: {} }]);
  assert.deepEqual(await saveSubscriber("fan@example.com"), { created: false });
  assert.ok(!calls.some(c => c.method === "POST"));
  assert.equal(calls.find(c => c.method === "PATCH").body.properties.kg_status, "unsubscribed");
});

test("mailing list paginates only KG and excludes unsubscribed contacts", async () => {
  const calls = mock(call => call.query.has("after") ? [200, { data: [{ id: "three", email: "third@example.com", unsubscribed: false }], has_more: false }] : [200, { data: [{ id: "one", email: "first@example.com", unsubscribed: false }, { id: "two", email: "second@example.com", unsubscribed: true }], has_more: true }]);
  assert.deepEqual((await getSubscribers()).map(c => c.email), ["first@example.com", "third@example.com"]);
  assert.ok(calls.every(c => c.path === "/segments/kevin-george-only/contacts"));
  assert.equal(calls[1].query.get("after"), "two");
});

test("contact updates cause no webhook feedback loop; other-brand bounces are untouched", async () => {
  const calls = mock(call => call.path.endsWith("/segments") ? [200, { data: [{ id: "other-brand" }], has_more: false }] : [200, { properties: {} }]);
  await updateSubscriberStatus("fan@example.com", "unsubscribed");
  assert.equal(calls.length, 0);
  await updateSubscriberStatus("fan@example.com", "bounced");
  assert.ok(calls.every(c => c.method === "GET"));
});

test("migration preserves opt-out and consent without sending mail or events", async () => {
  let properties;
  const calls = mock(call => {
    if (call.method === "PATCH") properties = call.body.properties;
    if (call.path.endsWith("/segments")) return [200, { data: [], has_more: false }];
    return [200, { unsubscribed: true, properties: Object.fromEntries(Object.entries(properties ?? {}).map(([key, value]) => [key, { value, type: "string" }])) }];
  });
  await migrateSubscriber({ email: "fan@example.com", email_consent: true, status: "active", consent_version: "original", consented_at: "2026-08-24T10:00:00Z", source: "website", created_at: "2026-08-24T10:00:00Z", updated_at: "2026-08-24T10:00:00Z" });
  assert.equal(properties.kg_status, "unsubscribed");
  assert.equal(properties.kg_consented_at, "2026-08-24T10:00:00Z");
  assert.ok(!calls.some(c => c.path.includes("/emails") || c.path.includes("/events")));
  assert.equal(calls.find(c => c.method === "PATCH").body.unsubscribed, undefined);
});
