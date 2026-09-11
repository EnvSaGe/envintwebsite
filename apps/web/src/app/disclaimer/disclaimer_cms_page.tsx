import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - Envint',
  description:
    'Legal disclaimer for the information published on envintglobal.com, a property of Envint Services LLP.',
  alternates: {
    canonical: 'https://envintglobal.com/disclaimer/',
  },
};

export default function DisclaimerPage() {
  return (
    <article style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '140px 0 100px' }}>
      <div className="container" style={{ maxWidth: '900px', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1
          style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '44px',
            fontWeight: 400,
            color: '#141414',
            lineHeight: 1.2,
            marginBottom: '8px',
          }}
        >
          Disclaimer
        </h1>
        <div
          style={{
            width: '56px',
            height: '4px',
            backgroundColor: '#2F7ABE',
            margin: '0 0 40px',
            borderRadius: '2px',
          }}
        />

        <div
          style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.75,
            color: '#393939',
          }}
        >
          <p style={{ marginBottom: '28px' }}>
            The information contained in this website is for general information purposes only. The
            information is provided by{' '}
            <a
              href="https://envintglobal.com/"
              style={{ color: '#2F7ABE', textDecoration: 'underline' }}
            >
              www.envintglobal.com
            </a>
            , a property of Envint Services LLP. While we endeavour to keep the information up to
            date and correct, we make no representations or warranties of any kind, express or
            implied, about the completeness, accuracy, reliability, suitability or availability with
            respect to the website or the information, products, services, or related graphics
            contained on the website for any purpose. Any reliance you place on such information is
            therefore strictly at your own risk.
          </p>
          <p style={{ marginBottom: '28px' }}>
            In no event will we be liable for any loss or damage including without limitation,
            indirect or consequential loss or damage, or any loss or damage whatsoever arising from
            loss of data or profits arising out of, or in connection with, the use of this website.
          </p>
          <p style={{ marginBottom: '28px' }}>
            Through this website you may be able to link to other websites which are not under the
            control of Envint Services LLP. We have no control over the nature, content and
            availability of those sites. The inclusion of any links does not necessarily imply a
            recommendation or endorse the views expressed within them.
          </p>
          <p style={{ marginBottom: '28px' }}>
            Every effort is made to keep the website up and running smoothly. However, Envint
            Services LLP takes no responsibility for, and will not be liable for, the website being
            temporarily unavailable due to technical issues beyond our control.
          </p>
        </div>
      </div>
    </article>
  );
}

