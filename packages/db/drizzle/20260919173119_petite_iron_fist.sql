CREATE TABLE "pageviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_hash" varchar(64) NOT NULL,
	"path" varchar(500) NOT NULL,
	"referrer_source" varchar(64) DEFAULT 'direct' NOT NULL,
	"referrer_url" text,
	"country" varchar(2),
	"city" varchar(100),
	"device_type" varchar(20) DEFAULT 'desktop' NOT NULL,
	"bot_agent" varchar(100),
	"page_title" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Performance indexes for dashboard queries
CREATE INDEX IF NOT EXISTS "idx_pageviews_created_at" ON "pageviews" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_pageviews_visitor_date" ON "pageviews" ("visitor_hash", "created_at");
CREATE INDEX IF NOT EXISTS "idx_pageviews_referrer_source" ON "pageviews" ("referrer_source");
CREATE INDEX IF NOT EXISTS "idx_pageviews_path" ON "pageviews" ("path");
CREATE INDEX IF NOT EXISTS "idx_pageviews_country" ON "pageviews" ("country");
CREATE INDEX IF NOT EXISTS "idx_pageviews_bot_agent" ON "pageviews" ("bot_agent");
