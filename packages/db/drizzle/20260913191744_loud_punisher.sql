CREATE TABLE IF NOT EXISTS "content_template_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_slug" varchar(100) NOT NULL,
	"blocks" jsonb NOT NULL,
	"schema_version" integer DEFAULT 2 NOT NULL,
	"version_number" integer NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"saved_by_clerk_id" varchar(255),
	"saved_by_name" varchar(255),
	"note" varchar(500),
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL
);
