import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/clerk-rbac';
import crypto from 'crypto';

export const runtime = 'nodejs';

const WEB_APP_URL = process.env.WEB_APP_URL || 'http://localhost:3000';

/**
 * POST /api/preview-proxy?slug=/about
 * Forwards the editor's current block state to the web app's preview store
 * (server-to-server, so no CORS issues from the browser).
 */
export async function POST(req: NextRequest) {
  try {
    await requireRole(['super_admin', 'editor']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get('slug') || '/';
  const secret = process.env.DRAFT_PREVIEW_SECRET || '';
  const token = secret ? crypto.createHmac('sha256', secret).update(slug).digest('hex') : '';

  try {
    const body = await req.json();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${WEB_APP_URL}/api/preview-store?slug=${encodeURIComponent(slug)}`, {
      method: 'POST',
      headers,
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
