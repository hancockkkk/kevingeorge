import { resendRequest } from "./resend-audience.mjs";

export type Subscriber = {
  email: string;
  status: "active" | "unsubscribed" | "bounced" | "complained";
  created_at: string;
  updated_at: string;
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export { getSubscribers, saveSubscriber, updateSubscriberStatus } from "./resend-audience.mjs";

export async function triggerWelcomeAutomation(email: string) {
  await resendRequest("/events/send", {
    method: "POST",
    body: { event: "kevin_george.subscribed", email },
  });

  return { triggered: true, skipped: false };
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BROADCAST_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return { sent: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email failed for ${to}.`);
  }

  return { sent: true, skipped: false };
}
