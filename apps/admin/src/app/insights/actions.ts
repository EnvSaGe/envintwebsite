'use server';

import { db, insights, insightCategories, insightTags, categories, tags, eq, and } from '@envint/db';
import { requireRole, getCurrentUserInfo } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
}

async function ensureCategory(name: string): Promise<string> {
  const slug = slugify(name);
  const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing.length > 0) return existing[0].id;
  const [inserted] = await db.insert(categories).values({ slug, name }).returning({ id: categories.id });
  return inserted.id;
}

async function ensureTag(name: string): Promise<string> {
  const slug = slugify(name);
  const existing = await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, slug)).limit(1);
  if (existing.length > 0) return existing[0].id;
  const [inserted] = await db.insert(tags).values({ slug, name }).returning({ id: tags.id });
  return inserted.id;
}

export async function fetchInsights() {
  await requireRole(['super_admin', 'editor']);

  const records = await db.query.insights.findMany({
    orderBy: (i, { desc }) => [desc(i.publishedAt)],
    with: { author: true, coverImage: true, categories: { with: { category: true } }, tags: { with: { tag: true } } },
  });

  return records.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    contentFormat: r.contentFormat,
    contentHtml: r.contentHtml,
    status: r.status,
    publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString().split('T')[0] : null,
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Never',
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
    coverImageUrl: r.coverImageUrl || r.coverImage?.url || null,
    authorName: r.author?.name || null,
    readingTimeMinutes: r.readingTimeMinutes,
    categories: r.categories.map((c) => c.category.name),
    tags: r.tags.map((t) => t.tag.name),
    scheduledAt: r.scheduledAt ? new Date(r.scheduledAt).toISOString() : null,
  }));
}

export async function fetchInsightBySlug(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.insights.findFirst({
    where: eq(insights.slug, slug),
    with: { author: true, coverImage: true, categories: { with: { category: true } }, tags: { with: { tag: true } } },
  });

  if (!record) return null;

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    contentFormat: record.contentFormat,
    contentHtml: record.contentHtml,
    status: record.status,
    publishedAt: record.publishedAt?.toISOString() || null,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    coverImageUrl: record.coverImageUrl || record.coverImage?.url || null,
    readingTimeMinutes: record.readingTimeMinutes,
    categories: record.categories.map((c) => c.category.name),
    tags: record.tags.map((t) => t.tag.name),
    scheduledAt: record.scheduledAt?.toISOString() || null,
  };
}

export async function saveInsightAction(article: {
  slug: string;
  title: string;
  excerpt?: string;
  contentHtml?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  seoTitle?: string;
  seoDescription?: string;
  coverImageUrl?: string;
  categories?: string[];
  tags?: string[];
  scheduledAt?: string | null;
}) {
  await requireRole(['super_admin', 'editor']);

  if (!article.slug || !article.title) {
    throw new Error('Insight slug and title are required.');
  }

  const status = article.status || 'DRAFT';
  const scheduledAt = article.scheduledAt ? new Date(article.scheduledAt) : null;

  const [upserted] = await db
    .insert(insights)
    .values({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || null,
      contentFormat: 'HTML',
      contentHtml: article.contentHtml || null,
      coverImageUrl: article.coverImageUrl || null,
      status,
      scheduledAt,
      seoTitle: article.seoTitle || article.title,
      seoDescription: article.seoDescription || article.excerpt || null,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: insights.slug,
      set: {
        title: article.title,
        excerpt: article.excerpt || null,
        contentHtml: article.contentHtml || null,
        coverImageUrl: article.coverImageUrl || null,
        status,
        scheduledAt,
        seoTitle: article.seoTitle || article.title,
        seoDescription: article.seoDescription || null,
        updatedAt: new Date(),
        ...(status === 'PUBLISHED' ? { publishedAt: new Date() } : {}),
      },
    })
    .returning({ id: insights.id });

  const insightId = upserted.id;

  // Sync categories
  if (article.categories !== undefined) {
    await db.delete(insightCategories).where(eq(insightCategories.insightId, insightId));
    for (const catName of article.categories) {
      if (!catName.trim()) continue;
      const catId = await ensureCategory(catName.trim());
      await db.insert(insightCategories).values({ insightId, categoryId: catId }).onConflictDoNothing();
    }
  }

  // Sync tags
  if (article.tags !== undefined) {
    await db.delete(insightTags).where(eq(insightTags.insightId, insightId));
    for (const tagName of article.tags) {
      if (!tagName.trim()) continue;
      const tagId = await ensureTag(tagName.trim());
      await db.insert(insightTags).values({ insightId, tagId }).onConflictDoNothing();
    }
  }

  await dispatchRevalidation({
    tags: ['insights:list', `insight:${article.slug}`],
  });

  return { success: true, id: insightId };
}

export async function publishInsightAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  await db
    .update(insights)
    .set({ status: 'PUBLISHED', publishedAt: new Date(), updatedAt: new Date(), scheduledAt: null })
    .where(eq(insights.slug, slug));

  await dispatchRevalidation({
    tags: ['insights:list', `insight:${slug}`],
  });

  return { success: true };
}

export async function deleteInsightAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.insights.findFirst({
    where: eq(insights.slug, slug),
    columns: { id: true },
  });

  if (!record) throw new Error(`Insight not found: ${slug}`);

  await db.delete(insights).where(eq(insights.id, record.id));

  await dispatchRevalidation({
    tags: ['insights:list', `insight:${slug}`],
  });

  return { success: true };
}
