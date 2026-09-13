import { readFileSync } from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { config as loadEnv } from 'dotenv';

const CMS_MIGRATIONS = [
  'packages/db/drizzle/20260913184807_lonely_black_knight.sql',
  'packages/db/drizzle/20260913191744_loud_punisher.sql',
];

function migrationStatements(relativePath: string): string[] {
  return readFileSync(path.resolve(process.cwd(), relativePath), 'utf8')
    .split('--> statement-breakpoint')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function main() {
  loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

  const sql = neon(process.env.DATABASE_URL);
  let applied = 0;
  for (const migration of CMS_MIGRATIONS) {
    for (const statement of migrationStatements(migration)) {
      await sql(statement, []);
      applied++;
    }
    console.log(`[cms-schema] applied ${migration}`);
  }
  console.log(`[cms-schema] ${applied} additive statements completed`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
