'use client';

import React, { useState } from 'react';
import {
  Search,
  Share2,
  SlidersHorizontal,
  X,
  Check,
  Link2,
  EyeOff,
  BarChart2,
  Info,
} from 'lucide-react';

export interface SeoSettingsModalProps {
  slug: string;
  pageTitle: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  noIndex: boolean;
  onUpdate: (fields: {
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    ogImageUrl?: string;
    noIndex?: boolean;
  }) => void;
  onClose: () => void;
}

export function SeoSettingsModal({
  slug,
  pageTitle,
  seoTitle,
  seoDescription,
  canonicalUrl,
  ogImageUrl,
  noIndex,
  onUpdate,
  onClose,
}: SeoSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'social' | 'advanced'>('search');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(6px)',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#0f172a',
          boxShadow: '0 32px 64px -12px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(56,189,248,0.15)',
                border: '1px solid rgba(56,189,248,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={16} color="#38bdf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
                SEO &amp; Meta Settings
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0' }}>
                Configure search visibility &amp; social sharing for{' '}
                <strong style={{ color: '#94a3b8' }}>{slug}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close SEO Modal"
            style={{
              color: '#64748b',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Nav */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            flexShrink: 0,
          }}
        >
          {([
            { id: 'search', label: 'Search Engine', icon: Search },
            { id: 'social', label: 'Social Sharing', icon: Share2 },
            { id: 'advanced', label: 'Advanced', icon: SlidersHorizontal },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderBottom: activeTab === id ? '2px solid #3079bd' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === id ? '#3079bd' : '#64748b',
                fontWeight: activeTab === id ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
          {/* SEARCH ENGINE TAB */}
          {activeTab === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    color: '#64748b',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Google Search Preview
                </label>
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    backgroundColor: '#fafafa',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#202124',
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                        flexShrink: 0,
                      }}
                    />
                    <span>envintglobal.com</span>
                    <span style={{ color: '#5f6368' }}>
                      › {slug === '/' ? '' : slug.replace(/^\//, '')}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      color: '#1a0dab',
                      lineHeight: 1.3,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {seoTitle || pageTitle || 'Page Title — Envint Global'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: '#4d5156',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {seoDescription ||
                      'Add a meta description to explain what this page is about to search engines and users.'}
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    SEO Page Title{' '}
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                      (browser tab &amp; Google)
                    </span>
                  </label>
                  <span
                    style={{
                      fontSize: '0.73rem',
                      color:
                        seoTitle.length > 60
                          ? '#ef4444'
                          : seoTitle.length > 50
                          ? '#f59e0b'
                          : '#22c55e',
                      fontWeight: 600,
                    }}
                  >
                    {seoTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={`${pageTitle} — Envint Global`}
                  value={seoTitle}
                  onChange={(e) => onUpdate({ seoTitle: e.target.value })}
                  maxLength={80}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${seoTitle.length > 60 ? '#fca5a5' : '#cbd5e1'}`,
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
                <div
                  style={{
                    marginTop: '6px',
                    height: '3px',
                    borderRadius: '999px',
                    backgroundColor: '#e2e8f0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min((seoTitle.length / 60) * 100, 100)}%`,
                      backgroundColor:
                        seoTitle.length > 60
                          ? '#ef4444'
                          : seoTitle.length > 50
                          ? '#f59e0b'
                          : '#22c55e',
                      transition: 'width 0.2s',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: '4px 0 0' }}>
                  Ideal: 50–60 characters. Longer titles get truncated in search results.
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Meta Description{' '}
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                      (search result snippet)
                    </span>
                  </label>
                  <span
                    style={{
                      fontSize: '0.73rem',
                      color:
                        seoDescription.length > 160
                          ? '#ef4444'
                          : seoDescription.length > 140
                          ? '#f59e0b'
                          : '#22c55e',
                      fontWeight: 600,
                    }}
                  >
                    {seoDescription.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Write a concise, compelling description that tells searchers what this page offers..."
                  value={seoDescription}
                  onChange={(e) => onUpdate({ seoDescription: e.target.value })}
                  maxLength={200}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${seoDescription.length > 160 ? '#fca5a5' : '#cbd5e1'}`,
                    fontSize: '0.88rem',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                  }}
                />
                <div
                  style={{
                    marginTop: '6px',
                    height: '3px',
                    borderRadius: '999px',
                    backgroundColor: '#e2e8f0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min((seoDescription.length / 160) * 100, 100)}%`,
                      backgroundColor:
                        seoDescription.length > 160
                          ? '#ef4444'
                          : seoDescription.length > 140
                          ? '#f59e0b'
                          : '#22c55e',
                      transition: 'width 0.2s',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: '4px 0 0' }}>
                  Ideal: 140–160 characters. Google may replace this with page content if it&apos;s not relevant.
                </p>
              </div>
            </div>
          )}

          {/* SOCIAL SHARING TAB */}
          {activeTab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    color: '#64748b',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Social Card Preview (LinkedIn / Twitter / WhatsApp)
                </label>
                <div
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    maxWidth: '500px',
                  }}
                >
                  {ogImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={ogImageUrl}
                      alt="OG Preview"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#1e293b',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <Share2 size={32} color="#475569" />
                      <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                        Add an OG image URL below to preview
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      padding: '14px 16px',
                      backgroundColor: '#ffffff',
                      borderTop: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      ENVINTGLOBAL.COM
                    </div>
                    <div
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.3,
                        marginBottom: '4px',
                      }}
                    >
                      {seoTitle || pageTitle || 'Page Title'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: '#64748b',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {seoDescription || 'Add a meta description to see it here.'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Open Graph Image URL{' '}
                  <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                    (recommended: 1200×630 px)
                  </span>
                </label>
                <input
                  type="url"
                  placeholder="https://envintglobal.com/images/og-cover.jpg"
                  value={ogImageUrl}
                  onChange={(e) => onUpdate({ ogImageUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
                <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: '6px 0 0' }}>
                  This image appears when your page is shared on LinkedIn, Twitter, WhatsApp, and other platforms. If blank, the site-wide default OG image is used.
                </p>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}
              >
                <Info size={15} color="#3b82f6" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '0.78rem', color: '#1d4ed8', margin: 0, lineHeight: 1.5 }}>
                  The <strong>SEO Page Title</strong> and <strong>Meta Description</strong> set on the &ldquo;Search Engine&rdquo; tab are also used as the OG title and description for social sharing.
                </p>
              </div>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Canonical URL{' '}
                  <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                    (optional — prevents duplicate content)
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  >
                    <Link2 size={15} />
                  </div>
                  <input
                    type="url"
                    placeholder="https://envintglobal.com/page-slug"
                    value={canonicalUrl}
                    onChange={(e) => onUpdate({ canonicalUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: '6px 0 0' }}>
                  Leave blank to use the default URL. Set this only if the same content appears at multiple URLs.
                </p>
              </div>

              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  border: `2px solid ${noIndex ? '#fca5a5' : '#e2e8f0'}`,
                  backgroundColor: noIndex ? '#fff5f5' : '#fafafa',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <EyeOff size={15} color={noIndex ? '#ef4444' : '#64748b'} />
                      <span
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: noIndex ? '#ef4444' : '#334155',
                        }}
                      >
                        Block search engines (noindex)
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                      When enabled, this page will <strong>not appear</strong> in Google, Bing, or other search engines.
                    </p>
                    {noIndex && (
                      <div
                        style={{
                          marginTop: '8px',
                          padding: '8px 12px',
                          backgroundColor: '#fee2e2',
                          borderRadius: '6px',
                          border: '1px solid #fca5a5',
                          fontSize: '0.75rem',
                          color: '#b91c1c',
                          fontWeight: 600,
                        }}
                      >
                        ⚠️ This page is currently hidden from search engines.
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdate({ noIndex: !noIndex })}
                    aria-label="Toggle noIndex"
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '999px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: noIndex ? '#ef4444' : '#d1d5db',
                      position: 'relative',
                      flexShrink: 0,
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: noIndex ? 'calc(100% - 23px)' : '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <BarChart2 size={14} color="#3079bd" />
                  SEO Checklist
                </div>
                {[
                  {
                    label: 'SEO Title set (≤60 chars)',
                    ok: seoTitle.length > 0 && seoTitle.length <= 60,
                  },
                  {
                    label: 'Title in ideal range (50–60 chars)',
                    ok: seoTitle.length >= 50 && seoTitle.length <= 60,
                  },
                  { label: 'Meta description set', ok: seoDescription.length > 0 },
                  {
                    label: 'Description in ideal range (140–160 chars)',
                    ok: seoDescription.length >= 140 && seoDescription.length <= 160,
                  },
                  { label: 'OG image configured', ok: ogImageUrl.startsWith('http') },
                  { label: 'Page is indexed by search engines', ok: !noIndex },
                ].map(({ label, ok }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '7px',
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: ok ? '#dcfce7' : '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {ok ? <Check size={10} color="#16a34a" /> : <X size={10} color="#dc2626" />}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: ok ? '#15803d' : '#64748b' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            backgroundColor: '#f8fafc',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Changes apply when you <strong>Save Draft</strong> or <strong>Publish</strong>.
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: '7px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 22px',
                borderRadius: '7px',
                background: 'linear-gradient(135deg, #004E35 0%, #006648 100%)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={14} />
              Apply SEO Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
