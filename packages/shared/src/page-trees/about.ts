import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  makeDynamicModule,
  assembleTree,
  resolveCmsImage,
} from './utils';

const JOURNEY_MILESTONES = [
  { year: '2018', month: 'June', img: '/images/journey-2018.webp', desc: 'Envint starts in Mumbai with two founding Partners' },
  { year: '2019', month: '', img: '/images/journey-2019.webp', desc: 'Few ESG engagements and knowledge partnerships' },
  { year: '2020', month: '', img: '/images/journey-2020.webp', desc: 'COVID, lockdowns, changed world, first ESG due diligence' },
  { year: '2021', month: '', img: '/images/journey-2021.webp', desc: 'RI Head joins, first client on sustainability, team crosses double digits, first off-site' },
  { year: '2022', month: '', img: '/images/journey-2022.webp', desc: 'Expands to four offices across India, team crosses 20, number of clients touch 50' },
  { year: '2023', month: '', img: '/images/journey-2023.webp', desc: 'New themes in ESG, multiple DFI mandates, seeds of international expansion' },
  { year: '2024', month: '', img: '/images/journey-2024.webp', desc: '6 years of creating impact, client roster crosses 100 with 300+ engagements' },
];

export function createAboutPageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_about_hero',
    'sec_about_purpose',
    'sec_about_founders',
    'sec_about_journey',
    'sec_about_team',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Section ────────────────────────────────────────────────────────
    sec_about_hero: makeSection(
      'sec_about_hero',
      ['cont_about_hero'],
      {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: '150px',
        paddingBottom: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundImage: resolveCmsImage('/images/about-hero.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0) 65%)',
      },
      'About Hero Banner',
      {
        tablet: { minHeight: '80vh', paddingBottom: '56px', paddingTop: '100px' },
        mobile: { minHeight: '65vh', paddingBottom: '42px', paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px' },
      }
    ),
    cont_about_hero: makeContainer(
      'cont_about_hero',
      'sec_about_hero',
      ['h1_about_hero'],
      {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Hero Content'
    ),
    h1_about_hero: makeHeading(
      'h1_about_hero',
      'cont_about_hero',
      'Our vision for the future is one that’s better',
      'h1',
      {
        fontSize: '76px',
        maxWidth: '1000px',
        textColor: '#FFFFFF',
        lineHeight: '1.15',
        fontWeight: 400,
        fontFamily: 'Neue Montreal, sans-serif',
        textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
        margin: '0',
      },
      {
        tablet: { fontSize: '64px' },
        mobile: { fontSize: '36px', lineHeight: '1.25' },
      },
      'Hero Headline'
    ),

    // ─── 2. About Envint (Vision & Purpose) ───────────────────────────────────
    sec_about_purpose: makeSection(
      'sec_about_purpose',
      ['cont_about_purpose'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '100px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'About Envint Section',
      {
        tablet: { paddingTop: '60px', paddingBottom: '60px' },
        mobile: { paddingTop: '40px', paddingBottom: '40px' },
      }
    ),
    cont_about_purpose: makeContainer(
      'cont_about_purpose',
      'sec_about_purpose',
      ['grid_about_purpose'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'About Content Wrapper'
    ),
    grid_about_purpose: makeGrid(
      'grid_about_purpose',
      'cont_about_purpose',
      ['col1_purpose', 'col2_purpose'],
      {
        gridColumns: 'minmax(0, 420px) minmax(0, 1fr)',
        gap: '64px',
        alignItems: 'flex-start',
      },
      '2-Column Split',
      {
        tablet: { gridColumns: '1fr', gap: '32px' },
        mobile: { gridColumns: '1fr', gap: '24px' },
      }
    ),
    col1_purpose: makeContainer(
      'col1_purpose',
      'grid_about_purpose',
      ['h2_purpose'],
      {},
      'Left Column'
    ),
    h2_purpose: makeHeading(
      'h2_purpose',
      'col1_purpose',
      'About Envint',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        fontFamily: 'Neue Montreal, sans-serif',
        margin: '0',
      },
      {
        mobile: { fontSize: '32px' },
      },
      'Main Heading'
    ),
    col2_purpose: makeContainer(
      'col2_purpose',
      'grid_about_purpose',
      ['p1_purpose', 'p2_purpose', 'p3_purpose'],
      {},
      'Right Column'
    ),
    p1_purpose: makeParagraph(
      'p1_purpose',
      'col2_purpose',
      'Envint is a sustainability and ESG solutions firm, founded with a purpose to shape a more liveable planet for the coming generations.',
      {
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '28px',
      },
      { mobile: { fontSize: '18px', lineHeight: '28px' } },
      'Intro Paragraph 1'
    ),
    p2_purpose: makeParagraph(
      'p2_purpose',
      'col2_purpose',
      'Our mission is to drive sustainability into mainstream thought and action, with the belief that ‘green makes sense beyond conscience’.',
      {
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '28px',
      },
      { mobile: { fontSize: '18px', lineHeight: '28px' } },
      'Intro Paragraph 2'
    ),
    p3_purpose: makeParagraph(
      'p3_purpose',
      'col2_purpose',
      'We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.',
      {
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '0',
      },
      { mobile: { fontSize: '18px', lineHeight: '28px' } },
      'Intro Paragraph 3'
    ),

    // ─── 3. How It All Began ──────────────────────────────────────────────────
    sec_about_founders: makeSection(
      'sec_about_founders',
      ['cont_about_founders'],
      {
        backgroundColor: '#F7F7F7',
        paddingTop: '80px',
        paddingBottom: '100px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'How It Began Section',
      {
        tablet: { paddingTop: '60px', paddingBottom: '60px' },
        mobile: { paddingTop: '40px', paddingBottom: '40px' },
      }
    ),
    cont_about_founders: makeContainer(
      'cont_about_founders',
      'sec_about_founders',
      ['grid_about_founders'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Founders Container'
    ),
    grid_about_founders: makeGrid(
      'grid_about_founders',
      'cont_about_founders',
      ['col1_founders', 'col2_founders'],
      {
        gridColumns: 'minmax(0, 520px) minmax(0, 1fr)',
        gap: '64px',
        alignItems: 'center',
        width: '100%',
      },
      'Founders Split Grid',
      {
        tablet: { gridColumns: '1fr', gap: '36px' },
        mobile: { gridColumns: '1fr', gap: '24px' },
      }
    ),
    col1_founders: makeContainer(
      'col1_founders',
      'grid_about_founders',
      ['img_founders'],
      {},
      'Founders Photo Column'
    ),
    img_founders: makeImage(
      'img_founders',
      'col1_founders',
      resolveCmsImage('/images/founders-anand-manish.webp'),
      'Envint Co-Founders Anand Krishnamurthy and Manish R Jain',
      {
        borderRadius: '16px',
        width: '100%',
        objectFit: 'cover',
      },
      'Founders Photo'
    ),
    col2_founders: makeContainer(
      'col2_founders',
      'grid_about_founders',
      ['h2_founders', 'p1_founders', 'p2_founders'],
      {},
      'Founders Story Column'
    ),
    h2_founders: makeHeading(
      'h2_founders',
      'col2_founders',
      'How it all began',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        fontFamily: 'Neue Montreal, sans-serif',
        margin: '0 0 32px 0',
      },
      { mobile: { fontSize: '32px' } },
      'Founders Headline'
    ),
    p1_founders: makeParagraph(
      'p1_founders',
      'col2_founders',
      'A deep conviction to create an impact in the environment sector, steadfast encouragement from family &amp; friends and a few coffee shop meetings was all it took Anand and Manish to start Envint in June 2018. They derive their inspiration from India’s innate wisdom on sustainable living, that is in harmony with nature and its creations.',
      {
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        margin: '0 0 24px 0',
      },
      { mobile: { fontSize: '18px', lineHeight: '28px' } },
      'Founders Story 1'
    ),
    p2_founders: makeParagraph(
      'p2_founders',
      'col2_founders',
      'Envint is a portmanteau of ‘environment’ and ‘intelligence’ and an anagram of ‘invent’, reflecting a new approach to business. Initially conceived to provide intelligence for the environment sector, Envint has broadened its ambit to include the wider sustainability domain.',
      {
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        margin: '0',
      },
      { mobile: { fontSize: '18px', lineHeight: '28px' } },
      'Founders Story 2'
    ),

    // ─── 4. Journey Timeline Carousel ─────────────────────────────────────────
    sec_about_journey: makeSection(
      'sec_about_journey',
      ['cont_about_journey'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '100px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'Our Journey Section',
      {
        tablet: { paddingTop: '60px', paddingBottom: '60px' },
        mobile: { paddingTop: '40px', paddingBottom: '40px' },
      }
    ),
    cont_about_journey: makeContainer(
      'cont_about_journey',
      'sec_about_journey',
      ['mod_about_journey'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Journey Container'
    ),
    mod_about_journey: {
      id: 'mod_about_journey',
      type: 'journey-carousel',
      name: 'Our Journey Carousel',
      parentId: 'cont_about_journey',
      children: [],
      content: { title: 'Our Journey', milestones: JOURNEY_MILESTONES },
      styles: { width: '100%' },
      visibility: { desktop: true, tablet: true, mobile: true },
    },

    // ─── 5. Leadership Team Grid ──────────────────────────────────────────────
    sec_about_team: makeSection(
      'sec_about_team',
      ['cont_about_team'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '120px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'Leadership Team Section',
      {
        tablet: { paddingTop: '60px', paddingBottom: '60px' },
        mobile: { paddingTop: '40px', paddingBottom: '40px' },
      }
    ),
    cont_about_team: makeContainer(
      'cont_about_team',
      'sec_about_team',
      ['h2_team', 'p_team', 'mod_team_grid'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Team Container'
    ),
    h2_team: makeHeading(
      'h2_team',
      'cont_about_team',
      "A team you'll be proud to call your own",
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        fontFamily: 'Neue Montreal, sans-serif',
        margin: '0 0 20px 0',
      },
      { mobile: { fontSize: '32px' } },
      'Team Headline'
    ),
    p_team: makeParagraph(
      'p_team',
      'cont_about_team',
      'Our team is based across multiple locations in India and other geographies. We are on a shared journey to make businesses bring about change for the better.',
      {
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '52px',
        maxWidth: '950px',
      },
      { mobile: { fontSize: '18px', lineHeight: '28px' } },
      'Team Subtext'
    ),
    mod_team_grid: makeDynamicModule(
      'mod_team_grid',
      'team-grid',
      'Team Members Grid',
      'cont_about_team',
      {},
      { initialCount: 12 },
    ),
  };

  return assembleTree(rootIds, nodes);
}
