'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ImpactItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  cardExcerpt?: string;
  heroImage?: string;
  coverImage?: { url: string };
  categories?: string[];
}

interface ImpactFilterGridProps {
  impacts: ImpactItem[];
}

const filterTags = [
  'All',
  'Sustainability Integration',
  'Responsible Investment',
  'Climate Action',
  'Infrastructure & Real Estate',
  'Manufacturing',
  'Energy',
  'Agriculture',
  'BFSI',
  'Mining',
  'Healthcare',
  'Technology',
  'Supply Chain',
  'DEI',
  'BHR',
  'Biodiversity',
  'Circular Economy',
  'Built Environment',
  'Sustainable Finance',
  'Carbon Markets',
];

export default function ImpactFilterGrid({ impacts }: ImpactFilterGridProps) {
  // Default to All so every case study is visible, matching the live
  // envintglobal.com/impact/ page (its capture shows all 26 case studies).
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredImpacts = useMemo(() => {
    if (selectedTag === 'All') {
      return impacts;
    }

    const tagLower = selectedTag.toLowerCase();

    return impacts.filter((item) => {
      const cats = (item.categories || []).map((c) =>
        c.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, ' ')
      );
      const titleLower = (item.title || '').toLowerCase();
      const summaryLower = (item.summary || '').toLowerCase();
      const cleanTag = tagLower.replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, ' ');

      // Check category match
      const inCategory = cats.some(
        (c) => c.includes(cleanTag) || cleanTag.includes(c)
      );
      // Check title match
      const inTitle = titleLower.includes(tagLower);
      // Check summary match
      const inSummary = summaryLower.includes(tagLower);

      return inCategory || inTitle || inSummary;
    });
  }, [impacts, selectedTag]);

  return (
    <div>
      {/* FILTER PILLS (exact live match: 40px pills, 15px gaps, wrap) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '91px',
        }}
      >
        {filterTags.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 'normal',
                backgroundColor: isActive ? '#0074FD' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)',
                border: isActive ? 'none' : '1px solid rgba(0, 0, 0, 0.7)',
                padding: '8px 24px',
                borderRadius: '56px',
                cursor: 'pointer',
                height: '40px',
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Responsive Cards Grid */}
      <div className="impact-filter-grid">
        {filteredImpacts.map((item) => {
          const coverUrl =
            item.heroImage ||
            item.coverImage?.url ||
            (item as any).coverImageUrl ||
            '/images/services-sustainability.webp';

          return (
            <Link
              key={item.slug}
              href={`/impact/${item.slug}/`}
              className="impact-card-link"
            >
              {/* wrapper mirrors live .eael-grid-post-holder */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    height: '260px',
                    position: 'relative',
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  <Image
                    src={coverUrl}
                    alt={item.title}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
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
                  {(item.cardExcerpt || item.summary) && (
                    <p
                      style={{
                        fontFamily: '"Neue Montreal", sans-serif',
                        fontSize: '16px',
                        fontWeight: 400,
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineHeight: 'normal',
                        margin: '10px 0 0 0',
                      }}
                    >
                      {item.cardExcerpt || item.summary}
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
                      padding: '24px 0',
                      marginTop: '10px',
                    }}
                  >
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .impact-filter-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 30px;
          margin-bottom: 50px;
        }
        .impact-card-link {
          display: flex;
          flex-direction: column;
          padding: 0 12px 40px;
          text-decoration: none;
        }
        @media (max-width: 1024px) {
          .impact-filter-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
          .impact-card-link {
            padding: 0 6px 30px;
          }
        }
        @media (max-width: 640px) {
          .impact-filter-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .impact-card-link {
            padding: 0 0 24px;
          }
        }
      ` }} />
    </div>
  );
}