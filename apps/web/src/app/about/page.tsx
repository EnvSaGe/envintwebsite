import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import sanitizeHtml from 'sanitize-html';
import { getTeamMembers } from '@/lib/data/team';
import { getPage } from '@/lib/data/pages';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import JourneyCarousel from '@/components/about/JourneyCarousel';
import TeamGrid, { TeamCardMember } from '@/components/about/TeamGrid';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import styles from './about.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/about');
  const title = page?.seoTitle || 'About Envint - Purpose, Journey & Leadership Team';
  const description =
    page?.seoDescription ||
    'Learn about Envint’s founding journey, our mission to drive sustainability into mainstream action, and meet our multidisciplinary leadership team.';

  return {
    title,
    description,
    alternates: {
      canonical: 'https://envintglobal.com/about/',
    },
    openGraph: {
      title,
      description,
      url: 'https://envintglobal.com/about/',
      type: 'website',
    },
  };
}

const journeyMilestones = [
  { year: '2018', month: 'June', img: '/images/journey-2018.webp', desc: 'Envint starts in Mumbai with two founding Partners' },
  { year: '2019', month: '', img: '/images/journey-2019.webp', desc: 'Few ESG engagements and knowledge partnerships' },
  { year: '2020', month: '', img: '/images/journey-2020.webp', desc: 'COVID, lockdowns, changed world, first ESG due diligence' },
  { year: '2021', month: '', img: '/images/journey-2021.webp', desc: 'RI Head joins, first client on sustainability, team crosses double digits, first off-site' },
  { year: '2022', month: '', img: '/images/journey-2022.webp', desc: 'Expands to four offices across India, team crosses 20, number of clients touch 50' },
  { year: '2023', month: '', img: '/images/journey-2023.webp', desc: 'New themes in ESG, multiple DFI mandates, seeds of international expansion' },
  { year: '2024', month: '', img: '/images/journey-2024.webp', desc: '6 years of creating impact, client roster crosses 100 with 300+ engagements' },
];

const aboutIntro = [
  'Envint is a sustainability and ESG solutions firm, founded with a purpose to shape a more liveable planet for the coming generations.',
  'Our mission is to drive sustainability into mainstream thought and action, with the belief that \u2018green makes sense beyond conscience\u2019.',
  'We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.',
];

const howItBegan = [
  'A deep conviction to create an impact in the environment sector, steadfast encouragement from family & friends and a few coffee shop meetings was all it took Anand and Manish to start Envint in June 2018. They derive their inspiration from India\u2019s innate wisdom on sustainable living, that is in harmony with nature and its creations.',
  'Envint is a portmanteau of \u2018environment\u2019 and \u2018intelligence\u2019 and an anagram of \u2018invent\u2019, reflecting a new approach to business. Initially conceived to provide intelligence for the environment sector, Envint has broadened its ambit to include the wider sustainability domain.',
];

const ENTITY_DECODE: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  bull: '•',
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
  const text = sanitizeHtml(marked, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return decodeEntities(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');
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

export default async function AboutPage() {
  const page = await getPage('/about');
  const members = await getTeamMembers();
  const teamCards: TeamCardMember[] = members.map((member: any) => ({
    name: member.name,
    slug: member.slug,
    roleTitle: member.roleTitle,
    role: member.role,
    bioText: bioToText(member.bio),
    linkedinUrl: member.linkedinUrl,
    imageUrl: member.image?.url || null,
    hasStandaloneRoute: member.hasStandaloneRoute,
  }));

  if (
    page &&
    ((Array.isArray(page.contentBlocks) && page.contentBlocks.length > 0) ||
     (page.publishedBlocks && (page.publishedBlocks as any).rootIds))
  ) {
    return (
      <div>
        <JsonLd data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About Envint', path: '/about/' },
        ])} />
        <DynamicPageRenderer page={page} teamCards={teamCards} />
        {/* Full bios for SEO search crawlers */}
        <div
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          {teamCards.map((member) => (
            <div key={member.slug || member.name}>
              <h3>{member.name}</h3>
              {member.bioText && <p>{member.bioText}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About Envint', path: '/about/' },
      ])} />

      {/* 1. VISION HERO (live: full-screen photo, responsive 58-60vh on mobile/tablet) */}
      <section className="page-hero">
        <Image
          src="/images/about-hero.webp"
          alt="Our vision for the future is one that’s better"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent 55%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingLeft: '24px', paddingRight: '24px' }}>
          <h2 className="about-vision" style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(38px, 4.8vw, 76px)',
            fontWeight: 400,
            color: '#FBF4EB',
            lineHeight: 1.15,
            maxWidth: '1000px',
            textShadow: '0 2px 18px rgba(0,0,0,0.35)',
            margin: 0,
          }}>
            {'Our vision for the future'}
            <br />
            {'is one that’s better'}
          </h2>
        </div>
      </section>

      {/* 2. ABOUT ENVINT (live: heading column + intro paragraphs column) */}
      <section style={{ paddingTop: '63px', paddingBottom: '110px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="about-split">
            <h1 className="about-title" style={{ ...headingStyle, margin: 0 }}>
              About Envint
            </h1>
            <div>
              {aboutIntro.map((text, i) => (
                <p key={i} style={{ ...bodyStyle, margin: i < aboutIntro.length - 1 ? '0 0 30px 0' : 0 }}>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT ALL BEGAN (live: #F7F7F7 section, rounded 15px founders photo left, story right) */}
      <section style={{ paddingTop: '72px', paddingBottom: '110px', backgroundColor: '#F7F7F7' }}>
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
                src="/images/founders-anand-manish.webp"
                alt="Envint Co-Founders Anand Krishnamurthy and Manish R Jain"
                width={1100}
                height={1268}
                sizes="(max-width: 900px) 100vw, 45vw"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '15px' }}
              />
            </div>
            <div style={{ paddingTop: '6px', maxWidth: '556px' }}>
              <h2 style={{ ...headingStyle, margin: '0 0 40px 0' }}>How it all began</h2>
              {howItBegan.map((text, i) => (
                <p key={i} style={{ ...bodyStyle, margin: i < howItBegan.length - 1 ? '0 0 20px 0' : 0 }}>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 1024px) {
            .about-began-grid { grid-template-columns: 1fr !important; margin-left: 0 !important; }
          }
          @media (max-width: 1024px) {
            .about-vision { font-size: 64px !important; }
          }
          @media (max-width: 767px) {
            .about-vision { font-size: 36px !important; }
            .about-split h1, .about-began-grid h2 {
              font-size: 28px !important;
            }
            .about-split p, .about-began-grid p {
              font-size: 18px !important;
              line-height: 30px !important;
            }
          }
        ` }} />
      </section>

      {/* 4. OUR JOURNEY (live: horizontal timeline carousel with dotted axis, year label, description and photo) */}
      <section className={styles.journeySection}>
        <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <JourneyCarousel milestones={journeyMilestones} />
        </div>
      </section>

      {/* 5. TEAM (live: photo cards with bottom caption; hovering reveals bio + LinkedIn) */}
      <section id="team" className={styles.teamSection}>
        <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className={styles.teamIntro}>
            <h2 className={styles.teamTitle}>{'A team you\u2019ll be proud to call your own'}</h2>
            <p className={styles.teamSubtitle}>
              Our team is based across multiple locations in India and other geographies. We are on a
              shared journey to make businesses bring about change for the better.
            </p>
          </div>

          <TeamGrid members={teamCards} />
        </div>
      </section>

      {/* 6. FULL BIOS FOR SEO (visually hidden, server-rendered: the live page
          keeps every bio in the HTML, so search engines can index them even
          though the build shows them in the click-to-open profile modal) */}
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
        aria-hidden="true"
      >
        {teamCards.map((member) => (
          <div key={member.slug || member.name}>
            <h3>{member.name}</h3>
            {member.bioText && <p>{member.bioText}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
