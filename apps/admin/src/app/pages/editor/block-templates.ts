import {
  Layout,
  BarChart3,
  Megaphone,
  HelpCircle,
  FileText,
  Users,
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  Mail,
  Grid,
  Award,
} from 'lucide-react';

export interface BlockTemplate {
  type: string;
  name: string;
  category: 'hero' | 'narrative' | 'features' | 'metrics' | 'conversion' | 'faq';
  description: string;
  icon: any;
  defaultProps: Record<string, any>;
}

export const COMPREHENSIVE_BLOCK_TEMPLATES: BlockTemplate[] = [
  // --- HERO & HEADERS ---
  {
    type: 'hero-banner',
    name: 'Classic Hero Banner',
    category: 'hero',
    description: 'Full-bleed hero with background image, bold title, subtitle, and primary CTA.',
    icon: Layout,
    defaultProps: {
      title: 'Shaping ESG & Climate Action Globally',
      subtitle: 'A global sustainability and climate advisory delivering impact for enterprises, institutions, and investors.',
      bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
      ctaLabel: 'Get in Touch',
      ctaUrl: '/connect',
    },
  },
  {
    type: 'about-hero',
    name: 'About / Brand Hero',
    category: 'hero',
    description: 'Specialized brand hero with dark emerald overlay and high-contrast typography.',
    icon: Sparkles,
    defaultProps: {
      title: 'Our Vision for the Future is One That’s Better',
      bgImage: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp',
      ctaLabel: 'Learn More',
      ctaUrl: '#vision',
    },
  },

  // --- CONTENT & NARRATIVE ---
  {
    type: 'story-narrative',
    name: 'Story & Purpose (2-Column)',
    category: 'narrative',
    description: 'Editorial split layout with large headline on the left and narrative paragraphs on the right.',
    icon: Layout,
    defaultProps: {
      tagline: 'OUR PURPOSE',
      headline: 'Born from a commitment to sustainability and corporate responsibility.',
      description: 'Envint was founded to bridge the gap between sustainability commitments and concrete business action.',
      paragraph1: 'We combine deep technical rigor with commercial insight to help organizations navigate net zero transitions.',
      paragraph2: 'Our cross-disciplinary team operates across Asia, Europe, and North America.',
    },
  },
  {
    type: 'about-founders',
    name: 'Founders / Executive Spotlight',
    category: 'narrative',
    description: 'Leadership showcase with photo card on the left and story/vision narrative on the right.',
    icon: Users,
    defaultProps: {
      title: 'How It All Began',
      image: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/founders-anand-manish.webp',
      paragraph1: 'A deep conviction to create an impact in the environment sector was all it took Anand and Manish to start Envint in June 2018.',
      paragraph2: 'Envint is a portmanteau of ‘environment’ and ‘intelligence’ and an anagram of ‘invent’, reflecting a new approach to business.',
    },
  },
  {
    type: 'text-content',
    name: 'Rich Text / Article Body',
    category: 'narrative',
    description: 'Focused editorial block for long-form articles, whitepapers, case studies, or disclaimers.',
    icon: FileText,
    defaultProps: {
      heading: 'Executive Summary',
      paragraph1: 'Rapidly evolving global ESG disclosures are transforming how institutional investors allocate capital.',
      paragraph2: 'Organizations that integrate climate resilience into their operating models achieve superior risk-adjusted performance.',
      paragraph3: 'Envint partners with boards and executive leadership to implement science-based decarbonization roadmaps.',
    },
  },

  // --- FEATURES & STRATEGY ---
  {
    type: 'feature-cards',
    name: 'Strategic Focus / Feature Cards',
    category: 'features',
    description: 'Interactive grid of numbered cards with emerald accent borders and domain descriptions.',
    icon: Grid,
    defaultProps: {
      title: 'Our Strategic Pillars',
      subtitle: 'Delivering measurable value across critical sustainability domains.',
      card1_title: 'Sustainability Integration',
      card1_desc: 'Embedding environmental and social principles into corporate governance and core operating models.',
      card2_title: 'Climate Action & Decarbonization',
      card2_desc: 'Formulating greenhouse gas mitigation roadmaps and science-based climate targets.',
      card3_title: 'Responsible Investment',
      card3_desc: 'Pre-investment diligence, ESG portfolio risk monitoring, and institutional stewardship.',
      card4_title: 'Regulatory & Reporting',
      card4_desc: 'BRSR, CSRD, TCFD, and ISSB global reporting alignment for institutional compliance.',
    },
  },

  // --- METRICS & SOCIAL PROOF ---
  {
    type: 'stats-counter',
    name: 'Impact Metrics & Stats Bar',
    category: 'metrics',
    description: 'High-impact stat counter display with bold numbers and uppercase impact labels.',
    icon: BarChart3,
    defaultProps: {
      title: 'Our Impact in Numbers',
      stat1_num: '500+',
      stat1_label: 'Engagements Delivered',
      stat2_num: '100+',
      stat2_label: 'Corporate Clients',
      stat3_num: '15+',
      stat3_label: 'Global Geographies',
      stat4_num: '6+',
      stat4_label: 'Years of Excellence',
    },
  },
  {
    type: 'about-journey',
    name: 'Journey & Milestones Timeline',
    category: 'metrics',
    description: 'Interactive chronological journey timeline showing company evolution year by year.',
    icon: Compass,
    defaultProps: {
      title: 'Our Journey',
      subtitle: 'From a boutique advisory to an international climate and ESG powerhouse.',
    },
  },
  {
    type: 'about-team',
    name: 'Leadership & Team Grid',
    category: 'metrics',
    description: 'Responsive grid displaying team members with photos, role titles, and LinkedIn profiles.',
    icon: Users,
    defaultProps: {
      title: 'A Team You’ll Be Proud to Call Your Own',
      subtitle: 'Dedicated professionals delivering climate excellence across multiple geographies.',
    },
  },

  // --- CONVERSION & ENGAGEMENT ---
  {
    type: 'cta-banner',
    name: 'Call to Action Banner',
    category: 'conversion',
    description: 'Prominent emerald gradient banner designed to drive inquiries, downloads, or contact requests.',
    icon: Megaphone,
    defaultProps: {
      headline: 'Ready to Accelerate Your Sustainability Journey?',
      subtext: 'Speak with our ESG and climate advisory partners today.',
      buttonLabel: 'Get in Touch',
      buttonUrl: '/connect',
    },
  },
  {
    type: 'faq-accordion',
    name: 'FAQ Accordion Section',
    category: 'faq',
    description: 'Collapsible accordion answering frequent customer or stakeholder questions.',
    icon: HelpCircle,
    defaultProps: {
      title: 'Frequently Asked Questions',
      q1: 'What sectors does Envint cover?',
      a1: 'We advise clients across manufacturing, renewables, energy, automotive, BFSI, technology, and real estate.',
      q2: 'How do we begin an advisory engagement?',
      a2: 'Reach out via our connect form or write to connect@envintglobal.com for an initial scoping discussion.',
      q3: 'Can you support global sustainability compliance?',
      a3: 'Yes, our team supports BRSR, CSRD, GRI, TCFD, and ISSB global reporting frameworks.',
    },
  },
];
