# Envint Live-Parity Dynamic CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every supported Envint public route render from editable CMS data while matching the current `envintglobal.com` site and remaining efficient on Netlify's 300-credit plan.

**Architecture:** Unique pages render normalized editable page trees; repeated content renders structured records through editable shared template trees; navigation, footer, and calls to action render from global CMS data. A common route resolver supplies published-only content to the public renderer, and CMS publication triggers targeted Next.js tag/path revalidation instead of a production deployment.

**Tech Stack:** Next.js App Router, React, TypeScript, Drizzle ORM, PostgreSQL, Clerk, S3-compatible media storage, Netlify OpenNext, `tsx` verification scripts, Playwright-compatible browser audits.

**Spec:** `docs/superpowers/specs/2026-09-14-live-parity-dynamic-cms-design.md`

## Global Constraints

- WordPress and `envintglobal.com` are read-only migration and fidelity references, never runtime dependencies.
- Preserve every existing public slug, canonical URL, publication date, relationship, and required redirect.
- Preserve the user's current uncommitted work; do not reset or overwrite unrelated changes.
- Public visitors may render `publishedBlocks` only; `draftBlocks` require authenticated preview mode.
- Ordinary CMS publishing must use targeted revalidation and must not trigger a Netlify production deployment.
- Public routes should prefer static generation or ISR and avoid uncached database reads on every request.
- Media stays in the existing S3-compatible object store; PostgreSQL remains external to Netlify.
- Existing schema-v2 page trees remain backward compatible during the migration.
- Changes follow test-first development and are committed in independently verifiable units.

---

### Task 1: Establish a Reproducible Route and Fidelity Baseline

**Files:**
- Create: `scripts/lib/public-route-inventory.ts`
- Create: `scripts/verify-public-route-inventory.ts`
- Create: `scripts/capture-live-fidelity.ts`
- Modify: `package.json`
- Modify: `docs/migration/10-fidelity-audit.md`
- Test: `scripts/verify-public-route-inventory.ts`

**Interfaces:**
- Produces: `loadPublicRouteInventory(): Promise<PublicRouteInventory>`.
- Produces: `PublicRouteInventory` with `routes`, `sourceSitemaps`, and `capturedAt`.
- Produces: live HTML and viewport screenshots under `envintmigration/site-capture/` without changing the live site.

- [x] **Step 1: Write the failing route-inventory verification**

```ts
import assert from 'node:assert/strict';
import { normalizePublicPath, classifyPublicPath } from './lib/public-route-inventory';

assert.equal(normalizePublicPath('https://envintglobal.com/about'), '/about/');
assert.equal(normalizePublicPath('/impact/example'), '/impact/example/');
assert.equal(classifyPublicPath('/member/aseem-dixit/'), 'team-member');
assert.equal(classifyPublicPath('/category/enviki/'), 'taxonomy');
assert.equal(classifyPublicPath('/'), 'unique-page');
```

- [x] **Step 2: Run the verification and confirm the missing module failure**

Run: `pnpm exec tsx scripts/verify-public-route-inventory.ts`

Expected: FAIL because `scripts/lib/public-route-inventory.ts` does not exist.

- [x] **Step 3: Implement sitemap discovery, normalization, classification, and JSON output**

```ts
export type PublicRouteKind =
  | 'unique-page'
  | 'article'
  | 'impact'
  | 'team-member'
  | 'taxonomy'
  | 'author';

export interface PublicRouteInventory {
  capturedAt: string;
  sourceSitemaps: string[];
  routes: Array<{ path: string; source: string; kind: PublicRouteKind; lastModified?: string }>;
}

export function normalizePublicPath(input: string): string {
  const pathname = input.startsWith('http') ? new URL(input).pathname : input;
  return pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}/`;
}
```

The loader must read the live sitemap index, traverse only `envintglobal.com` child sitemaps, de-duplicate normalized paths, and write `envintmigration/site-capture/public-route-inventory.json`.

- [x] **Step 4: Add a read-only capture command**

Add scripts:

```json
{
  "audit:inventory": "tsx scripts/verify-public-route-inventory.ts",
  "audit:capture-live": "tsx scripts/capture-live-fidelity.ts"
}
```

The capture script records live HTML plus screenshots at `1440x1000`, `768x1024`, and `390x844`, with bounded concurrency and no form submissions.

- [x] **Step 5: Run inventory and capture smoke tests**

Run: `pnpm audit:inventory`

Expected: PASS and report a non-zero, duplicate-free route count with `/`, `/about/`, `/services/`, `/impact/`, `/envision/`, and `/connect/` present.

Run: `pnpm audit:capture-live -- --limit 3`

Expected: PASS with HTML and three viewport screenshots for each sampled route.

- [x] **Step 6: Commit the baseline tooling**

```bash
git add package.json scripts/lib/public-route-inventory.ts scripts/verify-public-route-inventory.ts scripts/capture-live-fidelity.ts docs/migration/10-fidelity-audit.md
git commit -m "test: establish live route parity baseline"
```

### Task 2: Add Typed CMS Templates, Bindings, and Global Blocks

**Files:**
- Modify: `packages/db/src/schema/index.ts`
- Create: `packages/db/drizzle/0001_cms_templates.sql`
- Modify: `packages/shared/src/builder-schema.ts`
- Modify: `packages/shared/src/block-schemas.ts`
- Create: `packages/shared/src/content-bindings.ts`
- Create: `scripts/verify-content-bindings.ts`
- Test: `scripts/verify-content-bindings.ts`

**Interfaces:**
- Produces: database tables `content_templates`, `global_block_revisions`, and dependency records for targeted revalidation.
- Produces: `ContentBinding`, `TemplateKind`, and `DynamicQueryConfig` types.
- Produces: `resolveBinding(binding, context): unknown` with explicit missing-value behavior.

- [x] **Step 1: Write failing binding-contract tests**

```ts
import assert from 'node:assert/strict';
import { resolveBinding, validateDynamicQuery } from '../packages/shared/src/content-bindings';

const context = { record: { title: 'Climate Action', coverImageUrl: '/hero.webp' } };
assert.equal(resolveBinding({ source: 'record', path: 'title' }, context), 'Climate Action');
assert.equal(resolveBinding({ source: 'record', path: 'missing', fallback: 'Fallback' }, context), 'Fallback');
assert.deepEqual(validateDynamicQuery({ source: 'insights', limit: 3, sort: 'publishedAt:desc' }), {
  source: 'insights', limit: 3, sort: 'publishedAt:desc', filters: [], pagination: 'none'
});
```

- [x] **Step 2: Run the contract test and confirm failure**

Run: `pnpm exec tsx scripts/verify-content-bindings.ts`

Expected: FAIL because the binding module does not exist.

- [x] **Step 3: Add template and dependency storage**

Add `contentTemplates` with `slug`, `name`, `kind`, `draftBlocks`, `publishedBlocks`, `schemaVersion`, status, scheduling, and timestamps. Add global-block revision history and a dependency table keyed by `sourceType`, `sourceKey`, and `routePath` so publication can invalidate affected routes.

- [x] **Step 4: Add typed binding and query configuration**

```ts
export interface ContentBinding {
  source: 'record' | 'site' | 'route' | 'global';
  path: string;
  fallback?: unknown;
  format?: 'text' | 'html' | 'date' | 'url' | 'image';
}

export interface DynamicQueryConfig {
  source: 'insights' | 'impacts' | 'team' | 'services';
  filters: Array<{ field: string; operator: 'eq' | 'contains' | 'in'; value: string | string[] }>;
  sort: string;
  limit: number;
  pagination: 'none' | 'pages' | 'load-more';
}
```

Extend `BuilderNode.content` schemas to allow bindings only on supported fields. Reject traversal keys such as `__proto__`, `prototype`, and `constructor`.

- [x] **Step 5: Run binding and package checks**

Run: `pnpm exec tsx scripts/verify-content-bindings.ts`

Expected: PASS.

Run: `pnpm --filter @envint/shared typecheck && pnpm --filter @envint/db typecheck`

Expected: both commands exit 0.

- [x] **Step 6: Commit the typed content model**

```bash
git add packages/db/src/schema/index.ts packages/db/drizzle/0001_cms_templates.sql packages/shared/src/builder-schema.ts packages/shared/src/block-schemas.ts packages/shared/src/content-bindings.ts scripts/verify-content-bindings.ts
git commit -m "feat: add editable CMS templates and bindings"
```

### Task 3: Build a Published-Only Common Route Resolver and Cache Contract

**Files:**
- Create: `apps/web/src/lib/routes/types.ts`
- Create: `apps/web/src/lib/routes/normalize.ts`
- Create: `apps/web/src/lib/routes/resolve-public-route.ts`
- Create: `apps/web/src/lib/routes/cache-tags.ts`
- Create: `scripts/verify-route-resolver.ts`
- Modify: `apps/web/src/lib/data/pages.ts`
- Modify: `apps/web/src/app/[...slug]/page.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Test: `scripts/verify-route-resolver.ts`

**Interfaces:**
- Produces: `resolvePublicRoute(pathname: string): Promise<ResolvedPublicRoute | null>`.
- Produces: `resolvePreviewRoute(pathname: string): Promise<ResolvedPublicRoute | null>`.
- Produces: cache tag helpers `pageTag`, `templateTag`, `globalTag`, and `recordTag`.
- Consumes: content templates and bindings from Task 2.

- [x] **Step 1: Write failing normalization and publication tests**

```ts
import assert from 'node:assert/strict';
import { normalizeRoutePath } from '../apps/web/src/lib/routes/normalize';
import { choosePublishedTree } from '../apps/web/src/lib/routes/resolve-public-route';

assert.equal(normalizeRoutePath('about'), '/about');
assert.equal(normalizeRoutePath('/about/'), '/about');
assert.equal(choosePublishedTree({ draftBlocks: { rootIds: ['draft'] }, publishedBlocks: null }), null);
assert.deepEqual(
  choosePublishedTree({ draftBlocks: { rootIds: ['draft'] }, publishedBlocks: { rootIds: ['live'] } }),
  { rootIds: ['live'] }
);
```

- [x] **Step 2: Run the test and verify failure**

Run: `pnpm exec tsx scripts/verify-route-resolver.ts`

Expected: FAIL because the route modules do not exist.

- [x] **Step 3: Implement the route union and public/preview split**

```ts
export type ResolvedPublicRoute =
  | { kind: 'page'; pathname: string; page: CmsPage; tree: PageBlockTree }
  | { kind: 'record'; pathname: string; recordType: RecordType; record: unknown; template: ContentTemplate }
  | { kind: 'archive'; pathname: string; archive: ArchiveRoute; template: ContentTemplate };
```

Normal resolution must never fall back from `publishedBlocks` to `draftBlocks`. Preview resolution may use the saved draft or the authenticated preview store.

- [x] **Step 4: Attach stable cache tags**

Use `unstable_cache` around database reads with tags such as `page:/about`, `template:article`, `record:insight:<slug>`, and `global:header`. Keep authenticated preview reads outside the public cache.

- [x] **Step 5: Route home and catch-all rendering through the resolver**

Keep the existing hard-coded page body as an explicit transitional fallback function, but call it only when the inventory marks the route as not yet migrated. Remove the `FORCE_STATIC` public cookie bypass because a visitor-controlled cookie must not change the production source of truth.

- [x] **Step 6: Run resolver, web type, and build checks**

Run: `pnpm exec tsx scripts/verify-route-resolver.ts`

Expected: PASS.

Run: `pnpm --filter @envint/web typecheck && pnpm --filter @envint/web build`

Expected: both commands exit 0.

- [x] **Step 7: Commit the route resolver**

```bash
git add apps/web/src/lib/routes apps/web/src/lib/data/pages.ts apps/web/src/app/page.tsx apps/web/src/app/[...slug]/page.tsx scripts/verify-route-resolver.ts
git commit -m "feat: resolve public routes from published CMS data"
```

### Task 4: Render Templates, Bindings, Dynamic Queries, and Global Layout

**Files:**
- Create: `apps/web/src/components/builder/BindingValue.tsx`
- Create: `apps/web/src/components/builder/TemplateRenderer.tsx`
- Create: `apps/web/src/lib/data/dynamic-sources.ts`
- Modify: `apps/web/src/components/builder/TreeRenderer.tsx`
- Modify: `apps/web/src/components/builder/elements/DynamicModules.tsx`
- Modify: `apps/web/src/components/layout/Header.tsx`
- Modify: `apps/web/src/components/layout/Footer.tsx`
- Modify: `apps/web/src/app/layout.tsx`
- Create: `scripts/verify-template-rendering.tsx`
- Test: `scripts/verify-template-rendering.tsx`

**Interfaces:**
- Consumes: `ResolvedPublicRoute`, `ContentBinding`, and `DynamicQueryConfig` from Tasks 2 and 3.
- Produces: `TemplateRenderer({ tree, context })`.
- Produces: `queryDynamicSource(config): Promise<DynamicRecord[]>`.
- Produces: CMS-driven header/footer data with deterministic defaults during migration.

- [ ] **Step 1: Write failing rendering tests**

```tsx
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { BindingValue } from '../apps/web/src/components/builder/BindingValue';

const html = renderToStaticMarkup(
  <BindingValue binding={{ source: 'record', path: 'title' }} context={{ record: { title: 'Envint' } }} />
);
assert.equal(html, 'Envint');
assert.doesNotMatch(html, /undefined|null/);
```

- [ ] **Step 2: Run the rendering test and verify failure**

Run: `pnpm exec tsx scripts/verify-template-rendering.tsx`

Expected: FAIL because `BindingValue` does not exist.

- [ ] **Step 3: Implement bound-field rendering**

Resolve bound text, HTML, dates, URLs, and images before an element renders. Sanitize bound HTML with the existing allowlist. A missing optional binding renders its configured fallback; a missing required binding records a server-side warning and renders a safe empty value.

- [ ] **Step 4: Implement typed dynamic-source queries**

Map only allowlisted sources, filter fields, and sort fields to existing Drizzle/data functions. Clamp limits to `1..100`, use stable secondary ordering, and return an empty list for a valid query with no matches.

- [ ] **Step 5: Make header and footer CMS-driven**

Load primary/footer/social navigation and site settings through cached data functions. During migration, use the current labels and links only when the corresponding CMS records do not exist. Global layout dependencies must attach `global:header`, `global:footer`, and `global:navigation` cache tags.

- [ ] **Step 6: Run rendering, type, lint, and build checks**

Run: `pnpm exec tsx scripts/verify-template-rendering.tsx`

Expected: PASS.

Run: `pnpm --filter @envint/web typecheck && pnpm --filter @envint/web lint && pnpm --filter @envint/web build`

Expected: all commands exit 0.

- [ ] **Step 7: Commit the template renderer**

```bash
git add apps/web/src/components/builder apps/web/src/components/layout apps/web/src/lib/data/dynamic-sources.ts apps/web/src/app/layout.tsx scripts/verify-template-rendering.tsx
git commit -m "feat: render bound CMS templates and global layout"
```

### Task 5: Make Templates and Dynamic Modules Easy to Edit

**Files:**
- Create: `apps/admin/src/app/templates/page.tsx`
- Create: `apps/admin/src/app/templates/actions.ts`
- Create: `apps/admin/src/app/templates/[slug]/page.tsx`
- Create: `apps/admin/src/app/pages/editor/studio/inspectors/BindingInspector.tsx`
- Create: `apps/admin/src/app/pages/editor/studio/inspectors/DynamicQueryInspector.tsx`
- Create: `apps/admin/src/app/pages/editor/studio/GlobalImpactWarning.tsx`
- Modify: `apps/admin/src/app/pages/editor/studio/blocks.tsx`
- Modify: `apps/admin/src/app/pages/editor/studio/StudioState.ts`
- Modify: `apps/admin/src/components/Sidebar.tsx`
- Create: `scripts/verify-editor-contract.ts`
- Test: `scripts/verify-editor-contract.ts`

**Interfaces:**
- Consumes: template/binding/query schemas from Task 2.
- Produces: template list/edit/save/publish flows with the existing studio.
- Produces: labelled inspectors for bindings and collection queries.
- Produces: global-impact confirmation when publishing shared templates or blocks.

- [ ] **Step 1: Write a failing editor-state contract test**

```ts
import assert from 'node:assert/strict';
import { studioReducer, createInitialStudioState } from '../apps/admin/src/app/pages/editor/studio/StudioState';

const state = createInitialStudioState();
const next = studioReducer(state, {
  type: 'UPDATE_BINDING', id: 'title', field: 'text', binding: { source: 'record', path: 'title' }
});
assert.equal(next.tree.nodes.title.content.bindings.text.path, 'title');
assert.equal(next.saveStatus, 'unsaved');
```

- [ ] **Step 2: Run the contract and verify failure**

Run: `pnpm exec tsx scripts/verify-editor-contract.ts`

Expected: FAIL because the reducer does not support `UPDATE_BINDING`.

- [ ] **Step 3: Add template CRUD using the current studio**

Use the same draft/publish/revision behavior as pages. Template publishing must require super-admin authority when its dependency count is greater than one and must show the affected route count before confirmation.

- [ ] **Step 4: Add editor-friendly binding and query controls**

Expose source and field select boxes populated by allowlisted schemas. Dynamic grids expose content type, category/taxonomy filters, sort, item count, pagination mode, visible metadata, and card style. Never require editors to enter JSON.

- [ ] **Step 5: Add shared/global editing indicators**

Show `Page`, `Record`, `Shared template`, or `Global` in the editor header. Bound fields display their source and provide a direct link to the associated content record when the current user can edit it.

- [ ] **Step 6: Run editor contract and admin checks**

Run: `pnpm exec tsx scripts/verify-editor-contract.ts`

Expected: PASS.

Run: `pnpm --filter @envint/admin typecheck && pnpm --filter @envint/admin lint && pnpm --filter @envint/admin build`

Expected: all commands exit 0.

- [ ] **Step 7: Commit the editor workflow**

```bash
git add apps/admin/src/app/templates apps/admin/src/app/pages/editor/studio apps/admin/src/components/Sidebar.tsx scripts/verify-editor-contract.ts
git commit -m "feat: edit shared templates and dynamic content visually"
```

### Task 6: Add Targeted Revalidation and Netlify-Efficient Publishing

**Files:**
- Create: `apps/web/src/app/api/revalidate/route.ts`
- Create: `apps/web/src/lib/revalidation/targets.ts`
- Modify: `apps/admin/src/lib/revalidate-dispatcher.ts`
- Modify: `apps/admin/src/app/pages/actions.ts`
- Modify: `apps/web/src/app/api/cron/publish-scheduled/route.ts`
- Modify: `apps/web/netlify.toml`
- Create: `scripts/verify-revalidation-targets.ts`
- Test: `scripts/verify-revalidation-targets.ts`

**Interfaces:**
- Produces: `collectRevalidationTargets(change): Promise<{ paths: string[]; tags: string[] }>`.
- Produces: signed `POST /api/revalidate` accepting bounded path/tag arrays.
- Consumes: dependency records from Task 2 and cache tags from Task 3.

- [ ] **Step 1: Write failing target-selection tests**

```ts
import assert from 'node:assert/strict';
import { collectStaticRevalidationTargets } from '../apps/web/src/lib/revalidation/targets';

assert.deepEqual(collectStaticRevalidationTargets({ type: 'page', slug: '/about' }), {
  paths: ['/about/'], tags: ['page:/about']
});
assert.deepEqual(collectStaticRevalidationTargets({ type: 'global', key: 'navigation' }), {
  paths: [], tags: ['global:navigation']
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `pnpm exec tsx scripts/verify-revalidation-targets.ts`

Expected: FAIL because the targets module does not exist.

- [ ] **Step 3: Implement secure, bounded revalidation**

Require a server-side shared secret, constant-time comparison, POST requests, same-origin admin dispatch, at most 200 paths/tags per request, normalized paths, and allowlisted tag prefixes. Return per-target success/failure details without exposing the secret.

- [ ] **Step 4: Dispatch revalidation after successful publication**

Page publication invalidates its route and page tag. Record publication invalidates its detail route plus dependent collection/archive tags. Template/global publication invalidates dependency tags. A dispatch failure is recorded and returned to the editor but does not roll back the saved publication.

- [ ] **Step 5: Reduce scheduled execution frequency**

Change the five-minute scheduled publish poll to a frequency justified by the product requirement, defaulting to hourly on Netlify Free. Keep direct scheduled-publish correctness by publishing all records due at or before the invocation time.

- [ ] **Step 6: Run revalidation, type, build, and config checks**

Run: `pnpm exec tsx scripts/verify-revalidation-targets.ts`

Expected: PASS.

Run: `pnpm --filter @envint/web typecheck && pnpm --filter @envint/admin typecheck && pnpm --filter @envint/web build`

Expected: all commands exit 0.

- [ ] **Step 7: Commit credit-efficient publishing**

```bash
git add apps/web/src/app/api/revalidate apps/web/src/lib/revalidation apps/admin/src/lib/revalidate-dispatcher.ts apps/admin/src/app/pages/actions.ts apps/web/src/app/api/cron/publish-scheduled/route.ts apps/web/netlify.toml scripts/verify-revalidation-targets.ts
git commit -m "feat: revalidate CMS content without redeploying"
```

### Task 7: Migrate All Existing Page Families into CMS-Controlled Data

**Files:**
- Create: `packages/shared/src/page-templates/article.ts`
- Create: `packages/shared/src/page-templates/impact.ts`
- Create: `packages/shared/src/page-templates/team-member.ts`
- Create: `packages/shared/src/page-templates/taxonomy.ts`
- Create: `packages/shared/src/page-templates/global-layout.ts`
- Modify: `packages/shared/src/page-trees/*.ts`
- Create: `scripts/migrate-live-parity-cms.ts`
- Create: `scripts/verify-all-cms-routes.ts`
- Modify: `apps/web/src/data/archive-routes.json`
- Test: `scripts/verify-all-cms-routes.ts`

**Interfaces:**
- Consumes: live route inventory from Task 1 and template/binding model from Task 2.
- Produces: idempotent upserts for all unique pages, templates, global blocks, navigation, site settings, articles, impacts, team members, and archives.
- Produces: a coverage report in `docs/migration/11-cms-route-coverage.md`.

- [ ] **Step 1: Write a failing coverage verifier**

```ts
import assert from 'node:assert/strict';
import { loadPublicRouteInventory } from './lib/public-route-inventory';
import { buildCmsCoverage } from './migrate-live-parity-cms';

const inventory = await loadPublicRouteInventory();
const coverage = await buildCmsCoverage(inventory);
assert.equal(coverage.unaccounted.length, 0, `Unaccounted routes:\n${coverage.unaccounted.join('\n')}`);
assert.equal(coverage.hardcodedOnly.length, 0, `Hard-coded routes:\n${coverage.hardcodedOnly.join('\n')}`);
```

- [ ] **Step 2: Run the verifier and record the initial failures**

Run: `pnpm exec tsx scripts/verify-all-cms-routes.ts`

Expected: FAIL with the current routes that exist only as hard-coded implementations or lack editable templates.

- [ ] **Step 3: Create live-faithful shared templates**

Convert article, impact, team-member, and taxonomy layouts into normalized trees with bound fields. Convert header, footer, and shared CTA patterns into global templates. Preserve live copy, image selection, card order, and responsive styles captured in Task 1.

- [ ] **Step 4: Convert unique hard-coded pages into migration trees**

Use current page components and existing `packages/shared/src/page-trees` factories as inputs. Ensure every visible string, image, link, section order, style value, responsive override, and interaction is represented in editable nodes or an explicit CMS-configured module.

- [ ] **Step 5: Implement idempotent migration upserts**

The migration defaults to dry-run. `--apply` inserts missing records and updates only records carrying this migration's provenance/version. It never overwrites an editor-modified draft or published tree without `--force`, and it writes an audit summary before exiting.

- [ ] **Step 6: Run dry-run, apply against the development database, and verify coverage**

Run: `pnpm exec tsx scripts/migrate-live-parity-cms.ts`

Expected: PASS with a deterministic dry-run summary and no database writes.

Run: `pnpm exec tsx scripts/migrate-live-parity-cms.ts -- --apply`

Expected: PASS with inserted/updated/skipped counts.

Run: `pnpm exec tsx scripts/verify-all-cms-routes.ts`

Expected: PASS with zero unaccounted or hard-coded-only public routes.

- [ ] **Step 7: Commit CMS route migration**

```bash
git add packages/shared/src/page-templates packages/shared/src/page-trees scripts/migrate-live-parity-cms.ts scripts/verify-all-cms-routes.ts apps/web/src/data/archive-routes.json docs/migration/11-cms-route-coverage.md
git commit -m "feat: migrate every public route into the CMS"
```

### Task 8: Complete Visual, Responsive, Interaction, and Accessibility Parity

**Files:**
- Modify: `apps/web/src/styles/tokens.css`
- Modify: `apps/web/src/styles/globals.css`
- Modify: `apps/web/src/components/builder/elements/*.tsx`
- Modify: `apps/web/src/components/about/*.tsx`
- Modify: `apps/web/src/components/impact/*.tsx`
- Modify: `apps/web/src/components/enviki/*.tsx`
- Create: `scripts/compare-live-local-visuals.ts`
- Create: `scripts/verify-live-interactions.ts`
- Modify: `docs/migration/10-fidelity-audit.md`
- Create: `docs/migration/12-visual-parity-report.md`
- Test: `scripts/compare-live-local-visuals.ts`
- Test: `scripts/verify-live-interactions.ts`

**Interfaces:**
- Consumes: captures and route inventory from Task 1 plus CMS routes from Task 7.
- Produces: page-family visual difference metrics and screenshot overlays.
- Produces: interaction results for navigation, dropdowns, accordions, filters, load-more, carousels, forms, sharing, and previous/next links.

- [ ] **Step 1: Write visual-comparison assertions**

```ts
assert.equal(result.viewport, '1440x1000');
assert.ok(result.liveScreenshot);
assert.ok(result.localScreenshot);
assert.ok(result.diffRatio >= 0 && result.diffRatio <= 1);
assert.equal(result.hasHorizontalOverflow, false);
```

The test fails when a screenshot is missing, the page errors, text coverage regresses, or horizontal overflow exists.

- [ ] **Step 2: Capture the initial local comparison set**

Run: `pnpm exec tsx scripts/compare-live-local-visuals.ts -- --families=unique,article,impact,team,taxonomy`

Expected: command completes and reports current differences without modifying source files.

- [ ] **Step 3: Correct shared primitives before route overrides**

Match live font files and weights, maximum content width, header height, typography scales, section spacing, cards, buttons, image cropping, and breakpoints. Fix each shared mismatch once in tokens, renderer elements, or shared modules. Add route-specific tree styles only where fresh live captures prove a true exception.

- [ ] **Step 4: Correct interactive behavior**

Match desktop and mobile navigation, dropdown dismissal, carousel controls, accordion keyboard behavior, filter state, pagination/load-more state, form validation/submission responses, share links, and focus visibility. Respect reduced-motion preferences for non-essential animation.

- [ ] **Step 5: Run all page-family comparison and interaction suites**

Run: `pnpm exec tsx scripts/compare-live-local-visuals.ts`

Expected: all supported routes render successfully at all three viewports, contain no unexpected horizontal overflow, and meet the report's content/visual thresholds.

Run: `pnpm exec tsx scripts/verify-live-interactions.ts`

Expected: PASS for every applicable interaction contract.

- [ ] **Step 6: Run accessibility and route audits**

Run: `pnpm test:all`

Expected: every public URL returns its intended status and preserves expected content/SEO coverage.

Run: `pnpm check:all && pnpm build`

Expected: all type checks, lints, and production builds pass.

- [ ] **Step 7: Commit the parity corrections**

```bash
git add apps/web/src/styles apps/web/src/components scripts/compare-live-local-visuals.ts scripts/verify-live-interactions.ts docs/migration/10-fidelity-audit.md docs/migration/12-visual-parity-report.md
git commit -m "fix: match live Envint UI and interactions"
```

### Task 9: Remove Runtime Hard-Coded Page Bodies and Verify Netlify Cutover

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/[...slug]/page.tsx`
- Modify: `apps/web/src/app/*/page.tsx`
- Modify: `apps/web/src/app/impact/[slug]/page.tsx`
- Modify: `apps/web/src/app/member/[slug]/page.tsx`
- Modify: `apps/web/src/app/category/[...slug]/page.tsx`
- Modify: `apps/web/src/app/tag/[slug]/page.tsx`
- Modify: `apps/web/src/app/service/[slug]/page.tsx`
- Modify: `apps/web/src/app/sub-service/[slug]/page.tsx`
- Modify: `apps/web/src/app/sector/[slug]/page.tsx`
- Modify: `apps/web/src/app/theme/[slug]/page.tsx`
- Create: `scripts/verify-no-hardcoded-public-pages.ts`
- Create: `docs/migration/13-cutover-runbook.md`
- Test: `scripts/verify-no-hardcoded-public-pages.ts`

**Interfaces:**
- Consumes: common route resolver and fully migrated CMS content from Tasks 3 and 7.
- Produces: thin route adapters with no page-specific body markup.
- Produces: a cutover and rollback runbook that keeps WordPress available until acceptance.

- [ ] **Step 1: Write the failing hard-coded-page verifier**

```ts
const forbidden = [
  /export default async function[^]*?<section/,
  /FORCE_STATIC/,
  /NEXT_PUBLIC_FORCE_STATIC/,
  /force_static/
];
```

Scan public `page.tsx` route files and fail when they contain page-specific section markup or public source-of-truth bypasses. Allow only route adapters, metadata generation, structured data, and resolver calls.

- [ ] **Step 2: Run the verifier and record current failures**

Run: `pnpm exec tsx scripts/verify-no-hardcoded-public-pages.ts`

Expected: FAIL with the remaining hard-coded route files.

- [ ] **Step 3: Replace page bodies with thin route adapters**

Every adapter normalizes the route, resolves published CMS content, generates metadata from the resolved entity, renders the common route component, and returns `notFound()` for missing/unpublished content. Remove all visitor-controlled static/CMS bypasses.

- [ ] **Step 4: Verify Netlify configuration and production behavior**

Run a Netlify-compatible production build and confirm OpenNext recognizes App Router, route handlers, server actions, ISR, and image optimization. Confirm CMS publishing calls revalidation without initiating a deploy and that cached pages refresh after successful publication.

- [ ] **Step 5: Run the complete acceptance suite**

Run: `pnpm exec tsx scripts/verify-no-hardcoded-public-pages.ts`

Expected: PASS.

Run: `pnpm exec tsx scripts/verify-all-cms-routes.ts`

Expected: PASS with zero unaccounted routes.

Run: `pnpm exec tsx scripts/verify-live-interactions.ts && pnpm exec tsx scripts/compare-live-local-visuals.ts && pnpm test:all && pnpm check:all && pnpm build`

Expected: every command exits 0.

- [ ] **Step 6: Document cutover and rollback**

The runbook includes DNS/domain sequencing, environment variables, database migration order, initial cache warm-up, sitemap and robots checks, monitoring, WordPress freeze timing, rollback triggers, and the procedure for returning the domain to WordPress without losing CMS edits.

- [ ] **Step 7: Commit the CMS-only public runtime**

```bash
git add apps/web/src/app scripts/verify-no-hardcoded-public-pages.ts docs/migration/13-cutover-runbook.md
git commit -m "refactor: serve every public page from the CMS"
```

## Final Verification

- [ ] Confirm `git status --short` contains no unintended generated files or unrelated staged changes.
- [ ] Confirm the user's pre-existing uncommitted changes remain present or are deliberately incorporated with documented provenance.
- [ ] Run `pnpm check:all` and confirm all packages pass type checking and linting.
- [ ] Run `pnpm build` and confirm the production build succeeds.
- [ ] Run `pnpm test:all` and confirm the complete public route audit passes.
- [ ] Run the CMS coverage, interaction, and visual-parity commands and confirm their reports contain no blocking failures.
- [ ] Review the Netlify usage model: no content edit causes a production deployment, cache invalidation is targeted, public page requests are cached, and scheduled work is not polling every five minutes.
