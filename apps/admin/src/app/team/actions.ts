'use server';

import { db, teamMembers, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';

export async function fetchTeam() {
  await requireRole(['super_admin', 'editor']);

  const records = await db.query.teamMembers.findMany({
    orderBy: (m, { asc }) => [asc(m.orderIndex)],
    with: { avatar: true },
  });

  return records.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    roleTitle: m.roleTitle,
    bio: m.bio,
    shortBio: m.shortBio,
    avatarUrl: m.avatarUrl || m.avatar?.url || null,
    linkedinUrl: m.linkedinUrl,
    twitterUrl: m.twitterUrl,
    email: m.email,
    isLeadership: m.isLeadership,
    hasStandaloneRoute: m.hasStandaloneRoute,
    orderIndex: m.orderIndex,
    status: m.status,
    seoTitle: m.seoTitle,
    seoDescription: m.seoDescription,
    updatedAt: m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : 'Never',
  }));
}

export async function fetchTeamMemberBySlug(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.slug, slug),
    with: { avatar: true },
  });

  if (!record) return null;

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    roleTitle: record.roleTitle,
    bio: record.bio,
    shortBio: record.shortBio,
    avatarUrl: record.avatarUrl || record.avatar?.url || null,
    linkedinUrl: record.linkedinUrl,
    twitterUrl: record.twitterUrl,
    email: record.email,
    isLeadership: record.isLeadership,
    hasStandaloneRoute: record.hasStandaloneRoute,
    orderIndex: record.orderIndex,
    status: record.status,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
  };
}

export async function saveTeamMemberAction(member: {
  slug: string;
  name: string;
  roleTitle: string;
  bio: string;
  shortBio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  email?: string;
  isLeadership?: boolean;
  hasStandaloneRoute?: boolean;
  orderIndex?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seoTitle?: string;
  seoDescription?: string;
}) {
  await requireRole(['super_admin', 'editor']);

  if (!member.slug || !member.name || !member.roleTitle) {
    throw new Error('Team member slug, name, and roleTitle are required.');
  }

  await db
    .insert(teamMembers)
    .values({
      slug: member.slug,
      name: member.name,
      roleTitle: member.roleTitle,
      bio: member.bio || '',
      shortBio: member.shortBio || null,
      avatarUrl: member.avatarUrl || null,
      linkedinUrl: member.linkedinUrl || null,
      twitterUrl: member.twitterUrl || null,
      email: member.email || null,
      isLeadership: member.isLeadership !== undefined ? member.isLeadership : true,
      hasStandaloneRoute: member.hasStandaloneRoute !== undefined ? member.hasStandaloneRoute : true,
      orderIndex: member.orderIndex ?? 0,
      status: member.status || 'PUBLISHED',
      seoTitle: member.seoTitle || `${member.name} - ${member.roleTitle} at Envint`,
      seoDescription: member.seoDescription || member.shortBio || null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: teamMembers.slug,
      set: {
        name: member.name,
        roleTitle: member.roleTitle,
        bio: member.bio || '',
        shortBio: member.shortBio || null,
        avatarUrl: member.avatarUrl || null,
        linkedinUrl: member.linkedinUrl || null,
        twitterUrl: member.twitterUrl || null,
        email: member.email || null,
        isLeadership: member.isLeadership !== undefined ? member.isLeadership : true,
        hasStandaloneRoute: member.hasStandaloneRoute !== undefined ? member.hasStandaloneRoute : true,
        orderIndex: member.orderIndex ?? 0,
        status: member.status || 'PUBLISHED',
        seoTitle: member.seoTitle || `${member.name} - ${member.roleTitle} at Envint`,
        seoDescription: member.seoDescription || member.shortBio || null,
        updatedAt: new Date(),
      },
    });

  await dispatchRevalidation({
    tags: ['team:list', `team:${member.slug}`],
  });

  return { success: true };
}

export async function deleteTeamMemberAction(slug: string) {
  await requireRole(['super_admin']);

  const record = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.slug, slug),
    columns: { id: true },
  });

  if (!record) throw new Error(`Team member not found: ${slug}`);

  await db.delete(teamMembers).where(eq(teamMembers.id, record.id));

  await dispatchRevalidation({
    tags: ['team:list', `team:${slug}`],
  });

  return { success: true };
}
