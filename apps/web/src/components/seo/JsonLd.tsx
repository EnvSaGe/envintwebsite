import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Server-side Schema.org JSON-LD injector. Renders one or more
 * <script type="application/ld+json"> blocks for crawlers and AI engines.
 */
export function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={`${block['@type'] as string}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

export const SITE_URL = 'https://envintglobal.com';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Envint',
    legalName: 'Envint Services LLP',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/envint-logo.webp`,
      width: 1200,
      height: 800,
    },
    description:
      'Envint is a sustainability and ESG solutions firm. We help clients integrate sustainability, channelize responsible investment and enable climate action.',
    email: 'connect@envintglobal.com',
    sameAs: [
      'https://www.linkedin.com/company/envintglobal/',
      'https://twitter.com/EnvintGlobal',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'connect@envintglobal.com',
      url: `${SITE_URL}/connect/`,
      availableLanguage: ['English'],
    },
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Envint | Sustainability & ESG Services Firm',
    description:
      'Envint is a sustainability and ESG solutions firm helping organizations integrate sustainability, channelize responsible investment and enable climate action.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function articleSchema(data: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    url: `${SITE_URL}${data.url}`,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    inLanguage: 'en',
    author: data.authorName
      ? { '@type': 'Person', name: data.authorName }
      : { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${data.url}`,
    },
  };
}

export function personProfileSchema(data: {
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  image?: string;
  sameAs?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: data.name,
      jobTitle: data.jobTitle,
      description: data.description,
      image: data.image,
      url: `${SITE_URL}${data.url}`,
      ...(data.sameAs ? { sameAs: data.sameAs } : {}),
      worksFor: { '@id': `${SITE_URL}/#organization` },
    },
  };
}

export function serviceSchema(data: {
  name: string;
  description: string;
  url: string;
  providerName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    url: `${SITE_URL}${data.url}`,
    serviceType: data.name,
    provider: data.providerName
      ? { '@type': 'Organization', name: data.providerName, url: SITE_URL }
      : { '@id': `${SITE_URL}/#organization` },
    areaServed: 'Worldwide',
    availableLanguage: 'en',
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
