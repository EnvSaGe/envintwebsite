'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/about/about.module.css';

export type JourneyMilestone = {
  year: string;
  month?: string;
  img: string;
  desc: string;
};

export default function JourneyCarousel({ milestones }: { milestones: JourneyMilestone[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const lastIndex = milestones.length - 1;

  const measureStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const slide = track.querySelector(':scope > .slide') as HTMLElement | null;
    if (!slide) return 0;
    const margin = parseInt(getComputedStyle(slide).marginRight || '0', 10);
    const step = slide.offsetWidth + margin;
    return step > 0 ? step : 0;
  }, []);

  const syncFromScroll = useCallback(
    (track: HTMLDivElement) => {
      const step = measureStep();
      if (!step) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft <= 2) {
        setActive(0);
      } else if (maxScroll > 0 && track.scrollLeft >= maxScroll - 2) {
        setActive(lastIndex);
      } else {
        setActive(Math.min(Math.max(Math.round(track.scrollLeft / step), 0), lastIndex));
      }
    },
    [lastIndex, measureStep]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const initial = () => syncFromScroll(track);
    initial();

    // Update active dot after native scroll (drag / swipe) settles
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => syncFromScroll(track), 120);
    };
    const onResize = () => syncFromScroll(track);

    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (timeout) clearTimeout(timeout);
    };
  }, [syncFromScroll]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const step = measureStep();
      if (!step) return;
      const next = Math.min(Math.max(active + dir, 0), lastIndex);
      track.scrollTo({ left: next * step, behavior: 'smooth' });
      setActive(next);
    },
    [active, lastIndex, measureStep]
  );

  const atStart = active === 0;
  const atEnd = active >= lastIndex;

  return (
    <div className={styles.journeyCarouselRoot}>
      <div className={styles.journeyHead}>
        <h2 className={styles.journeyTitle}>Our Journey</h2>
        <div className={styles.journeyNav}>
          <button
            type="button"
            className={styles.journeyNavBtn}
            onClick={() => go(-1)}
            disabled={atStart}
            aria-label="Previous milestone"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.journeyNavBtn}
            onClick={() => go(1)}
            disabled={atEnd}
            aria-label="Next milestone"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.journeyViewport}>
        <div
          className={styles.journeyTrack}
          ref={trackRef}
          role="region"
          aria-label="Envint journey timeline"
        >
          <div className={styles.journeyAxis} aria-hidden="true" />
          {milestones.map((m, i) => (
            <article className={`${styles.journeySlide} slide`} key={m.year} aria-label={`${m.month ? m.month + ' ' : ''}${m.year}`}>
              <p className={styles.journeyYear}>
                {m.month && <span>{m.month}</span>}
                {m.year}
              </p>
              <span
                className={`${styles.journeyDot} ${i === active ? styles.journeyDotActive : ''}`}
                aria-hidden="true"
              />
              <p className={styles.journeyDesc}>{m.desc}</p>
              <div className={styles.journeyImg}>
                <Image
                  src={m.img}
                  alt={`${m.month ? m.month + ' ' : ''}${m.year} — ${m.desc}`}
                  fill
                  sizes="(max-width: 600px) 70vw, (max-width: 900px) 300px, 245px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
