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
            minHeight: '65vh',
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
          'Impact Hero Banner'
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
          { fontSize: '64px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline'
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
          ['mod_impact_grid'],
          { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Grid Container'
        ),
        mod_impact_grid: makeDynamicModule('mod_impact_grid', 'impact-grid', 'Impact Case Studies Dynamic Grid', 'cont_imp_grid'),
      };
      return assembleTree(rootIds, nodes);
    }

    case '/enviki': {
      const rootIds = ['sec_wiki_hero', 'sec_wiki_articles'];
      const nodes: Record<string, BuilderNode> = {
        sec_wiki_hero: makeSection(
          'sec_wiki_hero',
          ['cont_wiki_hero'],
          {
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: '140px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/enviki-head.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay:
              'linear-gradient(to top, rgba(0, 30, 20, 0.7) 0%, rgba(0, 30, 20, 0.3) 100%)',
          },
          'Enviki Hero Banner'
        ),
        cont_wiki_hero: makeContainer(
          'cont_wiki_hero',
          'sec_wiki_hero',
          ['h1_wiki_h', 'p_wiki_h'],
          { maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
          'Hero Content'
        ),
        h1_wiki_h: makeHeading(
          'h1_wiki_h',
          'cont_wiki_hero',
          'Enviki',
          'h1',
          { fontSize: '76px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif', marginBottom: '16px' },
          'Headline'
        ),
        p_wiki_h: makeParagraph(
          'p_wiki_h',
          'cont_wiki_hero',
          '<p>Explore Enviki for insights, explainers and practical guides on ESG, sustainability, climate and responsible investment.</p>',
          { fontSize: '24px', textColor: '#F5F5F0', fontFamily: 'Neue Montreal, sans-serif' },
          'Subtitle'
        ),

        sec_wiki_articles: makeSection(
          'sec_wiki_articles',
          ['cont_wiki_articles'],
          { backgroundColor: '#FFFFFF', paddingTop: '80px', paddingBottom: '90px', paddingLeft: '24px', paddingRight: '24px' },
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
        mod_wiki_grid: makeDynamicModule('mod_wiki_grid', 'insights-grid', 'Enviki Articles Grid', 'cont_wiki_articles'),
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
            minHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '160px',
            paddingBottom: '80px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage: resolveCmsImage('/images/envision-hero.webp'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundOverlay:
              'linear-gradient(to top, rgba(0, 25, 20, 0.75) 0%, rgba(0, 25, 20, 0.2) 55%, transparent 100%)',
          },
          'Envision Hero Banner'
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
          { fontSize: '64px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline'
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
        mod_env_grid: makeDynamicModule('mod_env_grid', 'insights-grid', 'Envision Articles Dynamic Grid', 'cont_env_articles'),
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
            minHeight: '65vh',
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
          'Behind the Buzz Hero'
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
          { fontSize: '64px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline'
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
        mod_btb_grid: makeDynamicModule('mod_btb_grid', 'insights-grid', 'Behind the Buzz Dynamic Grid', 'cont_btb_articles'),
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
            minHeight: '65vh',
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
          'How To Articles Hero'
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
          { fontSize: '64px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline'
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
        mod_hta_grid: makeDynamicModule('mod_hta_grid', 'insights-grid', 'How To Articles Dynamic Grid', 'cont_hta_articles'),
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
            minHeight: '65vh',
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
          'Glossary Zone Hero'
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
          { fontSize: '64px', textColor: '#FFFFFF', fontWeight: 400, fontFamily: 'Neue Montreal, sans-serif' },
          'Headline'
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
        mod_glo_grid: makeDynamicModule('mod_glo_grid', 'insights-grid', 'Glossary Articles Dynamic Grid', 'cont_glo_articles'),
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
          ['h1_gbc', 'p_gbc', 'btn_gbc'],
          {
            maxWidth: '860px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '-60px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
            paddingTop: '48px',
            paddingBottom: '48px',
            paddingLeft: '48px',
            paddingRight: '48px',
            textAlign: 'center',
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
          { fontSize: '20px', textColor: '#393939', marginBottom: '28px', fontFamily: 'Neue Montreal, sans-serif' },
          'Text'
        ),
        btn_gbc: makeButton(
          'btn_gbc',
          'cont_gbc_card',
          'Contact Our Team',
          '/connect/',
          'primary',
          { backgroundColor: '#004E35', textColor: '#FFFFFF', paddingLeft: '32px', paddingRight: '32px', paddingTop: '12px', paddingBottom: '12px', borderRadius: '9999px', fontSize: '16px', width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' },
          'CTA Button'
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
