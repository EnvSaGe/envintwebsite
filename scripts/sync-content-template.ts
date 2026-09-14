import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import {
  PageBlockTreeSchema,
  createArticleTemplateTree,
  createImpactTemplateTree,
  createTaxonomyTemplateTree,
  createTeamMemberTemplateTree,
  type PageBlockTree,
} from '../packages/shared/src';

const templateTrees: Record<string, () => PageBlockTree> = {
  article: createArticleTemplateTree,
  impact: createImpactTemplateTree,
  'team-member': createTeamMemberTemplateTree,
  taxonomy: createTaxonomyTemplateTree,
  author: createTaxonomyTemplateTree,
};

function option(name: string): string | undefined {
  const direct = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (direct) return direct.slice(name.length + 3);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const slug = option('slug')?.trim().toLowerCase();
  const apply = process.argv.includes('--apply');
  if (!slug || !templateTrees[slug]) {
    throw new Error(`Pass --slug with one of: ${Object.keys(templateTrees).join(', ')}`);
  }
  const tree = PageBlockTreeSchema.parse(templateTrees[slug]());
  console.log(`[content-template] ${apply ? 'APPLY' : 'DRY RUN'} ${slug} roots=${tree.rootIds.length} nodes=${Object.keys(tree.nodes).length}`);
  if (!apply) return;

  loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });
  const { db } = await import('../packages/db/src/client');
  const { contentTemplates, contentTemplateRevisions } = await import('../packages/db/src/schema');
  const { eq } = await import('../packages/db/src');
  const existing = await db.query.contentTemplates.findFirst({ where: eq(contentTemplates.slug, slug) });
  if (!existing) throw new Error(`CMS template does not exist: ${slug}`);
  const latest = await db.query.contentTemplateRevisions.findFirst({
    where: eq(contentTemplateRevisions.templateSlug, slug),
    orderBy: (revision, { desc }) => [desc(revision.versionNumber)],
  });

  if (existing.publishedBlocks) {
    await db.insert(contentTemplateRevisions).values({
      templateSlug: slug,
      blocks: existing.publishedBlocks,
      schemaVersion: existing.schemaVersion,
      versionNumber: (latest?.versionNumber ?? 0) + 1,
      status: 'PUBLISHED',
      savedByName: 'Live parity migration',
      note: 'Automatic snapshot before shared-template visual-parity sync',
      savedAt: new Date(),
    });
  }
  await db.update(contentTemplates).set({
    draftBlocks: tree,
    publishedBlocks: tree,
    schemaVersion: 2,
    status: 'PUBLISHED',
    updatedAt: new Date(),
    publishedAt: new Date(),
  }).where(eq(contentTemplates.slug, slug));
  console.log(`[content-template] synced ${slug}; previous published tree was snapshotted`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
