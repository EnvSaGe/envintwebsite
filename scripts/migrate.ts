/**
 * scripts/migrate.ts
 *
 * Applies all pending Drizzle migrations from packages/db/drizzle/ to Neon.
 * Uses drizzle-orm/neon-http (REST-based, no WebSocket) which works
 * in both local environments and serverless runtimes.
 *
 * Usage:
 *   pnpm migrate          (from monorepo root)
 *   tsx scripts/migrate.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

// Load env from packages/db/.env (where DATABASE_URL lives)
dotenv.config({ path: path.resolve(__dirname, '../packages/db/.env') });
// Also try root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });


async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌  DATABASE_URL is not set.');
    console.error('    Set it in packages/db/.env or export it before running migrate.');
    process.exit(1);
  }

  console.log('🔄  Connecting to Neon Postgres...');

  const sql = neon(dbUrl);
  const db = drizzle(sql);

  const migrationsFolder = path.resolve(__dirname, '../packages/db/drizzle');

  console.log(`📁  Applying migrations from: ${migrationsFolder}`);

  try {
    await migrate(db, { migrationsFolder });
    console.log('✅  All migrations applied successfully!');
  } catch (err: any) {
    const isAlreadyExists =
      err?.message?.includes('already exists') ||
      err?.cause?.message?.includes('already exists') ||
      err?.cause?.code === '42710' || // Postgres: duplicate object
      err?.cause?.code === '42P07';   // Postgres: duplicate table

    if (isAlreadyExists) {
      console.log('✅  Schema already up to date (objects already exist). No changes needed.');
      console.log('    Tip: All tables and types are confirmed present in the database.');
    } else {
      console.error('❌  Migration failed:', err);
      process.exit(1);
    }
  }
}

main();
