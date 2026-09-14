import type { PageBlockTree } from '../builder-schema';

export function createArticleTemplateTree(): PageBlockTree {
  return {
    version: 2,
    rootIds: ['article-section'],
    nodes: {
      'article-section': {
        id: 'article-section', type: 'section', name: 'Article', parentId: null, children: ['article-cover-wrap', 'article-header-wrap', 'article-body-wrap'], content: {},
        styles: { backgroundColor: '#ffffff', paddingTop: '92px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' },
        responsiveStyles: { tablet: { paddingTop: '82px' }, mobile: { paddingTop: '74px', paddingBottom: '64px', paddingLeft: '18px', paddingRight: '18px' } },
      },
      'article-cover-wrap': {
        id: 'article-cover-wrap', type: 'container', name: 'Cover container', parentId: 'article-section', children: ['article-cover'], content: {},
        styles: { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      },
      'article-cover': {
        id: 'article-cover', type: 'image', name: 'Cover image', parentId: 'article-cover-wrap', children: [],
        content: {
          src: '/images/hero-wetland.webp', alt: 'Article cover', objectFit: 'cover',
          bindings: {
            src: { source: 'record', path: 'coverImageUrl', fallback: '/images/hero-wetland.webp', format: 'image' },
            alt: { source: 'record', path: 'title', fallback: 'Article cover', format: 'text' },
          },
        },
        styles: { width: '100%', height: '400px', borderRadius: '20px' },
        responsiveStyles: { tablet: { height: '360px' }, mobile: { height: '240px', borderRadius: '14px' } },
      },
      'article-header-wrap': {
        id: 'article-header-wrap', type: 'container', name: 'Article header', parentId: 'article-section', children: ['article-title', 'article-date', 'article-share'], content: {},
        styles: { position: 'relative', zIndex: 1, maxWidth: '960px', marginTop: '-80px', marginLeft: 'auto', marginRight: 'auto', width: '100%', backgroundColor: '#ffffff', borderRadius: '20px 20px 0 0', paddingTop: '42px', paddingBottom: '24px', paddingLeft: '45px', paddingRight: '45px' },
        responsiveStyles: { mobile: { marginTop: '-28px', paddingTop: '26px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '14px 14px 0 0' } },
      },
      'article-title': {
        id: 'article-title', type: 'heading', name: 'Article title', parentId: 'article-header-wrap', children: [],
        content: { text: 'Article title', tag: 'h1', bindings: { text: { source: 'record', path: 'title', fallback: 'Article title' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '32px', fontWeight: 400, lineHeight: '1.22', textAlign: 'left', textColor: '#121127', marginBottom: '16px' },
        responsiveStyles: { mobile: { fontSize: '28px' } },
      },
      'article-date': {
        id: 'article-date', type: 'paragraph', name: 'Publication date', parentId: 'article-header-wrap', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'publishedAt', fallback: '', format: 'date' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '14px', textAlign: 'left', textColor: '#64748b', marginBottom: '20px' },
      },
      'article-share': {
        id: 'article-share', type: 'social-share', name: 'Article sharing', parentId: 'article-header-wrap', children: [],
        content: {
          title: 'Article', url: '', buttonSize: 32, borderRadius: 4, gap: 10, alignment: 'left',
          bindings: {
            title: { source: 'record', path: 'title', fallback: 'Envint article' },
            url: { source: 'route', path: 'absoluteUrl', fallback: 'https://envintglobal.com/' },
          },
        },
        styles: { width: '100%' },
      },
      'article-body-wrap': {
        id: 'article-body-wrap', type: 'container', name: 'Article body container', parentId: 'article-section', children: ['article-excerpt', 'article-body'], content: {},
        styles: { maxWidth: '870px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
        responsiveStyles: { mobile: { paddingLeft: '20px', paddingRight: '20px' } },
      },
      'article-excerpt': {
        id: 'article-excerpt', type: 'paragraph', name: 'Introduction', parentId: 'article-body-wrap', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'excerpt', fallback: '', format: 'text' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '19px', lineHeight: '1.65', textColor: '#393939', marginBottom: '28px' },
      },
      'article-body': {
        id: 'article-body', type: 'rich-text', name: 'Article body', parentId: 'article-body-wrap', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'contentHtml', fallback: '', format: 'html' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '18px', lineHeight: '1.75', textColor: '#393939' },
      },
    },
  };
}
