# 10 — Full 168-Page Fidelity Audit (live captures vs current build)

Reference captures: `C:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html`  ·  Build base: `http://localhost:3000`

> **How it works:** every KEEP route in `02-url-migration.csv` is fetched from the running build and
> compared against its live capture within `<main>` (or body minus global header/footer). Metrics:
> CONTENT-based coverage (each live heading h1-h3 + Elementor visual heading VH is found if its
> text exists in the build as a heading OR anywhere in the visible text - so cleaner semantic tags
> in the build are allowed, matching content/wording rather than broken live tags), wording
> containment (shared content words), plus SEO checks (exactly one H1 whose text matches a live
> heading). Verdict: `OK` >= 0.85 - `PARTIAL` >= 0.6 - `DIFF` below; `OK*` = live page has no
> static content (e.g. /esq/). Re-run:
> `python scripts/audit_all_pages.py --out docs/migration/10-fidelity-audit.md` (dev server on :3000).

> **Member pages caveat:** the 14 `/member/*` captures are blank on the live site (header/footer
> only - the WordPress member template renders nothing, and the raw bios in the WP DB are polluted
> with Google-Sheets / AI-chat HTML). The build intentionally renders full bios from the WordPress
> XML export, so low member-page scores are expected and not regressions. Bios in `team.json` were
> cleaned to plain text (`scripts/clean_team_bios.py`) and match the XML exactly.

## Summary

- **DIFF**: 14
- **OK**: 134
- **OK***: 2
- **SKIP**: 18

## Page-by-page

| Status | Route | Template | Score | H1 match | Head-cov | Word-cont | Notes |
| :--- | :--- | :--- | ---: | :--- | ---: | ---: | :--- |
| OK | `/infosys-and-esg-a-journey-that-started-with-g/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/circular-economy-a-world-without-waste/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/ghg-protocols-made-easy-to-follow/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/life-cycle-assessment-demystified/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/ghg-emissions-explained-a-clear-guide/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/how-to-set-science-based-targets/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/difference-between-net-zero-and-carbon-neutrality/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/the-eu-taxonomy-demystified/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/extended-producer-responsibility-epr/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/how-to-calculate-your-products-carbon-footprint/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/carbon-accounting-a-practical-guide/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/eu-cbam-compliance-guide/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/how-to-become-an-esg-analyst/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/esg-reporting-in-india-past-and-present/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/integrated-sustainability-and-esg-services/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/indias-new-labour-codes/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/climate-risk-assessment-a-strategic-guide-for-businesses/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/ecovadis-advancing-esg-across-the-supply-chain/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/sbti-financial-institutions-net-zero-standard/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/impact-reporting-a-practical-guide/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/cdp-reporting-disclosing-climate-impacts/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/esg-risk-assessment-a-complete-guide/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/choosing-the-right-esg-consulting-firm/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/esg-compliance-in-india-key-guidelines/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/esg-reporting/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/indias-climate-finance-taxonomy/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/indias-carbon-credit-offset-mechanism-bees-new-guidelines-for-a-credible-carbon-market/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/what-is-an-environmental-product-declaration-epd/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/gresb-setting-the-global-esg-benchmark-for-real-estate-and-infrastructure/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/life-cycle-assessment-lca/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/sbtis-corporate-net-zero-standard-version-2/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/brsr-compliance-for-the-top-1000-listed-entities/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/sustainability-reporting/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/epd-vs-pcf-differences-and-benefits-for-product-sustainability/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/lca-pcf-and-epd-for-product-sustainability/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/indias-carbon-market-potential-catalyst-for-sustainable-development/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/brsr-for-value-chain-compliance-and-implementation/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/ccpas_greenwashing_guidelines/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/upskilling-with-green/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/brsr-getting-ready-for-round-2/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/a-season-of-environment-orders/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/the-journey-to-transformative-impact-begins-with-good-intentions/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/esg-risk-assessment/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/move-towards-standardization-of-sustainability-reporting/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/environmental-sustainability-in-india-build-back-better/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/policy-actions-for-clean-water-post-covid/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/climate-sdgs-more-needed-beyond-the-union-budgets-sprinkling-of-schemes/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/sewage-and-its-hidden-value/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/niti-aayog-cwrm-and-the-missing-industrial-link/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/the-water-case-for-renewable-energy/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/planning-to-reuse-the-last-drop/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/a-vision-for-waste-management-in-india/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/a-unified-water-ministry-is-a-good-idea/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/the-future-is-in-plastics-again/` | ArticleDetailTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/` | HomeTemplate | 0.94 | yes | 0.93 | 0.95 |  |
| OK* | `/esq/` | NewsletterTemplate | 1.0 | no | 1.0 | 1.0 | live page has no static content |
| OK | `/sustainability-integration/` | ServiceDetailTemplate | 0.93 | yes | 0.94 | 0.93 |  |
| OK | `/climate-action/` | ServiceDetailTemplate | 0.93 | yes | 0.93 | 0.93 |  |
| OK | `/impact/` | ImpactListingTemplate | 1.0 | yes | 1.0 | 0.99 |  |
| OK | `/responsible-investment/` | ServiceDetailTemplate | 0.93 | yes | 0.93 | 0.93 |  |
| OK | `/mapsense/` | ProductLandingTemplate | 0.99 | yes | 1.0 | 0.97 |  |
| OK | `/connect/` | ContactTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/about/` | AboutTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/careers-at-envint/` | CareersTemplate | 0.91 | yes | 0.86 | 0.96 |  |
| OK | `/services/` | ServicesLandingTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/enviki/` | InsightsHubTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/envision/` | InsightsHubTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/glossary-zone/` | InsightsHubTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/behind-the-buzz/` | InsightsHubTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/how-to-articles/` | InsightsHubTemplate | 1.0 | yes | 1.0 | 1.0 |  |
| OK | `/impact/brsr-reporting-nbfc/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/sustainability-reporting-for-a-re-developer/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/scope-3-emissions-assessment-for-data-centres/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/es-risks-for-large-green-ammonia-plant/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/esms-performance-for-national-highway-projects/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/market-assessment-biodegradable-plastics/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/footprinting-decarbonisation-indian-corporates/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/es-due-diligence-human-rights-assessment/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/esg-due-diligence-healthcare-delivery/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/climate-risk-assessment-tcfd-real-estate-developers/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/responsible-investment-healthcare-focussed-pe-firm/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/due-diligence-business-esg-regenerative-agriculture/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/esg-risk-assessment-bfsi-sector/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/knowledge-workshop-global-climate-fund/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/risk-assessment-management-agri-impact-fund/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/livelihood-enhancement-program-national-highway/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/human-rights-assessment-gems-jewellery/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/entry-strategy-electric-mobility-charging/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/esg-due-diligences-multiple-deep-tech-businesses/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/materiality-issues-sector-research-real-estate/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/desk-based-due-diligence-rare-metals-supply-chain/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/esg-database-voluntary-sustainability-standards/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/water-wastewater-india-partnership/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/dutch-mnc-in-plastic-packaging-sector/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/gresb-assessment-multiple-re-developers/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/impact/market-assessment-recycling-end-of-life-vehicles/` | ImpactDetailTemplate | 1.0 | no | 1.0 | 1.0 |  |
| DIFF | `/member/aseem-dixit/` | TeamMemberTemplate | 0.55 | no | 1.0 | 0.11 | first 0/144 words align |
| DIFF | `/member/swati-verma/` | TeamMemberTemplate | 0.55 | no | 1.0 | 0.1 | first 0/184 words align |
| DIFF | `/member/arthita-ray/` | TeamMemberTemplate | 0.55 | no | 1.0 | 0.1 | first 0/169 words align |
| DIFF | `/member/vidisha-somashekar/` | TeamMemberTemplate | 0.54 | no | 1.0 | 0.09 | first 0/179 words align |
| DIFF | `/member/suktara-chakraborti/` | TeamMemberTemplate | 0.57 | no | 1.0 | 0.13 | first 0/186 words align |
| DIFF | `/member/mabelle-david/` | TeamMemberTemplate | 0.57 | no | 1.0 | 0.13 | first 0/241 words align |
| DIFF | `/member/kavya-singh/` | TeamMemberTemplate | 0.54 | no | 1.0 | 0.07 | first 0/125 words align |
| DIFF | `/member/jay-monga/` | TeamMemberTemplate | 0.55 | no | 1.0 | 0.11 | first 0/180 words align |
| DIFF | `/member/fiona-mathias/` | TeamMemberTemplate | 0.54 | no | 1.0 | 0.08 | first 0/152 words align |
| DIFF | `/member/abhishek-bhure/` | TeamMemberTemplate | 0.54 | no | 1.0 | 0.07 | first 0/140 words align |
| DIFF | `/member/aastha-agrawal/` | TeamMemberTemplate | 0.55 | no | 1.0 | 0.11 | first 0/156 words align |
| DIFF | `/member/lucille-andrade/` | TeamMemberTemplate | 0.53 | no | 1.0 | 0.06 | first 0/180 words align |
| DIFF | `/member/manish-r-jain/` | TeamMemberTemplate | 0.57 | no | 1.0 | 0.14 | first 0/256 words align |
| DIFF | `/member/vibhav-nuwal/` | TeamMemberTemplate | 0.54 | no | 1.0 | 0.07 | first 0/110 words align |
| OK | `/category/all-categories/` | TaxonomyArchiveTemplate | 0.99 | no | 1.0 | 0.98 |  |
| OK | `/category/enviki/` | TaxonomyArchiveTemplate | 0.97 | no | 1.0 | 0.94 |  |
| OK | `/category/envision/` | TaxonomyArchiveTemplate | 0.99 | no | 1.0 | 0.98 |  |
| OK | `/category/featured/` | TaxonomyArchiveTemplate | 1.0 | no | 1.0 | 0.99 |  |
| OK | `/category/enviki/glossary-zone/` | TaxonomyArchiveTemplate | 0.98 | no | 1.0 | 0.97 |  |
| OK | `/category/enviki/how-to-articles/` | TaxonomyArchiveTemplate | 0.97 | no | 1.0 | 0.94 |  |
| OK* | `/category/sustainability-featured/` | TaxonomyArchiveTemplate | 1.0 | no | 1.0 | 0.18 | live page has no static content |
| OK | `/category/uncategorized/` | TaxonomyArchiveTemplate | 1.0 | no | 1.0 | 1.0 |  |
| OK | `/tag/explainer/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.93 |  |
| OK | `/tag/glossary-zone/` | TaxonomyArchiveTemplate | 0.95 | no | 1.0 | 0.9 |  |
| OK | `/tag/how-to-article/` | TaxonomyArchiveTemplate | 0.94 | no | 1.0 | 0.89 |  |
| OK | `/service/climate-action/` | TaxonomyArchiveTemplate | 0.98 | no | 1.0 | 0.96 |  |
| OK | `/service/responsible-investment/` | TaxonomyArchiveTemplate | 0.99 | no | 1.0 | 0.98 |  |
| OK | `/service/sustainability-integration/` | TaxonomyArchiveTemplate | 0.98 | no | 1.0 | 0.96 |  |
| OK | `/sub-service/bhr-assessment/` | TaxonomyArchiveTemplate | 0.94 | no | 1.0 | 0.88 |  |
| OK | `/sub-service/capacity-building/` | TaxonomyArchiveTemplate | 0.94 | no | 1.0 | 0.88 |  |
| OK | `/sub-service/esap/` | TaxonomyArchiveTemplate | 0.99 | no | 1.0 | 0.97 |  |
| OK | `/sub-service/esg-dd/` | TaxonomyArchiveTemplate | 0.99 | no | 1.0 | 0.97 |  |
| OK | `/sub-service/footprinting/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.93 |  |
| OK | `/sub-service/market-assessment/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.92 |  |
| OK | `/sub-service/materiality/` | TaxonomyArchiveTemplate | 0.94 | no | 1.0 | 0.89 |  |
| OK | `/sub-service/reporting-disclosure/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.92 |  |
| OK | `/sector/agriculture/` | TaxonomyArchiveTemplate | 0.97 | no | 1.0 | 0.93 |  |
| OK | `/sector/automotive/` | TaxonomyArchiveTemplate | 0.93 | no | 1.0 | 0.87 |  |
| OK | `/sector/bfsi/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.92 |  |
| OK | `/sector/consumer/` | TaxonomyArchiveTemplate | 0.94 | no | 1.0 | 0.88 |  |
| OK | `/sector/energy/` | TaxonomyArchiveTemplate | 0.92 | no | 1.0 | 0.83 |  |
| OK | `/sector/healthcare/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.92 |  |
| OK | `/sector/infra-real-estate/` | TaxonomyArchiveTemplate | 0.95 | no | 1.0 | 0.89 |  |
| OK | `/sector/metals-mining/` | TaxonomyArchiveTemplate | 0.97 | no | 1.0 | 0.94 |  |
| OK | `/sector/multiple/` | TaxonomyArchiveTemplate | 0.97 | no | 1.0 | 0.94 |  |
| OK | `/sector/technology/` | TaxonomyArchiveTemplate | 0.98 | no | 1.0 | 0.95 |  |
| OK | `/theme/bhr/` | TaxonomyArchiveTemplate | 0.94 | no | 1.0 | 0.88 |  |
| OK | `/theme/circular-economy/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.92 |  |
| OK | `/theme/decarbonization/` | TaxonomyArchiveTemplate | 0.97 | no | 1.0 | 0.95 |  |
| OK | `/theme/electric-mobility/` | TaxonomyArchiveTemplate | 0.89 | no | 1.0 | 0.78 |  |
| OK | `/theme/esg-data/` | TaxonomyArchiveTemplate | 0.96 | no | 1.0 | 0.92 |  |
| OK | `/theme/sustainable-supply-chain/` | TaxonomyArchiveTemplate | 0.95 | no | 1.0 | 0.91 |  |
| OK | `/theme/water/` | TaxonomyArchiveTemplate | 0.93 | no | 1.0 | 0.86 |  |
| OK | `/connect-gbc2024/` | CampaignLandingTemplate | 1.0 | yes | 1.0 | 1.0 |  |

## Deltas for 14 pages needing work

### `/member/lucille-andrade/` (DIFF, score 0.53)

- Live H1: *(none)*
- Build H1: *Lucille Andrade*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Lucille Andrade

### `/member/vidisha-somashekar/` (DIFF, score 0.54)

- Live H1: *(none)*
- Build H1: *Vidisha Somashekar*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Vidisha Somashekar

### `/member/kavya-singh/` (DIFF, score 0.54)

- Live H1: *(none)*
- Build H1: *Kavya Singh*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Kavya Singh

### `/member/fiona-mathias/` (DIFF, score 0.54)

- Live H1: *(none)*
- Build H1: *Fiona Mathias*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Fiona Mathias

### `/member/abhishek-bhure/` (DIFF, score 0.54)

- Live H1: *(none)*
- Build H1: *Abhishek Bhure*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Abhishek Bhure

### `/member/vibhav-nuwal/` (DIFF, score 0.54)

- Live H1: *(none)*
- Build H1: *Vibhav Nuwal*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Vibhav Nuwal

### `/member/aseem-dixit/` (DIFF, score 0.55)

- Live H1: *(none)*
- Build H1: *Aseem Dixit*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Aseem Dixit

### `/member/swati-verma/` (DIFF, score 0.55)

- Live H1: *(none)*
- Build H1: *Swati Verma*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Swati Verma

### `/member/arthita-ray/` (DIFF, score 0.55)

- Live H1: *(none)*
- Build H1: *Arthita Ray*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Arthita Ray

### `/member/jay-monga/` (DIFF, score 0.55)

- Live H1: *(none)*
- Build H1: *Jay Monga*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Jay Monga

### `/member/aastha-agrawal/` (DIFF, score 0.55)

- Live H1: *(none)*
- Build H1: *Aastha Agrawal*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Aastha Agrawal

### `/member/suktara-chakraborti/` (DIFF, score 0.57)

- Live H1: *(none)*
- Build H1: *Suktara Chakraborti*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Suktara Chakraborti

### `/member/mabelle-david/` (DIFF, score 0.57)

- Live H1: *(none)*
- Build H1: *Mabelle David*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Mabelle David

### `/member/manish-r-jain/` (DIFF, score 0.57)

- Live H1: *(none)*
- Build H1: *Manish R Jain*
- Live headings missing in build (0):
- Build headings not in live (1):
  - H1: Manish R Jain
