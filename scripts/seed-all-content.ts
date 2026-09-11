/**
 * scripts/seed-all-content.ts
 *
 * One-off CLI seed script — idempotent (safe to run multiple times).
 * Reads all existing JSON data files and upserts into Neon Postgres.
 *
 * Usage:
 *   pnpm seed
 *   # or directly:
 *   tsx scripts/seed-all-content.ts
 *
 * Requirements:
 *   DATABASE_URL environment variable must be set in packages/db/.env
 *   or exported in the shell before running.
 */

import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';

// Load DATABASE_URL from packages/db/.env
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { db } from '../packages/db/src/client';
import {
  pages,
  insights,
  impactCaseStudies,
  teamMembers,
  categories,
  tags,
  insightCategories,
  insightTags,
  navigationItems,
  siteSettings,
} from '../packages/db/src/schema';
import { eq, sql } from 'drizzle-orm';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJson<T>(relPath: string): T {
  const abs = path.resolve(__dirname, relPath);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠️  File not found, skipping: ${abs}`);
    return [] as unknown as T;
  }
  return JSON.parse(fs.readFileSync(abs, 'utf-8')) as T;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadingTime(html: string | undefined | null): number {
  if (!html) return 3;
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── 1. Seed Categories & Tags ──────────────────────────────────────────────

// Collect all unique categories and tags from both insights and impacts
async function seedTaxonomies(
  allCategories: string[],
  allTags: string[],
): Promise<{
  categoryMap: Map<string, string>; // name → id
  tagMap: Map<string, string>;       // name → id
}> {
  console.log('\n📂 Seeding categories and tags...');

  const categoryMap = new Map<string, string>();
  const tagMap = new Map<string, string>();

  for (const name of allCategories) {
    const slug = slugify(name);
    const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
    if (existing.length > 0) {
      categoryMap.set(name, existing[0].id);
    } else {
      const [inserted] = await db.insert(categories).values({ slug, name }).returning({ id: categories.id });
      categoryMap.set(name, inserted.id);
      console.log(`  ✅ Category: ${name}`);
    }
  }

  for (const name of allTags) {
    const slug = slugify(name);
    const existing = await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, slug)).limit(1);
    if (existing.length > 0) {
      tagMap.set(name, existing[0].id);
    } else {
      const [inserted] = await db.insert(tags).values({ slug, name }).returning({ id: tags.id });
      tagMap.set(name, inserted.id);
      console.log(`  ✅ Tag: ${name}`);
    }
  }

  console.log(`  → ${categoryMap.size} categories, ${tagMap.size} tags ready.`);
  return { categoryMap, tagMap };
}

// ─── 2. Seed Team Members ────────────────────────────────────────────────────

async function seedTeam() {
  console.log('\n👥 Seeding team members...');

  const teamData: any[] = readJson('../apps/web/src/data/team.json');
  let count = 0;

  for (let i = 0; i < teamData.length; i++) {
    const m = teamData[i];
    const slug = m.slug || slugify(m.name);
    const avatarUrl = m.image?.url || m.avatarUrl || null;

    await db
      .insert(teamMembers)
      .values({
        slug,
        name: m.name,
        roleTitle: m.roleTitle || m.role || 'Team Member',
        bio: m.bio || '',
        shortBio: m.shortBio || null,
        avatarUrl,
        linkedinUrl: m.linkedinUrl || null,
        twitterUrl: m.twitterUrl || null,
        email: m.email || null,
        isLeadership: m.isLeadership !== undefined ? m.isLeadership : true,
        hasStandaloneRoute: m.hasStandaloneRoute !== undefined ? m.hasStandaloneRoute : true,
        orderIndex: i,
        status: 'PUBLISHED',
        seoTitle: `${m.name} - ${m.roleTitle || 'Team Member'} at Envint`,
        seoDescription: m.shortBio || `${m.name} is ${m.roleTitle || 'a team member'} at Envint, a sustainability and ESG advisory firm.`,
      })
      .onConflictDoUpdate({
        target: teamMembers.slug,
        set: {
          name: sql`excluded.name`,
          roleTitle: sql`excluded.role_title`,
          bio: sql`excluded.bio`,
          shortBio: sql`excluded.short_bio`,
          avatarUrl: sql`excluded.avatar_url`,
          linkedinUrl: sql`excluded.linkedin_url`,
          hasStandaloneRoute: sql`excluded.has_standalone_route`,
          orderIndex: sql`excluded.order_index`,
          status: sql`excluded.status`,
          updatedAt: new Date(),
        },
      });
    count++;
  }

  console.log(`  → ${count} team members upserted.`);
}

// ─── 3. Seed Insights / Articles ────────────────────────────────────────────

async function seedInsights(categoryMap: Map<string, string>, tagMap: Map<string, string>) {
  console.log('\n📰 Seeding insights / articles...');

  const insightsData: any[] = readJson('../apps/web/src/data/insights.json');
  let count = 0;
  let skipped = 0;

  for (const item of insightsData) {
    if (!item.slug || !item.title) {
      skipped++;
      continue;
    }

    const publishedAt = item.publishedAt ? new Date(item.publishedAt) : new Date();
    const coverImageUrl = item.coverImage?.url || item.heroImage || null;

    const [upserted] = await db
      .insert(insights)
      .values({
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt || null,
        contentFormat: 'HTML',
        contentHtml: item.contentHtml || null,
        readingTimeMinutes: estimateReadingTime(item.contentHtml),
        coverImageUrl,
        status: 'PUBLISHED',
        seoTitle: item.seoTitle || item.title,
        seoDescription: item.seoDescription || item.excerpt || null,
        publishedAt,
        migrationProvenance: { source: 'local-json', originalId: item.id },
      })
      .onConflictDoUpdate({
        target: insights.slug,
        set: {
          title: sql`excluded.title`,
          excerpt: sql`excluded.excerpt`,
          contentHtml: sql`excluded.content_html`,
          coverImageUrl: sql`excluded.cover_image_url`,
          status: sql`excluded.status`,
          seoTitle: sql`excluded.seo_title`,
          seoDescription: sql`excluded.seo_description`,
          publishedAt: sql`excluded.published_at`,
          updatedAt: new Date(),
        },
      })
      .returning({ id: insights.id });

    const insightId = upserted.id;

    // Wire up categories
    const insightCats: string[] = item.categories || [];
    for (const catName of insightCats) {
      const catId = categoryMap.get(catName);
      if (!catId) continue;
      await db
        .insert(insightCategories)
        .values({ insightId, categoryId: catId })
        .onConflictDoNothing();
    }

    // Wire up tags
    const insightTagNames: string[] = item.tags || [];
    for (const tagName of insightTagNames) {
      const tagId = tagMap.get(tagName);
      if (!tagId) continue;
      await db
        .insert(insightTags)
        .values({ insightId, tagId })
        .onConflictDoNothing();
    }

    count++;
    if (count % 10 === 0) {
      process.stdout.write(`  → ${count}/${insightsData.length} articles seeded...\r`);
    }
  }

  console.log(`\n  → ${count} insights upserted, ${skipped} skipped (missing slug/title).`);
}

// ─── 4. Seed Impact Case Studies ─────────────────────────────────────────────

async function seedImpacts() {
  console.log('\n📊 Seeding impact case studies...');

  const impactsData: any[] = readJson('../apps/web/src/data/impacts.json');
  let count = 0;

  for (let i = 0; i < impactsData.length; i++) {
    const item = impactsData[i];
    if (!item.slug || !item.title) continue;

    const publishedAt = item.publishedAt ? new Date(item.publishedAt) : new Date();
    const coverImageUrl = item.coverImage?.url || item.heroImage || null;

    await db
      .insert(impactCaseStudies)
      .values({
        slug: item.slug,
        title: String(item.title).replace(/<!--\[CDATA\[(.*?)\]\]-->/gs, '$1').trim(),
        summary: String(item.summary || item.cardExcerpt || item.title).trim(),
        clientType: item.clientType || null,
        contentHtml: item.contentHtml || null,
        coverImageUrl,
        orderIndex: i,
        status: 'PUBLISHED',
        seoTitle: item.seoTitle || item.title,
        seoDescription: item.seoDescription || item.summary || item.cardExcerpt || null,
        publishedAt,
        migrationProvenance: { source: 'local-json', originalId: item.id },
      })
      .onConflictDoUpdate({
        target: impactCaseStudies.slug,
        set: {
          title: sql`excluded.title`,
          summary: sql`excluded.summary`,
          contentHtml: sql`excluded.content_html`,
          coverImageUrl: sql`excluded.cover_image_url`,
          orderIndex: sql`excluded.order_index`,
          status: sql`excluded.status`,
          updatedAt: new Date(),
        },
      });

    count++;
    if (count % 5 === 0) {
      process.stdout.write(`  → ${count}/${impactsData.length} impacts seeded...\r`);
    }
  }

  console.log(`\n  → ${count} impact case studies upserted.`);
}

// ─── 5. Seed Pages (all content blocks) ──────────────────────────────────────

const ALL_PAGES: Array<{
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  layoutTemplate: string;
  contentBlocks: any[];
}> = [
  // ── Pages already in pages-content.json ──
  {
    slug: '/about',
    title: 'About Envint',
    seoTitle: 'About Envint - Purpose, Journey & Leadership Team',
    seoDescription: 'Learn about Envint\'s founding journey, our mission to drive sustainability into mainstream action, and meet our multidisciplinary leadership team.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_about_hero', name: 'Hero Section', type: 'about-hero', enabled: true, props: { badge: 'About Envint', title: 'Shaping ESG & Climate Action Globally', subtitle: 'A global sustainability and climate advisory delivering impact for enterprises, institutions, and investors.' } },
      { id: 'block_about_vision', name: 'Vision & Purpose', type: 'about-vision', enabled: true, props: { statement: 'Envint is a sustainability and ESG solutions firm, founded with a purpose to shape a more liveable planet for the coming generations.', belief: 'Our mission is to drive sustainability into mainstream thought and action, with the belief that \'green makes sense beyond conscience\'.', strategy: 'We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.' } },
      { id: 'block_about_founders', name: 'How It All Began', type: 'about-founders', enabled: true, props: { title: 'How it all began', paragraph1: 'A deep conviction to create an impact in the environment sector, steadfast encouragement from family & friends and a few coffee shop meetings was all it took Anand and Manish to start Envint in June 2018.', paragraph2: 'Envint is a portmanteau of \'environment\' and \'intelligence\' and an anagram of \'invent\', reflecting a new approach to business.', image: '/images/founders-anand-manish.webp' } },
      { id: 'block_about_journey', name: 'Our Journey Timeline', type: 'about-journey', enabled: true, props: { title: 'Our Journey', subtitle: 'From inception in Mumbai to an international sustainability advisory partner.' } },
      { id: 'block_about_team', name: 'Leadership & Team', type: 'about-team', enabled: true, props: { title: 'A team you\'ll be proud to call your own', subtitle: 'Our team is based across multiple locations in India and other geographies.' } },
    ],
  },
  {
    slug: '/services',
    title: 'Sustainability & ESG Advisory Services',
    seoTitle: 'Sustainability & ESG Advisory Services - Envint',
    seoDescription: 'Explore Envint\'s tiered capability model: Sustainability Integration, Climate Action, Responsible Investment, sector expertise, and proprietary ESG tools.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_services_hero', name: 'Services Hero', type: 'about-hero', enabled: true, props: { badge: 'Advisory Capabilities', title: 'Comprehensive ESG & Climate Solutions', subtitle: 'Combining strategic insight with rigorous technical analysis to create measurable sustainability impact.', bgImage: '/images/services-hero.webp' } },
      { id: 'block_services_pillars', name: 'Pillars of Practice', type: 'feature-cards', enabled: true, props: { title: 'Our Core Capabilities', subtitle: 'Specialized service practices tailored for corporate and institutional investors.', card1_title: 'Sustainability Integration', card1_desc: 'Embedding ESG into core enterprise strategy, governance frameworks, and executive scorecards.', card2_title: 'Climate Action & Decarbonization', card2_desc: 'Net-zero pathways, Scope 1-3 GHG accounting, Science Based Targets (SBTi), and carbon mitigation.', card3_title: 'Responsible Investment', card3_desc: 'Pre-investment ESG due diligence, portfolio monitoring, and SFDR / ISSB compliance.' } },
      { id: 'block_services_stats', name: 'Track Record Metrics', type: 'stats-counter', enabled: true, props: { title: 'Proven Execution at Scale', stat1_num: '500+', stat1_label: 'Advisory Engagements', stat2_num: '100+', stat2_label: 'Institutional Clients', stat3_num: '15+', stat3_label: 'Global Markets', stat4_num: '6+', stat4_label: 'Years Delivering Impact' } },
      { id: 'block_services_cta', name: 'Call to Action', type: 'cta-banner', enabled: true, props: { headline: 'Partner With Our Senior Advisory Leaders', subtext: 'Schedule an initial consultation to review your sustainability roadmap and disclosure goals.', buttonLabel: 'Initiate Scoping Discussion', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/impact',
    title: 'Client Impact & Case Studies Hub',
    seoTitle: 'ESG & Sustainability Impact Case Studies - Envint',
    seoDescription: 'Explore Envint\'s portfolio of 300+ sustainability engagements across climate action, ESG due diligence, decarbonization, and responsible investment.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_impact_hero', name: 'Impact Hero', type: 'about-hero', enabled: true, props: { badge: 'Client Outcomes', title: 'Real Impact. Measurable Results.', subtitle: '300+ sustainability engagements delivered across India and global markets.', bgImage: '/images/impact-hero.webp' } },
      { id: 'block_impact_stats', name: 'Impact Statistics', type: 'stats-counter', enabled: true, props: { title: 'Our Track Record', stat1_num: '300+', stat1_label: 'Engagements Delivered', stat2_num: '100+', stat2_label: 'Clients Served', stat3_num: '26+', stat3_label: 'Case Studies Published', stat4_num: '6+', stat4_label: 'Years of Impact' } },
      { id: 'block_impact_grid', name: 'Case Studies Grid', type: 'impact-grid', enabled: true, props: { title: 'Selected Case Studies', subtitle: 'Explore how we have helped clients navigate sustainability challenges.' } },
      { id: 'block_impact_cta', name: 'CTA Banner', type: 'cta-banner', enabled: true, props: { headline: 'Ready to Create Impact?', subtext: 'Partner with our senior advisory team to build your sustainability roadmap.', buttonLabel: 'Connect With Us', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/careers-at-envint',
    title: 'Careers at Envint',
    seoTitle: 'Careers at Envint | Join Our Sustainability Mission',
    seoDescription: 'Explore career opportunities at Envint. Work on climate action, decarbonization, and ESG solutions with an impact-driven team.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_career_hero', name: 'Careers Hero', type: 'career-hero', enabled: true, props: { title: 'Build a Career with Real Climate Impact', subtitle: 'Join a team passionate about driving sustainable business transformation across industries.', bgImage: '/images/careers-hero.webp' } },
      { id: 'block_career_values', name: 'Our Values', type: 'feature-cards', enabled: true, props: { title: 'Why Envint?', subtitle: 'We are a purpose-driven team committed to meaningful environmental and social change.', card1_title: 'Purpose-Led Work', card1_desc: 'Every project contributes to real climate and sustainability outcomes for businesses and communities.', card2_title: 'Expert Mentorship', card2_desc: 'Learn from senior practitioners with deep expertise in ESG, climate finance, and regulatory frameworks.', card3_title: 'Global Exposure', card3_desc: 'Work on assignments spanning India, Southeast Asia, Europe, and the Middle East.' } },
      { id: 'block_career_cta', name: 'Apply CTA', type: 'cta-banner', enabled: true, props: { headline: 'Ready to Make an Impact?', subtext: 'Send your profile to careers@envintglobal.com and let\'s start the conversation.', buttonLabel: 'Email Your Application', buttonUrl: 'mailto:careers@envintglobal.com' } },
    ],
  },
  {
    slug: '/connect',
    title: 'Contact & Connect',
    seoTitle: 'Connect with Envint - ESG & Climate Advisory',
    seoDescription: 'Get in touch with Envint\'s sustainability partners in Mumbai, Delhi NCR, Bangalore, and international offices.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_connect_hero', name: 'Connect Hero', type: 'about-hero', enabled: true, props: { badge: 'Start the Conversation', title: 'Let\'s Shape a Sustainable Future Together', subtitle: 'Reach out to discuss advisory engagements, institutional partnerships, or speaking opportunities.' } },
      { id: 'block_connect_faq', name: 'Client FAQ', type: 'faq-accordion', enabled: true, props: { title: 'Engagement FAQs', q1: 'Where are Envint advisory teams based?', a1: 'We operate from Mumbai, Gurugram (Delhi NCR), and Bengaluru, serving clients across South Asia, the Middle East, Europe, and North America.', q2: 'What is the typical scoping process?', a2: 'Following an initial discovery discussion, we provide a detailed technical proposal with clear milestone deliverables and timeline commitments within 3 to 5 business days.', q3: 'What sectors do you primarily serve?', a3: 'We serve infrastructure, financial services, manufacturing, energy, healthcare, technology, and agriculture sectors, among others.' } },
      { id: 'block_connect_cta', name: 'Direct Consultation CTA', type: 'cta-banner', enabled: true, props: { headline: 'Prefer Direct Email?', subtext: 'Write directly to our advisory partners at connect@envintglobal.com.', buttonLabel: 'Email Our Team', buttonUrl: 'mailto:connect@envintglobal.com' } },
    ],
  },
  {
    slug: '/disclaimer',
    title: 'Legal & Terms Disclaimer',
    seoTitle: 'Legal Disclaimer - Envint',
    seoDescription: 'Legal terms, disclaimers, and terms of use for the Envint website and advisory services.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_disclaimer_hero', name: 'Disclaimer Hero', type: 'hero-banner', enabled: true, props: { badge: 'Legal', title: 'Disclaimer & Terms of Use', subtitle: 'Please read these terms carefully before using our website or services.', bgImage: '/images/about-hero.webp' } },
      { id: 'block_disclaimer_content', name: 'Disclaimer Content', type: 'rich-text', enabled: true, props: { title: 'Important Information', content: '<p>The information on this website is for general informational purposes only. Envint makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.</p><p>The views expressed on this website are those of the authors and do not necessarily reflect the views of Envint or its clients. Past performance is not a reliable indicator of future results.</p>' } },
    ],
  },
  {
    slug: '/connect-gbc2024',
    title: 'Global Business Coalition 2024 Campaign',
    seoTitle: 'GBC 2024 - Envint at the Global Business Coalition',
    seoDescription: 'Envint at the Global Business Coalition 2024 — connecting sustainability leaders to advance climate action globally.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_gbc_hero', name: 'GBC 2024 Hero', type: 'hero-banner', enabled: true, props: { badge: 'Global Business Coalition 2024', title: 'Advancing Climate Action at GBC 2024', subtitle: 'Envint engages global business leaders to accelerate sustainability transitions.', bgImage: '/images/about-hero.webp', ctaLabel: 'Connect With Us', ctaUrl: '/connect' } },
      { id: 'block_gbc_content', name: 'GBC Overview', type: 'story-narrative', enabled: true, props: { tagline: 'GLOBAL ENGAGEMENT', headline: 'Shaping the Future of Responsible Business', description: 'At GBC 2024, Envint connected with leading institutions, investors, and corporations to advance the global sustainability agenda. Our team participated in key panels on ESG integration, climate finance, and supply chain transparency.', paragraph1: 'The Global Business Coalition brings together the world\'s most forward-thinking organizations to align on common frameworks for sustainability, responsible investment, and climate-aligned business practices.' } },
      { id: 'block_gbc_cta', name: 'GBC CTA', type: 'cta-banner', enabled: true, props: { headline: 'Ready to Advance Your Sustainability Goals?', subtext: 'Partner with Envint to align your business with global sustainability frameworks.', buttonLabel: 'Connect With Envint', buttonUrl: '/connect' } },
    ],
  },
  // ── Advisory Practice Pages ──
  {
    slug: '/sustainability-integration',
    title: 'Sustainability Integration Practice',
    seoTitle: 'Sustainability Integration Advisory - Envint',
    seoDescription: 'Envint helps organizations embed sustainability into core strategy, governance, reporting, and supply chains through our Sustainability Integration advisory practice.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_si_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'Sustainability Integration', title: 'Embedding Sustainability into Enterprise DNA', subtitle: 'Strategic frameworks, governance design, and ESG disclosure for lasting organizational transformation.', bgImage: '/images/sustainability-hero.webp' } },
      { id: 'block_si_narrative', name: 'Practice Overview', type: 'story-narrative', enabled: true, props: { tagline: 'OUR APPROACH', headline: 'From Compliance to Competitive Advantage', description: 'We help companies move beyond ESG reporting checklists to build authentic sustainability into their strategy, operations, and stakeholder relationships.', paragraph1: 'Our Sustainability Integration practice works with boards, C-suites, and functional leaders to embed environmental and social considerations into core business decisions — creating both risk mitigation and value creation opportunities.' } },
      { id: 'block_si_capabilities', name: 'Key Capabilities', type: 'feature-cards', enabled: true, props: { title: 'What We Deliver', subtitle: 'Structured advisory across the ESG integration lifecycle.', card1_title: 'ESG Strategy & Roadmaps', card1_desc: 'Materiality assessments, ESG frameworks, board-level scorecards, and long-term sustainability ambition setting.', card2_title: 'Reporting & Disclosure', card2_desc: 'BRSR, CSRD, GRI, ISSB, and TCFD-aligned disclosure support with data verification and assurance guidance.', card3_title: 'Supply Chain Sustainability', card3_desc: 'Value chain mapping, supplier ESG assessments, and responsible procurement frameworks.' } },
      { id: 'block_si_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Start Your Sustainability Integration Journey', subtext: 'Connect with our senior partners to design your ESG strategy roadmap.', buttonLabel: 'Schedule a Consultation', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/climate-action',
    title: 'Climate Action & Decarbonization Practice',
    seoTitle: 'Climate Action & Decarbonization Advisory - Envint',
    seoDescription: 'Envint\'s Climate Action practice helps organizations measure, reduce, and disclose greenhouse gas emissions through net-zero pathways and science-based targets.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_ca_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'Climate Action', title: 'Net-Zero Pathways for a Resilient Future', subtitle: 'GHG accounting, decarbonization strategy, and Science Based Targets advisory for India\'s leading organizations.', bgImage: '/images/climate-hero.webp' } },
      { id: 'block_ca_narrative', name: 'Practice Overview', type: 'story-narrative', enabled: true, props: { tagline: 'OUR APPROACH', headline: 'From Emissions Accounting to Transition Strategy', description: 'We help companies understand their full carbon footprint, set ambitious and credible reduction targets, and build implementable decarbonization roadmaps.', paragraph1: 'Climate risk is no longer a long-term concern — it is an immediate strategic and financial issue. Our Climate Action practice equips organizations to measure, disclose, and reduce their environmental impact while capturing low-carbon growth opportunities.' } },
      { id: 'block_ca_capabilities', name: 'Capabilities', type: 'feature-cards', enabled: true, props: { title: 'Our Climate Services', card1_title: 'GHG Footprinting', card1_desc: 'Scope 1, 2, and 3 emissions accounting using GHG Protocol methodology across industries and geographies.', card2_title: 'Science Based Targets', card2_desc: 'SBTi alignment, near-term and long-term target setting, and interim milestone tracking for net-zero commitments.', card3_title: 'Climate Risk Assessment', card3_desc: 'Physical and transition risk identification using TCFD framework, NGFS scenarios, and site-level hazard mapping.' } },
      { id: 'block_ca_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Accelerate Your Climate Transition', subtext: 'Work with our climate specialists to design credible, science-based decarbonization plans.', buttonLabel: 'Begin Your Net-Zero Journey', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/responsible-investment',
    title: 'Responsible Investment & Due Diligence',
    seoTitle: 'Responsible Investment & ESG Due Diligence - Envint',
    seoDescription: 'Envint\'s Responsible Investment practice provides pre-investment ESG due diligence, portfolio monitoring, and E&S risk management for institutional investors and funds.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_ri_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'Responsible Investment', title: 'ESG Due Diligence for Informed Investment Decisions', subtitle: 'Pre-investment screening, portfolio monitoring, and E&S risk management for institutional investors across India and global markets.', bgImage: '/images/investment-hero.webp' } },
      { id: 'block_ri_narrative', name: 'Practice Overview', type: 'story-narrative', enabled: true, props: { tagline: 'OUR APPROACH', headline: 'Integrating ESG at Every Stage of the Investment Lifecycle', description: 'We partner with private equity funds, DFIs, family offices, and strategic investors to embed environmental and social considerations from deal origination through portfolio management.', paragraph1: 'Our Responsible Investment team has conducted ESG due diligence across more than 100 transactions, covering healthcare, financial services, manufacturing, infrastructure, and technology sectors.' } },
      { id: 'block_ri_capabilities', name: 'Capabilities', type: 'feature-cards', enabled: true, props: { title: 'Our RI Services', card1_title: 'Pre-Investment ESG-DD', card1_desc: 'Comprehensive environmental, social, and governance risk assessment for PE/VC and DFI transactions, aligned with IFC Performance Standards.', card2_title: 'ESAP & Action Plans', card2_desc: 'Environmental and Social Action Plans (ESAPs) with prioritized remediation roadmaps and compliance timelines.', card3_title: 'Portfolio ESG Monitoring', card3_desc: 'Ongoing portfolio-level ESG performance tracking, reporting templates, and fund-level disclosure support.' } },
      { id: 'block_ri_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Enhance Your Investment Decision-Making', subtext: 'Work with our RI team to integrate ESG into your investment framework.', buttonLabel: 'Connect With Our RI Team', buttonUrl: '/connect' } },
    ],
  },
  // ── Knowledge Hubs ──
  {
    slug: '/envision',
    title: 'Envision Insights Hub',
    seoTitle: 'Envision — ESG & Sustainability Insights Hub | Envint',
    seoDescription: 'Envision is Envint\'s flagship insights platform publishing thought leadership, research, and practical guides on ESG, climate action, and sustainable finance.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_envision_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'Envision', title: 'ESG Insights for Forward-Thinking Leaders', subtitle: 'Research, analysis, and practical guides on sustainability, climate finance, and responsible business.', bgImage: '/images/envision-hero.webp' } },
      { id: 'block_envision_grid', name: 'Articles Grid', type: 'insights-grid', enabled: true, props: { title: 'Latest Insights', subtitle: 'Explore our latest research and thought leadership.', filterCategory: 'Envision' } },
      { id: 'block_envision_cta', name: 'Newsletter CTA', type: 'cta-banner', enabled: true, props: { headline: 'Stay Ahead of ESG Trends', subtext: 'Subscribe to Envision for curated sustainability intelligence delivered to your inbox.', buttonLabel: 'Subscribe to Envision', buttonUrl: 'mailto:connect@envintglobal.com?subject=Subscribe to Envision' } },
    ],
  },
  {
    slug: '/behind-the-buzz',
    title: 'Behind the Buzz Editorial Hub',
    seoTitle: 'Behind the Buzz — ESG Jargon Decoded | Envint',
    seoDescription: 'Behind the Buzz demystifies the most overused ESG buzzwords — helping practitioners distinguish substance from marketing noise in sustainability discourse.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_btb_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'Behind the Buzz', title: 'Decoding the Sustainability Buzzwords', subtitle: 'Clear-eyed analysis of the ESG terms and concepts that matter — without the marketing noise.', bgImage: '/images/about-hero.webp' } },
      { id: 'block_btb_grid', name: 'Articles Grid', type: 'insights-grid', enabled: true, props: { title: 'Behind the Buzz Articles', filterCategory: 'Behind the Buzz' } },
      { id: 'block_btb_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Have a Buzzword You Want Decoded?', subtext: 'Write to us at connect@envintglobal.com with your suggestions.', buttonLabel: 'Submit a Topic', buttonUrl: 'mailto:connect@envintglobal.com?subject=Behind the Buzz topic suggestion' } },
    ],
  },
  {
    slug: '/how-to-articles',
    title: 'How-To Practical ESG Guides Hub',
    seoTitle: 'How-To ESG Guides — Practical Sustainability Guides | Envint',
    seoDescription: 'Step-by-step guides and practical frameworks for implementing ESG, calculating carbon footprints, conducting due diligence, and more.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_howto_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'How-To Guides', title: 'Step-by-Step ESG Implementation Guides', subtitle: 'Practical frameworks and playbooks for sustainability practitioners across functions and industries.' } },
      { id: 'block_howto_grid', name: 'Guides Grid', type: 'insights-grid', enabled: true, props: { title: 'How-To Articles', filterCategory: 'How-To' } },
      { id: 'block_howto_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Need Expert Guidance?', subtext: 'Our advisory team can walk you through implementation step-by-step.', buttonLabel: 'Book a Consultation', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/enviki',
    title: 'Enviki Sustainability Wiki Hub',
    seoTitle: 'Enviki — ESG & Sustainability Wiki | Envint',
    seoDescription: 'Enviki is Envint\'s sustainability knowledge base — a comprehensive wiki of ESG concepts, regulatory frameworks, and climate terms.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_enviki_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'Enviki', title: 'Your ESG Knowledge Base', subtitle: 'The most comprehensive sustainability wiki for practitioners, investors, and policymakers.' } },
      { id: 'block_enviki_grid', name: 'Wiki Articles', type: 'insights-grid', enabled: true, props: { title: 'Browse the Enviki', filterCategory: 'Enviki' } },
      { id: 'block_enviki_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Can\'t Find What You Need?', subtext: 'Our experts are here to help you navigate sustainability complexity.', buttonLabel: 'Ask Our Team', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/glossary-zone',
    title: 'ESG & Climate Glossary Hub',
    seoTitle: 'ESG & Climate Glossary — Terms Defined | Envint',
    seoDescription: 'The definitive ESG and sustainability glossary — clear definitions for every acronym, framework, and standard from BRSR to TCFD.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_glossary_hero', name: 'Hero', type: 'about-hero', enabled: true, props: { badge: 'Glossary Zone', title: 'The ESG & Climate Terms Dictionary', subtitle: 'Clear definitions for every sustainability acronym, standard, and framework you\'ll encounter.' } },
      { id: 'block_glossary_grid', name: 'Glossary Terms', type: 'insights-grid', enabled: true, props: { title: 'Browse the Glossary', filterCategory: 'Glossary' } },
      { id: 'block_glossary_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Need Expert Clarity?', subtext: 'Our team can help translate complex ESG requirements into clear, actionable insights.', buttonLabel: 'Connect With Our Team', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/esq',
    title: 'Environmental Sustainability Quotient (ESQ)',
    seoTitle: 'ESQ — Environmental Sustainability Quotient | Envint',
    seoDescription: 'The Environmental Sustainability Quotient (ESQ) is Envint\'s proprietary index measuring a company\'s overall sustainability maturity across environmental, social, and governance dimensions.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_esq_hero', name: 'ESQ Hero', type: 'hero-banner', enabled: true, props: { badge: 'Proprietary Tool', title: 'Environmental Sustainability Quotient', subtitle: 'Envint\'s ESQ index provides a holistic, data-driven measurement of sustainability maturity for any organization.', bgImage: '/images/esq-hero.webp', ctaLabel: 'Learn More', ctaUrl: '/connect' } },
      { id: 'block_esq_narrative', name: 'ESQ Overview', type: 'story-narrative', enabled: true, props: { tagline: 'WHAT IS ESQ?', headline: 'A Rigorous, Comparable Sustainability Score', description: 'The Environmental Sustainability Quotient (ESQ) is a composite index that evaluates an organization\'s sustainability maturity across environmental, social, and governance pillars, benchmarked against sector peers.', paragraph1: 'Unlike compliance-only metrics, ESQ measures actual outcomes — helping boards and investors understand where an organization truly stands on its sustainability journey.' } },
      { id: 'block_esq_cta', name: 'ESQ CTA', type: 'cta-banner', enabled: true, props: { headline: 'Request Your ESQ Assessment', subtext: 'Connect with our team to explore how ESQ can inform your sustainability strategy.', buttonLabel: 'Request ESQ Assessment', buttonUrl: '/connect' } },
    ],
  },
  {
    slug: '/mapsense',
    title: 'MapSense™ Spatial Environmental Screening',
    seoTitle: 'MapSense™ — Spatial ESG & Environmental Risk Screening | Envint',
    seoDescription: 'MapSense is Envint\'s proprietary geospatial environmental and social risk screening tool, mapping physical climate risks, biodiversity exposure, and community sensitivities.',
    layoutTemplate: 'standard',
    contentBlocks: [
      { id: 'block_mapsense_hero', name: 'MapSense Hero', type: 'hero-banner', enabled: true, props: { badge: 'Proprietary Technology', title: 'MapSense™ — Location Intelligence for ESG', subtitle: 'Spatial screening of physical climate risks, environmental sensitivities, and community impacts for sites across India and global markets.', bgImage: '/images/mapsense-hero.webp', ctaLabel: 'Explore MapSense', ctaUrl: '/connect' } },
      { id: 'block_mapsense_narrative', name: 'MapSense Overview', type: 'story-narrative', enabled: true, props: { tagline: 'GEOSPATIAL INTELLIGENCE', headline: 'Where Location Data Meets Sustainability Strategy', description: 'MapSense combines satellite imagery, regulatory buffers, and environmental datasets to provide instant site-level E&S risk profiles for any location.', paragraph1: 'Used by investors, developers, and corporate real estate teams to screen site acquisitions, greenfield developments, and supply chain locations for environmental and social risks before committing capital.' } },
      { id: 'block_mapsense_capabilities', name: 'Capabilities', type: 'feature-cards', enabled: true, props: { title: 'What MapSense Screens', card1_title: 'Physical Climate Risk', card1_desc: 'Flood zones, cyclone tracks, heat stress corridors, drought risk, and sea-level rise exposure for any location.', card2_title: 'Biodiversity & Ecology', card2_desc: 'Protected area buffers, forest cover, wetland proximity, and critical habitat identification using satellite data.', card3_title: 'Community & Social Factors', card3_desc: 'Tribal community zones, displacement risk areas, and proximity to sensitive social receptors.' } },
      { id: 'block_mapsense_cta', name: 'CTA', type: 'cta-banner', enabled: true, props: { headline: 'Screen Your Sites with MapSense', subtext: 'Get a site-level E&S risk profile within 24 hours.', buttonLabel: 'Request a MapSense Screen', buttonUrl: '/connect' } },
    ],
  },
];

async function seedPages() {
  console.log('\n📄 Seeding pages with full content blocks...');
  let count = 0;

  for (const pageData of ALL_PAGES) {
    await db
      .insert(pages)
      .values({
        slug: pageData.slug,
        title: pageData.title,
        seoTitle: pageData.seoTitle || pageData.title,
        seoDescription: pageData.seoDescription || null,
        layoutTemplate: pageData.layoutTemplate,
        contentBlocks: pageData.contentBlocks,
        schemaVersion: 1,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
    count++;
    console.log(`  ✅ Page: ${pageData.slug}`);
  }

  console.log(`  → ${count} pages upserted.`);
}

// ─── 6. Seed Navigation ───────────────────────────────────────────────────────

async function seedNavigation() {
  console.log('\n🧭 Seeding navigation items...');

  const primaryNavItems = [
    { label: 'Home', href: '/', orderIndex: 0, navGroup: 'primary' },
    { label: 'About', href: '/about', orderIndex: 1, navGroup: 'primary' },
    { label: 'Services', href: '/services', orderIndex: 2, navGroup: 'primary' },
    { label: 'Impact', href: '/impact', orderIndex: 3, navGroup: 'primary' },
    { label: 'Envision', href: '/envision', orderIndex: 4, navGroup: 'primary' },
    { label: 'Careers', href: '/careers-at-envint', orderIndex: 5, navGroup: 'primary' },
    { label: 'Connect', href: '/connect', orderIndex: 6, navGroup: 'primary' },
  ];

  const footerNavItems = [
    { label: 'About Envint', href: '/about', orderIndex: 0, navGroup: 'footer' },
    { label: 'Services', href: '/services', orderIndex: 1, navGroup: 'footer' },
    { label: 'Sustainability Integration', href: '/sustainability-integration', orderIndex: 2, navGroup: 'footer' },
    { label: 'Climate Action', href: '/climate-action', orderIndex: 3, navGroup: 'footer' },
    { label: 'Responsible Investment', href: '/responsible-investment', orderIndex: 4, navGroup: 'footer' },
    { label: 'Impact', href: '/impact', orderIndex: 5, navGroup: 'footer' },
    { label: 'Envision', href: '/envision', orderIndex: 6, navGroup: 'footer' },
    { label: 'Enviki', href: '/enviki', orderIndex: 7, navGroup: 'footer' },
    { label: 'MapSense', href: '/mapsense', orderIndex: 8, navGroup: 'footer' },
    { label: 'ESQ', href: '/esq', orderIndex: 9, navGroup: 'footer' },
    { label: 'Careers', href: '/careers-at-envint', orderIndex: 10, navGroup: 'footer' },
    { label: 'Connect', href: '/connect', orderIndex: 11, navGroup: 'footer' },
    { label: 'Disclaimer', href: '/disclaimer', orderIndex: 12, navGroup: 'footer' },
  ];

  const socialNavItems = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/envint/', orderIndex: 0, navGroup: 'social', openInNewTab: true },
    { label: 'Twitter', href: 'https://twitter.com/envintglobal', orderIndex: 1, navGroup: 'social', openInNewTab: true },
  ];

  const allItems = [...primaryNavItems, ...footerNavItems, ...socialNavItems];
  let count = 0;

  for (const item of allItems) {
    const existing = await db
      .select({ id: navigationItems.id })
      .from(navigationItems)
      .where(sql`${navigationItems.href} = ${item.href} AND ${navigationItems.navGroup} = ${item.navGroup}`)
      .limit(1);

    if (existing.length === 0) {
      await db.insert(navigationItems).values({
        label: item.label,
        href: item.href,
        orderIndex: item.orderIndex,
        navGroup: item.navGroup,
        isActive: true,
        openInNewTab: item.openInNewTab || false,
      });
      count++;
    }
  }

  console.log(`  → ${count} navigation items inserted (${allItems.length - count} already exist).`);
}

// ─── 7. Seed Site Settings ────────────────────────────────────────────────────

async function seedSiteSettings() {
  console.log('\n⚙️  Seeding site settings...');

  const defaults = [
    { key: 'site_name', value: 'Envint', description: 'Public site name' },
    { key: 'site_tagline', value: 'Sustainability & ESG Advisory', description: 'Site tagline for SEO' },
    { key: 'site_email', value: 'connect@envintglobal.com', description: 'Primary contact email' },
    { key: 'site_phone', value: '', description: 'Primary contact phone' },
    { key: 'site_address', value: 'Mumbai, India', description: 'Primary office address' },
    { key: 'default_og_image', value: '/images/og-default.webp', description: 'Default OpenGraph image' },
    { key: 'linkedin_url', value: 'https://www.linkedin.com/company/envint/', description: 'LinkedIn profile URL' },
    { key: 'twitter_url', value: 'https://twitter.com/envintglobal', description: 'Twitter/X profile URL' },
    { key: 'google_analytics_id', value: '', description: 'Google Analytics measurement ID' },
  ];

  for (const setting of defaults) {
    await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoNothing();
  }

  console.log(`  → ${defaults.length} settings seeded.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Envint CMS — Full Content Seed Script');
  console.log('==========================================');
  console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '✅ set' : '❌ NOT SET — aborting'}`);

  if (!process.env.DATABASE_URL) {
    process.exit(1);
  }

  // Collect all unique categories & tags from both datasets
  const insightsData: any[] = readJson('../apps/web/src/data/insights.json');
  const impactsData: any[] = readJson('../apps/web/src/data/impacts.json');

  const allCategoryNames = new Set<string>();
  const allTagNames = new Set<string>();

  for (const i of insightsData) {
    (i.categories || []).forEach((c: string) => allCategoryNames.add(c));
    (i.tags || []).forEach((t: string) => allTagNames.add(t));
  }
  for (const imp of impactsData) {
    (imp.categories || []).forEach((c: string) => allCategoryNames.add(c));
  }

  const { categoryMap, tagMap } = await seedTaxonomies(
    Array.from(allCategoryNames),
    Array.from(allTagNames),
  );

  await seedTeam();
  await seedInsights(categoryMap, tagMap);
  await seedImpacts();
  await seedPages();
  await seedNavigation();
  await seedSiteSettings();

  console.log('\n==========================================');
  console.log('✅ Seed complete! All content is now in the database.');
  console.log('   Run `pnpm --filter @envint/db db:push` first if schema has changed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
