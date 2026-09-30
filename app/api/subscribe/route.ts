import { NextResponse } from "next/server";
import {
  emailPattern,
  normalizeEmail,
} from "@/lib/audience";
import { subscribeAndNotify } from "@/lib/subscriber-signup.mjs";

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

    await subscribeAndNotify(email);

    return NextResponse.json({
      message:
        "You're on the list. Check your email for your Apologies link, including Promotions or Spam.",
    });
  } catch (error) {
    console.error("Subscriber signup failed.", error);
    return NextResponse.json(
      {
        error: "We couldn't complete your signup email right now. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}
