import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ [Database Client] DATABASE_URL environment variable is NOT set! Please add DATABASE_URL in Netlify Site Configuration > Environment variables.');
    }
    const sql = neon(connectionString || 'postgresql://mock:mock@localhost:5432/mock');
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const val = Reflect.get(instance, prop, receiver);
    return typeof val === 'function' ? val.bind(instance) : val;
  }
});

export type DbClient = ReturnType<typeof getDb>;
