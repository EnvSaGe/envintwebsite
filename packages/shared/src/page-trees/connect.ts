import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeFlex,
  makeHeading,
  makeParagraph,
  makeForm,
  assembleTree,
  resolveCmsImage,
} from './utils';

export function createConnectPageTree(): PageBlockTree {
  const rootIds: string[] = [
    'sec_conn_hero',
    'sec_conn_card',
    'sec_conn_offices',
  ];

  const nodes: Record<string, BuilderNode> = {
    // ─── 1. Hero Image Banner (Height 333px, connect-header-scaled.jpg) ─────────
    sec_conn_hero: makeSection(
      'sec_conn_hero',
      ['cont_conn_hero'],
      {
        paddingTop: '0',
        paddingBottom: '0',
        paddingLeft: '20px',
        paddingRight: '20px',
        minHeight: '333px',
        backgroundImage: resolveCmsImage('/images/connect-header.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      },
      'Hero Image Banner',
      {
        tablet: { minHeight: '30vh' },
        mobile: { minHeight: '25vh' },
      }
    ),
    cont_conn_hero: makeContainer(
      'cont_conn_hero',
      'sec_conn_hero',
      [],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Hero Container'
    ),

    // ─── 2. Floating Contact Card (marginTop: -68px over hero) ──────────────────
    sec_conn_card: makeSection(
      'sec_conn_card',
      ['cont_conn_card'],
      {
        backgroundColor: 'transparent',
        paddingTop: '0',
        paddingBottom: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'Contact Card Section',
      {
        tablet: { paddingBottom: '60px' },
        mobile: { paddingBottom: '40px' },
      }
    ),
    cont_conn_card: makeContainer(
      'cont_conn_card',
      'sec_conn_card',
      ['card_conn_main'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Card Container'
    ),
    card_conn_main: makeContainer(
      'card_conn_main',
      'cont_conn_card',
      ['p_conn_sub', 'h1_conn_main', 'grid_conn_split'],
      {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
        marginTop: '-68px',
        paddingTop: '50px',
        paddingBottom: '50px',
        paddingLeft: '60px',
        paddingRight: '60px',
        width: '100%',
      },
      {
        tablet: { marginTop: '-83px', paddingTop: '40px', paddingBottom: '40px', paddingLeft: '30px', paddingRight: '30px' },
        mobile: { marginTop: '-110px', paddingTop: '30px', paddingBottom: '30px', paddingLeft: '16px', paddingRight: '16px' },
      },
      'Main Contact Floating Box'
    ),
    p_conn_sub: makeParagraph(
      'p_conn_sub',
      'card_conn_main',
      'Have a specific sustainability challenge we can talk about?',
      {
        fontSize: '18px',
        fontWeight: 500,
        textColor: '#393939',
        textAlign: 'center',
        margin: '0 0 10px 0',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      'Contact Subtitle'
    ),
    h1_conn_main: makeHeading(
      'h1_conn_main',
      'card_conn_main',
      'We would love to connect!',
      'h1',
      {
        fontSize: '48px',
        lineHeight: '56px',
        fontWeight: 500,
        textColor: '#004E35',
        textAlign: 'center',
        margin: '0 0 40px 0',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      {
        mobile: { fontSize: '28px', lineHeight: '34px', margin: '0 0 24px 0' },
      },
      'Main Headline'
    ),

    grid_conn_split: makeGrid(
      'grid_conn_split',
      'card_conn_main',
      ['col_conn_info', 'col_conn_form'],
      {
        gridColumns: 'minmax(0, 380px) minmax(0, 1fr)',
        gap: '40px',
        alignItems: 'stretch',
        width: '100%',
      },
      'Contact Split Layout',
      {
        tablet: { gridColumns: '1fr', gap: '30px' },
        mobile: { gridColumns: '1fr', gap: '24px' },
      }
    ),

    // Left Column: Direct Info with address background
    col_conn_info: makeContainer(
      'col_conn_info',
      'grid_conn_split',
      ['p_email', 'p_hq'],
      {
        backgroundImage: resolveCmsImage('/images/connect-address-bg.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay: 'rgba(5, 30, 25, 0.78)',
        borderRadius: '12px',
        paddingTop: '60px',
        paddingBottom: '60px',
        paddingLeft: '36px',
        paddingRight: '36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '36px',
        minHeight: '380px',
      },
      {
        tablet: { minHeight: 'auto', paddingTop: '40px', paddingBottom: '40px' },
        mobile: { minHeight: 'auto', paddingLeft: '20px', paddingRight: '20px', paddingTop: '32px', paddingBottom: '32px' },
      },
      'Direct Contact Info Panel'
    ),
    p_email: makeParagraph(
      'p_email',
      'col_conn_info',
      '<div style="display: flex; align-items: center; gap: 14px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><a href="mailto:connect@envintglobal.com" style="color: #FFFFFF; font-size: 20px; text-decoration: none; font-weight: 400; font-family: Neue Montreal, sans-serif;">connect@envintglobal.com</a></div>',
      { textColor: '#FFFFFF', fontSize: '20px', margin: '0' },
      'Email Info'
    ),
    p_hq: makeParagraph(
      'p_hq',
      'col_conn_info',
      '<div style="display: flex; align-items: flex-start; gap: 14px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" style="flex-shrink: 0; margin-top: 3px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><div><strong style="display: block; font-size: 20px; font-weight: 500; margin-bottom: 6px; color: #FFFFFF; font-family: Neue Montreal, sans-serif;">Corporate Office:</strong><p style="margin: 0; font-size: 18px; line-height: 26px; color: rgba(255, 255, 255, 0.9); font-family: Neue Montreal, sans-serif;">91 Springboard, Godrej &amp; Boyce, LBS Marg, Vikhroli West, Mumbai 400079</p></div></div>',
      { textColor: '#FFFFFF', fontSize: '18px', margin: '0' },
      'HQ Address'
    ),

    // Right Column: Form Panel
    col_conn_form: makeContainer(
      'col_conn_form',
      'grid_conn_split',
      ['form_conn'],
      {
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '10px',
        paddingRight: '10px',
      },
      {
        tablet: { paddingLeft: '0', paddingRight: '0' },
      },
      'Inquiry Form Panel'
    ),
    form_conn: makeForm(
      'form_conn',
      'col_conn_form',
      { formType: 'contact', action: '/api/forms/contact' },
      { width: '100%' },
      'Contact Inquiry Form'
    ),

    // ─── 3. Office Locations ────────────────────────────────────────────────────
    sec_conn_offices: makeSection(
      'sec_conn_offices',
      ['cont_conn_offices'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '60px',
        paddingBottom: '100px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
      'Our Office Locations',
      {
        tablet: { paddingTop: '40px', paddingBottom: '60px' },
        mobile: { paddingTop: '30px', paddingBottom: '40px' },
      }
    ),
    cont_conn_offices: makeContainer(
      'cont_conn_offices',
      'sec_conn_offices',
      ['h2_offices', 'p_offices', 'flex_offices_pills'],
      { textAlign: 'center', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      'Offices Container'
    ),
    h2_offices: makeHeading(
      'h2_offices',
      'cont_conn_offices',
      'At a city near you!',
      'h2',
      {
        fontSize: '48px',
        textColor: '#004E35',
        textAlign: 'center',
        margin: '0 0 16px 0',
        fontFamily: 'Neue Montreal, sans-serif',
        fontWeight: 400,
      },
      { mobile: { fontSize: '32px' } },
      'Offices Headline'
    ),
    p_offices: makeParagraph(
      'p_offices',
      'cont_conn_offices',
      'Our office locations:',
      {
        fontSize: '24px',
        textColor: '#686868',
        textAlign: 'center',
        margin: '0 0 48px 0',
        fontFamily: 'Neue Montreal, sans-serif',
      },
      { mobile: { fontSize: '18px', margin: '0 0 30px 0' } },
      'Offices Subtitle'
    ),
    flex_offices_pills: makeFlex(
      'flex_offices_pills',
      'cont_conn_offices',
      ['pill_mumbai', 'pill_bangalore', 'pill_pune', 'pill_delhi', 'pill_kolkata', 'pill_hyderabad'],
      {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px 50px',
      },
      'Office Location Pills'
    ),
    pill_mumbai: makeParagraph(
      'pill_mumbai',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 20px; color: #393939;"><svg width="20" height="20" viewBox="0 0 24 24" fill="#004E35"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>Mumbai</div>',
      { margin: '0' },
      'Mumbai Pill'
    ),
    pill_bangalore: makeParagraph(
      'pill_bangalore',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 20px; color: #393939;"><svg width="20" height="20" viewBox="0 0 24 24" fill="#004E35"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>Bangalore</div>',
      { margin: '0' },
      'Bangalore Pill'
    ),
    pill_pune: makeParagraph(
      'pill_pune',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 20px; color: #393939;"><svg width="20" height="20" viewBox="0 0 24 24" fill="#004E35"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>Pune</div>',
      { margin: '0' },
      'Pune Pill'
    ),
    pill_delhi: makeParagraph(
      'pill_delhi',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 20px; color: #393939;"><svg width="20" height="20" viewBox="0 0 24 24" fill="#004E35"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>Delhi NCR</div>',
      { margin: '0' },
      'Delhi NCR Pill'
    ),
    pill_kolkata: makeParagraph(
      'pill_kolkata',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 20px; color: #393939;"><svg width="20" height="20" viewBox="0 0 24 24" fill="#004E35"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>Kolkata</div>',
      { margin: '0' },
      'Kolkata Pill'
    ),
    pill_hyderabad: makeParagraph(
      'pill_hyderabad',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 20px; color: #393939;"><svg width="20" height="20" viewBox="0 0 24 24" fill="#004E35"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>Hyderabad</div>',
      { margin: '0' },
      'Hyderabad Pill'
    ),
  };

  return assembleTree(rootIds, nodes);
}
