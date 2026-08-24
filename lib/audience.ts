export type Subscriber = {
  email: string;
  status: "active" | "unsubscribed" | "bounced" | "complained";
  created_at: string;
  updated_at: string;
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const consentVersion = "2026-08-24";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("The subscriber list is not configured yet.");
  }

  return { url, serviceRoleKey };
}

export async function getSubscribers() {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/subscribers?select=email,status,created_at,updated_at&status=eq.active&order=created_at.asc`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Could not read the subscriber list.");
  }

  return (await response.json()) as Subscriber[];
}

export async function saveSubscriber(email: string) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const now = new Date().toISOString();
  const response = await fetch(
    `${url}/rest/v1/subscribers?on_conflict=email`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        email,
        email_consent: true,
        consent_version: consentVersion,
        consented_at: now,
        source: "website",
        status: "active",
        updated_at: now,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Could not save your email. Please try again.");
  }

  const subscribers = (await response.json()) as Subscriber[];
  return subscribers[0];
}

export async function updateSubscriberStatus(
  email: string,
  status: Subscriber["status"],
) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email_consent: status === "active",
        status,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Could not update the subscriber status.");
  }
}

export async function syncResendContact(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;

  if (!apiKey || !segmentId) {
    return { synced: false, skipped: true, created: false };
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const contactUrl = `https://api.resend.com/contacts/${encodeURIComponent(email)}`;
  const existingResponse = await fetch(contactUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  let created = false;

  if (existingResponse.status === 404) {
    const createResponse = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    });

    if (!createResponse.ok) {
      throw new Error("Could not sync the subscriber with the email list.");
    }

    created = true;
  } else if (existingResponse.ok) {
    const updateResponse = await fetch(
      contactUrl,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ unsubscribed: false }),
      },
    );

    if (!updateResponse.ok) {
      throw new Error("Could not sync the subscriber with the email list.");
    }
  } else {
    throw new Error("Could not check the email list for this subscriber.");
  }

  const segmentResponse = await fetch(
    `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${segmentId}`,
    {
      method: "POST",
      headers,
    },
  );

  if (!segmentResponse.ok && segmentResponse.status !== 409) {
    throw new Error("Could not add the subscriber to the email segment.");
  }

  return {
    synced: true,
    skipped: false,
    created,
  };
}

export async function triggerWelcomeAutomation(email: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { triggered: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/events/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: "kevin_george.subscribed",
      email,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not trigger the welcome email.");
  }

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
