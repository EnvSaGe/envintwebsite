import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd, serviceSchema } from '@/components/seo/JsonLd';
import PillarAccordion from '@/components/pillar/PillarAccordion';

export const metadata: Metadata = {
  title: 'Sustainability Integration | Envint',
  description: "Envint's five-step ESG integration process helps organizations navigate complex challenges in their sustainability journey.",
  alternates: {
    canonical: 'https://envintglobal.com/sustainability-integration/',
  },
};

const offerings = [
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
      {
        text: 'Baseline setting and organizational maturity assessment on multiple frameworks such as:',
        sub: [
          'Country-specific mandatory disclosure – BRSR and CSRD',
          'General voluntary frameworks GRI, ISSB, SASB and DJSI CSA',
          'Climate-focused frameworks CDP, TCFD, TNFD and SBTi',
          'Specialized frameworks GRESB, Ecovadis, Higgs Index, etc.',
        ],
      },
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
    imgW: 1058,
    imgH: 1084,
    desc: 'We support clients in integrating sustainability throughout their South Asia and South East Asia supply chains through assessments, due diligences, trainings and capacity building.',
    points: [
      'Supply chain assessments with reference to requirements of global legislations such as UK Modern Slavery Act, German Supply Chain Due Diligence Act (LkSG), Canada Fighting Against Forced Labour and Child Labour in Supply Chains Act, etc.',
      'Customized research within the supply chain on living wages, labour conditions, ESG adoption, carbon management, etc.',
      'Creating and rolling out policies for sustainable supply chain including trainings and workshops',
      'Customised entity / site level ESG due diligences',
    ],
  },
];

const impactItems = [
  {
    href: '/impact/entry-strategy-electric-mobility-charging/',
    img: '/images/row-16.webp',
    alt: 'Entry Strategy | Electric Mobility Charging',
    title: 'Entry Strategy | Electric Mobility Charging',
    excerpt: 'Entry strategy for electric mobility charging in India Client Global Oil Supermajor (In partnership...',
    clamp: 3,
  },
  {
    href: '/impact/gresb-assessment-multiple-re-developers/',
    img: '/images/row-9.webp',
    alt: 'GRESB Assessment | Multiple RE Developers',
    title: 'GRESB Assessment | Multiple RE Developers',
    excerpt: 'GRESB assessments for leading Indian Real Estate Developers and Investors Client Leading Indian Real...',
    clamp: 3,
  },
  {
    href: '/impact/market-assessment-recycling-end-of-life-vehicles/',
    img: '/images/row-8-scaled.webp',
    alt: 'Market Assessment | Recycling & End of Life Vehicles',
    title: 'Market Assessment | Recycling & End of Life Vehicles',
    excerpt: 'A policy, regulatory and opportunity assessment for the End of Life Vehicles market in...',
    clamp: 2,
  },
];

export default function SustainabilityIntegrationPage() {
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
            Sustainability Integration
          </h1>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(18px, 2.5vw, 32px)',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#757575',
            margin: '5px 0 0 0',
          }}>
            A new way of doing business
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
              src="/images/hero-sustainability.webp"
              alt="Sustainability Integration - Solar & Industrial Facility"
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
            lineHeight: 'clamp(26px, 3vw, 36px)',
            color: '#393939',
            margin: '40px 0 0 0',
          }}>
            Organizations at various stages of their sustainability journeys need to set goals, appraise the current situation, prepare a roadmap and effectively articulate their sustainability performance. Our five-step ESG integration process helps organizations navigate complex challenges in their sustainability journey. We adopt a pragmatic approach built on sound understanding of regulation, deep appreciation of on-ground realities and strong collaboration to drive action.
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
            Sustainability Integration Services
          </p>

          <div style={{ marginTop: '61px' }}>
            <PillarAccordion offerings={offerings} />
          </div>
        </div>
      </section>

      {/* 3. OUR IMPACT (Live: EAEL grid, 391px cards, image radius 12, 24px w500 titles) */}
      <section style={{ paddingTop: '90px', paddingBottom: '39px', backgroundColor: '#ffffff' }}>
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
      <section style={{ paddingTop: '91px', paddingBottom: '80px', backgroundColor: '#ffffff' }}>
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
          padding: 14px 20px 69px;
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
          margin-bottom: 10px;
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
          padding: 0 39px 0 24px;
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
            name: 'Sustainability Integration',
            description:
              'Envint helps organizations integrate sustainability into core strategy and operations — strategy and roadmaps, baselining and assessments, rollout and implementation, disclosure and communication, and supply chain integration.',
            url: '/sustainability-integration/',
          }),
        ]}
      />
    </div>
  );
}

