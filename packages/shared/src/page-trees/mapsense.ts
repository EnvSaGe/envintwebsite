import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  makeBadge,
  assembleTree,
  resolveCmsImage,
} from './utils';

const FEATURES = [
  { icon: '🖥️', title: 'Screening of Sensitive Receptors', desc: 'Desk-based tool covering 10+ E&S receptor categories' },
  { icon: '⏱️', title: '48 Hours Turnaround Time', desc: 'For any project size or area, no exceptions' },
  { icon: '🇮🇳', title: 'Pan India Coverage', desc: 'Uniform spatial data across all States' },
  { icon: '🔄', title: 'Continuously Updated', desc: 'Receptor datasets updated regularly for accuracy' },
  { icon: '🎯', title: 'Customizable Buffer Pricing', desc: 'Pay only for the distance buffer you need' },
];

const STEPS = [
  { num: '1', title: 'Submit project location coordinates and required buffer', bg: '#3a7d5a', color: '#ffffff' },
  { num: '2', title: 'Receive Confirmation within 24 hours', bg: '#b6dfc4', color: '#2d6045' },
  { num: '3', title: 'Make Payment', bg: '#3a6f8f', color: '#ffffff' },
  { num: '4', title: 'Receive E&S screening report in 48 hours upon request', bg: '#c2dff0', color: '#1e4f6e' },
];

const REPORT_IMAGES = [
  { src: '/images/mapsense-report-download.jpg', alt: 'MapSense download report sample' },
  { src: '/images/mapsense-report-line.jpg', alt: 'MapSense line data report sample' },
  { src: '/images/mapsense-report-point.jpg', alt: 'MapSense point data report sample' },
];

const RECEPTORS = [
  { title: '💧 Waterbodies & Watersheds', items: ['Major Rivers and Waterbodies', 'Ground Water Development'] },
  { title: '🏛️ Cultural & Archaeological Places', items: ['World Heritage Sites', 'Excavations', 'State Protected Monuments', 'Museums'] },
  {
    title: '🌿 Sensitive Natural Habitats',
    items: [
      'National Park / Wildlife Sanctuary',
      'Notified Eco-Sensitive Zone',
      'Important Bird Areas, Ramsar Sites',
      'Reserve / Protected Forest',
      'Schedule Areas & Wildlife Corridors',
    ],
  },
  { title: '⚡ Natural Hazards', items: ['Earthquakes', 'Floods, Cyclones'] },
  { title: '🔗 Connectivity & Others', items: ['Nearest Highways (NH & SH)', 'Airports, Railway Stations', 'Defense & Army Installations'] },
];

const SECTORS = [
  { name: '⛏️ Extractives & Natural Resources' },
  { name: '🏭 Industrial / Processing Zones' },
  { name: 'Infrastructure' },
  { name: '🏢 Real Estate' },
  { name: '🏨 Hospitality (Hotels & Resorts)' },
  { name: '📦 Logistic Parks & Warehousing' },
  { name: '♻️ Renewable Energy' },
  { name: '🌍 Projects in sensitive ecosystems' },
];

export function createMapSensePageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_map_hero',
    'sec_map_intro',
    'sec_map_features',
    'sec_map_steps',
    'sec_map_reports',
    'sec_map_receptors',
    'sec_map_sectors',
    'sec_map_insights',
    'sec_map_cta',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Banner ─────────────────────────────────────────────────────────
    sec_map_hero: makeSection(
      'sec_map_hero',
      ['cont_map_hero'],
      {
        paddingTop: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        paddingRight: '0',
        minHeight: '380px',
        overflow: 'hidden',
      },
      'Hero Banner Section'
    ),
    cont_map_hero: makeContainer(
      'cont_map_hero',
      'sec_map_hero',
      ['img_map_hero'],
      { maxWidth: '100%', width: '100%' },
      'Hero Container'
    ),
    img_map_hero: makeImage(
      'img_map_hero',
      'cont_map_hero',
      resolveCmsImage('/images/mapsense-hero.webp'),
      'River through lush green forest - Envint MapSense',
      { width: '100%', height: '380px', objectFit: 'cover' },
      'Hero Banner Image'
    ),

    // ─── 2. Intro Section ───────────────────────────────────────────────────────
    sec_map_intro: makeSection(
      'sec_map_intro',
      ['cont_map_intro'],
      {
        paddingTop: '70px',
        paddingBottom: '60px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'MapSense Intro Section'
    ),
    cont_map_intro: makeContainer(
      'cont_map_intro',
      'sec_map_intro',
      ['h1_map_title', 'sub_map_sub', 'p_map_desc'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%', textAlign: 'center' },
      'Intro Container'
    ),
    h1_map_title: makeHeading(
      'h1_map_title',
      'cont_map_intro',
      'MapSense',
      'h1',
      {
        fontSize: '64px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '10px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Page Title'
    ),
    sub_map_sub: makeParagraph(
      'sub_map_sub',
      'cont_map_intro',
      '<p><strong>Ecosystem Screening made Quick | Scalable | Bespoke</strong></p>',
      {
        fontSize: '24px',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '20px',
      },
      'Subtitle'
    ),
    p_map_desc: makeParagraph(
      'p_map_desc',
      'cont_map_intro',
      '<p>An environment and social screening tool that screens project sites for sensitive receptors.</p>',
      {
        fontSize: '20px',
        lineHeight: '1.6',
        textColor: '#555555',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Description'
    ),

    // ─── 3. Features Section ────────────────────────────────────────────────────
    sec_map_features: makeSection(
      'sec_map_features',
      ['cont_map_features'],
      {
        paddingTop: '40px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#F8FAF7',
      },
      'Features Section'
    ),
    cont_map_features: makeContainer(
      'cont_map_features',
      'sec_map_features',
      ['h2_map_features', 'grid_map_features'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Features Container'
    ),
    h2_map_features: makeHeading(
      'h2_map_features',
      'cont_map_features',
      'Features',
      'h2',
      {
        fontSize: '44px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        marginBottom: '40px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Features Title'
    ),
    grid_map_features: makeGrid(
      'grid_map_features',
      'cont_map_features',
      '3',
      '24px',
      FEATURES.map((_, i) => `card_feat_${i + 1}`),
      {},
      'Features Grid'
    ),

    // ─── 4. 4-Step Process Section ──────────────────────────────────────────────
    sec_map_steps: makeSection(
      'sec_map_steps',
      ['cont_map_steps'],
      {
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Steps Section'
    ),
    cont_map_steps: makeContainer(
      'cont_map_steps',
      'sec_map_steps',
      ['h2_map_steps', 'grid_map_steps'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Steps Container'
    ),
    h2_map_steps: makeHeading(
      'h2_map_steps',
      'cont_map_steps',
      'Easy 4 step process',
      'h2',
      {
        fontSize: '44px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        marginBottom: '48px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Steps Title'
    ),
    grid_map_steps: makeGrid(
      'grid_map_steps',
      'cont_map_steps',
      '4',
      '20px',
      STEPS.map((_, i) => `card_step_${i + 1}`),
      {},
      'Steps Grid'
    ),

    // ─── 5. Sample Reports Section ──────────────────────────────────────────────
    sec_map_reports: makeSection(
      'sec_map_reports',
      ['cont_map_reports'],
      {
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#F8FAF7',
      },
      'Sample Reports Section'
    ),
    cont_map_reports: makeContainer(
      'cont_map_reports',
      'sec_map_reports',
      ['h2_map_reports', 'p_map_reports', 'grid_map_reports'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Reports Container'
    ),
    h2_map_reports: makeHeading(
      'h2_map_reports',
      'cont_map_reports',
      'Proximity Analysis Report',
      'h2',
      {
        fontSize: '44px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Reports Title'
    ),
    p_map_reports: makeParagraph(
      'p_map_reports',
      'cont_map_reports',
      '<p>The report highlights nearby environmental and social receptors and indicates the buffer zone within which they fall. Each receptor is classified by proximity distance – supporting early-stage risk assessment, regulatory compliance, and lender due diligence.</p>',
      {
        fontSize: '18px',
        lineHeight: '1.6',
        textColor: '#555555',
        textAlign: 'center',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '40px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Reports Description'
    ),
    grid_map_reports: makeGrid(
      'grid_map_reports',
      'cont_map_reports',
      '3',
      '24px',
      REPORT_IMAGES.map((_, i) => `img_report_${i + 1}`),
      {},
      'Reports Grid'
    ),

    // ─── 6. Receptor Categories Section ─────────────────────────────────────────
    sec_map_receptors: makeSection(
      'sec_map_receptors',
      ['cont_map_receptors'],
      {
        paddingTop: '70px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Receptors Section'
    ),
    cont_map_receptors: makeContainer(
      'cont_map_receptors',
      'sec_map_receptors',
      ['h2_map_receptors', 'grid_map_receptors'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Receptors Container'
    ),
    h2_map_receptors: makeHeading(
      'h2_map_receptors',
      'cont_map_receptors',
      '10+ Sensitive Environment and Social Receptors',
      'h2',
      {
        fontSize: '44px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        marginBottom: '48px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Receptors Title'
    ),
    grid_map_receptors: makeGrid(
      'grid_map_receptors',
      'cont_map_receptors',
      '3',
      '24px',
      RECEPTORS.map((_, i) => `card_rec_${i + 1}`),
      {},
      'Receptors Grid'
    ),

    // ─── 7. Sectors Section ─────────────────────────────────────────────────────
    sec_map_sectors: makeSection(
      'sec_map_sectors',
      ['cont_map_sectors'],
      {
        paddingTop: '60px',
        paddingBottom: '70px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#F8FAF7',
      },
      'Sectors Section'
    ),
    cont_map_sectors: makeContainer(
      'cont_map_sectors',
      'sec_map_sectors',
      ['badge_map_sectors', 'h2_map_sectors', 'grid_map_sectors'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Sectors Container'
    ),
    badge_map_sectors: makeBadge(
      'badge_map_sectors',
      'cont_map_sectors',
      "WHO IT'S FOR",
      {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '14px',
      },
      "WHO IT'S FOR Eyebrow"
    ),
    h2_map_sectors: makeHeading(
      'h2_map_sectors',
      'cont_map_sectors',
      'MapSense For Multiple Sectors',
      'h2',
      {
        fontSize: '44px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        marginBottom: '40px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Sectors Title'
    ),
    grid_map_sectors: makeGrid(
      'grid_map_sectors',
      'cont_map_sectors',
      '4',
      '20px',
      SECTORS.map((_, i) => `card_msec_${i + 1}`),
      {},
      'Sectors Grid'
    ),

    // ─── 8. Site Sensitivity Insights Section ─────────────────────────────────
    sec_map_insights: makeSection(
      'sec_map_insights',
      ['cont_map_insights'],
      {
        paddingTop: '70px',
        paddingBottom: '40px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Insights Section'
    ),
    cont_map_insights: makeContainer(
      'cont_map_insights',
      'sec_map_insights',
      ['h2_map_insights', 'p_map_insights'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%', textAlign: 'center' },
      'Insights Container'
    ),
    h2_map_insights: makeHeading(
      'h2_map_insights',
      'cont_map_insights',
      'Site Sensitivity Insights for Better Project Decisions',
      'h2',
      {
        fontSize: '44px',
        fontWeight: 400,
        textColor: '#004E35',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Insights Title'
    ),
    p_map_insights: makeParagraph(
      'p_map_insights',
      'cont_map_insights',
      '<p>The screening output highlights key ecological and social sensitivities. It supports early understanding of site constraints, regulatory needs and mitigation planning for lower risk project decisions.</p>',
      {
        fontSize: '18px',
        lineHeight: '1.6',
        textColor: '#555555',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Insights Description'
    ),

    // ─── 9. CTA Section ─────────────────────────────────────────────────────────
    sec_map_cta: makeSection(
      'sec_map_cta',
      ['cont_map_cta'],
      {
        paddingTop: '60px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'CTA Section'
    ),
    cont_map_cta: makeContainer(
      'cont_map_cta',
      'sec_map_cta',
      ['card_map_cta'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'CTA Container'
    ),
    card_map_cta: makeContainer(
      'card_map_cta',
      'cont_map_cta',
      ['h3_map_cta', 'p_map_cta', 'btn_map_cta'],
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
        gap: '20px',
        minHeight: '340px',
      },
      'CTA Card'
    ),
    h3_map_cta: makeHeading(
      'h3_map_cta',
      'card_map_cta',
      'Screen Your Next Project Location with MapSense',
      'h3',
      {
        fontSize: '44px',
        fontWeight: 400,
        textColor: '#FFFFFF',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'CTA Title'
    ),
    p_map_cta: makeParagraph(
      'p_map_cta',
      'card_map_cta',
      '<p>Reach out to our spatial analytics team for automated screening inquiries.</p>',
      { fontSize: '20px', textColor: '#F5F5F0', fontFamily: 'Neue Montreal, sans-serif' },
      'CTA Description'
    ),
    btn_map_cta: makeButton(
      'btn_map_cta',
      'card_map_cta',
      'Request Screening',
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
      'CTA Button'
    ),
  };

  // Populate Features
  FEATURES.forEach((f, idx) => {
    const cardId = `card_feat_${idx + 1}`;
    const titleId = `feat_title_${idx + 1}`;
    const descId = `feat_desc_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_map_features',
      [titleId, descId],
      {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        paddingTop: '28px',
        paddingBottom: '28px',
        paddingLeft: '28px',
        paddingRight: '28px',
        borderColor: 'rgba(0, 0, 0, 0.06)',
        borderWidth: '1px',
        borderStyle: 'solid',
      },
      `${f.title} Card`
    );

    nodes[titleId] = makeHeading(
      titleId,
      cardId,
      `${f.icon} ${f.title}`,
      'h3',
      { fontSize: '20px', fontWeight: 500, textColor: '#004E35', marginBottom: '8px', fontFamily: 'Neue Montreal, sans-serif' },
      `${f.title} Title`
    );

    nodes[descId] = makeParagraph(
      descId,
      cardId,
      `<p>${f.desc}</p>`,
      { fontSize: '15px', lineHeight: '1.6', textColor: '#555555', fontFamily: 'Neue Montreal, sans-serif' },
      `${f.title} Description`
    );
  });

  // Populate Steps
  STEPS.forEach((s, idx) => {
    const cardId = `card_step_${idx + 1}`;
    const numId = `step_num_${idx + 1}`;
    const titleId = `step_title_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_map_steps',
      [numId, titleId],
      {
        backgroundColor: s.bg,
        borderRadius: '16px',
        paddingTop: '28px',
        paddingBottom: '28px',
        paddingLeft: '24px',
        paddingRight: '24px',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      `Step ${s.num} Card`
    );

    nodes[numId] = makeHeading(
      numId,
      cardId,
      `Step ${s.num}`,
      'h4',
      { fontSize: '16px', fontWeight: 600, textColor: s.color, opacity: 0.85, marginBottom: '12px' },
      `Step ${s.num} Number`
    );

    nodes[titleId] = makeParagraph(
      titleId,
      cardId,
      `<p style="color:${s.color}; font-size:18px; font-weight:500; line-height:1.4;">${s.title}</p>`,
      {},
      `Step ${s.num} Title`
    );
  });

  // Populate Report Images
  REPORT_IMAGES.forEach((img, idx) => {
    const imgId = `img_report_${idx + 1}`;
    nodes[imgId] = makeImage(
      imgId,
      'grid_map_reports',
      resolveCmsImage(img.src),
      img.alt,
      { width: '100%', aspectRatio: '4/3', borderRadius: '14px', objectFit: 'contain', backgroundColor: '#FFFFFF' },
      `Report Sample ${idx + 1}`
    );
  });

  // Populate Receptors
  RECEPTORS.forEach((r, idx) => {
    const cardId = `card_rec_${idx + 1}`;
    const titleId = `rec_title_${idx + 1}`;
    const itemsId = `rec_items_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_map_receptors',
      [titleId, itemsId],
      {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderWidth: '1px',
        borderStyle: 'solid',
      },
      `${r.title} Card`
    );

    nodes[titleId] = makeHeading(
      titleId,
      cardId,
      r.title,
      'h3',
      { fontSize: '20px', fontWeight: 500, textColor: '#004E35', marginBottom: '12px' },
      `${r.title} Title`
    );

    nodes[itemsId] = makeParagraph(
      itemsId,
      cardId,
      `<ul style="margin:0; padding-left:20px; list-style:disc; color:#555555; font-size:14px; line-height:1.7;">
        ${r.items.map((it) => `<li>${it}</li>`).join('')}
      </ul>`,
      {},
      `${r.title} List`
    );
  });

  // Populate Sectors
  SECTORS.forEach((sec, idx) => {
    const cardId = `card_msec_${idx + 1}`;
    const nameId = `msec_name_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_map_sectors',
      [nameId],
      {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        textAlign: 'center',
        borderColor: 'rgba(0, 0, 0, 0.06)',
        borderWidth: '1px',
        borderStyle: 'solid',
      },
      `${sec.name} Card`
    );

    nodes[nameId] = makeParagraph(
      nameId,
      cardId,
      `<p style="margin:0; font-size:15px; font-weight:500; color:#393939;">${sec.name}</p>`,
      {},
      `${sec.name} Text`
    );
  });

  return assembleTree(rootIds, nodes);
}
