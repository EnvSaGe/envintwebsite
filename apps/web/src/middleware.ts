import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known AI crawler user-agent patterns
const AI_BOT_REGEX = /GPTBot|ChatGPT|Google-Extended|PerplexityBot|ClaudeBot|Anthropic|YouBot|GrokBot|Applebot|cohere-ai/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';

  // Intercept AI bot crawlers in the background without affecting their crawl speed
  if (AI_BOT_REGEX.test(ua)) {
    const telemetryUrl = new URL('/api/telemetry/', request.url);
    telemetryUrl.searchParams.set('path', request.nextUrl.pathname);
    fetch(telemetryUrl.toString(), {
      headers: {
        'user-agent': ua,
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-vercel-ip-country': request.headers.get('x-vercel-ip-country') || '',
        'x-vercel-ip-city': request.headers.get('x-vercel-ip-city') || '',
      },
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Intercept all document requests, llms.txt, robots.txt, excluding internal assets and API routes
    '/((?!api/|_next/static|_next/image|favicon.ico|images/|brand/).*)',
  ],
};
