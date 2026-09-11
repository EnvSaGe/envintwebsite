# Envint Website Migration Specification & Executive Summary

**Project:** Headless Migration of `https://envintglobal.com/`  
**From:** WordPress 6.x + Elementor Pro (GoDaddy Hosting)  
**To:** Next.js (App Router) on Netlify + Neon PostgreSQL + AWS S3 + Admin CMS  
**Date:** August 31, 2026 (Final Approved Specification Revision)  
**Status:** Ready for Implementation Planning

---

## 1. Executive Summary

This specification establishes the comprehensive technical blueprint for migrating Envint’s corporate website from a legacy WordPress/Elementor monolith to a high-performance, secure, headless Next.js architecture.

### Key Architectural Outcomes:
1. **Edge-First Performance:** Static HTML served from Netlify’s edge network with reduced database overhead on visitor page loads.
2. **Independent CMS Publishing:** Editors manage content in a dedicated Admin CMS (`admin.envintglobal.com`). Neon PostgreSQL stores relational data and triggers authenticated on-demand ISR revalidation via signed HMAC POST (`/api/revalidate`), updating public pages on the next visit without triggering Netlify production deployments.
3. **Explicit Content Format Discriminator:** Database schema explicitly differentiates migrated legacy HTML (`content_format = 'HTML'`) from newly authored block JSON (`content_format = 'BLOCKS'`), guaranteeing 100% markup fidelity for historical articles.
4. **SEO Preservation & Enhancement:** Full preservation of 150 indexable URLs, title tags, and meta descriptions, with resolution of historical SEO issues (such as missing alt text across 82.5% of images and missing `<h1>` tags).
5. **Clean Semantic Component Architecture:** 168 disparate WordPress URLs and Elementor layouts are consolidated into **15 reusable React page templates** backed by evidence-based design tokens.
6. **Safe Cutover & Rollback:** The live WordPress site remains 100% untouched during development, serving as an immediate rollback fallback during DNS cutover.

---

## 2. Reconciled Content & Asset Inventory

| Asset / Content Type | Old WordPress Source | Volume / Count | Target Next.js Architecture |
| :--- | :--- | :--- | :--- |
| **Insights & Articles** | `post` (Yoast SEO) | **54 published** | Neon `insights` table (`content_format: 'HTML'`) + `ArticleDetailTemplate` |
| **Impact Case Studies** | `impact` CPT | **26 published** | Neon `impact_case_studies` table + `ImpactDetailTemplate` |
| **Team Member Bios** | `member` / `ex_team` | **15 published** | Neon `team_members` table (14 standalone routes + 1 featured on About) |
| **Core Service Pillars** | `page` / `service` tax | **3 pillars** | Neon `services` table + `ServiceDetailTemplate` |
| **Sub-Services** | `sub_service` tax | **8 sub-services** | Neon `sub_services` table + `impact_sub_services` junction |
| **Industry Sectors** | `sector` tax | **11 sectors** | Neon `sectors` table (`sector_id` FK) |
| **Practice Themes** | `theme` tax | **10 themes** | Neon `themes` table (`theme_id` FK) |
| **Categories & Tags** | `category` / `tag` tax | **8 terms** | Neon `categories` & `tags` tables + junction tables |
| **Core Static Pages** | `page` | **8 core pages** | Next.js Static Pages (Home, About, Services, Impact, Careers, Connect, ESQ, Mapsense) |
| **Campaign Page** | `page` | **1 page** | `/connect-gbc2024/` (Retained as KEEP via `CampaignLandingTemplate`) |
| **Lead Generation Forms** | `wpcf7_contact_form` | **3 forms** | React Form Components + Neon `lead_submissions` table |
| **Master Media Assets** | Live HTML references | **298 unique** | AWS S3 Bucket + Netlify Image CDN via `next/image` |

---

## 3. Corrected URL Classification Breakdown

A total of **168 unique URLs** are mapped in [`docs/migration/02-url-migration.csv`](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/02-url-migration.csv):

```
Total Scope: 168 URLs
├── KEEP (Active Public Pages/Archives): 150
│   ├── Insights / Articles Detail: 54
│   ├── Taxonomy Archives (Service, Sector, Theme, Category, Tag): 39
│   ├── Impact Case Studies Detail: 26
│   ├── Team Member Profiles: 14
│   ├── Insights Hub Pages (/enviki/, /envision/, etc.): 5
│   ├── Core Service Detail Pages: 3
│   ├── Core Static Pages (Home, About, Services, Impact, Careers, Connect, ESQ, Mapsense): 8
│   └── Campaign Landing Page (/connect-gbc2024/): 1
│
├── 301_REDIRECT (Permanent Canonical & Legacy Consolidation): 14
│   ├── Legacy Article Slugs (Canonical Targets): 7
│   ├── Legacy Staging Routes (/v3/*): 3
│   ├── Non-Trailing Slash Duplicate (/envision): 1
│   ├── Legacy Careers Duplicate (/careers/): 1
│   ├── Naked CPT Archive Root (/member/): 1
│   └── Broken 404 URL Recovery (/eu-taxonomy-framework-a-clear-guide/): 1
│
├── 410_REMOVE (Obsolete Implementation Endpoints): 2
│   └── Elementor HF Templates (/elementor-hf/header/, /elementor-hf/footer/): 2
│
└── REVIEW (Author Archives Pending Search Console Review): 2
    └── /author/fiona/, /author/anand/
```

---

## 4. Reusable Page Template Catalog (15 Templates)

All 150 `KEEP` routes are handled by **15 clean React page templates**:

| # | Template Name | Key Routes Handled | Data Source |
| :--- | :--- | :--- | :--- |
| 1 | `HomeTemplate` | `/` | Neon `pages` (`home`) + featured impacts & insights |
| 2 | `AboutTemplate` | `/about/` | Neon `pages` (`about`) + 15 `team_members` (including Anand Krishnamurthy) |
| 3 | `ServicesLandingTemplate` | `/services/` | Neon `services` + `sub_services` |
| 4 | `ServiceDetailTemplate` | `/sustainability-integration/`, `/responsible-investment/`, `/climate-action/` | Neon `services` (by slug) + related impacts |
| 5 | `ImpactListingTemplate` | `/impact/` | Neon `impact_case_studies` + `sectors` + `themes` |
| 6 | `ImpactDetailTemplate` | `/impact/[slug]/` (26 case studies) | Neon `impact_case_studies` (by slug) |
| 7 | `TeamMemberTemplate` | `/member/[slug]/` (14 public routes) | Neon `team_members` (by slug) |
| 8 | `InsightsHubTemplate` | `/enviki/`, `/envision/`, `/behind-the-buzz/`, `/glossary-zone/`, `/how-to-articles/` | Neon `categories` + filtered `insights` |
| 9 | `ArticleDetailTemplate` | `/[slug]/` (54 articles) | Neon `insights` (by slug) + author relation |
| 10 | `TaxonomyArchiveTemplate` | `/category/*`, `/tag/*`, `/sector/*`, `/theme/*`, `/service/*`, `/sub-service/*` (39 archives) | Neon taxonomy queries |
| 11 | `CareersTemplate` | `/careers-at-envint/` | Neon `pages` (`careers`) + culture content |
| 12 | `ContactTemplate` | `/connect/` | Neon `pages` (`connect`) + Contact Form |
| 13 | `NewsletterTemplate` | `/esq/` | Neon `pages` (`esq`) + Newsletter Form |
| 14 | `ProductLandingTemplate` | `/mapsense/` | Neon `pages` (`mapsense`) + Screening Tool Demo Form |
| 15 | `CampaignLandingTemplate` | `/connect-gbc2024/` | Neon `pages` (`connect-gbc2024`) + Event Form |

---

## 5. System Architecture & Publishing Workflow

```mermaid
flowchart LR
    subgraph CMS ["Admin CMS (admin.envintglobal.com)"]
        UI["Editor Dashboard"] --> Auth["Auth.js Google OAuth\n+ Allowlist & RBAC"]
        Auth --> DB[("Neon PostgreSQL")]
        UI -->|Pre-Signed S3 Upload (@aws-sdk/v3)| S3[("AWS S3 Bucket")]
    end

    subgraph Reval ["Edge Revalidation"]
        Auth -->|Signed HMAC POST /api/revalidate| ISR["Next.js Revalidation Handler"]
    end

    subgraph Public ["Public Site (envintglobal.com)"]
        ISR --> Cache["Netlify Edge Cache"]
        Cache --> Visitors["Website Visitors"]
        S3 --> ImageCDN["Netlify Image CDN / next/image"]
        ImageCDN --> Visitors
    end
```

### Key Architectural Decisions:
1. **Netlify Credit Semantics:** Routine content publishing requires no new production deployment and therefore no production-deployment credit charge. Revalidation may still consume web-request/function-compute/bandwidth credits.
2. **Authentication:** Managed Google OAuth via **Auth.js (NextAuth v5)** with server-side email allowlist and RBAC. No local password hashes are stored.
3. **Revalidation Security:** HMAC-SHA256 signature validation with timestamp-based replay protection (300s window), constant-time comparison, body-size limits (10 KB), and tag/path allowlisting.
4. **Media Strategy:** Master source assets stored in **AWS S3** (using `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` for pre-signed uploads) and transformed into responsive WebP/AVIF formats on-demand via **Netlify Image CDN (`next/image`)**.
5. **Staging Environment Protection:** Staging builds generate static `X-Robots-Tag: noindex, nofollow` headers at build time (when `CONTEXT !== 'production'`), avoiding Edge Function runtime costs, paired with Netlify password protection.
6. **Technical SEO Endpoints:** `robots.txt` explicitly allows `/_next/` to ensure full JS/CSS rendering by crawlers; dynamic `sitemap.xml` indexes all 150 KEEP routes.

---

## 6. Deliverables Index

All detailed specifications are in [`docs/migration/`](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration):

1. **[01-current-site-audit.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/01-current-site-audit.md):** Complete site audit, reconciliation of content counts, and taxonomy multiplicity analysis.
2. **[02-url-migration.csv](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/02-url-migration.csv):** Single canonical 168-row URL matrix (150 KEEP, 14 301_REDIRECT, 2 410_REMOVE, 2 REVIEW).
3. **[03-redirect-plan.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/03-redirect-plan.md):** 14 explicit 301 redirect rules, 2 explicit 410 Gone directives, Netlify `_redirects`, and `next.config.js`.
4. **[04-content-model.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/04-content-model.md):** Relational SQL DDL, `content_format` discriminator, `impact_sub_services` junction table, alt-text model, and Auth.js tables.
5. **[05-architecture.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/05-architecture.md):** Public site, Admin CMS, AWS SDK v3, HMAC revalidation, build-context staging protection, and Netlify billing semantics.
6. **[06-seo-migration-plan.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/06-seo-migration-plan.md):** Schema.org JSON-LD definitions, dynamic 150-route `sitemap.xml`, `robots.txt` (`/_next/` allowed), and static build-context staging protection.
7. **[07-ui-component-map.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/07-ui-component-map.md):** Evidence-based design tokens (`Neue Montreal`, `#2f7abe`, 1140px width), 15 page templates, and ContentRenderer hierarchy.
8. **[08-testing-and-cutover.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/08-testing-and-cutover.md):** 18 automated quality gates, Playwright visual comparison suite, dynamic DNS cutover protocol, and rollback plan.
