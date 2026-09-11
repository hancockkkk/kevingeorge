import { ensureContactProperties, migrateSubscriber } from "../lib/resend-audience.mjs";

// Temporary cutover hook: only the authorized production deployment imports data.
// No emails/events are sent. Source data is read-only and remains available for recovery.
if (process.env.VERCEL_ENV === "production") {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Migration source configuration is missing.");
  await ensureContactProperties();
  let total = 0;
  for (let offset = 0; ; offset += 500) {
    const query = new URLSearchParams({ select: "email,email_consent,consent_version,consented_at,source,status,created_at,updated_at", order: "email.asc", limit: "500", offset: String(offset) });
    const response = await fetch(`${url}/rest/v1/subscribers?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Migration source read failed (${response.status}).`);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error("Invalid migration source response.");
    for (const row of rows) {
      await migrateSubscriber(row);
      total++;
    }
    if (rows.length < 500) break;
  }
  console.log(`Kevin George migration verified: ${total} subscriber records. No emails sent.`);
} else {
  console.log("Subscriber migration skipped outside production.");
}
