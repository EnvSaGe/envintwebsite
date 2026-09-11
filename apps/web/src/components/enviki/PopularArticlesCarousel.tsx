'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface PopularArticle {
  slug: string;
  title: string;
  image: string;
}

interface PopularArticlesCarouselProps {
  articles: PopularArticle[];
}

export function PopularArticlesCarousel({ articles }: PopularArticlesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1200) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = articles.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // swipe left -> next
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    } else if (distance < -50) {
      // swipe right -> prev
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Calculate translateX percentage per card
  // gap is 20px, so each card width is: calc((100% - (itemsPerView - 1) * 20px) / itemsPerView)
  const gap = 20;

  return (
    <div
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider viewport */}
      <div style={{ overflow: 'hidden', width: '100%', paddingBottom: '10px' }}>
        <div
          style={{
            display: 'flex',
            gap: `${gap}px`,
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            transform: `translateX(calc(-${currentIndex} * ((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView} + ${gap}px)))`,
          }}
        >
          {articles.map((article, idx) => (
            <div
              key={article.slug}
              style={{
                flex: `0 0 calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})`,
                minWidth: `calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Link
                href={`/${article.slug}/`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Rounded cover image with no border */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '175px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    priority={idx < 4}
                  />
                </div>

                {/* Article title */}
                <h3
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '20px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: '#393939',
                    margin: '14px 0 8px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '48px',
                  }}
                >
                  {article.title}
                </h3>

                {/* Read More link */}
                <span
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    color: '#2F7ABE',
                    fontSize: '16px',
                    fontWeight: 400,
                    display: 'inline-block',
                    marginTop: 'auto',
                    paddingTop: '6px',
                  }}
                >
                  Read More
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots (12 dots matching live) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '32px',
        }}
      >
        {articles.map((_, dotIdx) => {
          const isActive = dotIdx === currentIndex;
          return (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(Math.min(dotIdx, maxIndex))}
              aria-label={`Go to slide ${dotIdx + 1}`}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: isActive ? '#D96B63' : '#D1D5DB',
                transition: 'background-color 0.25s ease, transform 0.25s ease',
                transform: isActive ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
