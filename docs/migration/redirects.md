# Redirect Plan & Status Code Specification

Please refer to the full specification in [03-redirect-plan.md](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/03-redirect-plan.md).

### Summary of Rules & Counts:
- **Group A:** Canonical Targets / Superseded Article Slugs (7 rules - 301 Redirect)
- **Group B:** Duplicate & Staging Routes (`/envision`, `/careers/`, `/v3/*`) (5 rules - 301 Redirect)
- **Group C:** Base Taxonomy Root (`/member/`) & 404 Recovery (`/eu-taxonomy-framework-a-clear-guide/`) (2 rules - 301 Redirect)
- **Group D:** Obsolete Elementor Implementation Endpoints (2 rules - 410 Gone)
- **Group E:** Preserved Author Archives (`/author/fiona/`, `/author/anand/`) (2 rules - Preserved HTTP 200 via `TaxonomyArchiveTemplate`)
- **Security Cleanup:** `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php` (404 Not Found)

Total Explicit Permanent 301 Redirects: **14 rules**  
Total Explicit 410 Gone Removals: **2 rules**  
Total Preserved Routes Under Review: **2 rules**  
*All rules are dynamically generated from [`02-url-migration.csv`](file:///c:/Users/rahul/Desktop/Envint/envintwebsite/docs/migration/02-url-migration.csv).*
