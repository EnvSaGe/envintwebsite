# 01. Current Admin Editor & Architecture Audit

## 1. Executive Summary

A comprehensive architectural audit was conducted across the Envint Next.js Admin CMS (`apps/admin`), the public website renderer (`apps/web`), the database models (`packages/db`), and content seed scripts (`scripts/seed-pages-content.ts`).

### The Core Problem
The current Admin CMS editor is **not a true visual page builder**. It is a **rigid, form-based wrapper around monolithic, hardcoded React sections**. Pages are composed of fixed block "archetypes" (`about-hero`, `about-vision`, `about-founders`, `feature-cards`, `cta-banner`, etc.) where:
1. The internal layout (columns, order, hierarchy, nesting) is hardcoded in React code.
2. The property inputs are flat, inflexible text fields (e.g., `card1_title`, `card2_title`, `statement`, `belief`, `strategy`).
3. An authorized editor cannot add a button, add a column, insert an image, change typography, adjust responsive padding, or reorder elements inside a section without modifying Next.js source code.
4. Default fallbacks in the editor simulator (`LiveCanvasRenderer.tsx`) differ from the actual public website renderer (`DynamicPageRenderer.tsx`), leading to discrepancies such as **"Our Purpose"** appearing in the editor while **"About Envint"** is rendered on the public site.

---

## 2. Root Cause Analysis: The "Our Purpose" vs "About Envint" Discrepancy

The user observed that on the About page (`/about`), the editor canvas and left sidebar display **"Our Purpose"**, whereas the live website displays **"About Envint"** (or "About Us").

### How This Happened in the Codebase:

#### 1. In `scripts/seed-pages-content.ts` (Database Content):
```typescript
// Block 2 of /about was seeded without a 'headline' or 'title':
{
  id: 'block_about_vision',
  name: 'Vision & Purpose',
  type: 'about-vision',
  enabled: true,
  props: {
    statement: 'Envint is a sustainability and ESG solutions firm...',
    belief: 'Our mission is to drive sustainability into mainstream...',
    strategy: 'We believe that by embedding environmental...'
  }
}
```

#### 2. In `apps/admin/src/app/pages/editor/LiveCanvasRenderer.tsx` (Editor Simulator):
```tsx
// Line 335 in LiveCanvasRenderer.tsx:
<h2 style={{ fontSize: '38px', fontWeight: 400, color: '#004E35', margin: '0 0 24px' }}>
  {props.headline || props.title || 'Our Purpose'}
</h2>
```
Because `props.headline` and `props.title` were undefined, the editor canvas defaulted to `'Our Purpose'`.

#### 3. In `apps/web/src/components/content/DynamicPageRenderer.tsx` (Live Website):
```tsx
// Line 232 in DynamicPageRenderer.tsx:
const headline = props.headline || (
  block.type === 'about-vision' || block.type === 'about-story' 
    ? (props.title || 'About Envint') 
    : (props.title || '')
);
```
On the live website, the fallback default was `'About Envint'`.

#### 4. In `apps/admin/src/app/pages/editor/BlockFormFields.tsx` (Editor Sidebar):
```tsx
{renderTextField('tagline', 'Section Tagline / Category', 'e.g. OUR PURPOSE')}
{renderTextField('headline', 'Large Section Headline', 'e.g. Born from a commitment to sustainability')}
```
The sidebar form had rigid, static placeholders suggesting `"OUR PURPOSE"`.

### The Architectural Flaw:
Neither renderer was reading an authentic, user-defined element tree. Both renderers had their own divergent, hardcoded fallback strings. If an editor changes a heading, they are wrestling with hardcoded assumptions across multiple React components.

---

## 3. Structural Audit: Why the Current Editor Architecture Fails

| Dimension | Current Implementation | What a Real Page Builder Requires |
| :--- | :--- | :--- |
| **Hierarchy** | Flat list of monolithic section blocks (max 1 level). | Tree graph: `Page` &rarr; `Sections` &rarr; `Containers / Grids / Flex` &rarr; `Elements` (Heading, Text, Button, Image, Icon, Counter). |
| **Element Manipulation** | Cannot add, remove, or reorder elements inside a section. | Any element can be added, deleted, reordered, cloned, or moved across containers. |
| **Layout Flexibility** | Fixed column structures (e.g. `gridTemplateColumns: 'minmax(0, 550px) minmax(0, 1fr)'`). | Configurable display (`block`, `flex`, `grid`), direction, wrap, column counts, gap, alignment. |
| **Styling & Tokens** | Hardcoded inline styles in TSX. Form has only a simple background color picker. | Granular controls for typography, font size, weight, line-height, text color, background (solid, gradient, image), borders, radius, padding, margin, shadows. |
| **Responsive Controls** | Breakpoints simulated only by resizing canvas container with fixed desktop styles. | Breakpoint-specific property overrides (`desktop` base &rarr; `tablet` override &rarr; `mobile` override). |
| **Buttons & CTAs** | Fixed label and URL strings in monolithic blocks (`ctaLabel`, `ctaUrl`). | Dedicated Button element with variant, style, icons, internal/external links, anchors, phone/email, and modal actions. |
| **Draft / Publish** | Edits modify the live database record on save; no draft isolation. | Clean Draft vs. Published separation with version snapshots and 1-click rollback. |
| **Global Blocks** | None. Every block is isolated to its page. | Reusable Blocks library with option for Global (synced) vs Copy (decoupled). |

---

## 4. Page-by-Page Audit of Existing Pages

### 1. About (`/about`)
- **Hero**: Hardcoded `about-hero` block. Subtitle, title, background image are flat props. Cannot add secondary CTAs or badges.
- **Section 2 (Vision / Story)**: Has hardcoded column layout (heading left, 3 paragraphs right). If the editor wants a 3-column split, a button, or a video, it is impossible without editing code.
- **Section 3 (Founders)**: Hardcoded `about-founders` block. Photo is forced left, text right. Cannot reorder photo or add founder quotes/social links.
- **Section 4 (Journey)**: Uses `defaultMilestones` array hardcoded in TSX if props are missing. Cannot add custom milestone cards or change timeline graphics dynamically.
- **Section 5 (Team)**: Hardcoded `sampleTeamMembers` in editor canvas; renders `team_members` query on web. Editor cannot style individual cards or add non-team members.

### 2. Home (`/`)
- Contains 1064 lines of hardcoded JSX fallback in `apps/web/src/app/page.tsx`.
- Blocks rely on `stats-counter` (fixed 4-column layout) and `feature-cards` (fixed 3-column).
- Client logos, interactive tool cards, and philosophy section are rigid.

### 3. Services Hub (`/services`) & Practice Pages
- Contains `ServicesPageFallback.tsx` with hardcoded arrays: `sectorsList`, `themesList`, `toolsList`, `pillars`.
- When rendered via CMS, uses `feature-cards` with flat keys (`card1_title`, `card1_desc`, `card2_title`, `card2_desc`, etc.). If an editor needs 5 cards or custom icons, the schema breaks.

### 4. Impact (`/impact`)
- Monolithic `impact-grid` block renders case studies. Editor cannot customize filter pills, card metadata, card layout, or insert promotional feature cards between case studies.

### 5. Careers (`/careers-at-envint`)
- Uses `career-hero` and fixed `feature-cards` for culture pillars ("The Envint Way").
- Current openings section is not dynamically manageable inside the visual canvas.

### 6. Connect (`/connect`)
- Hardcoded layout for office addresses (Mumbai, Delhi, Bengaluru, etc.) and form fields.
- Form inputs cannot be added, renamed, or modified from the CMS.

### 7. ESQ, Mapsense, GBC Campaign (`/esq`, `/mapsense`, `/connect-gbc2024`)
- Built largely as standalone custom pages with fixed visual sections.
- Mapsense report sample download, tool preview graphics, and campaign forms are not editable through the visual page builder.

---

## 5. Architectural Conclusion

Patching individual text fields like "Our Purpose" is a temporary band-aid that perpetuates technical debt. The only robust, long-term solution is to **transition from monolithic section blocks to a schema-driven element tree**.

In the new architecture:
- Every section is a `Section` node containing a `Container` or `Grid`.
- Every heading is an independent `Heading` element with tag, font, size, weight, alignment, and color properties.
- Every paragraph is an independent `Paragraph` or `RichText` element.
- Every button is a configurable `Button` element with full action and styling controls.
- Any section from the existing website can be reconstructed with 100% fidelity, and every element within it will be editable, reorderable, stylable, and responsive.
