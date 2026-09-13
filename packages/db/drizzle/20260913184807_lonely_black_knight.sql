CREATE TABLE IF NOT EXISTS "content_dependencies" (
	"source_type" varchar(50) NOT NULL,
	"source_key" varchar(255) NOT NULL,
	"route_path" varchar(500) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_dependencies_source_type_source_key_route_path_pk" PRIMARY KEY("source_type","source_key","route_path")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"kind" varchar(50) NOT NULL,
	"description" varchar(500),
	"draft_blocks" jsonb,
	"published_blocks" jsonb,
	"schema_version" integer DEFAULT 2 NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "content_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "global_block_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"global_block_slug" varchar(100) NOT NULL,
	"blocks" jsonb NOT NULL,
	"version_number" integer NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"saved_by_clerk_id" varchar(255),
	"saved_by_name" varchar(255),
	"note" varchar(500),
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reusable_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"category" varchar(100) DEFAULT 'cta' NOT NULL,
	"description" varchar(500),
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_global" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reusable_blocks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "layout_template" SET DEFAULT 'standard';--> statement-breakpoint
ALTER TABLE "page_revisions" ADD COLUMN IF NOT EXISTS "version_number" integer;--> statement-breakpoint
ALTER TABLE "page_revisions" ADD COLUMN IF NOT EXISTS "is_published_snapshot" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "draft_blocks" jsonb;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "published_blocks" jsonb;
