# CMS Route Coverage

Captured and verified: 2026-09-14

The current `envintglobal.com` sitemap inventory contains 152 unique public routes. Every route is represented by either an editable page tree or a structured CMS record rendered through an editable shared template. WordPress remains a migration and visual-fidelity reference only; it is not a runtime dependency.

| Route family | Live routes | CMS source | Editable layout |
| --- | ---: | --- | --- |
| Unique pages | 16 | `pages` | Per-page published/draft block trees |
| Articles | 54 | `insights` | `article` template |
| Author archives | 2 | Derived published insight records | `author` template |
| Taxonomy archives | 39 | Derived published insight records | `taxonomy` template |
| Impact studies | 26 | `impact_case_studies` | `impact` template |
| Team routes | 15 | `team_members` plus member archive | `team-member` template |
| **Total** | **152** |  |  |

## Applied development database state

- 18 published pages have editable `published_blocks` trees (the 16 canonical live pages plus two retained CMS pages).
- 8 shared/global templates are published.
- 54 articles, 26 impact studies, and 15 team profiles are published.
- 288 dependency mappings connect content and templates to affected public routes for targeted revalidation.
- A second migration run completed with `inserted=0` and `updated=0`, confirming editor-owned content is not overwritten.

## Verification commands

```bash
pnpm exec tsx scripts/verify-all-cms-routes.ts
pnpm cms:migrate
pnpm cms:schema
pnpm cms:migrate --apply
pnpm cms:verify
```

`cms:schema` applies only the additive CMS migration files. It intentionally avoids schema-push inference so legacy authentication tables and columns cannot be renamed or deleted. `cms:migrate` defaults to dry-run; applying it inserts missing data and changes existing content only when `--force` is explicitly supplied or the record carries this migration's provenance.
