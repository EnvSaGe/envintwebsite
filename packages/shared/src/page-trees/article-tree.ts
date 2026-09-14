import { BuilderNode, PageBlockTree } from '../builder-schema';
import {
  makeSection,
  makeContainer,
  makeHeading,
  makeParagraph,
  makeImage,
  makeBadge,
  makeButton,
  makeSocialShare,
  assembleTree,
  resolveCmsImage,
} from './utils';

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  contentHtml?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
  readingTimeMinutes?: number | null;
  publishedAt?: Date | string | null;
}

export interface CaseStudyInput {
  slug: string;
  title: string;
  summary?: string | null;
  challenge?: string | null;
  solution?: string | null;
  outcome?: string | null;
  contentHtml?: string | null;
  coverImageUrl?: string | null;
  sectorName?: string | null;
  themeName?: string | null;
  serviceName?: string | null;
}

/** Strip common WordPress shortcode wrappers ([caption]…[/caption] etc.), keeping inner content. */
function stripWpShortcodes(html: string): string {
  return html.replace(/\[\/?(?:caption|gallery|embed|video|audio)[^\]]*\]/gi, '');
}

/**
 * WordPress paste artifact: an outer list wraps a single
 * `<li style="list-style-type: none">` that contains the real list.
 * Flatten it so markers/numbering render correctly everywhere.
 */
function flattenWpListWrappers(html: string): string {
  return html.replace(
    /<(ol|ul)(?:\s[^>]*)?>\s*<li[^>]*list-style-type:\s*none[^>]*>\s*(<(ol|ul)(?:\s[^>]*)?>[\s\S]*?<\/\3>)\s*<\/li>\s*<\/\1>/gi,
    '$2'
  );
}

/** True if a fragment between matched blocks contains user-visible text. */
function hasVisibleText(fragment: string): boolean {
  return (
    fragment
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim().length > 0
  );
}

/**
 * Parses raw HTML into individual paragraphs, headings, and images
 * for the visual studio canvas. Stray text between block tags (a common
 * WordPress migration leftover) is preserved as its own paragraph so the
 * editor and the public tree render the same content as the source page.
 */
function parseHtmlToBlocks(
  html: string,
  parentId: string,
  prefix: string
): { blockIds: string[]; nodes: Record<string, BuilderNode> } {
  const blockIds: string[] = [];
  const nodes: Record<string, BuilderNode> = {};

  if (!html || !html.trim()) {
    const pId = `p_${prefix}_empty`;
    blockIds.push(pId);
    nodes[pId] = makeParagraph(
      pId,
      parentId,
      '<p>Write or edit article content here...</p>',
      { fontSize: '18px', lineHeight: '1.7', textColor: '#333333' },
      'Article Body Paragraph'
    );
    return { blockIds, nodes };
  }

  // Normalize migrated WordPress content before parsing
  const normalized = flattenWpListWrappers(stripWpShortcodes(html));

  // Regex match blocks: <h2>, <h3>, <h4>, <p>, <blockquote>, <ul>, <ol>, <img ...>
  const blockRegex = /<(h[2-4]|p|blockquote|ul|ol|img)(?:\s+[^>]*)?>[\s\S]*?<\/\1>|<img\s+[^>]*\/?>/gi;
  const tokens: Array<{ kind: 'block' | 'text'; html: string }> = [];
  let cursor = 0;
  for (const match of normalized.matchAll(blockRegex)) {
    const between = normalized.slice(cursor, match.index);
    if (hasVisibleText(between)) tokens.push({ kind: 'text', html: between.trim() });
    tokens.push({ kind: 'block', html: match[0] });
    cursor = (match.index ?? 0) + match[0].length;
  }
  const tail = normalized.slice(cursor);
  if (hasVisibleText(tail)) tokens.push({ kind: 'text', html: tail.trim() });

  const matches = tokens.map((t) => t.html);

  if (!matches || matches.length === 0) {
    // Fallback: split by newlines
    const paras = html.split(/\n{2,}/).filter((s) => s.trim().length > 0);
    paras.forEach((p, idx) => {
      const pId = `p_${prefix}_${idx + 1}`;
      blockIds.push(pId);
      nodes[pId] = makeParagraph(
        pId,
        parentId,
        p.startsWith('<p>') ? p : `<p>${p}</p>`,
        { fontSize: '18px', lineHeight: '1.7', textColor: '#333333', marginBottom: '20px' },
        `Paragraph ${idx + 1}`
      );
    });
    return { blockIds, nodes };
  }

  matches.forEach((rawBlock, idx) => {
    const trimmed = rawBlock.trim();
    if (!trimmed) return;

    if (/^<h2/i.test(trimmed)) {
      const text = trimmed.replace(/<[^>]+>/g, '').trim();
      const id = `h2_${prefix}_${idx + 1}`;
      blockIds.push(id);
      nodes[id] = makeHeading(
        id,
        parentId,
        text,
        'h2',
        {
          fontSize: '32px',
          fontWeight: 500,
          textColor: '#004E35',
          marginTop: '36px',
          marginBottom: '16px',
          fontFamily: 'Neue Montreal, sans-serif',
          lineHeight: '1.25',
        },
        `Heading ${idx + 1}`
      );
    } else if (/^<h[3-4]/i.test(trimmed)) {
      const text = trimmed.replace(/<[^>]+>/g, '').trim();
      const id = `h3_${prefix}_${idx + 1}`;
      blockIds.push(id);
      nodes[id] = makeHeading(
        id,
        parentId,
        text,
        'h3',
        {
          fontSize: '24px',
          fontWeight: 500,
          textColor: '#1A362B',
          marginTop: '28px',
          marginBottom: '12px',
          fontFamily: 'Neue Montreal, sans-serif',
          lineHeight: '1.3',
        },
        `Subheading ${idx + 1}`
      );
    } else if (/^<img/i.test(trimmed)) {
      const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
      const altMatch = trimmed.match(/alt=["']([^"']+)["']/i);
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      const id = `img_${prefix}_${idx + 1}`;
      blockIds.push(id);
      nodes[id] = makeImage(
        id,
        parentId,
        resolveCmsImage(src),
        alt,
        {
          width: '100%',
          borderRadius: '12px',
          marginTop: '28px',
          marginBottom: '28px',
          objectFit: 'contain',
        },
        `Article Image ${idx + 1}`
      );
    } else {
      // Paragraph, blockquote, list, or stray migrated text between blocks
      const id = `p_${prefix}_${idx + 1}`;
      blockIds.push(id);
      // Wrap bare text fragments in a <p> so spacing matches the source page.
      const body = trimmed.startsWith('<') ? trimmed : `<p>${trimmed}</p>`;
      nodes[id] = makeParagraph(
        id,
        parentId,
        body,
        {
          fontSize: '18px',
          lineHeight: '1.75',
          textColor: '#333333',
          marginBottom: '20px',
          fontFamily: 'Neue Montreal, sans-serif',
        },
        `Content Block ${idx + 1}`
      );
    }
  });

  return { blockIds, nodes };
}

/**
 * Converts an Article / Insight into a cutting-edge visual Schema v2 tree
 * matching the live public site:
 * 1. Full-width Hero Cover Banner (380px)
 * 2. Overlapping Article Header Card (-60px margin, 860px width, drop shadow, badge, title, meta, social share)
 * 3. Article Content Body (headings, rich paragraphs, lists, quotes, inline images)
 * 4. Advisory CTA Section
 */
export function convertArticleToPageTree(article: ArticleInput): PageBlockTree {
  const cleanSlug = article.slug.replace(/^\//, '');
  const prefix = cleanSlug.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const rootIds: string[] = [];
  const nodes: Record<string, BuilderNode> = {};

  const coverUrl = article.coverImageUrl || '/images/hero-wetland.webp';

  // 1. Hero Cover Image Banner (380px full width at the very top, exactly like public site)
  const secHeroId = `sec_${prefix}_hero`;
  const contHeroId = `cont_${prefix}_hero`;
  const imgHeroId = `img_${prefix}_hero`;

  rootIds.push(secHeroId);

  nodes[secHeroId] = makeSection(
    secHeroId,
    [contHeroId],
    {
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      minHeight: '380px',
      overflow: 'hidden',
      backgroundColor: '#F1F5F9',
      backgroundOverlay: 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 60%)',
    },
    { mobile: { minHeight: '240px' } },
    'Cover Banner Section'
  );

  nodes[contHeroId] = makeContainer(
    contHeroId,
    secHeroId,
    [imgHeroId],
    {
      maxWidth: '100%',
      width: '100%',
      paddingLeft: '0',
      paddingRight: '0',
    },
    'Cover Banner Wrapper'
  );

  nodes[imgHeroId] = makeImage(
    imgHeroId,
    contHeroId,
    resolveCmsImage(coverUrl),
    article.title || 'Article Cover Banner',
    {
      width: '80%',
      aspectRatio: '16/9',
      objectFit: 'cover',
      borderRadius: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
    },
    { tablet: { width: '90%' }, mobile: { width: '100%', height: '240px', borderRadius: '14px' } },
    'Cover Banner Image'
  );

  // 2. Floating Article Header Card (overlapping the banner with marginTop: -80px)
  const secHeaderId = `sec_${prefix}_header`;
  const contCardWrapperId = `cont_${prefix}_card_wrapper`;
  const contCardId = `cont_${prefix}_card`;
  const titleId = `h1_${prefix}_title`;
  const metaId = `p_${prefix}_meta`;
  const socialId = `social_${prefix}_share`;

  rootIds.push(secHeaderId);

  nodes[secHeaderId] = makeSection(
    secHeaderId,
    [contCardWrapperId],
    {
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: 'transparent',
    },
    {},
    'Article Header Section'
  );

  nodes[contCardWrapperId] = makeContainer(
    contCardWrapperId,
    secHeaderId,
    [contCardId],
    {
      maxWidth: '960px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    'Article Header Wrapper'
  );

  // Exact 1:1 public site structure: Title -> Date -> Social Share Bar
  const cardChildren = [titleId, metaId, socialId];

  nodes[contCardId] = makeContainer(
    contCardId,
    contCardWrapperId,
    cardChildren,
    {
      marginTop: '-80px',
      position: 'relative',
      zIndex: 9,
      backgroundColor: '#FFFFFF',
      borderRadius: '4px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      paddingTop: '56px',
      paddingBottom: '24px',
      paddingLeft: '64px',
      paddingRight: '64px',
      marginBottom: '40px',
    },
    { mobile: { paddingLeft: '20px', paddingRight: '20px', marginTop: '-40px' } },
    'Article Header Card'
  );

  nodes[titleId] = makeHeading(
    titleId,
    contCardId,
    article.title || 'Untitled Article',
    'h1',
    {
      fontSize: '32px',
      fontWeight: 400,
      textColor: '#1e293b',
      lineHeight: '1.2',
      fontFamily: 'Neue Montreal, sans-serif',
      marginBottom: '16px',
    },
    'Article H1 Title'
  );

  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently Published';

  nodes[metaId] = makeParagraph(
    metaId,
    contCardId,
    `<p style="margin:0;">${dateStr}</p>`,
    {
      fontSize: '15px',
      textColor: '#64748b',
      marginBottom: '20px',
      fontFamily: 'Neue Montreal, sans-serif',
    },
    'Article Meta Date'
  );

  nodes[socialId] = makeSocialShare(
    socialId,
    contCardId,
    [
      {
        id: 'email',
        name: 'Email',
        enabled: true,
        color: '#ea4335',
        url: `mailto:?subject=${encodeURIComponent(article.title || '')}&body=https://envintglobal.com/${cleanSlug}/`,
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        enabled: true,
        color: '#0a66c2',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=https://envintglobal.com/${cleanSlug}/`,
      },
      {
        id: 'twitter',
        name: 'X / Twitter',
        enabled: true,
        color: '#000000',
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title || '')}&url=https://envintglobal.com/${cleanSlug}/`,
      },
      {
        id: 'facebook',
        name: 'Facebook',
        enabled: true,
        color: '#1877f2',
        url: `https://www.facebook.com/sharer/sharer.php?u=https://envintglobal.com/${cleanSlug}/`,
      },
    ],
    {
      buttonSize: 32,
      borderRadius: 4,
      gap: 10,
      alignment: 'left',
    },
    { margin: '0' },
    'Social Share Bar'
  );

  // 3. Body Section
  const secBodyId = `sec_${prefix}_body`;
  const contBodyId = `cont_${prefix}_body`;

  rootIds.push(secBodyId);

  const { blockIds, nodes: parsedNodes } = parseHtmlToBlocks(
    article.contentHtml || (article.excerpt ? `<p>${article.excerpt}</p>` : ''),
    contBodyId,
    prefix
  );

  Object.assign(nodes, parsedNodes);

  nodes[secBodyId] = makeSection(
    secBodyId,
    [contBodyId],
    {
      paddingTop: '0',
      paddingBottom: '80px',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: '#FFFFFF',
    },
    {},
    'Article Body Section'
  );

  nodes[contBodyId] = makeContainer(
    contBodyId,
    secBodyId,
    blockIds,
    {
      maxWidth: '860px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    'Article Body Container'
  );

  // 4. Footer CTA Section
  const secCtaId = `sec_${prefix}_cta`;
  const contCtaId = `cont_${prefix}_cta`;
  const cardCtaId = `card_${prefix}_cta`;
  const h3CtaId = `h3_${prefix}_cta`;
  const pCtaId = `p_${prefix}_cta`;
  const btnCtaId = `btn_${prefix}_cta`;

  rootIds.push(secCtaId);

  nodes[secCtaId] = makeSection(
    secCtaId,
    [contCtaId],
    {
      paddingTop: '40px',
      paddingBottom: '90px',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: '#F7FBF9',
    },
    {},
    'CTA Section'
  );

  nodes[contCtaId] = makeContainer(
    contCtaId,
    secCtaId,
    [cardCtaId],
    {
      maxWidth: '860px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    'CTA Container'
  );

  nodes[cardCtaId] = makeContainer(
    cardCtaId,
    contCtaId,
    [h3CtaId, pCtaId, btnCtaId],
    {
      backgroundColor: '#004E35',
      borderRadius: '20px',
      paddingTop: '48px',
      paddingBottom: '48px',
      paddingLeft: '48px',
      paddingRight: '48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '16px',
    },
    { mobile: { paddingLeft: '24px', paddingRight: '24px' } },
    'CTA Card'
  );

  nodes[h3CtaId] = makeHeading(
    h3CtaId,
    cardCtaId,
    "Explore Envint's Advisory Capabilities",
    'h3',
    {
      fontSize: '32px',
      textColor: '#FFFFFF',
      fontWeight: 500,
      fontFamily: 'Neue Montreal, sans-serif',
      marginBottom: '4px',
    },
    'CTA Title'
  );

  nodes[pCtaId] = makeParagraph(
    pCtaId,
    cardCtaId,
    '<p>Connect with our advisory teams to discuss bespoke solutions tailored to your sustainability journey.</p>',
    {
      fontSize: '18px',
      textColor: '#E2E8F0',
      fontFamily: 'Neue Montreal, sans-serif',
      marginBottom: '10px',
    },
    'CTA Description'
  );

  nodes[btnCtaId] = makeButton(
    btnCtaId,
    cardCtaId,
    'Connect With Us',
    '/connect/',
    'primary',
    {
      backgroundColor: '#FFFFFF',
      textColor: '#004E35',
      fontSize: '16px',
      fontWeight: 600,
      paddingTop: '12px',
      paddingBottom: '12px',
      paddingLeft: '32px',
      paddingRight: '32px',
      borderRadius: '9999px',
      width: 'fit-content',
    },
    'CTA Button'
  );

  return assembleTree(rootIds, nodes);
}

/**
 * Converts a Client Impact Case Study into a Schema v2 element tree
 * matching the live public site:
 * 1. Centered Header (Title & Sector / Date)
 * 2. Centered Featured Image (maxWidth 880px, 460px height, rounded corners, drop shadow)
 * 3. Case Study Details & Narrative Body (Challenge, Solution, Impact)
 * 4. Advisory CTA Section
 */
export function convertCaseStudyToPageTree(caseStudy: CaseStudyInput): PageBlockTree {
  const cleanSlug = caseStudy.slug.replace(/^\//, '');
  const prefix = cleanSlug.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const rootIds: string[] = [];
  const nodes: Record<string, BuilderNode> = {};

  const coverUrl = caseStudy.coverImageUrl || '/images/services-sustainability.webp';

  // 1. Header Section (Centered Title & Date)
  const secHeaderId = `sec_${prefix}_header`;
  const contHeaderId = `cont_${prefix}_header`;
  const badgeId = `badge_${prefix}_cat`;
  const titleId = `h1_${prefix}_title`;
  const metaId = `p_${prefix}_meta`;

  rootIds.push(secHeaderId);

  nodes[secHeaderId] = makeSection(
    secHeaderId,
    [contHeaderId],
    {
      paddingTop: '130px',
      paddingBottom: '30px',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: '#FFFFFF',
    },
    {},
    'Case Study Header Section'
  );

  nodes[contHeaderId] = makeContainer(
    contHeaderId,
    secHeaderId,
    [badgeId, titleId, metaId],
    {
      maxWidth: '880px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      textAlign: 'center',
    },
    'Case Study Header Container'
  );

  const badgeText = caseStudy.serviceName || caseStudy.sectorName || 'CLIENT IMPACT CASE STUDY';
  nodes[badgeId] = makeBadge(
    badgeId,
    contHeaderId,
    badgeText.toUpperCase(),
    {
      backgroundColor: 'rgba(0, 78, 53, 0.08)',
      textColor: '#004E35',
      marginBottom: '16px',
    },
    'Case Study Badge'
  );

  nodes[titleId] = makeHeading(
    titleId,
    contHeaderId,
    caseStudy.title,
    'h1',
    {
      fontSize: '44px',
      fontWeight: 400,
      textColor: '#121127',
      lineHeight: '1.2',
      fontFamily: 'Neue Montreal, sans-serif',
      marginBottom: '16px',
      textAlign: 'center',
    },
    'Case Study H1 Title'
  );

  nodes[metaId] = makeParagraph(
    metaId,
    contHeaderId,
    `<p style="margin:0; color:#64748b; font-size:16px;">${caseStudy.sectorName ? `${caseStudy.sectorName} &nbsp;•&nbsp; ` : ''}Case Study</p>`,
    {
      fontSize: '16px',
      textColor: '#64748b',
      textAlign: 'center',
    },
    'Case Study Meta'
  );

  // 2. Centered Featured Image Section
  const secCoverId = `sec_${prefix}_cover`;
  const contCoverId = `cont_${prefix}_cover`;
  const imgCoverId = `img_${prefix}_cover`;

  rootIds.push(secCoverId);

  nodes[secCoverId] = makeSection(
    secCoverId,
    [contCoverId],
    {
      paddingTop: '10px',
      paddingBottom: '40px',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: '#FFFFFF',
    },
    {},
    'Cover Section'
  );

  nodes[contCoverId] = makeContainer(
    contCoverId,
    secCoverId,
    [imgCoverId],
    {
      maxWidth: '880px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    'Cover Container'
  );

  nodes[imgCoverId] = makeImage(
    imgCoverId,
    contCoverId,
    resolveCmsImage(coverUrl),
    caseStudy.title,
    {
      width: '100%',
      height: '460px',
      objectFit: 'cover',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    },
    { mobile: { height: '240px' } },
    'Featured Image'
  );

  // 3. Case Study Details / Body Section
  const secDetailsId = `sec_${prefix}_details`;
  const contDetailsId = `cont_${prefix}_details`;

  rootIds.push(secDetailsId);

  let detailBlockIds: string[] = [];

  if (caseStudy.contentHtml) {
    const { blockIds, nodes: parsedNodes } = parseHtmlToBlocks(
      caseStudy.contentHtml,
      contDetailsId,
      prefix
    );
    detailBlockIds = blockIds;
    Object.assign(nodes, parsedNodes);
  } else {
    if (caseStudy.summary) {
      const sId = `p_${prefix}_summary`;
      detailBlockIds.push(sId);
      nodes[sId] = makeParagraph(
        sId,
        contDetailsId,
        `<p style="font-size:20px; line-height:1.6; color:#393939; margin-bottom:32px;">${caseStudy.summary}</p>`,
        { fontSize: '20px', lineHeight: '1.6', textColor: '#393939', marginBottom: '32px' },
        'Summary'
      );
    }
    if (caseStudy.challenge) {
      const chHId = `h2_${prefix}_ch`;
      const chPId = `p_${prefix}_ch`;
      detailBlockIds.push(chHId, chPId);
      nodes[chHId] = makeHeading(chHId, contDetailsId, 'Problem', 'h2', {
        fontSize: '32px',
        fontWeight: 400,
        textColor: '#121127',
        marginTop: '36px',
        marginBottom: '16px',
        fontFamily: 'Neue Montreal, sans-serif',
      }, 'Problem Heading');
      nodes[chPId] = makeParagraph(chPId, contDetailsId, `<p>${caseStudy.challenge}</p>`, {
        fontSize: '18px',
        lineHeight: '1.7',
        textColor: '#393939',
        marginBottom: '24px',
        fontFamily: 'Neue Montreal, sans-serif',
      }, 'Problem Text');
    }
    if (caseStudy.solution) {
      const solHId = `h2_${prefix}_sol`;
      const solPId = `p_${prefix}_sol`;
      detailBlockIds.push(solHId, solPId);
      nodes[solHId] = makeHeading(solHId, contDetailsId, 'Solution', 'h2', {
        fontSize: '32px',
        fontWeight: 400,
        textColor: '#121127',
        marginTop: '36px',
        marginBottom: '16px',
        fontFamily: 'Neue Montreal, sans-serif',
      }, 'Solution Heading');
      nodes[solPId] = makeParagraph(solPId, contDetailsId, `<p>${caseStudy.solution}</p>`, {
        fontSize: '18px',
        lineHeight: '1.7',
        textColor: '#393939',
        marginBottom: '24px',
        fontFamily: 'Neue Montreal, sans-serif',
      }, 'Solution Text');
    }
    if (caseStudy.outcome) {
      const impHId = `h2_${prefix}_imp`;
      const impPId = `p_${prefix}_imp`;
      detailBlockIds.push(impHId, impPId);
      nodes[impHId] = makeHeading(impHId, contDetailsId, 'Impact Created', 'h2', {
        fontSize: '32px',
        fontWeight: 400,
        textColor: '#121127',
        marginTop: '36px',
        marginBottom: '16px',
        fontFamily: 'Neue Montreal, sans-serif',
      }, 'Impact Heading');
      nodes[impPId] = makeParagraph(impPId, contDetailsId, `<p>${caseStudy.outcome}</p>`, {
        fontSize: '18px',
        lineHeight: '1.7',
        textColor: '#393939',
        marginBottom: '24px',
        fontFamily: 'Neue Montreal, sans-serif',
      }, 'Impact Text');
    }
  }

  nodes[secDetailsId] = makeSection(
    secDetailsId,
    [contDetailsId],
    {
      paddingTop: '10px',
      paddingBottom: '80px',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: '#FFFFFF',
    },
    {},
    'Case Study Details Section'
  );

  nodes[contDetailsId] = makeContainer(
    contDetailsId,
    secDetailsId,
    detailBlockIds,
    {
      maxWidth: '880px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    'Case Study Details Container'
  );

  // 4. CTA Section
  const secCtaId = `sec_${prefix}_cta`;
  const contCtaId = `cont_${prefix}_cta`;
  const cardCtaId = `card_${prefix}_cta`;
  const h3CtaId = `h3_${prefix}_cta`;
  const pCtaId = `p_${prefix}_cta`;
  const btnCtaId = `btn_${prefix}_cta`;

  rootIds.push(secCtaId);

  nodes[secCtaId] = makeSection(
    secCtaId,
    [contCtaId],
    {
      paddingTop: '40px',
      paddingBottom: '90px',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: '#F7FBF9',
    },
    {},
    'CTA Section'
  );

  nodes[contCtaId] = makeContainer(
    contCtaId,
    secCtaId,
    [cardCtaId],
    {
      maxWidth: '880px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    },
    'CTA Container'
  );

  nodes[cardCtaId] = makeContainer(
    cardCtaId,
    contCtaId,
    [h3CtaId, pCtaId, btnCtaId],
    {
      backgroundColor: '#004E35',
      borderRadius: '20px',
      paddingTop: '48px',
      paddingBottom: '48px',
      paddingLeft: '48px',
      paddingRight: '48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '16px',
    },
    { mobile: { paddingLeft: '24px', paddingRight: '24px' } },
    'CTA Card'
  );

  nodes[h3CtaId] = makeHeading(
    h3CtaId,
    cardCtaId,
    'Looking for similar impact in your organization?',
    'h3',
    {
      fontSize: '32px',
      textColor: '#FFFFFF',
      fontWeight: 500,
      fontFamily: 'Neue Montreal, sans-serif',
      marginBottom: '4px',
    },
    'CTA Title'
  );

  nodes[pCtaId] = makeParagraph(
    pCtaId,
    cardCtaId,
    '<p>Connect with our advisory teams to discuss bespoke solutions tailored to your ESG journey.</p>',
    {
      fontSize: '18px',
      textColor: '#E2E8F0',
      fontFamily: 'Neue Montreal, sans-serif',
      marginBottom: '10px',
    },
    'CTA Description'
  );

  nodes[btnCtaId] = makeButton(
    btnCtaId,
    cardCtaId,
    'Connect With Us',
    '/connect/',
    'primary',
    {
      backgroundColor: '#FFFFFF',
      textColor: '#004E35',
      fontSize: '16px',
      fontWeight: 600,
      paddingTop: '12px',
      paddingBottom: '12px',
      paddingLeft: '32px',
      paddingRight: '32px',
      borderRadius: '9999px',
      width: 'fit-content',
    },
    'CTA Button'
  );

  return assembleTree(rootIds, nodes);
}
