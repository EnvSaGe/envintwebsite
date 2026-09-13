import type { DynamicQueryConfig } from '../content-bindings';
import type { PageBlockTree } from '../builder-schema';

export function createTaxonomyTemplateTree(query: DynamicQueryConfig = {
  source: 'insights', filters: [], sort: 'publishedAt:desc', limit: 24, pagination: 'pages',
}): PageBlockTree {
  return {
    version: 2,
    rootIds: ['archive-section'],
    nodes: {
      'archive-section': { id: 'archive-section', type: 'section', name: 'Archive', parentId: null, children: ['archive-container'], content: {}, styles: { backgroundColor: '#ffffff', paddingTop: '128px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' } },
      'archive-container': { id: 'archive-container', type: 'container', name: 'Archive content', parentId: 'archive-section', children: ['archive-title', 'archive-description', 'archive-grid'], content: {}, styles: { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', width: '100%' } },
      'archive-title': { id: 'archive-title', type: 'heading', name: 'Archive title', parentId: 'archive-container', children: [], content: { text: 'Archive', tag: 'h1', bindings: { text: { source: 'route', path: 'title', fallback: 'Archive' } } }, styles: { fontSize: '48px', fontWeight: 400, textColor: '#121127', marginBottom: '14px' }, responsiveStyles: { mobile: { fontSize: '34px' } } },
      'archive-description': { id: 'archive-description', type: 'paragraph', name: 'Archive description', parentId: 'archive-container', children: [], content: { html: '', bindings: { html: { source: 'route', path: 'description', fallback: '' } } }, styles: { maxWidth: '760px', fontSize: '18px', lineHeight: '1.6', textColor: '#555555', marginBottom: '40px' } },
      'archive-grid': { id: 'archive-grid', type: query.source === 'impacts' ? 'impact-grid' : query.source === 'team' ? 'team-grid' : query.source === 'services' ? 'service-cards' : 'insights-grid', name: 'Archive results', parentId: 'archive-container', children: [], content: { query }, styles: { width: '100%' } },
    },
  };
}
