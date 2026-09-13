import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  assembleTree,
  resolveCmsImage,
} from './utils';

const SECTORS_LIST = [
  { name: 'Infrastructure & Real Estate', slug: 'infra-real-estate', img: '/images/sector-infra.webp' },
  { name: 'Manufacturing', slug: null, img: '/images/sector-manufacturing.webp' },
  { name: 'Energy', slug: 'energy', img: '/images/sector-energy.webp' },
  { name: 'Agriculture', slug: 'agriculture', img: '/images/sector-agriculture.webp' },
  { name: 'BFSI', slug: 'bfsi', img: '/images/sector-bfsi.webp' },
  { name: 'Mining', slug: 'metals-mining', img: '/images/sector-mining.webp' },
  { name: 'Healthcare', slug: 'healthcare', img: '/images/sector-healthcare.webp' },
  { name: 'Technology', slug: 'technology', img: '/images/sector-tech.webp' },
];

const THEMES_LIST = [
  { name: 'Supply Chain', slug: 'sustainable-supply-chain', img: '/images/theme-supply-chain.webp' },
  { name: 'DEI', slug: null, img: '/images/theme-dei.webp' },
  { name: 'BHR', slug: 'bhr', img: '/images/theme-bhr.webp' },
  { name: 'Biodiversity', slug: null, img: '/images/theme-biodiversity.webp' },
  { name: 'Circular Economy', slug: 'circular-economy', img: '/images/theme-circular.webp' },
  { name: 'Built Environment', slug: null, img: '/images/theme-built-environment.webp' },
  { name: 'Sustainable Finance', slug: null, img: '/images/theme-finance.webp' },
  { name: 'Carbon Markets', slug: null, img: '/images/theme-carbon-markets.webp' },
];

const TOOLS_LIST = [
  { name: 'EnvSaGe', tag: 'ESG Data', img: '/images/tool-envsage-v2.webp' },
  { name: 'EmCal', tag: 'GHG Assessment', img: '/images/tool-emcal-v2.webp' },
  { name: 'ADD', tag: 'Automated DD', img: '/images/tool-add-v2.webp' },
  { name: 'MapSense', tag: 'Ecosystem Scan', img: '/images/tool-mapsense-v2.webp' },
];

const PILLARS_LIST = [
  {
    title: 'Sustainability Integration',
    subtitle: 'A new way of doing business',
    slug: '/sustainability-integration',
    desc: 'Embedding ESG into corporate strategy, governance, reporting and supply chains.',
    img: '/images/services-sustainability.webp',
  },
  {
    title: 'Responsible Investment',
    subtitle: 'Green makes sense beyond conscience',
    slug: '/responsible-investment',
    desc: 'Pre-investment ESG due diligence, ESAP, and portfolio monitoring for institutional investors.',
    img: '/images/services-responsible.webp',
  },
  {
    title: 'Climate Action',
    subtitle: 'Futureproofing with low-carbon transitions',
    slug: '/climate-action',
    desc: 'Net-zero pathways, GHG accounting, science-based targets, and climate risk.',
    img: '/images/services-climate.webp',
  },
];

export function createServicesPageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_srv_hero',
    'sec_srv_value_prop',
    'sec_srv_capability',
    'sec_srv_engage',
    'sec_srv_cta',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Section (Exact live: main-services.webp, 76px H1) ─────────────
    sec_srv_hero: makeSection(
      'sec_srv_hero',
      ['cont_srv_hero'],
      {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundImage: resolveCmsImage('/images/main-services.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 46, 32, 0.85) 0%, rgba(0, 46, 32, 0.25) 60%, transparent 100%)',
      },
      'Services Hero Banner'
    ),
    cont_srv_hero: makeContainer(
      'cont_srv_hero',
      'sec_srv_hero',
      ['h1_srv_hero'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Hero Content'
    ),
    h1_srv_hero: makeHeading(
      'h1_srv_hero',
      'cont_srv_hero',
      'Helping businesses progress on sustainability goals',
      'h1',
      {
        fontSize: '76px',
        textColor: '#FFFFFF',
        fontWeight: 400,
        lineHeight: '1.15',
        fontFamily: 'Neue Montreal, sans-serif',
        maxWidth: '1000px',
        textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
        marginBottom: '0',
      },
      {
        tablet: { fontSize: '48px' },
        mobile: { fontSize: '38px' },
      },
      'Hero Headline'
    ),

    // ─── 2. Value Proposition Section ──────────────────────────────────────────
    sec_srv_value_prop: makeSection(
      'sec_srv_value_prop',
      ['cont_srv_value_prop'],
      {
        paddingTop: '70px',
        paddingBottom: '60px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Value Proposition Section'
    ),
    cont_srv_value_prop: makeContainer(
      'cont_srv_value_prop',
      'sec_srv_value_prop',
      ['p_srv_vp1', 'p_srv_vp2'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Value Prop Container'
    ),
    p_srv_vp1: makeParagraph(
      'p_srv_vp1',
      'cont_srv_value_prop',
      '<p>We partner with businesses in their sustainability journeys and help them in getting things done. Proudly homegrown, we bring a unique mix of value and pragmatism to solving client problems.</p>',
      {
        fontSize: '24px',
        lineHeight: '1.55',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '24px',
      },
      'Value Proposition Lead'
    ),
    p_srv_vp2: makeParagraph(
      'p_srv_vp2',
      'cont_srv_value_prop',
      '<p>Our success stems from expertise in global sustainability & ESG frameworks, understanding of region-specific ESG regulations, knowledge of industry-specific issues and pragmatism backed by on-field experience.</p>',
      {
        fontSize: '24px',
        lineHeight: '1.55',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Value Proposition Detail'
    ),

    // ─── 3. Capability Model & Practices Section ───────────────────────────────
    sec_srv_capability: makeSection(
      'sec_srv_capability',
      ['cont_srv_capability'],
      {
        paddingTop: '30px',
        paddingBottom: '90px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Capability Model Section'
    ),
    cont_srv_capability: makeContainer(
      'cont_srv_capability',
      'sec_srv_capability',
      [
        'h2_srv_cap',
        'p_srv_cap',
        'h3_srv_services',
        'grid_srv_pillars',
        'h3_srv_sectors',
        'grid_srv_sectors',
        'h3_srv_themes',
        'grid_srv_themes',
        'h3_srv_tools',
        'grid_srv_tools',
      ],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Capability Model Container'
    ),
    h2_srv_cap: makeHeading(
      'h2_srv_cap',
      'cont_srv_capability',
      'Our Capability Model',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '16px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Capability Model Title'
    ),
    p_srv_cap: makeParagraph(
      'p_srv_cap',
      'cont_srv_capability',
      '<p>The challenges and opportunities in sustainability are unique, emerging and complex. They not only require interdisciplinary skills but a highly collaborative approach to finding solutions and implementing them. Our tiered capability model brings together service lines, sector and thematic expertise, and proprietary tools for effective delivery.</p>',
      {
        fontSize: '22px',
        lineHeight: '1.6',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '48px',
      },
      'Capability Model Description'
    ),

    // Practices (3 Large Cards)
    h3_srv_services: makeHeading(
      'h3_srv_services',
      'cont_srv_capability',
      'Services',
      'h3',
      {
        fontSize: '40px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '28px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Services Heading'
    ),
    grid_srv_pillars: makeGrid(
      'grid_srv_pillars',
      'cont_srv_capability',
      '1',
      '24px',
      ['card_pillar_1', 'card_pillar_2', 'card_pillar_3'],
      { marginBottom: '80px' },
      'Pillars Stack'
    ),

    // Sectors Heading & Grid
    h3_srv_sectors: makeHeading(
      'h3_srv_sectors',
      'cont_srv_capability',
      'Sectors',
      'h3',
      {
        fontSize: '40px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '28px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Sectors Heading'
    ),
    grid_srv_sectors: makeGrid(
      'grid_srv_sectors',
      'cont_srv_capability',
      '4',
      '24px',
      SECTORS_LIST.map((_, i) => `card_sec_${i + 1}`),
      { marginBottom: '80px' },
      'Sectors 4-Col Grid'
    ),

    // Themes Heading & Grid
    h3_srv_themes: makeHeading(
      'h3_srv_themes',
      'cont_srv_capability',
      'Themes',
      'h3',
      {
        fontSize: '40px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '28px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Themes Heading'
    ),
    grid_srv_themes: makeGrid(
      'grid_srv_themes',
      'cont_srv_capability',
      '4',
      '24px',
      THEMES_LIST.map((_, i) => `card_thm_${i + 1}`),
      { marginBottom: '80px' },
      'Themes 4-Col Grid'
    ),

    // Tools Heading & Grid
    h3_srv_tools: makeHeading(
      'h3_srv_tools',
      'cont_srv_capability',
      'Prop Tools',
      'h3',
      {
        fontSize: '40px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '28px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Tools Heading'
    ),
    grid_srv_tools: makeGrid(
      'grid_srv_tools',
      'cont_srv_capability',
      '4',
      '24px',
      TOOLS_LIST.map((_, i) => `card_tool_${i + 1}`),
      { marginBottom: '60px' },
      'Tools 4-Col Grid'
    ),

    // ─── 4. Engage With Us ─────────────────────────────────────────────────────
    sec_srv_engage: makeSection(
      'sec_srv_engage',
      ['cont_srv_engage'],
      {
        paddingTop: '70px',
        paddingBottom: '40px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Engage With Us Section'
    ),
    cont_srv_engage: makeContainer(
      'cont_srv_engage',
      'sec_srv_engage',
      ['h2_srv_engage', 'p_srv_engage'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Engage Container'
    ),
    h2_srv_engage: makeHeading(
      'h2_srv_engage',
      'cont_srv_engage',
      'Engage with us',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '20px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Engage Title'
    ),
    p_srv_engage: makeParagraph(
      'p_srv_engage',
      'cont_srv_engage',
      '<p>Our flexible modes of engagement provide clients with multiple options to meet their requirements. These include short to medium term project-based work, master service agreements / retainers for recurring requirements, offshoring, and &lsquo;Enabl&rsquo; - sustainability/ ESG teams dedicated for long-term client support.</p>',
      {
        fontSize: '22px',
        lineHeight: '1.6',
        textColor: '#393939',
        marginBottom: '0',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Engage Description'
    ),

    // ─── 5. Pre-Footer CTA ─────────────────────────────────────────────────────
    sec_srv_cta: makeSection(
      'sec_srv_cta',
      ['cont_srv_cta'],
      {
        paddingTop: '40px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Pre-Footer CTA Section'
    ),
    cont_srv_cta: makeContainer(
      'cont_srv_cta',
      'sec_srv_cta',
      ['card_srv_cta'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'CTA Container'
    ),
    card_srv_cta: makeContainer(
      'card_srv_cta',
      'cont_srv_cta',
      ['h3_srv_cta', 'btn_srv_cta'],
      {
        backgroundImage: resolveCmsImage('/images/footer-cta.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '20px',
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '40px',
        paddingRight: '40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        minHeight: '340px',
      },
      'CTA Card'
    ),
    h3_srv_cta: makeHeading(
      'h3_srv_cta',
      'card_srv_cta',
      'Let us move towards a greener future',
      'h3',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#FFFFFF',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'CTA Title'
    ),
    btn_srv_cta: makeButton(
      'btn_srv_cta',
      'card_srv_cta',
      'Connect',
      '/connect/',
      'primary',
      {
        backgroundColor: '#FFFFFF',
        textColor: '#282828',
        fontSize: '18px',
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

  // Populate the 3 Pillar cards
  PILLARS_LIST.forEach((p, idx) => {
    const cardId = `card_pillar_${idx + 1}`;
    const titleId = `p_title_${idx + 1}`;
    const subId = `p_sub_${idx + 1}`;
    const btnId = `p_btn_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_srv_pillars',
      [titleId, subId, btnId],
      {
        backgroundImage: resolveCmsImage(p.img),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
        minHeight: '380px',
        borderRadius: '20px',
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      },
      `${p.title} Card`
    );

    nodes[titleId] = makeHeading(
      titleId,
      cardId,
      p.title,
      'h4',
      {
        fontSize: '32px',
        fontWeight: 500,
        textColor: '#FFFFFF',
        marginBottom: '8px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${p.title} Title`
    );

    nodes[subId] = makeParagraph(
      subId,
      cardId,
      `<p>${p.subtitle}</p>`,
      {
        fontSize: '22px',
        textColor: '#E5E7EB',
        marginBottom: '16px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${p.title} Subtitle`
    );

    nodes[btnId] = makeButton(
      btnId,
      cardId,
      'Explore Practice →',
      p.slug,
      'outline',
      {
        textColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '20px',
        paddingRight: '20px',
        borderRadius: '9999px',
        fontSize: '15px',
        width: 'fit-content',
      },
      `${p.title} Link`
    );
  });

  // Populate Sector cards
  SECTORS_LIST.forEach((s, idx) => {
    const cardId = `card_sec_${idx + 1}`;
    const nameId = `sec_name_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_srv_sectors',
      [nameId],
      {
        backgroundImage: resolveCmsImage(s.img),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
        height: '240px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      `${s.name} Sector Card`
    );

    nodes[nameId] = makeParagraph(
      nameId,
      cardId,
      `<p>${s.name}</p>`,
      {
        fontSize: '18px',
        fontWeight: 500,
        textColor: '#FFFFFF',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${s.name} Label`
    );
  });

  // Populate Theme cards
  THEMES_LIST.forEach((t, idx) => {
    const cardId = `card_thm_${idx + 1}`;
    const nameId = `thm_name_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_srv_themes',
      [nameId],
      {
        backgroundImage: resolveCmsImage(t.img),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
        height: '240px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      `${t.name} Theme Card`
    );

    nodes[nameId] = makeParagraph(
      nameId,
      cardId,
      `<p>${t.name}</p>`,
      {
        fontSize: '18px',
        fontWeight: 500,
        textColor: '#FFFFFF',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${t.name} Label`
    );
  });

  // Populate Tool cards
  TOOLS_LIST.forEach((tool, idx) => {
    const cardId = `card_tool_${idx + 1}`;
    const nameId = `tool_name_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_srv_tools',
      [nameId],
      {
        backgroundImage: resolveCmsImage(tool.img),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
        height: '240px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      `${tool.name} Tool Card`
    );

    nodes[nameId] = makeParagraph(
      nameId,
      cardId,
      `<p><strong>${tool.name}</strong> · ${tool.tag}</p>`,
      {
        fontSize: '18px',
        fontWeight: 500,
        textColor: '#FFFFFF',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${tool.name} Label`
    );
  });

  return assembleTree(rootIds, nodes);
}
