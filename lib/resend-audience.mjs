// All mailing-list operations are scoped to the Kevin George segment.
export const consentVersion = "2026-08-24";
export const propertyKeys = ["kg_status", "kg_email_consent", "kg_consent_version", "kg_consented_at", "kg_source", "kg_created_at", "kg_updated_at"];

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!apiKey || !segmentId) throw new Error("Resend subscriber configuration is missing.");
  return { apiKey, segmentId };
}

export async function resendRequest(path, { method = "GET", body, allow404 = false, allow409 = false } = {}) {
  const { apiKey } = getResendConfig();
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`https://api.resend.com${path}`, {
      method,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (allow404 && response.status === 404) return null;
    if (allow409 && response.status === 409) return null;
    if (response.status === 429 && attempt < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      continue;
    }
    // Do not log contact payloads, addresses, or credentials.
    if (!response.ok) throw new Error(`Resend ${method} failed (${response.status}).`);
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
}

export async function listAll(path) {
  const rows = [];
  let after;
  do {
    const query = new URLSearchParams({ limit: "100", ...(after ? { after } : {}) });
    const page = await resendRequest(`${path}?${query}`);
    if (!Array.isArray(page?.data)) throw new Error("Invalid Resend list response.");
    rows.push(...page.data);
    if (!page.has_more) return rows;
    const next = page.data.at(-1)?.id;
    if (!next || next === after) throw new Error("Invalid Resend pagination.");
    after = next;
  } while (true);
}

export const contactPath = email => `/contacts/${encodeURIComponent(email)}`;

export async function isMember(email) {
  const { segmentId } = getResendConfig();
  return (await listAll(`${contactPath(email)}/segments`)).some(segment => segment.id === segmentId);
}

export async function setMembership(email, active) {
  const { segmentId } = getResendConfig();
  await resendRequest(`${contactPath(email)}/segments/${encodeURIComponent(segmentId)}`, {
    method: active ? "POST" : "DELETE", allow404: !active, allow409: active,
  });
}

export async function getSubscribers() {
  const { segmentId } = getResendConfig();
  const contacts = await listAll(`/segments/${encodeURIComponent(segmentId)}/contacts`);
  return contacts.filter(contact => !contact.unsubscribed).map(contact => ({
    email: contact.email, status: "active", created_at: contact.created_at, updated_at: contact.created_at,
  }));
}

export async function saveSubscriber(email) {
  const { segmentId } = getResendConfig();
  const existing = await resendRequest(contactPath(email), { allow404: true });
  const now = new Date().toISOString();
  const previous = existing?.properties ?? {};
  // A public form must not reactivate a globally unsubscribed or suppressed contact.
  const blocked = existing?.unsubscribed || ["bounced", "complained", "unsubscribed"].includes(previous.kg_status);
  const status = blocked ? (previous.kg_status && previous.kg_status !== "active" ? previous.kg_status : "unsubscribed") : "active";
  const properties = {
    kg_status: status,
    kg_email_consent: "true",
    kg_consent_version: consentVersion,
    kg_consented_at: now,
    kg_source: "website",
    kg_created_at: previous.kg_created_at || now,
    kg_updated_at: now,
  };
  let created = false;
  if (!existing) {
    await resendRequest("/contacts", { method: "POST", body: {
      email, unsubscribed: false, properties, segments: [{ id: segmentId }],
    } });
    created = true;
  } else {
    const member = await isMember(email);
    await resendRequest(contactPath(email), { method: "PATCH", body: { properties } });
    if (!blocked) await setMembership(email, true);
    else if (member) await setMembership(email, false);
    created = !member && !previous.kg_created_at && !blocked;
  }
  return { created };
}

export async function updateSubscriberStatus(email, status) {
  // Native contact.updated events already represent the source of truth.
  // Writing them back would create a webhook feedback loop.
  if (!["bounced", "complained"].includes(status)) return;
  const existing = await resendRequest(contactPath(email), { allow404: true });
  if (!existing || !(await isMember(email))) return;
  // Remove only this brand's membership; never change another segment or global preference.
  await setMembership(email, false);
  await resendRequest(contactPath(email), { method: "PATCH", body: { properties: {
    kg_status: status, kg_updated_at: new Date().toISOString(),
  } } });
}

export async function ensureContactProperties() {
  const existing = await listAll("/contact-properties");
  for (const key of propertyKeys) {
    const property = existing.find(property => property.key === key);
    if (property && property.type !== "string") throw new Error(`Incompatible property: ${key}`);
    if (!property) await resendRequest("/contact-properties", { method: "POST", body: { key, type: "string", fallback_value: "" } });
  }
}

// Used only by the explicit one-time migration, never by a signup request.
export async function migrateSubscriber(row) {
  const email = row.email.trim().toLowerCase();
  const existing = await resendRequest(contactPath(email), { allow404: true });
  const previous = existing?.properties ?? {};
  // Re-running the import must not overwrite newer direct signups or opt-outs.
  if (previous.kg_updated_at && Date.parse(previous.kg_updated_at) >= Date.parse(row.updated_at)) return;
  const status = existing?.unsubscribed ? "unsubscribed" : row.status !== "active" ? row.status : row.email_consent === false ? "unsubscribed" : "active";
  const active = status === "active";
  const properties = {
    kg_status: status, kg_email_consent: String(row.email_consent === true), kg_consent_version: row.consent_version || "",
    kg_consented_at: row.consented_at || "", kg_source: row.source || "website",
    kg_created_at: row.created_at || "", kg_updated_at: row.updated_at || row.created_at || "",
  };
  if (!existing) {
    await resendRequest("/contacts", { method: "POST", body: {
      email, unsubscribed: !active, properties,
      ...(active ? { segments: [{ id: getResendConfig().segmentId }] } : {}),
    } });
  } else {
    await resendRequest(contactPath(email), { method: "PATCH", body: { properties } });
    await setMembership(email, active);
  }
  const saved = await resendRequest(contactPath(email));
  if (!saved?.properties || Object.entries(properties).some(([key, value]) => saved.properties[key] !== value)) {
    throw new Error("Migrated contact verification failed.");
  }
  if (await isMember(email) !== active) throw new Error("Migrated membership verification failed.");
}
