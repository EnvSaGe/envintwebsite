import path from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: path.resolve(process.cwd(), 'apps/admin/.env.local') });
loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });

const NEW_COVER = 'https://envintcms.s3.ap-south-1.amazonaws.com/images/vantage-2026-cover.webp';
const NEW_PDF = 'https://envintcms.s3.ap-south-1.amazonaws.com/media/uploads/Vantage-2026-Navigating-the-ESG-Reset.pdf';

async function main() {
  const { db } = await import('../packages/db/src/client');
  const { pages } = await import('../packages/db/src/schema');
  const { eq, or } = await import('../packages/db/src');

  const homePages = await db.select().from(pages).where(or(eq(pages.slug, '/'), eq(pages.slug, '')));
  console.log(`Found ${homePages.length} home page rows.`);

  for (const p of homePages) {
    console.log(`Updating page slug: ${p.slug}...`);
    const draft = p.draftBlocks as any;
    const pub = p.publishedBlocks as any;

    if (draft?.nodes) {
      if (draft.nodes.img_vantage) {
        draft.nodes.img_vantage.content = {
          ...draft.nodes.img_vantage.content,
          src: NEW_COVER,
          alt: 'Vantage 2026: Navigating the ESG Reset - Envint Publication',
        };
        console.log('✓ Updated draft img_vantage');
      }
      if (draft.nodes.btn_vantage_read) {
        draft.nodes.btn_vantage_read.content = {
          ...draft.nodes.btn_vantage_read.content,
          action: {
            type: 'link',
            url: NEW_PDF,
            target: '_blank',
          },
        };
        console.log('✓ Updated draft btn_vantage_read');
      }
    }

    if (pub?.nodes) {
      if (pub.nodes.img_vantage) {
        pub.nodes.img_vantage.content = {
          ...pub.nodes.img_vantage.content,
          src: NEW_COVER,
          alt: 'Vantage 2026: Navigating the ESG Reset - Envint Publication',
        };
        console.log('✓ Updated pub img_vantage');
      }
      if (pub.nodes.btn_vantage_read) {
        pub.nodes.btn_vantage_read.content = {
          ...pub.nodes.btn_vantage_read.content,
          action: {
            type: 'link',
            url: NEW_PDF,
            target: '_blank',
          },
        };
        console.log('✓ Updated pub btn_vantage_read');
      }
    }

    await db.update(pages).set({
      draftBlocks: draft,
      publishedBlocks: pub,
      updatedAt: new Date(),
      publishedAt: new Date(),
    }).where(eq(pages.id, p.id));

    console.log(`✓ Successfully updated database page id ${p.id} (${p.slug})!`);
  }
}

main().catch(err => {
  console.error('Failed to update home page in DB:', err);
  process.exit(1);
});
