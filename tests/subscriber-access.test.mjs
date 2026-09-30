import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { sendSubscriberAccess } from '../lib/subscriber-access.mjs';

const originalFetch = globalThis.fetch;
process.env.RESEND_API_KEY = 'test-key';
process.env.RESEND_SEGMENT_ID = 'kg-segment';
process.env.BROADCAST_FROM_EMAIL = 'Kevin George <music@example.com>';
afterEach(() => { globalThis.fetch = originalFetch; });

function mock({ missing = false, unsubscribed = false, status = 'active', member = true, mailFailure = false } = {}) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    const path = new URL(url).pathname;
    calls.push({ path, ...options });
    if (path === '/emails') return new Response(JSON.stringify({ id: 'sent' }), { status: mailFailure ? 500 : 200 });
    if (path.endsWith('/segments')) return Response.json({ data: member ? [{ id: 'kg-segment' }] : [], has_more: false });
    return new Response(JSON.stringify({ unsubscribed, properties: { kg_status: { value: status } } }), { status: missing ? 404 : 200 });
  };
  return calls;
}

test('existing KG subscriber receives access without resubscribing or welcome events', async () => {
  const calls = mock();
  await sendSubscriberAccess('fan@example.com');
  const mail = calls.find(call => call.path === '/emails');
  assert.equal(JSON.parse(mail.body).to, 'fan@example.com');
  assert.match(JSON.parse(mail.body).text, /https:\/\/www.kevingeorge.xyz\/\?unlock=apologies/);
  assert.match(mail.headers['Idempotency-Key'], /^apologies-access-[a-f0-9]{64}$/);
  assert.ok(calls.every(call => call.method === 'GET' || call.path === '/emails'));
});

for (const [name, config] of Object.entries({ unknown: { missing: true }, otherBrand: { member: false }, unsubscribed: { unsubscribed: true }, bounced: { status: 'bounced' }, complained: { status: 'complained' } })) {
  test(`${name} receives no email and no membership changes`, async () => {
    const calls = mock(config);
    await sendSubscriberAccess('fan@example.com');
    assert.ok(calls.every(call => call.method === 'GET'));
  });
}

test('delivery failure is surfaced for a retry', async () => {
  mock({ mailFailure: true });
  await assert.rejects(sendSubscriberAccess('fan@example.com'), /500/);
});

test('repeat access requests in the same time window use the same delivery key', async () => {
  const calls = mock();
  const originalNow = Date.now;
  Date.now = () => 1800000000000;
  try {
    await sendSubscriberAccess('fan@example.com');
    await sendSubscriberAccess('fan@example.com');
    const keys = calls.filter(call => call.path === '/emails').map(call => call.headers['Idempotency-Key']);
    assert.equal(keys[0], keys[1]);
  } finally { Date.now = originalNow; }
});
