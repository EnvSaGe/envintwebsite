'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  Sparkles,
} from 'lucide-react';
import { BlockSection, resolveMediaUrl } from './LiveCanvasRenderer';

interface BlockFormFieldsProps {
  block: BlockSection;
  onUpdateProp: (field: string, val: any) => void;
  onOpenMediaPicker: (field: string) => void;
}

export function BlockFormFields({
  block,
  onUpdateProp,
  onOpenMediaPicker,
}: BlockFormFieldsProps) {
  const [newCustomKey, setNewCustomKey] = useState('');
  const [showAddCustomField, setShowAddCustomField] = useState(false);

  const props = block.props || {};

  // Rich text mini-toolbar
  const renderToolbar = (field: string) => {
    const current = props[field] || '';
    const appendWrap = (before: string, after: string, sample: string) => {
      onUpdateProp(field, `${current}${before}${sample}${after}`);
    };

    return (
      <div style={{ display: 'flex', gap: '3px', marginBottom: '6px', flexWrap: 'wrap' }}>
        {[
          { label: 'B', icon: Bold, act: () => appendWrap('<strong>', '</strong>', 'bold text') },
          { label: 'I', icon: Italic, act: () => appendWrap('<em>', '</em>', 'italic text') },
          { label: 'U', icon: Underline, act: () => appendWrap('<u>', '</u>', 'underlined text') },
          {
            label: 'Link',
            icon: Link2,
            act: () => {
              const url = prompt('Enter link URL:', 'https://');
              if (url) appendWrap(`<a href="${url}">`, '</a>', 'link text');
            },
          },
          { label: 'Bullet', icon: List, act: () => appendWrap('<ul>\n  <li>', '</li>\n</ul>', 'bullet item') },
        ].map((btn, bIdx) => {
          const Icon = btn.icon;
          return (
            <button
              key={bIdx}
              type="button"
              onClick={btn.act}
              title={btn.label}
              style={{
                padding: '4px 6px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Icon size={12} />
            </button>
          );
        })}
      </div>
    );
  };

  // Image input with preview and picker
  const renderImageField = (field: string, label: string) => {
    const val = props[field] || '';
    return (
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {val ? (
            <img
              src={resolveMediaUrl(val)}
              alt={field}
              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          ) : (
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                border: '1px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
              }}
            >
              <ImageIcon size={20} />
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input
              type="text"
              placeholder="https://... or select from media"
              value={val}
              onChange={(e) => onUpdateProp(field, e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
              }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => onOpenMediaPicker(field)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ImageIcon size={12} />
                <span>Media Library</span>
              </button>
              {val && (
                <button
                  type="button"
                  onClick={() => onUpdateProp(field, '')}
                  style={{
                    padding: '5px 8px',
                    borderRadius: '5px',
                    border: '1px solid #fee2e2',
                    backgroundColor: '#fef2f2',
                    color: '#ef4444',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTextField = (field: string, label: string, placeholder?: string) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={props[field] ?? ''}
        onChange={(e) => onUpdateProp(field, e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '0.82rem',
          outline: 'none',
        }}
      />
    </div>
  );

  const renderTextAreaField = (field: string, label: string, rows = 3, rich = false) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      {rich && renderToolbar(field)}
      <textarea
        rows={rows}
        value={props[field] ?? ''}
        onChange={(e) => onUpdateProp(field, e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '0.82rem',
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none',
        }}
      />
    </div>
  );

  // -------------------------------------------------------------
  // Specific Block Type Form Layouts
  // -------------------------------------------------------------

  // 1. HERO BLOCK
  if (block.type === 'hero-banner' || block.type === 'about-hero' || block.type === 'career-hero') {
    return (
      <div>
        {renderTextField('title', 'Main Headline', 'e.g. Shaping ESG & Climate Action Globally')}
        {renderTextAreaField('subtitle', 'Subheading / Narrative', 3, true)}
        {renderImageField('bgImage', 'Background Image')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {renderTextField('ctaLabel', 'Button Label', 'e.g. Get in Touch')}
          {renderTextField('ctaUrl', 'Button URL', 'e.g. /connect')}
        </div>
      </div>
    );
  }

  // 2. STORY / NARRATIVE BLOCK
  if (block.type === 'story-narrative' || block.type === 'about-story' || block.type === 'about-vision') {
    return (
      <div>
        {renderTextField('tagline', 'Section Tagline / Category', 'e.g. OUR PURPOSE')}
        {renderTextField('headline', 'Large Section Headline', 'e.g. Born from a commitment to sustainability.')}
        {renderTextAreaField('description', 'Primary Overview Paragraph', 4, true)}
        {renderTextAreaField('paragraph1', 'Supporting Paragraph 1', 3, true)}
        {renderTextAreaField('paragraph2', 'Supporting Paragraph 2', 3, true)}
        {renderImageField('image', 'Optional Accompanying Image')}
      </div>
    );
  }

  // 3. STATS & KEY METRICS COUNTER
  if (block.type === 'stats-counter') {
    // Collect all stat pairs
    const statKeys = [1, 2, 3, 4, 5, 6].filter(
      (n) => props[`stat${n}_num`] !== undefined || n <= 4
    );

    return (
      <div>
        {renderTextField('title', 'Section Title', 'e.g. Our Impact in Numbers')}
        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
          Metric Counter Items
        </div>

        {statKeys.map((n) => (
          <div
            key={n}
            style={{
              padding: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#004E35' }}>Stat #{n}</span>
              {n > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProp(`stat${n}_num`, undefined);
                    onUpdateProp(`stat${n}_label`, undefined);
                  }}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  title="Remove stat"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
              <input
                type="text"
                placeholder="500+"
                value={props[`stat${n}_num`] ?? ''}
                onChange={(e) => onUpdateProp(`stat${n}_num`, e.target.value)}
                style={{ padding: '6px 8px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
              <input
                type="text"
                placeholder="Projects Delivered"
                value={props[`stat${n}_label`] ?? ''}
                onChange={(e) => onUpdateProp(`stat${n}_label`, e.target.value)}
                style={{ padding: '6px 8px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        ))}

        {statKeys.length < 6 && (
          <button
            type="button"
            onClick={() => {
              const nextNum = statKeys.length + 1;
              onUpdateProp(`stat${nextNum}_num`, '10+');
              onUpdateProp(`stat${nextNum}_label`, 'New Metric');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px dashed #10b981',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Plus size={14} />
            <span>Add Metric Counter</span>
          </button>
        )}
      </div>
    );
  }

  // 4. STRATEGIC FOCUS / FEATURE CARDS
  if (block.type === 'feature-cards' || block.type === 'about-pillars') {
    const cardNums = [1, 2, 3, 4, 5, 6].filter(
      (n) => props[`card${n}_title`] !== undefined || props[`pillar${n}_title`] !== undefined || n <= 3
    );

    return (
      <div>
        {renderTextField('title', 'Section Heading', 'e.g. Our Strategic Pillars')}
        {renderTextAreaField('subtitle', 'Section Subtitle', 2)}

        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
          Feature Cards
        </div>

        {cardNums.map((n) => {
          const titleKey = props[`pillar${n}_title`] !== undefined ? `pillar${n}_title` : `card${n}_title`;
          const descKey = props[`pillar${n}_desc`] !== undefined ? `pillar${n}_desc` : `card${n}_desc`;

          return (
            <div
              key={n}
              style={{
                padding: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#004E35' }}>Card #{n}</span>
                {n > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProp(titleKey, undefined);
                      onUpdateProp(descKey, undefined);
                    }}
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    title="Remove card"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder={`Card ${n} Title`}
                value={props[titleKey] ?? ''}
                onChange={(e) => onUpdateProp(titleKey, e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.8rem', marginBottom: '6px' }}
              />
              <textarea
                placeholder={`Card ${n} Description`}
                rows={2}
                value={props[descKey] ?? ''}
                onChange={(e) => onUpdateProp(descKey, e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.78rem', resize: 'vertical' }}
              />
            </div>
          );
        })}

        {cardNums.length < 6 && (
          <button
            type="button"
            onClick={() => {
              const nextNum = cardNums.length + 1;
              onUpdateProp(`card${nextNum}_title`, 'New Pillar / Domain');
              onUpdateProp(`card${nextNum}_desc`, 'Strategic description of sustainability advisory solutions.');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px dashed #10b981',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Plus size={14} />
            <span>Add Feature Card</span>
          </button>
        )}
      </div>
    );
  }

  // 5. CALL TO ACTION BANNER
  if (block.type === 'cta-banner') {
    return (
      <div>
        {renderTextField('headline', 'Banner Headline', 'e.g. Ready to Accelerate Your Journey?')}
        {renderTextAreaField('subtext', 'Banner Subtitle / Description', 2)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {renderTextField('buttonLabel', 'Button Label', 'e.g. Get in Touch')}
          {renderTextField('buttonUrl', 'Button Link', 'e.g. /connect')}
        </div>
        {renderImageField('bgImage', 'Optional Background Texture')}
      </div>
    );
  }

  // 6. FAQ ACCORDION
  if (block.type === 'faq-accordion') {
    const faqNums = [1, 2, 3, 4, 5, 6].filter(
      (n) => props[`q${n}`] !== undefined || n <= 2
    );

    return (
      <div>
        {renderTextField('title', 'FAQ Section Title', 'e.g. Frequently Asked Questions')}

        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
          Questions & Answers
        </div>

        {faqNums.map((n) => (
          <div
            key={n}
            style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#004E35' }}>Q&A #{n}</span>
              {n > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProp(`q${n}`, undefined);
                    onUpdateProp(`a${n}`, undefined);
                  }}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  title="Remove question"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder={`Question ${n}`}
              value={props[`q${n}`] ?? ''}
              onChange={(e) => onUpdateProp(`q${n}`, e.target.value)}
              style={{ width: '100%', padding: '6px 8px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.8rem', marginBottom: '6px' }}
            />
            <textarea
              placeholder={`Answer ${n}`}
              rows={2}
              value={props[`a${n}`] ?? ''}
              onChange={(e) => onUpdateProp(`a${n}`, e.target.value)}
              style={{ width: '100%', padding: '6px 8px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.78rem', resize: 'vertical' }}
            />
          </div>
        ))}

        {faqNums.length < 6 && (
          <button
            type="button"
            onClick={() => {
              const nextNum = faqNums.length + 1;
              onUpdateProp(`q${nextNum}`, 'New question?');
              onUpdateProp(`a${nextNum}`, 'Provide a clear, informative answer for users.');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px dashed #10b981',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Plus size={14} />
            <span>Add FAQ Item</span>
          </button>
        )}
      </div>
    );
  }

  // 7. FOUNDERS / SPOTLIGHT BLOCK
  if (block.type === 'about-founders') {
    return (
      <div>
        {renderTextField('title', 'Section Heading', 'e.g. How It All Began')}
        {renderImageField('image', 'Spotlight / Executive Photo')}
        {renderTextAreaField('paragraph1', 'Narrative Paragraph 1', 3, true)}
        {renderTextAreaField('paragraph2', 'Narrative Paragraph 2', 3, true)}
      </div>
    );
  }

  // 8. TEXT CONTENT BLOCK
  if (block.type === 'text-content') {
    return (
      <div>
        {renderTextField('heading', 'Section Heading', 'e.g. Executive Summary')}
        {renderTextAreaField('paragraph1', 'Paragraph 1', 3, true)}
        {renderTextAreaField('paragraph2', 'Paragraph 2', 3, true)}
        {renderTextAreaField('paragraph3', 'Paragraph 3', 3, true)}
      </div>
    );
  }

  // 9. INSIGHTS GRID BLOCK
  if (block.type === 'insights-grid') {
    return (
      <div>
        {renderTextField('title', 'Grid Heading', 'e.g. Latest Insights')}
        {renderTextField('subtitle', 'Grid Subtitle', 'e.g. Explore our research & thought leadership')}
        {renderTextField('filterCategory', 'Filter by Category (leave empty for all)', 'e.g. Envision, Behind the Buzz, How-To')}
      </div>
    );
  }

  // 10. IMPACT CASE STUDIES GRID BLOCK
  if (block.type === 'impact-grid') {
    return (
      <div>
        {renderTextField('title', 'Grid Heading', 'e.g. Selected Case Studies')}
        {renderTextField('subtitle', 'Grid Subtitle', 'e.g. Explore how we have delivered measurable impact')}
      </div>
    );
  }

  // 11. GENERIC / FALLBACK FOR ANY BLOCK
  return (
    <div>
      {Object.keys(props).map((key) => {
        const val = props[key];
        const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('img');
        const isRich = key.toLowerCase().includes('desc') || key.toLowerCase().includes('para') || key.toLowerCase().includes('sub');

        if (isImage) return renderImageField(key, key);
        if (isRich) return renderTextAreaField(key, key, 3, true);
        return renderTextField(key, key);
      })}

      {/* Add Custom Property */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
        {!showAddCustomField ? (
          <button
            type="button"
            onClick={() => setShowAddCustomField(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#004E35',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Plus size={13} />
            <span>Add Custom Field</span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Field name (e.g. noticeText)"
              value={newCustomKey}
              onChange={(e) => setNewCustomKey(e.target.value)}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: '5px',
                border: '1px solid #cbd5e1',
                fontSize: '0.75rem',
              }}
            />
            <button
              type="button"
              onClick={() => {
                const cleanKey = newCustomKey.trim().replace(/[^a-zA-Z0-9_]/g, '');
                if (cleanKey) {
                  onUpdateProp(cleanKey, 'New value');
                  setNewCustomKey('');
                  setShowAddCustomField(false);
                }
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '5px',
                backgroundColor: '#004E35',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddCustomField(false);
                setNewCustomKey('');
              }}
              style={{
                padding: '5px 8px',
                borderRadius: '5px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
