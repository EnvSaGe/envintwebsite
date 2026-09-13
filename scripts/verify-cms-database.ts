import assert from 'node:assert/strict';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { config as loadEnv } from 'dotenv';

interface CountRow {
  count: string;
}

async function count(sql: ReturnType<typeof neon>, table: string, where = ''): Promise<number> {
  if (!/^[a-z_]+$/.test(table)) throw new Error(`Unsafe table name: ${table}`);
  const rows = await sql(`SELECT count(*)::text AS count FROM ${table} ${where}`, []) as CountRow[];
  return Number(rows[0]?.count ?? 0);
}

async function main() {
  loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const sql = neon(process.env.DATABASE_URL);

  const results = {
    publishedPages: await count(sql, 'pages', `WHERE status = 'PUBLISHED'`),
    editablePublishedPages: await count(sql, 'pages', `WHERE status = 'PUBLISHED' AND published_blocks IS NOT NULL`),
    publishedTemplates: await count(sql, 'content_templates', `WHERE status = 'PUBLISHED' AND published_blocks IS NOT NULL`),
    publishedInsights: await count(sql, 'insights', `WHERE status = 'PUBLISHED'`),
    publishedImpacts: await count(sql, 'impact_case_studies', `WHERE status = 'PUBLISHED'`),
    publishedTeam: await count(sql, 'team_members', `WHERE status = 'PUBLISHED'`),
    dependencies: await count(sql, 'content_dependencies'),
  };

  assert.ok(results.editablePublishedPages >= 16, 'Expected all 16 canonical pages to have published CMS trees');
  assert.ok(results.publishedTemplates >= 8, 'Expected all shared/global templates to be published');
  assert.ok(results.publishedInsights >= 54, 'Expected all live articles to be published');
  assert.ok(results.publishedImpacts >= 26, 'Expected all live impact studies to be published');
  assert.ok(results.publishedTeam >= 14, 'Expected all live team profiles to be published');
  assert.ok(results.dependencies >= 265, 'Expected route and template dependency coverage');

  console.log(`[cms-database] ${JSON.stringify(results)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
