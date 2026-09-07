export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Please join from this website.' }, { status: 403 });
  }
  if (Number(request.headers.get('content-length') || 0) > 2048) {
    return Response.json({ error: 'Request is too large.' }, { status: 413 });
  }
  let email: unknown;
  try { const body: unknown = await request.json(); email = body && typeof body === 'object' && 'email' in body ? body.email : undefined; }
  catch { return Response.json({ error: 'Enter a valid email address.' }, { status: 400 }); }
  if (typeof email !== 'string' || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  try {
    // Keep the artist's existing mailing-list provider and welcome-email flow.
    const upstream = await fetch('https://www.kevingeorge.xyz/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
      signal: AbortSignal.timeout(12000),
    });
    const data = await upstream.json() as { message?: unknown; error?: unknown };
    if (!upstream.ok) {
      return Response.json({ error: typeof data.error === 'string' ? data.error : 'Could not join the list. Please try again.' }, { status: upstream.status === 429 ? 429 : 502 });
    }
    return Response.json({ message: typeof data.message === 'string' ? data.message : 'You’re on the list. The full song is yours.' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'The list is unavailable for a moment. Please try again shortly.' }, { status: 502 });
  }
}
