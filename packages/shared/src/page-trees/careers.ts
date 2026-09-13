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
    title: 'Ownership',      desc: 'We recognize and reward team members with the courage and ownership to see through their commitments. Taking charge of one’s responsibilities and holding oneself accountable for one’s actions is a sure way to grow at Envint!',
  },
];

const WDWD_IMAGES = [
  { src: '/images/careers-wdwd-1.webp', alt: 'Collaborative client workshop' },
  { src: '/images/careers-wdwd-2.webp', alt: 'Field visit and environmental baseline' },
  { src: '/images/careers-wdwd-3.webp', alt: 'Multidisciplinary team analysis' },
];

export function createCareersPageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_car_hero',
    'sec_car_wdwd',
    'sec_car_polo',
    'sec_car_typical',
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
      'Building a global sustainability team - second to none',
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
      '<p>Explore a career with us!</p>',
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
      'What do we do?',
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
      '<p>We are a global professional services firm. Our work involves a diverse range of client engagements, where we blend research, analysis, client interactions, site visits, and solution implementation to drive positive change. Explore our current career opportunities and join us in making an impact!</p>',
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
      'What’s the way we work?',
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
      '<p>Our cultural DNA is defined by four key elements, encapsulated by the acronym POLO. Built and nurtured over the years, POLO symbolizes the way we work and interact with each other.</p>',
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
      resolveCmsImage('/images/careers-polo-people.webp'),
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

    // ─── 4. What's A Typical Day Like? ──────────────────────────────────────────
    sec_car_typical: makeSection(
      'sec_car_typical',
      ['cont_car_typical'],
      {
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: '#FFFFFF',
      },
      'Typical Day Section'
    ),
    cont_car_typical: makeContainer(
      'cont_car_typical',
      'sec_car_typical',
      ['h2_car_typical', 'p_car_typical', 'img_car_typical'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Typical Day Container'
    ),
    h2_car_typical: makeHeading(
      'h2_car_typical',
      'cont_car_typical',
      'What’s a typical day like?',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '20px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Typical Day Title'
    ),
    p_car_typical: makeParagraph(
      'p_car_typical',
      'cont_car_typical',
      '<p>There is no typical day at Envint! Each day brings forth its own challenges, learnings and unique experiences. With operations across multiple locations in India and expanding globally, we embrace a hybrid work model, providing flexibility for our team to maintain their own work-life balance. Our cohesive engagement teams are often dispersed across various offices, and we regularly visit client sites across offices, factories, hospitals, farms, project sites, treatment plants and many more!</p>',
      {
        fontSize: '22px',
        lineHeight: '1.65',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '40px',
      },
      'Typical Day Description'
    ),
    img_car_typical: makeImage(
      'img_car_typical',
      'cont_car_typical',
      resolveCmsImage('/images/careers-typical-day.webp'),
      'Envint colleagues at a client site visit',
      { width: '100%', height: 'auto', borderRadius: '16px', objectFit: 'cover' },
      'Typical Day Photo'
    ),

    // ─── 5. What's In It For You Section ────────────────────────────────────────
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
      ['h2_car_wifu', 'p_car_wifu', 'grid_car_wifu'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'WIFU Container'
    ),
    h2_car_wifu: makeHeading(
      'h2_car_wifu',
      'cont_car_wifu',
      'What’s in it for you?',
      'h2',
      {
        fontSize: '48px',
        fontWeight: 400,
        textColor: '#004E35',
        marginBottom: '20px',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'WIFU Title'
    ),
    p_car_wifu: makeParagraph(
      'p_car_wifu',
      'cont_car_wifu',
      '<p>Whether you are a fresher or an experienced professional, we have a role for you at Envint. Expect significant responsibility, sustained learning opportunities, and collaboration with like-minded colleagues. Take charge of your development with plentiful leadership opportunities across domains like due diligence, reporting, sectors like built environment or healthcare, and functions such as marketing and communication. You can own your growth at Envint!</p>',
      {
        fontSize: '22px',
        lineHeight: '1.65',
        textColor: '#393939',
        fontFamily: 'Neue Montreal, sans-serif',
        marginBottom: '40px',
      },
      'WIFU Description'
    ),
    grid_car_wifu: makeGrid(
      'grid_car_wifu',
      'cont_car_wifu',
      '2',
      '24px',
      ['img_wifu_1', 'img_wifu_2'],
      {},
      'WIFU 2-Col Grid'
    ),
    img_wifu_1: makeImage(
      'img_wifu_1',
      'grid_car_wifu',
      resolveCmsImage('/images/careers-wifu-1.webp'),
      'Envint team member working with a client',
      { width: '100%', aspectRatio: '16/10', borderRadius: '16px', objectFit: 'cover' },
      'WIFU Photo 1'
    ),
    img_wifu_2: makeImage(
      'img_wifu_2',
      'grid_car_wifu',
      resolveCmsImage('/images/careers-wifu-2.webp'),
      'Envint colleagues during an engagement',
      { width: '100%', aspectRatio: '16/10', borderRadius: '16px', objectFit: 'cover' },
      'WIFU Photo 2'
    ),

    // ─── 6. Application CTA Section ─────────────────────────────────────────────
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
        backgroundImage: resolveCmsImage('/images/careers-footer.jpg'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay: 'linear-gradient(rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.48))',
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
      'Explore a career with us!',
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
      '<p>We accept candidates from all disciplines as long as you have an interest in sustainability and believe that you can make a difference!</p>',
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
      'Apply Now',
      'mailto:connect@envintglobal.com',
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

  return assembleTree(rootIds, nodes);
}
