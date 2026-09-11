'use client';

import React, { useState } from 'react';

function ChevronDown({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUp({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items, title }: { items: FaqItem[]; title?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }}>
      {title && (
        <h2 style={{
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: '36px',
          fontWeight: 400,
          color: '#004E35',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {title}
        </h2>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: isOpen ? '0 4px 12px rgba(0, 78, 53, 0.06)' : 'none'
              }}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  gap: '16px'
                }}
              >
                <span style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '20px',
                  fontWeight: 500,
                  color: isOpen ? '#004E35' : '#1E293B',
                  lineHeight: 1.3
                }}>
                  {item.q}
                </span>
                <span style={{
                  color: isOpen ? '#004E35' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0
                }}>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>

              {isOpen && (
                <div style={{
                  padding: '0 24px 22px 24px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: '#475569',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '16px'
                }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
