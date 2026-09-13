# Envint Live-Parity Dynamic CMS Design

## Objective

Convert the existing Envint Next.js website into a fully editable CMS-driven site while matching the public `envintglobal.com` website page by page in content, layout, responsive behavior, interactions, and SEO. The current repository remains the implementation foundation; useful components, media, routes, data, and page-tree work are retained.

The finished system must let a non-technical editor update and publish every public page or its associated structured content without editing source code. WordPress is a migration and fidelity reference, not a runtime dependency.

## Scope

The parity inventory is derived from the live WordPress sitemap and includes:

- Primary marketing pages such as Home, About, Services, Impact, Careers, Connect, and the three practice pages.
- Product, campaign, legal, newsletter, and insights landing pages.
- Article and knowledge pages.
- Impact case-study detail pages.
- Team-member detail pages.
- Category, tag, service, sub-service, sector, theme, and author archives that are publicly accessible.
- Global header, navigation, footer, calls to action, disclaimer behavior, forms, and shared interactive modules.

Parity covers desktop, tablet, and mobile presentation. It includes copy, imagery, typography, spacing, alignment, colors, borders, responsive breakpoints, hover/focus states, animation, pagination or load-more behavior, filters, carousels, accordions, navigation, forms, metadata, and internal links.

## Current State

The repository already has several strong foundations:

- A normalized page-tree model with addressable nodes and responsive styles.
- Draft and published page trees stored in PostgreSQL.
- Page revisions, scheduled publishing, media records, navigation records, and site settings.
- Structured records for insights, impact studies, services, taxonomies, and team members.
- A visual page editor, public tree renderer, and CMS-first checks in public routes.
- Existing page-tree factories and hard-coded page implementations that capture substantial portions of the live design.

The main architectural problem is fragmented ownership. Depending on the route and database state, a page may be rendered from a database tree, a legacy block list, a code-generated page tree, a hard-coded React implementation, or a structured content record. This creates multiple sources of truth and prevents reliable site-wide editing and fidelity.

## Architecture Decision

Use a hybrid structured CMS with one runtime source of truth:

1. Unique marketing and campaign pages use independently editable normalized block trees.
2. Repeated content types use structured records rendered through editable shared templates.
3. Global site elements use reusable global blocks and structured navigation/site settings.
4. The public application resolves every route through a common CMS-aware route resolver.
5. Existing code page trees and hard-coded pages are used only as migration inputs and safe transitional fallbacks. They are removed from the production rendering path after their CMS equivalents pass parity validation.

This design avoids both extremes: duplicating a complete layout tree for every article, and importing opaque WordPress HTML that normal editors cannot safely maintain.

## Content Model

### Unique Pages

Each unique page stores:

- Slug, title, status, and template classification.
- Draft and published normalized block trees.
- SEO title, description, canonical URL, Open Graph image, and index policy.
- Revision history, scheduled publication time, author information, and timestamps.

Each visual node exposes clear content, layout, style, responsive, visibility, and interaction controls. Complex nodes remain composed of smaller editable children so editors can change visible content without replacing an opaque component.

### Structured Collections

Articles, impact studies, team members, services, and taxonomies remain structured records. Their editable fields include all visible content, associated media, relationships, ordering, publishing state, and SEO metadata.

Collection detail pages use shared editable template trees with bound fields such as article title, cover image, publication date, rich content, social links, related content, or adjacent navigation. Editors may edit a record without altering the layout, while authorized users may update the shared template once for every item of that type.

### Dynamic Collections

Grid, list, carousel, and archive nodes store editor-controlled query configuration:

- Content source.
- Category, tag, service, sector, theme, or other filters.
- Sort field and direction.
- Item limit and pagination mode.
- Card template or display variant.
- Visible fields such as excerpt, date, service, or call-to-action label.
- Empty-state behavior.

These nodes query structured records at render time through a typed data-source interface. Query settings are validated before saving and rendering.

### Global Content

The following are editable global content rather than duplicated page nodes:

- Header and primary navigation.
- Footer, social links, addresses, and legal text.
- Reusable calls to action.
- Brand tokens and approved common presentation presets.
- Site-wide contact information and external links.

A global-block update revalidates every dependent route.

## Editor Experience

The editor is designed for normal business users:

- Human-readable page and layer names.
- Direct text editing and rich-text controls.
- Media selection with previews and alt-text fields.
- Drag-and-drop ordering with visible drop locations.
- Desktop, tablet, and mobile previews.
- Simple spacing, alignment, color, typography, and visibility controls.
- Curated layout and card presets for common Envint patterns.
- Dynamic-grid settings expressed as labelled fields rather than JSON.
- Draft preview, undo/redo, revisions, publish, unpublish, and scheduled publish.
- Clear distinction between editing a content record, a single page, a shared template, and a global block.
- Warnings before changes that affect multiple pages.

Advanced styling remains available, but normal editing should not require arbitrary CSS. Locked structural nodes protect data bindings and critical layout wrappers while leaving visible content editable.

## Rendering and Routing

The public application uses one resolution sequence:

1. Normalize the requested pathname.
2. Resolve redirects and canonical route rules.
3. Look up a published unique page, collection record, archive definition, or system route.
4. Load the associated page or shared template tree.
5. Resolve data-bound fields and dynamic collection nodes.
6. Validate and render through the shared tree renderer.
7. Apply global header, footer, metadata, structured data, and caching policy.
8. Return a controlled not-found or unavailable state if no published route exists.

Draft data is only visible through authenticated preview mode. Public visitors never receive an unpublished draft tree.

## WordPress Migration

WordPress and `envintglobal.com` remain untouched during development. Migration is repeatable and idempotent:

1. Discover public URLs from the live sitemap.
2. Capture HTML, metadata, media references, taxonomy relationships, and visual screenshots.
3. Map each URL to a unique page, structured record, archive, or redirect.
4. Convert current hard-coded implementations and existing page-tree factories into validated CMS trees or templates.
5. Import WordPress content and media metadata into the structured CMS model.
6. Preserve slugs, canonical URLs, publication dates, relationships, and redirect behavior.
7. Publish migrated data only after route-level content and visual verification.

During migration, verified CMS routes take precedence and unconverted routes may continue using their existing implementation. Once every route family passes validation, hard-coded production fallbacks are removed.

If the WordPress site changes before cutover, a temporary incremental importer may re-read modified content. No permanent WordPress API dependency remains after cutover.

## Fidelity Verification

Fidelity is verified against fresh live captures rather than documentation alone.

For every public route:

- Compare headings, copy, dates, links, media, metadata, and structured data.
- Capture desktop, tablet, and mobile screenshots at fixed viewports.
- Compare geometry, typography, spacing, colors, imagery, and responsive stacking.
- Exercise menus, dropdowns, carousels, accordions, filters, pagination, load-more controls, forms, share links, and previous/next navigation.
- Check focus behavior, keyboard access, accessible names, color contrast, and reduced-motion behavior where applicable.
- Verify status codes, canonical URLs, sitemap inclusion, redirects, and exactly one appropriate H1 when the live page has a page heading.

Visual differences are tracked by page family and corrected in shared primitives first. Route-specific overrides are used only where the live design genuinely differs.

## Netlify Deployment and Credit Efficiency

The public Next.js application remains compatible with Netlify's current OpenNext runtime while minimizing use of the 300-credit Free plan:

- Prefer static generation and incremental static regeneration for public routes.
- Cache shared data and route output at the CDN/route-cache layer.
- Trigger targeted path or tag revalidation after CMS publication.
- Do not create a production deployment for ordinary content edits.
- Avoid uncached database reads for every public request.
- Keep media in the existing S3-compatible object store and deliver optimized variants.
- Use an external serverless PostgreSQL service through the existing Drizzle data layer instead of consuming Netlify Database credits.
- Keep preview and administrative traffic authenticated and uncached where correctness requires it.
- Limit scheduled work to the existing publishing needs and avoid background polling.

The architecture works on the Free plan for development and low-to-moderate initial traffic, but availability cannot be guaranteed after the monthly hard credit limit is exhausted. The implementation must expose enough usage separation and caching to make a future Netlify plan upgrade operational rather than architectural.

## Reliability and Security

- Validate page trees and dynamic-node configuration at all write and render boundaries.
- Sanitize rich text and restrict unsafe links or embeds.
- Preserve Clerk authentication and editor/super-admin authorization boundaries.
- Use draft/published separation atomically so failed publishes do not corrupt the live tree.
- Keep page revisions for rollback and auditability.
- Fail gracefully for missing media, deleted relationships, empty collections, or temporarily unavailable data.
- Log migration failures with route and source identifiers, and make imports retryable without duplication.
- Revalidation failure must not invalidate the saved publication; it is retried and reported separately.
- Secrets and database credentials remain server-side environment variables.

## Compatibility and Change Strategy

The conversion is incremental and preserves working behavior:

- Existing public URLs and SEO contracts remain stable.
- Current uncommitted work is preserved and incorporated rather than overwritten.
- Current components and page trees are reused when they match the live design.
- The renderer gains typed bindings and template support without breaking existing schema-v2 page trees.
- Schema changes include explicit versioning and migrations.
- Hard-coded routes are removed from production only after their replacement passes parity checks.

## Testing Strategy

Testing covers:

- Unit tests for tree validation, data bindings, route resolution, query configuration, and cache tags.
- Integration tests for draft save, preview, publish, scheduled publish, revision restore, and targeted revalidation.
- Contract tests for structured content sources and template bindings.
- Route audits for all sitemap URLs, status codes, metadata, links, and visible content.
- Browser tests for responsive layout and interactive behavior.
- Visual regression snapshots at fixed desktop, tablet, and mobile viewports.
- Failure-path tests for missing records, database errors, invalid trees, unavailable media, and revalidation errors.
- Production builds, linting, type checks, and Netlify-compatible deployment verification.

## Acceptance Criteria

The project is complete when:

1. Every intended public live URL is accounted for as a CMS page, structured record, archive, redirect, or intentional retirement.
2. All public page families match the current live site within the agreed visual and content audit tolerances across desktop, tablet, and mobile.
3. Every visible page element can be edited through a unique page, associated structured record, shared template, global block, navigation, or site setting.
4. A normal editor can save, preview, publish, schedule, and restore changes without source-code access.
5. Public rendering no longer depends on hard-coded page bodies or WordPress.
6. CMS publication uses targeted revalidation and does not require a Netlify production deployment.
7. The full type-check, lint, build, route, interaction, and visual-regression suites pass.
8. WordPress can remain as a temporary rollback source and can later be retired without changing the new site's runtime architecture.
