import { NextRequest, NextResponse } from 'next/server';
import { db, pages, insights, impactCaseStudies, eq, and, sql } from '@envint/db';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * GET /api/cron/publish-scheduled
 *
 * Runs on a schedule (every 5 minutes via vercel.json / netlify.toml).
 * Publishes any content with status=DRAFT and scheduledAt <= now().
 *
 * Secured with a cron secret header.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = req.headers.get('x-cron-secret');

  if (cronSecret && providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  let publishedCount = 0;

  try {
    // 1. Publish scheduled pages
    const scheduledPages = await db.query.pages.findMany({
      where: and(
        eq(pages.status, 'DRAFT'),
        sql`${pages.scheduledAt} IS NOT NULL AND ${pages.scheduledAt} <= ${now}`,
      ),
      columns: { id: true, slug: true },
    });

    for (const p of scheduledPages) {
      await db
        .update(pages)
        .set({ status: 'PUBLISHED', publishedAt: now, updatedAt: now, scheduledAt: null })
        .where(eq(pages.id, p.id));
      publishedCount++;
    }

    // 2. Publish scheduled insights
    const scheduledInsights = await db.query.insights.findMany({
      where: and(
        eq(insights.status, 'DRAFT'),
        sql`${insights.scheduledAt} IS NOT NULL AND ${insights.scheduledAt} <= ${now}`,
      ),
      columns: { id: true, slug: true },
    });

    for (const i of scheduledInsights) {
      await db
        .update(insights)
        .set({ status: 'PUBLISHED', publishedAt: now, updatedAt: now, scheduledAt: null })
        .where(eq(insights.id, i.id));
      publishedCount++;
    }

    // 3. Publish scheduled impact case studies
    const scheduledImpacts = await db.query.impactCaseStudies.findMany({
      where: and(
        eq(impactCaseStudies.status, 'DRAFT'),
        sql`${impactCaseStudies.scheduledAt} IS NOT NULL AND ${impactCaseStudies.scheduledAt} <= ${now}`,
      ),
      columns: { id: true, slug: true },
    });

    for (const imp of scheduledImpacts) {
      await db
        .update(impactCaseStudies)
        .set({ status: 'PUBLISHED', publishedAt: now, updatedAt: now, scheduledAt: null })
        .where(eq(impactCaseStudies.id, imp.id));
      publishedCount++;
    }

    return NextResponse.json({
      success: true,
      publishedCount,
      checkedAt: now.toISOString(),
    });
  } catch (err) {
    console.error('[cron/publish-scheduled] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
