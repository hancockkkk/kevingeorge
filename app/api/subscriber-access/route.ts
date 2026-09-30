import { NextResponse } from 'next/server';
import { emailPattern, normalizeEmail } from '@/lib/audience';
import { sendSubscriberAccess } from '@/lib/subscriber-access.mjs';

export async function POST(request: Request) {
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  const email = normalizeEmail(typeof body?.email === 'string' ? body.email : '');
  if (email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  try {
    await sendSubscriberAccess(email);
    // Do not expose whether an address belongs to the mailing list.
    return NextResponse.json({ message: 'If you are on the list, an access link is on its way.' });
  } catch {
    console.error('Subscriber access email could not be sent.');
    return NextResponse.json({ error: 'We could not send your access link right now. Please try again shortly.' }, { status: 503 });
  }
}
