# 06. Database Model & Schema Architecture

## 1. Schema Philosophy: True Dynamic Flexibility

To prevent hardcoding in the database, the page builder avoids adding hundreds of rigid columns (e.g. `hero_title`, `purpose_desc`, `section1_col2_text`). 

Instead, the database stores **validated, schema-driven element trees in JSONB columns**, backed by relational version control, audit trails, and reusable block catalogs.

```
+--------------------+        +---------------------+
|       pages        |        |    page_versions    |
+--------------------+        +---------------------+
| id (UUID)          |<-------| id (UUID)           |
| slug (VARCHAR)     |   1:N  | page_id (FK)        |
| title (VARCHAR)    |        | version_number (INT)|
| draft_blocks (JSON)|        | blocks (JSONB)      |
| published_blocks   |        | saved_by_name (STR) |
| status (ENUM)      |        | note (VARCHAR)      |
| schema_version     |        | created_at (TZ)     |
+--------------------+        +---------------------+
          |
          | references
          v
+--------------------+        +---------------------+
|  reusable_blocks   |        |    media_assets     |
+--------------------+        +---------------------+
| id (UUID)          |        | id (UUID)           |
| slug (VARCHAR)     |        | s3_key (VARCHAR)    |
| name (VARCHAR)     |        | url (VARCHAR)       |
| blocks (JSONB)     |        | filename (VARCHAR)  |
| is_global (BOOL)   |        | mime_type (VARCHAR) |
+--------------------+        +---------------------+
```

---

## 2. Drizzle ORM Schema Definitions (`packages/db`)

### 1. Updated `pages` Table

```typescript
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 150 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  h1Heading: varchar('h1_heading', { length: 255 }),
  layoutTemplate: varchar('layout_template', { length: 100 }).notNull().default('standard'),

  /** 
   * Active published block tree rendered to public visitors.
   * Only updated when the editor clicks 'Publish Changes'.
   */
  publishedBlocks: jsonb('published_blocks').notNull().default([]),

  /**
   * Working draft block tree.
   * Auto-saved in real-time as the editor works in the CMS.
   */
  draftBlocks: jsonb('draft_blocks').notNull().default([]),

  /** Monotonically increasing schema version for block migrations */
  schemaVersion: integer('schema_version').notNull().default(2),

  /** Content status */
  status: contentStatusEnum('status').notNull().default('DRAFT'),

  // SEO & Social
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  ogImageUrl: varchar('og_image_url', { length: 500 }),
  noIndex: boolean('no_index').notNull().default(false),

  // Scheduling
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});
```

### 2. New `page_versions` Table (Audit Trail & 1-Click Rollback)

```typescript
export const pageVersions = pgTable('page_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  blocks: jsonb('blocks').notNull(),
  schemaVersion: integer('schema_version').notNull().default(2),
  savedByClerkId: varchar('saved_by_clerk_id', { length: 255 }),
  savedByName: varchar('saved_by_name', { length: 255 }),
  note: varchar('note', { length: 500 }),
  isPublishedSnapshot: boolean('is_published_snapshot').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

### 3. New `reusable_blocks` Table (Global & Template Components)

```typescript
export const reusableBlocks = pgTable('reusable_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  category: varchar('category', { length: 100 }).notNull().default('cta'),
  description: varchar('description', { length: 500 }),
  
  /** 
   * Array or dictionary of BuilderNode elements representing the block.
   */
  blocks: jsonb('blocks').notNull(),

  /**
   * If true: Updating this reusable block immediately updates all pages referencing it.
   * If false: Acts as a starting template (copy-paste decoupled clone).
   */
  isGlobal: boolean('is_global').notNull().default(true),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 3. JSON Serialization Structure

The `published_blocks` and `draft_blocks` columns store a self-contained normalized graph:

```json
{
  "version": 2,
  "rootIds": ["sec_1", "sec_2", "sec_3"],
  "nodes": {
    "sec_1": {
      "id": "sec_1",
      "type": "section",
      "name": "Hero Section",
      "parentId": null,
      "children": ["cont_1"],
      "content": {},
      "styles": {
        "backgroundColor": "#002E20",
        "paddingTop": "160px",
        "paddingBottom": "80px",
        "minHeight": "60vh"
      },
      "responsiveStyles": {
        "mobile": { "paddingTop": "100px", "paddingBottom": "40px" }
      },
      "visibility": { "desktop": true, "tablet": true, "mobile": true }
    },
    "cont_1": {
      "id": "cont_1",
      "type": "container",
      "name": "Hero Content Box",
      "parentId": "sec_1",
      "children": ["head_1"],
      "content": {},
      "styles": { "maxWidth": "1280px" },
      "responsiveStyles": {},
      "visibility": { "desktop": true, "tablet": true, "mobile": true }
    },
    "head_1": {
      "id": "head_1",
      "type": "heading",
      "name": "Vision Title",
      "parentId": "cont_1",
      "children": [],
      "content": {
        "text": "Our vision for the future is one that’s better",
        "tag": "h1"
      },
      "styles": {
        "fontSize": "76px",
        "textColor": "#FBF4EB",
        "fontWeight": 400
      },
      "responsiveStyles": {
        "tablet": { "fontSize": "56px" },
        "mobile": { "fontSize": "36px" }
      },
      "visibility": { "desktop": true, "tablet": true, "mobile": true }
    }
  }
}
```

---

## 4. Draft vs Published Workflow Pipeline

```
1. Editor edits in CMS:
   [Canvas Updates]  -->  Auto-saves to `draft_blocks` in Neon Postgres / Redis
                          (Production visitors continue seeing `published_blocks`)

2. Editor clicks "Preview":
   Opens `/preview?slug=/about&secret=...`
   Next.js Preview Mode reads `draft_blocks` and renders with live draft banner

3. Editor clicks "Publish Changes":
   - Transaction copies `draft_blocks` --> `published_blocks`
   - Creates a snapshot in `page_versions`
   - Calls `/api/revalidate?path=/about`
   - Public cache revalidates instantly via On-Demand ISR
```
