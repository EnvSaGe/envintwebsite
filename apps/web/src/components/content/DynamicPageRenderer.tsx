import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';
import { getTeamMembers } from '@/lib/data/team';
import { getInsights } from '@/lib/data/insights';
import { getImpacts } from '@/lib/data/impacts';
import JourneyCarousel, { JourneyMilestone } from '@/components/about/JourneyCarousel';
import TeamGrid, { TeamCardMember } from '@/components/about/TeamGrid';
import { FaqAccordion } from './FaqAccordion';
import { TemplateRenderer } from '../builder/TemplateRenderer';
import styles from '@/app/about/about.module.css';

interface DynamicPageRendererProps {
  page: {
    slug: string;
    title: string;
    contentBlocks?: any[] | null;
    draftBlocks?: any | null;
    publishedBlocks?: any | null;
    schemaVersion?: number | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    layoutTemplate?: string | null;
    status?: string | null;
  };
  teamCards?: TeamCardMember[];
}

const defaultMilestones: JourneyMilestone[] = [
  { year: '2018', month: 'June', img: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/journey-2018.webp', desc: 'Envint starts in Mumbai with two founding Partners' },
  { year: '2019', month: '', img: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/journey-2019.webp', desc: 'Few ESG engagements and knowledge partnerships' },
  { year: '2020', month: '', img: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/journey-2020.webp', desc: 'COVID, lockdowns, changed world, first ESG due diligence' },
  { year: '2021', month: '', img: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/journey-2021.webp', desc: 'RI Head joins, first client on sustainability, team crosses double digits, first off-site' },
  { year: '2022', month: '', img: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/journey-2022.webp', desc: 'Expands to four offices across India, team crosses 20, number of clients touch 50' },
  { year: '2023', month: '', img: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/journey-2023.webp', desc: 'New themes in ESG, multiple DFI mandates, seeds of international expansion' },
  { year: '2024', month: '', img: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/journey-2024.webp', desc: '6 years of creating impact, client roster crosses 100 with 300+ engagements' },
];

const ENTITY_DECODE: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', bull: '•',
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/g, (match, name: string) => ENTITY_DECODE[name] ?? match);
}

function bioToText(html: string | undefined | null): string {
  if (!html) return '';
  const marked = html
    .replace(/<\/(p|div|h[1-6]|li|ol|ul|section|article|blockquote)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n');
  const text = sanitizeHtml(marked, { allowedTags: [], allowedAttributes: {} });
  return decodeEntities(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/images/sustainability-hero.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/hero-sustainability.webp';
  }
  if (url.startsWith('/images/climate-hero.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-climate.webp';
  }
  if (url.startsWith('/images/investment-hero.webp') || url.startsWith('/images/services-investment.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-responsible.webp';
  }
  if (url.startsWith('/images/mapsense-banner.jpg')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/mapsense-hero.webp';
  }
  if (url.startsWith('/images/careers-polo.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/careers-polo-people.webp';
  }
  if (url.startsWith('/images/careers-footer.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/careers-footer.jpg';
  }
  if (url.startsWith('/images/careers-wifu-3.webp') || url.startsWith('/images/careers-wifu-4.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/careers-typical-day.webp';
  }
  if (url.startsWith('/images/')) {
    return `https://envintcms.s3.ap-south-1.amazonaws.com${url}`;
  }
  if (url.startsWith('/media/uploads/')) {
    return `https://envintcms.s3.ap-south-1.amazonaws.com${url}`;
  }
  return url;
}

const headingStyle = {
  fontFamily: '"Neue Montreal", sans-serif',
  fontSize: '48px',
  fontWeight: 400,
  color: '#004E35',
  lineHeight: 'normal',
} as const;

const bodyStyle = {
  fontFamily: '"Neue Montreal", sans-serif',
  fontSize: '24px',
  fontWeight: 400,
  color: '#393939',
  lineHeight: '35px',
} as const;

export async function DynamicPageRenderer({ page, teamCards: providedTeamCards }: DynamicPageRendererProps) {
  // 1. Dual-Engine Support: Check for Schema v2 Dynamic Page Tree
  const treeData = (page.publishedBlocks && (page.publishedBlocks as any).rootIds && (page.publishedBlocks as any).nodes)
    ? page.publishedBlocks
    : (page.draftBlocks && (page.draftBlocks as any).rootIds && (page.draftBlocks as any).nodes)
      ? page.draftBlocks
      : null;

  if (treeData) {
    let teamCards = providedTeamCards;
    const hasTeamNode = Object.values((treeData as any).nodes || {}).some((n: any) => n && n.type === 'team-grid');
    if (hasTeamNode && (!teamCards || teamCards.length === 0)) {
      const members = await getTeamMembers();
      teamCards = members.map((member: any) => ({
        name: member.name,
        slug: member.slug,
        roleTitle: member.roleTitle,
        role: member.role,
        bioText: bioToText(member.bio),
        linkedinUrl: member.linkedinUrl,
        imageUrl: member.image?.url || null,
        hasStandaloneRoute: member.hasStandaloneRoute,
      }));
    }
    return (
      <TemplateRenderer
        tree={treeData as any}
        context={{
          record: page,
          route: { pathname: page.slug },
        }}
        teamCards={teamCards}
      />
    );
  }

  // 2. Schema v1: Legacy Block Dispatcher
  const blocks = (page.contentBlocks || []).filter((b: any) => b && b.enabled !== false);

  // Lazy-load team members if any block is about-team
  let teamCards = providedTeamCards;
  const hasTeamBlock = blocks.some((b: any) => b.type === 'about-team');
  if (hasTeamBlock && (!teamCards || teamCards.length === 0)) {
    const members = await getTeamMembers();
    teamCards = members.map((member: any) => ({
      name: member.name,
      slug: member.slug,
      roleTitle: member.roleTitle,
      role: member.role,
      bioText: bioToText(member.bio),
      linkedinUrl: member.linkedinUrl,
      imageUrl: member.image?.url || null,
      hasStandaloneRoute: member.hasStandaloneRoute,
    }));
  }

  // Lazy-load insights if any block is insights-grid
  let insightsList: any[] = [];
  if (blocks.some((b: any) => b.type === 'insights-grid')) {
    insightsList = await getInsights();
  }

  // Lazy-load impact case studies if any block is impact-grid
  let impactsList: any[] = [];
  if (blocks.some((b: any) => b.type === 'impact-grid')) {
    impactsList = await getImpacts();
  }

  return (
    <div className="dynamic-page-root">
      {blocks.map((block: any, index: number) => {
        const props = block.props || {};
        const layout = block.layout || {};

        // ---- Layout helpers (set in the CMS editor's Layout tab) ----
        const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
        const spacingMap = { compact: '36px 0', normal: '80px 0', spacious: '120px 0' } as const;
        const sectionPadding = spacingMap[(layout.spacing as keyof typeof spacingMap) || 'normal'];
        const contentAlign = alignMap[(layout.align as keyof typeof alignMap) || 'left'];
        const vAlign = (layout.vAlign as string) || 'center';

        const renderSwitch = (): any => { switch (block.type) {
          // 1. HERO BANNER
          case 'about-hero':
          case 'hero-banner':
          case 'career-hero': {
            const heroBg = resolveMediaUrl(props.bgImage || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp');
            return (
              <section
                key={block.id || index}
                className="page-hero"
                style={{
                  position: 'relative',
                  minHeight: '60vh',
                  display: 'flex',
                  alignItems: 'flex-end',
                  paddingBottom: '80px',
                  paddingTop: '160px',
                  backgroundColor: '#002E20',
                  overflow: 'hidden'
                }}
              >
                <Image
                  src={heroBg}
                  alt={props.title || page.title}
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.4) 100%)' }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, paddingLeft: '24px', paddingRight: '24px', width: '100%' }}>
                  <h1 style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: 'clamp(38px, 4.8vw, 76px)',
                    fontWeight: 400,
                    color: '#FBF4EB',
                    lineHeight: 1.15,
                    maxWidth: '1000px',
                    textShadow: '0 2px 18px rgba(0,0,0,0.4)',
                    margin: '0 0 20px 0',
                  }}>
                    {props.title || page.title}
                  </h1>

                  {props.subtitle && (
                    <p style={{
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: 'clamp(18px, 1.8vw, 24px)',
                      fontWeight: 300,
                      color: '#E2E8F0',
                      lineHeight: 1.4,
                      maxWidth: '800px',
                      margin: 0,
                    }}>
                      {props.subtitle}
                    </p>
                  )}

                  {props.ctaLabel && props.ctaUrl && (
                    <div style={{ marginTop: '32px' }}>
                      <Link
                        href={props.ctaUrl}
                        style={{
                          display: 'inline-block',
                          padding: '14px 28px',
                          borderRadius: '30px',
                          backgroundColor: '#10B981',
                          color: '#ffffff',
                          fontFamily: '"Neue Montreal", sans-serif',
                          fontSize: '16px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        {props.ctaLabel}
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 2. STORY & NARRATIVE (2-column layout or single-column statement)
          case 'about-story':
          case 'about-vision':
          case 'story-narrative': {
            const headline = props.headline || (block.type === 'about-vision' || block.type === 'about-story' ? (props.title || 'About Envint') : (props.title || ''));
            const paragraphs = [
              props.description,
              props.statement,
              props.belief,
              props.strategy,
              props.paragraph1,
              props.paragraph2
            ].filter(Boolean);

            return (
              <section key={block.id || index} style={{ paddingTop: '80px', paddingBottom: '100px', backgroundColor: '#ffffff' }}>
                <div className="container hero-stretch" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  {headline ? (
                    <div className="about-split">
                      <h2 className="about-title" style={{ ...headingStyle, margin: 0 }}>
                        {headline}
                      </h2>
                      <div>
                        {paragraphs.map((text: string, pIdx: number) => (
                          <p key={pIdx} style={{ ...bodyStyle, margin: pIdx < paragraphs.length - 1 ? '0 0 30px 0' : 0 }}>
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ maxWidth: '900px' }}>
                      {paragraphs.map((text: string, pIdx: number) => (
                        <p key={pIdx} style={{ ...bodyStyle, margin: pIdx < paragraphs.length - 1 ? '0 0 30px 0' : 0 }}>
                          {text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 3. FOUNDERS SPOTLIGHT (photo left, story right)
          case 'about-founders': {
            const foundersPhoto = resolveMediaUrl(props.image || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/founders-anand-manish.webp');
            const title = props.title || 'How it all began';
            const p1 = props.paragraph1 || 'A deep conviction to create an impact in the environment sector was all it took Anand and Manish to start Envint in June 2018.';
            const p2 = props.paragraph2 || 'Envint is a portmanteau of ‘environment’ and ‘intelligence’ and an anagram of ‘invent’, reflecting a new approach to business.';

            return (
              <section key={block.id || index} style={{ paddingTop: '72px', paddingBottom: '110px', backgroundColor: '#F7F7F7' }}>
                <div className="container hero-stretch" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  <div className="about-began-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 550px) minmax(0, 1fr)',
                    gap: '70px',
                    alignItems: 'center',
                    marginLeft: '60px',
                    maxWidth: '1220px',
                  }}>
                    <div style={{ position: 'relative' }}>
                      <Image
                        src={foundersPhoto}
                        alt="Envint Co-Founders Anand Krishnamurthy and Manish R Jain"
                        width={1100}
                        height={1268}
                        sizes="(max-width: 900px) 100vw, 45vw"
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '15px' }}
                      />
                    </div>
                    <div style={{ paddingTop: '6px', maxWidth: '556px' }}>
                      <h2 style={{ ...headingStyle, margin: '0 0 40px 0' }}>{title}</h2>
                      <p style={{ ...bodyStyle, margin: '0 0 20px 0' }}>{p1}</p>
                      <p style={{ ...bodyStyle, margin: 0 }}>{p2}</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // 4. JOURNEY MILESTONES (timeline carousel)
          case 'about-journey': {
            return (
              <section key={block.id || index} className={styles.journeySection}>
                <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  <JourneyCarousel milestones={defaultMilestones} />
                </div>
              </section>
            );
          }

          // 5. TEAM & LEADERSHIP GRID
          case 'about-team': {
            const teamTitle = props.title || 'A team you’ll be proud to call your own';
            const teamSubtitle = props.subtitle || 'Our team is based across multiple locations in India and other geographies. We are on a shared journey to make businesses bring about change for the better.';

            return (
              <section key={block.id || index} id="team" className={styles.teamSection}>
                <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  <div className={styles.teamIntro}>
                    <h2 className={styles.teamTitle}>{teamTitle}</h2>
                    <p className={styles.teamSubtitle}>{teamSubtitle}</p>
                  </div>

                  {teamCards && teamCards.length > 0 ? (
                    <TeamGrid members={teamCards} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      Loading team members...
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 6. STATS & KEY METRICS COUNTER
          case 'stats-counter': {
            const stats = [
              { num: props.stat1_num || '500+', label: props.stat1_label || 'Engagements Delivered' },
              { num: props.stat2_num || '100+', label: props.stat2_label || 'Corporate Clients' },
              { num: props.stat3_num || '15+', label: props.stat3_label || 'Geographies' },
              { num: props.stat4_num || '6+', label: props.stat4_label || 'Years of Impact' },
            ].filter((s) => s.num);

            return (
              <section key={block.id || index} style={{ padding: '80px 0', backgroundColor: '#F0FDF4' }}>
                <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  {props.title && (
                    <h2 style={{
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '36px',
                      fontWeight: 400,
                      color: '#004E35',
                      textAlign: 'center',
                      marginBottom: '50px'
                    }}>
                      {props.title}
                    </h2>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '28px'
                  }}>
                    {stats.map((item, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '36px 28px',
                          borderRadius: '16px',
                          border: '1px solid #DCFCE7',
                          boxShadow: '0 4px 20px rgba(0, 78, 53, 0.05)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{
                          fontFamily: '"Neue Montreal", sans-serif',
                          fontSize: 'clamp(40px, 4vw, 56px)',
                          fontWeight: 500,
                          color: '#004E35',
                          lineHeight: 1
                        }}>
                          {item.num}
                        </div>
                        <div style={{
                          fontFamily: '"Neue Montreal", sans-serif',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginTop: '12px'
                        }}>
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 7. STRATEGIC PILLARS / FEATURE CARDS
          case 'about-pillars':
          case 'feature-cards': {
            const title = props.title || 'Our Strategic Focus';
            const subtitle = props.subtitle || 'Delivering measurable value across critical sustainability domains.';
            const cards = [
              { title: props.card1_title || props.pillar1_title || 'Sustainability Integration', desc: props.card1_desc || props.pillar1_desc || 'Embedding environmental and social principles into corporate governance and core operating models.' },
              { title: props.card2_title || props.pillar2_title || 'Climate Action & Decarbonization', desc: props.card2_desc || props.pillar2_desc || 'Formulating greenhouse gas mitigation roadmaps and science-based climate targets.' },
              { title: props.card3_title || props.pillar3_title || 'Responsible Investment', desc: props.card3_desc || props.pillar3_desc || 'Pre-investment diligence, ESG portfolio risk monitoring, and institutional stewardship.' },
              { title: props.card4_title || props.pillar4_title, desc: props.card4_desc || props.pillar4_desc },
            ].filter((c) => c.title);

            return (
              <section key={block.id || index} style={{ padding: '90px 0', backgroundColor: '#ffffff' }}>
                <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px' }}>
                    <h2 style={{ ...headingStyle, fontSize: '40px', margin: '0 0 16px' }}>{title}</h2>
                    {subtitle && (
                      <p style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '20px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                        {subtitle}
                      </p>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                  }}>
                    {cards.map((card, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '16px',
                          padding: '36px 30px',
                          border: '1px solid #E2E8F0',
                          borderTop: '4px solid #004E35',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: '#DCFCE7',
                            color: '#004E35',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '18px',
                            marginBottom: '20px'
                          }}>
                            {cIdx + 1}
                          </div>
                          <h3 style={{
                            fontFamily: '"Neue Montreal", sans-serif',
                            fontSize: '24px',
                            fontWeight: 500,
                            color: '#0F172A',
                            margin: '0 0 14px'
                          }}>
                            {card.title}
                          </h3>
                          <p style={{
                            fontFamily: '"Neue Montreal", sans-serif',
                            fontSize: '17px',
                            lineHeight: '26px',
                            color: '#475569',
                            margin: 0
                          }}>
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 8. CALL TO ACTION BANNER
          case 'cta-banner': {
            const headline = props.headline || 'Ready to Accelerate Your Sustainability Journey?';
            const subtext = props.subtext || 'Speak with our ESG and climate advisory leaders today.';
            const btnLabel = props.buttonLabel || 'Get in Touch';
            const btnUrl = props.buttonUrl || '/connect';

            return (
              <section key={block.id || index} style={{ padding: '80px 24px', backgroundColor: '#F8FAFC' }}>
                <div
                  className="container"
                  style={{
                    backgroundColor: '#004E35',
                    background: 'linear-gradient(135deg, #004E35 0%, #002E20 100%)',
                    borderRadius: '24px',
                    padding: '60px 48px',
                    color: '#ffffff',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0, 78, 53, 0.2)',
                    maxWidth: '1100px'
                  }}
                >
                  <h2 style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: 'clamp(30px, 3.5vw, 44px)',
                    fontWeight: 400,
                    margin: '0 0 16px',
                    color: '#FBF4EB'
                  }}>
                    {headline}
                  </h2>
                  <p style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '19px',
                    color: '#A7F3D0',
                    maxWidth: '650px',
                    margin: '0 auto 36px',
                    lineHeight: 1.5
                  }}>
                    {subtext}
                  </p>
                  <Link
                    href={btnUrl}
                    style={{
                      display: 'inline-block',
                      padding: '15px 34px',
                      borderRadius: '30px',
                      backgroundColor: '#ffffff',
                      color: '#004E35',
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  >
                    {btnLabel}
                  </Link>
                </div>
              </section>
            );
          }

          // 9. FAQ ACCORDION
          case 'faq-accordion': {
            const faqItems = [
              { q: props.q1, a: props.a1 },
              { q: props.q2, a: props.a2 },
              { q: props.q3, a: props.a3 },
              { q: props.q4, a: props.a4 },
            ].filter((f) => f.q && f.a);

            return (
              <section key={block.id || index} style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
                <div className="container">
                  <FaqAccordion items={faqItems} title={props.title || 'Frequently Asked Questions'} />
                </div>
              </section>
            );
          }

          // 10. TEXT / NARRATIVE PROSE
          case 'text-content': {
            const heading = props.heading;
            const paragraphs = [props.paragraph1, props.paragraph2, props.paragraph3].filter(Boolean);

            return (
              <section key={block.id || index} style={{ padding: '70px 24px', backgroundColor: '#ffffff' }}>
                <div className="container" style={{ maxWidth: '840px', margin: '0 auto' }}>
                  {heading && (
                    <h2 style={{
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '36px',
                      fontWeight: 400,
                      color: '#004E35',
                      marginBottom: '28px'
                    }}>
                      {heading}
                    </h2>
                  )}
                  {paragraphs.map((p: string, pIdx: number) => (
                    <p key={pIdx} style={{ ...bodyStyle, fontSize: '20px', lineHeight: '32px', marginBottom: '24px' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            );
          }

          // 11. RICH TEXT / WYSIWYG
          case 'rich-text': {
            const title = props.title;
            const content = props.content;
            return (
              <section key={block.id || index} style={{ padding: '70px 24px', backgroundColor: '#ffffff' }}>
                <div className="container" style={{ maxWidth: '840px', margin: '0 auto' }}>
                  {title && (
                    <h2 style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '36px', fontWeight: 400, color: '#004E35', marginBottom: '24px' }}>
                      {title}
                    </h2>
                  )}
                  {content && (
                    <div
                      style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '20px', lineHeight: '34px', color: '#393939' }}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </div>
              </section>
            );
          }

          // 12. INSIGHTS GRID
          case 'insights-grid': {
            const categoryFilter = (props.filterCategory || '').toLowerCase();
            const filteredArticles = (insightsList || []).filter((a: any) => {
              if (!categoryFilter) return true;
              return (a.categories || []).some((c: string) => c.toLowerCase().includes(categoryFilter));
            });
            const limit = props.limit || 12;
            const displayArticles = filteredArticles.slice(0, limit);

            return (
              <section key={block.id || index} style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
                <div className="container hero-stretch">
                  <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
                    <h2 style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: '#004E35', margin: '0 0 16px' }}>
                      {props.title || 'Latest Insights'}
                    </h2>
                    {props.subtitle && (
                      <p style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '19px', color: '#64748B', margin: 0 }}>
                        {props.subtitle}
                      </p>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '32px',
                  }}>
                    {displayArticles.map((article: any) => {
                      const coverImg = article.coverImage?.url || article.coverImageUrl || '/images/about-hero.webp';
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
                            transition: 'transform 0.2s, box-shadow 0.2s',
                          }}
                        >
                          <div style={{ position: 'relative', height: '210px', width: '100%', backgroundColor: '#002E20' }}>
                            <Image
                              src={coverImg}
                              alt={article.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                              <span style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: '#004E35',
                              }}>
                                {(article.categories && article.categories[0]) || 'Insights'}
                              </span>
                              <h3 style={{
                                fontFamily: '"Neue Montreal", sans-serif',
                                fontSize: '20px',
                                fontWeight: 500,
                                color: '#0F172A',
                                margin: '10px 0 12px',
                                lineHeight: 1.35,
                              }}>
                                {article.title}
                              </h3>
                              {article.summary && (
                                <p style={{
                                  fontSize: '15px',
                                  lineHeight: '22px',
                                  color: '#64748B',
                                  margin: 0,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}>
                                  {article.summary}
                                </p>
                              )}
                            </div>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              marginTop: '20px',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#004E35',
                            }}>
                              Read Insight →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          // 13. IMPACT CASE STUDIES GRID
          case 'impact-grid': {
            const limit = props.limit || 12;
            const displayImpacts = (impactsList || []).slice(0, limit);

            return (
              <section key={block.id || index} style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
                <div className="container hero-stretch">
                  <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
                    <h2 style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: '#004E35', margin: '0 0 16px' }}>
                      {props.title || 'Selected Case Studies'}
                    </h2>
                    {props.subtitle && (
                      <p style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '19px', color: '#64748B', margin: 0 }}>
                        {props.subtitle}
                      </p>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '32px',
                  }}>
                    {displayImpacts.map((cs: any) => {
                      const coverImg = cs.coverImage?.url || cs.coverImageUrl || '/images/impact-hero.webp';
                      return (
                        <Link
                          key={cs.slug}
                          href={`/impact/${cs.slug}/`}
                          style={{
                            textDecoration: 'none',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                            overflow: 'hidden',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                          }}
                        >
                          <div style={{ position: 'relative', height: '200px', width: '100%', backgroundColor: '#002E20' }}>
                            <Image
                              src={coverImg}
                              alt={cs.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                              <span style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: '#004E35',
                                backgroundColor: '#DCFCE7',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                display: 'inline-block',
                              }}>
                                {cs.sector?.name || 'Case Study'}
                              </span>
                              <h3 style={{
                                fontFamily: '"Neue Montreal", sans-serif',
                                fontSize: '20px',
                                fontWeight: 500,
                                color: '#0F172A',
                                margin: '14px 0 12px',
                                lineHeight: 1.35,
                              }}>
                                {cs.title}
                              </h3>
                              {(cs.summary || cs.cardExcerpt) && (
                                <p style={{
                                  fontSize: '15px',
                                  lineHeight: '22px',
                                  color: '#64748B',
                                  margin: 0,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}>
                                  {cs.summary || cs.cardExcerpt}
                                </p>
                              )}
                            </div>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              marginTop: '20px',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#004E35',
                            }}>
                              View Case Study →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          }

          default:
            return null;
        } };

        let rendered = renderSwitch();

        // Apply CMS Layout-tab overrides (alignment / width / spacing / background)
        // on top of each block's base section styles.
        if (rendered && React.isValidElement(rendered)) {
          const baseStyle = ((rendered.props as any)?.style || {}) as React.CSSProperties;
          const overrides: React.CSSProperties = {};
          if (layout.spacing) overrides.padding = sectionPadding;
          if (layout.bgColor) overrides.backgroundColor = layout.bgColor;
          if (layout.bgImage) {
            overrides.backgroundImage = `url(${layout.bgImage})`;
            overrides.backgroundSize = 'cover';
            overrides.backgroundPosition = 'center';
          }
          if (layout.align) {
            overrides.textAlign = layout.align;
            overrides.alignItems = contentAlign;
          }
          if (block.type === 'about-hero' || block.type === 'hero-banner' || block.type === 'career-hero') {
            overrides.justifyContent = vAlign === 'top' ? 'flex-start' : vAlign === 'bottom' ? 'flex-end' : 'center';
          }
          rendered = React.cloneElement(rendered as React.ReactElement<any>, { style: { ...baseStyle, ...overrides } });
        }

        return rendered;
      })}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .about-began-grid { grid-template-columns: 1fr !important; margin-left: 0 !important; }
        }
        @media (max-width: 767px) {
          .about-split h2, .about-began-grid h2 {
            font-size: 28px !important;
          }
          .about-split p, .about-began-grid p {
            font-size: 18px !important;
            line-height: 30px !important;
          }
        }
      ` }} />
    </div>
  );
}
