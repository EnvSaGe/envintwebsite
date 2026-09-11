import { Metadata } from 'next';
import { requireRole } from '@/lib/clerk-rbac';
import { listAdminUsers } from './actions';
import UserManagementClient from './UserManagementClient';

export const metadata: Metadata = {
  title: 'User Management — Envint Admin',
};

export default async function UsersPage() {
  await requireRole(['super_admin']);
  const users = await listAdminUsers();
  return <UserManagementClient initialUsers={users} />;
}
