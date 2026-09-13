import React from 'react';
import { BuilderNode } from '@envint/shared';
import TeamGrid, { TeamCardMember } from '@/components/about/TeamGrid';
import Link from 'next/link';
import { queryDynamicSource } from '@/lib/data/dynamic-sources';

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
  const insightsList = node.content.query
    ? await queryDynamicSource(node.content.query as any)
    : await getInsights();
  const rawCat = (node.content as any)?.category;
  const categoryFilter = typeof rawCat === 'string' ? rawCat.toLowerCase().trim() : '';

  let articles = insightsList || [];
  if (categoryFilter) {
    const filterClean = categoryFilter.replace(/-/g, ' ').trim().toLowerCase();
    const matched = articles.filter((a: any) =>
      (a.categories || []).some((c: string) => {
        const cClean = String(c).replace(/-/g, ' ').trim().toLowerCase();
        return cClean.includes(filterClean) || filterClean.includes(cClean);
      })
    );
    articles = matched;
  }

  const limit = (node.content as any)?.limit || 50;
  const displayArticles = articles.slice(0, limit);
  const showReadMore = Boolean((node.content as any)?.showReadMore);
  const showDate = (node.content as any)?.showDate !== false;
  const cardBorder = Boolean((node.content as any)?.cardBorder);

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '30px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {displayArticles.map((article: any) => {
        const coverImg =
          article.coverImage?.url ||
          article.coverImageUrl ||
          (article as any).heroImage ||
          'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp';
        const excerptText =
          article.seoDescription ||
          article.summary ||
          (article.excerpt ? String(article.excerpt).replace(/<[^>]+>/g, '').trim() : '');

        const rawDate = article.publishedAt || article.published_at || article.date;
        let formattedDate = '';
        if (rawDate) {
          try {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
              formattedDate = d.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              });
            }
          } catch {}
        }

        return (
          <Link
            key={article.slug}
            href={`/${article.slug}/`}
            style={{
              textDecoration: 'none',
              backgroundColor: cardBorder ? '#ffffff' : 'transparent',
              borderRadius: cardBorder ? '12px' : '0',
              border: cardBorder ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
              }}
            >
              <img
                src={coverImg}
                alt={article.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>
            <div
              style={{
                padding: cardBorder ? '16px' : '20px 0 0 0',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <h3
                style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#1E1E1E',
                  lineHeight: 1.3,
                  margin: '0 0 12px 0',
                }}
              >
                {article.title}
              </h3>
              {excerptText && (
                <p
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#555555',
                    lineHeight: '1.5',
                    margin: '0 0 16px 0',
                    flex: 1,
                  }}
                >
                  {excerptText.length > 130 ? `${excerptText.slice(0, 130)}...` : excerptText}
                </p>
              )}
              {showDate && formattedDate && (
                <div
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#8C8C8C',
                    marginTop: 'auto',
                    paddingTop: '4px',
                  }}
                >
                  {formattedDate}
                </div>
              )}
              {showReadMore && (
                <span
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#2F7ABE',
                    display: 'block',
                    textAlign: 'left',
                    padding: '16px 0 0 0',
                    marginTop: 'auto',
                  }}
                >
                  Read More
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export async function ImpactGridElement({ node }: { node: BuilderNode }) {
  const { getImpacts } = await import('@/lib/data/impacts');
  const impactsList = node.content.query
    ? await queryDynamicSource(node.content.query as any)
    : await getImpacts();
  const limit = (node.content as any)?.limit || 6;
  const impacts = (impactsList || []).slice(0, limit);

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '30px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {impacts.map((item: any) => {
        const coverImg =
          item.coverImage?.url ||
          item.coverImageUrl ||
          (item as any).heroImage ||
          'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-sustainability.webp';
        const excerptText =
          item.cardExcerpt ||
          item.summary ||
          (item.excerpt ? String(item.excerpt).replace(/<[^>]+>/g, '').trim() : '');

        return (
          <Link
            key={item.slug}
            href={`/impact/${item.slug}/`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '260px',
                backgroundColor: '#f1f5f9',
                overflow: 'hidden',
              }}
            >
              <img
                src={coverImg}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <h3
                style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#1E293B',
                  lineHeight: 'normal',
                  margin: '24px 0 0 0',
                }}
              >
                {item.title}
              </h3>
              {excerptText && (
                <p
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineHeight: 'normal',
                    margin: '10px 0 0 0',
                    flex: 1,
                  }}
                >
                  {excerptText.length > 130 ? `${excerptText.slice(0, 130)}...` : excerptText}
                </p>
              )}
              <span
                style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#2F7ABE',
                  display: 'block',
                  textAlign: 'left',
                  padding: '24px 0 10px 0',
                  marginTop: '10px',
                }}
              >
                Read More
              </span>
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
