import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeFlex,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  makeForm,
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
    // ─── 1. Hero Image Banner ───────────────────────────────────────────────────
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
        backgroundColor: '#FFFFFF',
      },
      { mobile: { minHeight: '260px' } }
    ),
    cont_conn_hero: makeContainer(
      'cont_conn_hero',
      'Hero Image Wrapper',
      'sec_conn_hero',
      ['img_conn_hero'],
      { maxWidth: '100%', width: '100%', paddingLeft: '0', paddingRight: '0' }
    ),
    img_conn_hero: makeImage(
      'img_conn_hero',
      'Sea Link Banner',
      'cont_conn_hero',
      resolveCmsImage('/images/connect-header.webp'),
      'Bandra-Worli Sea Link Mumbai - Connect with Envint',
      {
        height: '380px',
        width: '100%',
        borderRadius: '0',
        objectFit: 'cover',
      },
      { mobile: { height: '260px' } }
    ),

    // ─── 2. Page Heading ────────────────────────────────────────────────────────
    sec_conn_heading: makeSection(
      'sec_conn_heading',
      'Connect Heading Section',
      ['cont_conn_heading'],
      { backgroundColor: '#FFFFFF', paddingTop: '70px', paddingBottom: '30px' }
    ),
    cont_conn_heading: makeContainer(
      'cont_conn_heading',
      'Heading Container',
      'sec_conn_heading',
      ['p_conn_sub', 'h1_conn_main'],
      { textAlign: 'center', maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto' }
    ),
    p_conn_sub: makeParagraph(
      'p_conn_sub',
      'Heading Subtitle',
      'cont_conn_heading',
      'Have a specific sustainability challenge we can talk about?',
      {
        fontSize: '24px',
        textColor: '#393939',
        textAlign: 'center',
        margin: '0 0 12px 0',
        fontFamily: 'Neue Montreal, sans-serif',
      }
    ),
    h1_conn_main: makeHeading(
      'h1_conn_main',
      'Main Headline',
      'cont_conn_heading',
      'We would love to connect!',
      'h1',
      {
        fontSize: '48px',
        textColor: '#004E35',
        textAlign: 'center',
        margin: '0',
        fontFamily: 'Neue Montreal, sans-serif',
      }
    ),

    // ─── 3. Contact Details & Inquiry Form (Split Grid) ─────────────────────────
    sec_conn_channels: makeSection(
      'sec_conn_channels',
      'Contact Details & Inquiries',
      ['cont_conn_channels'],
      { backgroundColor: '#FFFFFF', paddingTop: '30px', paddingBottom: '70px' }
    ),
    cont_conn_channels: makeContainer(
      'cont_conn_channels',
      'Channels Container',
      'sec_conn_channels',
      ['grid_conn_channels'],
      { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }
    ),
    grid_conn_channels: makeGrid(
      'grid_conn_channels',
      'Channels Split Grid',
      'cont_conn_channels',
      ['col_conn_info', 'col_conn_form'],
      {
        gridColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)',
        gap: '0',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
      { tablet: { gridColumns: '1fr' } }
    ),

    // Left Column: Direct Info with Windmill background
    col_conn_info: makeContainer(
      'col_conn_info',
      'Direct Contact Info',
      'grid_conn_channels',
      ['p_email', 'p_hq'],
      {
        backgroundImage: resolveCmsImage('/images/connect-address-bg.webp'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundOverlay: 'rgba(5, 30, 25, 0.75)',
        minHeight: '620px',
        paddingTop: '48px',
        paddingBottom: '48px',
        paddingLeft: '52px',
        paddingRight: '52px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '40px',
        textColor: '#FFFFFF',
      },
      { tablet: { minHeight: 'auto', paddingLeft: '30px', paddingRight: '30px' } }
    ),
    p_email: makeParagraph(
      'p_email',
      'Email Info',
      'col_conn_info',
      '<div style="display: flex; align-items: center; gap: 16px;"><span style="font-size: 1.4rem;">✉</span><a href="mailto:connect@envintglobal.com" style="color: #FFFFFF; font-size: 20px; text-decoration: none; font-weight: 400; font-family: Neue Montreal, sans-serif;">connect@envintglobal.com</a></div>',
      { textColor: '#FFFFFF', fontSize: '20px', margin: '0' }
    ),
    p_hq: makeParagraph(
      'p_hq',
      'HQ Address',
      'col_conn_info',
      '<div style="display: flex; align-items: flex-start; gap: 16px;"><span style="font-size: 1.4rem; margin-top: 2px;">📍</span><div><strong style="display: block; font-size: 20px; font-weight: 500; margin-bottom: 6px; color: #FFFFFF; font-family: Neue Montreal, sans-serif;">Corporate Office:</strong><p style="margin: 0; font-size: 18px; line-height: 26px; color: rgba(255, 255, 255, 0.9); font-family: Neue Montreal, sans-serif;">91 Springboard, Godrej &amp; Boyce, LBS Marg, Vikhroli West, Mumbai 400079</p></div></div>',
      { textColor: '#FFFFFF', fontSize: '18px', margin: '0' }
    ),

    // Right Column: Advisory Inquiry Form Panel
    col_conn_form: makeContainer(
      'col_conn_form',
      'Inquiry Form Panel',
      'grid_conn_channels',
      ['form_conn'],
      {
        backgroundColor: '#FFFFFF',
        paddingTop: '56px',
        paddingBottom: '56px',
        paddingLeft: '52px',
        paddingRight: '52px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      { tablet: { paddingLeft: '30px', paddingRight: '30px' } }
    ),
    form_conn: makeForm(
      'form_conn',
      'Contact Inquiry Form',
      'col_conn_form',
      { formType: 'contact', action: '/api/forms/contact' },
      { width: '100%' }
    ),

    // ─── 4. Office Locations ────────────────────────────────────────────────────
    sec_conn_offices: makeSection(
      'sec_conn_offices',
      'Our Office Locations',
      ['cont_conn_offices'],
      { backgroundColor: '#FFFFFF', paddingTop: '70px', paddingBottom: '110px' }
    ),
    cont_conn_offices: makeContainer(
      'cont_conn_offices',
      'Offices Container',
      'sec_conn_offices',
      ['h2_offices', 'p_offices', 'flex_offices_pills'],
      { textAlign: 'center', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' }
    ),
    h2_offices: makeHeading(
      'h2_offices',
      'Offices Headline',
      'cont_conn_offices',
      'At a city near you!',
      'h2',
      {
        fontSize: '48px',
        textColor: '#004E35',
        textAlign: 'center',
        margin: '0 0 20px 0',
        fontFamily: 'Neue Montreal, sans-serif',
      }
    ),
    p_offices: makeParagraph(
      'p_offices',
      'Offices Subtitle',
      'cont_conn_offices',
      'Our office locations:',
      {
        fontSize: '24px',
        textColor: '#686868',
        textAlign: 'center',
        margin: '0 0 50px 0',
        fontFamily: 'Neue Montreal, sans-serif',
      }
    ),
    flex_offices_pills: makeFlex(
      'flex_offices_pills',
      'Office Location Pills',
      'cont_conn_offices',
      ['pill_mumbai', 'pill_bangalore', 'pill_pune', 'pill_delhi', 'pill_kolkata', 'pill_hyderabad'],
      {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px 50px',
      }
    ),
    pill_mumbai: makeParagraph(
      'pill_mumbai',
      'Mumbai Pill',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 18px; color: #393939;"><span style="font-size: 1.2rem; color: #004E35;">📍</span>Mumbai</div>',
      { margin: '0' }
    ),
    pill_bangalore: makeParagraph(
      'pill_bangalore',
      'Bangalore Pill',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 18px; color: #393939;"><span style="font-size: 1.2rem; color: #004E35;">📍</span>Bangalore</div>',
      { margin: '0' }
    ),
    pill_pune: makeParagraph(
      'pill_pune',
      'Pune Pill',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 18px; color: #393939;"><span style="font-size: 1.2rem; color: #004E35;">📍</span>Pune</div>',
      { margin: '0' }
    ),
    pill_delhi: makeParagraph(
      'pill_delhi',
      'Delhi NCR Pill',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 18px; color: #393939;"><span style="font-size: 1.2rem; color: #004E35;">📍</span>Delhi NCR</div>',
      { margin: '0' }
    ),
    pill_kolkata: makeParagraph(
      'pill_kolkata',
      'Kolkata Pill',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 18px; color: #393939;"><span style="font-size: 1.2rem; color: #004E35;">📍</span>Kolkata</div>',
      { margin: '0' }
    ),
    pill_hyderabad: makeParagraph(
      'pill_hyderabad',
      'Hyderabad Pill',
      'flex_offices_pills',
      '<div style="display: inline-flex; align-items: center; gap: 10px; font-family: Neue Montreal, sans-serif; font-size: 18px; color: #393939;"><span style="font-size: 1.2rem; color: #004E35;">📍</span>Hyderabad</div>',
      { margin: '0' }
    ),
  };

  return assembleTree(rootIds, nodes);
}
