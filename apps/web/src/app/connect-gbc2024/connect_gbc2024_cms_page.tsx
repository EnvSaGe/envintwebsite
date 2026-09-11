import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect GBC 2024 | Envint',
  description: "Thank you for visiting us at the 'Green Building Congress'! Please share a few details to access our knowledge resources.",
  alternates: {
    canonical: 'https://envintglobal.com/connect-gbc2024/',
  },
};

export default function ConnectGbc2024Page() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO TOP BANNER */}
      <section style={{
        position: 'relative',
        height: '340px',
        width: '100%',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/connect-header.webp"
          alt="Bandra-Worli Sea Link Mumbai - Connect with Envint at GBC 2024"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 60%)',
        }} />
      </section>

      {/* 2. FLOATING CONTENT CARD */}
      <section className="container" style={{ maxWidth: '960px', marginTop: '-80px', position: 'relative', zIndex: 10, paddingBottom: '80px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0px 20px 50px 0px rgba(18, 17, 39, 0.08)',
          padding: '48px',
          marginBottom: '40px',
        }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            color: '#004E35',
            fontWeight: 400,
            lineHeight: 1.25,
            marginBottom: '16px',
          }}>
            Thank you for visiting us at the<br />&lsquo;Green Building Congress&rsquo;!
          </h1>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '1.2rem',
            color: '#393939',
            lineHeight: 1.6,
            marginBottom: '40px'
          }}>
            Please share a few details to access our knowledge resources.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
          }}>
            {/* Contact Details Column */}
            <div style={{
              backgroundColor: '#F7FBF9',
              borderRadius: '16px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              border: '1px solid #E5EAE7',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Image
                  src="/images/ic_sharp-email.png"
                  alt="Email icon"
                  width={48}
                  height={48}
                  style={{ flexShrink: 0 }}
                />
                <div>
                  <a
                    href="mailto:connect@envintglobal.com"
                    style={{
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: '#004E35',
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                    }}
                  >
                    connect@envintglobal.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <Image
                  src="/images/carbon_location-filled.png"
                  alt="Location icon"
                  width={48}
                  height={48}
                  style={{ flexShrink: 0 }}
                />
                <div>
                  <p style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    color: '#404040',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    <strong>Corporate Office:</strong><br />
                    91 Springboard, Godrej &amp; Boyce, LBS Marg, Vikhroli West, Mumbai 400079
                  </p>
                </div>
              </div>
            </div>

            {/* GBC Form Column */}
            <div>
              <form action="/api/forms/gbc" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <div>
                    <label htmlFor="full-name" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="organization" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
                      Organization *
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <div>
                    <label htmlFor="designation" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
                      Designation
                    </label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="your-email" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="your-email"
                      name="your-email"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '1rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tel-298" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="tel-298"
                    name="tel-298"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="textarea-message" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
                    Message
                  </label>
                  <textarea
                    id="textarea-message"
                    name="textarea-message"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2F7ABE',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '14px 34px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginTop: '8px',
                    alignSelf: 'flex-start',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Submit to Download
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

