import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  makeDynamicModule,
  makeForm,
  assembleTree,
  resolveCmsImage,
} from './utils';

export function createHubPageTree(slug: string): PageBlockTree {
  switch (slug) {
    case '/impact': {
      const rootIds = ['sec_imp_hero', 'sec_imp_grid'];
      const nodes: Record<string, BuilderNode> = {
        sec_imp_hero: makeSection(
          'sec_imp_hero',
          ['cont_imp_hero'],
          {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '160px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/impact-hero-1.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay:
              'linear-gradient(to top, rgba(0, 20, 15, 0.6) 0%, rgba(0, 20, 15, 0.15) 60%, transparent 100%)',
          },
          'Impact Hero Banner',
          {
            tablet: { minHeight: '80vh', paddingBottom: '56px' },
            mobile: { minHeight: '65vh', paddingBottom: '40px' },
          }
        ),
        cont_imp_hero: makeContainer(
          'cont_imp_hero',
          'sec_imp_hero',
          ['h1_imp_h'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Hero Content'
        ),
        h1_imp_h: makeHeading(
          'h1_imp_h',
          'cont_imp_hero',
          'Sustainability and ESG Case Studies',
          'h1',
          { fontSize: '76px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline',
          {
            tablet: { fontSize: '64px' },
            mobile: { fontSize: '34px' },
          }
        ),

        sec_imp_grid: makeSection(
          'sec_imp_grid',
          ['cont_imp_grid'],
          { backgroundColor: '#FFFFFF', paddingTop: '60px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px' },
          'Case Studies Grid Section'
        ),
        cont_imp_grid: makeContainer(
          'cont_imp_grid',
          'sec_imp_grid',
          ['p_imp_intro', 'mod_impact_grid'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Grid Container'
        ),
        p_imp_intro: makeParagraph(
          'p_imp_intro',
          'cont_imp_grid',
          '<p>Envint works with Indian and international corporates, investors, and institutions to integrate sustainability into core business strategy and operations, channel funds into responsible business through ESG principles, and develop low carbon transition plans. Browse featured case studies across sectors and advisory areas below.</p>',
          {
            fontSize: '24px',
            fontWeight: 400,
            textColor: '#393939',
            lineHeight: '35px',
            marginBottom: '40px',
            paddingRight: '10%',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          {
            mobile: { fontSize: '18px', lineHeight: '28px', paddingRight: '0' },
          },
          'Impact Intro'
        ),
        mod_impact_grid: makeDynamicModule('mod_impact_grid', 'impact-grid', 'Impact Case Studies Dynamic Grid', 'cont_imp_grid', { limit: 50 }),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/enviki': {
      const rootIds = ['sec_wiki_hero', 'sec_wiki_intro', 'sec_wiki_articles', 'sec_wiki_subhubs', 'sec_wiki_vantage'];
      const nodes: Record<string, BuilderNode> = {
        sec_wiki_hero: makeSection(
          'sec_wiki_hero',
          ['cont_wiki_hero'],
          {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '160px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/enviki-head.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay:
              'linear-gradient(to top, rgba(0, 30, 20, 0.7) 0%, rgba(0, 30, 20, 0.25) 60%, transparent 100%)',
          },
          'Enviki Hero Banner',
          {
            tablet: { minHeight: '80vh', paddingBottom: '56px' },
            mobile: { minHeight: '65vh', paddingBottom: '40px' },
          }
        ),
        cont_wiki_hero: makeContainer(
          'cont_wiki_hero',
          'sec_wiki_hero',
          ['h1_wiki_h'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Hero Content'
        ),
        h1_wiki_h: makeHeading(
          'h1_wiki_h',
          'cont_wiki_hero',
          'Enviki',
          'h1',
          { fontSize: '76px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline',
          {
            tablet: { fontSize: '64px' },
            mobile: { fontSize: '36px' },
          }
        ),

        // 2. Intro Section
        sec_wiki_intro: makeSection(
          'sec_wiki_intro',
          ['cont_wiki_intro'],
          { backgroundColor: '#FFFFFF', paddingTop: '60px', paddingBottom: '30px', paddingLeft: '24px', paddingRight: '24px' },
          'Enviki Intro Section'
        ),
        cont_wiki_intro: makeContainer(
          'cont_wiki_intro',
          'sec_wiki_intro',
          ['h2_wiki_intro', 'p_wiki_intro'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Intro Container'
        ),
        h2_wiki_intro: makeHeading(
          'h2_wiki_intro',
          'cont_wiki_intro',
          'Decoding Sustainability and ESG',
          'h2',
          { fontSize: '42px', textColor: '#004E35', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif', marginBottom: '20px' },
          'Intro Headline',
          {
            mobile: { fontSize: '28px' },
          }
        ),
        p_wiki_intro: makeParagraph(
          'p_wiki_intro',
          'cont_wiki_intro',
          '<p>Enviki is a sustainability and ESG knowledge platform designed for professionals, students, and anyone curious about the ESG field. From sustainable development and climate risk to ESG frameworks and responsible investing, it helps you grasp the essentials while staying current with emerging regulations, best practices and trends.</p>',
          { fontSize: '22px', lineHeight: '1.65', textColor: '#393939', fontFamily: 'Neue Montreal, sans-serif' },
          { mobile: { fontSize: '18px', lineHeight: '1.5' } },
          'Intro Paragraph'
        ),

        // 3. Popular Articles Section
        sec_wiki_articles: makeSection(
          'sec_wiki_articles',
          ['cont_wiki_articles'],
          { backgroundColor: '#FFFFFF', paddingTop: '40px', paddingBottom: '60px', paddingLeft: '24px', paddingRight: '24px' },
          'Popular Articles Section'
        ),
        cont_wiki_articles: makeContainer(
          'cont_wiki_articles',
          'sec_wiki_articles',
          ['h2_wiki_art', 'mod_wiki_grid'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Articles Container'
        ),
        h2_wiki_art: makeHeading(
          'h2_wiki_art',
          'cont_wiki_articles',
          'Popular Articles',
          'h2',
          { fontSize: '42px', textColor: '#004E35', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif', marginBottom: '40px' },
          'Articles Title'
        ),
        mod_wiki_grid: makeDynamicModule('mod_wiki_grid', 'insights-grid', 'Enviki Articles Grid', 'cont_wiki_articles', { category: 'enviki', limit: 30 }),

        // 4. Sub-Hubs Category Cards Section
        sec_wiki_subhubs: makeSection(
          'sec_wiki_subhubs',
          ['cont_wiki_subhubs'],
          { backgroundColor: '#FFFFFF', paddingTop: '30px', paddingBottom: '50px', paddingLeft: '24px', paddingRight: '24px' },
          'Enviki Subhubs Section'
        ),
        cont_wiki_subhubs: makeContainer(
          'cont_wiki_subhubs',
          'sec_wiki_subhubs',
          ['p_wiki_subhubs'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Subhubs Container'
        ),
        p_wiki_subhubs: makeParagraph(
          'p_wiki_subhubs',
          'cont_wiki_subhubs',
          `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:30px; width:100%; box-sizing:border-box;">
            <a href="/behind-the-buzz/" style="text-decoration:none; display:flex; flex-direction:column; justify-content:flex-end; min-height:340px; padding:200px 24px 24px 24px; border-radius:25px; background-image:url('${resolveCmsImage('/images/buzz-updated.avif')}'); background-size:cover; background-position:center; transition:transform 0.2s ease, box-shadow 0.2s ease; box-shadow:0 8px 24px rgba(0,0,0,0.06);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
              <h3 style="color:#FFFFFF; font-size:32px; font-weight:500; font-family:'Neue Montreal', sans-serif; margin:0; line-height:1.2;">Behind <br />the Buzz</h3>
            </a>
            <a href="/glossary-zone/" style="text-decoration:none; display:flex; flex-direction:column; justify-content:flex-end; min-height:340px; padding:200px 24px 24px 24px; border-radius:25px; background-image:url('${resolveCmsImage('/images/glossary-zone-enviki.avif')}'); background-size:cover; background-position:center; transition:transform 0.2s ease, box-shadow 0.2s ease; box-shadow:0 8px 24px rgba(0,0,0,0.06);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
              <h3 style="color:#FFFFFF; font-size:32px; font-weight:500; font-family:'Neue Montreal', sans-serif; margin:0; line-height:1.2;">Glossary <br />Zone</h3>
            </a>
            <a href="/how-to-articles/" style="text-decoration:none; display:flex; flex-direction:column; justify-content:flex-end; min-height:340px; padding:200px 24px 24px 24px; border-radius:25px; background-image:url('${resolveCmsImage('/images/how-to-article.avif')}'); background-size:cover; background-position:center; transition:transform 0.2s ease, box-shadow 0.2s ease; box-shadow:0 8px 24px rgba(0,0,0,0.06);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
              <h3 style="color:#FFFFFF; font-size:32px; font-weight:500; font-family:'Neue Montreal', sans-serif; margin:0; line-height:1.2;">How to <br />Articles</h3>
            </a>
          </div>`,
          {},
          'Sub-Hubs Cards Grid'
        ),

        // 5. Vantage 2025 Report Banner Section
        sec_wiki_vantage: makeSection(
          'sec_wiki_vantage',
          ['cont_wiki_vantage'],
          { backgroundColor: '#FFFFFF', paddingTop: '20px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px' },
          'Vantage Banner Section'
        ),
        cont_wiki_vantage: makeContainer(
          'cont_wiki_vantage',
          'sec_wiki_vantage',
          ['p_wiki_vantage_card'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Vantage Container'
        ),
        p_wiki_vantage_card: makeParagraph(
          'p_wiki_vantage_card',
          'cont_wiki_vantage',
          `<div style="border-radius:25px; background-image:url('${resolveCmsImage('/images/vantage-bg-image.avif')}'); background-size:cover; background-position:center; padding:56px 48px; color:#FFFFFF; display:flex; flex-direction:column; align-items:flex-start; box-shadow:0 12px 36px rgba(0,0,0,0.08);">
            <h2 style="color:#FFFFFF; font-size:36px; font-weight:500; font-family:'Neue Montreal', sans-serif; margin:0 0 16px 0; line-height:1.2;">Vantage 2025: The ESG Reset Opportunity</h2>
            <p style="color:#FFFFFF; font-size:18px; line-height:1.6; font-family:'Neue Montreal', sans-serif; max-width:680px; margin:0 0 28px 0;">Despite global pushback, ESG momentum in India is rising. This report shows that a strong rebound is underway, as responsible practices remain essential for long-term business growth and resilience. Our report, Vantage, offers expert insights to navigate this evolving ESG landscape.</p>
            <a href="https://envintglobal.com/wp-content/uploads/2025/06/Envint-Vantage-ESG-Reset.pdf" target="_blank" rel="noopener noreferrer" style="display:inline-block; background-color:#FFFFFF; color:#004E35; font-size:16px; font-weight:500; font-family:'Neue Montreal', sans-serif; text-decoration:none; padding:12px 28px; border-radius:9999px; transition:all 0.2s ease;">Read the report now</a>
          </div>`,
          {},
          'Vantage 2025 Promo Card'
        ),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/envision': {
      const rootIds = ['sec_env_hero', 'sec_env_articles'];
      const nodes: Record<string, BuilderNode> = {
        sec_env_hero: makeSection(
          'sec_env_hero',
          ['cont_env_hero'],
          {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '160px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/Envision-header.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay:
              'linear-gradient(to top, rgba(0, 25, 20, 0.75) 0%, rgba(0, 25, 20, 0.2) 55%, transparent 100%)',
          },
          'Envision Hero Banner',
          {
            tablet: { minHeight: '80vh', paddingBottom: '56px' },
            mobile: { minHeight: '65vh', paddingBottom: '40px' },
          }
        ),
        cont_env_hero: makeContainer(
          'cont_env_hero',
          'sec_env_hero',
          ['h1_env_h'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Hero Content'
        ),
        h1_env_h: makeHeading(
          'h1_env_h',
          'cont_env_hero',
          'News & Insights',
          'h1',
          { fontSize: '76px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline',
          {
            tablet: { fontSize: '64px' },
            mobile: { fontSize: '36px' },
          }
        ),

        sec_env_articles: makeSection(
          'sec_env_articles',
          ['cont_env_articles'],
          { backgroundColor: '#FFFFFF', paddingTop: '80px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px' },
          'Articles Section'
        ),
        cont_env_articles: makeContainer(
          'cont_env_articles',
          'sec_env_articles',
          ['mod_env_grid'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Articles Container'
        ),
        mod_env_grid: makeDynamicModule('mod_env_grid', 'insights-grid', 'Envision Articles Dynamic Grid', 'cont_env_articles', { category: 'envision', limit: 50 }),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/behind-the-buzz': {
      const rootIds = ['sec_btb_hero', 'sec_btb_articles'];
      const nodes: Record<string, BuilderNode> = {
        sec_btb_hero: makeSection(
          'sec_btb_hero',
          ['cont_btb_hero'],
          {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '160px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/Behind-the-buzz-header.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay: 'rgba(41, 37, 37, 0.5)',
          },
          'Behind the Buzz Hero',
          {
            tablet: { minHeight: '80vh', paddingBottom: '56px' },
            mobile: { minHeight: '65vh', paddingBottom: '40px' },
          }
        ),
        cont_btb_hero: makeContainer(
          'cont_btb_hero',
          'sec_btb_hero',
          ['h1_btb_h'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Hero Content'
        ),
        h1_btb_h: makeHeading(
          'h1_btb_h',
          'cont_btb_hero',
          'Behind the Buzz',
          'h1',
          { fontSize: '76px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline',
          {
            tablet: { fontSize: '64px' },
            mobile: { fontSize: '36px' },
          }
        ),

        sec_btb_articles: makeSection(
          'sec_btb_articles',
          ['cont_btb_articles'],
          { backgroundColor: '#FFFFFF', paddingTop: '80px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px' },
          'Articles Section'
        ),
        cont_btb_articles: makeContainer(
          'cont_btb_articles',
          'sec_btb_articles',
          ['mod_btb_grid'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Articles Container'
        ),
        mod_btb_grid: makeDynamicModule('mod_btb_grid', 'insights-grid', 'Behind the Buzz Dynamic Grid', 'cont_btb_articles', { category: 'behind-the-buzz', limit: 20 }),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/how-to-articles': {
      const rootIds = ['sec_hta_hero', 'sec_hta_articles'];
      const nodes: Record<string, BuilderNode> = {
        sec_hta_hero: makeSection(
          'sec_hta_hero',
          ['cont_hta_hero'],
          {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '160px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/How-to-header.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay: 'rgba(41, 37, 37, 0.5)',
          },
          'How To Articles Hero',
          {
            tablet: { minHeight: '80vh', paddingBottom: '56px' },
            mobile: { minHeight: '65vh', paddingBottom: '40px' },
          }
        ),
        cont_hta_hero: makeContainer(
          'cont_hta_hero',
          'sec_hta_hero',
          ['h1_hta_h'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Hero Content'
        ),
        h1_hta_h: makeHeading(
          'h1_hta_h',
          'cont_hta_hero',
          'How to Articles',
          'h1',
          { fontSize: '76px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline',
          {
            tablet: { fontSize: '64px' },
            mobile: { fontSize: '36px' },
          }
        ),

        sec_hta_articles: makeSection(
          'sec_hta_articles',
          ['cont_hta_articles'],
          { backgroundColor: '#FFFFFF', paddingTop: '80px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px' },
          'Articles Section'
        ),
        cont_hta_articles: makeContainer(
          'cont_hta_articles',
          'sec_hta_articles',
          ['mod_hta_grid'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Articles Container'
        ),
        mod_hta_grid: makeDynamicModule('mod_hta_grid', 'insights-grid', 'How To Articles Dynamic Grid', 'cont_hta_articles', { category: 'how-to-articles', limit: 20 }),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/glossary-zone': {
      const rootIds = ['sec_glo_hero', 'sec_glo_articles'];
      const nodes: Record<string, BuilderNode> = {
        sec_glo_hero: makeSection(
          'sec_glo_hero',
          ['cont_glo_hero'],
          {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '160px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/Glossary-zone-header.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay: 'rgba(41, 37, 37, 0.5)',
          },
          'Glossary Zone Hero',
          {
            tablet: { minHeight: '80vh', paddingBottom: '56px' },
            mobile: { minHeight: '65vh', paddingBottom: '40px' },
          }
        ),
        cont_glo_hero: makeContainer(
          'cont_glo_hero',
          'sec_glo_hero',
          ['h1_glo_h'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Hero Content'
        ),
        h1_glo_h: makeHeading(
          'h1_glo_h',
          'cont_glo_hero',
          'Glossary Zone',
          'h1',
          { fontSize: '76px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline',
          {
            tablet: { fontSize: '64px' },
            mobile: { fontSize: '36px' },
          }
        ),

        sec_glo_articles: makeSection(
          'sec_glo_articles',
          ['cont_glo_articles'],
          { backgroundColor: '#FFFFFF', paddingTop: '80px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px' },
          'Articles Section'
        ),
        cont_glo_articles: makeContainer(
          'cont_glo_articles',
          'sec_glo_articles',
          ['mod_glo_grid'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Articles Container'
        ),
        mod_glo_grid: makeDynamicModule('mod_glo_grid', 'insights-grid', 'Glossary Articles Dynamic Grid', 'cont_glo_articles', { category: 'glossary-zone', limit: 20 }),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/esq': {
      const rootIds = ['sec_esq_main'];
      const nodes: Record<string, BuilderNode> = {
        sec_esq_main: makeSection(
          'sec_esq_main',
          ['cont_esq_main'],
          { paddingTop: '140px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#FFFFFF' },
          'ESQ Tool Section'
        ),
        cont_esq_main: makeContainer(
          'cont_esq_main',
          'sec_esq_main',
          ['h1_esq', 'p_esq', 'btn_esq'],
          { maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' },
          'ESQ Container'
        ),
        h1_esq: makeHeading(
          'h1_esq',
          'cont_esq_main',
          'ESQ — ESG Intelligence Tool',
          'h1',
          { fontSize: '56px', fontWeight: 400, textColor: '#004E35', marginBottom: '20px', fontFamily: 'Neue Montreal, sans-serif' },
          'Headline'
        ),
        p_esq: makeParagraph(
          'p_esq',
          'cont_esq_main',
          '<p>Envint ESQ provides structured ESG intelligence, benchmarking and automated compliance assessment to help businesses navigate environmental, social and governance requirements.</p>',
          { fontSize: '22px', lineHeight: '1.6', textColor: '#393939', marginBottom: '32px', fontFamily: 'Neue Montreal, sans-serif' },
          'Description'
        ),
        btn_esq: makeButton(
          'btn_esq',
          'cont_esq_main',
          'Launch ESQ Platform →',
          'https://envintsq.com/',
          'primary',
          { backgroundColor: '#004E35', textColor: '#FFFFFF', paddingLeft: '32px', paddingRight: '32px', paddingTop: '14px', paddingBottom: '14px', borderRadius: '9999px', fontSize: '18px', width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' },
          'Launch Button'
        ),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/connect-gbc2024': {
      const rootIds = ['sec_gbc_hero', 'sec_gbc_card'];
      const nodes: Record<string, BuilderNode> = {
        sec_gbc_hero: makeSection(
          'sec_gbc_hero',
          ['cont_gbc_hero'],
          { paddingTop: '0', paddingBottom: '0', paddingLeft: '0', paddingRight: '0', height: '340px', overflow: 'hidden' },
          'GBC Hero'
        ),
        cont_gbc_hero: makeContainer('cont_gbc_hero', 'sec_gbc_hero', ['img_gbc_hero'], { maxWidth: '100%', width: '100%' }),
        img_gbc_hero: makeImage(
          'img_gbc_hero',
          'cont_gbc_hero',
          resolveCmsImage('/images/connect-header.webp'),
          'Connect with Envint at GBC 2024',
          { width: '100%', height: '340px', objectFit: 'cover' },
          'Header Image'
        ),

        sec_gbc_card: makeSection(
          'sec_gbc_card',
          ['cont_gbc_card'],
          { backgroundColor: '#FFFFFF', paddingTop: '0', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' },
          'Card Section'
        ),
        cont_gbc_card: makeContainer(
          'cont_gbc_card',
          'sec_gbc_card',
          ['h1_gbc', 'p_gbc', 'grid_gbc_content'],
          {
            maxWidth: '960px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '-80px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(18, 17, 39, 0.08)',
            paddingTop: '48px',
            paddingBottom: '48px',
            paddingLeft: '48px',
            paddingRight: '48px',
          },
          'Floating Card'
        ),
        h1_gbc: makeHeading(
          'h1_gbc',
          'cont_gbc_card',
          "Thank you for visiting us at the 'Green Building Congress'!",
          'h1',
          { fontSize: '42px', fontWeight: 400, textColor: '#004E35', marginBottom: '16px', fontFamily: 'Neue Montreal, sans-serif' },
          'Title'
        ),
        p_gbc: makeParagraph(
          'p_gbc',
          'cont_gbc_card',
          '<p>Please share a few details to access our knowledge resources and connect with our team.</p>',
          { fontSize: '20px', textColor: '#393939', marginBottom: '40px', fontFamily: 'Neue Montreal, sans-serif' },
          'Text'
        ),
        grid_gbc_content: makeGrid(
          'grid_gbc_content',
          'GBC Content Split',
          'cont_gbc_card',
          ['col_gbc_info', 'col_gbc_form'],
          { gridColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }
        ),
        col_gbc_info: makeContainer(
          'col_gbc_info',
          'Contact Details Panel',
          'grid_gbc_content',
          ['p_gbc_info_content'],
          {
            backgroundColor: '#F7FBF9',
            borderRadius: '16px',
            paddingTop: '36px',
            paddingBottom: '36px',
            paddingLeft: '36px',
            paddingRight: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            border: '1px solid #E5EAE7',
          }
        ),
        p_gbc_info_content: makeParagraph(
          'p_gbc_info_content',
          'Contact Info Details',
          'col_gbc_info',
          '<div style="display:flex;flex-direction:column;gap:24px;"><div style="display:flex;align-items:center;gap:16px;"><span style="font-size:1.4rem;">✉</span><a href="mailto:connect@envintglobal.com" style="color:#004E35;font-size:18px;font-weight:500;text-decoration:none;font-family:Neue Montreal, sans-serif;">connect@envintglobal.com</a></div><div style="display:flex;align-items:flex-start;gap:16px;"><span style="font-size:1.4rem;margin-top:2px;">📍</span><div><strong style="display:block;font-size:16px;color:#004E35;margin-bottom:4px;font-family:Neue Montreal, sans-serif;">Corporate Office:</strong><p style="margin:0;font-size:16px;line-height:1.6;color:#404040;font-family:Neue Montreal, sans-serif;">91 Springboard, Godrej &amp; Boyce, LBS Marg, Vikhroli West, Mumbai 400079</p></div></div></div>',
          { margin: '0' }
        ),
        col_gbc_form: makeContainer(
          'col_gbc_form',
          'GBC Form Container',
          'grid_gbc_content',
          ['form_gbc'],
          { width: '100%' }
        ),
        form_gbc: makeForm(
          'form_gbc',
          'GBC Form',
          'col_gbc_form',
          { formType: 'gbc', action: '/api/forms/gbc' },
          { width: '100%' }
        ),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/disclaimer':
    default: {
      const rootIds = ['sec_disc_main'];
      const nodes: Record<string, BuilderNode> = {
        sec_disc_main: makeSection(
          'sec_disc_main',
          ['cont_disc_main'],
          { paddingTop: '140px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#FFFFFF' },
          'Disclaimer Section'
        ),
        cont_disc_main: makeContainer(
          'cont_disc_main',
          'sec_disc_main',
          ['h1_disc', 'p_disc_text'],
          { maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' },
          'Disclaimer Container'
        ),
        h1_disc: makeHeading(
          'h1_disc',
          'cont_disc_main',
          'Disclaimer',
          'h1',
          { fontSize: '44px', fontWeight: 400, textColor: '#141414', marginBottom: '24px', fontFamily: 'Neue Montreal, sans-serif' },
          'Title'
        ),
        p_disc_text: makeParagraph(
          'p_disc_text',
          'cont_disc_main',
          `<p style="font-size:18px; line-height:1.75; color:#393939; margin-bottom:24px;">The information contained in this website is for general information purposes only. The information is provided by www.envintglobal.com, a property of Envint Services LLP. While we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.</p>
          <p style="font-size:18px; line-height:1.75; color:#393939; margin-bottom:24px;">Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>
          <p style="font-size:18px; line-height:1.75; color:#393939;">Through this website you are able to link to other websites which are not under the control of Envint Services LLP. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>`,
          {},
          'Legal Disclaimer Copy'
        ),
      };
      return assembleTree(rootIds, nodes);
    }
  }
}
