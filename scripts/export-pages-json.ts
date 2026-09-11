import fs from 'fs';
import path from 'path';
import { ALL_CORE_PAGES } from './seed-pages-content';

const map: Record<string, any> = {};
for (const p of ALL_CORE_PAGES) {
  map[p.slug] = {
    slug: p.slug,
    title: p.title,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    layoutTemplate: p.layoutTemplate,
    status: 'PUBLISHED',
    contentBlocks: p.contentBlocks,
  };
}

const targetPath = path.resolve(__dirname, '../apps/admin/src/data/pages-content.json');
fs.writeFileSync(targetPath, JSON.stringify(map, null, 2), 'utf-8');
console.log(`Successfully wrote ${targetPath} with ${Object.keys(map).length} pages.`);
