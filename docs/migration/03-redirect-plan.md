# 03 — Comprehensive Redirect & Route Removal Specification

This document details every permanent (301) redirect rule, HTTP 410 Gone directive, and preserved REVIEW route for the Next.js migration of `envintglobal.com`.

---

## 1. Single Source of Truth & Generation Strategy

1. **Canonical Matrix as Single Truth:** All deployment redirect rules (`_redirects` and `next.config.ts`) and all QA redirect tests are automatically generated from [`docs/migration/02-url-migration.csv`](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/02-url-migration.csv) via a generator script (`scripts/generate-redirects.ts`).
2. **Preventing Drift:** No redirect rules are maintained by hand in separate configuration files. Running `pnpm generate:redirects` updates both Netlify `public/_redirects` and `apps/web/next.config.ts` simultaneously.
3. **Explicit Equivalence for 301s:** 301 redirects are strictly applied where a genuine 1:1 equivalent content destination exists.
4. **Obsolete Implementation Endpoints:** `/elementor-hf/header/` and `/elementor-hf/footer/` return **HTTP 410 (Gone)** rather than soft-redirecting to the homepage.
5. **Preserved Author Archives (Under Review):** In accordance with client review instructions, `/author/fiona/` and `/author/anand/` are **preserved during initial migration** (HTTP 200, self-canonical, indexable article listings using `TaxonomyArchiveTemplate`). They are not 404'd, 410'd, noindexed, or redirected until historical traffic, backlink, and Search Console data are analyzed.

---

## 2. Redirect & Status Code Groups

### Group A: Canonical Mismatch / Superseded Article Slugs (7 rules - 301 Redirect)

| Source URL (Legacy Slug) | Target URL (Canonical) | HTTP Status | Rationale |
| :--- | :--- | :--- | :--- |
| `/understanding-emissions/` | `/ghg-emissions-explained-a-clear-guide/` | 301 | Canonical target consolidation |
| `/a-practical-guide-to-carbon-accounting/` | `/carbon-accounting-a-practical-guide/` | 301 | Canonical target consolidation |
| `/brsr-compliance-for-the-top-1000-listed-entities-and-their-value-chain-partners/` | `/brsr-compliance-for-the-top-1000-listed-entities/` | 301 | Canonical target consolidation |
| `/esg-compliance-in-india/` | `/esg-compliance-in-india-key-guidelines/` | 301 | Canonical target consolidation |
| `/esg-reporting-in-india/` | `/esg-reporting-in-india-past-and-present/` | 301 | Canonical target consolidation |
| `/choosing-the-right-esg-consulting-firm-in-india-a-strategic-guide/` | `/choosing-the-right-esg-consulting-firm/` | 301 | Canonical target consolidation |
| `/minimizing-impact-utilizing-lca-pcf-and-epd-for-product-sustainability/` | `/lca-pcf-and-epd-for-product-sustainability/` | 301 | Canonical target consolidation |

---

### Group B: Duplicate & Staging Routes (5 rules - 301 Redirect)

| Source URL | Target URL | HTTP Status | Rationale |
| :--- | :--- | :--- | :--- |
| `/envision` | `/envision/` | 301 | Non-trailing slash duplicate route redirected to canonical |
| `/careers/` | `/careers-at-envint/` | 301 | Legacy footer duplicate redirected to canonical careers page |
| `/v3/corporate-sustainability/` | `/sustainability-integration/` | 301 | Legacy staging route redirected to modern service equivalent |
| `/v3/responsible-investment/` | `/responsible-investment/` | 301 | Legacy staging route redirected to modern service equivalent |
| `/v3/climate-action/` | `/climate-action/` | 301 | Legacy staging route redirected to modern service equivalent |

---

### Group C: Base Taxonomy Root & 404 Recovery (2 rules - 301 Redirect)

| Source URL | Target URL | HTTP Status | Rationale |
| :--- | :--- | :--- | :--- |
| `/member/` | `/about/` | 301 | Naked CPT archive root redirected to About page team section |
| `/eu-taxonomy-framework-a-clear-guide/` | `/the-eu-taxonomy-demystified/` | 301 | Recovers captured 404 inbound links to active EU taxonomy guide |

---

### Group D: Obsolete Implementation Endpoints (2 rules - 410 Gone)

| Source URL | HTTP Status | Rationale |
| :--- | :--- | :--- |
| `/elementor-hf/header/` | 410 | Obsolete Elementor template endpoint with no public equivalent |
| `/elementor-hf/footer/` | 410 | Obsolete Elementor template endpoint with no public equivalent |

---

### Group E: Preserved Routes (2 rules - Under Review)

| Source URL | HTTP Status | Handling in Initial Migration |
| :--- | :--- | :--- |
| `/author/fiona/` | 200 | Preserved as live indexable listing via `TaxonomyArchiveTemplate` pending Search Console audit |
| `/author/anand/` | 200 | Preserved as live indexable listing via `TaxonomyArchiveTemplate` pending Search Console audit |

---

## 3. Generated Edge Configuration Snippet (`public/_redirects`)

```text
# ==========================================================
# ENVINT GLOBAL - AUTO-GENERATED FROM 02-url-migration.csv
# DO NOT EDIT MANUALLY - Run: pnpm generate:redirects
# ==========================================================

# Group A: Superseded Slugs / Canonical Targets (301)
/understanding-emissions/                           /ghg-emissions-explained-a-clear-guide/         301!
/a-practical-guide-to-carbon-accounting/            /carbon-accounting-a-practical-guide/            301!
/brsr-compliance-for-the-top-1000-listed-entities-and-their-value-chain-partners/ /brsr-compliance-for-the-top-1000-listed-entities/ 301!
/esg-compliance-in-india/                           /esg-compliance-in-india-key-guidelines/        301!
/esg-reporting-in-india/                            /esg-reporting-in-india-past-and-present/       301!
/choosing-the-right-esg-consulting-firm-in-india-a-strategic-guide/ /choosing-the-right-esg-consulting-firm/ 301!
/minimizing-impact-utilizing-lca-pcf-and-epd-for-product-sustainability/ /lca-pcf-and-epd-for-product-sustainability/ 301!

# Group B: Duplicate & Staging Routes (301)
/envision                                           /envision/                                      301!
/careers/                                           /careers-at-envint/                             301!
/v3/corporate-sustainability/                       /sustainability-integration/                    301!
/v3/responsible-investment/                         /responsible-investment/                        301!
/v3/climate-action/                                 /climate-action/                                301!

# Group C: Base Taxonomy & 404 Recovery (301)
/member/                                            /about/                                         301!
/eu-taxonomy-framework-a-clear-guide/               /the-eu-taxonomy-demystified/                   301!

# Group D: Obsolete Implementation Endpoints (410 Gone)
/elementor-hf/*                                     /                                               410!

# Security & WordPress Cleanup (404 Not Found)
/wp-admin/*                                         /                                               404!
/wp-login.php                                       /                                               404!
/xmlrpc.php                                         /                                               404!
```
