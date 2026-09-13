import fs from 'fs';
import path from 'path';

// 1. Audit Impact Case Studies
const impacts = JSON.parse(fs.readFileSync('./apps/web/src/data/impacts.json', 'utf8'));
console.log('=== 1. AUDIT IMPACT CASE STUDIES ===');
console.log(`Total Impact Case Studies: ${impacts.length}`);

const impactImages = new Map();
const missingImpactImages = [];
for (const imp of impacts) {
  const img = imp.heroImage || imp.coverImage?.url;
  if (!img) {
    console.error(`ERROR: Case study "${imp.slug}" has no image!`);
  } else {
    impactImages.set(img, (impactImages.get(img) || 0) + 1);
    const diskPath = path.join('./apps/web/public', img);
    if (!fs.existsSync(diskPath)) {
      missingImpactImages.push({ slug: imp.slug, img });
    }
  }
}

console.log(`Unique impact images count: ${impactImages.size} / ${impacts.length}`);
if (impactImages.size === impacts.length) {
  console.log('SUCCESS: Every single impact card has a UNIQUE image!');
} else {
  console.warn('WARNING: Some impact images are duplicated across cards:');
  for (const [img, count] of impactImages.entries()) {
    if (count > 1) console.warn(`  - ${img}: used ${count} times`);
  }
}
if (missingImpactImages.length > 0) {
  console.error('ERROR: Missing impact images on disk:', missingImpactImages);
} else {
  console.log('SUCCESS: All impact images exist on disk!');
}

// 2. Audit Articles (Insights)
const insights = JSON.parse(fs.readFileSync('./apps/web/src/data/insights.json', 'utf8'));
console.log('\n=== 2. AUDIT ARTICLES & INSIGHTS ===');
console.log(`Total Articles in Canonical Data: ${insights.length}`);

const insightImages = new Map();
const missingInsightImages = [];
let articlesWithNoContent = 0;
let articlesWithNoTitle = 0;

for (const ins of insights) {
  if (!ins.title) articlesWithNoTitle++;
  if (!ins.contentHtml && !ins.content && !ins.excerpt) articlesWithNoContent++;

  const img = ins.coverImageUrl || ins.coverImage?.url || ins.heroImage;
  if (img) {
    insightImages.set(img, (insightImages.get(img) || 0) + 1);
    const diskPath = path.join('./apps/web/public', img);
    if (!fs.existsSync(diskPath)) {
      missingInsightImages.push({ slug: ins.slug, img });
    }
  }
}

console.log(`Unique article images count: ${insightImages.size}`);
console.log(`Articles with missing content: ${articlesWithNoContent}`);
console.log(`Articles with missing title: ${articlesWithNoTitle}`);
console.log(`Articles with missing disk images: ${missingInsightImages.length}`);

// 3. Audit Envision Category Articles
const envisionArticles = insights.filter((a) =>
  (a.categories || []).some((c) => c.toLowerCase().includes('envision'))
);
console.log(`\nEnvision Articles Count: ${envisionArticles.length} (Expected 41)`);
if (envisionArticles.length === 41) {
  console.log('SUCCESS: Exact 41 Envision articles verified!');
} else {
  console.warn(`WARNING: Found ${envisionArticles.length} Envision articles`);
}

// 4. Audit Services Fallback for Prop Tools Text
console.log('\n=== 3. AUDIT SERVICES PAGE PROP TOOLS ===');
const servicesFallback = fs.readFileSync('./apps/web/src/app/services/ServicesPageFallback.tsx', 'utf8');
const toolsBlock = servicesFallback.match(/const toolsList = \[([\s\S]*?)\];/)?.[1] || '';
const hasDescInTools = /desc:/.test(toolsBlock);
const hasDescParagraph = /\{tool\.desc\}/.test(servicesFallback);
console.log(`Has 'desc' property in toolsList: ${hasDescInTools}`);
console.log(`Has {tool.desc} paragraph rendered in card: ${hasDescParagraph}`);
if (!hasDescInTools && !hasDescParagraph) {
  console.log('SUCCESS: Descriptive paragraph text is removed from Prop Tools cards, matching live site Elementor styling!');
} else {
  console.error('ERROR: Description text still present in Prop Tools!');
}

console.log('\n=== AUDIT COMPLETE ===');
