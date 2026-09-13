import type { PageBlockTree } from '../builder-schema';

export function createGlobalCtaTemplateTree(): PageBlockTree {
  return {
    version: 2,
    rootIds: ['global-cta'],
    nodes: {
      'global-cta': { id: 'global-cta', type: 'section', name: 'Global call to action', parentId: null, children: ['global-cta-container'], content: {}, styles: { backgroundColor: '#004E35', paddingTop: '72px', paddingBottom: '72px', paddingLeft: '24px', paddingRight: '24px' } },
      'global-cta-container': { id: 'global-cta-container', type: 'container', name: 'CTA content', parentId: 'global-cta', children: ['global-cta-title', 'global-cta-body', 'global-cta-button'], content: {}, styles: { maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      'global-cta-title': { id: 'global-cta-title', type: 'heading', name: 'CTA heading', parentId: 'global-cta-container', children: [], content: { text: 'Business for Better', tag: 'h2', bindings: { text: { source: 'global', path: 'heading', fallback: 'Business for Better' } } }, styles: { fontSize: '42px', fontWeight: 400, textColor: '#ffffff', marginBottom: '14px' } },
      'global-cta-body': { id: 'global-cta-body', type: 'paragraph', name: 'CTA body', parentId: 'global-cta-container', children: [], content: { html: 'Connect with Envint to progress your sustainability journey.', bindings: { html: { source: 'global', path: 'body', fallback: 'Connect with Envint to progress your sustainability journey.' } } }, styles: { fontSize: '19px', lineHeight: '1.6', textColor: '#ffffff', marginBottom: '24px' } },
      'global-cta-button': { id: 'global-cta-button', type: 'button', name: 'CTA button', parentId: 'global-cta-container', children: [], content: { label: 'Connect', action: { type: 'link', url: '/connect/' }, variant: 'primary' }, styles: { backgroundColor: '#2F7ABE', textColor: '#ffffff', borderRadius: '12px', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '24px', paddingRight: '24px' } },
    },
  };
}

export function createGlobalHeaderTemplateTree(): PageBlockTree {
  return { version: 2, rootIds: [], nodes: {} };
}

export function createGlobalFooterTemplateTree(): PageBlockTree {
  return { version: 2, rootIds: [], nodes: {} };
}
