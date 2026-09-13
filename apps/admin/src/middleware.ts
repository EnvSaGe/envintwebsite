import { clerkMiddleware, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/access-denied') ||
    pathname.startsWith('/api/public') ||
    (process.env.NODE_ENV === 'development' && request.nextUrl.searchParams.get('dev_preview') === 'true')
  ) {
    return;
  }

  // 1. Ensure user is authenticated
  const authObj = await auth();
  if (!authObj.userId) {
    return authObj.redirectToSignIn();
  }

  // 2. Fetch fresh user directly from Clerk API (ensures instant reflection of metadata changes)
  const client = await clerkClient();
  const user = await client.users.getUser(authObj.userId);

  const publicMetadata = user.publicMetadata as { role?: string };
  const role = publicMetadata?.role;
  const hasValidRole = role === 'super_admin' || role === 'editor';

  // If user does not have an approved role created by Admin, block them immediately!
  if (!hasValidRole) {
    const accessDeniedUrl = new URL('/access-denied', request.url);
    return NextResponse.redirect(accessDeniedUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes and Clerk auto-proxy
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
