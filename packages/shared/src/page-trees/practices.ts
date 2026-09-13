import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeGrid,
  makeHeading,
  makeParagraph,
  makeImage,
  makeButton,
  makeAccordion,
  makeAccordionItem,
  assembleTree,
  resolveCmsImage,
} from './utils';

interface PracticeData {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  offeringsSubtitle: string;
  offerings: Array<{
    num: string;
    title: string;
    img: string;
    alt: string;
    desc: string;
    points: string[];
  }>;
  impactItems: Array<{
    title: string;
    img: string;
    alt: string;
    excerpt: string;
    href: string;
  }>;
}

const PRACTICES_DATA: Record<string, PracticeData> = {
  '/sustainability-integration': {
    slug: '/sustainability-integration',
    title: 'Sustainability Integration',
    subtitle: 'A new way of doing business',
    heroImage: '/images/hero-sustainability.webp',
    heroAlt: 'Sustainability Integration - Solar & Industrial Facility',
    intro:
      'Organizations at various stages of their sustainability journeys need to set goals, appraise the current situation, prepare a roadmap and effectively articulate their sustainability performance. Our five-step ESG integration process helps organizations navigate complex challenges in their sustainability journey. We adopt a pragmatic approach built on sound understanding of regulation, deep appreciation of on-ground realities and strong collaboration to drive action.',
    offeringsSubtitle: 'Sustainability Integration Services',
    offerings: [
      {
        num: '01',
        title: 'Strategy and Roadmaps',
        img: '/images/offering-strategy-roadmap.webp',
        alt: 'Strategy and roadmaps - sustainability goals planning',
        desc: 'We help clients articulate their sustainability goals, define objectives and plan their sustainability journey in the context of their business and sector. We start this exercise by answering the ‘Why’, factoring in stakeholder, business, market and regulatory considerations.',
        points: [
          'Stakeholder engagement and materiality assessments Selection of relevant ESG frameworks for assessments, reporting and disclosure',
          'Insights on sector-specific material ESG issues, opportunities and regulatory developments through industry and Peer benchmarking studies',
          'Deep dive on sustainability themes across Environmental, Social and Governance topics',
          'Recommendations on ESG focus areas and articulation of goals for organizations',
          'Development of detailed ESG roadmaps',
        ],
      },
      {
        num: '02',
        title: 'Baselining & Assessments',
        img: '/images/offering-baseline-assessments.webp',
        alt: 'Baselining and assessments - measuring ESG footprint',
        desc: 'We help clients in assessments across three areas – resource footprint, organizational ESG maturity and impact of project investments. Our expertise in carbon, water and waste accounting supports clients in accounting for resource footprint within the organization and across the supply chain.',
        points: [
          'GHG Assessment – Scope 1, Scope 2 and Scope 3 emissions',
          'Baseline setting and organizational maturity assessment on multiple frameworks such as BRSR, CSRD, GRI, ISSB, SASB, DJSI CSA, CDP, TCFD, TNFD, SBTi, GRESB, Ecovadis, and Higgs Index',
          'Assessment of on-ground environmental and social (E&S) impacts of infrastructure projects through E&S Impact Assessment (ESIA)',
          'Rapid screening of projects on chosen E&S receptors through our proprietary tool MapSense™',
        ],
      },
      {
        num: '03',
        title: 'Rollout & Implementation',
        img: '/images/offering-rollout.webp',
        alt: 'Rollout and implementation - executing ESG roadmaps',
        desc: 'Post planning and assessments, we support our clients in rollout and implementation of their ESG roadmaps. We work closely with functional teams to setup ESG governance mechanisms, manage data management systems, conduct trainings and support implementation of ESG initiatives.',
        points: [
          'Development of ESG policies and effective ESG governance mechanisms',
          'Implementation of environment, social and governance management systems (ESG-MS)',
          'Capacity building and trainings on ESG, industry specific issues, GHG emissions, disclosures and E&S management systems',
          'Accelerating ESG implementation through partnerships and dedicated support teams',
          'Measurement and tracking of metrics to monitor ESG performance',
        ],
      },
      {
        num: '04',
        title: 'Disclosure & Communication',
        img: '/images/offering-disclosure.webp',
        alt: 'Disclosure and communication - sustainability reporting',
        desc: 'We support clients in managing mandatory compliance and voluntary disclosure requirements through our understanding of regulatory requirements, planning for disclosures, documentation, data validation and preparation of final submissions.',
        points: [
          'Simplification of statutory reporting needs on BRSR, SFDR and CSRD with our tools and real-time assistance',
          'Creation of authentic narratives and preparation of sustainability reports on GRI, SASB, TCFD, CDP and other reporting frameworks',
          'Responding to stakeholder queries on ESG through customized disclosure frameworks and tools',
        ],
      },
      {
        num: '05',
        title: 'Supply Chain Integration',
        img: '/images/offering-supply-chain.webp',
        alt: 'Supply chain integration - sustainable value chains',
        desc: 'We support clients in integrating sustainability throughout their South Asia and South East Asia supply chains through assessments, due diligences, trainings and capacity building.',
        points: [
          'Supply chain assessments with reference to requirements of global legislations such as UK Modern Slavery Act, German Supply Chain Due Diligence Act (LkSG), and Canada Supply Chains Act',
          'Customized research within the supply chain on living wages, labour conditions, ESG adoption, carbon management, etc.',
          'Creating and rolling out policies for sustainable supply chain including trainings and workshops',
          'Customised entity / site level ESG due diligences',
        ],
      },
    ],
    impactItems: [
      {
        href: '/impact/entry-strategy-electric-mobility-charging/',
        img: '/images/row-16.webp',
        alt: 'Entry Strategy | Electric Mobility Charging',
        title: 'Entry Strategy | Electric Mobility Charging',
        excerpt:
          'Entry strategy for electric mobility charging in India Client Global Oil Supermajor (In partnership with leading global strategy firm).',
      },
      {
        href: '/impact/gresb-assessment-multiple-re-developers/',
        img: '/images/row-9.webp',
        alt: 'GRESB Assessment | Multiple RE Developers',
        title: 'GRESB Assessment | Multiple RE Developers',
        excerpt:
          'GRESB assessments for leading Indian Real Estate Developers and Investors Client Leading Indian Real Estate Developers.',
      },
      {
        href: '/impact/market-assessment-recycling-end-of-life-vehicles/',
        img: '/images/row-8-scaled.webp',
        alt: 'Market Assessment | Recycling & End of Life Vehicles',
        title: 'Market Assessment | Recycling & End of Life Vehicles',
        excerpt:
          'A policy, regulatory and opportunity assessment for the End of Life Vehicles market in India Client Global Conglomerate.',
      },
    ],
  },

  '/climate-action': {
    slug: '/climate-action',
    title: 'Climate Action',
    subtitle: 'Futureproofing with low-carbon transitions',
    heroImage: '/images/services-climate.webp',
    heroAlt: 'Wind turbines and solar field at sunset - Climate Action',
    intro:
      'We work with corporates, investors and governments on assessments, scenario development, decarbonization and carbon markets. Our climate practice helps organizations quantify GHG emissions across all three scopes, develop science-aligned net-zero pathways, and implement actionable decarbonization solutions that protect long-term enterprise value.',
    offeringsSubtitle: 'Climate Action Services',
    offerings: [
      {
        num: '01',
        title: 'Assessments and Scenarios',
        img: '/images/offering-climate-assessments.webp',
        alt: 'Assessments and scenarios - climate risk and carbon footprint',
        desc: 'We help clients to get started on their low-carbon transition journeys by defining boundaries and estimating carbon footprint across different scopes and activities. Our deep understanding of GHG protocol, emission factors, sector and geographic differences, and in house accounting tools help us in comprehensive and auditable assessment of carbon footprint.',
        points: [
          'Assessment of Scope 1, Scope 2 and Scope 3 GHG emissions footprint in accordance with international standards including GHG Protocol and ISO 14064',
          'Assessment of financed emissions for banks, financial institutions and insurance companies to understand portfolio level climate risks',
          'Life Cycle Assessment (LCA) to comprehensively assess environmental footprint of products and services',
          'Support towards publication and listing of Environmental Product Declarations (EPD)',
          'Development of climate scenarios including modelling of sectors-specific physical and transition risks',
          'Development of climate risk framework to include likelihood of occurrence and severity of financial impacts',
        ],
      },
      {
        num: '02',
        title: 'Decarbonization',
        img: '/images/offering-decarbonization.webp',
        alt: 'Decarbonization - low-carbon transition solutions',
        desc: 'We support clients in taking forward the results of assessment with target setting and implementation of decarbonization solutions. We work closely with client leadership and functional teams to define appropriate targets in the client’s sector and market context.',
        points: [
          'Setting Net Zero and low-carbon transition targets in accordance with Science Based Targets initiative (SBTi) including method selection, model preparation and target validation',
          'Benchmarking of energy management best practices in peer organizations',
          'Developing operational plans and initiatives to support low carbon transition including fuel substitution, renewable procurement, supply chain initiatives, etc.',
          'Implementation and monitoring of decarbonization programs through inhouse initiatives and offset programs with carbon management tools and practices',
          'Disclosures on specialized climate frameworks such as CDP, TCFD and TNFD',
        ],
      },
      {
        num: '03',
        title: 'Carbon Management',
        img: '/images/offering-carbon-management.webp',
        alt: 'Carbon management - carbon credits and trading',
        desc: 'Decarbonization strategies often require tapping external sources of carbon reduction methods including carbon offsets. We assist in monitoring of clients’ carbon footprint and trading of carbon credits to meet compliance or voluntary carbon obligations.',
        points: [
          'Understanding evolving carbon market regulations in India and other international markets to prepare for cap and trade obligations',
          'Developing carbon reduction projects and registering on VCM platforms',
          'Validation of and verification VCM projects for marketability of credits',
          'Undertaking carbon offsets buy / sell transactions with qualified parties',
        ],
      },
      {
        num: '04',
        title: 'Biodiversity and NBS',
        img: '/images/offering-biodiversity.webp',
        alt: 'Biodiversity and NBS - nature based solutions',
        desc: 'Biodiversity and conservation of natural resources play a key role in climate change mitigation as well as adaptation. We help organizations in biodiversity assessments, responsible sourcing and implementation of nature based solutions and to reduce their climate impact and move towards a more sustainable future.',
        points: [
          'Biodiversity mapping and assessment including critical habitat assessments and bird-bat assessments',
          'Sustainable sourcing strategies aligning to EUDR and similar requirements',
          'Due diligence & risk mitigation in the country of origin / production',
          'Identification of deforestation risks in supply chain',
          'Understanding development models for nature-based solutions and impact assessments for options such as wetland restoration, climate resilient agriculture and reforestation',
          'Evaluation of nature-based solutions projects for participation and preparation of partnership and implementation plans',
        ],
      },
    ],
    impactItems: [
      {
        href: '/impact/scope-3-emissions-assessment-for-data-centres/',
        img: '/images/images-of-data-centre-1.webp',
        alt: 'Scope 3 Emissions Assessment | Data Centres',
        title: 'Scope 3 Emissions Assessment | Data Centres',
        excerpt:
          'Scope 3 emissions visibility and baseline establishment to support disclosures & decarbonization for pan-India data centre operator.',
      },
      {
        href: '/impact/due-diligence-business-esg-regenerative-agriculture/',
        img: '/images/row-7.webp',
        alt: 'Due Diligence (Business + ESG) | Regenerative Agriculture',
        title: 'Due Diligence (Business + ESG) | Regenerative Agriculture',
        excerpt:
          'An ESG due diligence for a company in the regenerative agriculture and carbon market space.',
      },
      {
        href: '/impact/climate-risk-assessment-tcfd-real-estate-developers/',
        img: '/images/row-5.webp',
        alt: 'Climate Risk Assessment (TCFD) | Real Estate Developers',
        title: 'Climate Risk Assessment (TCFD) | Real Estate Developers',
        excerpt:
          'A TCFD-aligned Climate Risk Assessment with physical risks, transitional risks, and a scenario analysis for real estate developers.',
      },
    ],
  },

  '/responsible-investment': {
    slug: '/responsible-investment',
    title: 'Responsible Investment',
    subtitle: 'Green make sense beyond conscience',
    heroImage: '/images/services-responsible.webp',
    heroAlt: 'Seedling sprouting from coins - Responsible Investment',
    intro:
      'We work with leading Development Finance Institutions (DFIs), Private Equity funds, venture capital funds and angel investors to integrate ESG principles across the deal lifecycle. Our experience with funds and investors include infrastructure & real estate, manufacturing, energy, mining, BFSI, healthcare, technology and argi, wherein we have incorporated sector-specific risks, opportunities and market considerations.',
    offeringsSubtitle: 'Responsible Investment Services',
    offerings: [
      {
        num: '01',
        title: 'Portfolio Alignment',
        img: '/images/offering-portfolio-alignment.webp',
        alt: 'Portfolio alignment - ESG integration across investments',
        desc: 'We support investors in building and nurturing their organization and portfolio companies in alignment with LP expectations and emerging ESG themes. We harmonize multiple LP requirements to help investors fulfil their commitments.',
        points: [
          'Development of ESG and climate policies to align portfolio on ESG themes',
          'Preparation of fund thesis for ESG/climate themes, alignment with global frameworks and assistance during LP diligence',
          'Assessment of portfolio alignment on ESG KPIs with customized tools and frameworks',
          'Preparation of SFDR disclosure strategy and implementation support on SFDR compliance',
        ],
      },
      {
        num: '02',
        title: 'Pre-deal and Deal Stage',
        img: '/images/offering-pre-deal.webp',
        alt: 'Pre-deal and deal stage - ESG due diligence',
        desc: 'We evaluate ESG risks and opportunities in potential transactions through our robust approach and proven methodologies of ESG due diligence and audits. Our due diligence capabilities are built on comprehensive internal regulatory databases, sector specific IRLs and checklists, proprietary training manuals, assessment guidelines and risk assessment tools.',
        points: [
          'Conducting ESG due diligence with respect to IFC Performance standards, other international assessment frameworks such as FDCO toolkit, BII, FMO, ADB standards, UN PRI, etc.',
          'Sector insights on policy & regulation, business drivers and growth opportunities in water, circular economy, electric mobility, green hydrogen and carbon markets',
          'Assessment of portfolio companies with respect to international, national and local laws, policies and compliance requirements',
          'Incorporation of ESG risks and opportunities including ESG related clauses in SHA and definitive agreements',
          'Assessment of company level / portfolio level GHG emissions',
        ],
      },
      {
        num: '03',
        title: 'Post-deal Stage',
        img: '/images/offering-post-deal.webp',
        alt: 'Post-deal stage - portfolio ESG management',
        desc: 'Our work in the post-deal stage involves handholding and assisting portfolio companies in managing their ESG risks and communicating impact. We set up ESG management systems and build capacity in portfolio companies to help them address investor and market requirements.',
        points: [
          'Implementing ESG Policy, materiality assessments, peer benchmarking & setting KPI/metrics in portfolio companies',
          'Preparation and implementation of ESG management systems (ESG-MS) in line with investor recommendations',
          'Monitoring ESG action plans and advising portfolio companies on corrective actions',
          'Capacity building and trainings on implementation of ESG management systems',
          'Impact and ESG reporting of portfolio performance on mandatory as well as voluntary frameworks',
        ],
      },
      {
        num: '04',
        title: 'Exit Stage',
        img: '/images/offering-exit-stage.webp',
        alt: 'Exit stage - ESG value creation at exit',
        desc: 'We support investors in strengthening their sell-side transactions by capturing value creation during the holding period with our expertise in valuation of ESG actions and impact.',
        points: [
          'Identification of residual ESG risks and opportunities and assistance in ESG-related responses to potential buyers',
          'Impact communication over the holding period through quantitative KPIs and narratives of change',
        ],
      },
    ],
    impactItems: [
      {
        href: '/impact/brsr-reporting-nbfc/',
        img: '/images/pexels-yanping-ma-452610387-16276655.webp',
        alt: 'BRSR Reporting | NBFC',
        title: 'BRSR Reporting | NBFC',
        excerpt:
          'BRSR reporting, materiality assessment, and identification of emerging risks aligned with the WEF Global Risks Report for leading NBFC.',
      },
      {
        href: '/impact/esg-risk-assessment-bfsi-sector/',
        img: '/images/row-21.webp',
        alt: 'ESG Risk Assessment | BFSI Sector',
        title: 'ESG Risk Assessment | BFSI Sector',
        excerpt:
          'Identification and mitigation of ESG risks for multiple portfolio companies in the BFSI sector Client Leading Private Equity Investor.',
      },
      {
        href: '/impact/knowledge-workshop-global-climate-fund/',
        img: '/images/row-20.webp',
        alt: 'Knowledge Workshop | Global Climate Fund',
        title: 'Knowledge Workshop | Global Climate Fund',
        excerpt:
          'A two-day ESG workshop for financial institutions and portfolio companies in South/Southeast Asia Client Fund Manager.',
      },
    ],
  },
};

export function createPracticePageTree(slug: string): PageBlockTree {
  const data = PRACTICES_DATA[slug] || PRACTICES_DATA['/sustainability-integration'];
  const prefix = slug.replace(/[^a-z0-9]/g, '_').slice(1);
  const nodes: Record<string, BuilderNode> = {};
  const rootIds: string[] = [];

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. HERO SECTION (Exact live match: White background, 64px H1, 32px subtitle,
  //    full-width hero image with 20px radius, 24px lead paragraph)
  // ═════════════════════════════════════════════════════════════════════════════
  const secHeroId = `sec_${prefix}_hero`;
  const contHeroId = `cont_${prefix}_hero`;
  const h1HeroId = `h1_${prefix}_hero`;
  const subHeroId = `sub_${prefix}_hero`;
  const imgHeroId = `img_${prefix}_hero`;
  const pIntroId = `p_${prefix}_intro`;

  rootIds.push(secHeroId);

  nodes[secHeroId] = makeSection(secHeroId, [contHeroId], {
    paddingTop: '140px',
    paddingBottom: '60px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#FFFFFF',
  }, 'Hero Section');

  nodes[contHeroId] = makeContainer(contHeroId, secHeroId, [h1HeroId, subHeroId, imgHeroId, pIntroId], {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  }, 'Hero Container');

  nodes[h1HeroId] = makeHeading(h1HeroId, contHeroId, data.title, 'h1', {
    fontSize: '64px',
    fontWeight: 400,
    textColor: '#004E35',
    lineHeight: '1.1',
    fontFamily: 'Neue Montreal, sans-serif',
    marginBottom: '8px',
  }, 'Page Title');

  nodes[subHeroId] = makeParagraph(subHeroId, contHeroId, `<p>${data.subtitle}</p>`, {
    fontSize: '32px',
    textColor: '#757575',
    fontWeight: 400,
    lineHeight: '1.2',
    fontFamily: 'Neue Montreal, sans-serif',
    marginBottom: '30px',
  }, 'Subtitle');

  nodes[imgHeroId] = makeImage(imgHeroId, contHeroId, resolveCmsImage(data.heroImage), data.heroAlt, {
    width: '100%',
    aspectRatio: '2560 / 1031',
    borderRadius: '20px',
    objectFit: 'cover',
    marginBottom: '40px',
  }, 'Hero Banner Image');

  nodes[pIntroId] = makeParagraph(pIntroId, contHeroId, `<p>${data.intro}</p>`, {
    fontSize: '22px',
    lineHeight: '1.65',
    textColor: '#393939',
    fontFamily: 'Neue Montreal, sans-serif',
  }, 'Intro Narrative');

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. OUR OFFERINGS SECTION (Exact live match: 48px heading, 24px subtitle,
  //    detailed offerings with diagrams/images, descriptions, bullet points)
  // ═════════════════════════════════════════════════════════════════════════════
  const secOfferingsId = `sec_${prefix}_offerings`;
  const contOfferingsId = `cont_${prefix}_offerings`;
  const h2OfferingsId = `h2_${prefix}_offerings`;
  const subOfferingsId = `sub_${prefix}_offerings`;
  const accOfferingsId = `acc_${prefix}_offerings`;

  rootIds.push(secOfferingsId);

  const offeringItemIds: string[] = [];
  data.offerings.forEach((off, idx) => {
    const itemId = `off_item_${prefix}_${idx + 1}`;
    const itemImgId = `off_img_${prefix}_${idx + 1}`;
    const itemDescId = `off_desc_${prefix}_${idx + 1}`;
    const itemPointsId = `off_pts_${prefix}_${idx + 1}`;

    offeringItemIds.push(itemId);

    nodes[itemId] = makeAccordionItem(
      itemId,
      accOfferingsId,
      `${off.num} ${off.title}`,
      [itemImgId, itemDescId, itemPointsId],
      idx === 0,
      `Offering ${off.num}`
    );

    nodes[itemImgId] = makeImage(itemImgId, itemId, resolveCmsImage(off.img), off.alt, {
      width: '100%',
      maxWidth: '850px',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: '8px',
      objectFit: 'contain',
      marginBottom: '24px',
    }, `${off.title} Diagram`);

    nodes[itemDescId] = makeParagraph(itemDescId, itemId, `<p style="color:#004E35; font-size:18px; font-weight:500; line-height:1.6; margin-bottom:16px;">${off.desc}</p>`, {
      marginBottom: '16px',
    }, `${off.title} Description`);

    const pointsHtml = `
      <ul style="padding-left:24px; margin:0; list-style:disc; color:#555555; font-size:16px; line-height:1.7;">
        ${off.points.map((pt) => `<li style="margin-bottom:8px;">${pt}</li>`).join('')}
      </ul>
    `;

    nodes[itemPointsId] = makeParagraph(itemPointsId, itemId, pointsHtml, {}, `${off.title} Key Capabilities`);
  });

  nodes[secOfferingsId] = makeSection(secOfferingsId, [contOfferingsId], {
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#FFFFFF',
  }, 'Our Offerings Section');

  nodes[contOfferingsId] = makeContainer(contOfferingsId, secOfferingsId, [h2OfferingsId, subOfferingsId, accOfferingsId], {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  }, 'Offerings Container');

  nodes[h2OfferingsId] = makeHeading(h2OfferingsId, contOfferingsId, 'Our Offerings', 'h2', {
    fontSize: '48px',
    fontWeight: 400,
    textColor: '#004E35',
    marginBottom: '12px',
    fontFamily: 'Neue Montreal, sans-serif',
  }, 'Offerings Title');

  nodes[subOfferingsId] = makeParagraph(subOfferingsId, contOfferingsId, `<p>${data.offeringsSubtitle}</p>`, {
    fontSize: '24px',
    textColor: '#393939',
    marginBottom: '48px',
    fontFamily: 'Neue Montreal, sans-serif',
  }, 'Offerings Subtitle');

  nodes[accOfferingsId] = makeAccordion(accOfferingsId, contOfferingsId, offeringItemIds, {}, 'Offerings Accordion');

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. OUR IMPACT SECTION (Exact live match: 48px heading, 3-card grid with
  //    case images, titles, excerpts, and read-more links)
  // ═════════════════════════════════════════════════════════════════════════════
  const secImpactId = `sec_${prefix}_impact`;
  const contImpactId = `cont_${prefix}_impact`;
  const h2ImpactId = `h2_${prefix}_impact`;
  const gridImpactId = `grid_${prefix}_impact`;

  rootIds.push(secImpactId);

  const impactCardIds: string[] = [];
  data.impactItems.forEach((item, idx) => {
    const cardId = `impact_card_${prefix}_${idx + 1}`;
    const cardImgId = `impact_img_${prefix}_${idx + 1}`;
    const cardTitleId = `impact_title_${prefix}_${idx + 1}`;
    const cardExcerptId = `impact_excerpt_${prefix}_${idx + 1}`;
    const cardLinkId = `impact_link_${prefix}_${idx + 1}`;

    impactCardIds.push(cardId);

    nodes[cardId] = makeContainer(cardId, gridImpactId, [cardImgId, cardTitleId, cardExcerptId, cardLinkId], {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      overflow: 'hidden',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '1px',
      borderStyle: 'solid',
      paddingBottom: '20px',
    }, `Impact Case ${idx + 1}`);

    nodes[cardImgId] = makeImage(cardImgId, cardId, resolveCmsImage(item.img), item.alt, {
      width: '100%',
      height: '260px',
      objectFit: 'cover',
      marginBottom: '16px',
    }, `${item.title} Image`);

    nodes[cardTitleId] = makeHeading(cardTitleId, cardId, item.title, 'h3', {
      fontSize: '24px',
      fontWeight: 500,
      textColor: '#1E293B',
      lineHeight: 'normal',
      paddingLeft: '20px',
      paddingRight: '20px',
      marginBottom: '10px',
      fontFamily: 'Neue Montreal, sans-serif',
    }, `${item.title} Title`);

    nodes[cardExcerptId] = makeParagraph(cardExcerptId, cardId, `<p>${item.excerpt}</p>`, {
      fontSize: '16px',
      lineHeight: '1.6',
      textColor: 'rgba(0, 0, 0, 0.5)',
      paddingLeft: '20px',
      paddingRight: '20px',
      marginBottom: '16px',
      fontFamily: 'Neue Montreal, sans-serif',
    }, `${item.title} Excerpt`);

    nodes[cardLinkId] = makeButton(cardLinkId, cardId, 'Read More', item.href, 'link', {
      fontSize: '18px',
      textColor: '#2F7ABE',
      backgroundColor: 'transparent',
      paddingLeft: '20px',
      paddingRight: '20px',
      fontFamily: 'Neue Montreal, sans-serif',
    }, 'Read More Link');
  });

  nodes[secImpactId] = makeSection(secImpactId, [contImpactId], {
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#FBFBFB',
  }, 'Our Impact Section');

  nodes[contImpactId] = makeContainer(contImpactId, secImpactId, [h2ImpactId, gridImpactId], {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  }, 'Impact Container');

  nodes[h2ImpactId] = makeHeading(h2ImpactId, contImpactId, 'Our Impact', 'h2', {
    fontSize: '48px',
    fontWeight: 400,
    textColor: '#004E35',
    marginBottom: '48px',
    fontFamily: 'Neue Montreal, sans-serif',
  }, 'Our Impact Title');

  nodes[gridImpactId] = makeGrid(gridImpactId, contImpactId, '3', '32px', impactCardIds, {}, 'Impact 3-Column Grid');

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. PRE-FOOTER CTA SECTION (Exact live match: background image /images/footer-cta.webp,
  //    48px white title, white button linking to /connect/)
  // ═════════════════════════════════════════════════════════════════════════════
  const secCtaId = `sec_${prefix}_cta`;
  const contCtaId = `cont_${prefix}_cta`;
  const cardCtaId = `card_${prefix}_cta`;
  const h3CtaId = `h3_${prefix}_cta`;
  const btnCtaId = `btn_${prefix}_cta`;

  rootIds.push(secCtaId);

  nodes[secCtaId] = makeSection(secCtaId, [contCtaId], {
    paddingTop: '60px',
    paddingBottom: '100px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#FFFFFF',
  }, 'Pre-Footer CTA Section');

  nodes[contCtaId] = makeContainer(contCtaId, secCtaId, [cardCtaId], {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  }, 'CTA Container');

  nodes[cardCtaId] = makeContainer(cardCtaId, contCtaId, [h3CtaId, btnCtaId], {
    backgroundColor: '#004E35',
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
    gap: '24px',
    minHeight: '340px',
  }, 'CTA Banner Card');

  nodes[h3CtaId] = makeHeading(h3CtaId, cardCtaId, 'Let us move towards a greener future', 'h3', {
    fontSize: '48px',
    fontWeight: 400,
    textColor: '#FFFFFF',
    fontFamily: 'Neue Montreal, sans-serif',
  }, 'CTA Title');

  nodes[btnCtaId] = makeButton(btnCtaId, cardCtaId, 'Connect', '/connect/', 'primary', {
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
  }, 'CTA Connect Button');

  return assembleTree(rootIds, nodes);
}
