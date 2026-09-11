'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { fetchImpacts, saveImpactAction, deleteImpactAction } from './actions';

export default function CaseStudiesPage() {
  const [impacts, setImpacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingImpact, setEditingImpact] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchImpacts();
      setImpacts(data);
    } catch (err: any) {
      setMessage(err.message || 'Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = impacts.filter((item) => {
    const q = searchQuery.toLowerCase();
    return item.title?.toLowerCase().includes(q) || item.slug?.toLowerCase().includes(q) || item.summary?.toLowerCase().includes(q);
  });

  const handleCreateNew = () => {
    setEditingImpact({
      id: String(Date.now()),
      title: '',
      slug: '',
      summary: '',
      coverImageUrl: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
      categories: ['Climate Action'],
      contentHtml: '<p>Case study problem, solution, and measurable business impact...</p>',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImpact.title || !editingImpact.slug) {
      alert('Please provide title and slug.');
      return;
    }
    setIsSaving(true);
    try {
      await saveImpactAction(editingImpact);
      setMessage('Case study saved successfully!');
      setTimeout(() => setMessage(null), 3000);
      setEditingImpact(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving case study');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteImpactAction(slug);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting case study');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/case-studies" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Client Impact Case Studies
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Showcase measurable ESG, decarbonization, and sustainability outcomes for corporate clients.
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
            <span>Add Case Study</span>
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
            placeholder="Search by title, client, or slug..."
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

        {/* List */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 2fr 1.5fr 1.5fr',
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div>Title & Route</div>
            <div>Client / Summary</div>
            <div>Categories</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading case studies...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No case studies found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map((item, index) => (
                <div
                  key={item.slug || index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 2fr 1.5fr 1.5fr',
                    padding: '16px 24px',
                    alignItems: 'center',
                    borderBottom: index < filtered.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        style={{ width: '44px', height: '32px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    ) : null}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        <code>/impact/{item.slug}</code>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#475569', paddingRight: '16px' }}>
                    {item.summary || 'Client outcome'}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(item.categories || []).slice(0, 2).map((cat: string) => (
                      <span key={cat} style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <a
                      href={`https://envintglobal.vercel.app/impact/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Live Page"
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#64748b' }}
                    >
                      <Eye size={15} />
                    </a>
                    <button
                      onClick={() => setEditingImpact(item)}
                      style={{ padding: '6px 12px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.slug, item.title)}
                      style={{ padding: '6px 8px', borderRadius: '6px', color: '#ef4444', backgroundColor: '#fef2f2' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {editingImpact && (
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
              maxWidth: '800px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  {editingImpact.id ? 'Edit Case Study' : 'New Case Study'}
                </h2>
                <button onClick={() => setEditingImpact(null)} style={{ color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '24px', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingImpact.title || ''}
                    onChange={(e) => setEditingImpact({ ...editingImpact, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Slug * (e.g. decarbonisation-indian-corporates)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingImpact.slug || ''}
                      onChange={(e) => setEditingImpact({ ...editingImpact, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Client Type / Industry Summary
                    </label>
                    <input
                      type="text"
                      value={editingImpact.summary || ''}
                      onChange={(e) => setEditingImpact({ ...editingImpact, summary: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Cover Image URL / S3 Path
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {editingImpact.coverImageUrl ? (
                        <img
                          src={editingImpact.coverImageUrl}
                          alt="Preview"
                          style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                          onError={(e: any) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      <input
                        type="text"
                        value={editingImpact.coverImageUrl || ''}
                        onChange={(e) => setEditingImpact({ ...editingImpact, coverImageUrl: e.target.value })}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        placeholder="https://envintcms.s3.ap-south-1.amazonaws.com/images/..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Full Story & Outcomes (HTML / Text)
                  </label>
                  <textarea
                    rows={10}
                    value={editingImpact.contentHtml || ''}
                    onChange={(e) => setEditingImpact({ ...editingImpact, contentHtml: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingImpact(null)}
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
                    <span>{isSaving ? 'Saving...' : 'Save Case Study'}</span>
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
