'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Sparkles, User } from 'lucide-react';

export interface BlockLayout {
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'center' | 'bottom';
  width?: 'narrow' | 'standard' | 'wide' | 'full';
  spacing?: 'compact' | 'normal' | 'spacious';
  bgColor?: string;
  bgImage?: string;
}

export interface BlockSection {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  props: Record<string, any>;
  layout?: BlockLayout;
}

interface LiveCanvasRendererProps {
  blocks: BlockSection[];
  pageTitle: string;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
}

const defaultMilestones = [
  { year: '2018', desc: 'Envint starts in Mumbai with two founding Partners' },
  { year: '2019', desc: 'First corporate ESG engagements and institutional partnerships' },
  { year: '2020', desc: 'Navigating COVID, first ESG due diligence and decarbonization mandate' },
  { year: '2021', desc: 'Responsible Investment practice launch, team crosses double digits' },
  { year: '2022', desc: 'Expands to four offices across India, client roster crosses 50' },
  { year: '2023', desc: 'New global ESG mandates, seeds of international expansion' },
  { year: '2024', desc: '6+ years of creating climate impact with 500+ projects delivered' },
];

const sampleTeamMembers = [
  { name: 'Anand Krishnamurthy', role: 'Founding Partner', photo: '/images/team-anand.webp' },
  { name: 'Manish R Jain', role: 'Founding Partner', photo: '/images/team-manish.webp' },
  { name: 'Sagarika Bose', role: 'Partner - Responsible Investment', photo: '' },
  { name: 'Dr. Vivek Sharma', role: 'Lead - Climate Action', photo: '' },
];

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/images/sustainability-hero.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/hero-sustainability.webp';
  }
  if (url.startsWith('/images/climate-hero.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-climate.webp';
  }
  if (url.startsWith('/images/investment-hero.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-responsible.webp';
  }
  if (url.startsWith('/images/')) {
    return `https://envintcms.s3.ap-south-1.amazonaws.com${url}`;
  }
  if (url.startsWith('/media/uploads/')) {
    return `https://envintcms.s3.ap-south-1.amazonaws.com${url}`;
  }
  return url;
}

export function LiveCanvasRenderer({
  blocks,
  pageTitle,
  selectedBlockId,
  onSelectBlock,
}: LiveCanvasRendererProps) {
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<string, number>>({});
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const activeBlocks = blocks.filter((b) => b.enabled !== false);

  const toggleFaq = (blockId: string, idx: number) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [blockId]: prev[blockId] === idx ? -1 : idx,
    }));
  };

  if (activeBlocks.length === 0) {
    return (
      <div
        style={{
          padding: '100px 40px',
          textAlign: 'center',
          color: '#64748b',
          backgroundColor: '#ffffff',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3079bd',
            marginBottom: '16px',
          }}
        >
          <Sparkles size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: '0 0 8px' }}>
          Your Page Canvas is Ready
        </h3>
        <p style={{ maxWidth: '440px', fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Click <strong>"+ Add Block"</strong> in the left sidebar to add heroes, narratives, feature cards, or stats to this page.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100%',
        width: '100%',
        color: '#1e293b',
        fontFamily: '"Neue Montreal", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {activeBlocks.map((block, idx) => {
        const props = block.props || {};
        const layout = block.layout || {};
        const isSelected = selectedBlockId === block.id;
        const isHovered = hoveredBlockId === block.id;

        // Container widths
        const widthMap: Record<string, string> = {
          narrow: '840px',
          standard: '1180px',
          wide: '1360px',
          full: '100%',
        };
        const containerMaxWidth = widthMap[layout.width || 'standard'] || '1180px';

        // Spacing
        const spacingPadding: Record<string, string> = {
          compact: '40px 24px',
          normal: '80px 24px',
          spacious: '120px 24px',
        };
        const sectionPadding = spacingPadding[layout.spacing || 'normal'] || '80px 24px';

        const align = layout.align || 'left';

        return (
          <div
            key={block.id || idx}
            onClick={() => onSelectBlock && onSelectBlock(block.id)}
            onMouseEnter={() => setHoveredBlockId(block.id)}
            onMouseLeave={() => setHoveredBlockId(null)}
            style={{
              position: 'relative',
              outline: isSelected
                ? '3px solid #3079bd'
                : isHovered
                ? '2px dashed #94a3b8'
                : '1px solid transparent',
              outlineOffset: '-2px',
              cursor: 'pointer',
              transition: 'outline 0.15s ease-in-out',
            }}
          >
            {/* Section Tag Badge in Canvas */}
            {(isHovered || isSelected) && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  zIndex: 40,
                  backgroundColor: isSelected ? '#3079bd' : '#1e293b',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{idx + 1}. {block.name}</span>
                <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>({block.type})</span>
              </div>
            )}

            {/* 1. HERO BLOCK */}
            {(block.type === 'hero-banner' || block.type === 'about-hero' || block.type === 'career-hero') && (
              <div
                style={{
                  position: 'relative',
                  minHeight: '480px',
                  display: 'flex',
                  alignItems: layout.vAlign === 'top' ? 'flex-start' : layout.vAlign === 'bottom' ? 'flex-end' : 'center',
                  padding: '120px 24px 80px',
                  backgroundColor: layout.bgColor || '#002E20',
                  backgroundImage: props.bgImage || layout.bgImage ? `url(${resolveMediaUrl(props.bgImage || layout.bgImage)})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* Dark gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.5) 100%)',
                    zIndex: 1,
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: containerMaxWidth,
                    margin: '0 auto',
                    width: '100%',
                    textAlign: align,
                  }}
                >
                  <h1
                    style={{
                      fontSize: 'clamp(32px, 4vw, 62px)',
                      fontWeight: 500,
                      color: '#FBF4EB',
                      lineHeight: 1.15,
                      margin: '0 0 20px',
                      maxWidth: '960px',
                      textShadow: '0 2px 14px rgba(0,0,0,0.4)',
                    }}
                  >
                    {props.title || pageTitle}
                  </h1>

                  {props.subtitle && (
                    <p
                      style={{
                        fontSize: 'clamp(17px, 1.8vw, 22px)',
                        fontWeight: 300,
                        color: '#E2E8F0',
                        lineHeight: 1.45,
                        maxWidth: '780px',
                        margin: '0 0 28px',
                      }}
                    >
                      {props.subtitle}
                    </p>
                  )}

                  {props.ctaLabel && (
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '12px 28px',
                          borderRadius: '30px',
                          backgroundColor: '#3079bd',
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: 600,
                          boxShadow: '0 4px 14px rgba(48, 121, 189, 0.4)',
                        }}
                      >
                        {props.ctaLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. STORY / NARRATIVE BLOCK */}
            {(block.type === 'story-narrative' || block.type === 'about-story' || block.type === 'about-vision') && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div
                  style={{
                    maxWidth: containerMaxWidth,
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 440px) minmax(0, 1fr)',
                    gap: '48px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    {props.tagline && (
                      <div
                        style={{
                          color: '#45b653',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          marginBottom: '12px',
                        }}
                      >
                        {props.tagline}
                      </div>
                    )}
                    <h2
                      style={{
                        fontSize: '36px',
                        fontWeight: 400,
                        color: '#004E35',
                        lineHeight: 1.25,
                        margin: 0,
                      }}
                    >
                      {props.headline || props.title || 'Our Purpose'}
                    </h2>
                  </div>

                  <div>
                    {[props.description, props.statement, props.belief, props.paragraph1, props.paragraph2]
                      .filter(Boolean)
                      .map((para, pIdx) => (
                        <p
                          key={pIdx}
                          style={{
                            fontSize: '19px',
                            lineHeight: '32px',
                            color: '#334155',
                            margin: pIdx === 0 ? '0 0 20px' : '0 0 20px',
                          }}
                        >
                          {para}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. FOUNDERS SPOTLIGHT */}
            {block.type === 'about-founders' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#F8FAFC',
                }}
              >
                <div
                  style={{
                    maxWidth: containerMaxWidth,
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 480px) minmax(0, 1fr)',
                    gap: '56px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <img
                      src={resolveMediaUrl(props.image || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/founders-anand-manish.webp')}
                      alt={props.title || 'Founders'}
                      style={{
                        width: '100%',
                        borderRadius: '16px',
                        display: 'block',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                      }}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '38px', fontWeight: 400, color: '#004E35', margin: '0 0 24px' }}>
                      {props.title || 'How It All Began'}
                    </h2>
                    {props.paragraph1 && (
                      <p style={{ fontSize: '18px', lineHeight: '30px', color: '#334155', marginBottom: '18px' }}>
                        {props.paragraph1}
                      </p>
                    )}
                    {props.paragraph2 && (
                      <p style={{ fontSize: '18px', lineHeight: '30px', color: '#334155', margin: 0 }}>
                        {props.paragraph2}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. STATS COUNTER */}
            {block.type === 'stats-counter' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#F0FDF4',
                  textAlign: 'center',
                }}
              >
                <div style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}>
                  {props.title && (
                    <h2 style={{ fontSize: '34px', fontWeight: 400, color: '#004E35', marginBottom: '44px' }}>
                      {props.title}
                    </h2>
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {[
                      { num: props.stat1_num, label: props.stat1_label },
                      { num: props.stat2_num, label: props.stat2_label },
                      { num: props.stat3_num, label: props.stat3_label },
                      { num: props.stat4_num, label: props.stat4_label },
                    ]
                      .filter((s) => s.num)
                      .map((stat, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            backgroundColor: '#ffffff',
                            padding: '32px 20px',
                            borderRadius: '16px',
                            border: '1px solid #DCFCE7',
                            boxShadow: '0 4px 16px rgba(0, 78, 53, 0.05)',
                          }}
                        >
                          <div style={{ fontSize: '46px', fontWeight: 600, color: '#004E35', lineHeight: 1 }}>
                            {stat.num}
                          </div>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#475569',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              marginTop: '12px',
                            }}
                          >
                            {stat.label}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. STRATEGIC PILLARS / FEATURE CARDS */}
            {(block.type === 'feature-cards' || block.type === 'about-pillars') && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
                    <h2 style={{ fontSize: '38px', fontWeight: 400, color: '#004E35', margin: '0 0 14px' }}>
                      {props.title || 'Our Strategic Focus'}
                    </h2>
                    {props.subtitle && (
                      <p style={{ fontSize: '18px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                        {props.subtitle}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {[
                      { title: props.card1_title || props.pillar1_title, desc: props.card1_desc || props.pillar1_desc },
                      { title: props.card2_title || props.pillar2_title, desc: props.card2_desc || props.pillar2_desc },
                      { title: props.card3_title || props.pillar3_title, desc: props.card3_desc || props.pillar3_desc },
                      { title: props.card4_title || props.pillar4_title, desc: props.card4_desc || props.pillar4_desc },
                    ]
                      .filter((c) => c.title)
                      .map((card, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            backgroundColor: '#F8FAFC',
                            borderRadius: '16px',
                            padding: '32px 26px',
                            border: '1px solid #E2E8F0',
                            borderTop: '4px solid #004E35',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: '#DCFCE7',
                              color: '#004E35',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '16px',
                              marginBottom: '16px',
                            }}
                          >
                            {cIdx + 1}
                          </div>
                          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', margin: '0 0 10px' }}>
                            {card.title}
                          </h3>
                          <p style={{ fontSize: '15px', lineHeight: '24px', color: '#475569', margin: 0 }}>
                            {card.desc}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. CALL TO ACTION BANNER */}
            {block.type === 'cta-banner' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#F8FAFC',
                }}
              >
                <div
                  style={{
                    maxWidth: containerMaxWidth,
                    margin: '0 auto',
                    backgroundColor: '#004E35',
                    background: 'linear-gradient(135deg, #004E35 0%, #002E20 100%)',
                    borderRadius: '24px',
                    padding: '56px 40px',
                    color: '#ffffff',
                    textAlign: 'center',
                    boxShadow: '0 16px 36px rgba(0, 78, 53, 0.2)',
                  }}
                >
                  <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 400, margin: '0 0 14px', color: '#FBF4EB' }}>
                    {props.headline || 'Ready to Accelerate Your Sustainability Journey?'}
                  </h2>
                  <p style={{ fontSize: '18px', color: '#A7F3D0', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.5 }}>
                    {props.subtext || 'Speak with our ESG and climate advisory leaders today.'}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '14px 32px',
                      borderRadius: '30px',
                      backgroundColor: '#ffffff',
                      color: '#004E35',
                      fontSize: '15px',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    {props.buttonLabel || 'Get in Touch'}
                  </span>
                </div>
              </div>
            )}

            {/* 7. FAQ ACCORDION */}
            {block.type === 'faq-accordion' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div style={{ maxWidth: '840px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '34px', fontWeight: 400, color: '#004E35', textAlign: 'center', margin: '0 0 36px' }}>
                    {props.title || 'Frequently Asked Questions'}
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { q: props.q1, a: props.a1 },
                      { q: props.q2, a: props.a2 },
                      { q: props.q3, a: props.a3 },
                      { q: props.q4, a: props.a4 },
                    ]
                      .filter((item) => item.q && item.a)
                      .map((item, fIdx) => {
                        const isOpen = (openFaqIndices[block.id] ?? 0) === fIdx;
                        return (
                          <div
                            key={fIdx}
                            style={{
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              backgroundColor: '#F8FAFC',
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFaq(block.id, fIdx);
                              }}
                              style={{
                                width: '100%',
                                padding: '18px 22px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '17px',
                                fontWeight: 600,
                                color: '#0F172A',
                              }}
                            >
                              <span>{item.q}</span>
                              {isOpen ? <ChevronUp size={18} color="#004E35" /> : <ChevronDown size={18} color="#64748B" />}
                            </button>
                            {isOpen && (
                              <div style={{ padding: '0 22px 18px', color: '#475569', fontSize: '15px', lineHeight: '26px' }}>
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* 8. JOURNEY / MILESTONES */}
            {block.type === 'about-journey' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#F8FAFC',
                }}
              >
                <div style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 400, color: '#004E35', margin: '0 0 12px' }}>
                      {props.title || 'Our Journey'}
                    </h2>
                    {props.subtitle && (
                      <p style={{ fontSize: '17px', color: '#64748B', margin: 0 }}>
                        {props.subtitle}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      overflowX: 'auto',
                      paddingBottom: '16px',
                    }}
                  >
                    {defaultMilestones.map((ms, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          minWidth: '260px',
                          backgroundColor: '#ffffff',
                          padding: '24px 20px',
                          borderRadius: '14px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '26px',
                            fontWeight: 700,
                            color: '#3079bd',
                            marginBottom: '10px',
                          }}
                        >
                          {ms.year}
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: '22px', color: '#475569', margin: 0 }}>
                          {ms.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 9. TEAM GRID */}
            {block.type === 'about-team' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 400, color: '#004E35', margin: '0 0 12px' }}>
                      {props.title || 'Leadership & Team'}
                    </h2>
                    {props.subtitle && (
                      <p style={{ fontSize: '17px', color: '#64748B', margin: 0 }}>
                        {props.subtitle}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {sampleTeamMembers.map((member, tIdx) => (
                      <div
                        key={tIdx}
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '14px',
                          padding: '24px 18px',
                          textAlign: 'center',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        <div
                          style={{
                            width: '84px',
                            height: '84px',
                            borderRadius: '50%',
                            backgroundColor: '#DCFCE7',
                            color: '#004E35',
                            margin: '0 auto 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <User size={40} />
                        </div>
                        <div style={{ fontSize: '17px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>
                          {member.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 10. TEXT CONTENT BLOCK */}
            {block.type === 'text-content' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div style={{ maxWidth: containerMaxWidth, margin: '0 auto', textAlign: align }}>
                  {props.heading && (
                    <h2 style={{ fontSize: '32px', fontWeight: 400, color: '#004E35', marginBottom: '22px' }}>
                      {props.heading}
                    </h2>
                  )}
                  {[props.paragraph1, props.paragraph2, props.paragraph3]
                    .filter(Boolean)
                    .map((p, pIdx) => (
                      <p
                        key={pIdx}
                        style={{
                          fontSize: '18px',
                          lineHeight: '30px',
                          color: '#334155',
                          marginBottom: '20px',
                        }}
                      >
                        {p}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {/* 11. RICH TEXT BLOCK */}
            {block.type === 'rich-text' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: align }}>
                  {props.title && (
                    <h2 style={{ fontSize: '32px', fontWeight: 400, color: '#004E35', marginBottom: '22px' }}>
                      {props.title}
                    </h2>
                  )}
                  {props.content ? (
                    <div
                      style={{ fontSize: '17px', lineHeight: '28px', color: '#334155' }}
                      dangerouslySetInnerHTML={{ __html: props.content }}
                    />
                  ) : (
                    <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No rich text content entered yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 12. INSIGHTS GRID BLOCK */}
            {block.type === 'insights-grid' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 400, color: '#004E35', margin: '0 0 12px' }}>
                      {props.title || 'Latest Insights'}
                    </h2>
                    {props.subtitle && (
                      <p style={{ fontSize: '18px', color: '#64748B', margin: 0 }}>
                        {props.subtitle}
                      </p>
                    )}
                    {props.filterCategory && (
                      <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', fontWeight: 600, color: '#004E35', backgroundColor: '#ecfdf5', padding: '3px 10px', borderRadius: '12px' }}>
                        Category: {props.filterCategory}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {[
                      { title: 'Navigating BRSR Core Compliance for Indian Corporates', category: props.filterCategory || 'Envision', date: 'August 2024' },
                      { title: 'Demystifying Scope 3 Emissions in Manufacturing Supply Chains', category: props.filterCategory || 'Envision', date: 'July 2024' },
                      { title: 'TCFD Climate Scenario Analysis: Methodologies and Pitfalls', category: props.filterCategory || 'Envision', date: 'June 2024' },
                    ].map((art, aIdx) => (
                      <div
                        key={aIdx}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div style={{ height: '160px', backgroundColor: '#002E20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a7f3d0', fontSize: '13px', fontWeight: 600 }}>
                          Article Cover Image
                        </div>
                        <div style={{ padding: '20px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#004E35', letterSpacing: '0.05em' }}>
                            {art.category} • {art.date}
                          </span>
                          <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#0f172a', margin: '10px 0 0', lineHeight: 1.4 }}>
                            {art.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 13. IMPACT GRID BLOCK */}
            {block.type === 'impact-grid' && (
              <div
                style={{
                  padding: sectionPadding,
                  backgroundColor: layout.bgColor || '#ffffff',
                }}
              >
                <div style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 400, color: '#004E35', margin: '0 0 12px' }}>
                      {props.title || 'Selected Case Studies'}
                    </h2>
                    {props.subtitle && (
                      <p style={{ fontSize: '18px', color: '#64748B', margin: 0 }}>
                        {props.subtitle}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {[
                      { title: 'Portfolio E&S Due Diligence for Global Private Equity Fund', sector: 'Financial Services' },
                      { title: 'Scope 1-3 Footprinting & SBTi Net Zero Strategy for Conglomerate', sector: 'Manufacturing' },
                      { title: 'BRSR Assurance Readiness & Sustainability Governance Design', sector: 'Healthcare' },
                    ].map((cs, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '14px',
                          border: '1px solid #e2e8f0',
                          borderTop: '4px solid #004E35',
                          padding: '24px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#004E35', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '4px' }}>
                          {cs.sector}
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '14px 0 0', lineHeight: 1.4 }}>
                          {cs.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
