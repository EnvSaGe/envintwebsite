'use client';

/**
 * ============================================================================
 * TEAM MANAGEMENT DASHBOARD (`/team`)
 * ============================================================================
 * 
 * PURPOSE:
 * Content management dashboard for all team members and leadership profiles
 * displayed on the `/about` page and `/member/[slug]` bio routes.
 * 
 * FEATURES:
 * - Table/cards of team members with display rank (#1, #2, etc.).
 * - Reorder Profiles modal with 1-click presets:
 *   - "Partners First + A-Z"
 *   - "Alphabetical (A-Z)"
 *   - "Reverse (Z-A)"
 *   - Move to Top, Move Up, Move Down, Move to Bottom controls
 * - Quick Up / Down shift buttons directly on each team card.
 * - Modal editor: Name, slug, role title, order index, bio HTML, profile avatar S3 URL,
 *   leadership toggle, and social links.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Check, 
  ExternalLink,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { fetchTeam, saveTeamMemberAction, deleteTeamMemberAction, reorderTeamMembersAction } from './actions';
import { RichTextEditor } from '../../components/RichTextEditor';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Reorder modal state
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderList, setReorderList] = useState<any[]>([]);
  const [isSavingReorder, setIsSavingReorder] = useState(false);

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
      orderIndex: members.length,
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
      const res = await saveTeamMemberAction(editingMember);
      if (res && !res.success) {
        alert(res.error || 'Error saving team member');
        setIsSaving(false);
        return;
      }
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
      const res = await deleteTeamMemberAction(slug);
      if (res && !res.success) {
        alert(res.error || 'Error deleting member');
        return;
      }
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting member');
    }
  };

  // Quick 1-step move from card
  const handleQuickMove = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;
    const updated = [...members];
    const [moved] = updated.splice(currentIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setMembers(updated);
    try {
      const res = await reorderTeamMembersAction(updated.map((m) => m.slug));
      if (res && !res.success) {
        alert(res.error || 'Failed to update order');
        await loadData();
        return;
      }
      setMessage(`Moved ${moved.name} ${direction}. Order updated!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
      await loadData();
    }
  };

  // Reorder Modal Actions
  const openReorderModal = () => {
    setReorderList([...members]);
    setIsReorderModalOpen(true);
  };

  const closeReorderModal = () => {
    setIsReorderModalOpen(false);
  };

  const moveModalItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= reorderList.length) return;
    const updated = [...reorderList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setReorderList(updated);
  };

  const handleSortPartnersFirst = () => {
    const isPartner = (m: any) => /partner/i.test(m.roleTitle || '');
    const partners = reorderList.filter(isPartner).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    const nonPartners = reorderList.filter((m) => !isPartner(m)).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    setReorderList([...partners, ...nonPartners]);
  };

  const handleSortAlphabetical = () => {
    const sorted = [...reorderList].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    setReorderList(sorted);
  };

  const handleSortReverse = () => {
    const sorted = [...reorderList].sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' }));
    setReorderList(sorted);
  };

  const handleResetReorder = () => {
    setReorderList([...members]);
  };

  const handleSaveReorder = async () => {
    setIsSavingReorder(true);
    try {
      const res = await reorderTeamMembersAction(reorderList.map((m) => m.slug));
      if (res && !res.success) {
        alert(res.error || 'Failed to save team order');
        setIsSavingReorder(false);
        return;
      }
      setMessage('Team order saved successfully!');
      setTimeout(() => setMessage(null), 3500);
      setIsReorderModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving team order');
    } finally {
      setIsSavingReorder(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/team" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Team & Leadership
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Manage leadership partners, consultants, bios, photos, and team display ordering.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={openReorderModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              <ArrowUpDown size={16} color="#3079bd" />
              <span>Reorder Profiles</span>
            </button>

            <button
              onClick={handleCreateNew}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: '#3079bd',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(48, 121, 189, 0.25)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <Plus size={18} />
              <span>Add Team Member</span>
            </button>
          </div>
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
          ) : filtered.map((m, index) => (
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
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                      <div style={{ fontSize: '0.82rem', color: '#45b653', fontWeight: 600 }}>
                        {m.roleTitle}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                        /{m.slug}
                      </div>
                    </div>
                  </div>

                  <span
                    title={`Position in team roster: #${index + 1}`}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#475569',
                      backgroundColor: '#f1f5f9',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0,
                    }}
                  >
                    #{index + 1}
                  </span>
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
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {/* Quick Up/Down buttons */}
                  <button
                    type="button"
                    onClick={() => handleQuickMove(index, 'up')}
                    disabled={index === 0}
                    title="Move position earlier (Up)"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      color: index === 0 ? '#cbd5e1' : '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickMove(index, 'down')}
                    disabled={index === members.length - 1}
                    title="Move position later (Down)"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      color: index === members.length - 1 ? '#cbd5e1' : '#475569',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: index === members.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>

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

        {/* Reorder Profiles Modal */}
        {isReorderModalOpen && (
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
              borderRadius: '14px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}>
              {/* Modal Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowUpDown size={18} color="#3079bd" />
                    <span>Reorder Team Profiles</span>
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
                    Choose a 1-click automatic preset or manually adjust individual profile positions.
                  </p>
                </div>
                <button onClick={closeReorderModal} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Preset Action Options Bar */}
              <div style={{ padding: '14px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
                  Options:
                </span>
                
                <button
                  type="button"
                  onClick={handleSortPartnersFirst}
                  title="Place Partners on top and sort all other team members alphabetically"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Partners Top + A-Z</span>
                </button>

                <button
                  type="button"
                  onClick={handleSortAlphabetical}
                  title="Sort entire team roster alphabetically by first name (A to Z)"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Alphabetical (A-Z)
                </button>

                <button
                  type="button"
                  onClick={handleSortReverse}
                  title="Sort entire team roster in reverse alphabetical order (Z to A)"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Reverse (Z-A)
                </button>

                <button
                  type="button"
                  onClick={handleResetReorder}
                  title="Reset to current published order"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginLeft: 'auto',
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Scrollable Reorder List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reorderList.map((m, index) => {
                  const isPartner = /partner/i.test(m.roleTitle || '');
                  return (
                    <div
                      key={m.slug}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: isPartner ? '#f0fdf4' : '#ffffff',
                        border: isPartner ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: isPartner ? '#166534' : '#475569',
                          backgroundColor: isPartner ? '#dcfce7' : '#f1f5f9',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(0,0,0,0.05)',
                        }}>
                          #{index + 1}
                        </span>

                        <img
                          src={m.avatarUrl || 'https://images.clerk.dev/static/avatar.png'}
                          alt={m.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                          onError={(e: any) => { e.target.src = 'https://images.clerk.dev/static/avatar.png'; }}
                        />

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{m.name}</span>
                            {isPartner && (
                              <span style={{ fontSize: '0.68rem', backgroundColor: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                Partner
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{m.roleTitle}</div>
                        </div>
                      </div>

                      {/* Manual Move Actions */}
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => moveModalItem(index, 0)}
                          disabled={index === 0}
                          title="Move to top"
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: index === 0 ? '#cbd5e1' : '#334155',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <ChevronsUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModalItem(index, index - 1)}
                          disabled={index === 0}
                          title="Move up one position"
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: index === 0 ? '#cbd5e1' : '#334155',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModalItem(index, index + 1)}
                          disabled={index === reorderList.length - 1}
                          title="Move down one position"
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: index === reorderList.length - 1 ? '#cbd5e1' : '#334155',
                            cursor: index === reorderList.length - 1 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModalItem(index, reorderList.length - 1)}
                          disabled={index === reorderList.length - 1}
                          title="Move to bottom"
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: index === reorderList.length - 1 ? '#cbd5e1' : '#334155',
                            cursor: index === reorderList.length - 1 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <ChevronsDown size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
                <button
                  type="button"
                  onClick={closeReorderModal}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, backgroundColor: '#ffffff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingReorder}
                  onClick={handleSaveReorder}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 22px',
                    backgroundColor: '#3079bd',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(48, 121, 189, 0.25)',
                  }}
                >
                  <Save size={16} />
                  <span>{isSavingReorder ? 'Saving & Publishing...' : 'Save & Publish Order'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit / New Member Modal */}
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
                  {editingMember.id && !editingMember.id.startsWith('new_') ? 'Edit Team Member' : 'New Team Member'}
                </h2>
                <button onClick={() => setEditingMember(null)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                      Slug * (e.g. anushka or anand-krishnamurthy)
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
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={editingMember.linkedinUrl || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, linkedinUrl: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Display Order Position (Rank index)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingMember.orderIndex !== undefined && editingMember.orderIndex !== null ? editingMember.orderIndex : ''}
                      onChange={(e) => setEditingMember({ ...editingMember, orderIndex: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      placeholder="0, 1, 2... (lower appears earlier)"
                    />
                  </div>
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
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: 'none' }}
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
                      backgroundColor: '#3079bd',
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(48, 121, 189, 0.25)',
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
