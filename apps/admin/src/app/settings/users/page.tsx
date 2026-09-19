import { Metadata } from 'next';
import { getCurrentUserRole } from '@/lib/clerk-rbac';
import { redirect } from 'next/navigation';
import { listAdminUsers } from './actions';
import UserManagementClient from './UserManagementClient';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'User Management — Envint Admin',
};

export default async function UsersPage() {
  const role = await getCurrentUserRole();
  if (role !== 'super_admin') {
    redirect('/access-denied');
  }

  const users = await listAdminUsers().catch(() => []);
  return <UserManagementClient initialUsers={users} />;
}
