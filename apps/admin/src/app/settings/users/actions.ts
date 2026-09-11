'use server';

import { requireRole } from '@/lib/clerk-rbac';

/**
 * Super Admin: User Management Actions
 * 
 * Uses Clerk Backend API to manage users — invite, update roles, deactivate.
 * Role assignments are stored in Clerk's publicMetadata.role field.
 * 
 * Required env: CLERK_SECRET_KEY
 */

const CLERK_API = 'https://api.clerk.com/v1';

async function clerkFetch(path: string, options: RequestInit = {}) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new Error('CLERK_SECRET_KEY is not configured.');

  const res = await fetch(`${CLERK_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '(no body)');
    throw new Error(`Clerk API error ${res.status}: ${errText}`);
  }

  return res.json();
}

export async function listAdminUsers() {
  await requireRole(['super_admin']);

  const data = await clerkFetch('/users?limit=100');
  return (data as any[]).map((u: any) => ({
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email_addresses?.[0]?.email_address || '',
    role: u.public_metadata?.role || 'editor',
    isActive: !u.banned,
    createdAt: new Date(u.created_at).toLocaleDateString(),
    imageUrl: u.image_url,
  }));
}

export async function inviteUser(email: string, role: 'super_admin' | 'editor' = 'editor') {
  await requireRole(['super_admin']);

  if (!email || !email.includes('@')) {
    throw new Error('A valid email address is required.');
  }

  // Clerk invitations use the invitations endpoint
  const data = await clerkFetch('/invitations', {
    method: 'POST',
    body: JSON.stringify({
      email_address: email,
      public_metadata: { role },
      redirect_url: `${process.env.NEXT_PUBLIC_ADMIN_URL || ''}/sign-in`,
      notify: true,
    }),
  });

  return {
    success: true,
    invitationId: data.id,
    email: data.email_address,
  };
}

export async function updateUserRole(userId: string, role: 'super_admin' | 'editor') {
  await requireRole(['super_admin']);

  await clerkFetch(`/users/${userId}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify({
      public_metadata: { role },
    }),
  });

  return { success: true };
}

export async function deactivateUser(userId: string) {
  await requireRole(['super_admin']);

  await clerkFetch(`/users/${userId}/ban`, {
    method: 'POST',
  });

  return { success: true };
}

export async function reactivateUser(userId: string) {
  await requireRole(['super_admin']);

  await clerkFetch(`/users/${userId}/unban`, {
    method: 'POST',
  });

  return { success: true };
}
