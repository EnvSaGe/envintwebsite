# 01 — Comprehensive Current Site Audit

**Target Website:** `https://envintglobal.com/`  
**Current Tech Stack:** WordPress 6.x + Elementor Pro + LiteSpeed Cache + Yoast SEO + Astra Child Theme  
**Date of Audit:** August 31, 2026 (Final Specification Revision)  
**Auditor:** Lead Migration Engineer

---

## 1. Executive Summary

Envint (`https://envintglobal.com/`) is a premier sustainability and ESG advisory firm assisting clients across global markets with sustainability integration, responsible investment, and climate action. The current production site is hosted on WordPress with Elementor Pro. While the frontend visual design is modern, the underlying WordPress implementation presents architectural limitations:

1. **Heavy Elementor Markup & Payload:** Pages contain deep DOM nesting (`elementor-element-xxxx`, `e-container`), high bundle overhead, and duplicate inline stylesheets.
2. **Fragile Content Modeling:** Core business entities (such as Impact Case Studies, Team Members, and Services) are fragmented across generic WordPress post types, custom post types (`impact`, `ex_team`/`member`), Elementor template parts (`elementor_library`, `elementor-hf`), and taxonomies.
3. **SEO Deficiencies in Current Site:**
   - **82.5% Missing Image Alt Text:** 908 out of 1,101 image instances across the site lack descriptive `alt` attributes.
   - **Missing H1 Headings:** Key pages including `/connect/`, `/careers-at-envint/`, `/mapsense/`, and `/esq/` lack semantic `<h1>` tags or use generic div styling.
   - **Canonical Mismatches & Duplicate Slugs:** 11 active URLs feature canonical tags pointing to alternate URLs (e.g. `/careers/` vs `/careers-at-envint/`, `/understanding-emissions/` vs `/ghg-emissions-explained-a-clear-guide/`, `/envision` vs `/envision/`).
   - **Broken 404 URL in Discovery:** `/eu-taxonomy-framework-a-clear-guide/` returns a 404 HTTP status on the live site.
4. **Publishing Workflow:** Content updates in WordPress require database writes through a heavy admin interface and dynamic server rendering on PHP/LiteSpeed.

The proposed headless architecture migrates the site to **Next.js (App Router) on Netlify**, backed by **Neon PostgreSQL**, **AWS S3** for master media storage, Netlify Image CDN for on-demand image optimization, and an independent **Admin CMS** (`admin.envintglobal.com`).

---

## 2. Full Inventory of Existing Website Assets

### 2.1 Post Types & Content Breakdown (Reconciled Source Data)

| Post Type / Entity | Status | Total Count | Active / Published | Migration Role |
| :--- | :--- | :--- | :--- | :--- |
| **`post` (Insights / Articles)** | Published | 54 | 54 | Migrate to Neon `insights` table (`content_format: 'HTML'`) |
| **`page` (Core & Campaign Pages)** | Published | 17 | 17 (16 core + 1 GBC campaign) | Migrate to Neon `pages` table & Next.js static templates |
| **`impact` (Impact Case Studies)** | Published | 26 | 26 | Migrate to Neon `impact_case_studies` table |
| **`member` / `ex_team` (Team Members)** | Published | 15 | 15 (14 standalone routes + 1 featured on About) | Migrate to Neon `team_members` table |
| **`elementor_library` (Templates)** | Published | 15 | 0 (Internal) | Do NOT migrate as pages; convert sections to reusable React components |
| **`elementor-hf` (Header/Footer)** | Published | 2 | 0 (Internal) | Obsolete endpoints; return 410 Gone. Convert to semantic React Header/Footer |
| **`wpcf7_contact_form` (Forms)** | Published | 3 | 3 | Convert to Next.js React forms + Server Actions / API route |
| **`attachment` (Media)** | Inherit | 3,396 master | 298 live unique | Migrate clean master assets to AWS S3 |
| **`popup` / `popup_theme`** | Published | 11 | 0 (Internal) | Replace legacy popups with modern accessible React dialog modals |
| **`nav_menu_item`** | Published | 12 | 12 | Standardize into Next.js navigation configuration |

#### Content Reconciliation Notes:
1. **Impact Count Reconciliation:** The WordPress database and XML export contain exactly **26 published `impact` CPT records**. In crawl captures, 27 URLs were found under the `/impact/*` path pattern because `https://envintglobal.com/impact/` is the core Impact listing page/hub. The true source-of-truth count is **26 published case studies + 1 listing hub page**.
2. **Team Member Reconciliation:** The WordPress export contains **15 published team member records** (`ex_team` / `member`). 14 records have active `/member/[slug]/` routes in `seo.csv`. 1 record—**`anand-krishnamurthy` (ID 3689)** (Co-Founder & Partner)—is featured on the `/about/` page leadership section and team slider. His complete biographical content is preserved in the Neon `team_members` table and rendered on `/about/`. No synthetic standalone route or redirect is created.
3. **Articles Reconciliation:** There are exactly **54 published WordPress posts**. With duplicate non-trailing slash `/envision` corrected to a 301 canonical redirect to `/envision/`, the article count is confirmed at 54.
4. **GBC Campaign Route (`/connect-gbc2024/`):** Retained as `KEEP` and rendered via `CampaignLandingTemplate` to prevent SEO risk from premature deletion or redirection.

---

### 2.2 Taxonomies & Term Multiplicity Analysis

| Taxonomy | Slug | Term Count | Active Terms Found | Multiplicity in Source Data | Target Model |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sub-Service** | `sub_service` | 8 | `bhr-assessment`, `capacity-building`, `esap`, `esg-dd`, `footprinting`, `market-assessment`, `materiality`, `reporting-disclosure` | **Many-to-Many** (7 impact studies belong to multiple sub-services, e.g. `esap` + `esg-dd`) | `sub_services` table + `impact_sub_services` junction |
| **Service** | `service` | 3 | `sustainability-integration`, `responsible-investment`, `climate-action` | Many-to-One (1 per impact in source) | `services` table (`service_id` FK) |
| **Sector** | `sector` | 11 | `agriculture`, `automotive`, `bfsi`, `consumer`, `energy`, `healthcare`, `infra-real-estate`, `manufacturing`, `metals-mining`, `multiple`, `technology` | Many-to-One (1 per impact in source) | `sectors` table (`sector_id` FK) |
| **Theme** | `theme` | 10 | `bhr`, `biodiversity`, `built-environment`, `circular-economy`, `decarbonization`, `dei`, `electric-mobility`, `esg-data`, `sustainable-supply-chain`, `water` | Many-to-One (1 per impact in source) | `themes` table (`theme_id` FK) |
| **Category** | `category` | 5 | `envision`, `enviki`, `featured`, `glossary-zone`, `how-to-articles` | Many-to-Many (Articles can have multiple categories) | `categories` table + `insight_categories` junction |
| **Tag** | `tag` | 3 | `explainer`, `how-to-article`, `glossary-zone` | Many-to-Many (Articles can have multiple tags) | `tags` table + `insight_tags` junction |

---

### 2.3 Media & File Storage Inventory

- **Total WordPress Content Archive Size:** 5.11 GB (`envint-wp-content.zip`, 25,947 files).
- **`wp-content/uploads/` Total Files:** 4,947 files.
  - **Auto-generated Resized Variants (`-NxN`):** 1,551 files (e.g., `-150x150`, `-300x200`, `-1024x768`).
  - **Master Source Assets:** 3,396 files.
  - **Active Web Page References:** 298 unique media assets across all captured pages.
- **Font Licensing Note:** Custom font `Neue Montreal` is loaded via `@font-face` from source uploads. Self-hosting and redistributing these font files in the Next.js repository requires verifying organizational webfont license rights prior to launch.

---

## 3. URL Classification & Count Summary

Across the 168 identified site URLs (167 captured + 1 campaign route), the finalized breakdown is:

```
Total Identified URLs: 168
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
└── REVIEW (Author Archives Pending Traffic Audit): 2
    └── /author/fiona/, /author/anand/ (200 status on live; pending Search Console review)
```

---

## 4. Current Site SEO Issues & Improvement Opportunities

1. **Alt Text Coverage (82.5% Missing):**
   - *Current State:* 908 image instances lack alt text entirely.
   - *Target State:* Informational images require descriptive alt text; decorative images explicitly use `alt=""` via an `is_decorative` boolean flag in the content model.
2. **Missing `<h1>` Tags on Key Pages:**
   - *Current State:* Pages like `/connect/`, `/careers-at-envint/`, `/mapsense/`, and `/esq/` have no `<h1>` or use styled `<div>` elements.
   - *Target State:* Every Next.js page template renders a single, semantically descriptive `<h1>`.
3. **Canonical Normalization:**
   - *Current State:* Multiple URLs (e.g. `/careers/`, `/understanding-emissions/`, `/envision`) exist on the server with canonicals pointing elsewhere.
   - *Target State:* Edge 301 redirects eliminate duplicate crawling paths.
4. **Structured Data Completeness:**
   - *Current State:* Yoast outputs basic `WebPage` and `Article` schema graphs.
   - *Target State:* Server-rendered Schema.org JSON-LD graphs for `WebSite`, `Organization`, `Article`, `Person`, and `Service`.

---

## 5. Elements That MUST NOT Be Migrated

1. **Elementor DOM & CSS Bloat:** No `elementor-element-*`, `e-con-*`, or inline widget stylesheets.
2. **WordPress Auto-Generated Thumbnail Clones:** 1,551 `-NxN` image files pruned; only master source files uploaded to S3.
3. **Implementation Endpoints:** `/elementor-hf/*`, `/wp-admin/*`, `/wp-login.php`, and `?post_type=popup` return HTTP 410 Gone / 404 Not Found.
4. **Third-Party Plugin Residue:** Unused tables, transients, LiteSpeed cache headers, and ThinkRank tables.
5. **Secrets & Credentials:** All WordPress credentials and salts excluded from the codebase.
