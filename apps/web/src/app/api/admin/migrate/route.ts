import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@envint/db';

/**
 * One-shot migration endpoint — run this ONCE after deployment.
 * Protected by MIGRATION_SECRET env var.
 * 
 * Usage: curl -X POST https://envintglobal.com/api/admin/migrate \
 *   -H "Authorization: Bearer YOUR_MIGRATION_SECRET"
 */
export async function POST(req: Request) {
  const secret = process.env.MIGRATION_SECRET;
  const auth = req.headers.get('Authorization');

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Create the pageviews table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "pageviews" (
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
      )
    `);

    // Create performance indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_created_at" ON "pageviews" ("created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_visitor_date" ON "pageviews" ("visitor_hash", "created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_referrer_source" ON "pageviews" ("referrer_source")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_path" ON "pageviews" ("path")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_country" ON "pageviews" ("country")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_pageviews_bot_agent" ON "pageviews" ("bot_agent")`);

    return NextResponse.json({
      ok: true,
      message: 'pageviews table and indexes created successfully.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
