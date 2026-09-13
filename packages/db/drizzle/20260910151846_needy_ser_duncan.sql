CREATE TYPE "public"."admin_role" AS ENUM('SUPER_ADMIN', 'EDITOR');--> statement-breakpoint
CREATE TYPE "public"."content_format_type" AS ENUM('HTML', 'BLOCKS');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255),
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"image" text,
	"role" "admin_role" DEFAULT 'EDITOR' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "impact_case_studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(300) NOT NULL,
	"client_type" varchar(200),
	"summary" text NOT NULL,
	"challenge" text,
	"solution" text,
	"outcome" text,
	"content_html" text,
	"key_metrics" jsonb DEFAULT '[]'::jsonb,
	"service_id" uuid,
	"sector_id" uuid,
	"theme_id" uuid,
	"cover_image_id" uuid,
	"cover_image_url" varchar(1000),
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"scheduled_at" timestamp with time zone,
	"seo_title" varchar(255),
	"seo_description" text,
	"canonical_url" varchar(500),
	"og_image_url" varchar(500),
	"no_index" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "impact_case_studies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "impact_sub_services" (
	"impact_id" uuid NOT NULL,
	"sub_service_id" uuid NOT NULL,
	CONSTRAINT "impact_sub_services_impact_id_sub_service_id_pk" PRIMARY KEY("impact_id","sub_service_id")
);
--> statement-breakpoint
CREATE TABLE "insight_categories" (
	"insight_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "insight_categories_insight_id_category_id_pk" PRIMARY KEY("insight_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "insight_tags" (
	"insight_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "insight_tags_insight_id_tag_id_pk" PRIMARY KEY("insight_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(300) NOT NULL,
	"excerpt" text,
	"content_format" "content_format_type" DEFAULT 'HTML' NOT NULL,
	"content_html" text,
	"content_blocks" jsonb,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"reading_time_minutes" integer DEFAULT 5,
	"author_id" uuid,
	"cover_image_id" uuid,
	"cover_image_url" varchar(1000),
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"sanitization_checksum" varchar(128),
	"migration_provenance" jsonb,
	"seo_title" varchar(255),
	"seo_description" text,
	"canonical_url" varchar(500),
	"og_image_url" varchar(500),
	"no_index" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "insights_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lead_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_type" varchar(50) NOT NULL,
	"full_name" varchar(200),
	"email" varchar(200) NOT NULL,
	"phone" varchar(50),
	"company" varchar(200),
	"location" varchar(200),
	"category" varchar(100),
	"message" text,
	"ip_address" varchar(100),
	"user_agent" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_processed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"s3_key" varchar(500) NOT NULL,
	"url" varchar(1000) NOT NULL,
	"alt_text" varchar(300) DEFAULT '',
	"is_decorative" boolean DEFAULT false NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size_bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_s3_key_unique" UNIQUE("s3_key")
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(100) NOT NULL,
	"href" varchar(500) NOT NULL,
	"parent_id" uuid,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"nav_group" varchar(50) DEFAULT 'primary' NOT NULL,
	"open_in_new_tab" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_slug" varchar(150) NOT NULL,
	"content_blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"saved_by_clerk_id" varchar(255),
	"saved_by_name" varchar(255),
	"note" varchar(500),
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(150) NOT NULL,
	"title" varchar(255) NOT NULL,
	"h1_heading" varchar(255),
	"layout_template" varchar(100) NOT NULL,
	"content_blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"canonical_url" varchar(500),
	"og_image_url" varchar(500),
	"no_index" boolean DEFAULT false NOT NULL,
	"scheduled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sectors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(200) NOT NULL,
	"tagline" varchar(300),
	"summary" text NOT NULL,
	"full_description" text NOT NULL,
	"key_offerings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"icon_name" varchar(100),
	"hero_image_id" uuid,
	"order_index" integer DEFAULT 0 NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"canonical_url" varchar(500),
	"og_image_url" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text,
	"value_json" jsonb,
	"description" varchar(500),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "sub_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sub_services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"role_title" varchar(200) NOT NULL,
	"bio" text NOT NULL,
	"short_bio" varchar(300),
	"avatar_id" uuid,
	"avatar_url" varchar(1000),
	"linkedin_url" varchar(500),
	"twitter_url" varchar(500),
	"email" varchar(200),
	"is_leadership" boolean DEFAULT true NOT NULL,
	"has_standalone_route" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'PUBLISHED' NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "themes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "impact_case_studies" ADD CONSTRAINT "impact_case_studies_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_case_studies" ADD CONSTRAINT "impact_case_studies_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sectors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_case_studies" ADD CONSTRAINT "impact_case_studies_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_case_studies" ADD CONSTRAINT "impact_case_studies_cover_image_id_media_assets_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_sub_services" ADD CONSTRAINT "impact_sub_services_impact_id_impact_case_studies_id_fk" FOREIGN KEY ("impact_id") REFERENCES "public"."impact_case_studies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact_sub_services" ADD CONSTRAINT "impact_sub_services_sub_service_id_sub_services_id_fk" FOREIGN KEY ("sub_service_id") REFERENCES "public"."sub_services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_categories" ADD CONSTRAINT "insight_categories_insight_id_insights_id_fk" FOREIGN KEY ("insight_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_categories" ADD CONSTRAINT "insight_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_tags" ADD CONSTRAINT "insight_tags_insight_id_insights_id_fk" FOREIGN KEY ("insight_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_tags" ADD CONSTRAINT "insight_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insights" ADD CONSTRAINT "insights_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insights" ADD CONSTRAINT "insights_cover_image_id_media_assets_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_assets_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_services" ADD CONSTRAINT "sub_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_avatar_id_media_assets_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;