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
 * List all team users from Clerk (accessible by super_admin and editor)
 */
export async function listTeamUsers(): Promise<UserItem[]> {
  try {
    await requireRole(['super_admin', 'editor']);

    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 50,
      orderBy: '-created_at',
    });

    const userList: any[] = Array.isArray(response)
      ? response
      : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];

    return userList.map((u: any) => {
      const emailObj =
        u.emailAddresses?.find((e: any) => e.id === u.primaryEmailAddressId) ||
        u.emailAddresses?.[0];
      const primaryEmail =
        typeof emailObj === 'string'
          ? emailObj
          : emailObj?.emailAddress || 'No email';
      const metadata = (u.publicMetadata as { role?: string }) || {};
      const role =
        metadata.role === 'super_admin' || metadata.role === 'editor'
          ? metadata.role
          : 'none';

      return {
        id: u.id,
        email: primaryEmail,
        firstName: u.firstName || null,
        lastName: u.lastName || null,
        imageUrl: u.imageUrl || '',
        role,
        createdAt: u.createdAt || Date.now(),
      };
    });
  } catch (err: any) {
    console.error('Error in listTeamUsers:', err);
    return [];
  }
}

/**
 * Super Admin only: Update a user's role in Clerk publicMetadata
 */
export async function updateUserRole(userId: string, newRole: 'super_admin' | 'editor' | 'none') {
  try {
    await requireRole(['super_admin']);

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: newRole === 'none' ? null : newRole,
      },
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('updateUserRole error:', err);
    return { success: false, error: err.message || 'Failed to update user role' };
  }
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
  try {
    await requireRole(['super_admin']);

    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Email address is required.' };
    }

    const client = await clerkClient();

    // Clerk instance requires a valid unique username
    const baseUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user';
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const username = `${baseUsername}_${randomSuffix}`.substring(0, 60);

    const user = await client.users.createUser({
      emailAddress: [cleanEmail],
      username,
      firstName: formData.firstName?.trim() || undefined,
      lastName: formData.lastName?.trim() || undefined,
      password: formData.password || undefined,
      skipPasswordChecks: true,
      publicMetadata: {
        role: formData.role,
      },
    });

    revalidatePath('/settings');
    return { success: true, userId: user.id };
  } catch (err: any) {
    console.error('createTeamUser error:', err);
    const errorDetail =
      err.errors?.[0]?.longMessage ||
      err.errors?.[0]?.message ||
      err.message ||
      'Failed to create user in Clerk.';
    return { success: false, error: errorDetail };
  }
}

/**
 * Super Admin only: Revoke access / Delete user
 */
export async function deleteTeamUser(userId: string) {
  try {
    await requireRole(['super_admin']);

    const client = await clerkClient();
    await client.users.deleteUser(userId);

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('deleteTeamUser error:', err);
    const errorDetail =
      err.errors?.[0]?.longMessage ||
      err.errors?.[0]?.message ||
      err.message ||
      'Failed to delete user';
    return { success: false, error: errorDetail };
  }
}
