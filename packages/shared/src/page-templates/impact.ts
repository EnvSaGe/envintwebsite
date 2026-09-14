import type { PageBlockTree } from '../builder-schema';

export function createImpactTemplateTree(): PageBlockTree {
  return {
    version: 2,
    rootIds: ['impact-section'],
    nodes: {
      'impact-section': {
        id: 'impact-section', type: 'section', name: 'Impact story', parentId: null, children: ['impact-container'], content: {},
        styles: { backgroundColor: '#ffffff', paddingTop: '120px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' },
        responsiveStyles: { mobile: { paddingTop: '90px', paddingBottom: '64px', paddingLeft: '18px', paddingRight: '18px' } },
      },
      'impact-container': {
        id: 'impact-container', type: 'container', name: 'Impact content', parentId: 'impact-section', children: ['impact-title', 'impact-date', 'impact-cover', 'impact-body'], content: {},
        styles: { maxWidth: '880px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
      },
      'impact-title': {
        id: 'impact-title', type: 'heading', name: 'Case study title', parentId: 'impact-container', children: [],
        content: { text: 'Impact case study', tag: 'h1', bindings: { text: { source: 'record', path: 'title', fallback: 'Impact case study' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '48px', fontWeight: 400, lineHeight: '1.2', textAlign: 'center', textColor: '#121127', marginBottom: '14px' },
        responsiveStyles: { mobile: { fontSize: '34px' } },
      },
      'impact-date': {
        id: 'impact-date', type: 'paragraph', name: 'Publication date', parentId: 'impact-container', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'publishedAt', fallback: '', format: 'date' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '15px', textAlign: 'center', textColor: '#777777', marginBottom: '34px' },
      },
      'impact-cover': {
        id: 'impact-cover', type: 'image', name: 'Case study image', parentId: 'impact-container', children: [],
        content: { src: '/images/services-sustainability.webp', alt: 'Impact case study', objectFit: 'cover', bindings: { src: { source: 'record', path: 'coverImageUrl', fallback: '/images/services-sustainability.webp', format: 'image' }, alt: { source: 'record', path: 'title', fallback: 'Impact case study' } } },
        styles: { width: '100%', height: '460px', borderRadius: '20px', marginBottom: '46px' },
        responsiveStyles: { tablet: { height: '390px' }, mobile: { height: '250px', borderRadius: '14px' } },
      },
      'impact-body': {
        id: 'impact-body', type: 'rich-text', name: 'Case study body', parentId: 'impact-container', children: [],
        content: { html: '', bindings: { html: { source: 'record', path: 'contentHtml', fallback: '', format: 'html' } } },
        styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '18px', lineHeight: '1.7', textColor: '#393939' },
      },
    },
  };
}
