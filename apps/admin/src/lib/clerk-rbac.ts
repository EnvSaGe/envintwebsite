import { auth, currentUser } from '@clerk/nextjs/server';

export type UserRole = 'super_admin' | 'editor';

/**
 * Returns the current authenticated user's role from Clerk publicMetadata.
 * Returns null if the user is not signed in.
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) return null;

    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role === 'super_admin') return 'super_admin';
    if (role === 'editor') return 'editor';

    // Default role for any authenticated team member
    return 'editor';
  } catch {
    return null;
  }
}

/**
 * Asserts that the current user is authenticated.
 * Throws 401 Unauthorized if not signed in.
 */
export async function assertAuthenticated(): Promise<{ userId: string }> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized: You must be signed in to perform this action.');
  }
  return { userId };
}

/**
 * Ensures user has the required permission level.
 * Throws if unauthenticated or missing role.
 * Returns the user's role on success.
 */
export async function requireRole(allowedRoles: UserRole[] = ['super_admin', 'editor']): Promise<UserRole> {
  const { userId } = await assertAuthenticated();

  const { sessionClaims } = await auth();
  const rawRole = (sessionClaims?.metadata as { role?: string })?.role;

  const role: UserRole = rawRole === 'super_admin' ? 'super_admin' : 'editor';

  if (!allowedRoles.includes(role)) {
    throw new Error(
      `Forbidden: This action requires one of [${allowedRoles.join(', ')}] but you have role '${role}'.`
    );
  }

  return role;
}

/**
 * Returns the current user's Clerk ID and display name.
 * Used for storing who made a change in revision history.
 */
export async function getCurrentUserInfo(): Promise<{ clerkId: string; name: string } | null> {
  try {
    const user = await currentUser();
    if (!user) return null;
    return {
      clerkId: user.id,
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Unknown',
    };
  } catch {
    return null;
  }
}
