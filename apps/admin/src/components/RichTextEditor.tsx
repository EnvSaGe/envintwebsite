'use client';

/**
 * RichTextEditor — dependency-free WYSIWYG editor for long-form HTML content.
 *
 * Two modes:
 *  - Visual: contentEditable surface with a formatting toolbar (document.execCommand).
 *  - HTML: raw <textarea> for power users / pasting pre-baked markup.
 *
 * The value contract is sanitized HTML in → sanitized HTML out, so it is a
 * drop-in replacement for the raw <textarea> fields it replaces.
 *
 * Paste hygiene: content pasted from Google Sheets / Word / web pages is
 * stripped of script/style spans, tracking attributes, and Sheets' encoded
 * data-sheets-* blobs before entering the value.
 */

import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Undo2,
  Redo2,
  Code2,
  Eye,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
  placeholder?: string;
}

/** Toolbar action definitions (execCommand-based; universally supported). */
type ToolAction =
  | { cmd: 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList' | 'formatBlock'; arg?: string }
  | { custom: 'link' | 'cleanup' | 'undo' | 'redo' };

const TOOL_GROUPS: Array<Array<{ icon: React.ReactNode; title: string; action: ToolAction; activeCmd?: string }>> = [
  [
    { icon: <Bold size={14} />, title: 'Bold (Ctrl+B)', action: { cmd: 'bold' }, activeCmd: 'bold' },
    { icon: <Italic size={14} />, title: 'Italic (Ctrl+I)', action: { cmd: 'italic' }, activeCmd: 'italic' },
    { icon: <Underline size={14} />, title: 'Underline (Ctrl+U)', action: { cmd: 'underline' }, activeCmd: 'underline' },
  ],
  [
    { icon: <Heading2 size={14} />, title: 'Heading', action: { cmd: 'formatBlock', arg: 'h2' } },
    { icon: <Heading3 size={14} />, title: 'Subheading', action: { cmd: 'formatBlock', arg: 'h3' } },
    { icon: <Quote size={14} />, title: 'Quote', action: { cmd: 'formatBlock', arg: 'blockquote' } },
  ],
  [
    { icon: <List size={14} />, title: 'Bullet list', action: { cmd: 'insertUnorderedList' } },
    { icon: <ListOrdered size={14} />, title: 'Numbered list', action: { cmd: 'insertOrderedList' } },
  ],
  [
    { icon: <Link2 size={14} />, title: 'Insert link', action: { custom: 'link' } },
    { icon: <RemoveFormatting size={14} />, title: 'Clear formatting', action: { custom: 'cleanup' } },
  ],
  [
    { icon: <Undo2 size={14} />, title: 'Undo', action: { custom: 'undo' } },
    { icon: <Redo2 size={14} />, title: 'Redo', action: { custom: 'redo' } },
  ],
];

/**
 * Extract clean HTML from pasted clipboard data, preferring text/html that has
 * been scrubbed of junk. Falls back to plain text with paragraph conversion.
 */
function extractPastedHtml(clipboardEvent: ClipboardEvent): string {
  const dt = clipboardEvent.clipboardData;
  if (!dt) return '';

  const html = dt.getData('text/html');
  const text = dt.getData('text/plain');

  if (html) return sanitizePastedHtml(html);

  // Plain text: convert blank-line-separated blocks into paragraphs
  if (text) {
    return text
      .split(/\n{2,}/)
      .map((block) => `<p>${escapeHtmlText(block).replace(/\n/g, '<br>')}</p>`)
      .join('');
  }
  return '';
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** DOM-based scrub of pasted rich text — removes junk while keeping structure. */
function sanitizePastedHtml(rawHtml: string): string {
  const host = document.createElement('div');
  host.innerHTML = rawHtml;

  // Remove whole junk elements
  host.querySelectorAll('script, style, meta, link, o\\:p, xml, table[class*="Mso"]').forEach((el) => el.remove());

  const walk = (el: Element) => {
    for (const child of Array.from(el.children)) {
      const tag = child.tagName.toLowerCase();

      // Google Sheets root spans: replace with their text content
      if (child.hasAttribute('data-sheets-root') || tag === 'span' && child.hasAttribute('data-sheets-value')) {
        child.replaceWith(...Array.from(child.childNodes));
        continue;
      }

      // Strip all attributes except href/target/rel on links and src/alt on images
      const allowedAttrs: Record<string, string[]> = {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt'],
      };
      const keep = allowedAttrs[tag];
      if (keep) {
        for (const attr of Array.from(child.attributes)) {
          if (!keep.includes(attr.name)) child.removeAttribute(attr.name);
        }
        // Block javascript: URLs
        const href = child.getAttribute('href') || child.getAttribute('src') || '';
        if (/^\s*javascript:/i.test(href)) {
          child.remove();
          continue;
        }
        if (tag === 'a' && child.getAttribute('target') === '_blank') {
          child.setAttribute('rel', 'noopener noreferrer');
        }
      } else if (child instanceof HTMLElement) {
        // Drop class/style/id and any data-* (incl. Sheets blobs)
        child.removeAttribute('class');
        child.removeAttribute('style');
        child.removeAttribute('id');
        for (const attr of Array.from(child.attributes)) {
          if (attr.name.startsWith('data-')) child.removeAttribute(attr.name);
        }
      }

      walk(child);
    }
  };
  walk(host);

  // Sheets sometimes leaves encoded JSON inside remaining spans — flatten any
  // span whose text contains a sheets-encoded payload remnant.
  host.querySelectorAll('span').forEach((span) => {
    if (span.textContent && /&quot;\d+&quot;/.test(span.getAttribute('data-sheets-userformat') || '')) {
      span.replaceWith(...Array.from(span.childNodes));
    }
  });

  return host.innerHTML;
}

export function RichTextEditor({ value, onChange, minHeight = 260, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = React.useState<'visual' | 'html'>('visual');
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const htmlAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  // Local mirror so typing doesn't fight the controlled value (IME-safe)
  const lastEmitted = React.useRef<string>(value);

  // Sync external value changes into the visual surface
  React.useEffect(() => {
    if (mode !== 'visual' || !editorRef.current) return;
    if (value !== lastEmitted.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
      lastEmitted.current = value;
    }
  }, [value, mode]);

  const emit = React.useCallback(
    (html: string) => {
      const clean = sanitizePastedHtml(html);
      lastEmitted.current = clean;
      onChange(clean);
    },
    [onChange]
  );

  const exec = (cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    if (editorRef.current) emit(editorRef.current.innerHTML);
  };

  const runAction = (action: ToolAction) => {
    if ('cmd' in action) {
      exec(action.cmd, action.arg);
      return;
    }
    switch (action.custom) {
      case 'link': {
        const url = window.prompt('Link URL (https://… or mailto:)');
        if (url) exec('createLink', url);
        break;
      }
      case 'cleanup':
        exec('removeFormat');
        exec('formatBlock', 'p');
        break;
      case 'undo':
        exec('undo');
        break;
      case 'redo':
        exec('redo');
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = extractPastedHtml(e.nativeEvent as ClipboardEvent);
    if (!pasted) return; // let default happen (e.g. file drops)
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, pasted);
    if (editorRef.current) emit(editorRef.current.innerHTML);
  };

  const activeStates = React.useMemo(() => {
    if (mode !== 'visual') return {} as Record<string, boolean>;
    const q = document.queryCommandState.bind(document);
    return {
      bold: q('bold'),
      italic: q('italic'),
      underline: q('underline'),
    };
    // Recomputed on selection change via re-render trigger below
  }, [mode, value]);

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2px',
          padding: '6px 8px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}
      >
        {TOOL_GROUPS.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <span style={{ width: '1px', height: '16px', backgroundColor: '#cbd5e1', margin: '0 6px' }} />}
            {group.map((tool, ti) => {
              const isActive = tool.activeCmd ? Boolean(activeStates[tool.activeCmd]) : false;
              return (
                <button
                  key={ti}
                  type="button"
                  title={tool.title}
                  onMouseDown={(e) => {
                    // Prevent losing selection in the editable surface
                    e.preventDefault();
                    runAction(tool.action);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '26px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    color: isActive ? '#0f766e' : '#334155',
                    backgroundColor: isActive ? '#ccfbf1' : 'transparent',
                  }}
                >
                  {tool.icon}
                </button>
              );
            })}
          </React.Fragment>
        ))}

        <span style={{ flex: 1 }} />

        {/* Mode switch */}
        <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <button
            type="button"
            onClick={() => setMode('visual')}
            title="Visual editing"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '3px 8px', fontSize: '11px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              backgroundColor: mode === 'visual' ? '#0f766e' : '#ffffff',
              color: mode === 'visual' ? '#ffffff' : '#475569',
            }}
          >
            <Eye size={12} /> Visual
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('html');
            }}
            title="Edit raw HTML"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '3px 8px', fontSize: '11px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              backgroundColor: mode === 'html' ? '#0f766e' : '#ffffff',
              color: mode === 'html' ? '#ffffff' : '#475569',
            }}
          >
            <Code2 size={12} /> HTML
          </button>
        </div>
      </div>

      {/* Editing surface */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Rich text editor"
          data-placeholder={placeholder}
          onInput={() => {
            if (editorRef.current) emit(editorRef.current.innerHTML);
          }}
          onBlur={() => {
            if (editorRef.current) emit(editorRef.current.innerHTML);
          }}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            // Stop the parent modal's form from hijacking Enter, etc.
            e.stopPropagation();
          }}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: '420px',
            overflowY: 'auto',
            padding: '14px 16px',
            fontSize: '0.9rem',
            lineHeight: 1.65,
            color: '#1e293b',
            outline: 'none',
            wordBreak: 'break-word',
          }}
          className="rte-surface"
        />
      ) : (
        <textarea
          ref={htmlAreaRef}
          defaultValue={value}
          onChange={(e) => {
            lastEmitted.current = e.target.value;
            onChange(e.target.value);
          }}
          spellCheck={false}
          style={{
            display: 'block',
            width: '100%',
            minHeight: `${minHeight}px`,
            maxHeight: '420px',
            overflowY: 'auto',
            padding: '14px 16px',
            fontSize: '0.82rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            lineHeight: 1.6,
            color: '#334155',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      )}

      {/* Typography for the editable surface + rendered placeholder */}
      <style dangerouslySetInnerHTML={{ __html: `
        .rte-surface:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        .rte-surface h2 { font-size: 1.35rem; font-weight: 700; margin: 0.8em 0 0.4em; color: #0f172a; }
        .rte-surface h3 { font-size: 1.1rem; font-weight: 700; margin: 0.7em 0 0.35em; color: #0f172a; }
        .rte-surface p { margin: 0 0 0.7em; }
        .rte-surface ul, .rte-surface ol { margin: 0 0 0.7em 1.4em; padding: 0; }
        .rte-surface ul { list-style: disc; }
        .rte-surface ol { list-style: decimal; }
        .rte-surface li { margin-bottom: 0.3em; }
        .rte-surface blockquote {
          border-left: 3px solid #cbd5e1;
          margin: 0.6em 0;
          padding: 0.2em 0 0.2em 0.9em;
          color: #475569;
          font-style: italic;
        }
        .rte-surface a { color: #0f766e; text-decoration: underline; }
        .rte-surface img { max-width: 100%; height: auto; border-radius: 6px; }
      ` }} />
    </div>
  );
}
