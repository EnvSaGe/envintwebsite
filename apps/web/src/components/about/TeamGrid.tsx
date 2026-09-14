'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/about/about.module.css';

export type TeamCardMember = {
  name: string;
  slug: string;
  roleTitle?: string | null;
  role?: string | null;
  bioText?: string | null;
  linkedinUrl?: string | null;
  imageUrl?: string | null;
  hasStandaloneRoute?: boolean;
};

/* The live about page hovers show a ~20-word teaser excerpt of the bio
   (same cut used by the TeamPress grid), with the full bio in the popup. */
const TEASER_WORDS = 20;

function bioTeaser(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const words = clean.split(' ');
  if (words.length <= TEASER_WORDS) return clean;
  const teaser = words
    .slice(0, TEASER_WORDS)
    .join(' ')
    .replace(/[,;:\s]+$/, '');
  return `${teaser}...`;
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function avatarFor(member: TeamCardMember): string {
  return member.imageUrl || (member.slug ? `/images/team-${member.slug}.webp` : '');
}

export default function TeamGrid({
  members,
  initialCount = 12,
}: {
  members: TeamCardMember[];
  initialCount?: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const safeInitialCount = Math.max(1, Math.min(initialCount, members.length || 1));
  const [visibleCount, setVisibleCount] = useState(safeInitialCount);

  const goPrev = () =>
    setActiveIndex((i) => (i === null ? i : (i - 1 + members.length) % members.length));
  const goNext = () => setActiveIndex((i) => (i === null ? i : (i + 1) % members.length));

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, members.length, goNext, goPrev]);

  const active = activeIndex === null ? null : members[activeIndex];

  return (
    <>
      <div className={styles.teamGrid}>
        {members.slice(0, visibleCount).map((member, index) => {
          const role = member.roleTitle || member.role || '';
          const linkedin = member.linkedinUrl || '';
          const bio = bioTeaser(member.bioText || '');

          return (
            <div
              key={member.slug || member.name}
              className={styles.teamCard}
              role="button"
              tabIndex={0}
              aria-label={`${member.name} — read full bio`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveIndex(index);
                }
              }}
            >
              <img
                className={styles.teamCardImg}
                src={avatarFor(member)}
                alt={`${member.name} — ${role} at Envint`}
                width={586}
                height={736}
                loading="lazy"
              />
              <div className={styles.teamCardCaption}>
                <h3 className={styles.teamCardName}>{member.name}</h3>
                <p className={styles.teamCardRole}>{role}</p>
                <div className={styles.teamCardHover}>
                  {bio && <p className={styles.teamCardBio}>{bio}</p>}
                  <div className={styles.teamCardLinks}>
                    {linkedin && (
                      <a
                        className={styles.teamSocial}
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < members.length && (
        <div className={styles.teamLoadMoreWrap}>
          <button
            type="button"
            className={styles.teamLoadMore}
            onClick={() => setVisibleCount(members.length)}
          >
            Load More
          </button>
        </div>
      )}

      {active && (
        <div className={styles.teamModalBackdrop} onClick={() => setActiveIndex(null)}>
          <button
            type="button"
            className={styles.teamModalClose}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(null);
            }}
            aria-label="Close profile"
          >
            &times;
          </button>
          <button
            type="button"
            className={`${styles.teamModalNav} ${styles.teamModalNavPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous team member"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className={`${styles.teamModalNav} ${styles.teamModalNavNext}`}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next team member"
          >
            <ChevronIcon direction="right" />
          </button>

          <div
            className={styles.teamModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.name} — full profile`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.teamModalImgWrap}>
              <img
                className={styles.teamModalImg}
                src={avatarFor(active)}
                alt={`${active.name} — ${active.roleTitle || active.role || ''} at Envint`}
                width={586}
                height={736}
              />
            </div>
            <div className={styles.teamModalBody}>
              <h3 className={styles.teamModalName}>{active.name}</h3>
              {active.linkedinUrl && (
                <div className={styles.teamModalSocialRow}>
                  <a
                    className={styles.teamModalSocial}
                    href={active.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${active.name} on LinkedIn`}
                  >
                    <LinkedinIcon />
                  </a>
                </div>
              )}
              <p className={styles.teamModalRole}>{active.roleTitle || active.role}</p>
              <div className={styles.teamModalDivider} aria-hidden="true" />
              {active.bioText &&
                active.bioText
                  .split(/\n{2,}/)
                  .map((paragraph, i) => (
                    <p key={i} className={styles.teamModalBio}>
                      {paragraph}
                    </p>
                  ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
