import { NextResponse } from "next/server";
import { Resend, type WebhookEventPayload } from "resend";
import {
  normalizeEmail,
  updateSubscriberStatus,
  type Subscriber,
} from "@/lib/audience";

function getAffectedSubscribers(event: WebhookEventPayload) {
  const affected = new Map<string, Subscriber["status"]>();

  if (event.type === "contact.updated") {
    affected.set(
      normalizeEmail(event.data.email),
      event.data.unsubscribed ? "unsubscribed" : "active",
    );
  }

  if (event.type === "email.bounced") {
    event.data.to.forEach((email) => {
      affected.set(normalizeEmail(email), "bounced");
    });
  }

  if (event.type === "email.complained") {
    event.data.to.forEach((email) => {
      affected.set(normalizeEmail(email), "complained");
    });
  }

  return affected;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 503 },
    );
  }

  const payload = await request.text();
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return NextResponse.json(
      { error: "Missing webhook signature." },
      { status: 400 },
    );
  }

  let event: WebhookEventPayload;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    event = resend.webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  const affected = getAffectedSubscribers(event);
  await Promise.all(
    Array.from(affected, ([email, status]) =>
      updateSubscriberStatus(email, status),
    ),
  );

  return NextResponse.json({ received: true });
}

