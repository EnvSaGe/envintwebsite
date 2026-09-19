'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { BuilderNode } from '@envint/shared';

interface SearchBarElementProps {
  node: BuilderNode;
}

export function SearchBarElement({ node }: SearchBarElementProps) {
  return (
    <React.Suspense fallback={<SearchBarStatic node={node} />}>
      <SearchBarInner node={node} />
    </React.Suspense>
  );
}

function SearchBarInner({ node }: SearchBarElementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || '';

  const content = node.content || {};
  const placeholder = content.placeholder || 'Search by keyword, topic, or sector...';
  const mode = content.mode || 'auto'; // 'auto' | 'in-page' | 'global'
  const buttonText = content.buttonText || 'Search';
  const showButton = content.showButton !== false;

  const [query, setQuery] = useState(initialQ);

  const broadcastSearch = useCallback((q: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('envint:search', {
          detail: { query: q },
        })
      );
    }
  }, []);

  // Broadcast search query on change (live filter)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    broadcastSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    broadcastSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();

    if (mode === 'global') {
      if (cleanQuery) {
        router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
      }
      return;
    }

    if (mode === 'in-page') {
      broadcastSearch(cleanQuery);
      return;
    }

    // mode === 'auto'
    if (typeof document !== 'undefined') {
      const hasGrid = document.querySelector('[data-envint-filterable="true"]');
      if (!hasGrid && cleanQuery) {
        router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
      } else {
        broadcastSearch(cleanQuery);
      }
    }
  };

  return (
    <div
      data-builder-id={node.id}
      style={{
        width: '100%',
        maxWidth: node.styles?.maxWidth || '680px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: node.styles?.marginTop || '0px',
        marginBottom: node.styles?.marginBottom || '36px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: node.styles?.backgroundColor || '#ffffff',
          borderRadius: node.styles?.borderRadius || '9999px',
          padding: '6px 8px 6px 20px',
          boxShadow: '0 4px 24px rgba(0, 78, 53, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="group focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginRight: '12px' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label="Search"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            color: '#0f172a',
            backgroundColor: 'transparent',
            padding: '8px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          }}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {showButton && (
          <button
            type="submit"
            style={{
              backgroundColor: '#004E35',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 22px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'Neue Montreal, sans-serif',
              boxShadow: '0 2px 8px rgba(0, 78, 53, 0.25)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#006644')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#004E35')}
          >
            {buttonText}
          </button>
        )}
      </form>
    </div>
  );
}

function SearchBarStatic({ node }: SearchBarElementProps) {
  const content = node.content || {};
  const placeholder = content.placeholder || 'Search by keyword, topic, or sector...';
  const buttonText = content.buttonText || 'Search';
  const showButton = content.showButton !== false;

  return (
    <div
      data-builder-id={node.id}
      style={{
        width: '100%',
        maxWidth: node.styles?.maxWidth || '680px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: node.styles?.marginTop || '0px',
        marginBottom: node.styles?.marginBottom || '36px',
      }}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: node.styles?.backgroundColor || '#ffffff',
          borderRadius: node.styles?.borderRadius || '9999px',
          padding: '6px 8px 6px 20px',
          boxShadow: '0 4px 24px rgba(0, 78, 53, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0',
        }}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginRight: '12px' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          defaultValue=""
          placeholder={placeholder}
          aria-label="Search"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            color: '#0f172a',
            backgroundColor: 'transparent',
            padding: '8px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          }}
        />

        {showButton && (
          <button
            type="submit"
            style={{
              backgroundColor: '#004E35',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 22px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'Neue Montreal, sans-serif',
              boxShadow: '0 2px 8px rgba(0, 78, 53, 0.25)',
            }}
          >
            {buttonText}
          </button>
        )}
      </form>
    </div>
  );
}
