'use server';

import { db, leadSubmissions, desc, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';
import { revalidatePath } from 'next/cache';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface LeadSubmissionItem {
  id: string;
  formType: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  location: string | null;
  category: string | null;
  message: string | null;
  ipAddress: string | null;
  isProcessed: boolean;
  createdAt: string;
}

export async function getLeadSubmissions(): Promise<{
  success: boolean;
  leads: LeadSubmissionItem[];
  role?: 'super_admin' | 'editor';
  error?: string;
}> {
  try {
    const role = await requireRole(['super_admin', 'editor']);
    const rows = await db
      .select({
        id: leadSubmissions.id,
        formType: leadSubmissions.formType,
        fullName: leadSubmissions.fullName,
        email: leadSubmissions.email,
        phone: leadSubmissions.phone,
        company: leadSubmissions.company,
        location: leadSubmissions.location,
        category: leadSubmissions.category,
        message: leadSubmissions.message,
        ipAddress: leadSubmissions.ipAddress,
        isProcessed: leadSubmissions.isProcessed,
        createdAt: leadSubmissions.createdAt,
      })
      .from(leadSubmissions)
      .orderBy(desc(leadSubmissions.createdAt))
      .limit(500);

    return {
      success: true,
      role,
      leads: rows.map((r) => ({
        ...r,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      })),
    };
  } catch (err: any) {
    console.error('[leads] getLeadSubmissions failed:', err);
    return {
      success: false,
      leads: [],
      error: err?.message || 'Failed to load leads from database.',
    };
  }
}

export async function toggleLeadProcessed(
  id: string,
  isProcessed: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireRole(['super_admin', 'editor']);
    if (!UUID_REGEX.test(id)) {
      return { success: false, error: 'Invalid submission ID.' };
    }

    await db
      .update(leadSubmissions)
      .set({ isProcessed })
      .where(eq(leadSubmissions.id, id));

    revalidatePath('/leads');
    return { success: true };
  } catch (err: any) {
    console.error('[leads] toggleLeadProcessed failed:', err);
    return { success: false, error: err?.message || 'Failed to update lead status.' };
  }
}

export async function deleteLeadSubmission(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireRole(['super_admin']);
    if (!UUID_REGEX.test(id)) {
      return { success: false, error: 'Invalid submission ID.' };
    }

    await db.delete(leadSubmissions).where(eq(leadSubmissions.id, id));

    revalidatePath('/leads');
    return { success: true };
  } catch (err: any) {
    console.error('[leads] deleteLeadSubmission failed:', err);
    return { success: false, error: err?.message || 'Failed to delete submission.' };
  }
}
