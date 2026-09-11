/**
 * scripts/seed-pages-content.ts
 *
 * Populates all 18 core website pages in Neon Postgres with high-fidelity,
 * production-ready content blocks matching the authentic live website.
 *
 * Usage:
 *   npx tsx scripts/seed-pages-content.ts
 */

import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { db } from '../packages/db/src/client';
import { pages } from '../packages/db/src/schema';
import { sql } from 'drizzle-orm';

export interface PageDefinition {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  layoutTemplate: string;
  contentBlocks: Array<{
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    props: Record<string, any>;
    layout?: Record<string, any>;
  }>;
}

export const ALL_CORE_PAGES: PageDefinition[] = [
  // 1. Homepage
  {
    slug: '/',
    title: 'Homepage',
    seoTitle: 'Sustainability & ESG Solutions Firm | Envint',
    seoDescription: 'Envint is a sustainability and ESG solutions firm. We help clients integrate sustainability, channelize responsible investment and enable climate action.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_home_hero',
        name: 'Hero Section',
        type: 'hero-banner',
        enabled: true,
        props: {

          title: 'Business for Better.\nMaking it happen',
          subtitle: 'We help clients integrate sustainability, channelize responsible investment and enable climate action.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/hero-wetland.webp',
          ctaLabel: 'Connect With Us',
          ctaUrl: '/connect',
        },
      },
      {
        id: 'block_home_philosophy',
        name: 'Our Philosophy',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'Everything we do is in pursuit of better',
          description: 'From the air we breathe and the water we drink to the future we want, the desire for better touches us all.',
          paragraph1: 'Better is inspiring and limitless, constrained only by the laws of nature. At Envint, better is what we live, think and enable.',
          paragraph2: 'We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.',
        },
      },
      {
        id: 'block_home_pillars',
        name: 'Core Capabilities',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'Our Core Capabilities',
          subtitle: 'Three specialized practices delivering end-to-end sustainability advisory.',
          card1_title: 'Sustainability Integration',
          card1_desc: 'Embedding ESG into corporate strategy, governance, reporting and supply chains.',
          card2_title: 'Climate Action & Decarbonization',
          card2_desc: 'Net-zero pathways, Scope 1-3 GHG accounting, science-based targets, and climate risk.',
          card3_title: 'Responsible Investment',
          card3_desc: 'Pre-investment ESG due diligence, ESAP, and portfolio monitoring for institutional investors.',
        },
      },
      {
        id: 'block_home_vantage',
        name: 'The Vantage Point',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'Where conviction, capability and action meet',
          description: 'Better begins at the intersection of conviction, capability and action. We partner with leaders who are not just committed to change, but ready to make it happen.',
          paragraph1: 'We partner with leading enterprises, private equity funds, and financial institutions across India and global markets to turn ESG strategy into measurable, verifiable impact.',
          paragraph2: 'With multi-disciplinary teams across Mumbai, Delhi NCR, and Bengaluru, we bridge the gap between compliance mandates and long-term value creation.',
        },
      },
      {
        id: 'block_home_stats',
        name: 'Impact Metrics',
        type: 'stats-counter',
        enabled: true,
        props: {
          title: 'Proven Execution at Scale',
          stat1_num: '500+',
          stat1_label: 'Engagements Delivered',
          stat2_num: '100+',
          stat2_label: 'Corporate Clients',
          stat3_num: '15+',
          stat3_label: 'Global Geographies',
          stat4_num: '6+',
          stat4_label: 'Years of Impact',
        },
      },
      {
        id: 'block_home_cta',
        name: 'Call to Action',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Ready to Accelerate Your Sustainability Journey?',
          subtext: 'Speak with our ESG and climate advisory leaders today.',
          buttonLabel: 'Connect With Us',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 2. About
  {
    slug: '/about',
    title: 'About Envint',
    seoTitle: 'About Envint - Purpose, Journey & Leadership Team',
    seoDescription: 'Learn about Envint’s founding journey, our mission to drive sustainability into mainstream action, and meet our multidisciplinary leadership team.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_about_hero',
        name: 'Hero Section',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Our vision for the future is one that’s better',

          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        },
      },
      {
        id: 'block_about_vision',
        name: 'Vision & Purpose',
        type: 'about-vision',
        enabled: true,
        props: {
          statement: 'Envint is a sustainability and ESG solutions firm, founded with a purpose to shape a more liveable planet for the coming generations.',
          belief: 'Our mission is to drive sustainability into mainstream thought and action, with the belief that ‘green makes sense beyond conscience’.',
          strategy: 'We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.',
        },
      },
      {
        id: 'block_about_founders',
        name: 'How It All Began',
        type: 'about-founders',
        enabled: true,
        props: {
          title: 'How it all began',
          paragraph1: 'A deep conviction to create an impact in the environment sector, steadfast encouragement from family & friends and a few coffee shop meetings was all it took Anand and Manish to start Envint in June 2018. They derive their inspiration from India’s innate wisdom on sustainable living, that is in harmony with nature and its creations.',
          paragraph2: 'Envint is a portmanteau of ‘environment’ and ‘intelligence’ and an anagram of ‘invent’, reflecting a new approach to business. Initially conceived to provide intelligence for the environment sector, Envint has broadened its ambit to include the wider sustainability domain.',
          image: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/founders-anand-manish.webp',
        },
      },
      {
        id: 'block_about_journey',
        name: 'Our Journey',
        type: 'about-journey',
        enabled: true,
        props: {
          title: 'Our Journey',
          subtitle: 'From inception in Mumbai to an international sustainability advisory partner.',
        },
      },
      {
        id: 'block_about_team',
        name: 'Leadership & Team',
        type: 'about-team',
        enabled: true,
        props: {
          title: 'A team you’ll be proud to call your own',
          subtitle: 'Our team is based across multiple locations in India and other geographies. We are on a shared journey to make businesses bring about change for the better.',
        },
      },
    ],
  },

  // 3. Services
  {
    slug: '/services',
    title: 'Services Hub',
    seoTitle: 'Sustainability & ESG Advisory Services - Envint',
    seoDescription: 'Explore Envint’s tiered capability model: Sustainability Integration, Climate Action, Responsible Investment, sector expertise, and proprietary ESG tools.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_services_hero',
        name: 'Services Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Comprehensive ESG & Climate Solutions',
          subtitle: 'Combining strategic insight with rigorous technical analysis to create measurable sustainability impact.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-hero.webp',
        },
      },
      {
        id: 'block_services_pillars',
        name: 'Our Practice Areas',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'Our Practice Areas',
          subtitle: 'Three specialized practices delivering end-to-end sustainability advisory.',
          card1_title: 'Sustainability Integration',
          card1_desc: 'Embedding ESG into corporate strategy, governance, reporting and supply chains.',
          card2_title: 'Climate Action & Decarbonization',
          card2_desc: 'Net-zero pathways, Scope 1-3 GHG accounting, Science Based Targets (SBTi), and carbon mitigation.',
          card3_title: 'Responsible Investment',
          card3_desc: 'Pre-investment ESG due diligence, portfolio monitoring, and SFDR / ISSB compliance.',
        },
      },
      {
        id: 'block_services_tools',
        name: 'Proprietary Tools',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'Proprietary Sustainability Tools',
          subtitle: 'Technology-driven intelligence platforms for ESG compliance and analytics.',
          card1_title: 'EnvSaGe',
          card1_desc: 'Integrated ESG performance tracking and materiality intelligence platform.',
          card2_title: 'EmCal',
          card2_desc: 'Automated GHG emissions calculator and carbon footprinting tool.',
          card3_title: 'ADD',
          card3_desc: 'Automated due diligence screening across environmental and social risk areas.',
          card4_title: 'MapSense',
          card4_desc: 'Spatial environmental & social risk screening tool with 48-hour turnaround.',
        },
      },
      {
        id: 'block_services_stats',
        name: 'Track Record Metrics',
        type: 'stats-counter',
        enabled: true,
        props: {
          title: 'Proven Execution at Scale',
          stat1_num: '500+',
          stat1_label: 'Advisory Engagements',
          stat2_num: '100+',
          stat2_label: 'Institutional Clients',
          stat3_num: '15+',
          stat3_label: 'Global Markets',
          stat4_num: '6+',
          stat4_label: 'Years Delivering Impact',
        },
      },
      {
        id: 'block_services_cta',
        name: 'Call to Action',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Partner With Our Senior Advisory Leaders',
          subtext: 'Schedule an initial consultation to review your sustainability roadmap and disclosure goals.',
          buttonLabel: 'Initiate Scoping Discussion',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 4. MapSense
  {
    slug: '/mapsense',
    title: 'MapSense™ Spatial Environmental Screening',
    seoTitle: 'MapSense™ — Spatial ESG & Environmental Risk Screening | Envint',
    seoDescription: 'MapSense is Envint’s proprietary geospatial environmental and social risk screening tool, mapping physical climate risks, biodiversity exposure, and community sensitivities.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_mapsense_hero',
        name: 'Hero Section',
        type: 'hero-banner',
        enabled: true,
        props: {

          title: 'MapSense™ — Location Intelligence for ESG',
          subtitle: 'Spatial screening of physical climate risks, environmental sensitivities, and community impacts for sites across India and global markets.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/mapsense-hero.webp',
          ctaLabel: 'Request MapSense Screen',
          ctaUrl: '/connect',
        },
      },
      {
        id: 'block_mapsense_features',
        name: 'Key Features & Turnaround',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'Ecosystem Screening made Quick, Scalable & Bespoke',
          subtitle: 'Desk-based spatial risk assessment for infrastructure, energy, and corporate assets.',
          card1_title: 'Sensitive Receptors',
          card1_desc: 'Desk-based screening tool covering 10+ E&S receptor categories.',
          card2_title: '48 Hours Turnaround',
          card2_desc: 'For any project size or area across India, no exceptions.',
          card3_title: 'Pan India Coverage',
          card3_desc: 'Uniform spatial datasets across all States and Union Territories.',
          card4_title: 'Continuously Updated',
          card4_desc: 'Receptor datasets updated regularly for maximum regulatory accuracy.',
          card5_title: 'Customizable Buffer',
          card5_desc: 'Pay only for the distance buffer radius you need for your asset.',
        },
      },
      {
        id: 'block_mapsense_narrative',
        name: 'Where Location Data Meets Strategy',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'Where Location Data Meets Sustainability Strategy',
          description: 'MapSense combines satellite imagery, regulatory buffers, and environmental datasets to provide instant site-level E&S risk profiles for any location.',
          paragraph1: 'Used by investors, developers, and corporate real estate teams to screen site acquisitions, greenfield developments, and supply chain locations for environmental and social risks before committing capital.',
          paragraph2: 'Screens waterbodies, eco-sensitive zones, wildlife corridors, natural hazards, tribal areas, and connectivity networks in compliance with international and national standards.',
        },
      },
      {
        id: 'block_mapsense_process',
        name: '4-Step Process',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: '4-Step Turnaround Process',
          subtitle: 'From coordinate submission to comprehensive screening report in 48 hours.',
          card1_title: '1. Coordinates Submission',
          card1_desc: 'Submit project location coordinates and required buffer distance.',
          card2_title: '2. Confirmation',
          card2_desc: 'Receive confirmation within 24 hours from our geospatial team.',
          card3_title: '3. Order Confirmation',
          card3_desc: 'Transparent buffer-based pricing with immediate processing.',
          card4_title: '4. Report Delivery',
          card4_desc: 'Receive comprehensive E&S screening report in 48 hours.',
        },
      },
      {
        id: 'block_mapsense_cta',
        name: 'Screening CTA Banner',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Screen Your Sites with MapSense',
          subtext: 'Get a site-level E&S risk profile delivered within 48 hours.',
          buttonLabel: 'Request a MapSense Screen',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 5. Impact
  {
    slug: '/impact',
    title: 'Client Impact & Case Studies Hub',
    seoTitle: 'ESG & Sustainability Impact Case Studies - Envint',
    seoDescription: 'Explore Envint’s portfolio of 300+ sustainability engagements across climate action, ESG due diligence, decarbonization, and responsible investment.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_impact_hero',
        name: 'Impact Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Real Impact. Measurable Results.',
          subtitle: '300+ sustainability engagements delivered across India and global markets.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/impact-hero.webp',
        },
      },
      {
        id: 'block_impact_stats',
        name: 'Impact Statistics',
        type: 'stats-counter',
        enabled: true,
        props: {
          title: 'Our Track Record',
          stat1_num: '300+',
          stat1_label: 'Engagements Delivered',
          stat2_num: '100+',
          stat2_label: 'Clients Served',
          stat3_num: '26+',
          stat3_label: 'Case Studies Published',
          stat4_num: '6+',
          stat4_label: 'Years of Impact',
        },
      },
      {
        id: 'block_impact_grid',
        name: 'Selected Case Studies',
        type: 'impact-grid',
        enabled: true,
        props: {
          title: 'Selected Case Studies',
          subtitle: 'Explore how we have helped clients navigate sustainability challenges.',
        },
      },
      {
        id: 'block_impact_cta',
        name: 'CTA Banner',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Ready to Create Impact?',
          subtext: 'Partner with our senior advisory team to build your sustainability roadmap.',
          buttonLabel: 'Connect With Us',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 6. Careers
  {
    slug: '/careers-at-envint',
    title: 'Careers at Envint',
    seoTitle: 'Careers at Envint | Join Our Sustainability Mission',
    seoDescription: 'Explore career opportunities at Envint. Work on climate action, decarbonization, and ESG solutions with an impact-driven team.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_career_hero',
        name: 'Careers Hero',
        type: 'career-hero',
        enabled: true,
        props: {
          title: 'Build a Career with Real Climate Impact',
          subtitle: 'Join a team passionate about driving sustainable business transformation across industries.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/careers-hero.webp',
          ctaLabel: 'Explore Opportunities',
          ctaUrl: '#values',
        },
      },
      {
        id: 'block_career_values',
        name: 'Why Envint Values',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'Why Envint?',
          subtitle: 'We are a purpose-driven team committed to meaningful environmental and social change.',
          card1_title: 'Purpose-Led Work',
          card1_desc: 'Every project contributes to real climate and sustainability outcomes for businesses and communities.',
          card2_title: 'Expert Mentorship',
          card2_desc: 'Learn from senior practitioners with deep expertise in ESG, climate finance, and regulatory frameworks.',
          card3_title: 'Global Exposure',
          card3_desc: 'Work on assignments spanning India, Southeast Asia, Europe, and the Middle East.',
        },
      },
      {
        id: 'block_career_cta',
        name: 'Apply CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Ready to Make an Impact?',
          subtext: 'Send your profile to careers@envintglobal.com and let’s start the conversation.',
          buttonLabel: 'Email Your Application',
          buttonUrl: 'mailto:careers@envintglobal.com',
        },
      },
    ],
  },

  // 7. Connect
  {
    slug: '/connect',
    title: 'Contact & Connect',
    seoTitle: 'Connect with Envint - ESG & Climate Advisory',
    seoDescription: 'Get in touch with Envint’s sustainability partners in Mumbai, Delhi NCR, Bangalore, and international offices.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_connect_hero',
        name: 'Connect Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Let’s Shape a Sustainable Future Together',
          subtitle: 'Reach out to discuss advisory engagements, institutional partnerships, or speaking opportunities.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        },
      },
      {
        id: 'block_connect_faq',
        name: 'Client FAQ',
        type: 'faq-accordion',
        enabled: true,
        props: {
          title: 'Engagement FAQs',
          q1: 'Where are Envint advisory teams based?',
          a1: 'We operate from Mumbai, Gurugram (Delhi NCR), and Bengaluru, serving clients across South Asia, the Middle East, Europe, and North America.',
          q2: 'What is the typical scoping process?',
          a2: 'Following an initial discovery discussion, we provide a detailed technical proposal with clear milestone deliverables and timeline commitments within 3 to 5 business days.',
          q3: 'What sectors do you primarily serve?',
          a3: 'We serve infrastructure, financial services, manufacturing, energy, healthcare, technology, and agriculture sectors, among others.',
        },
      },
      {
        id: 'block_connect_cta',
        name: 'Direct Consultation CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Prefer Direct Email?',
          subtext: 'Write directly to our advisory partners at connect@envintglobal.com.',
          buttonLabel: 'Email Our Team',
          buttonUrl: 'mailto:connect@envintglobal.com',
        },
      },
    ],
  },

  // 8. Disclaimer
  {
    slug: '/disclaimer',
    title: 'Legal & Terms Disclaimer',
    seoTitle: 'Legal Disclaimer - Envint',
    seoDescription: 'Legal terms, disclaimers, and terms of use for the Envint website and advisory services.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_disclaimer_hero',
        name: 'Disclaimer Hero',
        type: 'hero-banner',
        enabled: true,
        props: {

          title: 'Disclaimer & Terms of Use',
          subtitle: 'Please read these terms carefully before using our website or services.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        },
      },
      {
        id: 'block_disclaimer_content',
        name: 'Disclaimer Content',
        type: 'rich-text',
        enabled: true,
        props: {
          title: 'Important Information',
          content: '<p>The information on this website is for general informational purposes only. Envint makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.</p><p>The views expressed on this website are those of the authors and do not necessarily reflect the views of Envint or its clients. Past performance is not a reliable indicator of future results.</p>',
        },
      },
    ],
  },

  // 9. Sustainability Integration
  {
    slug: '/sustainability-integration',
    title: 'Sustainability Integration Practice',
    seoTitle: 'Sustainability Integration Advisory - Envint',
    seoDescription: 'Envint helps organizations embed sustainability into core strategy, governance, reporting, and supply chains through our Sustainability Integration advisory practice.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_si_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Embedding Sustainability into Enterprise DNA',
          subtitle: 'Strategic frameworks, governance design, and ESG disclosure for lasting organizational transformation.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/hero-sustainability.webp',
        },
      },
      {
        id: 'block_si_narrative',
        name: 'Practice Overview',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'From Compliance to Competitive Advantage',
          description: 'We help companies move beyond ESG reporting checklists to build authentic sustainability into their strategy, operations, and stakeholder relationships.',
          paragraph1: 'Our Sustainability Integration practice works with boards, C-suites, and functional leaders to embed environmental and social considerations into core business decisions — creating both risk mitigation and value creation opportunities.',
        },
      },
      {
        id: 'block_si_capabilities',
        name: 'Key Capabilities',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'What We Deliver',
          subtitle: 'Structured advisory across the ESG integration lifecycle.',
          card1_title: 'ESG Strategy & Roadmaps',
          card1_desc: 'Materiality assessments, ESG frameworks, board-level scorecards, and long-term sustainability ambition setting.',
          card2_title: 'Reporting & Disclosure',
          card2_desc: 'BRSR, CSRD, GRI, ISSB, and TCFD-aligned disclosure support with data verification and assurance guidance.',
          card3_title: 'Supply Chain Sustainability',
          card3_desc: 'Value chain mapping, supplier ESG assessments, and responsible procurement frameworks.',
        },
      },
      {
        id: 'block_si_cta',
        name: 'CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Start Your Sustainability Integration Journey',
          subtext: 'Connect with our senior partners to design your ESG strategy roadmap.',
          buttonLabel: 'Schedule a Consultation',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 10. Climate Action
  {
    slug: '/climate-action',
    title: 'Climate Action & Decarbonization Practice',
    seoTitle: 'Climate Action & Decarbonization Advisory - Envint',
    seoDescription: 'Envint’s Climate Action practice helps organizations measure, reduce, and disclose greenhouse gas emissions through net-zero pathways and science-based targets.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_ca_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Net-Zero Pathways for a Resilient Future',
          subtitle: 'GHG accounting, decarbonization strategy, and Science Based Targets advisory for India’s leading organizations.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-climate.webp',
        },
      },
      {
        id: 'block_ca_narrative',
        name: 'Practice Overview',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'From Emissions Accounting to Transition Strategy',
          description: 'We help companies understand their full carbon footprint, set ambitious and credible reduction targets, and build implementable decarbonization roadmaps.',
          paragraph1: 'Climate risk is no longer a long-term concern — it is an immediate strategic and financial issue. Our Climate Action practice equips organizations to measure, disclose, and reduce their environmental impact while capturing low-carbon growth opportunities.',
        },
      },
      {
        id: 'block_ca_capabilities',
        name: 'Our Climate Capabilities',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'Our Climate Services',
          subtitle: 'Rigorous technical solutions for corporate decarbonization.',
          card1_title: 'GHG Footprinting',
          card1_desc: 'Scope 1, 2, and 3 emissions accounting using GHG Protocol methodology across industries and geographies.',
          card2_title: 'Science Based Targets',
          card2_desc: 'SBTi alignment, near-term and long-term target setting, and interim milestone tracking for net-zero commitments.',
          card3_title: 'Climate Risk Assessment',
          card3_desc: 'Physical and transition risk identification using TCFD framework, NGFS scenarios, and site-level hazard mapping.',
          card4_title: 'Carbon Management & Offsets',
          card4_desc: 'High-integrity carbon credit strategy, VCM project development, and emissions reduction trading guidance.',
        },
      },
      {
        id: 'block_ca_cta',
        name: 'CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Accelerate Your Climate Transition',
          subtext: 'Work with our climate specialists to design credible, science-based decarbonization plans.',
          buttonLabel: 'Begin Your Net-Zero Journey',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 11. Responsible Investment
  {
    slug: '/responsible-investment',
    title: 'Responsible Investment & Due Diligence',
    seoTitle: 'Responsible Investment & ESG Due Diligence - Envint',
    seoDescription: 'Envint’s Responsible Investment practice provides pre-investment ESG due diligence, portfolio monitoring, and E&S risk management for institutional investors and funds.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_ri_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'ESG Due Diligence for Informed Investment Decisions',
          subtitle: 'Pre-investment screening, portfolio monitoring, and E&S risk management for institutional investors across India and global markets.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-responsible.webp',
        },
      },
      {
        id: 'block_ri_narrative',
        name: 'Practice Overview',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'Integrating ESG at Every Stage of the Investment Lifecycle',
          description: 'We partner with private equity funds, DFIs, family offices, and strategic investors to embed environmental and social considerations from deal origination through portfolio management.',
          paragraph1: 'Our Responsible Investment team has conducted ESG due diligence across more than 100 transactions, covering healthcare, financial services, manufacturing, infrastructure, and technology sectors.',
        },
      },
      {
        id: 'block_ri_capabilities',
        name: 'Our RI Capabilities',
        type: 'feature-cards',
        enabled: true,
        props: {
          title: 'Our RI Services',
          subtitle: 'Rigorous diligence and portfolio management frameworks.',
          card1_title: 'Pre-Investment ESG-DD',
          card1_desc: 'Comprehensive environmental, social, and governance risk assessment for PE/VC and DFI transactions, aligned with IFC Performance Standards.',
          card2_title: 'ESAP & Action Plans',
          card2_desc: 'Environmental and Social Action Plans (ESAPs) with prioritized remediation roadmaps and compliance timelines.',
          card3_title: 'Portfolio ESG Monitoring',
          card3_desc: 'Ongoing portfolio-level ESG performance tracking, reporting templates, and fund-level disclosure support.',
        },
      },
      {
        id: 'block_ri_cta',
        name: 'CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Enhance Your Investment Decision-Making',
          subtext: 'Work with our RI team to integrate ESG into your investment framework.',
          buttonLabel: 'Connect With Our RI Team',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 12. Envision
  {
    slug: '/envision',
    title: 'Envision Insights Hub',
    seoTitle: 'Envision — ESG & Sustainability Insights Hub | Envint',
    seoDescription: 'Envision is Envint’s flagship insights platform publishing thought leadership, research, and practical guides on ESG, climate action, and sustainable finance.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_envision_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'ESG Insights for Forward-Thinking Leaders',
          subtitle: 'Research, analysis, and practical guides on sustainability, climate finance, and responsible business.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/envision-hero.webp',
        },
      },
      {
        id: 'block_envision_grid',
        name: 'Articles Grid',
        type: 'insights-grid',
        enabled: true,
        props: {
          title: 'Latest Insights',
          subtitle: 'Explore our latest research and thought leadership.',
          filterCategory: 'Envision',
        },
      },
      {
        id: 'block_envision_cta',
        name: 'Newsletter CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Stay Ahead of ESG Trends',
          subtext: 'Subscribe to Envision for curated sustainability intelligence delivered to your inbox.',
          buttonLabel: 'Subscribe to Envision',
          buttonUrl: 'mailto:connect@envintglobal.com?subject=Subscribe to Envision',
        },
      },
    ],
  },

  // 13. Behind the Buzz
  {
    slug: '/behind-the-buzz',
    title: 'Behind the Buzz Editorial Hub',
    seoTitle: 'Behind the Buzz — ESG Jargon Decoded | Envint',
    seoDescription: 'Behind the Buzz demystifies the most overused ESG buzzwords — helping practitioners distinguish substance from marketing noise in sustainability discourse.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_btb_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Decoding the Sustainability Buzzwords',
          subtitle: 'Clear-eyed analysis of the ESG terms and concepts that matter — without the marketing noise.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        },
      },
      {
        id: 'block_btb_grid',
        name: 'Articles Grid',
        type: 'insights-grid',
        enabled: true,
        props: {
          title: 'Behind the Buzz Articles',
          subtitle: 'Separating substance from noise in contemporary sustainability discourse.',
          filterCategory: 'Behind the Buzz',
        },
      },
      {
        id: 'block_btb_cta',
        name: 'CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Have a Buzzword You Want Decoded?',
          subtext: 'Write to us at connect@envintglobal.com with your suggestions.',
          buttonLabel: 'Submit a Topic',
          buttonUrl: 'mailto:connect@envintglobal.com?subject=Behind the Buzz topic suggestion',
        },
      },
    ],
  },

  // 14. How-To Articles
  {
    slug: '/how-to-articles',
    title: 'How-To Practical ESG Guides Hub',
    seoTitle: 'How-To ESG Guides — Practical Sustainability Guides | Envint',
    seoDescription: 'Step-by-step guides and practical frameworks for implementing ESG, calculating carbon footprints, conducting due diligence, and more.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_howto_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Step-by-Step ESG Implementation Guides',
          subtitle: 'Practical frameworks and playbooks for sustainability practitioners across functions and industries.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-hero.webp',
        },
      },
      {
        id: 'block_howto_grid',
        name: 'Guides Grid',
        type: 'insights-grid',
        enabled: true,
        props: {
          title: 'How-To Articles',
          subtitle: 'Actionable playbooks for environmental, social, and governance implementation.',
          filterCategory: 'How-To',
        },
      },
      {
        id: 'block_howto_cta',
        name: 'CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Need Expert Guidance?',
          subtext: 'Our advisory team can walk you through implementation step-by-step.',
          buttonLabel: 'Book a Consultation',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 15. Enviki
  {
    slug: '/enviki',
    title: 'Enviki Sustainability Wiki Hub',
    seoTitle: 'Enviki — ESG & Sustainability Wiki | Envint',
    seoDescription: 'Enviki is Envint’s sustainability knowledge base — a comprehensive wiki of ESG concepts, regulatory frameworks, and climate terms.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_enviki_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'Your ESG Knowledge Base',
          subtitle: 'The most comprehensive sustainability wiki for practitioners, investors, and policymakers.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        },
      },
      {
        id: 'block_enviki_grid',
        name: 'Wiki Articles',
        type: 'insights-grid',
        enabled: true,
        props: {
          title: 'Browse the Enviki',
          subtitle: 'Detailed explainers on standards, frameworks, and sustainability terminology.',
          filterCategory: 'Enviki',
        },
      },
      {
        id: 'block_enviki_cta',
        name: 'CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Can’t Find What You Need?',
          subtext: 'Our experts are here to help you navigate sustainability complexity.',
          buttonLabel: 'Ask Our Team',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 16. Glossary Zone
  {
    slug: '/glossary-zone',
    title: 'ESG & Climate Glossary Hub',
    seoTitle: 'ESG & Climate Glossary — Terms Defined | Envint',
    seoDescription: 'The definitive ESG and sustainability glossary — clear definitions for every acronym, framework, and standard from BRSR to TCFD.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_glossary_hero',
        name: 'Hero',
        type: 'about-hero',
        enabled: true,
        props: {

          title: 'The ESG & Climate Terms Dictionary',
          subtitle: 'Clear definitions for every sustainability acronym, standard, and framework you’ll encounter.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
        },
      },
      {
        id: 'block_glossary_grid',
        name: 'Glossary Terms',
        type: 'insights-grid',
        enabled: true,
        props: {
          title: 'Browse the Glossary',
          subtitle: 'Authoritative explanations of global reporting and climate terms.',
          filterCategory: 'Glossary',
        },
      },
      {
        id: 'block_glossary_cta',
        name: 'CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Need Expert Clarity?',
          subtext: 'Our team can help translate complex ESG requirements into clear, actionable insights.',
          buttonLabel: 'Connect With Our Team',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 17. ESQ
  {
    slug: '/esq',
    title: 'Environmental Sustainability Quotient (ESQ)',
    seoTitle: 'ESQ — Environmental Sustainability Quotient | Envint',
    seoDescription: 'The Environmental Sustainability Quotient (ESQ) is Envint’s proprietary index measuring a company’s overall sustainability maturity across environmental, social, and governance dimensions.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_esq_hero',
        name: 'ESQ Hero',
        type: 'hero-banner',
        enabled: true,
        props: {

          title: 'Environmental Sustainability Quotient',
          subtitle: 'Envint’s ESQ index provides a holistic, data-driven measurement of sustainability maturity for any organization.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-hero.webp',
          ctaLabel: 'Learn More',
          ctaUrl: '/connect',
        },
      },
      {
        id: 'block_esq_narrative',
        name: 'ESQ Overview',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'A Rigorous, Comparable Sustainability Score',
          description: 'The Environmental Sustainability Quotient (ESQ) is a composite index that evaluates an organization’s sustainability maturity across environmental, social, and governance pillars, benchmarked against sector peers.',
          paragraph1: 'Unlike compliance-only metrics, ESQ measures actual outcomes — helping boards and investors understand where an organization truly stands on its sustainability journey.',
        },
      },
      {
        id: 'block_esq_cta',
        name: 'ESQ CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Request Your ESQ Assessment',
          subtext: 'Connect with our team to explore how ESQ can inform your sustainability strategy.',
          buttonLabel: 'Request ESQ Assessment',
          buttonUrl: '/connect',
        },
      },
    ],
  },

  // 18. Connect GBC 2024
  {
    slug: '/connect-gbc2024',
    title: 'Global Business Coalition 2024 Campaign',
    seoTitle: 'GBC 2024 - Envint at the Global Business Coalition',
    seoDescription: 'Envint at the Global Business Coalition 2024 — connecting sustainability leaders to advance climate action globally.',
    layoutTemplate: 'standard',
    contentBlocks: [
      {
        id: 'block_gbc_hero',
        name: 'GBC 2024 Hero',
        type: 'hero-banner',
        enabled: true,
        props: {

          title: 'Advancing Climate Action at GBC 2024',
          subtitle: 'Envint engages global business leaders to accelerate sustainability transitions.',
          bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
          ctaLabel: 'Connect With Us',
          ctaUrl: '/connect',
        },
      },
      {
        id: 'block_gbc_content',
        name: 'GBC Overview',
        type: 'story-narrative',
        enabled: true,
        props: {

          headline: 'Shaping the Future of Responsible Business',
          description: 'At GBC 2024, Envint connected with leading institutions, investors, and corporations to advance the global sustainability agenda. Our team participated in key panels on ESG integration, climate finance, and supply chain transparency.',
          paragraph1: 'The Global Business Coalition brings together the world’s most forward-thinking organizations to align on common frameworks for sustainability, responsible investment, and climate-aligned business practices.',
        },
      },
      {
        id: 'block_gbc_cta',
        name: 'GBC CTA',
        type: 'cta-banner',
        enabled: true,
        props: {
          headline: 'Ready to Advance Your Sustainability Goals?',
          subtext: 'Partner with Envint to align your business with global sustainability frameworks.',
          buttonLabel: 'Connect With Envint',
          buttonUrl: '/connect',
        },
      },
    ],
  },
];

async function seedAllCorePages() {
  console.log(`\n📄 Seeding ${ALL_CORE_PAGES.length} core pages into Neon Postgres...`);
  let count = 0;

  for (const page of ALL_CORE_PAGES) {
    await db
      .insert(pages)
      .values({
        slug: page.slug,
        title: page.title,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        layoutTemplate: page.layoutTemplate,
        contentBlocks: page.contentBlocks,
        schemaVersion: 1,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: pages.slug,
        set: {
          title: sql`excluded.title`,
          seoTitle: sql`excluded.seo_title`,
          seoDescription: sql`excluded.seo_description`,
          layoutTemplate: sql`excluded.layout_template`,
          contentBlocks: sql`excluded.content_blocks`,
          schemaVersion: 1,
          status: 'PUBLISHED',
          updatedAt: new Date(),
        },
      });

    count++;
    console.log(`  ✅ [${count}/${ALL_CORE_PAGES.length}] ${page.slug} (${page.contentBlocks.length} blocks)`);
  }

  
  // Synchronize fallbacks in apps/admin and apps/web
  const jsonMap = {};
  for (const p of ALL_CORE_PAGES) {
    jsonMap[p.slug] = p;
  }
  const jsonStr = JSON.stringify(jsonMap, null, 2);
  const fsSync = require('fs');
  fsSync.writeFileSync(path.resolve(__dirname, '../apps/admin/src/data/pages-content.json'), jsonStr, 'utf8');
  fsSync.writeFileSync(path.resolve(__dirname, '../apps/web/src/data/pages-content.json'), jsonStr, 'utf8');
  console.log('  ✅ Synchronized pages-content.json in apps/admin and apps/web');

  console.log(`\n🎉 Successfully upserted all ${count} pages with full content blocks!`);
  process.exit(0);
}

seedAllCorePages().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
