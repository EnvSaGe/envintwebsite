import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  makeCounter,
  makeDynamicModule,
  assembleTree,
  resolveCmsImage,
} from './utils';

const HELP_CARDS = [
  {
    title: 'Sustainability Integration',
    desc: 'Integrate sustainability in your core strategy & operations',
    url: '/sustainability-integration/',
  },
  {
    title: 'Responsible Investment',
    desc: 'Build ESG principles to channelize funds into responsible businesses',
    url: '/responsible-investment/',
  },
  {
    title: 'Climate Action',
    desc: 'Futureproof your organization with low-carbon transition plans',
    url: '/climate-action/',
  },
];

const ENVINT_WAY_PILLARS = [
  {
    title: 'Focused',
    img: '/images/envintway-focused.webp',
    alt: 'Focused - Magnifying glass on forest trees',
    desc: 'We are sharply focused on sustainability & ESG giving us the edge to understand the complexities associated with this domain.',
  },
  {
    title: 'Balanced',
    img: '/images/envintway-balanced.webp',
    alt: 'Balanced - Stacked balancing pebbles in nature',
    desc: 'Our approach is calibrated to be balanced and pragmatic, built on understanding of policy, regulation, markets and ground realities.',
  },
  {
    title: 'Committed',
    img: '/images/envintway-committed.webp',
    alt: 'Committed - Handshake in partnership',
    desc: 'As a young firm, we go one step further, and believe in co-owning the execution of strategy with our clients. Ownership is not a buzzword for us - our skin is in the game.',
  },
];

const IMPACT_STATS = [
  { value: '525+', label: 'Engagements', img: '/images/stat-engagements.webp' },
  { value: '150+', label: 'Clients', img: '/images/stat-clients-clean.webp' },
  { value: '10+', label: 'Countries', img: '/images/stat-countries-clean.webp' },
  { value: '6', label: 'Offices', img: '/images/stat-offices.webp' },
];

export function createHomePageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_home_hero',
    'sec_home_philosophy',
    'sec_home_vantage',
    'sec_home_services',
    'sec_home_envint_way',
    'sec_home_impact',
    'sec_home_insights',
    'sec_home_cta',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Section ────────────────────────────────────────────────────────
    sec_home_hero: makeSection(
      'sec_home_hero',
      ['cont_home_hero'],
      {
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'flex-end',
        paddingTop: '180px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundImage: resolveCmsImage('/images/hero-wetland.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 20, 15, 0.55) 0%, rgba(0, 20, 15, 0.15) 100%)',
      },
      'Hero Banner'
    ),
    cont_home_hero: makeContainer(
      'cont_home_hero',
      'sec_home_hero',
      ['p_home_hero_title', 'h1_home_hero'],
      {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Hero Container'
    ),
    p_home_hero_title: makeParagraph(
      'p_home_hero_title',
      'cont_home_hero',
      '<p>Business for Better.<br/>Making it happen</p>',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '76px',
        lineHeight: '1.08',
        textColor: '#FFFFFF',
        marginBottom: '0',
      },
      {
        tablet: { fontSize: '52px' },
        mobile: { fontSize: '32px' },
      },
      'Hero Tagline'
    ),
    h1_home_hero: makeHeading(
      'h1_home_hero',
      'cont_home_hero',
      'We help clients integrate sustainability, channelize responsible investment and enable climate action.',
      'h1',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '32px',
        fontWeight: 400,
        lineHeight: '1.25',
        textColor: '#FFFFFF',
        marginBottom: '0',
        maxWidth: '980px',
      },
      {
        tablet: { fontSize: '24px' },
        mobile: { fontSize: '16px' },
      },
      'Hero Headline'
    ),

    // ─── 2. Philosophy Statement ────────────────────────────────────────────────
    sec_home_philosophy: makeSection(
      'sec_home_philosophy',
      ['cont_home_philosophy'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '60px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      'Philosophy Statement'
    ),
    cont_home_philosophy: makeContainer(
      'cont_home_philosophy',
      'sec_home_philosophy',
      ['phil_p1', 'phil_p2', 'phil_p3', 'phil_link'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        paddingRight: '5%',
      },
      'Philosophy Container'
    ),
    phil_p1: makeParagraph(
      'phil_p1',
      'cont_home_philosophy',
      '<p>From the air we breathe and the water we drink to the future we want, the desire for better touches us all.</p>',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        marginBottom: '35px',
      },
      {
        mobile: { fontSize: '17px', lineHeight: '25px', marginBottom: '20px' },
      },
      'Philosophy Line 1'
    ),
    phil_p2: makeParagraph(
      'phil_p2',
      'cont_home_philosophy',
      '<p>Better is inspiring and limitless, constrained only by the laws of nature.</p>',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        marginBottom: '35px',
      },
      {
        mobile: { fontSize: '17px', lineHeight: '25px', marginBottom: '20px' },
      },
      'Philosophy Line 2'
    ),
    phil_p3: makeParagraph(
      'phil_p3',
      'cont_home_philosophy',
      '<p>Being sustainable is no longer optional – the future belongs to businesses that go for better.</p>',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        marginBottom: '20px',
      },
      {
        mobile: { fontSize: '17px', lineHeight: '25px' },
      },
      'Philosophy Line 3'
    ),
    phil_link: makeButton(
      'phil_link',
      'cont_home_philosophy',
      'Explore more',
      '/services/',
      'primary',
      {
        backgroundColor: 'transparent',
        textColor: '#8C8C8C',
        fontSize: '24px',
        fontWeight: 400,
        paddingTop: '0',
        paddingBottom: '10px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        width: 'fit-content',
      },
      'Explore More Link'
    ),

    // ─── 3. Featured Publication Spotlight (Vantage 2026) ───────────────────────
    sec_home_vantage: makeSection(
      'sec_home_vantage',
      ['cont_home_vantage'],
      {
        backgroundColor: '#F7F7F7',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      'Featured Publication Spotlight'
    ),
    cont_home_vantage: makeContainer(
      'cont_home_vantage',
      'sec_home_vantage',
      ['grid_home_vantage'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Vantage Container'
    ),
    grid_home_vantage: makeGrid(
      'grid_home_vantage',
      'cont_home_vantage',
      '2',
      '86px',
      ['img_vantage', 'col_vantage_info'],
      { gridColumns: 'minmax(0, 635fr) minmax(0, 465fr)', alignItems: 'center' },
      {
        tablet: { gridColumns: '1fr' },
      }
    ),
    img_vantage: makeImage(
      'img_vantage',
      'grid_home_vantage',
      resolveCmsImage('/images/vantage-2026.webp'),
      'Vantage 2026: Navigating the ESG Reset - Envint Publication',
      { width: '100%', borderRadius: '20px' },
      'Vantage Report Cover'
    ),
    col_vantage_info: makeContainer(
      'col_vantage_info',
      'grid_home_vantage',
      ['h2_vantage', 'p_vantage', 'vantage_links'],
      { display: 'flex', flexDirection: 'column' },
      'Vantage Info Column'
    ),
    h2_vantage: makeHeading(
      'h2_vantage',
      'col_vantage_info',
      'Vantage 2026: Navigating the ESG Reset',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '20px',
      },
      {
        mobile: { fontSize: '28px' },
      },
      'Vantage Headline'
    ),
    p_vantage: makeParagraph(
      'p_vantage',
      'col_vantage_info',
      '<p>Trade tensions, geopolitical conflicts, and supply chain disruptions continue to reshape business priorities, while sustainability in India continues to gain traction. Our publication explores the evolving ESG agenda, macroeconomic challenges for businesses and how organizations in India can respond in this context. Drawing on policy and regulatory developments, market insights, and client experience, Vantage helps businesses navigate a changing ESG landscape and focus on what matters most.</p>',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        marginBottom: '35px',
      },
      {
        mobile: { fontSize: '18px', lineHeight: '25px' },
      },
      'Vantage Description'
    ),
    vantage_links: makeContainer(
      'vantage_links',
      'col_vantage_info',
      ['btn_vantage_read', 'btn_vantage_2025'],
      {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      },
      'Vantage Links Row'
    ),
    btn_vantage_read: makeButton(
      'btn_vantage_read',
      'vantage_links',
      'Read now',
      '/envision/',
      'primary',
      {
        backgroundColor: 'transparent',
        textColor: '#1E88D2',
        fontSize: '24px',
        fontWeight: 400,
        paddingTop: '0',
        paddingBottom: '10px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        width: 'fit-content',
      },
      'Read Now Link'
    ),
    btn_vantage_2025: makeButton(
      'btn_vantage_2025',
      'vantage_links',
      'Click here to read Vantage 2025',
      '/media/uploads/Envint-Vantage-ESG-Reset.pdf',
      'primary',
      {
        backgroundColor: 'transparent',
        textColor: '#1E88D2',
        fontSize: '24px',
        fontWeight: 400,
        paddingTop: '0',
        paddingBottom: '10px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        width: 'fit-content',
      },
      'Vantage 2025 Link'
    ),

    // ─── 4. We help you with ... ────────────────────────────────────────────────
    sec_home_services: makeSection(
      'sec_home_services',
      ['cont_home_services'],
      {
        paddingTop: '120px',
        paddingBottom: '120px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundImage: resolveCmsImage('/images/polo-mountain-bg.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.25) 100%)',
      },
      'We Help You With Section'
    ),
    cont_home_services: makeContainer(
      'cont_home_services',
      'sec_home_services',
      ['h2_home_services', 'grid_home_services'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Services Container'
    ),
    h2_home_services: makeHeading(
      'h2_home_services',
      'cont_home_services',
      'We help you with ...',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '60px',
        fontWeight: 400,
        textColor: '#FFFFFF',
        marginBottom: '48px',
        textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)',
      },
      {
        tablet: { fontSize: '44px' },
        mobile: { fontSize: '32px' },
      },
      'Services Heading'
    ),
    grid_home_services: makeGrid(
      'grid_home_services',
      'cont_home_services',
      '3',
      '24px',
      HELP_CARDS.map((_, i) => `card_help_${i + 1}`),
      {},
      {
        tablet: { gridColumns: '1fr' },
      }
    ),

    // ─── 5. #TheEnvintWay ───────────────────────────────────────────────────────
    sec_home_envint_way: makeSection(
      'sec_home_envint_way',
      ['cont_home_envint_way'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      'The Envint Way Section'
    ),
    cont_home_envint_way: makeContainer(
      'cont_home_envint_way',
      'sec_home_envint_way',
      ['h2_envint_way', 'p_envint_way', 'grid_envint_way'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Envint Way Container'
    ),
    h2_envint_way: makeHeading(
      'h2_envint_way',
      'cont_home_envint_way',
      '#TheEnvintWay',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '16px',
      },
      {
        mobile: { fontSize: '28px' },
      },
      'Envint Way Headline'
    ),
    p_envint_way: makeParagraph(
      'p_envint_way',
      'cont_home_envint_way',
      '<p>Our mission is to drive sustainability into mainstream thought and action, with the belief that <em>‘green makes sense beyond conscience’</em>.</p>',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        marginBottom: '50px',
      },
      {
        mobile: { fontSize: '18px', lineHeight: '25px' },
      },
      'Envint Way Mission'
    ),
    grid_envint_way: makeGrid(
      'grid_envint_way',
      'cont_home_envint_way',
      '3',
      '24px',
      ENVINT_WAY_PILLARS.map((_, i) => `pillar_${i + 1}`),
      { justifyContent: 'space-between' },
      {
        tablet: { gridColumns: '1fr' },
      }
    ),

    // ─── 6. Our Impact & Stats ──────────────────────────────────────────────────
    sec_home_impact: makeSection(
      'sec_home_impact',
      ['cont_home_impact'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: '#F1F5F9',
      },
      'Our Impact Section'
    ),
    cont_home_impact: makeContainer(
      'cont_home_impact',
      'sec_home_impact',
      ['h2_impact', 'p_impact', 'grid_stats'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Impact Container'
    ),
    h2_impact: makeHeading(
      'h2_impact',
      'cont_home_impact',
      'Our Impact',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '16px',
      },
      {
        mobile: { fontSize: '28px' },
      },
      'Impact Headline'
    ),
    p_impact: makeParagraph(
      'p_impact',
      'cont_home_impact',
      '<p>From India’s leading companies to global MNCs, from DFIs to PE and VC funds, we work with a diverse clientele across multiple geographies.</p>',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '35px',
        textColor: '#393939',
        marginBottom: '50px',
      },
      {
        mobile: { fontSize: '18px', lineHeight: '25px' },
      },
      'Impact Description'
    ),
    grid_stats: makeGrid(
      'grid_stats',
      'cont_home_impact',
      '4',
      '24px',
      IMPACT_STATS.map((_, i) => `stat_${i + 1}`),
      {},
      {
        tablet: { gridColumns: 'repeat(2, 1fr)' },
        mobile: { gridColumns: '1fr' },
      }
    ),

    // ─── 7. Read News and Insights ──────────────────────────────────────────────
    sec_home_insights: makeSection(
      'sec_home_insights',
      ['cont_home_insights'],
      {
        backgroundColor: '#F8FAFC',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: '#EEF2F6',
      },
      'Read News and Insights Section'
    ),
    cont_home_insights: makeContainer(
      'cont_home_insights',
      'sec_home_insights',
      ['h2_insights', 'mod_insights'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Insights Container'
    ),
    h2_insights: makeHeading(
      'h2_insights',
      'cont_home_insights',
      'Read news and insights',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '40px',
      },
      {
        mobile: { fontSize: '28px' },
      },
      'Insights Headline'
    ),
    mod_insights: makeDynamicModule(
      'mod_insights',
      'cont_home_insights',
      'insights-grid',
      {},
      'Latest Insights Grid'
    ),

    // ─── 8. Pre-Footer CTA ──────────────────────────────────────────────────────
    sec_home_cta: makeSection(
      'sec_home_cta',
      ['cont_home_cta'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '50px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      'Bottom Call to Action'
    ),
    cont_home_cta: makeContainer(
      'cont_home_cta',
      'sec_home_cta',
      ['card_home_cta'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'CTA Container'
    ),
    card_home_cta: makeContainer(
      'card_home_cta',
      'cont_home_cta',
      ['h2_cta', 'btn_cta'],
      {
        backgroundImage: resolveCmsImage('/images/footer-cta.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay: 'rgba(0, 0, 0, 0.25)',
        borderRadius: '20px',
        paddingTop: '60px',
        paddingBottom: '60px',
        paddingLeft: '30px',
        paddingRight: '30px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        minHeight: '360px',
      },
      'CTA Banner Card'
    ),
    h2_cta: makeHeading(
      'h2_cta',
      'card_home_cta',
      'Let us move towards a greener future',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#FFFFFF',
        lineHeight: '1.25',
        textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
        marginBottom: '0',
      },
      {
        mobile: { fontSize: '28px' },
      },
      'CTA Headline'
    ),
    btn_cta: makeButton(
      'btn_cta',
      'card_home_cta',
      'Connect',
      '/connect/',
      'primary',
      {
        backgroundColor: '#FFFFFF',
        textColor: '#004E35',
        fontSize: '20px',
        fontWeight: 500,
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '36px',
        paddingRight: '36px',
        borderRadius: '9999px',
        width: 'fit-content',
      },
      'CTA Connect Button'
    ),
  };

  // Populate "We help you with ..." cards
  HELP_CARDS.forEach((c, idx) => {
    const cardId = `card_help_${idx + 1}`;
    const titleId = `help_title_${idx + 1}`;
    const descId = `help_desc_${idx + 1}`;
    const btnId = `help_btn_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_home_services',
      [titleId, descId, btnId],
      {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        paddingTop: '32px',
        paddingBottom: '28px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      `${c.title} Card`
    );

    nodes[titleId] = makeHeading(
      titleId,
      cardId,
      c.title,
      'h3',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '28px',
        fontWeight: 500,
        textColor: '#C65102',
        marginBottom: '12px',
      },
      `${c.title} Title`
    );

    nodes[descId] = makeParagraph(
      descId,
      cardId,
      `<p>${c.desc}</p>`,
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '30px',
        textColor: '#484848',
        marginBottom: '16px',
      },
      {
        mobile: { fontSize: '18px', lineHeight: '24px' },
      },
      `${c.title} Description`
    );

    nodes[btnId] = makeButton(
      btnId,
      cardId,
      'Explore',
      c.url,
      'primary',
      {
        backgroundColor: 'transparent',
        textColor: '#1E88D2',
        fontSize: '18px',
        fontWeight: 500,
        paddingTop: '0',
        paddingBottom: '6px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        width: 'fit-content',
      },
      `${c.title} Link`
    );
  });

  // Populate #TheEnvintWay pillars
  ENVINT_WAY_PILLARS.forEach((p, idx) => {
    const cardId = `pillar_${idx + 1}`;
    const imgId = `pillar_img_${idx + 1}`;
    const titleId = `pillar_title_${idx + 1}`;
    const descId = `pillar_desc_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_envint_way',
      [imgId, titleId, descId],
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      },
      `${p.title} Pillar`
    );

    nodes[imgId] = makeImage(
      imgId,
      cardId,
      resolveCmsImage(p.img),
      p.alt,
      {
        width: '100%',
        maxWidth: '310px',
        aspectRatio: '1/1',
        borderRadius: '20px',
        objectFit: 'cover',
        marginBottom: '20px',
      },
      `${p.title} Image`
    );

    nodes[titleId] = makeHeading(
      titleId,
      cardId,
      p.title,
      'h3',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        fontWeight: 400,
        textColor: '#5A5A5A',
        marginBottom: '14px',
      },
      `${p.title} Title`
    );

    nodes[descId] = makeParagraph(
      descId,
      cardId,
      `<p>${p.desc}</p>`,
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '18px',
        lineHeight: '26px',
        textColor: '#5A5A5A',
        marginBottom: '0',
      },
      `${p.title} Description`
    );
  });

  // Populate Impact stats counters
  IMPACT_STATS.forEach((s, idx) => {
    const statId = `stat_${idx + 1}`;
    nodes[statId] = makeCounter(statId, `Stat ${idx + 1}`, 'grid_stats', s.value, s.label, {
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: '#D9D9D9',
      paddingLeft: '18px',
    });
  });

  return assembleTree(rootIds, nodes);
}
