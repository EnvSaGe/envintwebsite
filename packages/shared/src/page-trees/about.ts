import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeBadge,
  makeButton,
  makeDynamicModule,
  assembleTree,
  resolveCmsImage,
} from './utils';

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
      'Hero Section',
      ['cont_about_hero'],
      {
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: '160px',
        paddingBottom: '90px',
        backgroundImage: `url(${resolveCmsImage('/images/about-hero.webp')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay: 'linear-gradient(to top, rgba(0, 46, 32, 0.88) 0%, rgba(0, 46, 32, 0.35) 100%)',
      }
    ),
    cont_about_hero: makeContainer(
      'cont_about_hero',
      'Hero Content',
      'sec_about_hero',
      ['badge_about_hero', 'h1_about_hero'],
      {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }
    ),
    badge_about_hero: makeBadge(
      'badge_about_hero',
      'Hero Tagline',
      'cont_about_hero',
      'ABOUT ENVINT',
      {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        textColor: '#FBF4EB',
      }
    ),
    h1_about_hero: makeHeading(
      'h1_about_hero',
      'Hero Headline',
      'cont_about_hero',
      'Our vision for the future is one that’s better',
      'h1',
      {
        fontSize: '76px',
        textColor: '#FBF4EB',
        lineHeight: '1.15',
        margin: '0',
      },
      {
        tablet: { fontSize: '52px' },
        mobile: { fontSize: '34px', lineHeight: '1.25' },
      }
    ),

    // ─── 2. About Envint (Vision & Purpose) ───────────────────────────────────
    sec_about_purpose: makeSection(
      'sec_about_purpose',
      'About Envint (2-Col)',
      ['cont_about_purpose'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '100px',
      }
    ),
    cont_about_purpose: makeContainer(
      'cont_about_purpose',
      'About Content Wrapper',
      'sec_about_purpose',
      ['grid_about_purpose']
    ),
    grid_about_purpose: makeGrid(
      'grid_about_purpose',
      '2-Column Split',
      'cont_about_purpose',
      ['col1_purpose', 'col2_purpose'],
      {
        gridColumns: 'minmax(0, 460px) minmax(0, 1fr)',
        gap: '64px',
        alignItems: 'flex-start',
      },
      {
        tablet: { gridColumns: '1fr', gap: '32px' },
      }
    ),
    col1_purpose: makeContainer(
      'col1_purpose',
      'Left Column',
      'grid_about_purpose',
      ['h2_purpose']
    ),
    h2_purpose: makeHeading(
      'h2_purpose',
      'Main Heading',
      'col1_purpose',
      'About Envint',
      'h2',
      { fontSize: '48px' }
    ),
    col2_purpose: makeContainer(
      'col2_purpose',
      'Right Column',
      'grid_about_purpose',
      ['p1_purpose', 'p2_purpose', 'p3_purpose']
    ),
    p1_purpose: makeParagraph(
      'p1_purpose',
      'Intro Paragraph 1',
      'col2_purpose',
      'Envint is a sustainability and ESG solutions firm, founded with a purpose to shape a more liveable planet for the coming generations.',
      { fontSize: '24px', lineHeight: '35px' }
    ),
    p2_purpose: makeParagraph(
      'p2_purpose',
      'Intro Paragraph 2',
      'col2_purpose',
      'Our mission is to drive sustainability into mainstream thought and action, with the belief that ‘green makes sense beyond conscience’.',
      { fontSize: '24px', lineHeight: '35px' }
    ),
    p3_purpose: makeParagraph(
      'p3_purpose',
      'Intro Paragraph 3',
      'col2_purpose',
      'We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.',
      { fontSize: '24px', lineHeight: '35px' }
    ),

    // ─── 3. How It All Began ──────────────────────────────────────────────────
    sec_about_founders: makeSection(
      'sec_about_founders',
      'How It Began (Founders Story)',
      ['cont_about_founders'],
      {
        backgroundColor: '#F7F7F7',
        paddingTop: '80px',
        paddingBottom: '100px',
      }
    ),
    cont_about_founders: makeContainer(
      'cont_about_founders',
      'Founders Container',
      'sec_about_founders',
      ['grid_about_founders']
    ),
    grid_about_founders: makeGrid(
      'grid_about_founders',
      'Founders Split Grid',
      'cont_about_founders',
      ['col1_founders', 'col2_founders'],
      {
        gridColumns: 'minmax(0, 520px) minmax(0, 1fr)',
        gap: '60px',
        alignItems: 'center',
      },
      {
        tablet: { gridColumns: '1fr', gap: '36px' },
      }
    ),
    col1_founders: makeContainer(
      'col1_founders',
      'Founders Photo Column',
      'grid_about_founders',
      ['img_founders']
    ),
    img_founders: makeImage(
      'img_founders',
      'Founders Photo',
      'col1_founders',
      '/images/founders-anand-manish.webp',
      'Envint Co-Founders Anand Krishnamurthy and Manish R Jain',
      {
        borderRadius: '16px',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
      }
    ),
    col2_founders: makeContainer(
      'col2_founders',
      'Founders Story Column',
      'grid_about_founders',
      ['badge_founders', 'h2_founders', 'p1_founders', 'p2_founders']
    ),
    badge_founders: makeBadge('badge_founders', 'Founders Tagline', 'col2_founders', 'OUR GENESIS'),
    h2_founders: makeHeading(
      'h2_founders',
      'Founders Headline',
      'col2_founders',
      'How it all began',
      'h2',
      { fontSize: '42px', marginTop: '12px' }
    ),
    p1_founders: makeParagraph(
      'p1_founders',
      'Founders Story 1',
      'col2_founders',
      'A deep conviction to create an impact in the environment sector, steadfast encouragement from family & friends and a few coffee shop meetings was all it took Anand and Manish to start Envint in June 2018. They derive their inspiration from India’s innate wisdom on sustainable living, that is in harmony with nature and its creations.',
      { fontSize: '18px', lineHeight: '30px' }
    ),
    p2_founders: makeParagraph(
      'p2_founders',
      'Founders Story 2',
      'col2_founders',
      'Envint is a portmanteau of ‘environment’ and ‘intelligence’ and an anagram of ‘invent’, reflecting a new approach to business. Initially conceived to provide intelligence for the environment sector, Envint has broadened its ambit to include the wider sustainability domain.',
      { fontSize: '18px', lineHeight: '30px' }
    ),

    // ─── 4. Journey Timeline Carousel ─────────────────────────────────────────
    sec_about_journey: makeSection(
      'sec_about_journey',
      'Our Journey (Milestones Timeline)',
      ['cont_about_journey'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '100px',
      }
    ),
    cont_about_journey: makeContainer(
      'cont_about_journey',
      'Journey Container',
      'sec_about_journey',
      ['badge_journey', 'h2_journey', 'grid_journey_milestones']
    ),
    badge_journey: makeBadge('badge_journey', 'Journey Tagline', 'cont_about_journey', 'OUR PATH'),
    h2_journey: makeHeading(
      'h2_journey',
      'Journey Headline',
      'cont_about_journey',
      'Our Journey',
      'h2',
      { fontSize: '44px', marginTop: '12px', marginBottom: '36px' }
    ),
    grid_journey_milestones: makeGrid(
      'grid_journey_milestones',
      'Milestones Grid',
      'cont_about_journey',
      ['card_m2018', 'card_m2020', 'card_m2022', 'card_m2024'],
      {
        gridColumns: 'repeat(4, 1fr)',
        gap: '20px',
      },
      {
        tablet: { gridColumns: 'repeat(2, 1fr)' },
        mobile: { gridColumns: '1fr' },
      }
    ),

    // Milestone 2018
    card_m2018: makeContainer(
      'card_m2018',
      'Milestone 2018',
      'grid_journey_milestones',
      ['img_m2018', 'h4_m2018', 'p_m2018'],
      {
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        paddingTop: '16px',
        paddingBottom: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }
    ),
    img_m2018: makeImage('img_m2018', '2018 Image', 'card_m2018', '/images/journey-2018.webp', '2018 Milestone', { height: '140px', marginBottom: '12px' }),
    h4_m2018: makeHeading('h4_m2018', '2018 Year', 'card_m2018', '2018 · June', 'h4', { fontSize: '20px', margin: '0 0 8px 0', textColor: '#004E35' }),
    p_m2018: makeParagraph('p_m2018', '2018 Text', 'card_m2018', 'Envint starts in Mumbai with two founding Partners.', { fontSize: '15px', lineHeight: '22px' }),

    // Milestone 2020
    card_m2020: makeContainer(
      'card_m2020',
      'Milestone 2020',
      'grid_journey_milestones',
      ['img_m2020', 'h4_m2020', 'p_m2020'],
      {
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        paddingTop: '16px',
        paddingBottom: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }
    ),
    img_m2020: makeImage('img_m2020', '2020 Image', 'card_m2020', '/images/journey-2020.webp', '2020 Milestone', { height: '140px', marginBottom: '12px' }),
    h4_m2020: makeHeading('h4_m2020', '2020 Year', 'card_m2020', '2020', 'h4', { fontSize: '20px', margin: '0 0 8px 0', textColor: '#004E35' }),
    p_m2020: makeParagraph('p_m2020', '2020 Text', 'card_m2020', 'COVID, lockdowns, changed world, first ESG due diligence delivered.', { fontSize: '15px', lineHeight: '22px' }),

    // Milestone 2022
    card_m2022: makeContainer(
      'card_m2022',
      'Milestone 2022',
      'grid_journey_milestones',
      ['img_m2022', 'h4_m2022', 'p_m2022'],
      {
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        paddingTop: '16px',
        paddingBottom: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }
    ),
    img_m2022: makeImage('img_m2022', '2022 Image', 'card_m2022', '/images/journey-2022.webp', '2022 Milestone', { height: '140px', marginBottom: '12px' }),
    h4_m2022: makeHeading('h4_m2022', '2022 Year', 'card_m2022', '2022', 'h4', { fontSize: '20px', margin: '0 0 8px 0', textColor: '#004E35' }),
    p_m2022: makeParagraph('p_m2022', '2022 Text', 'card_m2022', 'Expands to four offices across India, team crosses 20, clients touch 50.', { fontSize: '15px', lineHeight: '22px' }),

    // Milestone 2024
    card_m2024: makeContainer(
      'card_m2024',
      'Milestone 2024',
      'grid_journey_milestones',
      ['img_m2024', 'h4_m2024', 'p_m2024'],
      {
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        paddingTop: '16px',
        paddingBottom: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }
    ),
    img_m2024: makeImage('img_m2024', '2024 Image', 'card_m2024', '/images/journey-2024.webp', '2024 Milestone', { height: '140px', marginBottom: '12px' }),
    h4_m2024: makeHeading('h4_m2024', '2024 Year', 'card_m2024', '2024 · 6 Years', 'h4', { fontSize: '20px', margin: '0 0 8px 0', textColor: '#004E35' }),
    p_m2024: makeParagraph('p_m2024', '2024 Text', 'card_m2024', '6 years of creating impact, client roster crosses 100 with 300+ engagements.', { fontSize: '15px', lineHeight: '22px' }),

    // ─── 5. Leadership Team Grid ──────────────────────────────────────────────
    sec_about_team: makeSection(
      'sec_about_team',
      'Leadership Team',
      ['cont_about_team'],
      {
        backgroundColor: '#F8FAFC',
        paddingTop: '80px',
        paddingBottom: '100px',
      }
    ),
    cont_about_team: makeContainer(
      'cont_about_team',
      'Team Container',
      'sec_about_team',
      ['badge_team', 'h2_team', 'p_team', 'mod_team_grid']
    ),
    badge_team: makeBadge('badge_team', 'Team Badge', 'cont_about_team', 'OUR PEOPLE'),
    h2_team: makeHeading(
      'h2_team',
      'Team Headline',
      'cont_about_team',
      'Meet the Leadership Team',
      'h2',
      { fontSize: '44px', marginTop: '12px' }
    ),
    p_team: makeParagraph(
      'p_team',
      'Team Subtext',
      'cont_about_team',
      'Multi-disciplinary professionals combining industry leadership, technical rigor, and deep sustainability conviction.',
      { fontSize: '18px', marginBottom: '40px' }
    ),
    mod_team_grid: makeDynamicModule('mod_team_grid', 'team-grid', 'Team Members Grid', 'cont_about_team'),
  };

  return assembleTree(rootIds, nodes);
}
