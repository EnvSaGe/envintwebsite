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
  makeCounter,
  makeDynamicModule,
  assembleTree,
  resolveCmsImage,
} from './utils';

export function createHomePageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_home_hero',
    'sec_home_philosophy',
    'sec_home_vantage',
    'sec_home_capabilities',
    'sec_home_envint_way',
    'sec_home_stats',
    'sec_home_insights',
    'sec_home_cta',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Section ────────────────────────────────────────────────────────
    sec_home_hero: makeSection(
      'sec_home_hero',
      'Hero Banner',
      ['cont_home_hero'],
      {
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'flex-end',
        paddingTop: '180px',
        paddingBottom: '100px',
        backgroundImage: `url(${resolveCmsImage('/images/hero-wetland.webp')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay: 'linear-gradient(to top, rgba(0, 46, 32, 0.85) 0%, rgba(0, 46, 32, 0.3) 100%)',
      }
    ),
    cont_home_hero: makeContainer(
      'cont_home_hero',
      'Hero Container',
      'sec_home_hero',
      ['badge_home_hero', 'h1_home_hero', 'p_home_hero', 'btn_home_hero'],
      {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '1280px',
      }
    ),
    badge_home_hero: makeBadge(
      'badge_home_hero',
      'Hero Tagline',
      'cont_home_hero',
      'SUSTAINABILITY & ESG ADVISORY',
      {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        textColor: '#FFFFFF',
      }
    ),
    h1_home_hero: makeHeading(
      'h1_home_hero',
      'Hero Headline',
      'cont_home_hero',
      'Business for Better.\nMaking it happen',
      'h1',
      {
        textColor: '#FFFFFF',
        fontSize: '76px',
        lineHeight: '1.08',
        marginBottom: '0',
      },
      {
        tablet: { fontSize: '52px' },
        mobile: { fontSize: '36px' },
      }
    ),
    p_home_hero: makeParagraph(
      'p_home_hero',
      'Hero Subtitle',
      'cont_home_hero',
      'We help clients integrate sustainability, channelize responsible investment and enable climate action.',
      {
        textColor: '#FBF4EB',
        fontSize: '24px',
        maxWidth: '820px',
        marginBottom: '0',
      },
      {
        mobile: { fontSize: '18px' },
      }
    ),
    btn_home_hero: makeButton(
      'btn_home_hero',
      'Hero CTA Button',
      'cont_home_hero',
      'Connect With Us',
      '/connect',
      {
        backgroundColor: '#FFFFFF',
        textColor: '#004E35',
        fontWeight: 600,
        width: 'fit-content',
        marginTop: '10px',
      }
    ),

    // ─── 2. Philosophy Section ──────────────────────────────────────────────────
    sec_home_philosophy: makeSection(
      'sec_home_philosophy',
      'Philosophy & Purpose',
      ['cont_home_philosophy'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '90px',
        paddingBottom: '90px',
      }
    ),
    cont_home_philosophy: makeContainer(
      'cont_home_philosophy',
      'Philosophy Container',
      'sec_home_philosophy',
      ['badge_home_phil', 'h2_home_phil', 'p1_home_phil', 'p2_home_phil'],
      { maxWidth: '1080px' }
    ),
    badge_home_phil: makeBadge(
      'badge_home_phil',
      'Philosophy Badge',
      'cont_home_philosophy',
      'OUR PHILOSOPHY'
    ),
    h2_home_phil: makeHeading(
      'h2_home_phil',
      'Philosophy Headline',
      'cont_home_philosophy',
      'Everything we do is in pursuit of better',
      'h2',
      {
        fontSize: '48px',
        textColor: '#004E35',
        marginTop: '16px',
        marginBottom: '24px',
      }
    ),
    p1_home_phil: makeParagraph(
      'p1_home_phil',
      'Philosophy Intro',
      'cont_home_philosophy',
      'From the air we breathe and the water we drink to the future we want, the desire for better touches us all. Better is inspiring and limitless, constrained only by the laws of nature.',
      { fontSize: '24px', lineHeight: '1.5', textColor: '#393939' }
    ),
    p2_home_phil: makeParagraph(
      'p2_home_phil',
      'Philosophy Detail',
      'cont_home_philosophy',
      'At Envint, better is what we live, think and enable. We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.',
      { fontSize: '18px', lineHeight: '1.7', textColor: '#64748B' }
    ),

    // ─── 3. Featured Spotlight (Vantage 2026) ───────────────────────────────────
    sec_home_vantage: makeSection(
      'sec_home_vantage',
      'Featured Publication Spotlight',
      ['cont_home_vantage'],
      {
        backgroundColor: '#F8FAFC',
        paddingTop: '80px',
        paddingBottom: '80px',
      }
    ),
    cont_home_vantage: makeContainer(
      'cont_home_vantage',
      'Vantage Container',
      'sec_home_vantage',
      ['grid_home_vantage']
    ),
    grid_home_vantage: makeGrid(
      'grid_home_vantage',
      'Vantage 2-Col Grid',
      'cont_home_vantage',
      ['col_vantage_info', 'col_vantage_img'],
      {
        gridColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
        alignItems: 'center',
        gap: '48px',
      },
      {
        tablet: { gridColumns: '1fr' },
      }
    ),
    col_vantage_info: makeContainer(
      'col_vantage_info',
      'Vantage Info Column',
      'grid_home_vantage',
      ['badge_vantage', 'h2_vantage', 'p_vantage', 'btn_vantage']
    ),
    badge_vantage: makeBadge(
      'badge_vantage',
      'Vantage Badge',
      'col_vantage_info',
      'FLAGSHIP PUBLICATION'
    ),
    h2_vantage: makeHeading(
      'h2_vantage',
      'Vantage Headline',
      'col_vantage_info',
      'Vantage 2026: The ESG Inflection Point',
      'h2',
      { fontSize: '42px', marginTop: '14px' }
    ),
    p_vantage: makeParagraph(
      'p_vantage',
      'Vantage Description',
      'col_vantage_info',
      'Our definitive annual industry report analyzing corporate decarbonization roadmaps, BRSR disclosures, Scope 3 supply chain realities, and emerging transition finance vehicles.',
      { fontSize: '18px' }
    ),
    btn_vantage: makeButton(
      'btn_vantage',
      'Read Report Button',
      'col_vantage_info',
      'Explore Publication',
      '/insights',
      { marginTop: '12px' }
    ),
    col_vantage_img: makeContainer(
      'col_vantage_img',
      'Vantage Image Column',
      'grid_home_vantage',
      ['img_vantage']
    ),
    img_vantage: makeImage(
      'img_vantage',
      'Vantage Report Cover',
      'col_vantage_img',
      '/images/brsr-round-2.webp',
      'Envint Vantage 2026 Report Cover',
      {
        borderRadius: '16px',
        boxShadow: '0 20px 40px -15px rgba(0, 78, 53, 0.18)',
      }
    ),

    // ─── 4. Capabilities / Services ─────────────────────────────────────────────
    sec_home_capabilities: makeSection(
      'sec_home_capabilities',
      'Core Capabilities & Solutions',
      ['cont_home_capabilities'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '90px',
        paddingBottom: '90px',
      }
    ),
    cont_home_capabilities: makeContainer(
      'cont_home_capabilities',
      'Capabilities Container',
      'sec_home_capabilities',
      ['badge_home_caps', 'h2_home_caps', 'grid_home_caps']
    ),
    badge_home_caps: makeBadge(
      'badge_home_caps',
      'Capabilities Badge',
      'cont_home_capabilities',
      'WHAT WE DELIVER'
    ),
    h2_home_caps: makeHeading(
      'h2_home_caps',
      'Capabilities Headline',
      'cont_home_capabilities',
      'Three specialized practices delivering end-to-end impact',
      'h2',
      { fontSize: '42px', marginTop: '14px', marginBottom: '40px' }
    ),
    grid_home_caps: makeGrid(
      'grid_home_caps',
      'Practice Cards Grid',
      'cont_home_capabilities',
      ['card_cap_1', 'card_cap_2', 'card_cap_3'],
      {
        gridColumns: 'repeat(3, 1fr)',
        gap: '28px',
      },
      {
        tablet: { gridColumns: '1fr' },
      }
    ),

    // Practice 1: Sustainability Integration
    card_cap_1: makeContainer(
      'card_cap_1',
      'Sustainability Integration Card',
      'grid_home_caps',
      ['h3_cap_1', 'p_cap_1', 'btn_cap_1'],
      {
        backgroundColor: '#F7F7F7',
        borderRadius: '16px',
        paddingTop: '36px',
        paddingBottom: '36px',
        paddingLeft: '28px',
        paddingRight: '28px',
      }
    ),
    h3_cap_1: makeHeading(
      'h3_cap_1',
      'Card 1 Title',
      'card_cap_1',
      'Sustainability Integration',
      'h3',
      { fontSize: '26px', textColor: '#004E35' }
    ),
    p_cap_1: makeParagraph(
      'p_cap_1',
      'Card 1 Description',
      'card_cap_1',
      'Embedding sustainability principles into core corporate strategy, governance, supply chains, circular economy models, and verified disclosure frameworks.'
    ),
    btn_cap_1: makeButton(
      'btn_cap_1',
      'Card 1 Link',
      'card_cap_1',
      'Explore Practice →',
      '/sustainability-integration',
      {
        backgroundColor: 'transparent',
        textColor: '#004E35',
        paddingLeft: '0',
        paddingRight: '0',
        fontWeight: 600,
      }
    ),

    // Practice 2: Climate Action
    card_cap_2: makeContainer(
      'card_cap_2',
      'Climate Action Card',
      'grid_home_caps',
      ['h3_cap_2', 'p_cap_2', 'btn_cap_2'],
      {
        backgroundColor: '#F7F7F7',
        borderRadius: '16px',
        paddingTop: '36px',
        paddingBottom: '36px',
        paddingLeft: '28px',
        paddingRight: '28px',
      }
    ),
    h3_cap_2: makeHeading(
      'h3_cap_2',
      'Card 2 Title',
      'card_cap_2',
      'Climate Action & Decarbonization',
      'h3',
      { fontSize: '26px', textColor: '#004E35' }
    ),
    p_cap_2: makeParagraph(
      'p_cap_2',
      'Card 2 Description',
      'card_cap_2',
      'Scope 1-3 GHG inventories, science-based net zero pathways, renewable energy strategies, energy efficiency audits, and physical climate risk screening.'
    ),
    btn_cap_2: makeButton(
      'btn_cap_2',
      'Card 2 Link',
      'card_cap_2',
      'Explore Practice →',
      '/climate-action',
      {
        backgroundColor: 'transparent',
        textColor: '#004E35',
        paddingLeft: '0',
        paddingRight: '0',
        fontWeight: 600,
      }
    ),

    // Practice 3: Responsible Investment
    card_cap_3: makeContainer(
      'card_cap_3',
      'Responsible Investment Card',
      'grid_home_caps',
      ['h3_cap_3', 'p_cap_3', 'btn_cap_3'],
      {
        backgroundColor: '#F7F7F7',
        borderRadius: '16px',
        paddingTop: '36px',
        paddingBottom: '36px',
        paddingLeft: '28px',
        paddingRight: '28px',
      }
    ),
    h3_cap_3: makeHeading(
      'h3_cap_3',
      'Card 3 Title',
      'card_cap_3',
      'Responsible Investment & Diligence',
      'h3',
      { fontSize: '26px', textColor: '#004E35' }
    ),
    p_cap_3: makeParagraph(
      'p_cap_3',
      'Card 3 Description',
      'card_cap_3',
      'Comprehensive pre-investment ESG due diligence, Environmental & Social Action Plans (ESAP), LP reporting, and post-deal portfolio monitoring for PE & DFIs.'
    ),
    btn_cap_3: makeButton(
      'btn_cap_3',
      'Card 3 Link',
      'card_cap_3',
      'Explore Practice →',
      '/responsible-investment',
      {
        backgroundColor: 'transparent',
        textColor: '#004E35',
        paddingLeft: '0',
        paddingRight: '0',
        fontWeight: 600,
      }
    ),

    // ─── 5. The Envint Way ──────────────────────────────────────────────────────
    sec_home_envint_way: makeSection(
      'sec_home_envint_way',
      'The Envint Way (3 Pillars)',
      ['cont_home_envint_way'],
      {
        backgroundColor: '#004E35',
        paddingTop: '90px',
        paddingBottom: '90px',
      }
    ),
    cont_home_envint_way: makeContainer(
      'cont_home_envint_way',
      'Envint Way Container',
      'sec_home_envint_way',
      ['badge_envint_way', 'h2_envint_way', 'grid_envint_way']
    ),
    badge_envint_way: makeBadge(
      'badge_envint_way',
      'Envint Way Badge',
      'cont_home_envint_way',
      '#THEENVINTWAY',
      {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        textColor: '#FFFFFF',
      }
    ),
    h2_envint_way: makeHeading(
      'h2_envint_way',
      'Envint Way Headline',
      'cont_home_envint_way',
      'Where conviction, capability and action meet',
      'h2',
      {
        textColor: '#FFFFFF',
        fontSize: '44px',
        marginTop: '16px',
        marginBottom: '40px',
      }
    ),
    grid_envint_way: makeGrid(
      'grid_envint_way',
      'Pillars Grid',
      'cont_home_envint_way',
      ['pillar_1', 'pillar_2', 'pillar_3'],
      {
        gridColumns: 'repeat(3, 1fr)',
        gap: '24px',
      },
      {
        tablet: { gridColumns: '1fr' },
      }
    ),

    // Pillar 1: Conviction
    pillar_1: makeContainer(
      'pillar_1',
      'Pillar 1 - Conviction',
      'grid_envint_way',
      ['img_pillar_1', 'h3_pillar_1', 'p_pillar_1'],
      {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }
    ),
    img_pillar_1: makeImage(
      'img_pillar_1',
      'Conviction Image',
      'pillar_1',
      '/images/aboutesg.webp',
      'Conviction in sustainability',
      { height: '180px', marginBottom: '16px' }
    ),
    h3_pillar_1: makeHeading(
      'h3_pillar_1',
      'Conviction Title',
      'pillar_1',
      'Conviction',
      'h3',
      { textColor: '#FFFFFF', fontSize: '24px' }
    ),
    p_pillar_1: makeParagraph(
      'p_pillar_1',
      'Conviction Text',
      'pillar_1',
      'We believe sustainability is not an afterthought, but the bedrock of resilient enterprise value in a decarbonizing world.',
      { textColor: '#E2E8F0', fontSize: '16px' }
    ),

    // Pillar 2: Capability
    pillar_2: makeContainer(
      'pillar_2',
      'Pillar 2 - Capability',
      'grid_envint_way',
      ['img_pillar_2', 'h3_pillar_2', 'p_pillar_2'],
      {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }
    ),
    img_pillar_2: makeImage(
      'img_pillar_2',
      'Capability Image',
      'pillar_2',
      '/images/brsr-round-2.webp',
      'Multidisciplinary Capability',
      { height: '180px', marginBottom: '16px' }
    ),
    h3_pillar_2: makeHeading(
      'h3_pillar_2',
      'Capability Title',
      'pillar_2',
      'Capability',
      'h3',
      { textColor: '#FFFFFF', fontSize: '24px' }
    ),
    p_pillar_2: makeParagraph(
      'p_pillar_2',
      'Capability Text',
      'pillar_2',
      'Engineers, financial analysts, ESG auditors, and GIS specialists working collaboratively across multi-disciplinary advisory engagements.',
      { textColor: '#E2E8F0', fontSize: '16px' }
    ),

    // Pillar 3: Action
    pillar_3: makeContainer(
      'pillar_3',
      'Pillar 3 - Action',
      'grid_envint_way',
      ['img_pillar_3', 'h3_pillar_3', 'p_pillar_3'],
      {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }
    ),
    img_pillar_3: makeImage(
      'img_pillar_3',
      'Action Image',
      'pillar_3',
      '/images/about-hero.webp',
      'Delivering measurable action',
      { height: '180px', marginBottom: '16px' }
    ),
    h3_pillar_3: makeHeading(
      'h3_pillar_3',
      'Action Title',
      'pillar_3',
      'Action',
      'h3',
      { textColor: '#FFFFFF', fontSize: '24px' }
    ),
    p_pillar_3: makeParagraph(
      'p_pillar_3',
      'Action Text',
      'pillar_3',
      'Translating high-level commitments into verifiable baseline reductions, investor-grade disclosures, and auditable governance.',
      { textColor: '#E2E8F0', fontSize: '16px' }
    ),

    // ─── 6. Impact Metrics & Stats ──────────────────────────────────────────────
    sec_home_stats: makeSection(
      'sec_home_stats',
      'Proven Execution Metrics',
      ['cont_home_stats'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '80px',
        paddingBottom: '80px',
      }
    ),
    cont_home_stats: makeContainer(
      'cont_home_stats',
      'Stats Container',
      'sec_home_stats',
      ['badge_stats', 'h2_stats', 'grid_stats']
    ),
    badge_stats: makeBadge('badge_stats', 'Stats Badge', 'cont_home_stats', 'TRACK RECORD'),
    h2_stats: makeHeading(
      'h2_stats',
      'Stats Headline',
      'cont_home_stats',
      'Proven Execution at Scale',
      'h2',
      { fontSize: '42px', marginTop: '14px', marginBottom: '40px' }
    ),
    grid_stats: makeGrid(
      'grid_stats',
      'Stats Counters Grid',
      'cont_home_stats',
      ['stat_1', 'stat_2', 'stat_3', 'stat_4'],
      {
        gridColumns: 'repeat(4, 1fr)',
        gap: '24px',
      },
      {
        tablet: { gridColumns: 'repeat(2, 1fr)' },
        mobile: { gridColumns: '1fr' },
      }
    ),
    stat_1: makeCounter('stat_1', 'Stat 1', 'grid_stats', '500+', 'Engagements Delivered', {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#004E35',
      paddingLeft: '16px',
    }),
    stat_2: makeCounter('stat_2', 'Stat 2', 'grid_stats', '100+', 'Corporate Clients', {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#004E35',
      paddingLeft: '16px',
    }),
    stat_3: makeCounter('stat_3', 'Stat 3', 'grid_stats', '15+', 'Global Geographies', {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#004E35',
      paddingLeft: '16px',
    }),
    stat_4: makeCounter('stat_4', 'Stat 4', 'grid_stats', '6+', 'Years of Impact', {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#004E35',
      paddingLeft: '16px',
    }),

    // ─── 7. Dynamic Insights Module ─────────────────────────────────────────────
    sec_home_insights: makeSection(
      'sec_home_insights',
      'Latest Insights & Perspectives',
      ['cont_home_insights'],
      {
        backgroundColor: '#F8FAFC',
        paddingTop: '80px',
        paddingBottom: '80px',
      }
    ),
    cont_home_insights: makeContainer(
      'cont_home_insights',
      'Insights Container',
      'sec_home_insights',
      ['badge_insights', 'h2_insights', 'mod_insights']
    ),
    badge_insights: makeBadge('badge_insights', 'Insights Badge', 'cont_home_insights', 'KNOWLEDGE & PERSPECTIVES'),
    h2_insights: makeHeading(
      'h2_insights',
      'Insights Headline',
      'cont_home_insights',
      'Thought Leadership & Regulatory Analysis',
      'h2',
      { fontSize: '40px', marginTop: '14px', marginBottom: '32px' }
    ),
    mod_insights: makeDynamicModule(
      'mod_insights',
      'insights-grid',
      'Insights Dynamic Grid',
      'cont_home_insights'
    ),

    // ─── 8. Acceleration CTA ────────────────────────────────────────────────────
    sec_home_cta: makeSection(
      'sec_home_cta',
      'Bottom Call to Action',
      ['cont_home_cta'],
      {
        backgroundColor: '#004E35',
        paddingTop: '80px',
        paddingBottom: '80px',
      }
    ),
    cont_home_cta: makeContainer(
      'cont_home_cta',
      'CTA Container',
      'sec_home_cta',
      ['h2_cta', 'p_cta', 'btn_cta'],
      {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }
    ),
    h2_cta: makeHeading(
      'h2_cta',
      'CTA Headline',
      'cont_home_cta',
      'Ready to Accelerate Your Sustainability Journey?',
      'h2',
      {
        textColor: '#FFFFFF',
        fontSize: '44px',
        margin: '0',
      }
    ),
    p_cta: makeParagraph(
      'p_cta',
      'CTA Subtext',
      'cont_home_cta',
      'Speak with our senior advisory leaders to initiate a tailored consultation for your enterprise or fund.',
      {
        textColor: '#E2E8F0',
        fontSize: '20px',
        maxWidth: '700px',
        margin: '0',
      }
    ),
    btn_cta: makeButton(
      'btn_cta',
      'CTA Button',
      'cont_home_cta',
      'Connect With Us',
      '/connect',
      {
        backgroundColor: '#FFFFFF',
        textColor: '#004E35',
        fontSize: '18px',
        fontWeight: 600,
        paddingLeft: '36px',
        paddingRight: '36px',
        marginTop: '12px',
      }
    ),
  };

  return assembleTree(rootIds, nodes);
}
