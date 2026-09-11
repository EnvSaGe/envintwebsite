# 09. Implementation Roadmap & System Safeguards Plan

## 1. System-Level Engineering Safeguards & Guarantees

### 1.1 Zero Public Site Performance Impact & Free-Tier DB Sustainability
- **Monorepo Package Isolation**:
  - Heavy editor libraries (`@dnd-kit`, `@tiptap`, canvas overlays, inspector UI) are installed **exclusively in `apps/admin`**.
  - `apps/web` contains **0 kB** of builder JavaScript. Visitors download only pure, lean client code.
- **React Server Components (RSC) & Static HTML Output**:
  - Layout blocks (`section`, `container`, `grid`, `flex`, `heading`, `paragraph`, `image`) render directly on the server as semantic HTML (`<section>`, `<div>`, `<h2>`, `<p>`).
  - No hydration overhead on public layout blocks. Total Blocking Time (TBT) stays at **0ms**; First Contentful Paint (FCP) **< 0.8s**.
- **Edge CDN Caching & Neon Scale-to-Zero (<5 CU-hrs/month)**:
  - Public visitors **never query the Neon database directly**.
  - When an editor publishes a page, Next.js performs **On-Demand ISR Revalidation** (`revalidatePath('/slug')`), fetching data **once (100ms)** and storing compiled static HTML across Vercel’s global Edge CDN (15ms delivery).
  - Neon Postgres automatically scales to zero compute (sleeps) after 5 minutes of inactivity, keeping your database comfortably on the **Free Plan (< 5 CU-hrs/month out of 100)**.
- **Automatic Image Optimization**:
  - All image nodes use `next/image` connected to AWS S3 (`envintcms`), automatically generating WebP/AVIF formats, responsive `srcset`, and zero layout shift (**CLS = 0**).

### 1.2 Zero Broken Pages During Migration
- **Dual-Engine Dispatcher Architecture**:
  - `DynamicPageRenderer.tsx` inspects `published_blocks`:
    - **Schema Version 1**: Renders existing legacy monolithic blocks (`about-hero`, `feature-cards`, etc.) without touching a line of code.
    - **Schema Version 2**: Renders the new dynamic recursive `TreeRenderer`.
  - Migrating `/about` cannot break or impact `/services`, `/impact`, or `/`.
- **Isolated Draft vs. Published Database Separation**:
  - CMS edits only modify `draft_blocks`.
  - Live visitors only see `published_blocks`. An editor can test, break, or restyle drafts freely with **zero impact on the live site** until explicitly clicking **"Publish Changes"**.
- **Component-Level Error Boundaries**:
  - Every block in `TreeRenderer` is wrapped in an React Error Boundary. If an individual block encounters malformed data, it logs a warning and fails gracefully without taking down the page.

### 1.3 Airtight Content Security & XSS Prevention
- **Automatic React Escaping**:
  - Headings, button labels, and counters are rendered as native React children (`<span>{content.text}</span>`), which React automatically escapes.
- **Multi-Layer HTML Sanitization**:
  - Rich text is sanitized using `sanitize-html` before database storage and before rendering. Only semantic tags (`<p>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<a>`, `<ul>`, `<ol>`, `<li>`, `<br>`) are permitted.
  - `<script>`, `<iframe>`, `<object>`, `<embed>`, `onload=`, and `onerror=` attributes are stripped immediately.
- **Protocol Whitelisting**:
  - Links and URLs are validated via Zod: only `https://`, `http://`, `/`, `mailto:`, `tel:`, and `#` are permitted. Any `javascript:` or `data:` URL is rejected on the server.
- **Safe CSS Property Mapping**:
  - Editors configure styles via structured UI controls (color pickers, sliders, dropdowns). CSS is applied as controlled style objects, preventing raw CSS injections (`expression()`, `@import`).
- **Clerk Authentication & Server-Side RBAC**:
  - All mutation API routes verify Clerk user sessions and enforce role checks (`EDITOR` / `SUPER_ADMIN`).

### 1.4 Zero Accidental Content Loss
- **Automatic Version Snapshots & 1-Click Rollback**:
  - Every publish atomically records a full snapshot in `page_versions` with author ID, timestamp, and changelog notes.
  - Editors can restore any previous version in 1 click from the Version History panel.
- **Real-Time Auto-Save to Drafts**:
  - Changes are debounced (500ms) and auto-saved to `draft_blocks`. Reopening the CMS restores work even if the tab or computer crashed.
- **50-Step Undo / Redo**:
  - Full in-memory history stack with `Ctrl+Z` and `Ctrl+Y`.
- **Confirmation Guards**:
  - Explicit confirmation modal before deleting sections or containers with nested elements.

---

## 2. Roadmap Overview

The transformation of the Admin CMS editor into a production-ready, schema-driven visual page builder is structured into **7 phased milestones**:

```
[Phase 1: Schemas & DB] ──▶ [Phase 2: Web Renderer] ──▶ [Phase 3: Visual Studio UI]
                                                                  │
[Phase 6: Full Site]   ◀── [Phase 5: Reusable Blocks] ◀── [Phase 4: About POC]
         │
         ▼
[Phase 7: Production Verification & Deploy]
```

---

## 3. Phase-by-Phase Breakdown

### Phase 1: Core Engine & Schemas (Foundation)
- **Goal**: Establish the type-safe foundation and database support without affecting running apps.
- **Tasks**:
  1. Create `packages/shared/src/builder-schema.ts`:
     - Define `BuilderNode`, `ElementStyles`, `ElementType`, `ResponsiveValue`.
     - Implement Zod validation schemas for all node types.
     - Export helper utilities: `createNode()`, `cloneNodeTree()`, `flattenTree()`, `unflattenTree()`.
  2. Update database schemas in `packages/db/src/schema/index.ts`:
     - Add `draft_blocks` and `published_blocks` to `pages`.
     - Create `page_versions` table for revision snapshots.
     - Create `reusable_blocks` table for global and template components.
  3. Run Drizzle migration / push to Neon Postgres.

### Phase 2: Frontend Dynamic Tree Renderer (`apps/web`)
- **Goal**: Create a lightweight, high-performance recursive tree renderer for public visitors.
- **Tasks**:
  1. Create `apps/web/src/components/builder/TreeRenderer.tsx`:
     - Recursive node dispatcher mapping each `BuilderNode.type` to its corresponding React component.
     - Zero editor bundle weight delivered to public visitors.
  2. Create element components in `apps/web/src/components/builder/elements/`:
     - `SectionElement.tsx` (backgrounds, padding, full-bleed)
     - `ContainerElement.tsx` (max-width, flex/grid)
     - `GridElement.tsx` (responsive CSS grid)
     - `HeadingElement.tsx` (H1–H6 with responsive typography)
     - `ParagraphElement.tsx` (rich text)
     - `ButtonElement.tsx` (variants, actions, icons)
     - `ImageElement.tsx` (S3 optimization, aspect-ratio, object-fit)
     - `CounterElement.tsx`, `BadgeElement.tsx`, `AccordionElement.tsx`
  3. Integrate with `DynamicPageRenderer.tsx` using the dual-engine protocol (supports both Schema v1 legacy blocks and Schema v2 element trees).

### Phase 3: Visual Page Builder Studio UI (`apps/admin`)
- **Goal**: Build the 3-panel visual workspace in `apps/admin/src/app/pages/editor/`.
- **Tasks**:
  1. Install vetted open-source libraries:
     - `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (Drag and drop)
     - `@tiptap/react`, `@tiptap/starter-kit` (Inline rich text)
  2. Build **Left Sidebar (Navigator & Draggable Palette)**:
     - Live visual draggable palette (Layout, Basic, Interactive, Dynamic) with element previews.
     - Navigator tree view with draggable layers, expand/collapse, rename, lock, hide, delete.
     - Section template insert menu.
  3. Build **Center Visual Canvas**:
     - Breakpoint switchers (Desktop, Tablet, Mobile) with device frame simulation.
     - Visual selection outline (`#10B981`), breadcrumbs, and hover pills.
     - Inline text editing (double-click to edit Heading/Paragraph).
     - Floating quick-action toolbar (drag handle, duplicate, delete).
     - Pulsating visual drop zones (`---- ADD HERE ----`).
  4. Build **Right Inspector Panel**:
     - Dynamic property inspector switching by selected node type.
     - Tab 1: Content (Text, Tag, S3 Image Picker, Button Actions).
     - Tab 2: Layout & Dimensions (Display, Flex, Grid, Padding, Margin).
     - Tab 3: Style & Tokens (Colors, Typography, Backgrounds, Borders, Shadows).
     - Tab 4: Responsive & Visibility (Device toggles, Tablet/Mobile overrides).
  5. State Management & Undo/Redo Engine:
     - Immutable history stack with `Ctrl+Z` / `Ctrl+Y` shortcuts.
     - Dirty state tracking and real-time auto-save to `draft_blocks`.

### Phase 4: About Page Proof-of-Concept & 20-Step Acceptance Test
- **Goal**: Reconstruct the About page (`/about`) and verify that Section 2 ("About Envint") and all other sections are 100% dynamic.
- **Tasks**:
  1. Construct the 5 sections of `/about` in the new tree format:
     - Section 1: Hero Banner
     - Section 2: "About Envint" 2-Column Split (H2 heading left, 3 paragraphs right)
     - Section 3: "How It All Began" (Founders photo left, story right)
     - Section 4: "Our Journey" Timeline
     - Section 5: Team Grid
  2. Run the **20-step drag-and-drop acceptance test** (Section 38):
     - Drag Section & Container, add Heading, Paragraph, Button.
     - Convert to 2 columns, drag Image beside text.
     - Move Button from left to right column.
     - Change text, font size, background color, padding, and alignment.
     - Set mobile layout to 1 column and hide image on mobile.
     - Reorder Section, duplicate, undo duplication, and verify persistence on refresh.
  3. Verify Draft vs. Published workflow:
     - Save draft &rarr; open preview &rarr; approve &rarr; publish &rarr; verify instant cache revalidation on live site.

### Phase 5: Reusable Global Blocks & Version Rollback
- **Goal**: Provide enterprise-grade component reuse and change safety.
- **Tasks**:
  1. Add "Save as Reusable Block" to inspector context menu.
  2. Implement Global Component linking (updating a global component cascades to all pages referencing it).
  3. Implement Version History UI in admin topbar:
     - View snapshot timestamps, author, and notes.
     - 1-click restore to any previous version.

### Phase 6: Full Site Migration
- **Goal**: Reconstruct all core website pages in the dynamic block schema matching authentic live designs.
- **Pages**:
  1. Home (`/`)
  2. Services Hub (`/services`)
  3. Practice Pages (`/sustainability-integration`, `/climate-action`, `/responsible-investment`)
  4. Impact (`/impact`)
  5. Careers (`/careers-at-envint`)
  6. Connect (`/connect`)
  7. ESQ, Mapsense, GBC Campaign (`/esq`, `/mapsense`, `/connect-gbc2024`)

### Phase 7: Production Verification & Deployment
- **Goal**: Full automated end-to-end testing, bundle size audit, and Vercel production deployment.
- **Tasks**:
  1. Verify zero editor bundles in public website (`apps/web`).
  2. Run Lighthouse audit for performance, accessibility, and SEO.
  3. Deploy to production and verify live behavior across all devices.
