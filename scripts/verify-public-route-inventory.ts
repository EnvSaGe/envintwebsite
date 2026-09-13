import assert from 'node:assert/strict';
import {
  classifyPublicPath,
  isContentSitemap,
  normalizePublicPath,
} from './lib/public-route-inventory';

function verifyNormalization(): void {
  assert.equal(
    normalizePublicPath('https://envintglobal.com/about'),
    '/about/',
    'absolute live URLs must normalize to a trailing-slash pathname',
  );
  assert.equal(
    normalizePublicPath('/impact/example'),
    '/impact/example/',
    'nested relative paths must retain every segment',
  );
  assert.equal(normalizePublicPath('/'), '/', 'the home route must remain the root path');
}

function verifyClassification(): void {
  assert.equal(classifyPublicPath('/member/aseem-dixit/'), 'team-member');
  assert.equal(classifyPublicPath('/impact/example/'), 'impact');
  assert.equal(classifyPublicPath('/category/enviki/'), 'taxonomy');
  assert.equal(classifyPublicPath('/tag/explainer/'), 'taxonomy');
  assert.equal(classifyPublicPath('/author/envint/'), 'author');
  assert.equal(classifyPublicPath('/'), 'unique-page');
  assert.equal(classifyPublicPath('/about/'), 'unique-page');
  assert.equal(classifyPublicPath('/indias-new-labour-codes/'), 'article');
}

function verifySitemapSelection(): void {
  assert.equal(isContentSitemap('https://envintglobal.com/post-sitemap.xml'), true);
  assert.equal(isContentSitemap('https://envintglobal.com/impact-sitemap.xml'), true);
  assert.equal(isContentSitemap('https://envintglobal.com/ae_global_templates-sitemap.xml'), false);
  assert.equal(isContentSitemap('https://envintglobal.com/elementor-hf-sitemap.xml'), false);
  assert.equal(isContentSitemap('https://example.com/post-sitemap.xml'), false);
}

verifyNormalization();
verifyClassification();
verifySitemapSelection();

console.log('Public route inventory contracts pass.');
