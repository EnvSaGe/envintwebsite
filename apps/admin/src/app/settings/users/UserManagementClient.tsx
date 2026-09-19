'use client';

import React, { useState, useTransition } from 'react';
import { inviteUser, updateUserRole, deactivateUser, reactivateUser } from './actions';

type UserRole = 'super_admin' | 'editor';

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole | string;
  isActive: boolean;
  createdAt: string;
  imageUrl?: string;
}

interface Props {
  initialUsers: AdminUser[];
}

export default function UserManagementClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('editor');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function notify(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    startTransition(async () => {
      try {
        const res = await inviteUser(inviteEmail, inviteRole);
        notify('success', `✅ Invitation sent to ${res.email}`);
        setInviteEmail('');
      } catch (err: any) {
        notify('error', `❌ ${err.message}`);
      }
    });
  }

  function handleRoleChange(userId: string, newRole: UserRole) {
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        notify('success', 'Role updated successfully.');
      } catch (err: any) {
        notify('error', `❌ ${err.message}`);
      }
    });
  }

  function handleToggleActive(user: AdminUser) {
    startTransition(async () => {
      try {
        if (user.isActive) {
          await deactivateUser(user.id);
          setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: false } : u)));
          notify('success', `User ${user.email} deactivated.`);
        } else {
          await reactivateUser(user.id);
          setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: true } : u)));
          notify('success', `User ${user.email} reactivated.`);
        }
      } catch (err: any) {
        notify('error', `❌ ${err.message}`);
      }
    });
  }

  return (
    <div style={{ padding: '32px', maxWidth: '960px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
        Team & User Management
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '32px' }}>
        Invite team members, assign roles, and manage access. Role changes take effect immediately via Clerk.
      </p>

      {/* Notification */}
      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          {message.text}
        </div>
      )}

      {/* Invite Form */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
          ✉️ Invite a New Team Member
        </h2>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ minWidth: '140px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              <option value="editor">Editor</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending || !inviteEmail}
            style={{
              padding: '10px 20px',
              backgroundColor: isPending ? '#94a3b8' : '#45b653',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isPending ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {isPending ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '12px' }}>
          The invited user will receive a Clerk email invitation. They can sign up using that link.
        </p>
      </div>

      {/* Users Table */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
        Current Team Members ({users.length})
      </h2>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Member', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} style={{ borderBottom: idx < users.length - 1 ? '1px solid #f1f5f9' : 'none', opacity: user.isActive ? 1 : 0.55 }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                        {(user.firstName || user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{user.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    disabled={isPending}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.8rem',
                      backgroundColor: user.role === 'super_admin' ? '#fef3c7' : '#f0fdf4',
                      color: user.role === 'super_admin' ? '#92400e' : '#166534',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <option value="editor">Editor</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                    color: user.isActive ? '#166534' : '#991b1b',
                  }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.8rem' }}>{user.createdAt}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => handleToggleActive(user)}
                    disabled={isPending}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${user.isActive ? '#fca5a5' : '#86efac'}`,
                      backgroundColor: user.isActive ? '#fff' : '#f0fdf4',
                      color: user.isActive ? '#dc2626' : '#16a34a',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: isPending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {user.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No team members found. Invite your first colleague above.
          </div>
        )}
      </div>

      {/* Role explanation */}
      <div style={{ marginTop: '24px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' }}>
        <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0, lineHeight: 1.6 }}>
          <strong>Editor:</strong> Can create, edit, and publish content (pages, insights, impacts, team).<br />
          <strong>Super Admin:</strong> All editor permissions + can manage users, delete any content, and access system settings.
        </p>
      </div>
    </div>
  );
}
