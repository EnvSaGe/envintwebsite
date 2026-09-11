import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ESQ - Environmental, Social and Governance Intelligence Tool',
  description:
    'Envint ESQ provides structured ESG intelligence, benchmarking and automated compliance assessment to help businesses navigate environmental, social and governance requirements.',
  alternates: {
    canonical: 'https://envintglobal.com/esq/',
  },
  openGraph: {
    title: 'ESQ - ESG Intelligence Tool | Envint',
    description:
      'Structured ESG intelligence, benchmarking and automated compliance assessment from Envint.',
    url: 'https://envintglobal.com/esq/',
    type: 'website',
  },
};

export default function EsqPage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff', paddingTop: '110px' }}>
      <div className="container" style={{ maxWidth: '1100px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto 30px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
            fontWeight: 400,
            color: '#004E35',
            lineHeight: 1.15,
            margin: 0,
          }}>
            ESQ — ESG Intelligence Tool
          </h1>
        </div>
      </div>
      <div style={{
        width: '100%',
        height: '90vh',
        borderTop: '1px solid #eef2f6',
        backgroundColor: '#ffffff',
      }}>
        <iframe
          src="https://envintsq.com/"
          title="ESQ - Envint ESG Intelligence Tool"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}

