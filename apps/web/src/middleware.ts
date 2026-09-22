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
    const country =
      request.headers.get('x-country') ||
      request.headers.get('x-nf-country') ||
      request.headers.get('x-vercel-ip-country') ||
      '';
    const city =
      request.headers.get('x-city') ||
      request.headers.get('x-nf-city') ||
      request.headers.get('x-vercel-ip-city') ||
      '';
    fetch(telemetryUrl.toString(), {
      headers: {
        'user-agent': ua,
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-country': country,
        'x-city': city,
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
