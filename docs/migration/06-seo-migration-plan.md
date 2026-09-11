# 06 — Comprehensive SEO Preservation & Enhancement Plan

This document defines the strict SEO preservation protocol, structured data schemas, and technical crawling rules for the migration of **Envint** (`https://envintglobal.com/`).

---

## 1. SEO Migration Principles

1. **Zero Unnecessary URL Churn:** Every established, indexable URL with ranking history is preserved at its exact path.
2. **Title & Meta Description Fidelity:** Existing titles and meta descriptions are imported 1:1 into the database to protect organic search rankings.
3. **Structured Heading Hierarchy:** Every page template renders exactly one semantic `<h1>` tag followed by logical `<h2>` and `<h3>` structures.
4. **Accessible Alt-Text Strategy:** Informational images require descriptive alt text; decorative images explicitly use `alt=""` via an `is_decorative` boolean flag in the content model.
5. **Comprehensive Sitemap Coverage:** The dynamic XML sitemap includes all 150 finalized `KEEP` routes (core pages, `/connect-gbc2024/`, service pages, retained taxonomy archives, insights, impacts, and team profiles).

---

## 2. Dynamic Technical SEO Endpoints

### 2.1 Next.js `app/robots.ts` (Crawling Directives)
Search engine crawlers need access to modern JavaScript and CSS bundles to execute and render React Server Components. Therefore, `/_next/` is **not** disallowed.

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.CONTEXT === 'production' || process.env.NEXT_PUBLIC_SITE_URL === 'https://envintglobal.com';

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/search/', '/?s='],
    },
    sitemap: 'https://envintglobal.com/sitemap.xml',
  };
}
```

---

### 2.2 Next.js `app/sitemap.ts` (150 Indexable Routes)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { 
  getPublishedInsights, 
  getPublishedImpacts, 
  getPublishedPages, 
  getTeamMembers,
  getAllPublishedTaxonomies 
} from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://envintglobal.com';

  const [pages, insights, impacts, members, taxonomies] = await Promise.all([
    getPublishedPages(),
    getPublishedInsights(),
    getPublishedImpacts(),
    getTeamMembers(),
    getAllPublishedTaxonomies(),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [
    // 1. Core & Campaign Pages (9 pages)
    ...pages.filter(p => !p.noIndex).map((p) => ({
      url: `${baseUrl}/${p.slug === 'home' ? '' : p.slug + '/'}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: p.slug === 'home' ? 1.0 : 0.8,
    })),
    // 2. 54 Published Insights
    ...insights.filter(i => !i.noIndex).map((i) => ({
      url: `${baseUrl}/${i.slug}/`,
      lastModified: i.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // 3. 26 Published Impact Case Studies
    ...impacts.filter(imp => !imp.noIndex).map((imp) => ({
      url: `${baseUrl}/impact/${imp.slug}/`,
      lastModified: imp.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // 4. 14 Public Team Member Profiles
    ...members.filter(m => m.hasStandaloneRoute).map((m) => ({
      url: `${baseUrl}/member/${m.slug}/`,
      lastModified: m.updatedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
    // 5. 39 Retained Taxonomy Archives (Categories, Tags, Sectors, Themes, Services, Sub-services)
    ...taxonomies.map((t) => ({
      url: `${baseUrl}/${t.taxonomyType}/${t.slug}/`,
      lastModified: t.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return sitemapEntries;
}
```

---

### 2.3 Dynamic `llms.txt`
Generates `/llms.txt` for AI crawlers matching the high-quality WordPress structure:

```typescript
// app/llms.txt/route.ts
import { NextResponse } from 'next/server';
import { getPublishedInsights, getPublishedImpacts, getTeamMembers } from '@/lib/db';

export async function GET() {
  const [insights, impacts, members] = await Promise.all([
    getPublishedInsights(),
    getPublishedImpacts(),
    getTeamMembers(),
  ]);

  let content = `# Envint: Sustainability & ESG Services Firm\n\n`;
  content += `> Envint is a sustainability & ESG solutions firm. We help clients integrate sustainability, channelize responsible investment and enable climate action.\n\n`;
  
  content += `## Core Services\n`;
  content += `- [Sustainability Integration](https://envintglobal.com/sustainability-integration/)\n`;
  content += `- [Responsible Investment](https://envintglobal.com/responsible-investment/)\n`;
  content += `- [Climate Action](https://envintglobal.com/climate-action/)\n\n`;

  content += `## Insights & Thought Leadership (54 Articles)\n`;
  insights.forEach((i) => {
    content += `- [${i.title}](https://envintglobal.com/${i.slug}/)\n`;
  });

  content += `\n## Impact Case Studies (26 Case Studies)\n`;
  impacts.forEach((imp) => {
    content += `- [${imp.title}](https://envintglobal.com/impact/${imp.slug}/)\n`;
  });

  content += `\n## Team & Leadership\n`;
  members.forEach((m) => {
    content += `- [${m.name} - ${m.roleTitle}](https://envintglobal.com/member/${m.slug}/)\n`;
  });

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

---

## 3. Staging Environment Noindex Architecture (Zero Runtime Overhead)

Rather than running Edge Middleware on every staging request, staging protection combines:
1. **Netlify Access Control:** Staging branches and preview deployments are protected by Netlify password protection / private workspace access.
2. **Build-Context Static Headers:** During staging/preview builds (`process.env.CONTEXT !== 'production'`), a pre-build script generates a static `public/_headers` file containing:
   ```text
   /*
     X-Robots-Tag: noindex, nofollow
   ```
   Production builds (`CONTEXT === 'production'`) omit this header file completely, preventing any runtime function invocation or risk of accidental production de-indexing.

---

## 4. Structured Data (JSON-LD) Specification

Server-rendered Schema.org graphs are injected into `<head>`:
- **`Organization` & `WebSite`:** Global corporate identity and social profiles.
- **`Article`:** Rendered for all 54 Insight posts.
- **`Person` / `ProfilePage`:** Rendered for Team Member bio profiles.
- **`Service`:** Rendered for core Service pillar pages.

---

## 5. Audit of Existing Site SEO Fixes

| SEO Element | WordPress Flaw Discovered | Next.js Resolved State |
| :--- | :--- | :--- |
| **Image Alt Text** | 82.5% (908 images) lack alt text | Alt text is enforced in Neon schema; decorative images explicitly use `alt=""` |
| **Heading Hierarchy** | Missing H1s on `/connect/`, `/careers-at-envint/`, `/mapsense/`, `/esq/` | All templates render exact, descriptive semantic `<h1>` tags |
| **Canonical URLs** | 11 canonical mismatches causing crawl loops | 301 edge redirects eliminate duplicate URL variants |
| **Dead Links** | 1 broken 404 URL (`/eu-taxonomy-framework-a-clear-guide/`) | 301 redirect implemented to `/the-eu-taxonomy-demystified/` |
| **Page Speed & Payload** | Heavy Elementor DOM (500+ nodes) & unoptimized scripts | Clean semantic HTML, server components, optimized assets |
