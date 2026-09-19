/**
 * Standalone migration runner — used in CI/CD or manual deployment.
 * 
 * Run with: 
 *   DATABASE_URL=... npx tsx src/migrate.ts
 * 
 * This uses the `pg` driver (not WebSocket) so it works outside Edge runtime.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as path from 'path';

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const db = drizzle(pool);

  console.log('🚀 Running Drizzle migrations...');
  await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });
  console.log('✅ All migrations applied successfully.');

  await pool.end();
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
