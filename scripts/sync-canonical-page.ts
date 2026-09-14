import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PageBlockTreeSchema, getCanonicalPageTree } from '../packages/shared/src';

function option(name: string): string | undefined {
  const direct = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (direct) return direct.slice(name.length + 3);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const slug = option('slug');
  const apply = process.argv.includes('--apply');
  if (!slug) throw new Error('Pass a canonical page slug with --slug=/path');
  const normalized = slug === '/' ? '/' : `/${slug.replace(/^\/+|\/+$/g, '')}`;
  const tree = getCanonicalPageTree(normalized);
  if (!tree) throw new Error(`No canonical tree exists for ${normalized}`);
  PageBlockTreeSchema.parse(tree);

  console.log(`[canonical-page] ${apply ? 'APPLY' : 'DRY RUN'} ${normalized} roots=${tree.rootIds.length} nodes=${Object.keys(tree.nodes).length}`);
  if (!apply) return;

  loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });
  const { db } = await import('../packages/db/src/client');
  const { pages, pageRevisions } = await import('../packages/db/src/schema');
  const { eq } = await import('../packages/db/src');
  const existing = await db.query.pages.findFirst({ where: eq(pages.slug, normalized) });
  if (!existing) throw new Error(`CMS page does not exist: ${normalized}`);

  if (existing.publishedBlocks) {
    await db.insert(pageRevisions).values({
      pageSlug: normalized,
      contentBlocks: existing.publishedBlocks,
      schemaVersion: existing.schemaVersion,
      versionNumber: null,
      isPublishedSnapshot: true,
      status: 'PUBLISHED',
      savedByName: 'Live parity migration',
      note: 'Automatic snapshot before canonical visual-parity sync',
      savedAt: new Date(),
    });
  }
  await db.update(pages).set({
    draftBlocks: tree,
    publishedBlocks: tree,
    schemaVersion: 2,
    updatedAt: new Date(),
    publishedAt: new Date(),
  }).where(eq(pages.slug, normalized));
  console.log(`[canonical-page] synced ${normalized}; previous published tree was snapshotted`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
