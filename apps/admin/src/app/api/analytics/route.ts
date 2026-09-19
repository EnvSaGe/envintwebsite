import { NextRequest, NextResponse } from 'next/server';
import { db, pageviews, sql } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function dateRangeFilter(days: number) {
  return sql`"created_at" >= NOW() - INTERVAL '${sql.raw(String(days))} days'`;
}

export async function GET(req: NextRequest) {
  // Auth guard — any authenticated EDITOR or SUPER_ADMIN can view analytics
  try {
    await requireRole(['super_admin', 'editor']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = Math.min(parseInt(searchParams.get('days') || '30', 10), 365);


  try {
    const [
      totalViews,
      uniqueVisitors,
      topPages,
      topCountries,
      referrerSources,
      deviceBreakdown,
      aiReferrals,
      aiBotCrawls,
      dailyTrend,
    ] = await Promise.all([
      // Total page views
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type != 'bot'
      `),

      // Unique visitors (distinct hashes per day bucket)
      db.execute(sql`
        SELECT COUNT(DISTINCT visitor_hash) AS count
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type != 'bot'
      `),

      // Top 10 pages by views
      db.execute(sql`
        SELECT 
          path,
          page_title,
          COUNT(*) AS views,
          COUNT(DISTINCT visitor_hash) AS unique_visitors
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type != 'bot'
        GROUP BY path, page_title
        ORDER BY views DESC
        LIMIT 10
      `),

      // Top 10 countries
      db.execute(sql`
        SELECT 
          country,
          COUNT(DISTINCT visitor_hash) AS visitors,
          COUNT(*) AS views
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type != 'bot'
        AND country IS NOT NULL
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT 10
      `),

      // Referrer sources breakdown
      db.execute(sql`
        SELECT 
          referrer_source,
          COUNT(DISTINCT visitor_hash) AS visitors,
          COUNT(*) AS sessions
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type != 'bot'
        GROUP BY referrer_source
        ORDER BY visitors DESC
      `),

      // Device breakdown
      db.execute(sql`
        SELECT 
          device_type,
          COUNT(DISTINCT visitor_hash) AS visitors
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type != 'bot'
        GROUP BY device_type
        ORDER BY visitors DESC
      `),

      // AI search referrals (ChatGPT, Perplexity, Grok, Claude, Gemini, Copilot)
      db.execute(sql`
        SELECT 
          referrer_source,
          COUNT(*) AS sessions,
          COUNT(DISTINCT visitor_hash) AS unique_visitors,
          array_agg(DISTINCT path ORDER BY path) FILTER (WHERE path IS NOT NULL) AS top_pages
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND referrer_source IN ('chatgpt', 'perplexity', 'grok', 'claude', 'gemini', 'copilot')
        GROUP BY referrer_source
        ORDER BY sessions DESC
      `),

      // AI bot crawls (GPTBot, PerplexityBot etc.) — what AI is reading
      db.execute(sql`
        SELECT 
          bot_agent,
          COUNT(*) AS crawl_hits,
          COUNT(DISTINCT path) AS pages_crawled,
          MAX(created_at) AS last_seen
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type = 'bot'
        AND bot_agent IS NOT NULL
        GROUP BY bot_agent
        ORDER BY crawl_hits DESC
      `),

      // Daily trend (last N days, unique visitors per day)
      db.execute(sql`
        SELECT 
          DATE_TRUNC('day', created_at)::date AS date,
          COUNT(DISTINCT visitor_hash) AS unique_visitors,
          COUNT(*) AS page_views
        FROM pageviews
        WHERE ${dateRangeFilter(days)}
        AND device_type != 'bot'
        GROUP BY DATE_TRUNC('day', created_at)::date
        ORDER BY date ASC
      `),
    ]);

    return NextResponse.json({
      summary: {
        totalViews: Number((totalViews.rows[0] as { count: string })?.count ?? 0),
        uniqueVisitors: Number((uniqueVisitors.rows[0] as { count: string })?.count ?? 0),
        days,
      },
      topPages: topPages.rows,
      topCountries: topCountries.rows,
      referrerSources: referrerSources.rows,
      deviceBreakdown: deviceBreakdown.rows,
      aiReferrals: aiReferrals.rows,
      aiBotCrawls: aiBotCrawls.rows,
      dailyTrend: dailyTrend.rows,
    });
  } catch (err) {
    console.error('[analytics api]', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
