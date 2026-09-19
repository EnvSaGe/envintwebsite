import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Careers at Envint - Building a Global Sustainability Team',
  description:
    'Join Envint, a global professional services firm working across sustainability and ESG. Discover our culture — POLO: Professionalism, Openness, Learning, Ownership — and explore a career with us.',
  keywords: [
    'Careers at Envint',
    'ESG Jobs India',
    'Sustainability Consultant Careers',
    'Climate Action Analyst Jobs',
    'Envint Culture POLO',
  ],
  alternates: {
    canonical: 'https://envintglobal.com/careers-at-envint/',
  },
  openGraph: {
    title: 'Careers at Envint - Building a Global Sustainability Team',
    description:
      'Join Envint, a global professional services firm working across sustainability and ESG. Discover our culture — POLO: Professionalism, Openness, Learning, Ownership — and explore a career with us.',
    url: 'https://envintglobal.com/careers-at-envint/',
    siteName: 'Envint',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://envintglobal.com/images/careers-hero.webp', alt: 'Careers at Envint' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at Envint - Building a Global Sustainability Team',
    description:
      'Join Envint, a global professional services firm working across sustainability and ESG. Discover our culture — POLO: Professionalism, Openness, Learning, Ownership — and explore a career with us.',
    images: ['https://envintglobal.com/images/careers-hero.webp'],
  },
};

const poloValues = [
  {
    title: 'Professionalism',
    desc: 'We foster an environment of mutual respect and professional integrity. From meeting etiquettes to transparency in our client communication, we hold ourselves to a high standard of quality.',
  },
  {
    title: 'Openness',
    desc: 'At Envint, every voice is valued, fostering an environment where questions, challenges, and diverse opinions are encouraged and respected regardless of experience or tenure.',
  },
  {
    title: 'Learning',
    desc: 'Every day brings forth new developments in our field. Embracing a shared learning approach, we adapt to industry developments, filtering essential insights to stay ahead.',
  },
  {
    title: 'Ownership',
    desc: 'We recognize and reward team members with the courage to see through their commitments. Taking charge of one’s responsibilities is a sure way to grow at Envint!',
  },
];

// Live typography (envintglobal.com/careers-at-envint, measured):
// desktop/tablet: hero 76px (>1024) / 64px (<=1024), sections 48px, body 24px/35px,
// POLO card title 24px/500 (orange #C65102), card text 18px, CTA para 20px.
// mobile (<=767px): hero 36px, sections 28px, body 18px, CTA para 18px.
// Font sizes are driven by CSS vars so @media rules in the <style> below can step them
// down exactly like the live Elementor/Astra breakpoints (no continuous vw shrinking).

const CSS = `
.careers-root {
  --fh-h1: 76px;
  --fh-h2: 48px;
  --ft-body: 24px;
  --ft-lead: 20px;
}
@media (max-width: 1024px) {
  .careers-root { --fh-h1: 64px; }
}
@media (max-width: 1200px) {
  .careers-polo-split {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
}
@media (max-width: 768px) {
  .careers-root { --ft-lead: 18px; }
}
@media (max-width: 767px) {
  .careers-root {
    --fh-h1: 36px;
    --fh-h2: 28px;
    --ft-body: 18px;
  }
  .careers-wdwd-grid { grid-template-columns: 1fr !important; }
  .careers-wifu-grid { grid-template-columns: 1fr !important; }
  .careers-polo-split { grid-template-columns: 1fr !important; }
  .careers-polo-cards { grid-template-columns: 1fr !important; }
  .careers-polo-cards > div { padding: 32px 20px !important; }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .careers-wdwd-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .careers-wifu-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .careers-polo-split { grid-template-columns: 1fr !important; }
}
`;

const h2Style: React.CSSProperties = {
  fontFamily: '"Neue Montreal", sans-serif',
  fontSize: 'var(--fh-h2)',
  fontWeight: 400,
  color: '#004E35',
  lineHeight: 'normal',
  margin: '0 0 20px 0',
};

const paraStyle: React.CSSProperties = {
  fontFamily: '"Neue Montreal", sans-serif',
  fontSize: 'var(--ft-body)',
  fontWeight: 400,
  color: '#393939',
  lineHeight: '35px',
  margin: 0,
};

export default function CareersPage() {
  return (
    <div className="careers-root" style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers-at-envint/' },
          ]),
        ]}
      />
      {/* 1. HERO (full-screen on desktop, responsive 58-60vh on mobile/tablet) */}
      <section className="page-hero">
        <Image
          src="/images/careers-hero.webp"
          alt="Rowers gliding across calm water - Envint Careers"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 20, 15, 0.55) 0%, rgba(0, 20, 15, 0.15) 55%, transparent 100%)',
          zIndex: 1,
        }} />

        <div className="container hero-stretch" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(38px, 4.8vw, 76px)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#ffffff',
            margin: 0,
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.35)',
          }}>
            Building a global sustainability team - second to none
          </h1>
        </div>
      </section>

      {/* 2. WHAT DO WE DO? (live copy + 3 photos, 12px radius, no card frames) */}
      <section style={{ paddingTop: '60px', paddingBottom: '97px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch">
          <h2 style={h2Style}>What do we do?</h2>
          <div style={{ ...paraStyle, maxWidth: '1216px' }}>
            <p style={{ margin: 0 }}>
              We are a global professional services firm. Our work involves a diverse range of client
              engagements, where we blend research, analysis, client interactions, site visits, and solution
              implementation to drive positive change. Explore our current career opportunities and join us in
              making an impact!
            </p>
          </div>

          <div className="careers-wdwd-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '50px',
          }}>
            {[
              { src: '/images/careers-wdwd-1.webp', alt: 'Envint team collaborating around a laptop' },
              { src: '/images/careers-wdwd-2.webp', alt: 'Envint team meeting around a table' },
              { src: '/images/careers-wdwd-3.webp', alt: 'Smiling Envint colleagues in the office' },
            ].map((img) => (
              <div key={img.src} style={{ lineHeight: 0 }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={840}
                  height={718}
                  sizes="(max-width: 767px) 100vw, 33vw"
                  style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT'S THE WAY WE WORK? (POLO - people-working banner bg, orange titles) */}
      <section style={{
        position: 'relative',
        paddingTop: '33px',
        paddingBottom: '70px',
        color: '#ffffff',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/careers-polo-people.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />

        <div className="container hero-stretch" style={{ position: 'relative', zIndex: 1 }}>
          <div className="careers-polo-split" style={{
            display: 'grid',
            gridTemplateColumns: '542px 718px',
            gap: '20px',
            alignItems: 'flex-start',
          }}>
            {/* Left: heading + intro over image (live column 542px with 64px right padding; text vertically offset to the live y) */}
            <div style={{ paddingTop: '136px', paddingRight: '64px' }}>
              <h2 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--fh-h2)',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1.2,
                margin: 0,
              }}>
                What’s the way we work?
              </h2>
              <p style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--ft-body)',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: '35px',
                margin: '20px 0 0 0',
              }}>
                Our cultural DNA is defined by four key elements, encapsulated by the acronym POLO. Built and
                nurtured over the years, POLO symbolizes the way we work and interact with each other.
              </p>
            </div>

            {/* Right: 2x2 POLO cards (live: 718px column, 10px inset, 339px cards, 40px row pitch) */}
            <div className="careers-polo-cards" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto auto',
              rowGap: '40px',
              columnGap: '20px',
              padding: '10px',
            }}>
              {poloValues.map((val) => (
                <div
                  key={val.title}
                  style={{
                    backgroundColor: '#ffffff',
                    backgroundImage: "url('/images/gray-logo.webp')",
                    backgroundPosition: 'bottom right',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '50% auto',
                    borderRadius: '20px',
                    padding: '48px 24px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h3 style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '24px',
                    fontWeight: 500,
                    color: '#C65102',
                    lineHeight: 1.2,
                    margin: '0 0 20px 0',
                  }}>
                    {val.title}
                  </h3>
                  <p style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#393939',
                    lineHeight: '24px',
                    margin: 0,
                  }}>
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT'S A TYPICAL DAY LIKE? (wide photo under the copy) */}
      <section style={{ paddingTop: '60px', paddingBottom: '0px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch">
          <h2 style={h2Style}>What’s a typical day like?</h2>
          <div style={{ ...paraStyle, maxWidth: '1152px' }}>
            <p style={{ margin: 0 }}>
              There is no typical day at Envint! Each day brings forth its own challenges, learnings and unique
              experiences. With operations across multiple locations in India and expanding globally, we embrace a
              hybrid work model, providing flexibility for our team to maintain their own work-life balance. Our
              cohesive engagement teams are often dispersed across various offices, and we regularly visit client
              sites across offices, factories, hospitals, farms, project sites, treatment plants and many more!
            </p>
          </div>
          <div style={{ marginTop: '85px', lineHeight: 0 }}>
            <Image
              src="/images/careers-typical-day.webp"
              alt="Envint colleagues at a client site visit"
              width={2560}
              height={714}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </section>

      {/* 5. WHAT'S IN IT FOR YOU? (two photos under the copy) */}
      <section style={{ paddingTop: '120px', paddingBottom: '78px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch">
          <h2 style={h2Style}>What’s in it for you?</h2>
          <div style={{ ...paraStyle, maxWidth: '1152px' }}>
            <p style={{ margin: 0 }}>
              Whether you are a fresher or an experienced professional, we have a role for you at Envint. Expect
              significant responsibility, sustained learning opportunities, and collaboration with like-minded
              colleagues. Take charge of your development with plentiful leadership opportunities across domains
              like due diligence, reporting, sectors like built environment or healthcare, and functions such as
              marketing and communication. You can own your growth at Envint!
            </p>
          </div>
          <div className="careers-wifu-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginTop: '50px',
          }}>
            {[
              { src: '/images/careers-wifu-1.webp', alt: 'Envint team member working with a client' },
              { src: '/images/careers-wifu-2.webp', alt: 'Envint colleagues during an engagement' },
            ].map((img) => (
              <div key={img.src} style={{ lineHeight: 0 }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1268}
                  height={718}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EXPLORE A CAREER WITH US (bottom CTA card, exact live site match) */}
      <section style={{ paddingTop: '0px', paddingBottom: '60px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch">
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '60px 40px',
          }}>
            <Image
              src="/images/careers-footer.jpg"
              alt="Explore a career with Envint"
              fill
              sizes="(max-width: 1200px) 100vw, 1280px"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.48))',
            }} />
            <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '960px' }}>
              <h2 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'clamp(28px, 3.2vw, 36px)',
                fontWeight: 400,
                color: '#FFFFFF',
                lineHeight: 1.2,
                margin: '0 0 18px 0',
              }}>
                Explore a career with us!
              </h2>
              <p style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'clamp(16px, 1.8vw, 18px)',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: '28px',
                margin: '0 auto 32px',
                maxWidth: '850px',
              }}>
                We accept candidates from all disciplines as long as you have an interest in sustainability and
                believe that you can make a difference!
              </p>
              <a
                href="mailto:connect@envintglobal.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#121127',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  padding: '12px 30px',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <span>Apply Now</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
}

