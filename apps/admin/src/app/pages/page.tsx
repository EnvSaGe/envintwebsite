'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../../components/Sidebar';
import Link from 'next/link';
import { 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  X, 
  Check, 
  Search, 
  BookOpen, 
  Briefcase, 
  Users, 
  Layers, 
  Globe, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { fetchPagesList, createPageAction, deletePageAction, publishPageAction, unpublishPageAction } from './actions';
import { useRouter } from 'next/navigation';

export default function PagesListPage() {
  const router = useRouter();
  const [pagesList, setPagesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', seoDescription: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'practices' | 'hubs' | 'custom'>('all');

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await fetchPagesList();
      setPagesList(data);
    } catch (err: any) {
      setMessage(err.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title || !newPage.slug) {
      alert('Please enter both title and slug.');
      return;
    }
    setIsCreating(true);
    try {
      const res = await createPageAction(newPage);
      setShowCreateModal(false);
      router.push(`/pages/editor?slug=${encodeURIComponent(res.slug)}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create page');
      setIsCreating(false);
    }
  };

  const protectedSlugs = [
    '/',
    '/about',
    '/services',
    '/careers-at-envint',
    '/connect',
    '/impact',
    '/disclaimer',
    '/sustainability-integration',
    '/climate-action',
    '/responsible-investment',
    '/envision',
    '/behind-the-buzz',
    '/how-to-articles',
    '/enviki',
    '/glossary-zone',
    '/esq',
    '/mapsense',
    '/connect-gbc2024'
  ];

  const handleDelete = async (slug: string, title: string) => {
    if (protectedSlugs.includes(slug)) {
      alert('Core website pages cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to delete page "${title}" (${slug})?`)) return;

    try {
      await deletePageAction(slug);
      await loadPages();
    } catch (err: any) {
      alert(err.message || 'Error deleting page');
    }
  };

  const handleTogglePublish = async (slug: string, currentStatus: string) => {
    try {
      if (currentStatus === 'PUBLISHED') {
        if (!confirm(`Unpublish "${slug}"? It will be hidden from the live site (kept as a draft).`)) return;
        await unpublishPageAction(slug);
      } else {
        await publishPageAction(slug);
      }
      await loadPages();
    } catch (err: any) {
      alert(err.message || 'Error updating publish status');
    }
  };

  const filteredPages = useMemo(() => {
    return pagesList.filter((p) => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'core') return p.category === 'core';
      if (activeTab === 'practices') return p.category === 'practices';
      if (activeTab === 'hubs') return p.category === 'hubs';
      if (activeTab === 'custom') return p.category === 'custom' || !p.category;
      return true;
    });
  }, [pagesList, searchQuery, activeTab]);

  const counts = useMemo(() => {
    return {
      all: pagesList.length,
      core: pagesList.filter((p) => p.category === 'core').length,
      practices: pagesList.filter((p) => p.category === 'practices').length,
      hubs: pagesList.filter((p) => p.category === 'hubs').length,
      custom: pagesList.filter((p) => p.category === 'custom' || !p.category).length,
    };
  }, [pagesList]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/pages" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1280px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Website Pages & Layouts
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Manage, reorder sections, edit SEO metadata, and build landing pages across the entire 168-page website architecture.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
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
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <Plus size={18} />
            <span>Create New Page</span>
          </button>
        </div>

        {/* 168-Page Architecture Overview Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '18px 20px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Managed Layouts
              </span>
              <Layers size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
              {pagesList.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px', fontWeight: 500 }}>
              Core, Practices & Hubs
            </div>
          </div>

          <Link href="/insights" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '18px 20px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Insights & Articles
                </span>
                <BookOpen size={18} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
                54
              </div>
              <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '4px', fontWeight: 500 }}>
                Manage in Insights Studio →
              </div>
            </div>
          </Link>

          <Link href="/case-studies" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '18px 20px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Impact Case Studies
                </span>
                <Briefcase size={18} color="#8b5cf6" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
                26
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '4px', fontWeight: 500 }}>
                Manage in Case Studies →
              </div>
            </div>
          </Link>

          <Link href="/team" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '18px 20px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Leadership Profiles
                </span>
                <Users size={18} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>
                15
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px', fontWeight: 500 }}>
                Manage in Team Studio →
              </div>
            </div>
          </Link>

          <div style={{
            backgroundColor: '#0f172a',
            padding: '18px 20px',
            borderRadius: '10px',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                Total Site Footprint
              </span>
              <Globe size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginTop: '8px' }}>
              168
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px', fontWeight: 500 }}>
              Live Sitemap URLs
            </div>
          </div>
        </div>

        {message && (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} />
            <span>{message}</span>
          </div>
        )}

        {/* Search and Tabs Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'all' ? '#ffffff' : 'transparent',
                color: activeTab === 'all' ? '#0f172a' : '#64748b',
                boxShadow: activeTab === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              All Pages ({counts.all})
            </button>
            <button
              onClick={() => setActiveTab('core')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'core' ? '#ffffff' : 'transparent',
                color: activeTab === 'core' ? '#0f172a' : '#64748b',
                boxShadow: activeTab === 'core' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Corporate & Landing ({counts.core})
            </button>
            <button
              onClick={() => setActiveTab('practices')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'practices' ? '#ffffff' : 'transparent',
                color: activeTab === 'practices' ? '#0f172a' : '#64748b',
                boxShadow: activeTab === 'practices' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Advisory Practices ({counts.practices})
            </button>
            <button
              onClick={() => setActiveTab('hubs')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'hubs' ? '#ffffff' : 'transparent',
                color: activeTab === 'hubs' ? '#0f172a' : '#64748b',
                boxShadow: activeTab === 'hubs' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Hubs & Tools ({counts.hubs})
            </button>
            {counts.custom > 0 && (
              <button
                onClick={() => setActiveTab('custom')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'custom' ? '#ffffff' : 'transparent',
                  color: activeTab === 'custom' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'custom' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Custom Pages ({counts.custom})
              </button>
            )}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search page by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>

        {/* Pages Table */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3fr 1.2fr 1fr 1fr 1.6fr',
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div>Page Name & Slug</div>
            <div>Category</div>
            <div>Structure</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading pages...</div>
          ) : filteredPages.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              No pages match your search query.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredPages.map((page, index) => {
                const isProtected = protectedSlugs.includes(page.slug);
                return (
                  <div
                    key={page.slug}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1.2fr 1fr 1fr 1.6fr',
                      padding: '18px 24px',
                      alignItems: 'center',
                      borderBottom: index < filteredPages.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                        {page.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        <code>{page.slug}</code>
                      </div>
                    </div>

                    <div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: page.category === 'practices' ? '#0284c7' : page.category === 'hubs' ? '#8b5cf6' : page.category === 'core' ? '#0f172a' : '#10b981',
                        backgroundColor: page.category === 'practices' ? '#e0f2fe' : page.category === 'hubs' ? '#f3e8ff' : page.category === 'core' ? '#f1f5f9' : '#ecfdf5',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        textTransform: 'capitalize'
                      }}>
                        {page.category || 'Custom'}
                      </span>
                    </div>

                    <div>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        backgroundColor: '#f1f5f9',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        {page.sectionsCount || 4} Blocks
                      </span>
                    </div>

                    <div>
                      <button
                        onClick={() => handleTogglePublish(page.slug, page.status)}
                        title={page.status === 'PUBLISHED' ? 'Click to unpublish (hide from live site)' : 'Click to publish to live site'}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: page.status === 'PUBLISHED' ? '#10b981' : '#f59e0b',
                          backgroundColor: page.status === 'PUBLISHED' ? '#ecfdf5' : '#fffbeb',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ● {page.status || 'PUBLISHED'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <a
                        href={`https://envintglobal.vercel.app${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Live Page"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Eye size={16} />
                      </a>

                      <Link
                        href={`/pages/editor?slug=${encodeURIComponent(page.slug)}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Edit Layout</span>
                      </Link>

                      {!isProtected && (
                        <button
                          onClick={() => handleDelete(page.slug, page.title)}
                          title="Delete custom page"
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Create New Page */}
        {showCreateModal && (
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
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Create New Website Page
                </h2>
                <button onClick={() => setShowCreateModal(false)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Page Title * (e.g. Energy Transition Advisory)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Page Title"
                    value={newPage.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const autoSlug = `/${title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
                      setNewPage({ ...newPage, title, slug: newPage.slug || autoSlug });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    URL Slug * (e.g. /energy-transition)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/my-new-page"
                    value={newPage.slug}
                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Short Summary (SEO Meta Description)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of this page for search engines..."
                    value={newPage.seoDescription}
                    onChange={(e) => setNewPage({ ...newPage, seoDescription: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: 'none' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 20px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <Plus size={16} />
                    <span>{isCreating ? 'Creating...' : 'Create & Open Editor'}</span>
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
