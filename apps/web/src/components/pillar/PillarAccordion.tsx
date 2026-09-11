'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface PillarPoint {
  text: string;
  sub?: string[];
}

export interface PillarOffering {
  num: string;
  title: string;
  img: string;
  alt: string;
  desc: string;
  points: Array<string | PillarPoint>;
  imgW?: number;
  imgH?: number;
}

export default function PillarAccordion({ offerings }: { offerings: PillarOffering[] }) {
  const [openIdx, setOpenIdx] = useState(0);

  const renderPoint = (pt: string | PillarPoint, key: number) => {
    if (typeof pt === 'string') {
      return <li key={key}>{pt}</li>;
    }
    return (
      <li key={key}>
        {pt.text}
        {pt.sub && (
          <ul className="pillar-accordion-sublist">
            {pt.sub.map((s, j) => (
              <li key={j}>{s}</li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="pillar-accordion">
      {offerings.map((offering, idx) => (
        <div
          key={offering.num}
          className={`pillar-accordion-item${idx === openIdx ? ' is-open' : ''}`}
        >
          <div
            className="pillar-accordion-title-row"
            role="button"
            tabIndex={0}
            aria-expanded={idx === openIdx}
            onClick={() => setOpenIdx(idx === openIdx ? -1 : idx)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpenIdx(idx === openIdx ? -1 : idx);
              }
            }}
          >
            <h3 className="pillar-accordion-title">
              {offering.num}.&nbsp;&nbsp;&nbsp;{offering.title}
            </h3>
            <span className="pillar-accordion-icon" aria-hidden="true">
              <svg width="26" height="24" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
              </svg>
            </span>
          </div>
          <div
            className="pillar-accordion-content"
            role="region"
            aria-hidden={idx !== openIdx}
            style={{ display: idx === openIdx ? 'block' : 'none' }}
          >
            <div className="pillar-accordion-img">
              <Image
                src={offering.img}
                alt={offering.alt}
                width={offering.imgW || 912}
                height={offering.imgH || 880}
                sizes="(max-width: 768px) 100vw, 1200px"
                style={{ width: '100%', maxWidth: offering.imgW || 912, height: 'auto' }}
              />
            </div>
            <p className="pillar-accordion-desc">{offering.desc}</p>
            <ul className="pillar-accordion-points">
              {offering.points.map((pt, i) => renderPoint(pt, i))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
