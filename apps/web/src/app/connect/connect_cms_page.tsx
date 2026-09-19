import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { JsonLd, contactPageSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Connect with Envint - Contact & Office Locations',
  description: 'Reach out to Envint’s sustainability advisory team. Connect with our offices across Mumbai, Bangalore, Pune, Delhi NCR, Kolkata, and Hyderabad.',
  keywords: [
    'Contact Envint',
    'Sustainability Consulting Contact',
    'ESG Advisory Mumbai Bangalore Pune Delhi',
    'Envint Office Locations',
    'Envint Services LLP',
  ],
  alternates: {
    canonical: 'https://envintglobal.com/connect/',
  },
  openGraph: {
    title: 'Connect with Envint - Contact & Office Locations',
    description: 'Reach out to Envint’s sustainability advisory team. Connect with our offices across Mumbai, Bangalore, Pune, Delhi NCR, Kolkata, and Hyderabad.',
    url: 'https://envintglobal.com/connect/',
    siteName: 'Envint',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://envintglobal.com/images/connect-header.webp', alt: 'Connect with Envint' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect with Envint - Contact & Office Locations',
    description: 'Reach out to Envint’s sustainability advisory team. Connect with our offices across Mumbai, Bangalore, Pune, Delhi NCR, Kolkata, and Hyderabad.',
    images: ['https://envintglobal.com/images/connect-header.webp'],
  },
};

const officeLocations = [
  'Mumbai',
  'Bangalore',
  'Pune',
  'Delhi NCR',
  'Kolkata',
  'Hyderabad',
];

export default function ConnectPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      <JsonLd data={[contactPageSchema()]} />
      {/* 1. HERO IMAGE (live match: 333px / 30vh, no text overlay) */}
      <div style={{ position: 'relative', height: 'clamp(320px, 35vh, 400px)', width: '100%', overflow: 'hidden' }}>
        <Image
          src="/images/connect-header.webp"
          alt="Bandra-Worli Sea Link Mumbai - Connect with Envint"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* 2. PAGE HEADING (live wording: 'Have a specific sustainability challenge…' intro + 'We would love to connect!' main heading) */}
      <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '70px', paddingBottom: '60px', textAlign: 'center' }}>
        <p style={{
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: '24px',
          fontWeight: 400,
          color: '#393939',
          lineHeight: '35px',
          margin: '0 0 12px 0',
        }}>
          Have a specific sustainability challenge we can talk about?
        </p>
        <h1 style={{
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: '48px',
          fontWeight: 400,
          color: '#004E35',
          lineHeight: 'normal',
          margin: 0,
        }}>
          We would love to connect!
        </h1>
      </div>

      {/* 3. TWO-COLUMN CONTACT (live: left panel = email + corporate office on windmill bg, right = form) */}
      <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="connect-split-grid">
          {/* Left: green panel with contact details */}
          <div className="connect-left-panel" style={{
            position: 'relative',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '40px',
          }}>
            <Image
              src="/images/connect-address-bg.webp"
              alt="Wind turbine in green hills - Envint Office"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover', zIndex: 0 }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 30, 25, 0.75)',
              zIndex: 1,
            }} />

            {/* Email row */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '1.3rem' }}>✉</span>
              <a href="mailto:connect@envintglobal.com" style={{
                fontFamily: '"Neue Montreal", sans-serif',
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 400,
                textDecoration: 'none',
              }}>
                connect@envintglobal.com
              </a>
            </div>

            {/* Corporate office row */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>📍</span>
              <div>
                <strong style={{
                  display: 'block',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '20px',
                  fontWeight: 500,
                  marginBottom: '6px',
                }}>
                  Corporate Office:
                </strong>
                <p style={{
                  margin: 0,
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  lineHeight: '26px',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}>
                  91 Springboard, Godrej &amp; Boyce, LBS Marg, Vikhroli West, Mumbai 400079
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="connect-right-form" style={{ backgroundColor: '#ffffff' }}>
            <form action="/api/forms/contact" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="connect-form-2col">
                <div>
                  <label htmlFor="full_name" style={{
                    display: 'block',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#686868',
                    marginBottom: '6px',
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      borderBottom: '1px solid #cbd5e1',
                      outline: 'none',
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '16px',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="location" style={{
                    display: 'block',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#686868',
                    marginBottom: '6px',
                  }}>
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      borderBottom: '1px solid #cbd5e1',
                      outline: 'none',
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '16px',
                    }}
                  />
                </div>
              </div>

              <div className="connect-form-2col">
                <div>
                  <label htmlFor="email" style={{
                    display: 'block',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#686868',
                    marginBottom: '6px',
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      borderBottom: '1px solid #cbd5e1',
                      outline: 'none',
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '16px',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="phone" style={{
                    display: 'block',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#686868',
                    marginBottom: '6px',
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      borderBottom: '1px solid #cbd5e1',
                      outline: 'none',
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '16px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" style={{
                  display: 'block',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#686868',
                  marginBottom: '6px',
                }}>
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    borderBottom: '1px solid #cbd5e1',
                    outline: 'none',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                  }}
                />
              </div>

              <div>
                <label htmlFor="service_interest" style={{
                  display: 'block',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#686868',
                  marginBottom: '6px',
                }}>
                  How we can help?
                </label>
                <select
                  id="service_interest"
                  name="service_interest"
                  defaultValue=""
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    borderBottom: '1px solid #cbd5e1',
                    outline: 'none',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    color: '#393939',
                  }}
                >
                  <option value="" disabled>—Please choose an option—</option>
                  <option value="Services">Services</option>
                  <option value="Jobs">Jobs</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" style={{
                  display: 'block',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#686868',
                  marginBottom: '6px',
                }}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    borderBottom: '1px solid #cbd5e1',
                    outline: 'none',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  marginTop: '10px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  backgroundColor: '#004E35',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,78,53,0.2)',
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 4. AT A CITY NEAR YOU (live: 48px title, "Our office locations:", icon pills) */}
      <section style={{ padding: '80px 0 110px', textAlign: 'center', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '48px',
            fontWeight: 400,
            color: '#004E35',
            lineHeight: 'normal',
            margin: '0 0 20px 0',
          }}>
            At a city near you!
          </h2>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '24px',
            fontWeight: 400,
            color: '#686868',
            margin: '0 0 50px 0',
          }}>
            Our office locations:
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px 50px',
          }}>
            {officeLocations.map((city) => (
              <div
                key={city}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontWeight: 400,
                  fontSize: '18px',
                  color: '#393939',
                }}
              >
                <span style={{ fontSize: '1.1rem', color: '#004E35' }}>📍</span>
                {city}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .connect-split-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        .connect-left-panel {
          min-height: 520px;
          padding: 48px 52px;
        }
        .connect-right-form {
          padding: 56px 52px;
        }
        .connect-form-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        @media (max-width: 900px) {
          .connect-split-grid {
            grid-template-columns: 1fr;
          }
          .connect-left-panel {
            min-height: auto;
            padding: 40px 30px;
          }
          .connect-right-form {
            padding: 40px 30px;
          }
        }
        @media (max-width: 640px) {
          .connect-left-panel {
            padding: 32px 20px;
          }
          .connect-right-form {
            padding: 32px 20px;
          }
          .connect-form-2col {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      ` }} />
    </div>
  );
}
