import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/view-mode?mode=static&redirect=/
 * GET /api/view-mode?mode=cms&redirect=/
 *
 * Allows toggling between the handcrafted static Next.js pages and
 * the CMS dynamic database pages instantly in the browser without
 * touching or deleting any database data.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode') || 'cms';
  const targetRedirect = searchParams.get('redirect') || '/';

  const res = NextResponse.redirect(new URL(targetRedirect, req.url));

  if (mode === 'static') {
    res.cookies.set('force_static', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: 'lax',
    });
  } else {
    res.cookies.delete('force_static');
  }

  return res;
}
