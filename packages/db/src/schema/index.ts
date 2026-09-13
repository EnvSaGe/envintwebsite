import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  boolean, 
  integer, 
  timestamp, 
  jsonb, 
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Enums ---
export const contentStatusEnum = pgEnum('content_status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export const contentFormatEnum = pgEnum('content_format_type', ['HTML', 'BLOCKS']);
export const adminRoleEnum = pgEnum('admin_role', ['SUPER_ADMIN', 'EDITOR']);

// --- 1. Pages ---
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 150 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  h1Heading: varchar('h1_heading', { length: 255 }),
  layoutTemplate: varchar('layout_template', { length: 100 }).notNull().default('standard'),
  contentBlocks: jsonb('content_blocks').notNull().default([]),
  /** Working draft tree (JSONB normalized graph) */
  draftBlocks: jsonb('draft_blocks'),
  /** Active published tree rendered to public visitors */
  publishedBlocks: jsonb('published_blocks'),
  /** Monotonically increasing schema version for block format migrations */
  schemaVersion: integer('schema_version').notNull().default(1),
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  ogImageUrl: varchar('og_image_url', { length: 500 }),
  noIndex: boolean('no_index').notNull().default(false),
  
  /** When set and status=DRAFT, cron publishes at this time */
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

// --- 2. Page Revisions (audit trail & version history) ---
export const pageRevisions = pgTable('page_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageSlug: varchar('page_slug', { length: 150 }).notNull(),
  contentBlocks: jsonb('content_blocks').notNull().default([]),
  schemaVersion: integer('schema_version').notNull().default(1),
  versionNumber: integer('version_number'),
  isPublishedSnapshot: boolean('is_published_snapshot').notNull().default(false),
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  savedByClerkId: varchar('saved_by_clerk_id', { length: 255 }),
  savedByName: varchar('saved_by_name', { length: 255 }),
  note: varchar('note', { length: 500 }),
  savedAt: timestamp('saved_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 2b. Reusable / Global Blocks Catalog ---
export const reusableBlocks = pgTable('reusable_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  category: varchar('category', { length: 100 }).notNull().default('cta'),
  description: varchar('description', { length: 500 }),
  blocks: jsonb('blocks').notNull().default([]),
  isGlobal: boolean('is_global').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 2c. Shared Content Templates ---
// Templates provide editable layouts for repeated record types such as
// articles, impact studies, team members, and taxonomy archives.
export const contentTemplates = pgTable('content_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  kind: varchar('kind', { length: 50 }).notNull(),
  description: varchar('description', { length: 500 }),
  draftBlocks: jsonb('draft_blocks'),
  publishedBlocks: jsonb('published_blocks'),
  schemaVersion: integer('schema_version').notNull().default(2),
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const contentTemplateRevisions = pgTable('content_template_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateSlug: varchar('template_slug', { length: 100 }).notNull(),
  blocks: jsonb('blocks').notNull(),
  schemaVersion: integer('schema_version').notNull().default(2),
  versionNumber: integer('version_number').notNull(),
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  savedByClerkId: varchar('saved_by_clerk_id', { length: 255 }),
  savedByName: varchar('saved_by_name', { length: 255 }),
  note: varchar('note', { length: 500 }),
  savedAt: timestamp('saved_at', { withTimezone: true }).notNull().defaultNow(),
});

// Reusable blocks already store their current tree. This table supplies the
// same rollback/audit history available to pages and shared templates.
export const globalBlockRevisions = pgTable('global_block_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  globalBlockSlug: varchar('global_block_slug', { length: 100 }).notNull(),
  blocks: jsonb('blocks').notNull(),
  versionNumber: integer('version_number').notNull(),
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  savedByClerkId: varchar('saved_by_clerk_id', { length: 255 }),
  savedByName: varchar('saved_by_name', { length: 255 }),
  note: varchar('note', { length: 500 }),
  savedAt: timestamp('saved_at', { withTimezone: true }).notNull().defaultNow(),
});

// Maps a page, record, template, or global setting to every route that uses
// it. Publication uses these rows to invalidate only affected Netlify caches.
export const contentDependencies = pgTable('content_dependencies', {
  sourceType: varchar('source_type', { length: 50 }).notNull(),
  sourceKey: varchar('source_key', { length: 255 }).notNull(),
  routePath: varchar('route_path', { length: 500 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.sourceType, table.sourceKey, table.routePath] }),
]);

// --- 3. Media Assets ---
export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: varchar('filename', { length: 255 }).notNull(),
  s3Key: varchar('s3_key', { length: 500 }).notNull().unique(),
  url: varchar('url', { length: 1000 }).notNull(),
  altText: varchar('alt_text', { length: 300 }).default(''),
  isDecorative: boolean('is_decorative').notNull().default(false),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 4. Services & Sub-Services ---
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  tagline: varchar('tagline', { length: 300 }),
  summary: text('summary').notNull(),
  fullDescription: text('full_description').notNull(),
  keyOfferings: jsonb('key_offerings').notNull().default([]),
  iconName: varchar('icon_name', { length: 100 }),
  heroImageId: uuid('hero_image_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  orderIndex: integer('order_index').notNull().default(0),
  
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  ogImageUrl: varchar('og_image_url', { length: 500 }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const subServices = pgTable('sub_services', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 5. Taxonomies ---
export const sectors = pgTable('sectors', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const themes = pgTable('themes', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 6. Team Members ---
export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  roleTitle: varchar('role_title', { length: 200 }).notNull(),
  bio: text('bio').notNull(),
  shortBio: varchar('short_bio', { length: 300 }),
  avatarId: uuid('avatar_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  /** Direct image URL from migration / local JSON (fallback when no media asset) */
  avatarUrl: varchar('avatar_url', { length: 1000 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  twitterUrl: varchar('twitter_url', { length: 500 }),
  email: varchar('email', { length: 200 }),
  isLeadership: boolean('is_leadership').notNull().default(true),
  hasStandaloneRoute: boolean('has_standalone_route').notNull().default(true),
  orderIndex: integer('order_index').notNull().default(0),
  status: contentStatusEnum('status').notNull().default('PUBLISHED'),
  
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 7. Insights / Articles ---
export const insights = pgTable('insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 300 }).notNull(),
  excerpt: text('excerpt'),
  
  contentFormat: contentFormatEnum('content_format').notNull().default('HTML'),
  contentHtml: text('content_html'),
  contentBlocks: jsonb('content_blocks'),
  schemaVersion: integer('schema_version').notNull().default(1),
  
  readingTimeMinutes: integer('reading_time_minutes').default(5),
  authorId: uuid('author_id').references(() => teamMembers.id, { onDelete: 'set null' }),
  coverImageId: uuid('cover_image_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  /** Direct image URL from migration / local JSON (fallback when no media asset) */
  coverImageUrl: varchar('cover_image_url', { length: 1000 }),
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  
  /** When set and status=DRAFT, cron publishes at this time */
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  
  sanitizationChecksum: varchar('sanitization_checksum', { length: 128 }),
  migrationProvenance: jsonb('migration_provenance'),
  
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  ogImageUrl: varchar('og_image_url', { length: 500 }),
  noIndex: boolean('no_index').notNull().default(false),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const insightCategories = pgTable('insight_categories', {
  insightId: uuid('insight_id').notNull().references(() => insights.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.insightId, t.categoryId] }),
]);

export const insightTags = pgTable('insight_tags', {
  insightId: uuid('insight_id').notNull().references(() => insights.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.insightId, t.tagId] }),
]);

// --- 8. Impact Case Studies ---
export const impactCaseStudies = pgTable('impact_case_studies', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 300 }).notNull(),
  clientType: varchar('client_type', { length: 200 }),
  summary: text('summary').notNull(),
  challenge: text('challenge'),
  solution: text('solution'),
  outcome: text('outcome'),
  contentHtml: text('content_html'),
  keyMetrics: jsonb('key_metrics').default([]),
  
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'set null' }),
  sectorId: uuid('sector_id').references(() => sectors.id, { onDelete: 'set null' }),
  themeId: uuid('theme_id').references(() => themes.id, { onDelete: 'set null' }),
  coverImageId: uuid('cover_image_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  /** Direct image URL from migration / local JSON (fallback when no media asset) */
  coverImageUrl: varchar('cover_image_url', { length: 1000 }),
  
  status: contentStatusEnum('status').notNull().default('DRAFT'),
  orderIndex: integer('order_index').notNull().default(0),
  
  /** When set and status=DRAFT, cron publishes at this time */
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  ogImageUrl: varchar('og_image_url', { length: 500 }),
  noIndex: boolean('no_index').notNull().default(false),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const impactSubServices = pgTable('impact_sub_services', {
  impactId: uuid('impact_id').notNull().references(() => impactCaseStudies.id, { onDelete: 'cascade' }),
  subServiceId: uuid('sub_service_id').notNull().references(() => subServices.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.impactId, t.subServiceId] }),
]);

// --- 9. Lead Submissions ---
export const leadSubmissions = pgTable('lead_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  formType: varchar('form_type', { length: 50 }).notNull(),
  fullName: varchar('full_name', { length: 200 }),
  email: varchar('email', { length: 200 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 200 }),
  location: varchar('location', { length: 200 }),
  category: varchar('category', { length: 100 }),
  message: text('message'),
  ipAddress: varchar('ip_address', { length: 100 }),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata').default({}),
  isProcessed: boolean('is_processed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 10. Admin Users (Clerk sync — role metadata mirror) ---
// Note: Authentication is handled entirely by Clerk.
// This table stores a mirror of Clerk user metadata for server-side role lookups.
// Auth.js / NextAuth tables have been removed; Clerk is the single auth provider.
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  /** Clerk user ID (e.g. user_xxxx) — used for lookups */
  clerkId: varchar('clerk_id', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  image: text('image'),
  role: adminRoleEnum('role').notNull().default('EDITOR'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 11. Navigation Items ---
export const navigationItems = pgTable('navigation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label', { length: 100 }).notNull(),
  href: varchar('href', { length: 500 }).notNull(),
  /** null = top-level; uuid = parent nav item id */
  parentId: uuid('parent_id'),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  /** 'primary' = main nav, 'footer' = footer nav, 'social' = social links */
  navGroup: varchar('nav_group', { length: 50 }).notNull().default('primary'),
  openInNewTab: boolean('open_in_new_tab').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- 12. Site Settings (key-value store) ---
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  /** JSON-encoded value for structured settings */
  valueJson: jsonb('value_json'),
  description: varchar('description', { length: 500 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// --- Relations ---
export const servicesRelations = relations(services, ({ one, many }) => ({
  heroImage: one(mediaAssets, { fields: [services.heroImageId], references: [mediaAssets.id] }),
  subServices: many(subServices),
  impacts: many(impactCaseStudies),
}));

export const subServicesRelations = relations(subServices, ({ one, many }) => ({
  service: one(services, { fields: [subServices.serviceId], references: [services.id] }),
  impactSubServices: many(impactSubServices),
}));

export const insightsRelations = relations(insights, ({ one, many }) => ({
  author: one(teamMembers, { fields: [insights.authorId], references: [teamMembers.id] }),
  coverImage: one(mediaAssets, { fields: [insights.coverImageId], references: [mediaAssets.id] }),
  categories: many(insightCategories),
  tags: many(insightTags),
}));

export const insightCategoriesRelations = relations(insightCategories, ({ one }) => ({
  insight: one(insights, { fields: [insightCategories.insightId], references: [insights.id] }),
  category: one(categories, { fields: [insightCategories.categoryId], references: [categories.id] }),
}));

export const insightTagsRelations = relations(insightTags, ({ one }) => ({
  insight: one(insights, { fields: [insightTags.insightId], references: [insights.id] }),
  tag: one(tags, { fields: [insightTags.tagId], references: [tags.id] }),
}));

export const impactCaseStudiesRelations = relations(impactCaseStudies, ({ one, many }) => ({
  service: one(services, { fields: [impactCaseStudies.serviceId], references: [services.id] }),
  sector: one(sectors, { fields: [impactCaseStudies.sectorId], references: [sectors.id] }),
  theme: one(themes, { fields: [impactCaseStudies.themeId], references: [themes.id] }),
  coverImage: one(mediaAssets, { fields: [impactCaseStudies.coverImageId], references: [mediaAssets.id] }),
  impactSubServices: many(impactSubServices),
}));

export const impactSubServicesRelations = relations(impactSubServices, ({ one }) => ({
  impact: one(impactCaseStudies, { fields: [impactSubServices.impactId], references: [impactCaseStudies.id] }),
  subService: one(subServices, { fields: [impactSubServices.subServiceId], references: [subServices.id] }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one, many }) => ({
  avatar: one(mediaAssets, { fields: [teamMembers.avatarId], references: [mediaAssets.id] }),
  articles: many(insights),
}));

export const navigationItemsRelations = relations(navigationItems, ({ one, many }) => ({
  parent: one(navigationItems, { fields: [navigationItems.parentId], references: [navigationItems.id] }),
  children: many(navigationItems),
}));
