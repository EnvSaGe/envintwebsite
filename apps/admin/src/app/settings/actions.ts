'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { requireRole } from '@/lib/clerk-rbac';
import { revalidatePath } from 'next/cache';

export interface UserItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  role: 'super_admin' | 'editor' | 'none';
  createdAt: number;
}

/**
 * Super Admin only: List all team users from Clerk
 */
export async function listTeamUsers(): Promise<UserItem[]> {
  await requireRole(['super_admin']);

  const client = await clerkClient();
  const response = await client.users.getUserList({
    limit: 50,
    orderBy: '-created_at',
  });

  return response.data.map((u) => {
    const primaryEmail = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress || u.emailAddresses[0]?.emailAddress || 'No email';
    const metadata = (u.publicMetadata as { role?: string }) || {};
    const role = (metadata.role === 'super_admin' || metadata.role === 'editor') ? metadata.role : 'none';

    return {
      id: u.id,
      email: primaryEmail,
      firstName: u.firstName,
      lastName: u.lastName,
      imageUrl: u.imageUrl,
      role,
      createdAt: u.createdAt,
    };
  });
}

/**
 * Super Admin only: Update a user's role in Clerk publicMetadata
 */
export async function updateUserRole(userId: string, newRole: 'super_admin' | 'editor' | 'none') {
  await requireRole(['super_admin']);

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: newRole === 'none' ? null : newRole,
    },
  });

  revalidatePath('/settings');
  return { success: true };
}

/**
 * Super Admin only: Create a new user with an initial role
 */
export async function createTeamUser(formData: {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: 'super_admin' | 'editor';
}) {
  await requireRole(['super_admin']);

  const client = await clerkClient();
  const user = await client.users.createUser({
    emailAddress: [formData.email],
    firstName: formData.firstName,
    lastName: formData.lastName,
    password: formData.password || undefined,
    publicMetadata: {
      role: formData.role,
    },
  });

  revalidatePath('/settings');
  return { success: true, userId: user.id };
}

/**
 * Super Admin only: Revoke access / Delete user
 */
export async function deleteTeamUser(userId: string) {
  await requireRole(['super_admin']);

  const client = await clerkClient();
  await client.users.deleteUser(userId);

  revalidatePath('/settings');
  return { success: true };
}
