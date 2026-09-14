import path from 'node:path';
import { config as loadEnv } from 'dotenv';

const LIVE_TEAM_ORDER = [
  'anand-krishnamurthy',
  'manish-r-jain',
  'lucille-andrade',
  'vibhav-nuwal',
  'aastha-agrawal',
  'abhishek-bhure',
  'arthita-ray',
  'aseem-dixit',
  'fiona-mathias',
  'jay-monga',
  'kavya-singh',
  'mabelle-david',
  'suktara-chakraborti',
  'swati-verma',
  'vidisha-somashekar',
] as const;

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply');
  loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });
  const { db } = await import('../packages/db/src/client');
  const { teamMembers } = await import('../packages/db/src/schema');
  const { asc, eq } = await import('../packages/db/src');
  const current = await db.query.teamMembers.findMany({ orderBy: [asc(teamMembers.orderIndex)] });
  const known = new Set(LIVE_TEAM_ORDER);
  const remaining = current.map((member) => member.slug).filter((slug) => !known.has(slug as any));
  const finalOrder = [...LIVE_TEAM_ORDER, ...remaining];

  console.log(`[team-order] ${apply ? 'APPLY' : 'DRY RUN'} ${finalOrder.join(' > ')}`);
  if (!apply) return;

  // The project uses Neon's HTTP driver, which does not expose interactive
  // transactions. These idempotent per-row updates are safe to retry.
  for (const [index, slug] of finalOrder.entries()) {
    const roleTitle = slug === 'anand-krishnamurthy' || slug === 'manish-r-jain'
      ? 'Co-Founder & Partner'
      : undefined;
    await db.update(teamMembers).set({ orderIndex: index, ...(roleTitle ? { roleTitle } : {}), updatedAt: new Date() }).where(eq(teamMembers.slug, slug));
  }
  console.log(`[team-order] updated ${finalOrder.length} profiles`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
