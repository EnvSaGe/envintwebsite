import { and, contentTemplates, db, eq } from '@envint/db';
import { PageBlockTreeSchema, type TemplateKind } from '@envint/shared';
import { unstable_cache } from 'next/cache';
import { templateTag } from '../routes/cache-tags';
import type { ContentTemplateRecord } from '../routes/types';

async function loadPublishedTemplate(slug: string): Promise<ContentTemplateRecord | null> {
  const record = await db.query.contentTemplates.findFirst({
    where: and(eq(contentTemplates.slug, slug), eq(contentTemplates.status, 'PUBLISHED')),
  });
  if (!record?.publishedBlocks) return null;
  const parsed = PageBlockTreeSchema.safeParse(record.publishedBlocks);
  if (!parsed.success) return null;
  return {
    slug: record.slug,
    name: record.name,
    kind: record.kind as TemplateKind,
    publishedBlocks: parsed.data,
    schemaVersion: record.schemaVersion,
  };
}

export function getPublishedTemplate(slug: string): Promise<ContentTemplateRecord | null> {
  return unstable_cache(
    () => loadPublishedTemplate(slug),
    ['published-content-template', slug],
    { tags: [templateTag(slug)], revalidate: 3600 },
  )();
}
