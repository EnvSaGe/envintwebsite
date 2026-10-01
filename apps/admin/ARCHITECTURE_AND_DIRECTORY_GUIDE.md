# 📘 Admin Portal (`apps/admin`) — Complete Architecture & Directory Guide

This document is the official, comprehensive Knowledge Transfer (KT) reference for the **Envint Admin CMS Portal**. It explains what every directory and file does, why folders are organized this way, and how data moves from the database through the admin portal to the public website.

---

## ⚠️ Important: Why Folder Names in `src/app/` Must Not Be Renamed

In **Next.js (App Router)**, any folder located directly inside `src/app/` defines an **active HTTP URL route** in the browser. 

| Folder Location | Maps Directly to URL | Example Function |
| :--- | :--- | :--- |
| `src/app/pages/` | `https://admin.envintglobal.com/pages` | Landing pages table & status manager |
| `src/app/pages/editor/` | `https://admin.envintglobal.com/pages/editor?slug=...` | Visual site builder editor |
| `src/app/analytics/` | `https://admin.envintglobal.com/analytics` | Traffic & visitor analytics dashboard |
| `src/app/insights/` | `https://admin.envintglobal.com/insights` | Knowledge hub & blog article manager |
| `src/app/case-studies/` | `https://admin.envintglobal.com/case-studies` | Impact case studies (/impact) manager |
| `src/app/team/` | `https://admin.envintglobal.com/team` | Team member & leadership bios manager |
| `src/app/media/` | `https://admin.envintglobal.com/media` | AWS S3 asset upload library |
| `src/app/templates/` | `https://admin.envintglobal.com/templates` | Dynamic record content templates |
| `src/app/settings/` | `https://admin.envintglobal.com/settings` | General settings & user roles |
| `src/app/settings/users/` | `https://admin.envintglobal.com/settings/users` | Clerk RBAC user permissions manager |
| `src/app/navigation/` | *(Server Actions only)* | Next.js Server Actions for Navbar/Footer |
| `src/app/sign-in/` | `https://admin.envintglobal.com/sign-in` | Clerk authentication login screen |
| `src/app/access-denied/` | `https://admin.envintglobal.com/access-denied` | 403 Forbidden fallback screen |

> **Crucial Rule:** Renaming any folder under `src/app/` changes or breaks its URL route, breaks browser bookmarks, breaks admin sidebar links, and breaks authentication redirects.

---

## 📂 Complete Directory & File Map

### 1. `apps/admin/src/app/` (Root App Router)

- **`layout.tsx`**: Root layout wrapping the entire admin portal with `ClerkProvider` for authentication, font styles, and global admin theme styling.
- **`page.tsx`**: Root landing redirect. Automatically redirects authenticated users from `/` to `/pages`.
- **`error.tsx`**: Global React error boundary catching runtime errors across the admin application and showing a user-friendly recovery screen.
- **`admin-theme.css`**: Design tokens, color system, CSS custom properties, and UI styling for the admin portal and Visual Studio builder panels.

---

### 2. `apps/admin/src/app/pages/` (Pages & Builder)

- **`page.tsx`**:
  - Main landing pages inventory table.
  - Displays all website pages with status badges: `published` (green), `draft` (amber), `scheduled` (purple).
  - Search & filter tabs: All, Core Pages, Practice Areas, Knowledge Hubs, Custom Pages.
  - Row actions: Open in Visual Studio Editor, Quick Preview, Duplicate Page, Direct Publish / Unpublish, Delete.
  - Creation modal for spinning up new custom pages from starter templates.
- **`actions.ts`**:
  - Next.js Server Actions managing website pages in PostgreSQL.
  - Modifies `pages` and `page_revisions` tables.
  - Key functions: `fetchPagesList`, `fetchPageTreeAction`, `createPageAction`, `saveDraftTreeAction`, `publishTreeAction`, `scheduleTreePublishAction`, `restorePageRevision`, `duplicatePageAction`, `deletePageAction`.
  - Automatically sends cache revalidation webhooks (`page:<slug>`, `pages:list`) to `apps/web`.

#### Sub-folder: `pages/editor/`
- **`page.tsx`**: Route entry point for the editor URL: `/pages/editor?slug=<slug>`.
- **`EditorClient.tsx`**: Client loader component. Reads URL `?slug=...`, shows a skeleton loader while fetching the page tree from PostgreSQL, and mounts `VisualStudioEditor`.
- **`LiveCanvasRenderer.tsx`**, **`BlockFormFields.tsx`**, **`block-templates.ts`**: Legacy form-based block editor (Schema v1) kept for backwards compatibility.

---

### 3. `apps/admin/src/app/pages/editor/studio/` (Modern Visual Builder)

Operates like Figma/Webflow, organizing the visual workspace into 3 panels:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        StudioTopbar.tsx                                │
├─────────────────┬────────────────────────────────────┬─────────────────┤
│                 │                                    │                 │
│ PaletteSidebar  │         StudioCanvas.tsx           │ InspectorSidebar│
│                 │                                    │                 │
│  • Components   │    • 100% / 768px / 375px preview  │  • Content      │
│  • DOM Tree     │    • Drag & Drop placement         │  • Design/CSS   │
│    Layers       │    • Double-click text editing     │  • Responsive   │
│                 │                                    │  • Visibility   │
│                 │                                    │                 │
└─────────────────┴────────────────────────────────────┴─────────────────┘
```

#### Core Studio Files:
- **`VisualStudioEditor.tsx` (Master Shell)**:
  - Central orchestrator component.
  - Sets up master state via `useReducer(studioReducer, ...)`.
  - Coordinates global hotkeys: `Ctrl+Z` (Undo), `Ctrl+Y` (Redo), `Delete` (Remove Node), `Escape` (Deselect).
  - Handles modals (SEO, Version History, Scheduling) and auto-saving drafts.
- **`StudioState.ts` (State Machine & Reducer)**:
  - Single source of truth. Contains the full page tree (`rootIds` + `nodes` dictionary).
  - Maintains past and future snapshot history stacks for full Undo/Redo support.
  - Dispatches actions: `ADD_NODE`, `MOVE_NODE`, `DELETE_NODE`, `UPDATE_NODE_CONTENT`, `UPDATE_NODE_STYLES`, `SELECT_NODE`, `SET_VIEWPORT`.
- **`StudioTopbar.tsx` (Top Control Bar)**:
  - Page title, slug, and live site link.
  - Viewport switchers: Desktop (100%), Tablet (768px), Mobile (375px).
  - Zoom stepper controls and Undo/Redo buttons.
  - Primary actions: **Save Draft**, **Schedule Publish**, and **Publish Now**.
- **`PaletteSidebar.tsx` (Left Sidebar)**:
  - **Components Tab**: Catalog of draggable/clickable elements:
    - *Layout*: Section, Container, Grid, Flex
    - *Content*: Heading, Paragraph, Button, Image
    - *Interactive*: Search Bar, Form, Accordion
    - *Dynamic*: Insights Grid, Impact Grid, Team Grid, Service Cards
  - **Layers Tab**: Hierarchical DOM tree view of all nodes on the page for easy selection, nesting, and reordering.
- **`StudioCanvas.tsx` (Center Interactive Canvas)**:
  - Live interactive preview screen rendered inside a simulated device frame.
  - Manages hover borders, selection outlines, drop target indicators, and double-click inline text editing.
- **`blocks.tsx` (Studio Primitives)**:
  - Contains edit-mode visual representations (`SectionPrimitive`, `HeadingPrimitive`, `SearchBarPrimitive`, etc.) used inside the canvas to mirror the public site faithfully.
- **`InspectorSidebar.tsx` (Right Properties Panel)**:
  - Dynamically updates based on the selected element:
    - *Content Tab*: Text values, button links, image URLs, search mode.
    - *Design Tab*: Margins, paddings, typography, background colors/images, borders, shadows.
    - *Responsive Tab*: Breakpoint overrides for tablets and mobile phones.
    - *Visibility Tab*: Show/hide elements on desktop, tablet, or mobile.
- **`QuickPalette.tsx`**:
  - Floating `Ctrl+K` slash command menu for rapidly inserting elements right where the cursor is.
- **`style-utils.ts`**:
  - Converts `ElementStyles` objects into valid React CSS styles and handles responsive media queries.
- **`ui-controls.tsx`**:
  - Reusable inspector inputs: Color picker, visual spacing box, typography stepper, unit selectors (`px`, `%`, `vh`, `rem`).
- **`ui-kit.tsx`**:
  - Studio design system primitives: Tabs, collapsible sections, tooltips, segmented controls, icon buttons.

#### Modals in `studio/`:
- **`SeoSettingsModal.tsx`**: Real-time SEO auditing, Google search snippet preview, OpenGraph social cards, focus keyphrase scoring, and `noindex` options.
- **`SchedulePublishModal.tsx`**: Datetime picker for automated future publishing. The background cron runner (`api/cron/publish-scheduled`) checks this every minute and flips status to `published`.
- **`VersionHistoryModal.tsx`**: Audit log of previous saved revisions from `page_revisions` table with 1-click restore/rollback.
- **`GlobalImpactWarning.tsx`**: Safety warning modal displayed before publishing templates shared across multiple routes.

#### Sub-folder: `studio/inspectors/`
- **`BindingInspector.tsx`**: Binds static elements (Heading, Image) to dynamic CMS fields (e.g. `record.title`, `record.coverImageUrl`).
- **`DynamicQueryInspector.tsx`**: Configures database queries for dynamic modules (e.g. filter articles by category `"enviki"`, limit to `30`).

---

### 4. `apps/admin/src/app/analytics/` (Web Analytics)

- **`page.tsx`**:
  - GDPR/DPDP-compliant analytics dashboard.
  - Summary metrics: total page views, unique visitors (counted via daily-rotating SHA-256 hash of IP + user agent with zero tracking cookies).
  - Interactive SVG trend chart over 7d, 30d, 90d.
  - Top visited pages and conversion rates.
  - **Visitor Countries widget**: Uses native browser `Intl.DisplayNames` to display full official country names (e.g. India, United States, Germany), ISO country badges, traffic percentages, and hover tooltips.
  - Traffic sources & AI bot crawls (Google, LinkedIn, Perplexity, ChatGPT).
  - Device breakdown (Desktop, Mobile, Tablet).
- **`DailyTrendChart.tsx`**: SVG chart component rendering visitor and page view graphs over time.

---

### 5. `apps/admin/src/app/insights/` (Articles & Knowledge Hub)

- **`page.tsx`**:
  - Table of all articles across Enviki, Behind the Buzz, Glossary Zone, and How-to Articles.
  - Real-time search by title, slug, and category.
  - Rich text modal editor for creating and editing posts, cover image S3 URL, and SEO tags.
- **`actions.ts`**:
  - Server actions managing `insights`, `categories`, `tags`, `insight_categories`, and `insight_tags` tables.
  - Key functions: `fetchInsights`, `saveInsightAction`, `deleteInsightAction`.
  - Dispatches revalidation tags `insight:<slug>`, `insights:list`, and `global:all`.

---

### 6. `apps/admin/src/app/case-studies/` (Impact Case Studies)

- **`page.tsx`**:
  - Management dashboard for client impact case studies shown on `/impact`.
  - Filterable by service, sector, and theme.
  - Modal editor for title, client type, sector, challenges, solutions, results HTML, and cover image.
- **`actions.ts`**:
  - Server actions modifying `impact_case_studies` table in PostgreSQL.
  - Key functions: `fetchImpacts`, `saveImpactAction`, `deleteImpactAction`.
  - Dispatches revalidation tags `impact:<slug>` and `impacts:list`.

---

### 7. `apps/admin/src/app/team/` (Team Member Bios)

- **`page.tsx`**:
  - Management dashboard for leadership and team member profiles shown on `/about` and `/member/[slug]`.
  - Modal editor for name, slug, role title, bio HTML, avatar S3 URL, leadership flag, and LinkedIn/Twitter URLs.
- **`actions.ts`**:
  - Server actions modifying `team_members` table in PostgreSQL.
  - Key functions: `fetchTeam`, `saveTeamMemberAction`, `deleteTeamMemberAction`.
  - Dispatches revalidation tags `member:<slug>`, `team:list`, and `page:/about`.

---

### 8. `apps/admin/src/app/media/` (AWS S3 Asset Manager)

- **`page.tsx`**:
  - Central media library for uploading, browsing, and copying image URLs stored on AWS S3 (`envintcms.s3.ap-south-1.amazonaws.com`).
  - Direct drag-and-drop file uploader.
  - 1-Click "Copy URL" button for inserting images into the Visual Studio Builder.
  - In-place alt text editor for accessibility and SEO.
- **`actions.ts`**:
  - Server actions managing `media_assets` table in PostgreSQL.
  - Key functions: `fetchMediaAssets`, `updateMediaAltText`, `deleteMediaAsset`.

---

### 9. `apps/admin/src/app/templates/` (Dynamic Record Templates)

- **`page.tsx`**:
  - Inventory of dynamic templates for Articles, Impact case studies, Team bios, and Taxonomy archives.
  - Creates new templates or opens them in the Visual Studio Builder.
- **`actions.ts`**:
  - Server actions managing `content_templates` and `content_template_revisions` tables in PostgreSQL.
  - Key functions: `fetchTemplatesListAction`, `createTemplateAction`, `saveTemplateDraftAction`, `publishTemplateAction`, `deleteTemplateAction`.
- **`[slug]/page.tsx`**:
  - Route handler mounting the Visual Studio Builder for a specific dynamic template.

---

### 10. `apps/admin/src/app/navigation/` (Header & Footer Menus)

- **`actions.ts`**:
  - Next.js Server Actions managing `navigation_items` table in PostgreSQL.
  - Key functions:
    - `fetchNavigationItems(navGroup)`: Fetches links for `'primary'` (Header Navbar) or `'footer'` (Footer columns).
    - `saveNavigationItem(item)`: Creates or updates a navigation link.
    - `deleteNavigationItem(id)`: Removes a navigation link.
    - `reorderNavigationItems(items)`: Bulk updates sort order (`orderIndex`) after drag-and-drop.
  - Dispatches revalidation tags `global:navigation`, `global:header`, `global:footer`.

---

### 11. `apps/admin/src/app/settings/` (System & Access Control)

- **`page.tsx`**:
  - User management interface powered by **Clerk RBAC**.
  - Displays all admin users and their current roles (`super_admin`, `editor`, `none`).
  - Modal for inviting new team members by email and assigning permissions.
- **`actions.ts`**:
  - Server actions communicating with Clerk's Backend SDK (`@clerk/nextjs/server`).
  - Functions: `listTeamUsers`, `updateUserRole`, `createTeamUser`, `deleteTeamUser`.
- **`users/page.tsx`**:
  - Dedicated route redirecting to user management in settings.

---

### 12. `apps/admin/src/app/api/` (Admin API Endpoints)

- **`api/analytics/route.ts`**:
  - `GET /api/analytics?days=30`: Aggregates page views, unique visitors, top paths, countries, device types, and referrers from database events.
- **`api/media/route.ts`**:
  - Handles authenticated file uploads to AWS S3 bucket and creates records in `media_assets`.
- **`api/preview-proxy/route.ts`**:
  - Live iframe proxy allowing the admin studio to preview draft pages with draft mode headers enabled.

---

### 13. `apps/admin/src/components/` (Shared Admin Components)

- **`Sidebar.tsx`**:
  - Main navigation sidebar of the admin portal. Links to Pages, Insights, Case Studies, Team, Media, Templates, Analytics, and Settings.
  - Displays user profile badge and Clerk sign-out button.
- **`RichTextEditor.tsx`**:
  - TipTap-based WYSIWYG editor used in Insights and Case Studies with formatting, bullet lists, links, and image embedding.
- **`MediaPickerModal.tsx`**:
  - Reusable modal dialog enabling editors to pick an existing image from the S3 media library without leaving the page editor.

---

### 14. `apps/admin/src/lib/` (Core Utilities & Backend Integrations)

- **`clerk-rbac.ts`**:
  - Role-based access control engine.
  - Defines roles: `'super_admin' | 'editor' | 'viewer'`.
  - Exports `requireRole(['super_admin', 'editor'])` which halts unauthorized server action calls.
  - Exports `getCurrentUserInfo()` to track which user made revisions.
- **`revalidate-dispatcher.ts`**:
  - Cache revalidation dispatcher.
  - Constructs an HMAC-SHA256 signature using `REVALIDATION_SECRET` and sends a POST request to `https://envintglobal.com/api/revalidate`.
  - Triggers instant cache clearing for changed tags (e.g. `page:/enviki`, `global:navigation`).
- **`s3.ts`**:
  - AWS SDK S3 client configured with `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET`.
  - Handles presigned URL generation and direct buffer uploads.
- **`cms-store.ts`**:
  - In-memory session store for draft previews.

---

## 🔄 End-to-End Life Cycle: How Admin Connects to the Web App

```
1. Editor modifies page in Studio (apps/admin)
   ↓
2. Clicks "Publish" in StudioTopbar.tsx
   ↓
3. publishTreeAction() (pages/actions.ts) saves publishedBlocks in PostgreSQL
   ↓
4. dispatchRevalidation() sends HMAC-signed webhook to apps/web/src/app/api/revalidate
   ↓
5. Next.js on apps/web purges the cached route (e.g. /enviki or /about)
   ↓
6. Next visitor to envintglobal.com instantly receives the freshly rendered page via TreeRenderer.tsx!
```
