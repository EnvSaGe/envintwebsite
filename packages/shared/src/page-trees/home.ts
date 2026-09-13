import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  makeDivider,
  makeDynamicModule,
  assembleTree,
  resolveCmsImage,
} from './utils';

/*
 * Home page tree — mirrors envintglobal.com exactly:
 *   1. Hero: 100vh, content anchored to the BOTTOM (justify-end), 96px tagline
 *   2. Philosophy statement: 3 paragraphs + underlined "Explore more" link
 *   3. Vantage spotlight: #F7F7F7, cover left + info right, underlined links
 *   4. "We help you with ...": 2x2 grid (heading TL, cards SI TR / RI BL / CA BR),
 *      white cards with gray-logo watermark, no per-card button
 *   5. #TheEnvintWay: 48px title + 24px mission, 3 pillars (image, title, divider, text)
 *   6. Our Impact: 48px title + 24px desc, 4 stat columns (icon, 64px number, label, left border)
 *   7. Read news and insights: heading + "View all" underlined link + insights grid module
 *   8. Pre-footer CTA banner: footer-cta bg, 48px white text, white pill "Connect"
 */

const SERVICE_CARDS = [
  {
    id: 'card_help_1',
    title: 'Sustainability Integration',
    desc: 'Integrate sustainability in your core strategy & operations',
    url: '/sustainability-integration/',
  },
  {
    id: 'card_help_2',
    title: 'Responsible Investment',
    desc: 'Build ESG principles to channelize funds into responsible businesses',
    url: '/responsible-investment/',
  },
  {
    id: 'card_help_3',
    title: 'Climate Action',
    desc: 'Futureproof your organization with low-carbon transition plans',
    url: '/climate-action/',
  },
];

const PILLARS = [
  {
    id: 'pillar_1',
    title: 'Focused',
    img: '/images/envintway-focused.webp',
    alt: 'Focused - Magnifying glass on forest trees',
    desc: 'We are sharply focused on sustainability & ESG giving us the edge to understand the complexities associated with this domain.',
  },
  {
    id: 'pillar_2',
    title: 'Balanced',
    img: '/images/envintway-balanced.webp',
    alt: 'Balanced - Stacked balancing pebbles in nature',
    desc: 'Our approach is calibrated to be balanced and pragmatic, built on understanding of policy, regulation, markets and ground realities.',
  },
  {
    id: 'pillar_3',
    title: 'Committed',
    img: '/images/envintway-committed.webp',
    alt: 'Committed - Handshake in partnership',
    desc: 'As a young firm, we go one step further, and believe in co-owning the execution of strategy with our clients. Ownership is not a buzzword for us - our skin is in the game.',
  },
];

const STATS = [
  { id: 'stat_1', value: '525+', label: 'Engagements', img: '/images/stat-engagements.webp' },
  { id: 'stat_2', value: '150+', label: 'Clients', img: '/images/stat-clients-clean.webp' },
  { id: 'stat_3', value: '10+', label: 'Countries', img: '/images/stat-countries-clean.webp' },
  { id: 'stat_4', value: '6', label: 'Offices', img: '/images/stat-offices.webp' },
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
    // ─── 1. Hero: 100vh, bottom-anchored (live: --min-height:100vh, justify-content:flex-end) ──
    sec_home_hero: makeSection(
      'sec_home_hero',
      ['cont_home_hero'],
      {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: '150px',
        paddingBottom: '60px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundImage: resolveCmsImage('/images/hero-wetland.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
        fontSize: '96px',
        fontWeight: 400,
        lineHeight: '1.08',
        textColor: '#FFFFFF',
        textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
        marginBottom: '0',
      },
      {
        tablet: { fontSize: '64px' },
        mobile: { fontSize: '32px', lineHeight: '1.1' },
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
        textShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
        marginTop: '20px',
        marginBottom: '0',
        maxWidth: '980px',
      },
      {
        tablet: { fontSize: '24px' },
        mobile: { fontSize: '16px', lineHeight: '1.35', marginTop: '14px' },
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
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'Philosophy Statement'
    ),
    cont_home_philosophy: makeContainer(
      'cont_home_philosophy',
      'sec_home_philosophy',
      ['phil_p1', 'phil_p2', 'phil_p3', 'phil_link_wrap'],
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
        marginBottom: '10px',
      },
      {
        mobile: { fontSize: '17px', lineHeight: '25px', marginBottom: '20px' },
      },
      'Philosophy Line 3'
    ),
    phil_link_wrap: makeContainer(
      'phil_link_wrap',
      'cont_home_philosophy',
      ['phil_link'],
      { paddingTop: '10px', maxWidth: '100%' },
      'Philosophy Link Wrap'
    ),
    phil_link: makeButton(
      'phil_link',
      'phil_link_wrap',
      'Explore more',
      '/services/',
      'primary',
      {
        backgroundColor: 'transparent',
        textColor: '#BCBCBC',
        fontSize: '24px',
        fontWeight: 400,
        paddingTop: '0',
        paddingBottom: '10px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        borderBottomWidth: '1.152px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#8C8C8C',
        width: 'fit-content',
      },
      'Explore More Link'
    ),

    // ─── 3. Vantage Spotlight (#F7F7F7, image left / info right) ────────────────
    sec_home_vantage: makeSection(
      'sec_home_vantage',
      ['cont_home_vantage'],
      {
        backgroundColor: '#F7F7F7',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '20px',
        paddingRight: '20px',
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
      ['img_vantage', 'col_vantage_info'],
      {
        gridColumns: 'minmax(0, 635fr) minmax(0, 465fr)',
        gap: '86px',
        alignItems: 'center',
      },
      {
        tablet: { gridColumns: '1fr', gap: '40px' },
      },
      'Vantage Grid'
    ),
    img_vantage: makeImage(
      'img_vantage',
      'grid_home_vantage',
      resolveCmsImage('/images/vantage-2026.webp'),
      'Vantage 2026: Navigating the ESG Reset - Envint Publication',
      { width: '100%', maxWidth: '635px', borderRadius: '20px' },
      'Vantage Report Cover'
    ),
    col_vantage_info: makeContainer(
      'col_vantage_info',
      'grid_home_vantage',
      ['h2_vantage', 'p_vantage', 'vantage_links'],
      { display: 'flex', flexDirection: 'column', maxWidth: '100%' },
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
        lineHeight: 'normal',
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
        maxWidth: '100%',
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
        textColor: '#2F7ABE',
        fontSize: '24px',
        fontWeight: 400,
        paddingTop: '0',
        paddingBottom: '10px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        borderBottomWidth: '1.152px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#8C8C8C',
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
        textColor: '#2F7ABE',
        fontSize: '24px',
        fontWeight: 400,
        paddingTop: '0',
        paddingBottom: '10px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        borderBottomWidth: '1.152px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#8C8C8C',
        width: 'fit-content',
      },
      'Vantage 2025 Link'
    ),

    // ─── 4. "We help you with ..." — 2x2 serviceboxes grid (live layout) ────────
    sec_home_services: makeSection(
      'sec_home_services',
      ['cont_home_services'],
      {
        paddingTop: '120px',
        paddingBottom: '120px',
        paddingLeft: '20px',
        paddingRight: '20px',
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
      ['grid_home_services'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Services Container'
    ),
    grid_home_services: makeGrid(
      'grid_home_services',
      'cont_home_services',
      ['h2_home_services', 'card_help_1', 'card_help_2', 'card_help_3'],
      {
        gridColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '36px',
        alignItems: 'stretch',
      },
      {
        tablet: { gridColumns: '1fr', gap: '24px' },
      },
      'Serviceboxes Grid (2x2)'
    ),
    h2_home_services: makeContainer(
      'h2_home_services',
      'grid_home_services',
      ['h2_home_services_text'],
      {
        display: 'flex',
        alignItems: 'center',
        minHeight: '210px',
        maxWidth: '100%',
        padding: '10px',
      },
      'Services Heading Cell'
    ),
    h2_home_services_text: makeHeading(
      'h2_home_services_text',
      'h2_home_services',
      'We help you with ...',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '60px',
        fontWeight: 400,
        lineHeight: '1.12',
        textColor: '#FFFFFF',
        textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)',
        marginBottom: '0',
      },
      {
        tablet: { fontSize: '44px' },
        mobile: { fontSize: '32px' },
      },
      'Services Heading'
    ),

    // ─── 5. #TheEnvintWay ───────────────────────────────────────────────────────
    sec_home_envint_way: makeSection(
      'sec_home_envint_way',
      ['cont_home_envint_way'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '20px',
        paddingRight: '20px',
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
        lineHeight: 'normal',
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
      PILLARS.map((p) => p.id),
      {
        gridColumns: 'repeat(3, minmax(0, 341px))',
        justifyContent: 'space-between',
        gap: '24px',
      },
      {
        tablet: { gridColumns: '1fr', gap: '40px' },
      },
      'Pillars Grid'
    ),

    // ─── 6. Our Impact & Stats ──────────────────────────────────────────────────
    sec_home_impact: makeSection(
      'sec_home_impact',
      ['cont_home_impact'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '20px',
        paddingRight: '20px',
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
        lineHeight: 'normal',
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
      STATS.map((s) => s.id),
      {
        gridColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '24px',
        marginBottom: '70px',
      },
      {
        tablet: { gridColumns: 'repeat(2, 1fr)' },
        mobile: { gridColumns: '1fr' },
      },
      'Stats Grid'
    ),

    // ─── 7. Read News and Insights ──────────────────────────────────────────────
    sec_home_insights: makeSection(
      'sec_home_insights',
      ['cont_home_insights'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'Read News and Insights Section'
    ),
    cont_home_insights: makeContainer(
      'cont_home_insights',
      'sec_home_insights',
      ['row_insights_head', 'mod_insights'],
      {
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      },
      'Insights Container'
    ),
    row_insights_head: makeContainer(
      'row_insights_head',
      'cont_home_insights',
      ['h2_insights', 'link_view_all'],
      {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '40px',
        maxWidth: '100%',
      },
      'Insights Heading Row'
    ),
    h2_insights: makeHeading(
      'h2_insights',
      'row_insights_head',
      'Read news and insights',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '48px',
        fontWeight: 400,
        lineHeight: 'normal',
        textColor: '#004E35',
        marginBottom: '0',
      },
      {
        mobile: { fontSize: '28px' },
      },
      'Insights Headline'
    ),
    link_view_all: makeButton(
      'link_view_all',
      'row_insights_head',
      'View all',
      '/envision/',
      'primary',
      {
        backgroundColor: 'transparent',
        textColor: '#1E1E1E',
        fontSize: '24px',
        fontWeight: 400,
        paddingTop: '0',
        paddingBottom: '5px',
        paddingLeft: '0',
        paddingRight: '0',
        borderRadius: '0',
        borderBottomWidth: '1.152px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#8C8C8C',
        width: 'fit-content',
      },
      'View All Link'
    ),
    mod_insights: makeDynamicModule(
      'mod_insights',
      'cont_home_insights',
      'insights-grid',
      { limit: 3, showDate: true, showReadMore: false },
      {},
      'Latest Insights Grid'
    ),

    // ─── 8. Pre-Footer CTA Banner ───────────────────────────────────────────────
    sec_home_cta: makeSection(
      'sec_home_cta',
      ['cont_home_cta'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '50px',
        paddingBottom: '70px',
        paddingLeft: '20px',
        paddingRight: '20px',
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
      ['cta_inner', 'img_cta_bg', 'cta_overlay'],
      {
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '360px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 30px',
      },
      'CTA Banner Card'
    ),
    img_cta_bg: makeImage(
      'img_cta_bg',
      'card_home_cta',
      resolveCmsImage('/images/footer-cta.webp'),
      'Lush green mountain ridges',
      {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        borderRadius: '0',
        zIndex: 0,
      },
      'CTA Background'
    ),
    cta_overlay: makeContainer(
      'cta_overlay',
      'card_home_cta',
      [],
      {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))',
        maxWidth: '100%',
        zIndex: 1,
      },
      'CTA Overlay'
    ),
    cta_inner: makeContainer(
      'cta_inner',
      'card_home_cta',
      ['h2_cta', 'btn_cta'],
      {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '800px',
        zIndex: 2,
      },
      'CTA Content'
    ),
    h2_cta: makeHeading(
      'h2_cta',
      'cta_inner',
      'Let us move towards a greener future',
      'h2',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '48px',
        fontWeight: 400,
        lineHeight: '1.25',
        textColor: '#FFFFFF',
        textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
        marginBottom: '32px',
        textAlign: 'center',
      },
      {
        mobile: { fontSize: '28px' },
      },
      'CTA Headline'
    ),
    btn_cta: makeButton(
      'btn_cta',
      'cta_inner',
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
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        width: 'fit-content',
      },
      'CTA Connect Button'
    ),
  };

  // Populate "We help you with ..." servicebox cards (top-right, bottom-left, bottom-right)
  SERVICE_CARDS.forEach((c) => {
    const titleId = `${c.id}_title`;
    const descId = `${c.id}_desc`;
    const watermarkId = `${c.id}_watermark`;

    nodes[c.id] = makeContainer(
      c.id,
      'grid_home_services',
      [`${c.id}_content`, watermarkId],
      {
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '210px',
        paddingTop: '44px',
        paddingBottom: '36px',
        paddingLeft: '40px',
        paddingRight: '40px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16)',
      },
      `${c.title} Card`
    );

    nodes[`${c.id}_content`] = makeContainer(
      `${c.id}_content`,
      c.id,
      [titleId, descId],
      {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxWidth: '100%',
        zIndex: 2,
      },
      `${c.title} Content`
    );

    nodes[titleId] = makeHeading(
      titleId,
      `${c.id}_content`,
      c.title,
      'h3',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '28px',
        fontWeight: 500,
        lineHeight: '1.2',
        textColor: '#C65102',
        marginBottom: '12px',
      },
      {
        mobile: { fontSize: '24px' },
      },
      `${c.title} Title`
    );

    nodes[descId] = makeParagraph(
      descId,
      `${c.id}_content`,
      `<p>${c.desc}</p>`,
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '30px',
        textColor: '#484848',
        marginBottom: '0',
        maxWidth: '440px',
      },
      {
        mobile: { fontSize: '18px', lineHeight: '24px' },
      },
      `${c.title} Description`
    );

    // Gray Envint logo watermark, bottom-right corner (live: 140px, 35% opacity)
    nodes[watermarkId] = makeImage(
      watermarkId,
      c.id,
      resolveCmsImage('/images/gray-logo.webp'),
      '',
      {
        position: 'absolute',
        right: '18px',
        bottom: '-14px',
        width: '140px',
        height: '140px',
        opacity: 0.35,
        borderRadius: '0',
        zIndex: 1,
      },
      `${c.title} Watermark`
    );
  });

  // Populate #TheEnvintWay pillars (image, title, divider line, description)
  PILLARS.forEach((p) => {
    const imgId = `${p.id}_img`;
    const titleId = `${p.id}_title`;
    const divId = `${p.id}_divider`;
    const descId = `${p.id}_desc`;

    nodes[p.id] = makeContainer(
      p.id,
      'grid_envint_way',
      [imgId, titleId, divId, descId],
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '341px',
        textAlign: 'center',
      },
      `${p.title} Pillar`
    );

    nodes[imgId] = makeImage(
      imgId,
      p.id,
      resolveCmsImage(p.img),
      p.alt,
      {
        width: '100%',
        maxWidth: '310px',
        aspectRatio: '1/1',
        borderRadius: '20px',
        marginBottom: '20px',
      },
      `${p.title} Image`
    );

    nodes[titleId] = makeHeading(
      titleId,
      p.id,
      p.title,
      'h3',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        fontWeight: 400,
        lineHeight: 'normal',
        textColor: '#5A5A5A',
        marginBottom: '0',
      },
      `${p.title} Title`
    );

    nodes[divId] = makeDivider(divId, p.id, {
      width: '100%',
      maxWidth: '310px',
      borderTopColor: '#D5D5D5',
      marginTop: '14px',
      marginBottom: '20px',
    }, `${p.title} Divider`);

    nodes[descId] = makeParagraph(
      descId,
      p.id,
      `<p>${p.desc}</p>`,
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '18px',
        lineHeight: '26px',
        textColor: '#5A5A5A',
        marginBottom: '0',
        maxWidth: '341px',
      },
      `${p.title} Description`
    );
  });

  // Populate Impact stats columns (icon, 64px number, label, left border)
  STATS.forEach((s) => {
    const imgId = `${s.id}_img`;
    const valId = `${s.id}_value`;
    const labelId = `${s.id}_label`;

    nodes[s.id] = makeContainer(
      s.id,
      'grid_stats',
      [imgId, valId, labelId],
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: '#D9D9D9',
        paddingLeft: '18px',
      },
      `${s.label} Stat`
    );

    nodes[imgId] = makeImage(
      imgId,
      s.id,
      resolveCmsImage(s.img),
      '',
      {
        width: '40px',
        height: '40px',
        borderRadius: '0',
        marginBottom: '10px',
      },
      `${s.label} Icon`
    );

    nodes[valId] = makeHeading(
      valId,
      s.id,
      s.value,
      'h3',
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '64px',
        fontWeight: 400,
        lineHeight: '1',
        textColor: '#06573D',
        marginBottom: '0',
      },
      {
        tablet: { fontSize: '48px' },
        mobile: { fontSize: '40px' },
      },
      `${s.label} Value`
    );

    nodes[labelId] = makeParagraph(
      labelId,
      s.id,
      `<p>${s.label}</p>`,
      {
        fontFamily: 'Neue Montreal, sans-serif',
        fontSize: '24px',
        lineHeight: '1.3',
        textColor: '#484848',
        marginTop: '8px',
        marginBottom: '0',
      },
      {
        mobile: { fontSize: '18px' },
      },
      `${s.label} Label`
    );
  });

  return assembleTree(rootIds, nodes);
}
