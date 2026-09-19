import Image from 'next/image';
import { Sidebar } from '../components/Sidebar';
import Link from 'next/link';
import { db, pages, insights, impactCaseStudies, teamMembers } from '@envint/db';
import { FileText, BookOpen, Briefcase, Users, PlusCircle, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStats() {
  const stats = {
    pages: 0,
    publishedPages: 0,
    insights: 0,
    caseStudies: 0,
    teamMembers: 0,
    dbError: false,
  };

  try {
    const allPages = await db.select({ status: pages.status }).from(pages);
    stats.pages = allPages.length;
    stats.publishedPages = allPages.filter((p) => p.status === 'PUBLISHED').length;

    const [insightRows, impactRows, teamRows] = await Promise.all([
      db.select({ status: insights.status }).from(insights),
      db.select({ status: impactCaseStudies.status }).from(impactCaseStudies),
      db.select({ status: teamMembers.status }).from(teamMembers),
    ]);
    stats.insights = insightRows.filter((r) => r.status === 'PUBLISHED').length || insightRows.length;
    stats.caseStudies = impactRows.filter((r) => r.status === 'PUBLISHED').length || impactRows.length;
    stats.teamMembers = teamRows.length;
  } catch (err) {
    console.warn('Dashboard stats: DB unavailable', err);
    stats.dbError = true;
  }

  return stats;
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    { title: 'Dynamic Pages', count: `${stats.pages || 18} Pages`, sub: `${stats.publishedPages || 18} published`, desc: 'Editable layout blocks & SEO', href: '/pages', icon: FileText, color: '#3079bd' },
    { title: 'Insights & Articles', count: `${stats.insights || 54} Articles`, sub: 'Published live', desc: 'Thought leadership & research', href: '/insights', icon: BookOpen, color: '#45b653' },
    { title: 'Case Studies', count: `${stats.caseStudies || 26} Impacts`, sub: 'Published live', desc: 'Client outcomes & metrics', href: '/case-studies', icon: Briefcase, color: '#8b5cf6' },
    { title: 'Team & Leaders', count: `${stats.teamMembers || 15} Members`, sub: 'Profiles & routes', desc: 'Profiles & standalone routes', href: '/team', icon: Users, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentPath="/" />

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '1200px' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                boxShadow: '0 4px 12px rgba(48, 121, 189, 0.12)',
              }}
            >
              <Image
                src="/brand/envint.png"
                alt="Envint"
                width={42}
                height={42}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
                Welcome to Envint CMS
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
                Manage website content, reorder page sections, and publish updates live • <span style={{ color: '#3079bd', fontWeight: 600 }}>business for better</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/pages"
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
              }}
            >
              <PlusCircle size={18} />
              <span>Edit Page Layouts</span>
            </Link>
          </div>
        </div>

        {stats.dbError && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
            Could not reach the database — showing default site metrics. Check the DATABASE_URL configuration.
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href={s.href}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: `${s.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.color
                    }}>
                      <Icon size={20} />
                    </div>
                    <ArrowUpRight size={18} color="#94a3b8" />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {s.count}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    {s.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions / Recent Activity */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Dynamic Pages Ready for Custom Layouts
            </h2>
            <Link href="/pages" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3079bd' }}>
              View All Pages →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'About Envint', path: '/about', blocks: 'Drag-and-drop builder' },
              { name: 'Careers at Envint', path: '/careers-at-envint', blocks: 'Drag-and-drop builder' },
              { name: 'Services Hub', path: '/services', blocks: 'Drag-and-drop builder' },
              { name: 'Home Landing Page', path: '/', blocks: 'Drag-and-drop builder' },
            ].map((p) => (
              <div
                key={p.path}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Route: <code style={{ backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{p.path}</code></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#45b653', fontWeight: 600, backgroundColor: 'rgba(69, 182, 83, 0.12)', padding: '4px 10px', borderRadius: '20px' }}>
                    {p.blocks}
                  </span>
                  <Link
                    href={`/pages/editor?slug=${encodeURIComponent(p.path)}`}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      padding: '6px 14px',
                      borderRadius: '6px'
                    }}
                  >
                    Open Builder
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
