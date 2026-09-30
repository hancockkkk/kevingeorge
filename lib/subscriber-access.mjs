import { createHmac } from 'node:crypto';
import { contactPath, contactProperties, getResendConfig, isMember, resendRequest } from './resend-audience.mjs';

// This restores the existing free Apologies unlock; it is not a paid membership login.
const accessUrl = 'https://www.kevingeorge.xyz/?unlock=apologies';

export async function sendSubscriberAccess(email) {
  const from = process.env.BROADCAST_FROM_EMAIL;
  if (!from) throw new Error('Subscriber access sender is not configured.');
  const contact = await resendRequest(contactPath(email), { allow404: true });
  if (!contact || contact.unsubscribed || ['bounced', 'complained', 'unsubscribed'].includes(contactProperties(contact).kg_status)) return;
  if (!(await isMember(email))) return;

  // Repeated requests in this window reuse one delivery across server instances.
  // Hash the address so idempotency keys do not contain subscriber information.
  const key = createHmac('sha256', getResendConfig().apiKey)
    .update(`${email}:${Math.floor(Date.now() / 600000)}`).digest('hex');
  await resendRequest('/emails', {
    method: 'POST',
    idempotencyKey: `apologies-access-${key}`,
    body: {
      from, to: email, reply_to: 'kg@kevingeorge.xyz', subject: 'Your Apologies access link',
      text: `Welcome back.\n\nHear and download Apologies by Kevin George:\n${accessUrl}\n\nYou requested this link on kevingeorge.xyz. If that wasn't you, you can ignore this email.`,
      html: `<p>Welcome back.</p><p>Hear and download <strong>Apologies</strong> by Kevin George.</p><p><a href="${accessUrl}">Listen and download Apologies</a></p><p>You requested this link on kevingeorge.xyz. If that wasn't you, you can ignore this email.</p>`,
    },
  });
}
