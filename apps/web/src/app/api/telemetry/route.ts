import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Known AI crawler user-agent patterns
const AI_BOT_PATTERNS: Record<string, string> = {
  GPTBot: 'GPTBot',
  ChatGPT: 'ChatGPT',
  'Google-Extended': 'Google-Extended',
  PerplexityBot: 'PerplexityBot',
  ClaudeBot: 'ClaudeBot',
  Anthropic: 'Anthropic',
  YouBot: 'YouBot',
  GrokBot: 'GrokBot',
  Applebot: 'Applebot',
  'cohere-ai': 'cohere-ai',
};

// Map referrer hostnames to normalized source names
function classifyReferrer(referrerUrl: string | null): string {
  if (!referrerUrl) return 'direct';
  try {
    const host = new URL(referrerUrl).hostname.toLowerCase().replace('www.', '');
    if (host.includes('chatgpt.com') || host.includes('chat.openai.com')) return 'chatgpt';
    if (host.includes('perplexity.ai')) return 'perplexity';
    if (host.includes('claude.ai')) return 'claude';
    if (host.includes('copilot.microsoft.com') || host.includes('bing.com')) return 'copilot';
    if (host.includes('grok') || host.includes('x.com') || host.includes('twitter.com')) return 'grok';
    if (host.includes('gemini.google.com')) return 'gemini';
    if (host.includes('google.')) return 'google';
    if (host.includes('linkedin.com')) return 'linkedin';
    if (host.includes('instagram.com') || host.includes('facebook.com')) return 'social';
    if (host.includes('twitter.com') || host.includes('t.co')) return 'twitter';
    if (host.includes('envintglobal.com') || host === '') return 'direct';
    return 'other';
  } catch {
    return 'direct';
  }
}

function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' | 'bot' {
  const u = ua.toLowerCase();
  // Check bots first
  for (const pattern of Object.keys(AI_BOT_PATTERNS)) {
    if (ua.includes(pattern)) return 'bot';
  }
  if (/(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|ia_archiver)/i.test(ua)) return 'bot';
  if (/tablet|ipad/i.test(u)) return 'tablet';
  if (/mobile|iphone|android.*mobile|blackberry|windows phone/i.test(u)) return 'mobile';
  return 'desktop';
}

function detectBotAgent(ua: string): string | null {
  for (const [pattern, name] of Object.entries(AI_BOT_PATTERNS)) {
    if (ua.includes(pattern)) return name;
  }
  if (/googlebot/i.test(ua)) return 'Googlebot';
  if (/bingbot/i.test(ua)) return 'Bingbot';
  if (/slurp/i.test(ua)) return 'YahooBot';
  if (/duckduckbot/i.test(ua)) return 'DuckDuckBot';
  return null;
}

function extractGeo(req: NextRequest): { country: string | null; city: string | null } {
  let country = req.headers.get('x-country') || req.headers.get('x-nf-country') || null;
  let city = req.headers.get('x-city') || req.headers.get('x-nf-city') || null;

  if (!country || !city) {
    const nfGeo = req.headers.get('x-nf-geo');
    if (nfGeo) {
      try {
        const parsed = JSON.parse(Buffer.from(nfGeo, 'base64').toString('utf-8'));
        if (!country && parsed.country?.code) country = parsed.country.code;
        if (!city && parsed.city) city = parsed.city;
      } catch {
        // ignore
      }
    }
  }

  return {
    country: country || null,
    city: city ? decodeURIComponent(city) : null,
  };
}

// Anonymized daily hash — rotates at midnight UTC, no PII ever stored
function buildVisitorHash(ip: string, ua: string): string {
  const today = new Date().toISOString().slice(0, 10); // "2026-09-19"
  const salt = process.env.ANALYTICS_SALT || 'envint-analytics-salt-2026';
  return createHash('sha256').update(`${ip}|${ua}|${today}|${salt}`).digest('hex').slice(0, 64);
}

import { db, pageviews, sql } from '@envint/db';

let isTableInitialized = false;

async function ensureTableExists() {
  if (isTableInitialized) return;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "pageviews" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "visitor_hash" varchar(64) NOT NULL,
        "path" varchar(500) NOT NULL,
        "referrer_source" varchar(64) DEFAULT 'direct' NOT NULL,
        "referrer_url" text,
        "country" varchar(2),
        "city" varchar(100),
        "device_type" varchar(20) DEFAULT 'desktop' NOT NULL,
        "bot_agent" varchar(100),
        "page_title" varchar(255),
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_created_at" ON "pageviews" ("created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_visitor_date" ON "pageviews" ("visitor_hash", "created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_referrer_source" ON "pageviews" ("referrer_source")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_path" ON "pageviews" ("path")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_country" ON "pageviews" ("country")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_bot_agent" ON "pageviews" ("bot_agent")`);
    isTableInitialized = true;
  } catch (e) {
    console.error('[ensureTableExists]', e);
  }
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await ensureTableExists();
    const body = await req.json() as { path?: string; title?: string; referrer?: string };
    const path = body.path || '/';
    const pageTitle = body.title || null;
    const referrerUrl = body.referrer || null;

    // Gather request metadata from Netlify / edge headers
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const ua = req.headers.get('user-agent') || '';
    const { country, city } = extractGeo(req);

    const visitorHash = buildVisitorHash(ip, ua);
    const referrerSource = classifyReferrer(referrerUrl);
    const deviceType = detectDevice(ua);
    const botAgent = detectBotAgent(ua);

    await db.insert(pageviews).values({
      visitorHash,
      path,
      referrerSource,
      referrerUrl,
      country,
      city,
      deviceType,
      botAgent,
      pageTitle,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    // Fail silently — never break the public site for analytics
    console.error('[telemetry]', err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

// Handle AI bot crawls via GET (when bots fetch the page, not POST)
export async function GET(req: NextRequest) {
  const path = new URL(req.url).searchParams.get('path') || '/';
  const ua = req.headers.get('user-agent') || '';
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { country, city } = extractGeo(req);

  const botAgent = detectBotAgent(ua);
  if (!botAgent) return NextResponse.json({ ok: false }, { status: 204 });

  try {
    await db.insert(pageviews).values({
      visitorHash: buildVisitorHash(ip, ua),
      path,
      referrerSource: 'bot',
      referrerUrl: null,
      country,
      city,
      deviceType: 'bot',
      botAgent,
      pageTitle: null,
    });
  } catch {
    // silent
  }

  return NextResponse.json({ ok: true });
}
