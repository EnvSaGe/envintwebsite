import type { PageBlockTree } from '../builder-schema';

export function createImpactTemplateTree(): PageBlockTree {
  return {
    version: 2,
    rootIds: ['impact-section'],
    nodes: {
      'impact-section': { id: 'impact-section', type: 'section', name: 'Impact story', parentId: null, children: ['impact-container'], content: {}, styles: { backgroundColor: '#ffffff', paddingTop: '128px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' } },
      'impact-container': { id: 'impact-container', type: 'container', name: 'Impact content', parentId: 'impact-section', children: ['impact-title', 'impact-cover', 'impact-summary', 'impact-challenge-title', 'impact-challenge', 'impact-solution-title', 'impact-solution', 'impact-outcome-title', 'impact-outcome'], content: {}, styles: { maxWidth: '880px', marginLeft: 'auto', marginRight: 'auto', width: '100%' } },
      'impact-title': { id: 'impact-title', type: 'heading', name: 'Case study title', parentId: 'impact-container', children: [], content: { text: 'Impact case study', tag: 'h1', bindings: { text: { source: 'record', path: 'title', fallback: 'Impact case study' } } }, styles: { fontFamily: 'Neue Montreal, sans-serif', fontSize: '48px', fontWeight: 400, lineHeight: '1.2', textAlign: 'center', textColor: '#121127', marginBottom: '36px' }, responsiveStyles: { mobile: { fontSize: '34px' } } },
      'impact-cover': { id: 'impact-cover', type: 'image', name: 'Case study image', parentId: 'impact-container', children: [], content: { src: '/images/services-sustainability.webp', alt: 'Impact case study', objectFit: 'cover', bindings: { src: { source: 'record', path: 'coverImageUrl', fallback: '/images/services-sustainability.webp', format: 'image' }, alt: { source: 'record', path: 'title', fallback: 'Impact case study' } } }, styles: { width: '100%', height: '480px', borderRadius: '20px', marginBottom: '46px' }, responsiveStyles: { mobile: { height: '250px' } } },
      'impact-summary': { id: 'impact-summary', type: 'paragraph', name: 'Summary', parentId: 'impact-container', children: [], content: { html: '', bindings: { html: { source: 'record', path: 'summary', fallback: '' } } }, styles: { fontSize: '20px', lineHeight: '1.65', textColor: '#393939', marginBottom: '34px' } },
      'impact-challenge-title': { id: 'impact-challenge-title', type: 'heading', name: 'Challenge heading', parentId: 'impact-container', children: [], content: { text: 'Challenge', tag: 'h2' }, styles: { fontSize: '32px', fontWeight: 400, textColor: '#121127', marginTop: '28px', marginBottom: '14px' } },
      'impact-challenge': { id: 'impact-challenge', type: 'paragraph', name: 'Challenge', parentId: 'impact-container', children: [], content: { html: '', bindings: { html: { source: 'record', path: 'challenge', fallback: '' } } }, styles: { fontSize: '18px', lineHeight: '1.7', textColor: '#393939' } },
      'impact-solution-title': { id: 'impact-solution-title', type: 'heading', name: 'Solution heading', parentId: 'impact-container', children: [], content: { text: 'Solution', tag: 'h2' }, styles: { fontSize: '32px', fontWeight: 400, textColor: '#121127', marginTop: '34px', marginBottom: '14px' } },
      'impact-solution': { id: 'impact-solution', type: 'paragraph', name: 'Solution', parentId: 'impact-container', children: [], content: { html: '', bindings: { html: { source: 'record', path: 'solution', fallback: '' } } }, styles: { fontSize: '18px', lineHeight: '1.7', textColor: '#393939' } },
      'impact-outcome-title': { id: 'impact-outcome-title', type: 'heading', name: 'Outcome heading', parentId: 'impact-container', children: [], content: { text: 'Impact', tag: 'h2' }, styles: { fontSize: '32px', fontWeight: 400, textColor: '#121127', marginTop: '34px', marginBottom: '14px' } },
      'impact-outcome': { id: 'impact-outcome', type: 'paragraph', name: 'Outcome', parentId: 'impact-container', children: [], content: { html: '', bindings: { html: { source: 'record', path: 'outcome', fallback: '' } } }, styles: { fontSize: '18px', lineHeight: '1.7', textColor: '#393939' } },
    },
  };
}
