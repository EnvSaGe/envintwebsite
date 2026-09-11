# 07 — UI Component Hierarchy & Design Token System

This document translates the visual evidence (`site-capture/screenshots/` and computed CSS extracted from live rendered HTML) into an evidence-based design token system and reusable React component hierarchy for **Next.js**.

---

## 1. Evidence-Based Design Tokens

### 1.1 Color Palette (Extracted from Live CSS & Screenshots)

```css
:root {
  /* Brand Primary & Interactive Elements (Evidence: .contactform input[type="submit"], CTA buttons) */
  --color-primary: #2f7abe;
  --color-primary-hover: #045cb4;
  --color-primary-subtle: #f0f5fa;

  /* Typography & Neutrals (Evidence: Global Elementor computed styles & inline styles) */
  --color-text-primary: #111111;
  --color-text-body: #334155;
  --color-text-muted: #54595f;
  --color-text-inverse: #ffffff;

  /* Backgrounds (Evidence: Sections, Cards, Body) */
  --color-bg-white: #ffffff;
  --color-bg-subtle: #fafafa;
  --color-bg-ice: #f0f5fa;
  --color-bg-dark: #001c35;

  /* Borders & Dividers (Evidence: Form input underlines & card borders) */
  --color-border-light: #e2e8f0;
  --color-border-subtle: #8d8d8d;
  --color-border-divider: #d1d5db;

  /* Status */
  --color-success: #61ce70;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

---

### 1.2 Typography & Scale (Evidence: `@font-face` Source Declarations)

- **Primary Custom Font Family:** `"Neue Montreal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Loaded via `@font-face`: Light (300), Regular (400), Medium (500), Bold (700).
  - *Pre-Launch Licensing Requirement:* Confirm organizational self-hosting / webfont license rights for `Neue Montreal` OTF assets prior to production launch. Fallback: `Inter` / system sans-serif.
- **Secondary / Fallback:** `Roboto, sans-serif`

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */

  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.65;

  /* Font Weights */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-bold: 700;
}
```

---

### 1.3 Container Widths & Responsive Breakpoints (Evidence: Computed CSS)

- **Container Max Width:** `1140px` (`--container-max-width: 1140px`).
- **Header Height:** `76px` (sticky navbar).
- **Border Radii:** `6px` (buttons/inputs), `8px` (cards), `12px` (modals).
- **Breakpoints:**
  - `sm`: `640px` (Mobile landscape)
  - `md`: `767px` (Tablet breakpoint from WordPress media queries)
  - `lg`: `1024px` (Desktop)
  - `xl`: `1140px` (Max content container)
  - `2xl`: `1440px` (Wide displays)

---

## 2. Reusable Page Template Catalog (15 Templates)

All 150 `KEEP` routes are handled by **15 clean React page templates**:

| # | Template Name | Associated Routes / Path Pattern | Layout Description |
| :--- | :--- | :--- | :--- |
| 1 | **`HomeTemplate`** | `/` | Hero section, 3 Service feature cards, Impact highlights, Enviki knowledge carousel, Client sectors, Newsletter CTA. |
| 2 | **`AboutTemplate`** | `/about/` | Company vision & mission, leadership philosophy, 15-member Team grid with bio modals (including Anand Krishnamurthy), advisory network. |
| 3 | **`ServicesLandingTemplate`** | `/services/` | Services umbrella landing page, capability matrix, interactive sub-service breakdown, case study links. |
| 4 | **`ServiceDetailTemplate`** | `/sustainability-integration/`, `/responsible-investment/`, `/climate-action/` | Service pillar hero, methodologies, key offerings, related impact studies, client contact CTA. |
| 5 | **`ImpactListingTemplate`** | `/impact/` | Impact case study portfolio with interactive Sector & Theme filter bars, dynamic cards, metrics highlights. |
| 6 | **`ImpactDetailTemplate`** | `/impact/[slug]/` (26 case studies) | Detailed case study with Client Type, Challenge, Solution, Outcome, Metrics badges, and related projects. |
| 7 | **`TeamMemberTemplate`** | `/member/[slug]/` (14 public routes) | Individual team member bio, leadership role, published articles, LinkedIn/social links. |
| 8 | **`InsightsHubTemplate`** | `/enviki/`, `/envision/`, `/behind-the-buzz/`, `/glossary-zone/`, `/how-to-articles/` | Curated category knowledge hubs, featured articles, search & tag filter bar. |
| 9 | **`ArticleDetailTemplate`** | `/[slug]/` (54 articles) | Article header, author info, reading time, table of contents, dual HTML/Blocks content renderer, social share bar, related reads. |
| 10 | **`TaxonomyArchiveTemplate`** | `/category/*`, `/tag/*`, `/sector/*`, `/theme/*`, `/service/*`, `/sub-service/*` (39 archives) | Taxonomy archive listing articles and case studies tagged under the specific term. |
| 11 | **`CareersTemplate`** | `/careers-at-envint/` | Culture overview, perks, open roles listing, resume submission form. |
| 12 | **`ContactTemplate`** | `/connect/` | Office contact info, interactive lead generation form with subject selection, Google Maps embed. |
| 13 | **`NewsletterTemplate`** | `/esq/` | ESQ Newsletter subscription page with email capture and past issue archive. |
| 14 | **`ProductLandingTemplate`** | `/mapsense/` | Dedicated product landing page for Mapsense environmental & social screening tool with demo request CTA. |
| 15 | **`CampaignLandingTemplate`** | `/connect-gbc2024/` | Dedicated campaign landing page with event-specific lead capture form. |

---

## 3. UI Component Hierarchy Diagram

```
components/
├── layout/
│   ├── Header.tsx                  # Sticky navbar with logo, nav links, and Connect CTA
│   ├── NavigationDropdown.tsx      # Desktop mega-menu for Services and Insights
│   ├── MobileNavDrawer.tsx         # Accessible mobile slide-out menu
│   ├── Footer.tsx                  # Semantic footer with quick links, legal, and ESQ subscribe
│   └── Container.tsx               # Standard 1140px centered wrapper
│
├── sections/
│   ├── HeroSection.tsx             # Dynamic hero with heading, subtext, and dual CTA buttons
│   ├── ServicesGrid.tsx            # 3-column service pillar cards
│   ├── ImpactFeaturedSection.tsx   # Curated case studies carousel / grid
│   ├── InsightsCarousel.tsx        # Latest articles slider
│   ├── TeamGrid.tsx                # Grid of leadership & team cards with modal triggers
│   ├── StatsCounter.tsx            # Metric counter bar
│   └── CtaBanner.tsx               # Global call-to-action banner
│
├── cards/
│   ├── ServiceCard.tsx             # Service pillar summary card with hover effects
│   ├── ImpactCard.tsx              # Case study card with sector/theme badges
│   ├── InsightCard.tsx             # Article card with thumbnail, read time, and excerpt
│   ├── TeamMemberCard.tsx          # Team headshot, name, title, and bio link
│   └── Badge.tsx                   # Tag / Sector / Theme pill badge
│
├── forms/
│   ├── ContactForm.tsx             # Full Name, Location, Email, Phone, Company, Help Category, Message
│   ├── NewsletterForm.tsx          # Single-input email subscription form
│   ├── GbcEventForm.tsx            # Campaign lead download form
│   └── FormControls.tsx            # Accessible Input, Select, Textarea, SubmitButton
│
├── content/
│   ├── ContentRenderer.tsx         # Discriminates content_format ('HTML' vs 'BLOCKS')
│   ├── HtmlContentRenderer.tsx     # Sanitized HTML renderer for 54 legacy articles
│   ├── BlockContentRenderer.tsx    # Block JSON renderer for new CMS content
│   ├── TableOfContents.tsx         # Auto-generated sticky table of contents
│   ├── SocialShareBar.tsx          # LinkedIn, Twitter/X, Email share triggers
│   ├── AuthorBio.tsx               # Author card at end of articles
│   └── Breadcrumbs.tsx             # Accessible breadcrumb trail with JSON-LD
│
└── seo/
    └── JsonLd.tsx                  # Dynamic Schema.org JSON-LD injector
```
