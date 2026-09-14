# Visual, Responsive, and Interaction Parity Report

Verified: 2026-09-14

The public renderer was compared directly with `https://envintglobal.com` at 1440×1000, 768×1024, and 390×844. The repeatable Playwright audit stores fixed-viewport live and local screenshots plus machine-readable results in `envintmigration/site-capture/comparisons/` (ignored build artifacts).

## Representative page-family results

| Family | Route | Desktop diff | Tablet diff | Mobile diff | Live heading coverage | Horizontal overflow |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Unique page | `/` | 0.0378 | 0.0748 | 0.1237 | 0.95 | None |
| Article | `/infosys-and-esg-a-journey-that-started-with-g/` | 0.0921 | 0.3165 | 0.3193 | 1.00 | None |
| Impact | `/impact/brsr-reporting-nbfc/` | 0.1481 | 0.2893 | 0.2779 | 1.00 | None |
| Team | `/member/aseem-dixit/` | 0.1157 | 0.1745 | 0.3625 | 1.00 | None |
| Taxonomy | `/category/enviki/` | 0.4123 | 0.4522 | 0.5113 | 1.00 | None |

The taxonomy pixel ratio is dominated by production image lazy-loading placeholders and content timing; text/heading coverage is complete and layout has no horizontal overflow. The prior content audit in `10-fidelity-audit.md` covers the complete route inventory, while this suite checks visual behavior once per shared layout family. Because repeated routes use a single published CMS template, the representative article, impact, team, and taxonomy checks exercise the same layout code used by every record in each family.

The About mobile hero was corrected from 100vh to the live 65vh composition. Its mobile pixel-diff ratio improved from 0.8877 to 0.3186 while retaining complete heading coverage and no overflow.

## Interaction and accessibility contracts

`pnpm audit:interactions` verifies:

- desktop navigation opens on hover and closes with Escape;
- mobile navigation and groups are keyboard operable and close with Escape;
- representative mobile pages do not overflow horizontally;
- required form fields prevent invalid empty submissions;
- accordions expose `aria-expanded`, `aria-controls`, and labelled regions;
- focus indicators remain visible and non-essential animation respects reduced-motion preferences;
- article share controls use functional email, LinkedIn, X/Twitter, and Facebook share URLs.

## Commands

```bash
pnpm audit:visual -- '--routes=/,/infosys-and-esg-a-journey-that-started-with-g/,/impact/brsr-reporting-nbfc/,/member/aseem-dixit/,/category/enviki/' --limit=5
pnpm audit:interactions
pnpm test:all
pnpm check:all
pnpm build
```

The visual audit fails on HTTP errors, missing captures, less than 80% live-heading coverage, or any unexpected horizontal overflow.
