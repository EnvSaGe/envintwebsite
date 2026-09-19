import { auth, currentUser } from '@clerk/nextjs/server';

export type UserRole = 'super_admin' | 'editor';

/**
 * Optional comma-separated list of super admin emails from environment variables.
 */
const envSuperAdmins = (process.env.SUPER_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Returns the current authenticated user's role dynamically:
 * 1. Checks Clerk user.publicMetadata.role via currentUser().
 * 2. Checks Clerk user.unsafeMetadata.role.
 * 3. Checks sessionClaims (metadata.role, publicMetadata.role, or role).
 * 4. Checks SUPER_ADMIN_EMAILS environment variable if configured.
 * Returns 'super_admin' or 'editor', or null if unauthenticated.
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return null;

    // 1. Fast path: check session claims if configured in JWT template
    const claimsRole =
      (sessionClaims?.metadata as { role?: string })?.role ||
      (sessionClaims?.publicMetadata as { role?: string })?.role ||
      (sessionClaims as any)?.role;

    if (claimsRole === 'super_admin') return 'super_admin';

    // 2. Authoritative check: fetch user dynamically from Clerk
    const user = await currentUser();
    if (user) {
      // Check Clerk user publicMetadata
      const metaRole = (user.publicMetadata as { role?: string })?.role;
      if (metaRole === 'super_admin') return 'super_admin';
      if (metaRole === 'editor') return 'editor';

      // Check Clerk user unsafeMetadata (fallback)
      const unsafeRole = (user.unsafeMetadata as { role?: string })?.role;
      if (unsafeRole === 'super_admin') return 'super_admin';
      if (unsafeRole === 'editor') return 'editor';

      // Optional check against SUPER_ADMIN_EMAILS env variable if configured
      if (envSuperAdmins.length > 0) {
        const userEmails = (user.emailAddresses || []).map((e) =>
          e.emailAddress.toLowerCase().trim()
        );
        if (userEmails.some((email) => envSuperAdmins.includes(email))) {
          return 'super_admin';
        }
      }
    }

    if (claimsRole === 'editor') return 'editor';

    // Default role for any authenticated team member
    return 'editor';
  } catch (err) {
    console.error('Error resolving user role:', err);
    return 'editor';
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
export async function requireRole(
  allowedRoles: UserRole[] = ['super_admin', 'editor']
): Promise<UserRole> {
  await assertAuthenticated();

  const role = await getCurrentUserRole();
  const effectiveRole: UserRole = role || 'editor';

  if (!allowedRoles.includes(effectiveRole)) {
    throw new Error(
      `Forbidden: This action requires one of [${allowedRoles.join(', ')}] but you have role '${effectiveRole}'.`
    );
  }

  return effectiveRole;
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
      name:
        `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        'Unknown',
    };
  } catch {
    return null;
  }
}
