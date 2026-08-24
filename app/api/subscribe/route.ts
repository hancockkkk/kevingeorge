import { NextResponse } from "next/server";
import {
  emailPattern,
  normalizeEmail,
  saveSubscriber,
  syncResendContact,
  triggerWelcomeAutomation,
} from "@/lib/audience";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(
      typeof body?.email === "string" ? body.email : "",
    );
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    await saveSubscriber(email);

    try {
      const contact = await syncResendContact(email);
      if (contact.created) {
        await triggerWelcomeAutomation(email);
      }
    } catch (error) {
      console.error("Resend subscriber workflow failed.", error);
    }

    return NextResponse.json({
      message:
        "You are in. Kevin George will send the next move straight to you.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not join the list. Please try again.",
      },
      { status: 500 },
    );
  }
}
