import React from 'react';

interface BlockContentRendererProps {
  blocks: any;
  className?: string;
}

export function BlockContentRenderer({ blocks, className }: BlockContentRendererProps) {
  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  return (
    <div className={`blocks-wrapper ${className || ''}`}>
      {blocks.map((block: any, idx: number) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={idx} style={{ marginBottom: '16px' }}>{block.text}</p>;
          case 'heading': {
            const level = block.level || 2;
            if (level === 1) return <h1 key={idx} style={{ marginTop: '24px', marginBottom: '12px' }}>{block.text}</h1>;
            if (level === 3) return <h3 key={idx} style={{ marginTop: '24px', marginBottom: '12px' }}>{block.text}</h3>;
            return <h2 key={idx} style={{ marginTop: '24px', marginBottom: '12px' }}>{block.text}</h2>;
          }
          case 'list':
            return (
              <ul key={idx} style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                {block.items?.map((item: string, itemIdx: number) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
