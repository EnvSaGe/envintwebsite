'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { resolveCmsImage } from '@envint/shared';

const IMPACT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'sustainability-integration', label: 'Sustainability Integration', category: 'Sustainability Integration' },
  { id: 'responsible-investment', label: 'Responsible Investment', category: 'Responsible Investment' },
  { id: 'climate-action', label: 'Climate Action', category: 'Climate Action' },
  { id: 'infrastructure-real-estate', label: 'Infrastructure & Real Estate', category: 'Real Estate' },
  { id: 'manufacturing', label: 'Manufacturing', category: 'Manufacturing' },
  { id: 'energy', label: 'Energy', category: 'Energy' },
  { id: 'agriculture', label: 'Agriculture', category: 'Agriculture' },
  { id: 'bfsi', label: 'BFSI', category: 'BFSI' },
  { id: 'mining', label: 'Mining', category: 'Mining' },
  { id: 'healthcare', label: 'Healthcare', category: 'Healthcare' },
  { id: 'technology', label: 'Technology', category: 'Technology' },
  { id: 'supply-chain', label: 'Supply Chain', category: 'Supply Chain' },
  { id: 'dei', label: 'DEI', category: 'DEI' },
  { id: 'bhr', label: 'BHR', category: 'BHR' },
];

export interface InteractiveImpactGridProps {
  impacts: any[];
  builderId?: string;
}

export function InteractiveImpactGrid({ impacts, builderId }: InteractiveImpactGridProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  React.useEffect(() => {
    const handleSearch = (e: Event) => {
      const custom = e as CustomEvent<{ query: string }>;
      setSearchQuery(custom.detail?.query || '');
    };
    window.addEventListener('envint:search', handleSearch);
    return () => window.removeEventListener('envint:search', handleSearch);
  }, []);

  const filteredImpacts = useMemo(() => {
    let result = impacts;

    if (activeTab !== 'all') {
      const tabObj = IMPACT_TABS.find((t) => t.id === activeTab);
      if (tabObj && tabObj.category) {
        const target = tabObj.category.toLowerCase();
        result = result.filter((item) => {
          if (Array.isArray(item.categories)) {
            if (
              item.categories.some((c: string) => {
                const low = String(c).toLowerCase();
                return low.includes(target) || target.includes(low);
              })
            ) {
              return true;
            }
          }
          if (item.title && String(item.title).toLowerCase().includes(target)) return true;
          if (item.summary && String(item.summary).toLowerCase().includes(target)) return true;
          if (item.contentHtml && String(item.contentHtml).toLowerCase().includes(target)) return true;
          if (item.service?.name && String(item.service.name).toLowerCase().includes(target)) return true;
          if (item.sector?.name && String(item.sector.name).toLowerCase().includes(target)) return true;
          if (item.theme?.name && String(item.theme.name).toLowerCase().includes(target)) return true;
          return false;
        });
      }
    }

    const cleanQ = searchQuery.trim().toLowerCase();
    if (cleanQ) {
      result = result.filter((item) => {
        const title = String(item.title || '').toLowerCase();
        const summary = String(item.summary || '').toLowerCase();
        const clientType = String(item.clientType || '').toLowerCase();
        const categories = Array.isArray(item.categories) ? item.categories.join(' ').toLowerCase() : '';
        const sector = String(item.sector?.name || '').toLowerCase();
        const service = String(item.service?.name || '').toLowerCase();
        const theme = String(item.theme?.name || '').toLowerCase();

        return (
          title.includes(cleanQ) ||
          summary.includes(cleanQ) ||
          clientType.includes(cleanQ) ||
          categories.includes(cleanQ) ||
          sector.includes(cleanQ) ||
          service.includes(cleanQ) ||
          theme.includes(cleanQ)
        );
      });
    }

    return result;
  }, [activeTab, searchQuery, impacts]);

  return (
    <div data-builder-id={builderId} data-envint-filterable="true" style={{ width: '100%' }}>
      {/* Category Tabs Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          rowGap: '14px',
          marginBottom: '44px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '6px',
        }}
      >
        {IMPACT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                backgroundColor: isActive ? '#0074FD' : isHovered ? '#0074FD' : '#FFFFFF',
                color: isActive || isHovered ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)',
                border: isActive || isHovered ? '0.5px solid #0074FD' : '0.5px solid rgba(0, 0, 0, 0.45)',
                borderRadius: '56px',
                padding: '8px 24px',
                fontSize: '16px',
                fontWeight: 400,
                fontFamily: '"Neue Montreal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      {filteredImpacts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '70px 20px',
            color: '#666666',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
          }}
        >
          <p style={{ margin: '0 0 12px 0' }}>
            {searchQuery ? `No case studies found matching "${searchQuery}".` : 'No case studies found for this category.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                window.dispatchEvent(new CustomEvent('envint:search', { detail: { query: '' } }));
              }}
              style={{
                backgroundColor: '#004E35',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '30px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {filteredImpacts.map((item: any) => {
            const coverImg = resolveCmsImage(
              item.coverImage?.url ||
                item.coverImageUrl ||
                (item as any).heroImage ||
                'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-sustainability.webp'
            );
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
                    padding: '20px',
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
                      lineHeight: '1.3',
                      margin: '0 0 12px 0',
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
                        color: 'rgba(0, 0, 0, 0.6)',
                        lineHeight: '1.5',
                        margin: '0 0 16px 0',
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
                      fontWeight: 500,
                      color: '#2F7ABE',
                      display: 'block',
                      textAlign: 'left',
                      marginTop: 'auto',
                      paddingTop: '8px',
                    }}
                  >
                    Read More
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
