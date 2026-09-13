import type { PageBlockTree } from '../builder-schema';

export function createTeamMemberTemplateTree(): PageBlockTree {
  return {
    version: 2,
    rootIds: ['member-section'],
    nodes: {
      'member-section': { id: 'member-section', type: 'section', name: 'Team profile', parentId: null, children: ['member-container'], content: {}, styles: { backgroundColor: '#ffffff', paddingTop: '112px', paddingBottom: '112px', paddingLeft: '24px', paddingRight: '24px' } },
      'member-container': { id: 'member-container', type: 'container', name: 'Profile card', parentId: 'member-section', children: ['member-flex'], content: {}, styles: { maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', width: '100%', backgroundColor: '#ffffff', borderRadius: '20px', padding: '48px', boxShadow: '0 14px 45px rgba(18,17,39,0.08)' }, responsiveStyles: { mobile: { padding: '24px' } } },
      'member-flex': { id: 'member-flex', type: 'flex', name: 'Profile columns', parentId: 'member-container', children: ['member-image', 'member-copy'], content: {}, styles: { display: 'flex', gap: '48px', alignItems: 'flex-start' }, responsiveStyles: { mobile: { flexDirection: 'column', gap: '28px' } } },
      'member-image': { id: 'member-image', type: 'image', name: 'Profile image', parentId: 'member-flex', children: [], content: { src: '/images/envint-circle-logo.png', alt: 'Envint team member', objectFit: 'cover', bindings: { src: { source: 'record', path: 'avatarUrl', fallback: '/images/envint-circle-logo.png', format: 'image' }, alt: { source: 'record', path: 'name', fallback: 'Envint team member' } } }, styles: { width: '320px', height: '320px', borderRadius: '16px' }, responsiveStyles: { mobile: { width: '100%', height: 'auto' } } },
      'member-copy': { id: 'member-copy', type: 'container', name: 'Profile details', parentId: 'member-flex', children: ['member-name', 'member-role', 'member-bio'], content: {}, styles: { width: '100%' } },
      'member-name': { id: 'member-name', type: 'heading', name: 'Name', parentId: 'member-copy', children: [], content: { text: 'Team member', tag: 'h1', bindings: { text: { source: 'record', path: 'name', fallback: 'Team member' } } }, styles: { fontSize: '42px', fontWeight: 500, textColor: '#004E35', marginBottom: '8px' }, responsiveStyles: { mobile: { fontSize: '34px' } } },
      'member-role': { id: 'member-role', type: 'paragraph', name: 'Role', parentId: 'member-copy', children: [], content: { html: '', bindings: { html: { source: 'record', path: 'roleTitle', fallback: '' } } }, styles: { fontSize: '20px', fontWeight: 500, textColor: '#2F7ABE', marginBottom: '24px' } },
      'member-bio': { id: 'member-bio', type: 'rich-text', name: 'Biography', parentId: 'member-copy', children: [], content: { html: '', bindings: { html: { source: 'record', path: 'bio', fallback: '' } } }, styles: { fontSize: '17px', lineHeight: '1.75', textColor: '#393939' } },
    },
  };
}
