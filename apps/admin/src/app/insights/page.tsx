'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/Sidebar';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Check, 
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';
import { fetchInsights, saveInsightAction, deleteInsightAction } from './actions';
import { RichTextEditor } from '../../components/RichTextEditor';

export default function InsightsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchInsights();
      setArticles(data);
    } catch (err: any) {
      setMessage(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = articles.filter((a) => {
    const q = searchQuery.toLowerCase();
    return a.title?.toLowerCase().includes(q) || a.slug?.toLowerCase().includes(q);
  });

  const handleCreateNew = () => {
    setEditingArticle({
      id: Date.now(),
      title: '',
      slug: '',
      excerpt: '',
      contentHtml: '<p>Write your insight article content here...</p>',
      categories: ['Envision'],
      tags: [],
      seoTitle: '',
      seoDescription: '',
      coverImageUrl: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle.title || !editingArticle.slug) {
      alert('Please provide at least a title and URL slug.');
      return;
    }
    setIsSaving(true);
    try {
      await saveInsightAction(editingArticle);
      setMessage('Article saved successfully!');
      setTimeout(() => setMessage(null), 3000);
      setEditingArticle(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;
    try {
      await deleteInsightAction(slug);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting article');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/insights" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Insights & Thought Leadership
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Manage research articles, market commentaries, regulatory updates, and ESG insights.
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
            <span>Write New Article</span>
          </button>
        </div>

        {message && (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} />
            <span>{message}</span>
          </div>
        )}

        {/* Search Bar */}
        <div style={{ marginBottom: '24px', position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search articles by title or slug..."
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

        {/* Articles Table */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3fr 1.5fr 1fr 1.5fr',
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div>Article Title & URL</div>
            <div>Categories</div>
            <div>Published</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading insights...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No articles match your search.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map((item, index) => (
                <div
                  key={item.slug || index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1.5fr 1fr 1.5fr',
                    padding: '16px 24px',
                    alignItems: 'center',
                    borderBottom: index < filtered.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      <code>/{item.slug}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(item.categories || []).map((cat: string) => (
                      <span
                        key={cat}
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {item.publishedAt ? item.publishedAt.slice(0, 10) : 'Active'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a
                      href={`https://envintglobal.vercel.app/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on Live Site"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Eye size={15} />
                    </a>

                    <Link
                      href={`/pages/editor?slug=/${item.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#004E35',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        boxShadow: '0 1px 3px rgba(0,78,53,0.25)'
                      }}
                      title="Open in Cutting-Edge Visual Studio Canvas Editor"
                    >
                      <Sparkles size={14} color="#34d399" />
                      <span>Visual Studio</span>
                    </Link>

                    <button
                      onClick={() => setEditingArticle(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                      title="Edit metadata & summary"
                    >
                      <Edit3 size={14} />
                      <span>Quick Meta</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.slug, item.title)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        color: '#ef4444',
                        backgroundColor: '#fef2f2',
                        fontSize: '0.82rem'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full-screen Editor Modal */}
        {editingArticle && (
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
              maxWidth: '900px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}>
              {/* Modal Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={20} color="#10b981" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                    {editingArticle.id ? 'Edit Article Metadata' : 'New Article'}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editingArticle.slug && (
                    <Link
                      href={`/pages/editor?slug=/${editingArticle.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        backgroundColor: '#004E35',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(0,78,53,0.2)',
                      }}
                    >
                      <Sparkles size={14} color="#34d399" />
                      <span>Visual Studio Editor</span>
                    </Link>
                  )}
                  <button onClick={() => setEditingArticle(null)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '24px', gap: '18px' }}>
                {editingArticle.slug && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#166534' }}>
                        Prefer full visual drag-and-drop page editing?
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px' }}>
                        Design this article on the live interactive canvas with typography, images, and block controls.
                      </div>
                    </div>
                    <Link
                      href={`/pages/editor?slug=/${editingArticle.slug}`}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#004E35',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        marginLeft: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={13} color="#34d399" />
                      <span>Launch Studio</span>
                    </Link>
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Article Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      URL Slug * (e.g. climate-risk-guide)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingArticle.slug || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Cover Image URL / S3 Path
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {(editingArticle.coverImageUrl || editingArticle.coverImage?.url) ? (
                        <img
                          src={editingArticle.coverImageUrl || editingArticle.coverImage?.url}
                          alt="Cover"
                          style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          onError={(e: any) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      <input
                        type="text"
                        value={editingArticle.coverImageUrl || editingArticle.coverImage?.url || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, coverImageUrl: e.target.value, coverImage: { url: e.target.value } })}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        placeholder="https://envintcms.s3.ap-south-1.amazonaws.com/images/..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Excerpt Summary (1-2 sentences for search cards)
                  </label>
                  <textarea
                    rows={2}
                    value={editingArticle.excerpt || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Article Content (Rich Format)
                  </label>
                  <RichTextEditor
                    value={editingArticle.contentHtml || ''}
                    onChange={(html) => setEditingArticle({ ...editingArticle, contentHtml: html })}
                    minHeight={340}
                    placeholder="Write the full article…"
                  />
                </div>

                {/* SEO Accordion */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                    <Sparkles size={16} color="#10b981" />
                    <span>SEO Meta Settings</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={editingArticle.seoTitle || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, seoTitle: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        SEO Meta Description
                      </label>
                      <input
                        type="text"
                        value={editingArticle.seoDescription || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, seoDescription: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    style={{ padding: '10px 18px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}
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
                      padding: '10px 22px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving Article...' : 'Save & Publish'}</span>
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
