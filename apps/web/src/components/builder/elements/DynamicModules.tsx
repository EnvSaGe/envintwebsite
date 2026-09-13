import React from 'react';
import { BuilderNode } from '@envint/shared';
import TeamGrid, { TeamCardMember } from '@/components/about/TeamGrid';
import Link from 'next/link';

export function TeamGridElement({
  node,
  teamCards,
}: {
  node: BuilderNode;
  teamCards?: TeamCardMember[];
}) {
  return (
    <div data-builder-id={node.id} style={{ width: '100%' }}>
      <TeamGrid members={teamCards || []} />
    </div>
  );
}

export function ServiceCardsElement({ node }: { node: BuilderNode }) {
  const pillars = [
    {
      title: 'Sustainability Integration',
      href: '/sustainability-integration',
      desc: 'Embedding ESG principles into core strategy to unlock long-term enterprise value and resilience.',
      tag: 'Practice Area 1',
    },
    {
      title: 'Climate Action & Decarbonization',
      href: '/climate-action',
      desc: 'Science-based net-zero roadmaps, carbon accounting, and transition risk modeling.',
      tag: 'Practice Area 2',
    },
    {
      title: 'Responsible Investment (RI)',
      href: '/responsible-investment',
      desc: 'ESG due diligence, LP/GP reporting frameworks, and sustainable portfolio monitoring.',
      tag: 'Practice Area 3',
    },
  ];

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        width: '100%',
      }}
    >
      {pillars.map((p, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '36px 32px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#10B981',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {p.tag}
            </span>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 500,
                color: '#004E35',
                marginTop: '12px',
                marginBottom: '16px',
              }}
            >
              {p.title}
            </h3>
            <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
              {p.desc}
            </p>
          </div>
          <Link
            href={p.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '28px',
              color: '#004E35',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            Learn more &rarr;
          </Link>
        </div>
      ))}
    </div>
  );
}

export async function InsightsGridElement({ node }: { node: BuilderNode }) {
  const { getInsights } = await import('@/lib/data/insights');
  const insightsList = await getInsights();
  const limit = (node.content as any)?.limit || 6;
  const articles = (insightsList || []).slice(0, limit);

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '32px',
        width: '100%',
      }}
    >
      {articles.map((article: any) => {
        const coverImg = article.coverImage?.url || article.coverImageUrl || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp';
        return (
          <Link
            key={article.slug}
            href={`/insights/${article.slug}/`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f1f5f9' }}>
              <img
                src={coverImg}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981', textTransform: 'uppercase' }}>
                {(article.categories || ['INSIGHT'])[0]}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#004E35', marginTop: '8px', marginBottom: '12px', lineHeight: '1.4' }}>
                {article.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', flex: 1 }}>
                {article.summary ? `${article.summary.slice(0, 110)}...` : ''}
              </p>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
                <span>{article.readTimeMinutes ? `${article.readTimeMinutes} min read` : '5 min read'}</span>
                <span style={{ color: '#004E35', fontWeight: 600 }}>Read Article &rarr;</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export async function ImpactGridElement({ node }: { node: BuilderNode }) {
  const { getImpacts } = await import('@/lib/data/impacts');
  const impactsList = await getImpacts();
  const limit = (node.content as any)?.limit || 6;
  const impacts = (impactsList || []).slice(0, limit);

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '32px',
        width: '100%',
      }}
    >
      {impacts.map((item: any) => {
        const coverImg = item.coverImage?.url || item.coverImageUrl || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp';
        return (
          <Link
            key={item.slug}
            href={`/impact/${item.slug}/`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f1f5f9' }}>
              <img
                src={coverImg}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981', textTransform: 'uppercase' }}>
                {item.service?.name || item.sector?.name || 'CASE STUDY'}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#004E35', marginTop: '8px', marginBottom: '12px', lineHeight: '1.4' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', flex: 1 }}>
                {item.cardExcerpt ? `${item.cardExcerpt.slice(0, 110)}...` : item.summary ? `${item.summary.slice(0, 110)}...` : ''}
              </p>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '13px', color: '#004E35', fontWeight: 600 }}>
                <span>View Case Study &rarr;</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function SocialShareElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const channels = content.channels || [
    { id: 'email', name: 'Email', enabled: true, color: '#ea4335' },
    { id: 'linkedin', name: 'LinkedIn', enabled: true, color: '#0a66c2' },
    { id: 'twitter', name: 'X / Twitter', enabled: true, color: '#000000' },
    { id: 'facebook', name: 'Facebook', enabled: true, color: '#1877f2' },
  ];
  const size = content.buttonSize || 32;
  const radius = content.borderRadius ?? 4;
  const gap = content.gap ?? 10;
  const alignment = content.alignment || 'left';

  const justifyMap: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: justifyMap[alignment] || 'flex-start',
        gap: `${gap}px`,
        flexWrap: 'wrap',
      }}
    >
      {channels.filter((c: any) => c.enabled !== false).map((c: any) => {
        let icon: React.ReactNode = '↗';
        let defaultColor = '#004E35';
        if (c.id === 'email') {
          icon = (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          );
          defaultColor = '#ea4335';
        } else if (c.id === 'linkedin') {
          icon = <span style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'sans-serif' }}>in</span>;
          defaultColor = '#0a66c2';
        } else if (c.id === 'twitter') {
          icon = <span style={{ fontSize: '14px', fontWeight: 700 }}>𝕏</span>;
          defaultColor = '#000000';
        } else if (c.id === 'facebook') {
          icon = <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'sans-serif' }}>f</span>;
          defaultColor = '#1877f2';
        }

        const bgColor = c.color || defaultColor;

        return (
          <a
            key={c.id}
            href={c.url || '#'}
            target={c.id === 'email' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            aria-label={`Share via ${c.name || c.id}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: `${radius}px`,
              backgroundColor: bgColor,
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              transition: 'opacity 0.15s ease',
              flexShrink: 0,
            }}
          >
            {icon}
          </a>
        );
      })}
    </div>
  );
}
