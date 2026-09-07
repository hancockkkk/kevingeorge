import { NextResponse } from "next/server";
import { getSubscribers, sendEmail } from "@/lib/audience";

export async function POST(request: Request) {
  const expectedToken = process.env.ADMIN_BROADCAST_TOKEN;
  const providedToken = request.headers.get("x-broadcast-token");

  if (!expectedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const subject =
      typeof body?.subject === "string" ? body.subject.trim() : "";
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    const link = typeof body?.link === "string" ? body.link.trim() : "";

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 },
      );
    }

    const subscribers = await getSubscribers();
    let emailsSent = 0;
    let emailsSkipped = 0;

    const textBody = [message, link].filter(Boolean).join("\n");
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
        <p>${message.replace(/\n/g, "<br />")}</p>
        ${link ? `<p><a href="${link}">${link}</a></p>` : ""}
        <p style="font-size:12px;color:#666;">You are receiving this because you joined Kevin George.</p>
      </div>
    `;

    for (const subscriber of subscribers) {
      const emailResult = await sendEmail({
        to: subscriber.email,
        subject,
        html,
        text: textBody,
      });
      emailsSent += emailResult.sent ? 1 : 0;
      emailsSkipped += emailResult.skipped ? 1 : 0;
    }

    return NextResponse.json({
      subscribers: subscribers.length,
      emailsSent,
      emailsSkipped,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not send the broadcast.",
      },
      { status: 500 },
    );
  }
}
