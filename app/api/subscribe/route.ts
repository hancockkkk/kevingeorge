import { NextResponse } from "next/server";
import {
  emailPattern,
  normalizeEmail,
  normalizeUsPhone,
  saveSubscriber,
} from "@/lib/audience";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(
      typeof body?.email === "string" ? body.email : "",
    );
    const phone = normalizeUsPhone(
      typeof body?.phone === "string" ? body.phone : "",
    );

    if (!phone) {
      return NextResponse.json(
        { error: "Enter a valid US phone number." },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    await saveSubscriber(email, phone);

    return NextResponse.json({
      message:
        "You are in. KevinWrites will send the next move straight to you.",
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
