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

const POLO_VALUES = [
  {
    title: 'Professionalism',
    desc: 'We foster an environment of mutual respect and professional integrity. From meeting etiquettes to transparency in our client communication, we hold ourselves to a high standard of quality.',
  },
  {
    title: 'Openness',
    desc: 'At Envint, every voice is valued, fostering an environment where questions, challenges, and diverse opinions are encouraged and respected regardless of experience or tenure.',
  },
  {
    title: 'Learning',
    desc: 'Every day brings forth new developments in our field. Embracing a shared learning approach, we adapt to industry developments, filtering essential insights to stay ahead.',
  },
  {
    title: 'Ownership',
    desc: 'We recognize and reward team members with the courage to see through their commitments. Taking charge of one’s responsibilities is a sure way to grow at Envint!',
  },
];

const WDWD_IMAGES = [
  { src: '/images/careers-wdwd-1.webp', alt: 'Collaborative client workshop' },
  { src: '/images/careers-wdwd-2.webp', alt: 'Field visit and environmental baseline' },
  { src: '/images/careers-wdwd-3.webp', alt: 'Multidisciplinary team analysis' },
];

const WIFU_CARDS = [
  { src: '/images/careers-wifu-1.webp', title: 'Accelerated Growth', desc: 'Fast-track career trajectory with immediate exposure to marquee engagements.' },
  { src: '/images/careers-wifu-2.webp', title: 'Continuous Mentorship', desc: 'Learn directly from founding partners and seasoned industry practitioners.' },
  { src: '/images/careers-wifu-3.webp', title: 'Global Mandates', desc: 'Work across cross-border projects spanning South Asia, APAC, and EMEA markets.' },
  { src: '/images/careers-wifu-4.webp', title: 'Impact Culture', desc: 'Your work directly drives real-world decarbonization and responsible capital flows.' },
];

export function createCareersPageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_car_hero',
    'sec_car_wdwd',
    'sec_car_polo',
    'sec_car_wifu',
    'sec_car_cta',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Section ────────────────────────────────────────────────────────
    sec_car_hero: makeSection(
      'sec_car_hero',
      ['cont_car_hero'],
      {
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: '180px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundImage: resolveCmsImage('/images/careers-hero.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay:
          'linear-gradient(to top, rgba(0, 20, 15, 0.65) 0%, rgba(0, 20, 15, 0.2) 60%, transparent 100%)',
      },
      'Careers Hero Banner'
    ),
    cont_car_hero: makeContainer(
      'cont_car_hero',
      'sec_car_hero',
      ['h1_car_hero', 'sub_car_hero'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Hero Content'
    ),
    h1_car_hero: makeHeading(
      'h1_car_hero',
      'cont_car_hero',
      'We are always looking for people who can make a difference',
      'h1',
      {
        fontSize: '64px',
        textColor: '#FFFFFF',
        fontWeight: 400,
        lineHeight: '1.15',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '16px',
        maxWidth: '1080px',
      },
      'Hero Headline'
    ),
    sub_car_hero: makeParagraph(
      'sub_car_hero',
      'cont_car_hero',
      '<p>Are you ready to create positive impact with your career?</p>',
      {
        fontSize: '28px',
        textColor: '#F5F5F0',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Hero Subtitle'
    ),

    // ─── 2. What We Do Section ──────────────────────────────────────────────────
    sec_car_wdwd: makeSection(
      'sec_car_wdwd',
      ['cont_car_wdwd'],
      {
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'What We Do Section'
    ),
    cont_car_wdwd: makeContainer(
      'cont_car_wdwd',
      'sec_car_wdwd',
      ['h2_car_wdwd', 'p_car_wdwd', 'grid_car_wdwd'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'What We Do Container'
    ),
    h2_car_wdwd: makeHeading(
      'h2_car_wdwd',
      'cont_car_wdwd',
      'What We Do',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '20px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'What We Do Title'
    ),
    p_car_wdwd: makeParagraph(
      'p_car_wdwd',
      'cont_car_wdwd',
      '<p>Envint is a global professional services firm working in the area of sustainability and ESG. We help organizations integrate sustainability into strategy and operations, manage climate risks, and channelize responsible investment.</p>',
      {
        fontSize: '22px',
        lineHeight: '1.6',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '40px',
      },
      'What We Do Paragraph'
    ),
    grid_car_wdwd: makeGrid(
      'grid_car_wdwd',
      'cont_car_wdwd',
      '3',
      '24px',
      ['img_wdwd_1', 'img_wdwd_2', 'img_wdwd_3'],
      {},
      'WDWD Image Grid'
    ),
    img_wdwd_1: makeImage(
      'img_wdwd_1',
      'grid_car_wdwd',
      resolveCmsImage(WDWD_IMAGES[0].src),
      WDWD_IMAGES[0].alt,
      { width: '100%', aspectRatio: '4/3', borderRadius: '16px', objectFit: 'cover' },
      'WDWD Photo 1'
    ),
    img_wdwd_2: makeImage(
      'img_wdwd_2',
      'grid_car_wdwd',
      resolveCmsImage(WDWD_IMAGES[1].src),
      WDWD_IMAGES[1].alt,
      { width: '100%', aspectRatio: '4/3', borderRadius: '16px', objectFit: 'cover' },
      'WDWD Photo 2'
    ),
    img_wdwd_3: makeImage(
      'img_wdwd_3',
      'grid_car_wdwd',
      resolveCmsImage(WDWD_IMAGES[2].src),
      WDWD_IMAGES[2].alt,
      { width: '100%', aspectRatio: '4/3', borderRadius: '16px', objectFit: 'cover' },
      'WDWD Photo 3'
    ),

    // ─── 3. POLO Values Section ─────────────────────────────────────────────────
    sec_car_polo: makeSection(
      'sec_car_polo',
      ['cont_car_polo'],
      {
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#F8FAF7',
      },
      'Our Culture & POLO Values Section'
    ),
    cont_car_polo: makeContainer(
      'cont_car_polo',
      'sec_car_polo',
      ['h2_car_polo', 'sub_car_polo', 'grid_car_polo_split'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'POLO Container'
    ),
    h2_car_polo: makeHeading(
      'h2_car_polo',
      'cont_car_polo',
      'Our Culture',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '10px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Our Culture Title'
    ),
    sub_car_polo: makeParagraph(
      'sub_car_polo',
      'cont_car_polo',
      '<p><strong>POLO</strong>: Professionalism, Openness, Learning, Ownership</p>',
      {
        fontSize: '24px',
        textColor: '#757575',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '48px',
      },
      'POLO Subtitle'
    ),
    grid_car_polo_split: makeGrid(
      'grid_car_polo_split',
      'cont_car_polo',
      '2',
      '40px',
      ['col_polo_img', 'col_polo_cards'],
      {},
      'POLO Split Layout'
    ),
    col_polo_img: makeContainer(
      'col_polo_img',
      'grid_car_polo_split',
      ['img_polo_culture'],
      {},
      'POLO Image Column'
    ),
    img_polo_culture: makeImage(
      'img_polo_culture',
      'col_polo_img',
      resolveCmsImage('/images/careers-polo.webp'),
      'Envint team members collaborating',
      { width: '100%', height: '100%', minHeight: '440px', borderRadius: '20px', objectFit: 'cover' },
      'POLO Culture Photo'
    ),
    col_polo_cards: makeContainer(
      'col_polo_cards',
      'grid_car_polo_split',
      POLO_VALUES.map((_, i) => `card_polo_${i + 1}`),
      { display: 'flex', flexDirection: 'column', gap: '20px' },
      'POLO Values Column'
    ),

    // ─── 4. What's In It For You Section ────────────────────────────────────────
    sec_car_wifu: makeSection(
      'sec_car_wifu',
      ['cont_car_wifu'],
      {
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'What’s In It For You Section'
    ),
    cont_car_wifu: makeContainer(
      'cont_car_wifu',
      'sec_car_wifu',
      ['h2_car_wifu', 'grid_car_wifu'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'WIFU Container'
    ),
    h2_car_wifu: makeHeading(
      'h2_car_wifu',
      'cont_car_wifu',
      'What’s In It For You',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '48px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'WIFU Title'
    ),
    grid_car_wifu: makeGrid(
      'grid_car_wifu',
      'cont_car_wifu',
      '4',
      '24px',
      WIFU_CARDS.map((_, i) => `card_wifu_${i + 1}`),
      {},
      'WIFU 4-Col Grid'
    ),

    // ─── 5. Application CTA Section ─────────────────────────────────────────────
    sec_car_cta: makeSection(
      'sec_car_cta',
      ['cont_car_cta'],
      {
        paddingTop: '40px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Application CTA Section'
    ),
    cont_car_cta: makeContainer(
      'cont_car_cta',
      'sec_car_cta',
      ['card_car_cta'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'CTA Container'
    ),
    card_car_cta: makeContainer(
      'card_car_cta',
      'cont_car_cta',
      ['h3_car_cta', 'p_car_cta', 'btn_car_cta'],
      {
        backgroundImage: resolveCmsImage('/images/careers-footer.webp'),
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
      'CTA Banner Card'
    ),
    h3_car_cta: makeHeading(
      'h3_car_cta',
      'card_car_cta',
      'Ready to start your journey?',
      'h3',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#FFFFFF',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'CTA Title'
    ),
    p_car_cta: makeParagraph(
      'p_car_cta',
      'card_car_cta',
      '<p>If you are looking to build a career in sustainability, send in your resume to careers@envintglobal.com</p>',
      {
        fontSize: '20px',
        textColor: '#F5F5F0',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'CTA Description'
    ),
    btn_car_cta: makeButton(
      'btn_car_cta',
      'card_car_cta',
      'Apply via Email',
      'mailto:careers@envintglobal.com',
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
      'Apply Button'
    ),
  };

  // Populate POLO cards
  POLO_VALUES.forEach((v, idx) => {
    const cardId = `card_polo_${idx + 1}`;
    const titleId = `polo_title_${idx + 1}`;
    const descId = `polo_desc_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'col_polo_cards',
      [titleId, descId],
      {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '28px',
        paddingRight: '28px',
        borderColor: 'rgba(0, 0, 0, 0.06)',
        borderWidth: '1px',
        borderStyle: 'solid',
      },
      `${v.title} Card`
    );

    nodes[titleId] = makeHeading(
      titleId,
      cardId,
      v.title,
      'h3',
      {
        fontSize: '24px',
        fontWeight: 500,
        textColor: '#C65102', // Exact live orange
        marginBottom: '8px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${v.title} Title`
    );

    nodes[descId] = makeParagraph(
      descId,
      cardId,
      `<p>${v.desc}</p>`,
      {
        fontSize: '16px',
        lineHeight: '1.6',
        textColor: '#4B5563',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${v.title} Description`
    );
  });

  // Populate WIFU cards
  WIFU_CARDS.forEach((c, idx) => {
    const cardId = `card_wifu_${idx + 1}`;
    const imgId = `wifu_img_${idx + 1}`;
    const titleId = `wifu_title_${idx + 1}`;
    const descId = `wifu_desc_${idx + 1}`;

    nodes[cardId] = makeContainer(
      cardId,
      'grid_car_wifu',
      [imgId, titleId, descId],
      {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderWidth: '1px',
        borderStyle: 'solid',
        paddingBottom: '24px',
      },
      `${c.title} Card`
    );

    nodes[imgId] = makeImage(
      imgId,
      cardId,
      resolveCmsImage(c.src),
      c.title,
      { width: '100%', aspectRatio: '16/10', objectFit: 'cover', marginBottom: '16px' },
      `${c.title} Image`
    );

    nodes[titleId] = makeHeading(
      titleId,
      cardId,
      c.title,
      'h3',
      {
        fontSize: '20px',
        fontWeight: 500,
        textColor: '#0E0E2C',
        paddingLeft: '20px',
        paddingRight: '20px',
        marginBottom: '8px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${c.title} Title`
    );

    nodes[descId] = makeParagraph(
      descId,
      cardId,
      `<p>${c.desc}</p>`,
      {
        fontSize: '14px',
        lineHeight: '1.6',
        textColor: 'rgba(0, 0, 0, 0.6)',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      `${c.title} Description`
    );
  });

  return assembleTree(rootIds, nodes);
}
