import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { subscribeAndNotify } from '../lib/subscriber-signup.mjs';

const originalFetch = globalThis.fetch;
process.env.RESEND_API_KEY = 'test-key';
process.env.RESEND_SEGMENT_ID = 'kg';
process.env.BROADCAST_FROM_EMAIL = 'Kevin George <music@example.com>';
afterEach(() => { globalThis.fetch = originalFetch; });

function fixture({ existing = false, blocked = false, failEvent = false, failMail = false, otherBrand = false } = {}) {
  let contact = existing ? { unsubscribed: blocked, properties: otherBrand ? {} : { kg_created_at: '2026-08-24' } } : null;
  let member = existing && !otherBrand;
  const calls = [];
  const state = { failEvent, failMail };
  globalThis.fetch = async (url, options) => {
    const path = new URL(url).pathname;
    const body = options.body && JSON.parse(options.body);
    calls.push({ path, method: options.method, body, headers: options.headers });
    if (path === '/events/send') return Response.json({ object: 'event' }, { status: state.failEvent ? 500 : 200 });
    if (path === '/emails') return Response.json({ id: 'email' }, { status: state.failMail ? 500 : 200 });
    if (path.endsWith('/segments/kg')) { member = options.method === 'POST'; return Response.json({}); }
    if (path.endsWith('/segments')) return Response.json({ data: member ? [{ id: 'kg' }] : [], has_more: false });
    if (options.method === 'GET') return Response.json(contact || {}, { status: contact ? 200 : 404 });
    if (path === '/contacts') { contact = body; member = true; }
    else contact.properties = { ...contact.properties, ...body.properties };
    return Response.json({ id: 'contact' });
  };
  return { calls, state, contact: () => contact };
}

test('new signup triggers welcome immediately and records provider acceptance', async () => {
  const f = fixture();
  await subscribeAndNotify('fan@example.com');
  assert.equal(f.calls.filter(c => c.path === '/events/send').length, 1);
  assert.equal(f.contact().properties.kg_welcome_status, 'queued');
  assert.equal(f.calls.filter(c => c.path === '/emails').length, 0);
});

test('failed welcome surfaces an error and a later signup retries the welcome', async () => {
  const f = fixture({ failEvent: true });
  await assert.rejects(subscribeAndNotify('fan@example.com'), /500/);
  assert.equal(f.contact().properties.kg_welcome_status, 'pending');
  f.state.failEvent = false;
  await subscribeAndNotify('fan@example.com');
  assert.equal(f.contact().properties.kg_welcome_status, 'queued');
  assert.equal(f.calls.filter(c => c.path === '/contacts').length, 1);
  assert.equal(f.calls.filter(c => c.path === '/events/send').length, 2);
  assert.equal(f.calls.filter(c => c.path === '/emails').length, 0);
});

test('existing active subscriber receives access instead of being silently skipped', async () => {
  const f = fixture({ existing: true });
  await subscribeAndNotify('fan@example.com');
  assert.equal(f.calls.filter(c => c.path === '/events/send').length, 0);
  assert.equal(f.calls.find(c => c.path === '/emails').body.subject, 'Your Apologies access link');
  assert.equal(f.calls.find(c => c.path === '/emails').body.reply_to, 'kg@kevingeorge.xyz');
});

test('returning subscriber send failure is not reported as success', async () => {
  fixture({ existing: true, failMail: true });
  await assert.rejects(subscribeAndNotify('fan@example.com'), /500/);
});

test('suppressed contact is not sent any email or welcome', async () => {
  const f = fixture({ existing: true, blocked: true });
  await subscribeAndNotify('fan@example.com');
  assert.ok(!f.calls.some(c => ['/events/send', '/emails'].includes(c.path)));
});

test('contact belonging to another brand receives a welcome on first KG signup', async () => {
  const f = fixture({ existing: true, otherBrand: true });
  await subscribeAndNotify('fan@example.com');
  assert.equal(f.calls.filter(c => c.path === '/events/send').length, 1);
  assert.equal(f.contact().properties.kg_welcome_status, 'queued');
});
