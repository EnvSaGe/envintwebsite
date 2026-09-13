import type { PageBlockTree } from '../builder-schema';

export function createArticleTemplateTree(): PageBlockTree {
  return {
    version: 2,
    rootIds: ['article-section'],
    nodes: {
      'article-section': {
        id: 'article-section', type: 'section', name: 'Article', parentId: null, children: ['article-container'], content: {},
        styles: { backgroundColor: '#ffffff', paddingTop: '120px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' },
        responsiveStyles: { mobile: { paddingTop: '96px', paddingBottom: '64px', paddingLeft: '18px', paddingRight: '18px' } },
      },
      'article-container': {
        id: 'article-container', type: 'container', name: 'Article content', parentId: 'article-section',
        children: ['article-title', 'article-date', 'article-cover', 'article-excerpt', 'article-body'], content: {},
        styles: { maxWidth: '880px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      },
      'article-title': {
        id: 'article-title', type: 'heading', name: 'Article title', parentId: 'article-container', children: [],
        content: { text: 'Article title', tag: 'h1', bindings: { text: { source: 'record', path: 'title', fallback: 'Article title' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '48px', fontWeight: 400, lineHeight: '1.16', textAlign: 'center', textColor: '#121127', marginBottom: '16px' },
        responsiveStyles: { mobile: { fontSize: '34px' } },
      },
      'article-date': {
        id: 'article-date', type: 'paragraph', name: 'Publication date', parentId: 'article-container', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'publishedAt', fallback: '', format: 'date' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '16px', textAlign: 'center', textColor: '#64748b', marginBottom: '34px' },
      },
      'article-cover': {
        id: 'article-cover', type: 'image', name: 'Cover image', parentId: 'article-container', children: [],
        content: {
          src: '/images/hero-wetland.webp', alt: 'Article cover', objectFit: 'cover',
          bindings: {
            src: { source: 'record', path: 'coverImageUrl', fallback: '/images/hero-wetland.webp', format: 'image' },
            alt: { source: 'record', path: 'title', fallback: 'Article cover', format: 'text' },
          },
        },
        styles: { width: '100%', height: '480px', borderRadius: '20px', marginBottom: '44px' },
        responsiveStyles: { mobile: { height: '250px', borderRadius: '14px' } },
      },
      'article-excerpt': {
        id: 'article-excerpt', type: 'paragraph', name: 'Introduction', parentId: 'article-container', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'excerpt', fallback: '', format: 'text' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '20px', lineHeight: '1.65', textColor: '#393939', marginBottom: '28px' },
      },
      'article-body': {
        id: 'article-body', type: 'rich-text', name: 'Article body', parentId: 'article-container', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'contentHtml', fallback: '', format: 'html' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '18px', lineHeight: '1.75', textColor: '#393939' },
      },
    },
  };
}
