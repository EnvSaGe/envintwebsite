'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Check, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { fetchTeam, saveTeamMemberAction, deleteTeamMemberAction } from './actions';
import { RichTextEditor } from '../../components/RichTextEditor';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTeam();
      setMembers(data);
    } catch (err: any) {
      setMessage(err.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return m.name?.toLowerCase().includes(q) || m.roleTitle?.toLowerCase().includes(q);
  });

  const handleCreateNew = () => {
    setEditingMember({
      id: String(Date.now()),
      name: '',
      slug: '',
      roleTitle: 'Consultant',
      shortBio: '',
      bio: '',
      linkedinUrl: '',
      avatarUrl: '',
      hasStandaloneRoute: false,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember.name || !editingMember.slug) {
      alert('Please provide member name and slug.');
      return;
    }
    setIsSaving(true);
    try {
      await saveTeamMemberAction(editingMember);
      setMessage('Team member saved successfully!');
      setTimeout(() => setMessage(null), 3000);
      setEditingMember(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving team member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team list?`)) return;
    try {
      await deleteTeamMemberAction(slug);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting member');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/team" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Team & Leadership
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Manage leadership partners, consultants, bios, photos, and standalone bio profiles.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
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
            <Plus size={18} />
            <span>Add Team Member</span>
          </button>
        </div>

        {message && (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} />
            <span>{message}</span>
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: '24px', position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              backgroundColor: '#ffffff'
            }}
          />
        </div>

        {/* Members Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {loading ? (
            <div style={{ padding: '40px', color: '#94a3b8' }}>Loading team members...</div>
          ) : filtered.map((m) => (
            <div
              key={m.slug}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <img
                    src={m.avatarUrl || 'https://images.clerk.dev/static/avatar.png'}
                    alt={m.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                    onError={(e: any) => { e.target.src = 'https://images.clerk.dev/static/avatar.png'; }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                      {m.roleTitle}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      /{m.slug}
                    </div>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.82rem',
                  color: '#64748b',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '14px'
                }}>
                  {m.shortBio || m.bio || 'No bio written.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {m.linkedinUrl && (
                    <a href={m.linkedinUrl} target="_blank" rel="noreferrer" title="LinkedIn Profile" style={{ color: '#0077b5', display: 'flex', alignItems: 'center' }}>
                      <ExternalLink size={15} />
                    </a>
                  )}
                  {m.hasStandaloneRoute && (
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      Standalone URL
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingMember(m)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(m.slug, m.name)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      color: '#ef4444',
                      backgroundColor: '#fef2f2',
                      fontSize: '0.8rem'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingMember && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(4px)',
            padding: '24px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  {editingMember.id ? 'Edit Team Member' : 'New Team Member'}
                </h2>
                <button onClick={() => setEditingMember(null)} style={{ color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '24px', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.name || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Role / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.roleTitle || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, roleTitle: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Slug * (e.g. anand-krishnamurthy)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.slug || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Photo URL / S3 Path
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {editingMember.avatarUrl ? (
                        <img
                          src={editingMember.avatarUrl}
                          alt="Preview"
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                          onError={(e: any) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      <input
                        type="text"
                        value={editingMember.avatarUrl || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, avatarUrl: e.target.value })}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        placeholder="https://envintcms.s3.ap-south-1.amazonaws.com/images/..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={editingMember.linkedinUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, linkedinUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Short Bio (Appears on hover cards)
                  </label>
                  <input
                    type="text"
                    value={editingMember.shortBio || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, shortBio: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Full Bio (Modal & Standalone Page)
                  </label>
                  <RichTextEditor
                    value={editingMember.bio || ''}
                    onChange={(html) => setEditingMember({ ...editingMember, bio: html })}
                    minHeight={200}
                    placeholder="Write the team member bio…"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="hasStandaloneRoute"
                    checked={editingMember.hasStandaloneRoute || false}
                    onChange={(e) => setEditingMember({ ...editingMember, hasStandaloneRoute: e.target.checked })}
                  />
                  <label htmlFor="hasStandaloneRoute" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Enable standalone profile route (`/member/${editingMember.slug || 'name'}`)
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 20px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
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
