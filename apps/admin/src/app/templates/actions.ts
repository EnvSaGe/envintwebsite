'use server';

import {
  contentDependencies,
  contentTemplateRevisions,
  contentTemplates,
  db,
  eq,
} from '@envint/db';
import {
  PageBlockTreeSchema,
  TemplateKindSchema,
  createStarterPageTree,
  type PageBlockTree,
  type TemplateKind,
} from '@envint/shared';
import { getCurrentUserInfo, requireRole } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';

function normalizeTemplateSlug(value: string): string {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('Template slug is required.');
  return slug;
}

async function dependencyRoutes(slug: string): Promise<string[]> {
  const dependencies = await db.query.contentDependencies.findMany({
    where: eq(contentDependencies.sourceKey, slug),
  });
  return [...new Set(dependencies.map((dependency) => dependency.routePath))];
}

async function nextVersionNumber(slug: string): Promise<number> {
  const latest = await db.query.contentTemplateRevisions.findFirst({
    where: eq(contentTemplateRevisions.templateSlug, slug),
    orderBy: (revision, { desc }) => [desc(revision.versionNumber)],
  });
  return (latest?.versionNumber ?? 0) + 1;
}

export async function fetchTemplatesListAction() {
  await requireRole(['super_admin', 'editor']);
  const records = await db.query.contentTemplates.findMany({
    orderBy: (template, { asc }) => [asc(template.name)],
  });
  return Promise.all(records.map(async (record) => ({
    slug: record.slug,
    name: record.name,
    kind: TemplateKindSchema.parse(record.kind),
    description: record.description,
    status: record.status,
    updatedAt: record.updatedAt.toISOString(),
    dependencyCount: (await dependencyRoutes(record.slug)).length,
  })));
}

export async function fetchTemplateAction(slugInput: string) {
  await requireRole(['super_admin', 'editor']);
  const slug = normalizeTemplateSlug(slugInput);
  const record = await db.query.contentTemplates.findFirst({
    where: eq(contentTemplates.slug, slug),
  });
  if (!record) return null;
  const tree = PageBlockTreeSchema.parse(record.draftBlocks ?? record.publishedBlocks);
  const routes = await dependencyRoutes(slug);
  return {
    slug: record.slug,
    name: record.name,
    kind: TemplateKindSchema.parse(record.kind),
    description: record.description ?? '',
    status: record.status,
    tree,
    dependencyCount: routes.length,
    dependencyRoutes: routes,
  };
}

export async function createTemplateAction(input: {
  name: string;
  slug: string;
  kind: TemplateKind;
  description?: string;
}) {
  await requireRole(['super_admin', 'editor']);
  const slug = normalizeTemplateSlug(input.slug);
  const kind = TemplateKindSchema.parse(input.kind);
  const tree = createStarterPageTree(input.name.trim() || 'New template');
  await db.insert(contentTemplates).values({
    slug,
    name: input.name.trim() || slug,
    kind,
    description: input.description?.trim() || null,
    draftBlocks: tree,
    schemaVersion: 2,
    status: 'DRAFT',
  });
  return { success: true, slug };
}

export async function saveTemplateDraftAction(slugInput: string, treeInput: PageBlockTree) {
  await requireRole(['super_admin', 'editor']);
  const slug = normalizeTemplateSlug(slugInput);
  const tree = PageBlockTreeSchema.parse(treeInput);
  await db.update(contentTemplates).set({
    draftBlocks: tree,
    schemaVersion: 2,
    updatedAt: new Date(),
  }).where(eq(contentTemplates.slug, slug));
  return { success: true };
}

export async function publishTemplateAction(input: {
  slug: string;
  name: string;
  tree: PageBlockTree;
}) {
  const slug = normalizeTemplateSlug(input.slug);
  const routes = await dependencyRoutes(slug);
  await requireRole(routes.length > 1 ? ['super_admin'] : ['super_admin', 'editor']);
  const tree = PageBlockTreeSchema.parse(input.tree);
  const user = await getCurrentUserInfo();

  await db.update(contentTemplates).set({
    name: input.name.trim(),
    draftBlocks: tree,
    publishedBlocks: tree,
    schemaVersion: 2,
    status: 'PUBLISHED',
    scheduledAt: null,
    updatedAt: new Date(),
    publishedAt: new Date(),
  }).where(eq(contentTemplates.slug, slug));

  await db.insert(contentTemplateRevisions).values({
    templateSlug: slug,
    blocks: tree,
    schemaVersion: 2,
    versionNumber: await nextVersionNumber(slug),
    status: 'PUBLISHED',
    savedByClerkId: user?.clerkId ?? null,
    savedByName: user?.name ?? null,
    note: `Published shared template affecting ${routes.length} route${routes.length === 1 ? '' : 's'}`,
  });

  await dispatchRevalidation({ tags: [`template:${slug}`], paths: routes });
  return { success: true, affectedRoutes: routes.length };
}

export async function fetchTemplateRevisionsAction(slugInput: string) {
  await requireRole(['super_admin', 'editor']);
  const slug = normalizeTemplateSlug(slugInput);
  const records = await db.query.contentTemplateRevisions.findMany({
    where: eq(contentTemplateRevisions.templateSlug, slug),
    orderBy: (revision, { desc }) => [desc(revision.versionNumber)],
  });
  return records.map((record) => ({
    id: record.id,
    status: record.status,
    isPublishedSnapshot: record.status === 'PUBLISHED',
    savedByName: record.savedByName ?? 'Unknown editor',
    savedAt: record.savedAt.toISOString(),
    note: record.note,
  }));
}

export async function restoreTemplateRevisionAction(slugInput: string, revisionId: string) {
  await requireRole(['super_admin', 'editor']);
  const slug = normalizeTemplateSlug(slugInput);
  const revision = await db.query.contentTemplateRevisions.findFirst({
    where: eq(contentTemplateRevisions.id, revisionId),
  });
  if (!revision || revision.templateSlug !== slug) throw new Error('Template revision not found.');
  const tree = PageBlockTreeSchema.parse(revision.blocks);
  await db.update(contentTemplates).set({ draftBlocks: tree, updatedAt: new Date() })
    .where(eq(contentTemplates.slug, slug));
  return { success: true };
}

export async function deleteTemplateAction(slugInput: string) {
  await requireRole(['super_admin']);
  const slug = normalizeTemplateSlug(slugInput);
  const routes = await dependencyRoutes(slug);
  if (routes.length > 0) throw new Error(`This template is used by ${routes.length} public route(s) and cannot be deleted.`);
  await db.delete(contentTemplateRevisions).where(eq(contentTemplateRevisions.templateSlug, slug));
  await db.delete(contentTemplates).where(eq(contentTemplates.slug, slug));
  return { success: true };
}
