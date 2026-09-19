import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd, serviceSchema } from '@/components/seo/JsonLd';
import PillarAccordion from '@/components/pillar/PillarAccordion';

export const metadata: Metadata = {
  title: 'Responsible Investment | Envint',
  description: 'Envint integrates ESG principles across the investment lifecycle for DFIs, private equity, venture capital, and angel investors.',
  keywords: [
    'Responsible Investment',
    'ESG Due Diligence',
    'DFI ESG Compliance',
    'Private Equity ESG',
    'Venture Capital Sustainability',
    'ESAP Implementation',
    'Envint',
  ],
  alternates: {
    canonical: 'https://envintglobal.com/responsible-investment/',
  },
  openGraph: {
    title: 'Responsible Investment | Envint',
    description: 'Envint integrates ESG principles across the investment lifecycle for DFIs, private equity, venture capital, and angel investors.',
    url: 'https://envintglobal.com/responsible-investment/',
    siteName: 'Envint',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://envintglobal.com/images/hero-investment.webp', alt: 'Responsible Investment - Envint' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Responsible Investment | Envint',
    description: 'Envint integrates ESG principles across the investment lifecycle for DFIs, private equity, venture capital, and angel investors.',
    images: ['https://envintglobal.com/images/hero-investment.webp'],
  },
};

const offerings = [
  {
    num: '01',
    title: 'Portfolio Alignment',
    img: '/images/offering-portfolio-alignment.webp',
    alt: 'Portfolio alignment - ESG integration across investments',
    imgW: 1058,
    imgH: 1084,
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
    imgW: 1058,
    imgH: 1084,
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
    imgW: 1058,
    imgH: 1084,
    desc: 'We support investors in strengthening their sell-side transactions by capturing value creation during the holding period with our expertise in valuation of ESG actions and impact.',
    points: [
      'Identification of residual ESG risks and opportunities and assistance in ESG-related responses to potential buyers',
      'Impact communication over the holding period through quantitative KPIs and narratives of change',
    ],
  },
];

const impactItems = [
  {
    href: '/impact/brsr-reporting-nbfc/',
    img: '/images/pexels-yanping-ma-452610387-16276655.webp',
    alt: 'BRSR Reporting | NBFC',
    title: 'BRSR Reporting | NBFC',
    excerpt: 'BRSR reporting, materiality assessment, and identification of emerging risks aligned with the WEF Global...',
    clamp: 3,
  },
  {
    href: '/impact/esg-risk-assessment-bfsi-sector/',
    img: '/images/row-21.webp',
    alt: 'ESG Risk Assessment | BFSI Sector',
    title: 'ESG Risk Assessment | BFSI Sector',
    excerpt: 'Identification and mitigation of ESG risks for multiple companies in the BFSI sector Client...',
    clamp: 2,
  },
  {
    href: '/impact/knowledge-workshop-global-climate-fund/',
    img: '/images/row-20.webp',
    alt: 'Knowledge Workshop | Global Climate Fund',
    title: 'Knowledge Workshop | Global Climate Fund',
    excerpt: 'A two-day ESG workshop for financial institutions and companies in South/Southeast Asia Client Fund...',
    clamp: 3,
  },
];

export default function ResponsibleInvestmentPage() {
  return (
    <div>
      {/* 1. HERO (Live: 64px title, 32px subtitle, full-width 20px-radius image, 24px intro) */}
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
            Responsible Investment
          </h1>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(18px, 2.5vw, 32px)',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#757575',
            margin: '5px 0 0 0',
          }}>
            Green make sense beyond conscience
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
              src="/images/services-responsible.webp"
              alt="Seedling sprouting from coins - Responsible Investment"
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
            We work with leading Development Finance Institutions (DFIs), Private Equity funds, venture capital funds and angel investors to integrate ESG principles across the deal lifecycle. Our experience with funds and investors include infrastructure &amp; real estate, manufacturing, energy, mining, BFSI, healthcare, technology and argi, wherein we have incorporated sector-specific risks, opportunities and market considerations.
          </p>
        </div>
      </section>

      {/* 2. OUR OFFERINGS (Live: 48px heading, 24px subtitle, single-open accordion with centered diagrams) */}
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
            Responsible Investment Services
          </p>

          <div style={{ marginTop: '61px' }}>
            <PillarAccordion offerings={offerings} />
          </div>
        </div>
      </section>

      {/* 3. OUR IMPACT (Live: EAEL grid, 391px cards, image radius 12, 24px w500 titles) */}
      <section style={{ paddingTop: '90px', paddingBottom: '38px', backgroundColor: '#ffffff' }}>
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
                  <p
                    className="pillar-impact-excerpt"
                    style={
                      item.clamp
                        ? {
                            display: '-webkit-box',
                            WebkitLineClamp: item.clamp,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }
                        : undefined
                    }
                  >
                    {item.excerpt}
                  </p>
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
        /* Accordion (live: border-bottom items, 108px title rows, chevron right, centered diagram) */
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
          padding: 15px 20px 69px;
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
          margin: 40px 0 38px 20px;
          max-width: 1200px;
        }
        .pillar-accordion-points {
          padding-left: 20px;
          margin: 18px 0 18px 20px;
          list-style: disc;
          max-width: 1200px;
        }
        .pillar-accordion-points > li {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 26.4px;
          color: #7A7A7A;
          margin-bottom: 5px;
        }
        .pillar-accordion-sublist {
          list-style-type: circle;
          padding-left: 25px;
          margin: 0;
        }
        .pillar-accordion-sublist li {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 26.4px;
          color: #7A7A7A;
          margin-bottom: 5px;
        }

        /* Impact grid (live EAEL: 391px cards, image h260 radius 12, wrapper pad 24 24 0, 24px titles) */
        .pillar-impact-grid {
          display: grid;
          grid-template-columns: repeat(3, 391px);
          gap: 42px;
        }
        .pillar-impact-card {
          display: flex;
          flex-direction: column;
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
          padding: 39px 0 0;
        }
        .pillar-impact-title {
          font-family: "Neue Montreal", sans-serif;
          font-size: 24px;
          font-weight: 500;
          line-height: 28px;
          color: #000000;
          margin: 0 0 10px;
          padding: 0 24px 0 24px;
          transition: color 0.2s ease;
        }
        .pillar-impact-card:hover .pillar-impact-title {
          color: #2F7ABE;
        }
        .pillar-impact-excerpt {
          font-family: "Neue Montreal", sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 20px;
          color: rgba(0, 0, 0, 0.5);
          margin: 0;
          padding: 0 24px 0 24px;
        }
        .pillar-impact-more {
          display: block;
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 26.4px;
          color: #2F7ABE;
          padding: 24px;
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
            name: 'Responsible Investment',
            description:
              'Envint helps funds and lenders channelize capital responsibly — ESG screening and due diligence, portfolio monitoring, ESAP development and responsible-investment frameworks across geographies and asset classes.',
            url: '/responsible-investment/',
          }),
        ]}
      />
    </div>
  );
}

