import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { db, pages, pageRevisions, insights, impactCaseStudies, eq, and, sql } from '@envint/db';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * GET /api/cron/publish-scheduled
 *
 * Runs hourly through the Netlify scheduled function. It still publishes
 * every record due at or before the invocation time.
 * Publishes any content with status=DRAFT (or with a pending scheduledAt)
 * whose scheduledAt <= now().
 *
 * For Schema v2 pages this promotes draftBlocks → publishedBlocks (the tree
 * IS the published content); for insights / case studies it flips status.
 * Every promotion is snapshotted into page_revisions and the public caches
 * are revalidated so the live site picks the content up immediately.
 *
 * Secured with a cron secret header (CRON_SECRET).
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = req.headers.get('x-cron-secret');

  if (!cronSecret || providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  let publishedCount = 0;
  const publishedSlugs: string[] = [];

  try {
    // ─── 1. Publish scheduled pages ────────────────────────────────────
    const scheduledPages = await db.query.pages.findMany({
      where: sql`${pages.scheduledAt} IS NOT NULL AND ${pages.scheduledAt} <= ${now}`,
    });

    for (const p of scheduledPages) {
      const isV2 = (p.schemaVersion ?? 1) === 2;
      const hasDraftTree = Boolean(p.draftBlocks && (p.draftBlocks as any).rootIds);

      const patch: Record<string, unknown> = {
        status: 'PUBLISHED',
        publishedAt: now,
        updatedAt: now,
        scheduledAt: null,
      };

      // The draft tree becomes the published tree — this is the whole point
      // of scheduling for Schema v2 pages.
      if (isV2 && hasDraftTree) {
        patch.publishedBlocks = p.draftBlocks;
      }

      await db.update(pages).set(patch).where(eq(pages.id, p.id));

      // Snapshot the promoted content for audit history / rollback
      await db.insert(pageRevisions).values({
        pageSlug: p.slug,
        contentBlocks: (p.draftBlocks ?? p.contentBlocks ?? []) as any,
        schemaVersion: p.schemaVersion ?? 1,
        isPublishedSnapshot: true,
        status: 'PUBLISHED',
        savedByClerkId: null,
        savedByName: 'Scheduled Publish (Cron)',
        note: `Auto-published by cron at ${now.toISOString()}`,
        savedAt: now,
      });

      // Revalidate public caches for this page
      const cleanSlug = p.slug.startsWith('/') ? p.slug.slice(1) : p.slug;
      revalidateTag(`page:${p.slug}`, 'max');
      revalidateTag(`page:${cleanSlug}`, 'max');
      try {
        revalidatePath(p.slug === '/' ? '/' : p.slug);
      } catch {
        /* path revalidation is best-effort */
      }

      publishedCount++;
      publishedSlugs.push(p.slug);
    }

    // ─── 2. Publish scheduled insights ─────────────────────────────────
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

      revalidateTag(`insight:${i.slug}`, 'max');
      revalidateTag(`record:insight:${i.slug}`, 'max');
      revalidateTag('insights:list', 'max');
      revalidateTag('archive:insight', 'max');
      revalidateTag(`page:/${i.slug}`, 'max');
      revalidatePath(`/${i.slug}/`);

      publishedCount++;
      publishedSlugs.push(`/${i.slug}`);
    }

    // ─── 3. Publish scheduled impact case studies ──────────────────────
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

      revalidateTag(`impact:${imp.slug}`, 'max');
      revalidateTag(`record:impact:${imp.slug}`, 'max');
      revalidateTag('impacts:list', 'max');
      revalidateTag('archive:impact', 'max');
      revalidateTag(`page:/impact/${imp.slug}`, 'max');
      revalidatePath(`/impact/${imp.slug}/`);

      publishedCount++;
      publishedSlugs.push(`/impact/${imp.slug}`);
    }

    return NextResponse.json({
      success: true,
      publishedCount,
      publishedSlugs,
      checkedAt: now.toISOString(),
    });
  } catch (err) {
    console.error('[cron/publish-scheduled] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
