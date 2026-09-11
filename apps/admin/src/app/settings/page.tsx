'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Check, 
  AlertTriangle,
  RefreshCw,
  Key,
  Globe
} from 'lucide-react';
import { listTeamUsers, updateUserRole, createTeamUser, deleteTeamUser, UserItem } from './actions';

export default function SettingsPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'editor' as 'super_admin' | 'editor',
  });

  const loadUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await listTeamUsers();
      setUsers(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load users. Ensure you have super_admin role.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'super_admin' | 'editor' | 'none') => {
    setActionLoading(userId);
    setErrorMsg(null);
    try {
      await updateUserRole(userId, newRole);
      setSuccessMsg('Role updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update role.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke access and delete account for ${email}?`)) return;
    setActionLoading(userId);
    setErrorMsg(null);
    try {
      await deleteTeamUser(userId);
      setSuccessMsg(`User ${email} deleted.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete user.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) {
      alert('Please fill in email and temporary password.');
      return;
    }
    setActionLoading('create');
    setErrorMsg(null);
    try {
      await createTeamUser(newUser);
      setShowAddModal(false);
      setNewUser({ email: '', firstName: '', lastName: '', password: '', role: 'editor' });
      setSuccessMsg('Team member created successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create user. Password must be at least 8 chars.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/settings" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Settings & Team Access
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Manage team members, grant Admin or Editor roles, and configure site environments.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}
          >
            <UserPlus size={18} />
            <span>Add Team Member</span>
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section: Team Members Table */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '36px' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#10b981" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Authorized Team Members (Role-Based Access)
              </h2>
            </div>
            <button
              onClick={loadUsers}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
            padding: '12px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div>Member</div>
            <div>Email Address</div>
            <div>Assigned Role</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading users from Clerk...</div>
          ) : users.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No team members found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {users.map((u, i) => (
                <div
                  key={u.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
                    padding: '16px 24px',
                    alignItems: 'center',
                    borderBottom: i < users.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={u.imageUrl || 'https://images.clerk.dev/static/avatar.png'}
                      alt=""
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>
                        {u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}` : 'Envint Member'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                        ID: {u.id.slice(0, 14)}...
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#334155' }}>
                    {u.email}
                  </div>

                  <div>
                    <select
                      value={u.role}
                      disabled={actionLoading === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        backgroundColor: u.role === 'super_admin' ? '#ecfdf5' : u.role === 'editor' ? '#eff6ff' : '#fef2f2',
                        color: u.role === 'super_admin' ? '#047857' : u.role === 'editor' ? '#1d4ed8' : '#b91c1c',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="super_admin">Super Admin (Full Control)</option>
                      <option value="editor">Editor (Content & Pages)</option>
                      <option value="none">No Access (Revoked)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.email)}
                      disabled={actionLoading === u.id}
                      title="Delete User"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        color: '#ef4444',
                        backgroundColor: '#fef2f2',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Site Details Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Globe size={20} color="#3b82f6" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Production Deployments</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Live Domain:</span>
                <a href="https://envintglobal.com" target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600 }}>
                  envintglobal.com
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Vercel Staging:</span>
                <a href="https://envintglobal.vercel.app" target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600 }}>
                  envintglobal.vercel.app
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Admin CMS:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>admin.envintglobal.com (Port 3001)</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Key size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Authentication & Security</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Auth Provider:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Clerk (Free Tier)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Public Sign-ups:</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>Disabled (Invite Only)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>RBAC Enforcement:</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>Active in Middleware</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Team Member */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '28px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
                Add New Team Member
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                Create an authorized account and assign their role immediately.
              </p>

              <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. fiona@envintglobal.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fiona"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Admin"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Temporary Password (min 8 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    User can also use &ldquo;Continue with Google&rdquo; matching this email address.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Assign Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600 }}
                  >
                    <option value="editor">Editor (Can edit articles, pages & team)</option>
                    <option value="super_admin">Super Admin (Full permissions & user management)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'create'}
                    style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#10b981', color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    {actionLoading === 'create' ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
