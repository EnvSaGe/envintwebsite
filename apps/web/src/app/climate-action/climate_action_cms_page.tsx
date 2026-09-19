import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd, serviceSchema } from '@/components/seo/JsonLd';
import PillarAccordion from '@/components/pillar/PillarAccordion';

export const metadata: Metadata = {
  title: 'Climate Action | Envint',
  description: 'We work with corporates, investors and governments on assessments, scenario development, decarbonization and carbon markets.',
  keywords: [
    'Climate Action',
    'Decarbonization Roadmap',
    'Carbon Footprint Assessment',
    'TCFD Reporting',
    'Net Zero Strategy',
    'Carbon Markets',
    'Envint',
  ],
  alternates: {
    canonical: 'https://envintglobal.com/climate-action/',
  },
  openGraph: {
    title: 'Climate Action | Envint',
    description: 'We work with corporates, investors and governments on assessments, scenario development, decarbonization and carbon markets.',
    url: 'https://envintglobal.com/climate-action/',
    siteName: 'Envint',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://envintglobal.com/images/hero-climate.webp', alt: 'Climate Action - Envint' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Climate Action | Envint',
    description: 'We work with corporates, investors and governments on assessments, scenario development, decarbonization and carbon markets.',
    images: ['https://envintglobal.com/images/hero-climate.webp'],
  },
};

const offerings = [
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
    desc: 'We support clients in taking forward the results of assessment with target setting and implementation of decarbonization solutions. We work closely with client leadership and functional teams to define appropriate targets in the client\u2019s sector and market context.',
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
    desc: 'Decarbonization strategies often require tapping external sources of carbon reduction methods including carbon offsets. We assist in monitoring of clients\u2019 carbon footprint and trading of carbon credits to meet compliance or voluntary carbon obligations.',
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
      'Understanding development models for nature-based solutions and impact assessments for options such as wetland restoration, climate resilient agriculture and reforestation.',
      'Evaluation of nature-based solutions projects for participation and preparation of partnership and implementation plans',
    ],
  },
];

const impactItems = [
  {
    href: '/impact/scope-3-emissions-assessment-for-data-centres/',
    img: '/images/images-of-data-centre-1.webp',
    alt: 'Scope 3 Emissions Assessment | Data Centres',
    title: 'Scope 3 Emissions Assessment | Data Centres',
    excerpt: 'Scope 3 emissions visibility and baseline establishment to support disclosures & decarbonization for pan-India data centre operator.',
  },
  {
    href: '/impact/due-diligence-business-esg-regenerative-agriculture/',
    img: '/images/row-7.webp',
    alt: 'Due Diligence (Business + ESG) | Regenerative Agriculture',
    title: 'Due Diligence (Business + ESG) | Regenerative Agriculture',
    excerpt: 'An ESG due diligence for a company in the regenerative agriculture and carbon market space.',
  },
  {
    href: '/impact/climate-risk-assessment-tcfd-real-estate-developers/',
    img: '/images/row-5.webp',
    alt: 'Climate Risk Assessment (TCFD) | Real Estate Developers',
    title: 'Climate Risk Assessment (TCFD) | Real Estate Developers',
    excerpt: 'A TCFD-aligned Climate Risk Assessment with physical risks, transitional risks, and a scenario analysis for real estate developers.',
  },
];

export default function ClimateActionPage() {
  return (
    <div>
      {/* 1. HERO (Live: 64px title, 32px #757575 subtitle, full-width 20px-radius image, 24px intro) */}
      <section style={{ paddingTop: 'clamp(100px, 12vw, 170px)', paddingBottom: '60px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(32px, 5.5vw, 64px)',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#004E35',
            margin: 0,
          }}>
            Climate Action
          </h1>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(18px, 2.5vw, 32px)',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#757575',
            margin: '5px 0 0 0',
          }}>
            Futureproofing with low-carbon transitions
          </p>

          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '2560 / 1031',
            borderRadius: '20px',
            overflow: 'hidden',
            marginTop: '30px',
          }}>
            <Image
              src="/images/services-climate.webp"
              alt="Wind turbines and solar field at sunset - Climate Action"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(17px, 2vw, 24px)',
            fontWeight: 400,
            color: '#393939',
            lineHeight: 'clamp(26px, 3vw, 36px)',
            margin: '40px 0 0 0',
          }}>
            Climate change presents risks and opportunities that need to be integrated with corporate strategies and with development plans of governments. We work with corporates, investors and governments on assessments, scenario development, decarbonization and carbon markets to help them prepare for a low-carbon future.
          </p>
        </div>
      </section>

      {/* 2. OUR OFFERINGS (Live: 48px heading, 24px subtitle, accordion item 01 open with centered diagram) */}
      <section style={{ paddingTop: '50px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '48px',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#004E35',
            margin: '0 0 20px 0',
          }}>
            Our Offerings
          </h2>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#393939',
            margin: 0,
          }}>
            Climate Action Services
          </p>

          <div style={{ marginTop: '61px' }}>
            <PillarAccordion offerings={offerings} />
          </div>
        </div>
      </section>

      {/* 3. OUR IMPACT (Live: EAEL grid, 391px cards, image radius 12, 24px w500 titles) */}
      <section style={{ paddingTop: '90px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '48px',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#004E35',
            margin: '0 0 31px 0',
          }}>
            Our Impact
          </h2>

          <div className="pillar-impact-grid">
            {impactItems.map((item) => (
              <Link key={item.href} href={item.href} className="pillar-impact-card">
                <div className="pillar-impact-thumb">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="pillar-impact-wrapper">
                  <h3 className="pillar-impact-title">{item.title}</h3>
                  <p className="pillar-impact-excerpt">{item.excerpt}</p>
                  <span className="pillar-impact-more">
                    Read More
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRE-FOOTER CTA (Live: footer-cta bg, radius 20, 48px white title, white 18px #282828 button) */}
      <section style={{ paddingTop: '91px', paddingBottom: '110px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div className="pillar-cta">
            <Image
              src="/images/footer-cta.webp"
              alt="Let us move towards a greener future"
              fill
              sizes="(max-width: 1200px) 100vw, 1280px"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="pillar-cta-overlay" />
            <div className="pillar-cta-content">
              <h3>
                Let us move towards a greener future
              </h3>
              <Link href="/connect/" className="pillar-cta-btn">
                Connect
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Accordion (live: border-bottom items, 108px title rows, chevron right, centered 912px diagram) */
        .pillar-accordion-item {
          border-bottom: 1px solid #d5d8dc;
        }
        .pillar-accordion-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 40px 0;
          cursor: pointer;
        }
        .pillar-accordion-title {
          font-family: "Neue Montreal", sans-serif;
          font-size: 24px;
          font-weight: 500;
          line-height: normal;
          color: #0E0E2C;
          margin: 0;
        }
        .pillar-accordion-icon {
          color: #777777;
          display: inline-flex;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .pillar-accordion-item.is-open .pillar-accordion-icon {
          transform: rotate(180deg);
        }
        .pillar-accordion-content {
          padding: 15px 20px 113px;
        }
        .pillar-accordion-img {
          display: flex;
          justify-content: center;
          margin-top: 9px;
        }
        .pillar-accordion-img img {
          border-radius: 0;
        }
        .pillar-accordion-desc {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 18px;
          color: #6EC1E4;
          margin: 40px 0 20px 20px;
          max-width: 1200px;
        }
        .pillar-accordion-points {
          padding-left: 20px;
          margin: 18px 0 18px 20px;
          list-style: disc;
          max-width: 1200px;
        }
        .pillar-accordion-points li {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 26.4px;
          color: #7A7A7A;
          margin-bottom: 5px;
        }

        /* Impact grid (live EAEL: 391px cards, gap 42, image h260 radius 12, wrapper pad 15 15 15 0) */
        .pillar-impact-grid {
          display: grid;
          grid-template-columns: repeat(3, 391px);
          gap: 42px;
        }
        .pillar-impact-card {
          display: flex;
          flex-direction: column;
          height: 538px;
          background-color: transparent;
          border: none;
          border-radius: 0;
          overflow: hidden;
          text-decoration: none;
        }
        .pillar-impact-thumb {
          position: relative;
          height: 260px;
          width: 100%;
          flex-shrink: 0;
        }
        .pillar-impact-thumb img {
          border-radius: 12px;
        }
        .pillar-impact-wrapper {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 15px 15px 39px 0;
        }
        .pillar-impact-title {
          font-family: "Neue Montreal", sans-serif;
          font-size: 24px;
          font-weight: 500;
          line-height: normal;
          color: #000000;
          margin: 19px 0 0 0;
          transition: color 0.2s ease;
        }
        .pillar-impact-card:hover .pillar-impact-title {
          color: #2F7ABE;
        }
        .pillar-impact-excerpt {
          font-family: "Neue Montreal", sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: normal;
          color: rgba(0, 0, 0, 0.5);
          margin: 10px 0 0 0;
        }
        .pillar-impact-more {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 26.4px;
          color: #2F7ABE;
          padding: 24px;
          margin-top: 0;
        }

        /* CTA card (live: footer-cta bg, radius 20, pad 80, 48px white title, white 18px #282828 button) */
        .pillar-cta {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          min-height: 334px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          padding: 80px 20px;
        }
        .pillar-cta-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0);
        }
        .pillar-cta-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }
        .pillar-cta-content h3 {
          font-family: "Neue Montreal", sans-serif;
          font-size: 48px;
          font-weight: 400;
          line-height: normal;
          color: #FFFFFF;
          margin: 0 0 60px 0;
        }
        .pillar-cta-btn {
          display: inline-block;
          background-color: #FFFFFF;
          color: #282828;
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: normal;
          padding: 17px 25px;
          border-radius: 10px;
          text-decoration: none;
        }

        @media (max-width: 1280px) {
          .pillar-impact-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 1024px) {
          .pillar-impact-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }
        @media (max-width: 768px) {
          .pillar-impact-grid {
            grid-template-columns: 1fr;
          }
          .pillar-impact-card {
            height: auto;
          }
          .pillar-accordion-title-row {
            padding: 20px 0;
          }
          .pillar-accordion-title {
            font-size: 20px;
          }
          .pillar-cta-content h3 {
            font-size: 28px;
          }
          .pillar-cta {
            padding: 40px 20px;
          }
        }
        @media (max-width: 600px) {
          .pillar-accordion-title {
            font-size: 20px;
          }
        }
      ` }} />
      <JsonLd
        data={[
          serviceSchema({
            name: 'Climate Action',
            description:
              'Envint futureproofs organisations for a low-carbon world — climate risk assessments, GHG and carbon accounting, decarbonisation roadmaps and climate-aligned disclosure support.',
            url: '/climate-action/',
          }),
        ]}
      />
    </div>
  );
}
