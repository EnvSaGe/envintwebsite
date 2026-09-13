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
  assembleTree,
  resolveCmsImage,
} from './utils';

export function createConnectPageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_conn_hero',
    'sec_conn_heading',
    'sec_conn_channels',
    'sec_conn_offices',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Image ──────────────────────────────────────────────────────────
    sec_conn_hero: makeSection(
      'sec_conn_hero',
      'Hero Image Banner',
      ['cont_conn_hero'],
      {
        paddingTop: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        paddingRight: '0',
        minHeight: '380px',
        overflow: 'hidden',
      },
      { mobile: { minHeight: '260px' } }
    ),
    cont_conn_hero: makeContainer(
      'cont_conn_hero',
      'Hero Image Wrapper',
      'sec_conn_hero',
      ['img_conn_hero'],
      { maxWidth: '100%', width: '100%' }
    ),
    img_conn_hero: makeImage(
      'img_conn_hero',
      'Sea Link Banner',
      'cont_conn_hero',
      '/images/connect-header.webp',
      'Bandra-Worli Sea Link Mumbai - Connect with Envint',
      {
        height: '380px',
        borderRadius: '0',
      },
      { mobile: { height: '260px' } }
    ),

    // ─── 2. Page Heading ────────────────────────────────────────────────────────
    sec_conn_heading: makeSection(
      'sec_conn_heading',
      'Connect Heading Section',
      ['cont_conn_heading'],
      { backgroundColor: '#FFFFFF', paddingTop: '70px', paddingBottom: '40px' }
    ),
    cont_conn_heading: makeContainer(
      'cont_conn_heading',
      'Heading Container',
      'sec_conn_heading',
      ['p_conn_sub', 'h1_conn_main'],
      { textAlign: 'center', maxWidth: '900px' }
    ),
    p_conn_sub: makeParagraph(
      'p_conn_sub',
      'Heading Subtitle',
      'cont_conn_heading',
      'Have a specific sustainability challenge we can talk about?',
      { fontSize: '24px', textColor: '#393939', margin: '0 0 12px 0' }
    ),
    h1_conn_main: makeHeading(
      'h1_conn_main',
      'Main Headline',
      'cont_conn_heading',
      'We would love to connect!',
      'h1',
      { fontSize: '48px', textColor: '#004E35', margin: '0' }
    ),

    // ─── 3. Contact Details & Inquiries ─────────────────────────────────────────
    sec_conn_channels: makeSection(
      'sec_conn_channels',
      'Contact Details & Channels',
      ['cont_conn_channels'],
      { backgroundColor: '#FFFFFF', paddingTop: '40px', paddingBottom: '80px' }
    ),
    cont_conn_channels: makeContainer(
      'cont_conn_channels',
      'Channels Container',
      'sec_conn_channels',
      ['grid_conn_channels']
    ),
    grid_conn_channels: makeGrid(
      'grid_conn_channels',
      'Channels Split Grid',
      'cont_conn_channels',
      ['col_conn_info', 'col_conn_form'],
      { gridColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '48px' },
      { tablet: { gridColumns: '1fr' } }
    ),

    // Left Column: Direct Info
    col_conn_info: makeContainer(
      'col_conn_info',
      'Direct Contact Info',
      'grid_conn_channels',
      ['badge_direct', 'h3_direct', 'p_email', 'p_phone', 'p_hq'],
      {
        backgroundColor: '#004E35',
        borderRadius: '16px',
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        textColor: '#FFFFFF',
      }
    ),
    badge_direct: makeBadge('badge_direct', 'Direct Badge', 'col_conn_info', 'DIRECT INQUIRIES', {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      textColor: '#FFFFFF',
    }),
    h3_direct: makeHeading('h3_direct', 'Direct Title', 'col_conn_info', 'Let’s Start a Conversation', 'h3', {
      textColor: '#FFFFFF',
      fontSize: '28px',
      marginTop: '16px',
      marginBottom: '24px',
    }),
    p_email: makeParagraph(
      'p_email',
      'Email Info',
      'col_conn_info',
      '<strong>General Inquiries:</strong><br /><a href="mailto:connect@envintglobal.com" style="color: #93c5fd; text-decoration: underline;">connect@envintglobal.com</a><br /><br /><strong>Careers & Talent:</strong><br /><a href="mailto:careers@envintglobal.com" style="color: #93c5fd; text-decoration: underline;">careers@envintglobal.com</a>',
      { textColor: '#FFFFFF', fontSize: '17px', lineHeight: '1.6' }
    ),
    p_phone: makeParagraph(
      'p_phone',
      'Phone Info',
      'col_conn_info',
      '<strong>Direct Line:</strong><br />+91 22 4600 5200',
      { textColor: '#FFFFFF', fontSize: '17px', lineHeight: '1.6' }
    ),
    p_hq: makeParagraph(
      'p_hq',
      'HQ Address',
      'col_conn_info',
      '<strong>Corporate Headquarters:</strong><br />Envint Advisory Services Pvt Ltd<br />Mumbai, Maharashtra, India',
      { textColor: '#E2E8F0', fontSize: '16px', lineHeight: '1.6' }
    ),

    // Right Column: Form Panel
    col_conn_form: makeContainer(
      'col_conn_form',
      'Inquiry Form Panel',
      'grid_conn_channels',
      ['h3_form', 'p_form_intro', 'btn_form_submit'],
      {
        backgroundColor: '#F8FAFC',
        borderRadius: '16px',
        padding: '40px',
      }
    ),
    h3_form: makeHeading('h3_form', 'Form Title', 'col_conn_form', 'Send an Advisory Inquiry', 'h3', {
      fontSize: '26px',
      textColor: '#004E35',
      marginBottom: '12px',
    }),
    p_form_intro: makeParagraph(
      'p_form_intro',
      'Form Intro',
      'col_conn_form',
      'Whether you require Scope 3 decarbonization roadmaps, BRSR assurance support, or ESG due diligence for an upcoming transaction, our team will revert within 24 hours.',
      { fontSize: '16px', marginBottom: '28px' }
    ),
    btn_form_submit: makeButton(
      'btn_form_submit',
      'Email Us Button',
      'col_conn_form',
      'Email Advisory Team',
      'mailto:connect@envintglobal.com?subject=Advisory%20Inquiry',
      { width: 'fit-content' }
    ),

    // ─── 4. Office Locations ────────────────────────────────────────────────────
    sec_conn_offices: makeSection(
      'sec_conn_offices',
      'Our Office Locations',
      ['cont_conn_offices'],
      { backgroundColor: '#F8FAFC', paddingTop: '80px', paddingBottom: '90px' }
    ),
    cont_conn_offices: makeContainer(
      'cont_conn_offices',
      'Offices Container',
      'sec_conn_offices',
      ['badge_offices', 'h2_offices', 'p_offices', 'grid_offices']
    ),
    badge_offices: makeBadge('badge_offices', 'Offices Badge', 'cont_conn_offices', 'NATIONAL PRESENCE'),
    h2_offices: makeHeading('h2_offices', 'Offices Headline', 'cont_conn_offices', 'At a City Near You', 'h2', { fontSize: '42px', marginTop: '12px' }),
    p_offices: makeParagraph('p_offices', 'Offices Intro', 'cont_conn_offices', 'Our multidisciplinary teams are stationed across major business centers in India:', { fontSize: '18px', marginBottom: '36px' }),
    grid_offices: makeGrid(
      'grid_offices',
      'Offices 3-Col Grid',
      'cont_conn_offices',
      ['city_1', 'city_2', 'city_3', 'city_4', 'city_5', 'city_6'],
      { gridColumns: 'repeat(3, 1fr)', gap: '20px' },
      { tablet: { gridColumns: 'repeat(2, 1fr)' }, mobile: { gridColumns: '1fr' } }
    ),
    city_1: makeContainer('city_1', 'Mumbai Office', 'grid_offices', ['h4_c1', 'p_c1'], { backgroundColor: '#FFFFFF', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }),
    h4_c1: makeHeading('h4_c1', 'Mumbai', 'city_1', 'Mumbai', 'h4', { fontSize: '22px', textColor: '#004E35', marginBottom: '6px' }),
    p_c1: makeParagraph('p_c1', 'Mumbai Desc', 'city_1', 'Headquarters & Western Region Advisory Hub', { fontSize: '15px' }),

    city_2: makeContainer('city_2', 'Bangalore Office', 'grid_offices', ['h4_c2', 'p_c2'], { backgroundColor: '#FFFFFF', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }),
    h4_c2: makeHeading('h4_c2', 'Bangalore', 'city_2', 'Bangalore', 'h4', { fontSize: '22px', textColor: '#004E35', marginBottom: '6px' }),
    p_c2: makeParagraph('p_c2', 'Bangalore Desc', 'city_2', 'Southern Region & Tech Advisory Practice', { fontSize: '15px' }),

    city_3: makeContainer('city_3', 'Pune Office', 'grid_offices', ['h4_c3', 'p_c3'], { backgroundColor: '#FFFFFF', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }),
    h4_c3: makeHeading('h4_c3', 'Pune', 'city_3', 'Pune', 'h4', { fontSize: '22px', textColor: '#004E35', marginBottom: '6px' }),
    p_c3: makeParagraph('p_c3', 'Pune Desc', 'city_3', 'Industrial Decarbonization & Engineering Hub', { fontSize: '15px' }),

    city_4: makeContainer('city_4', 'Delhi NCR Office', 'grid_offices', ['h4_c4', 'p_c4'], { backgroundColor: '#FFFFFF', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }),
    h4_c4: makeHeading('h4_c4', 'Delhi NCR', 'city_4', 'Delhi NCR', 'h4', { fontSize: '22px', textColor: '#004E35', marginBottom: '6px' }),
    p_c4: makeParagraph('p_c4', 'Delhi Desc', 'city_4', 'Policy, Climate Finance & Northern Region Practice', { fontSize: '15px' }),

    city_5: makeContainer('city_5', 'Kolkata Office', 'grid_offices', ['h4_c5', 'p_c5'], { backgroundColor: '#FFFFFF', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }),
    h4_c5: makeHeading('h4_c5', 'Kolkata', 'city_5', 'Kolkata', 'h4', { fontSize: '22px', textColor: '#004E35', marginBottom: '6px' }),
    p_c5: makeParagraph('p_c5', 'Kolkata Desc', 'city_5', 'Eastern Region & Heavy Industry Center', { fontSize: '15px' }),

    city_6: makeContainer('city_6', 'Hyderabad Office', 'grid_offices', ['h4_c6', 'p_c6'], { backgroundColor: '#FFFFFF', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }),
    h4_c6: makeHeading('h4_c6', 'Hyderabad', 'city_6', 'Hyderabad', 'h4', { fontSize: '22px', textColor: '#004E35', marginBottom: '6px' }),
    p_c6: makeParagraph('p_c6', 'Hyderabad Desc', 'city_6', 'Pharma, Life Sciences & Supply Chain Practice', { fontSize: '15px' }),
  };

  return assembleTree(rootIds, nodes);
}
