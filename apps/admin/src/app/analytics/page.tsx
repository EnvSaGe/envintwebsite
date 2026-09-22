'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import {
  BarChart2, Globe, Users, Eye, TrendingUp, Bot, Zap, ArrowUpRight,
  Monitor, Smartphone, Tablet, RefreshCw, Activity, MessageSquare,
  Search, ExternalLink, ChevronDown, AlertCircle, Sparkles
} from 'lucide-react';
import { DailyTrendChart } from './DailyTrendChart';

// ── Types ──────────────────────────────────────────────────────────────────────

interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  days: number;
}

interface TopPage {
  path: string;
  page_title: string | null;
  views: string;
  unique_visitors: string;
}

interface TopCountry {
  country: string;
  visitors: string;
  views: string;
}

interface ReferrerSource {
  referrer_source: string;
  visitors: string;
  sessions: string;
}

interface DeviceBreakdown {
  device_type: string;
  visitors: string;
}

interface AIReferral {
  referrer_source: string;
  sessions: string;
  unique_visitors: string;
  top_pages: string[];
}

interface AIBotCrawl {
  bot_agent: string;
  crawl_hits: string;
  pages_crawled: string;
  last_seen: string;
}

interface DailyTrend {
  date: string;
  unique_visitors: string;
  page_views: string;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  topPages: TopPage[];
  topCountries: TopCountry[];
  referrerSources: ReferrerSource[];
  deviceBreakdown: DeviceBreakdown[];
  aiReferrals: AIReferral[];
  aiBotCrawls: AIBotCrawl[];
  dailyTrend: DailyTrend[];
}

// ── Constants ──────────────────────────────────────────────────────────────────

const AI_SOURCE_META: Record<string, { label: string; color: string; emoji: string }> = {
  chatgpt: { label: 'ChatGPT', color: '#10a37f', emoji: '🤖' },
  perplexity: { label: 'Perplexity', color: '#7c3aed', emoji: '🔍' },
  grok: { label: 'Grok (xAI)', color: '#1d9bf0', emoji: '⚡' },
  claude: { label: 'Claude (Anthropic)', color: '#cf6a37', emoji: '🧠' },
  gemini: { label: 'Gemini', color: '#4285f4', emoji: '✨' },
  copilot: { label: 'Microsoft Copilot', color: '#0078d4', emoji: '🧩' },
};

const REFERRER_META: Record<string, { label: string; color: string }> = {
  direct: { label: 'Direct / None', color: '#0f172a' },
  google: { label: 'Google Search', color: '#4285f4' },
  linkedin: { label: 'LinkedIn', color: '#0a66c2' },
  chatgpt: { label: 'ChatGPT', color: '#10a37f' },
  perplexity: { label: 'Perplexity AI', color: '#7c3aed' },
  grok: { label: 'Grok / xAI', color: '#1d9bf0' },
  claude: { label: 'Claude', color: '#cf6a37' },
  gemini: { label: 'Google Gemini', color: '#4285f4' },
  copilot: { label: 'Copilot', color: '#0078d4' },
  social: { label: 'Social Media', color: '#e1306c' },
  twitter: { label: 'Twitter / X', color: '#000000' },
  other: { label: 'Other / Unknown', color: '#94a3b8' },
};

const COUNTRY_FLAG: Record<string, string> = {
  IN: '🇮🇳', US: '🇺🇸', GB: '🇬🇧', AE: '🇦🇪', SG: '🇸🇬',
  DE: '🇩🇪', NL: '🇳🇱', AU: '🇦🇺', CA: '🇨🇦', JP: '🇯🇵',
  FR: '🇫🇷', BR: '🇧🇷', ZA: '🇿🇦', SE: '🇸🇪', CH: '🇨🇭',
};

// ── Utility ────────────────────────────────────────────────────────────────────

function fmtNumber(n: number | string): string {
  const num = typeof n === 'string' ? parseInt(n, 10) : n;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num || 0);
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── Sparkline SVG (tiny inline chart) ─────────────────────────────────────────

function Sparkline({ data, color = '#3079bd' }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const W = 120; const H = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / max) * H;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline
        points={pts}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <polyline
        points={`0,${H} ${pts} ${W},${H}`}
        stroke="none"
        fill={color}
        fillOpacity={0.12}
      />
    </svg>
  );
}

// ── Mini bar inside table rows ─────────────────────────────────────────────────

function MiniBar({ value, max, color = '#3079bd' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: '#f1f5f9' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px', backgroundColor: color, transition: 'width 0.6s ease' }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'pages' | 'audience'>('overview');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as AnalyticsData;
      setData(json);
      setLastRefreshed(new Date());
    } catch (e) {
      setError('Failed to load analytics data. Make sure the database migration has been applied.');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Derived totals for the overview stat cards
  const totalAISessions = data?.aiReferrals?.reduce((s, r) => s + parseInt(r.sessions, 10), 0) ?? 0;
  const totalBotCrawls = data?.aiBotCrawls?.reduce((s, r) => s + parseInt(r.crawl_hits, 10), 0) ?? 0;
  const sparklineData = data?.dailyTrend?.map(d => parseInt(d.unique_visitors, 10)) ?? [];
  const maxDailyVisitors = Math.max(...sparklineData, 1);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath="/analytics" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1300px', overflowX: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart2 size={28} color="#3079bd" />
              Analytics & AI Visibility
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
              First-party traffic insights · AI referrals · Bot crawl activity · Zero cookies
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Days selector */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{
                  appearance: 'none',
                  padding: '8px 36px 8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#fff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last 12 months</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', color: '#64748b', pointerEvents: 'none' }} />
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchData}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px',
                border: '1px solid #e2e8f0', backgroundColor: '#fff',
                color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>
        </div>

        {/* Last refreshed */}
        <p style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '24px', marginTop: '-16px' }}>
          Last refreshed: {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} •
          Showing last {days} days of data
        </p>

        {/* Error state */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '16px 20px', borderRadius: '10px',
            backgroundColor: '#fef2f2', border: '1px solid #fee2e2',
            color: '#b91c1c', marginBottom: '28px', fontSize: '0.88rem',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Stat Cards ───────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '32px' }}>
          {[
            {
              label: 'Unique Visitors',
              value: data ? fmtNumber(data.summary.uniqueVisitors) : '—',
              icon: Users, color: '#3079bd',
              subtitle: `Total people who visited`,
              sparkData: sparklineData,
            },
            {
              label: 'Total Page Views',
              value: data ? fmtNumber(data.summary.totalViews) : '—',
              icon: Eye, color: '#45b653',
              subtitle: `Human visits (bots excluded)`,
              sparkData: data?.dailyTrend?.map(d => parseInt(d.page_views, 10)) ?? [],
            },
            {
              label: 'AI Search Visitors',
              value: data ? fmtNumber(totalAISessions) : '—',
              icon: Sparkles, color: '#7c3aed',
              subtitle: `ChatGPT · Grok · Perplexity · Claude`,
              sparkData: [],
            },
            {
              label: 'AI Bot Crawls',
              value: data ? fmtNumber(totalBotCrawls) : '—',
              icon: Bot, color: '#f59e0b',
              subtitle: `GPTBot · PerplexityBot · ClaudeBot`,
              sparkData: [],
            },
          ].map((card) => (
            <div key={card.label} style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '22px 22px 18px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  backgroundColor: `${card.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: card.color
                }}>
                  <card.icon size={18} />
                </div>
                {card.sparkData.length > 1 && (
                  <Sparkline data={card.sparkData} color={card.color} />
                )}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {loading ? <div style={{ width: '60px', height: '28px', backgroundColor: '#f1f5f9', borderRadius: '6px' }} /> : card.value}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginTop: '6px' }}>{card.label}</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>{card.subtitle}</div>
            </div>
          ))}
        </div>

        {/* ── Tab Navigation ───────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {(['overview', 'ai', 'pages', 'audience'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 18px',
                borderRadius: '7px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.83rem',
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? '#0f172a' : '#64748b',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'ai' ? '🤖 AI Mentions' : tab === 'overview' ? '📊 Overview' : tab === 'pages' ? '📄 Top Pages' : '🌍 Audience'}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB                                              */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>

            {/* Daily Trend Chart */}
            <DailyTrendChart data={data?.dailyTrend ?? []} days={days} />

            {/* Referrer Sources */}
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={16} color="#3079bd" />
                Traffic Sources
              </h2>
              {data?.referrerSources.length ? (() => {
                const maxV = Math.max(...data.referrerSources.map(r => parseInt(r.visitors, 10)));
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.referrerSources.map((r) => {
                      const meta = REFERRER_META[r.referrer_source] ?? { label: r.referrer_source, color: '#94a3b8' };
                      const v = parseInt(r.visitors, 10);
                      return (
                        <div key={r.referrer_source}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: meta.color, flexShrink: 0 }} />
                              <span style={{ fontSize: '0.83rem', fontWeight: 600, color: '#334155' }}>{meta.label}</span>
                            </div>
                            <span style={{ fontSize: '0.83rem', color: '#64748b', fontWeight: 700 }}>{fmtNumber(v)}</span>
                          </div>
                          <MiniBar value={v} max={maxV} color={meta.color} />
                        </div>
                      );
                    })}
                  </div>
                );
              })() : (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{loading ? 'Loading...' : 'No referral data yet.'}</p>
              )}
            </div>

            {/* Device Breakdown */}
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Monitor size={16} color="#45b653" />
                Device Breakdown
              </h2>
              {data?.deviceBreakdown?.length ? (() => {
                const total = data.deviceBreakdown.reduce((s, d) => s + parseInt(d.visitors, 10), 0);
                const icons: Record<string, typeof Monitor> = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };
                const colors: Record<string, string> = { desktop: '#3079bd', mobile: '#45b653', tablet: '#f59e0b' };
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {data.deviceBreakdown.map((d) => {
                      const Icon = icons[d.device_type] || Monitor;
                      const v = parseInt(d.visitors, 10);
                      const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                      const color = colors[d.device_type] || '#94a3b8';
                      return (
                        <div key={d.device_type} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                            <Icon size={16} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{d.device_type}</span>
                              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{pct}% · {fmtNumber(v)}</span>
                            </div>
                            <MiniBar value={v} max={parseInt(data.deviceBreakdown[0]?.visitors ?? '1', 10)} color={color} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })() : (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{loading ? 'Loading...' : 'No device data yet.'}</p>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* AI MENTIONS TAB                                           */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Explanation card */}
            <div style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(48,121,189,0.06) 100%)',
              border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
            }}>
              <Sparkles size={18} color="#7c3aed" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#4c1d95' }}>How this works</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#6d28d9', lineHeight: 1.5 }}>
                  When a user asks ChatGPT, Grok, Perplexity, or Claude and clicks a link to envintglobal.com,
                  the AI platform sends an HTTP referrer header that we detect automatically.
                  AI Bot Crawls show which AI systems are actively reading your content to answer future user questions.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>

              {/* AI Referrals — inbound clicks from AI search */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} color="#7c3aed" />
                  AI Search Referrals
                </h2>
                <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0 0 18px' }}>Users who clicked Envint's link from an AI chat response</p>

                {data?.aiReferrals.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {data.aiReferrals.map((r) => {
                      const meta = AI_SOURCE_META[r.referrer_source] ?? { label: r.referrer_source, color: '#7c3aed', emoji: '🤖' };
                      return (
                        <div key={r.referrer_source} style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fafafa', border: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '1.2rem' }}>{meta.emoji}</span>
                              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{meta.label}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: meta.color }}>{fmtNumber(parseInt(r.unique_visitors, 10))}</div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>unique visitors</div>
                            </div>
                          </div>
                          {r.top_pages && r.top_pages.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {r.top_pages.slice(0, 3).map((p) => (
                                <span key={p} style={{ fontSize: '0.7rem', backgroundColor: `${meta.color}10`, color: meta.color, padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{p}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>
                    <Sparkles size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No AI referrals yet</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>This will show data once visitors click on Envint links in AI chat responses.</p>
                  </div>
                )}
              </div>

              {/* AI Bot Crawls — what AI is indexing */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bot size={16} color="#f59e0b" />
                  AI Bot Crawl Activity
                </h2>
                <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0 0 18px' }}>AI engines reading your content to answer future questions</p>

                {data?.aiBotCrawls.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.aiBotCrawls.map((b) => (
                      <div key={b.bot_agent} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 14px', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fde68a',
                      }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>{b.bot_agent}</div>
                          <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '2px' }}>
                            {b.pages_crawled} pages crawled · last seen {new Date(b.last_seen).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>{fmtNumber(parseInt(b.crawl_hits, 10))}</div>
                          <div style={{ fontSize: '0.68rem', color: '#d97706' }}>total hits</div>
                        </div>
                      </div>
                    ))}
                    <p style={{ margin: '6px 0 0', fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      ✅ More AI bot crawls = AI models have fresher knowledge about Envint's services.
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>
                    <Bot size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No bot crawls detected</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>GPTBot and PerplexityBot will appear here when they index envintglobal.com.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TOP PAGES TAB                                             */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'pages' && (
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '14px',
            border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={16} color="#3079bd" />
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Top Pages by Unique Visitors</h2>
            </div>
            {data?.topPages.length ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '10px 24px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
                    <th style={{ padding: '10px 8px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page</th>
                    <th style={{ padding: '10px 24px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visitors</th>
                    <th style={{ padding: '10px 24px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Views</th>
                    <th style={{ padding: '10px 24px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Traffic Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map((p, i) => {
                    const maxV = parseInt(data.topPages[0]?.unique_visitors ?? '1', 10);
                    return (
                      <tr key={p.path} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 24px', color: '#94a3b8', fontWeight: 700 }}>{i + 1}</td>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.page_title || p.path}</div>
                          <a href={`https://envintglobal.com${p.path}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: '#3079bd', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            {p.path} <ExternalLink size={10} />
                          </a>
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                          {fmtNumber(parseInt(p.unique_visitors, 10))}
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right', color: '#64748b' }}>
                          {fmtNumber(parseInt(p.views, 10))}
                        </td>
                        <td style={{ padding: '14px 24px', minWidth: '120px' }}>
                          <MiniBar value={parseInt(p.unique_visitors, 10)} max={maxV} color="#3079bd" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                <Activity size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No page data yet</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>Visit the public site to start generating data.</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* AUDIENCE TAB                                              */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === 'audience' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              gridColumn: '1 / -1',
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 20px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} color="#3079bd" />
                Visitor Countries
              </h2>
              {data?.topCountries.length ? (
                (() => {
                  const maxV = Math.max(...data.topCountries.map(c => parseInt(c.visitors, 10)), 1);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {data.topCountries.map((c, i) => {
                        const flag = COUNTRY_FLAG[c.country] ?? '🌐';
                        const v = parseInt(c.visitors, 10);
                        return (
                          <div key={c.country} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: i === 0 ? '#f0f7ff' : '#fafafa', border: `1px solid ${i === 0 ? '#bfdbfe' : '#f1f5f9'}` }}>
                            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{flag}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{c.country}</span>
                                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: i === 0 ? '#3079bd' : '#334155' }}>{fmtNumber(v)}</span>
                              </div>
                              <MiniBar value={v} max={maxV} color={i === 0 ? '#3079bd' : '#94a3b8'} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  <Globe size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No geographic data yet</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>Country data requires the analytics beacon to be active on the public site.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom note */}
        <div style={{ marginTop: '32px', padding: '14px 18px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={14} color="#45b653" />
          <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
            <strong>Privacy-first:</strong> Unique visitors are identified by a daily-rotating SHA-256 hash of IP + browser — no cookies, no fingerprinting, no personal data stored. Compliant with GDPR and India's DPDP Act.
          </p>
        </div>

      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
