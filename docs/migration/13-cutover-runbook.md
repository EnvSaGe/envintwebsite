# Netlify CMS Cutover and Rollback Runbook

Verified: 2026-09-14

## Deployment model

The public Next.js application is an SSG/ISR site on Netlify. Published pages and records are read from external Neon PostgreSQL, master media remains in S3, and Netlify's OpenNext adapter supplies App Router, route-handler, ISR, tag/path revalidation, and Image CDN support. CMS publishing sends a signed HMAC request to `/api/revalidate`; it does not invoke a build hook or create a production deployment.

Netlify should be configured for the `apps/web` package. The checked-in `apps/web/netlify.toml` builds `.next`, deploys the Netlify scheduled function, and runs scheduled publishing hourly. Do not pin the OpenNext adapter; Netlify applies its current tested adapter automatically.

## Required production configuration

Configure secrets in the relevant Netlify public-site or admin-CMS environment, never in Git:

- `DATABASE_URL` — pooled Neon PostgreSQL connection string for public and admin applications.
- `REVALIDATION_SECRET_TOKEN` — identical random secret in public and admin environments.
- `PUBLIC_SITE_URL` or `NEXT_PUBLIC_SITE_URL` — `https://envintglobal.com` in the admin environment.
- `DRAFT_PREVIEW_SECRET` — identical preview secret where preview requests are created and consumed.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — shared preview store.
- `CRON_SECRET` — authenticates the hourly scheduled-publish function.
- Clerk variables required by the admin application.
- S3 credentials and bucket variables required by admin media uploads.

## Pre-cutover sequence

1. Reduce the existing DNS TTL to 300 seconds at least one day before cutover.
2. Freeze WordPress content edits only for the final data-delta window; keep the WordPress host and database intact.
3. Back up WordPress files/database and take a Neon snapshot or branch.
4. Apply additive schema changes with `pnpm cms:schema --apply`.
5. Dry-run `pnpm cms:migrate`, review counts, then run `pnpm cms:migrate --apply`.
6. Confirm `pnpm cms:verify` reports 18 editable published pages, 8 published templates, 54 insights, 26 impacts, 15 team records, and dependency mappings.
7. Run `pnpm audit:cms-adapters`, `pnpm exec tsx scripts/verify-all-cms-routes.ts`, `pnpm test:all`, `pnpm check:all`, and `pnpm build`.
8. Deploy a protected Netlify preview and verify `/`, `/about/`, one article, one impact story, one member, one archive, `/sitemap.xml`, and `/robots.txt`.
9. In the CMS, publish a harmless staging text change. Confirm the signed revalidation succeeds, the next request regenerates only affected cached paths, and Netlify shows no new deploy.
10. Warm the homepage, main navigation destinations, sitemap, and one representative route per shared template.

## Domain cutover

1. Add and verify `envintglobal.com` and `www.envintglobal.com` in the Netlify project.
2. Use the exact DNS target records shown by Netlify for the project; do not copy targets from another Netlify site.
3. Wait for Netlify TLS issuance, then confirm HTTPS and the preferred host redirect.
4. Check canonical URLs, Open Graph metadata, robots directives, sitemap URLs, forms, preview, CMS publishing, and cache refresh.
5. Watch Netlify function errors/usage, Neon connections, S3 image responses, and form submissions closely for the first 24 hours.
6. Keep WordPress available at a private origin for at least seven days; do not delete it during acceptance.

## Rollback triggers

Rollback when a widespread 5xx/404 condition, authentication failure, database unavailability, missing critical media, invalid canonical/robots output, or failed publishing/revalidation cannot be corrected within the agreed incident window.

## Rollback procedure

1. Pause CMS publishing and record the last successful CMS revision and timestamp.
2. Restore the previous DNS records that point `envintglobal.com` and `www` to WordPress.
3. Confirm WordPress HTTPS, homepage, navigation, forms, sitemap, and robots responses.
4. Keep Neon and S3 unchanged. CMS edits remain stored and revisioned even while WordPress serves traffic.
5. Export or record any edits created during the incident window before reconciling content.
6. Diagnose and validate the Netlify release on its deploy URL, then repeat the pre-cutover acceptance checks before a second DNS switch.

Rollback is DNS/runtime-only; it must never destroy the new CMS database or editor revision history.

## Credit controls

- Normal publishing revalidates targeted tags/paths and never triggers a production deployment.
- Public routes are statically generated or ISR-cached with a one-hour fallback TTL.
- PostgreSQL and master image storage are external to Netlify's compute pool.
- Scheduled publishing runs hourly, not every five minutes; immediate editor publishing does not wait for cron.
- Monitor Netlify bandwidth, function invocations, image transformations, and deploy usage before the monthly credit limit becomes a service risk.
