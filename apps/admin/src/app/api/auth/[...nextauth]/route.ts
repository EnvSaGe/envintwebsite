import { NextResponse } from 'next/server';

// Auth.js (NextAuth) has been replaced by Clerk.
// This route is intentionally disabled.
// Authentication is handled by Clerk middleware at apps/admin/src/middleware.ts

export async function GET() {
  return NextResponse.json({ error: 'Auth.js is disabled. Authentication is handled by Clerk.' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: 'Auth.js is disabled. Authentication is handled by Clerk.' }, { status: 410 });
}
