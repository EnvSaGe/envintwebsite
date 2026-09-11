import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  // Use 'pg' for drizzle-kit push/migrate (works without WebSocket)
  // Runtime code uses @neondatabase/serverless via src/index.ts
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  driver: undefined,
  // Disable WebSocket for drizzle-kit; use native postgres TLS
  migrations: {
    prefix: 'timestamp',
  },
});
