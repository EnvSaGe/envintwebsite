import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../apps/web/.env.local') });

import { eq, not } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages } from '../packages/db/src/schema';

// List of handcrafted core pages that have dedicated pixel-perfect Next.js fallback components.
// /about is our Schema v2 pilot page, so we keep its rich Schema v2 published tree intact!
const HANDCRAFTED_PAGES = [
  '/',
  '/services',
  '/careers-at-envint',
  '/sustainability-integration',
  '/climate-action',
  '/responsible-investment',
  '/connect',
  '/connect-gbc2024',
  '/impact',
  '/enviki',
  '/envision',
  '/esq',
  '/mapsense',
  '/behind-the-buzz',
  '/glossary-zone',
  '/how-to-articles',
  '/disclaimer',
];

async function resetHandcraftedPages() {
  console.log('Resetting handcrafted pages so they display their pixel-perfect Next.js components...');
  console.log('(Keeping "/about" active on Schema v2 dynamic tree)\n');

  for (const slug of HANDCRAFTED_PAGES) {
    const record = await db.query.pages.findFirst({
      where: eq(pages.slug, slug),
    });

    if (!record) {
      console.log(`- Page "${slug}" not found in DB, skipping.`);
      continue;
    }

    // Set publishedBlocks and contentBlocks to null/empty so the page renderer
    // gracefully displays the handcrafted Next.js component.
    await db
      .update(pages)
      .set({
        publishedBlocks: null,
        contentBlocks: [],
        schemaVersion: 1,
        updatedAt: new Date(),
      })
      .where(eq(pages.slug, slug));

    console.log(`✓ Reset "${slug}" -> publishedBlocks: null (active handcrafted Next.js fallback)`);
  }

  // Verify /about is still Schema v2
  const aboutPage = await db.query.pages.findFirst({
    where: eq(pages.slug, '/about'),
  });

  console.log(`\nVerification: "/about" schemaVersion = ${aboutPage?.schemaVersion}, hasPublishedBlocks = ${!!aboutPage?.publishedBlocks}`);
  console.log('All handcrafted pages have been successfully protected and restored!');
}

resetHandcraftedPages().catch(console.error);
