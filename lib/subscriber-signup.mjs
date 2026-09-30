import { contactPath, resendRequest, saveSubscriber } from './resend-audience.mjs';
import { sendSubscriberAccess } from './subscriber-access.mjs';

export async function subscribeAndNotify(email) {
  const contact = await saveSubscriber(email);
  // Preserve suppression/opt-out rules without disclosing list membership.
  if (!contact.active) return;

  if (contact.welcomePending) {
    // Persisted pending state survives a failed event request, so a retry can
    // still send the welcome after the contact has already been created.
    await resendRequest('/events/send', {
      method: 'POST',
      body: { event: 'kevin_george.subscribed', email },
    });
    await resendRequest(contactPath(email), {
      method: 'PATCH', body: { properties: { kg_welcome_status: 'queued' } },
    });
  } else {
    // Returning fans still receive the requested song link. This uses the
    // existing provider idempotency key to limit repeated requests.
    await sendSubscriberAccess(email);
  }
}
