import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type Subscriber = {
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const subscribersPath = path.join(dataDirectory, "subscribers.json");

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeUsPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const withoutCountryCode =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (withoutCountryCode.length !== 10) {
    return "";
  }

  return `+1${withoutCountryCode}`;
}

export async function getSubscribers() {
  try {
    const subscribers = JSON.parse(await readFile(subscribersPath, "utf8"));
    return Array.isArray(subscribers) ? (subscribers as Subscriber[]) : [];
  } catch {
    return [];
  }
}

export async function saveSubscriber(email: string, phone: string) {
  await mkdir(dataDirectory, { recursive: true });

  const subscribers = await getSubscribers();
  const now = new Date().toISOString();
  const existing = subscribers.find(
    (subscriber) => subscriber.email === email || subscriber.phone === phone,
  );
  const withoutDuplicate = subscribers.filter(
    (subscriber) => subscriber.email !== email && subscriber.phone !== phone,
  );

  const subscriber: Subscriber = {
    email,
    phone,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await writeFile(
    subscribersPath,
    JSON.stringify([...withoutDuplicate, subscriber], null, 2),
  );

  return subscriber;
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

export async function sendSms({ to, body }: { to: string; body: string }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { sent: false, skipped: true };
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: to,
        Body: body,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`SMS failed for ${to}.`);
  }

  return { sent: true, skipped: false };
}
