import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import {
  ALL_CANONICAL_PAGE_SLUGS,
  PageBlockTreeSchema,
  createArticleTemplateTree,
  createGlobalCtaTemplateTree,
  createGlobalFooterTemplateTree,
  createGlobalHeaderTemplateTree,
  createImpactTemplateTree,
  createTaxonomyTemplateTree,
  createTeamMemberTemplateTree,
  getCanonicalPageTree,
  type PageBlockTree,
  type TemplateKind,
} from '../packages/shared/src';
import type { PublicRouteInventory } from './lib/public-route-inventory';
import { loadPublicRouteInventory } from './lib/public-route-inventory';

const MIGRATION_VERSION = 'live-parity-v1';

type JsonRecord = Record<string, any>;
export interface CmsCoverage {
  covered: string[];
  unaccounted: string[];
  hardcodedOnly: string[];
  byKind: Record<string, number>;
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(path.resolve(process.cwd(), relativePath), 'utf8')) as T;
}

function normalized(pathname: string): string {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  return clean ? `/${clean}/` : '/';
}

function routeSlug(pathname: string): string {
  return normalized(pathname).split('/').filter(Boolean).pop() ?? '';
}

function localCoverageSets() {
  const insights = readJson<JsonRecord[]>('apps/web/src/data/insights.json');
  const impacts = readJson<JsonRecord[]>('apps/web/src/data/impacts.json');
  const team = readJson<JsonRecord[]>('apps/web/src/data/team.json');
  const archives = readJson<Array<{ type: string; slug: string }>>('apps/web/src/data/archive-routes.json');
  return {
    unique: new Set(ALL_CANONICAL_PAGE_SLUGS.map(normalized)),
    article: new Set(insights.map((item) => normalized(`/${item.slug}`))),
    impact: new Set(impacts.map((item) => normalized(`/impact/${item.slug}`))),
    team: new Set(team.map((item) => normalized(`/member/${item.slug}`))),
    archive: new Set(archives.map((item) => normalized(`/${item.type}/${item.slug}`))),
  };
}

export async function buildCmsCoverage(inventory: PublicRouteInventory): Promise<CmsCoverage> {
  const sets = localCoverageSets();
  const covered: string[] = [];
  const unaccounted: string[] = [];
  const hardcodedOnly: string[] = [];
  const byKind: Record<string, number> = {};

  for (const route of inventory.routes) {
    const pathname = normalized(route.path);
    byKind[route.kind] = (byKind[route.kind] ?? 0) + 1;
    const hasCmsSource = route.kind === 'unique-page'
      ? sets.unique.has(pathname)
      : route.kind === 'article'
        ? sets.article.has(pathname)
        : route.kind === 'impact'
          ? sets.impact.has(pathname)
          : route.kind === 'team-member'
            ? pathname === '/member/' || sets.team.has(pathname)
            : route.kind === 'taxonomy'
              ? sets.archive.has(pathname)
              : route.kind === 'author' && /^\/author\/[a-z0-9-]+\/$/.test(pathname);
    if (hasCmsSource) covered.push(pathname);
    else unaccounted.push(pathname);
  }

  return { covered, unaccounted, hardcodedOnly, byKind };
}

const TEMPLATE_DEFINITIONS: Array<{
  slug: string;
  name: string;
  kind: TemplateKind;
  tree: PageBlockTree;
}> = [
  { slug: 'article', name: 'Article detail', kind: 'article', tree: createArticleTemplateTree() },
  { slug: 'impact', name: 'Impact case study detail', kind: 'impact', tree: createImpactTemplateTree() },
  { slug: 'team-member', name: 'Team member profile', kind: 'team-member', tree: createTeamMemberTemplateTree() },
  { slug: 'taxonomy', name: 'Taxonomy archive', kind: 'taxonomy', tree: createTaxonomyTemplateTree() },
  { slug: 'author', name: 'Author archive', kind: 'author', tree: createTaxonomyTemplateTree() },
  { slug: 'global-header', name: 'Global header', kind: 'global-header', tree: createGlobalHeaderTemplateTree() },
  { slug: 'global-footer', name: 'Global footer', kind: 'global-footer', tree: createGlobalFooterTemplateTree() },
  { slug: 'global-cta', name: 'Global call to action', kind: 'global-cta', tree: createGlobalCtaTemplateTree() },
];

export function validateMigrationTemplates(): void {
  for (const template of TEMPLATE_DEFINITIONS) PageBlockTreeSchema.parse(template.tree);
}

function templateSlugForKind(kind: string): string | null {
  if (kind === 'article') return 'article';
  if (kind === 'impact') return 'impact';
  if (kind === 'team-member') return 'team-member';
  if (kind === 'taxonomy') return 'taxonomy';
  if (kind === 'author') return 'author';
  return null;
}

function dependencySourceType(kind: string): string {
  if (kind === 'article') return 'insight';
  if (kind === 'team-member') return 'team';
  if (kind === 'unique-page') return 'page';
  return kind;
}

async function applyMigration(inventory: PublicRouteInventory, force: boolean) {
  loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });
  const { db } = await import('../packages/db/src/client');
  const schema = await import('../packages/db/src/schema');
  const { eq } = await import('../packages/db/src/index');
  const pagesContent = readJson<Record<string, JsonRecord>>('apps/web/src/data/pages-content.json');
  const insightsData = readJson<JsonRecord[]>('apps/web/src/data/insights.json');
  const impactsData = readJson<JsonRecord[]>('apps/web/src/data/impacts.json');
  const teamData = readJson<JsonRecord[]>('apps/web/src/data/team.json');
  const counts = { inserted: 0, updated: 0, skipped: 0, dependencies: 0 };

  for (const template of TEMPLATE_DEFINITIONS) {
    const existing = await db.select({ slug: schema.contentTemplates.slug }).from(schema.contentTemplates)
      .where(eq(schema.contentTemplates.slug, template.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(schema.contentTemplates).values({ slug: template.slug, name: template.name, kind: template.kind, draftBlocks: template.tree, publishedBlocks: template.tree, schemaVersion: 2, status: 'PUBLISHED', publishedAt: new Date() });
      counts.inserted++;
    } else if (force) {
      await db.update(schema.contentTemplates).set({ name: template.name, kind: template.kind, draftBlocks: template.tree, publishedBlocks: template.tree, schemaVersion: 2, status: 'PUBLISHED', updatedAt: new Date(), publishedAt: new Date() }).where(eq(schema.contentTemplates.slug, template.slug));
      counts.updated++;
    } else counts.skipped++;
  }

  for (const slug of ALL_CANONICAL_PAGE_SLUGS) {
    const tree = getCanonicalPageTree(slug);
    if (!tree) continue;
    const content = pagesContent[slug] ?? {};
    const existing = await db.select({ slug: schema.pages.slug }).from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);
    const values = { slug, title: content.title ?? (slug === '/' ? 'Homepage' : slug.slice(1).replace(/-/g, ' ')), seoTitle: content.seoTitle ?? null, seoDescription: content.seoDescription ?? null, layoutTemplate: 'standard', contentBlocks: [], draftBlocks: tree, publishedBlocks: tree, schemaVersion: 2, status: 'PUBLISHED' as const, publishedAt: new Date(), updatedAt: new Date() };
    if (existing.length === 0) { await db.insert(schema.pages).values(values); counts.inserted++; }
    else if (force) { await db.update(schema.pages).set(values).where(eq(schema.pages.slug, slug)); counts.updated++; }
    else counts.skipped++;
  }

  for (const item of insightsData) {
    const existing = await db.select({ id: schema.insights.id, provenance: schema.insights.migrationProvenance }).from(schema.insights).where(eq(schema.insights.slug, item.slug)).limit(1);
    const provenance = { source: 'envintglobal.com', migration: MIGRATION_VERSION };
    const values = { slug: item.slug, title: item.title, excerpt: item.excerpt ?? null, contentFormat: 'HTML' as const, contentHtml: item.contentHtml ?? null, coverImageUrl: item.coverImage?.url ?? item.coverImageUrl ?? null, status: 'PUBLISHED' as const, seoTitle: item.seoTitle ?? item.title, seoDescription: item.seoDescription ?? item.excerpt ?? null, publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(), migrationProvenance: provenance, updatedAt: new Date() };
    if (existing.length === 0) { await db.insert(schema.insights).values(values); counts.inserted++; }
    else if (force || (existing[0].provenance as any)?.migration === MIGRATION_VERSION) { await db.update(schema.insights).set(values).where(eq(schema.insights.slug, item.slug)); counts.updated++; }
    else counts.skipped++;
  }

  for (const item of impactsData) {
    const existing = await db.select({ id: schema.impactCaseStudies.id }).from(schema.impactCaseStudies).where(eq(schema.impactCaseStudies.slug, item.slug)).limit(1);
    const values = { slug: item.slug, title: item.title, summary: item.summary ?? '', challenge: item.challenge ?? item.problem ?? null, solution: item.solution ?? null, outcome: item.outcome ?? item.impact ?? null, contentHtml: item.contentHtml ?? null, coverImageUrl: item.coverImage?.url ?? item.heroImage ?? null, status: 'PUBLISHED' as const, seoTitle: item.seoTitle ?? item.title, seoDescription: item.seoDescription ?? item.summary ?? null, publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(), updatedAt: new Date() };
    if (existing.length === 0) { await db.insert(schema.impactCaseStudies).values(values); counts.inserted++; }
    else if (force) { await db.update(schema.impactCaseStudies).set(values).where(eq(schema.impactCaseStudies.slug, item.slug)); counts.updated++; }
    else counts.skipped++;
  }

  for (let index = 0; index < teamData.length; index++) {
    const item = teamData[index];
    const existing = await db.select({ id: schema.teamMembers.id }).from(schema.teamMembers).where(eq(schema.teamMembers.slug, item.slug)).limit(1);
    const values = { slug: item.slug, name: item.name, roleTitle: item.roleTitle ?? '', bio: item.bio ?? '', shortBio: item.shortBio ?? null, avatarUrl: item.image?.url ?? item.avatarUrl ?? null, linkedinUrl: item.linkedinUrl ?? null, isLeadership: item.isLeadership ?? true, hasStandaloneRoute: item.hasStandaloneRoute ?? true, orderIndex: index, status: 'PUBLISHED' as const, seoTitle: item.seoTitle ?? `${item.name} | Envint`, seoDescription: item.seoDescription ?? item.shortBio ?? null, updatedAt: new Date() };
    if (existing.length === 0) { await db.insert(schema.teamMembers).values(values); counts.inserted++; }
    else if (force) { await db.update(schema.teamMembers).set(values).where(eq(schema.teamMembers.slug, item.slug)); counts.updated++; }
    else counts.skipped++;
  }

  const migrationSetting = await db.select({ id: schema.siteSettings.id }).from(schema.siteSettings).where(eq(schema.siteSettings.key, 'migration.liveParityVersion')).limit(1);
  if (migrationSetting.length === 0 || force) {
    const settings = [
      ['footer.newsletterHeading', 'Subscribe to our newsletter'],
      ['footer.tagline', 'We help businesses progress on sustainability'],
      ['contact.email', 'connect@envintglobal.com'],
      ['footer.copyright', '© 2024 Envint Services LLP. All Rights Reserved'],
      ['footer.designCredit', 'Designed by Envint Team'],
    ];
    for (const [key, value] of settings) {
      await db.insert(schema.siteSettings).values({ key, value }).onConflictDoUpdate({ target: schema.siteSettings.key, set: { value, updatedAt: new Date() } });
    }

    const existingNavigation = await db.select().from(schema.navigationItems);
    const ensureNav = async (input: { label: string; href: string; navGroup: string; orderIndex: number; parentId?: string | null; openInNewTab?: boolean }) => {
      const match = existingNavigation.find((item) =>
        item.navGroup === input.navGroup &&
        item.href.replace(/\/$/, '') === input.href.replace(/\/$/, '') &&
        (item.parentId ?? null) === (input.parentId ?? null),
      );
      if (match) {
        await db.update(schema.navigationItems).set({ ...input, parentId: input.parentId ?? null, isActive: true, updatedAt: new Date() }).where(eq(schema.navigationItems.id, match.id));
        return match.id;
      }
      const [created] = await db.insert(schema.navigationItems).values({ ...input, parentId: input.parentId ?? null, isActive: true, openInNewTab: input.openInNewTab ?? false }).returning({ id: schema.navigationItems.id });
      existingNavigation.push({ ...input, id: created.id, parentId: input.parentId ?? null, isActive: true, openInNewTab: input.openInNewTab ?? false, createdAt: new Date(), updatedAt: new Date() } as any);
      return created.id;
    };

    const topNavigation = [
      { label: 'About', href: '/about/', orderIndex: 0 },
      { label: 'Services', href: '/services/', orderIndex: 1 },
      { label: 'Impact', href: '/impact/', orderIndex: 2 },
      { label: 'Careers', href: '/careers-at-envint/', orderIndex: 3 },
      { label: 'Insights', href: '/envision/', orderIndex: 4 },
      { label: 'Connect', href: '/connect/', orderIndex: 5 },
    ];
    const parentIds = new Map<string, string>();
    for (const item of topNavigation) parentIds.set(item.label, await ensureNav({ ...item, navGroup: 'primary' }));
    const nestedNavigation = [
      { parent: 'Services', label: 'Our Services', href: '/services/', orderIndex: 0 },
      { parent: 'Services', label: 'Sustainability Integration', href: '/sustainability-integration/', orderIndex: 1 },
      { parent: 'Services', label: 'Responsible Investment', href: '/responsible-investment/', orderIndex: 2 },
      { parent: 'Services', label: 'Climate Action', href: '/climate-action/', orderIndex: 3 },
      { parent: 'Insights', label: 'Envision', href: '/envision/', orderIndex: 0 },
      { parent: 'Insights', label: 'Enviki', href: '/enviki/', orderIndex: 1 },
    ];
    for (const item of nestedNavigation) {
      await ensureNav({ label: item.label, href: item.href, orderIndex: item.orderIndex, navGroup: 'primary', parentId: parentIds.get(item.parent) });
    }
    const activeTopLevelIds = new Set(parentIds.values());
    for (const item of existingNavigation.filter((entry) => entry.navGroup === 'primary' && !entry.parentId && !activeTopLevelIds.has(entry.id))) {
      await db.update(schema.navigationItems).set({ isActive: false, updatedAt: new Date() }).where(eq(schema.navigationItems.id, item.id));
    }
    await ensureNav({ label: 'LinkedIn', href: 'https://www.linkedin.com/company/envintglobal/', navGroup: 'social', orderIndex: 0, openInNewTab: true });
    await ensureNav({ label: 'Twitter', href: 'https://twitter.com/envintglobal', navGroup: 'social', orderIndex: 1, openInNewTab: true });
    await db.insert(schema.siteSettings).values({ key: 'migration.liveParityVersion', value: MIGRATION_VERSION })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: MIGRATION_VERSION, updatedAt: new Date() } });
  }

  for (const route of inventory.routes) {
    const pathname = normalized(route.path);
    const sourceKey = route.kind === 'unique-page' ? pathname.replace(/\/$/, '') || '/' : route.kind === 'taxonomy' || route.kind === 'author' ? pathname : routeSlug(pathname);
    await db.insert(schema.contentDependencies).values({ sourceType: dependencySourceType(route.kind), sourceKey, routePath: pathname }).onConflictDoNothing();
    const templateSlug = templateSlugForKind(route.kind);
    if (templateSlug) {
      await db.insert(schema.contentDependencies).values({ sourceType: 'template', sourceKey: templateSlug, routePath: pathname }).onConflictDoNothing();
    }
    counts.dependencies++;
  }

  return counts;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const force = process.argv.includes('--force');
  validateMigrationTemplates();
  const inventoryPath = 'envintmigration/site-capture/public-route-inventory.json';
  const inventory = existsSync(inventoryPath)
    ? readJson<PublicRouteInventory>(inventoryPath)
    : await loadPublicRouteInventory();
  const coverage = await buildCmsCoverage(inventory);
  if (coverage.unaccounted.length > 0) throw new Error(`Unaccounted routes:\n${coverage.unaccounted.join('\n')}`);

  console.log(`[cms-migration] ${apply ? 'APPLY' : 'DRY RUN'} ${MIGRATION_VERSION}`);
  console.log(`[cms-migration] routes=${coverage.covered.length} templates=${TEMPLATE_DEFINITIONS.length}`);
  console.log(`[cms-migration] families=${JSON.stringify(coverage.byKind)}`);
  if (!apply) {
    console.log('[cms-migration] No database writes performed. Re-run with --apply to migrate.');
    return;
  }
  const counts = await applyMigration(inventory, force);
  console.log(`[cms-migration] inserted=${counts.inserted} updated=${counts.updated} skipped=${counts.skipped} dependencies=${counts.dependencies}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/migrate-live-parity-cms.ts')) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
