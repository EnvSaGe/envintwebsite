import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { sql } from 'drizzle-orm';
import { db } from '../packages/db/src/client';

async function main() {
  console.log('Running database schema migrations for Visual CMS Builder...\n');

  // 1. Add columns to pages
  await db.execute(sql`
    ALTER TABLE pages 
    ADD COLUMN IF NOT EXISTS draft_blocks jsonb,
    ADD COLUMN IF NOT EXISTS published_blocks jsonb;
  `);
  console.log('✓ Added draft_blocks and published_blocks to "pages" table');

  // 2. Add columns to page_revisions
  await db.execute(sql`
    ALTER TABLE page_revisions 
    ADD COLUMN IF NOT EXISTS version_number integer,
    ADD COLUMN IF NOT EXISTS is_published_snapshot boolean NOT NULL DEFAULT false;
  `);
  console.log('✓ Added version_number and is_published_snapshot to "page_revisions" table');

  // 3. Create reusable_blocks table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS reusable_blocks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug varchar(100) NOT NULL UNIQUE,
      name varchar(200) NOT NULL,
      category varchar(100) NOT NULL DEFAULT 'cta',
      description varchar(500),
      blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
      is_global boolean NOT NULL DEFAULT true,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );
  `);
  console.log('✓ Created "reusable_blocks" table');

  // 4. Populate published_blocks from existing content_blocks where published_blocks is null
  await db.execute(sql`
    UPDATE pages 
    SET published_blocks = content_blocks 
    WHERE published_blocks IS NULL AND content_blocks IS NOT NULL;
  `);
  console.log('✓ Initialized published_blocks with existing content_blocks for legacy continuity');

  console.log('\nMigration completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
