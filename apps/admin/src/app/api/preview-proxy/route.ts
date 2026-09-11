import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const WEB_APP_URL = process.env.WEB_APP_URL || 'http://localhost:3000';

/**
 * POST /api/preview-proxy?slug=/about
 * Forwards the editor's current block state to the web app's preview store
 * (server-to-server, so no CORS issues from the browser).
 */
export async function POST(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') || '/';

  try {
    const body = await req.json();
    const res = await fetch(`${WEB_APP_URL}/api/preview-store?slug=${encodeURIComponent(slug)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // Don't wait too long — preview push is best-effort
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Preview store push failed' }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    // Web app may not be running — preview just falls back to the saved page
    return NextResponse.json({ success: false, offline: true });
  }
}
