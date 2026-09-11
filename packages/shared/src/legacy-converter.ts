import {
  BuilderNode,
  PageBlockTree,
  generateNodeId,
} from './builder-schema';

/**
 * Clean HTML or plain string
 */
function cleanText(str?: string | null): string {
  if (!str) return '';
  return String(str).trim();
}

/**
 * Converts a legacy CMS content block (Schema v1) into Schema v2 element nodes.
 */
export function convertLegacyBlockToNodes(
  block: any,
  index: number
): { rootSectionId: string; nodes: Record<string, BuilderNode> } {
  const nodes: Record<string, BuilderNode> = {};
  const props = block.props || block.content || {};
  const blockType = block.type || 'story-narrative';
  const blockIdPrefix = block.id ? `sec_${block.id}` : `sec_${index}_${blockType}`;
  const sectionId = generateNodeId('section');
  const containerId = generateNodeId('container');

  // Base Section styles
  let sectionStyles: Record<string, any> = {
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  };

  const containerStyles: Record<string, any> = {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  };

  const containerChildren: string[] = [];

  switch (blockType) {
    case 'hero-banner':
    case 'about-hero':
    case 'career-hero': {
      const bgImage = props.bgImage || props.heroImage || block.bgImage || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp';
      sectionStyles = {
        paddingTop: '160px',
        paddingBottom: '90px',
        paddingLeft: '24px',
        paddingRight: '24px',
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'flex-end',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overlayGradient: 'linear-gradient(to top, rgba(0, 46, 32, 0.88) 0%, rgba(0, 46, 32, 0.35) 100%)',
      };

      containerStyles.display = 'flex';
      containerStyles.flexDirection = 'column';
      containerStyles.gap = '16px';

      // 1. Badge (if exists)
      if (props.badge || props.tagline) {
        const badgeId = generateNodeId('badge');
        nodes[badgeId] = {
          id: badgeId,
          type: 'badge',
          name: 'Hero Tagline',
          parentId: containerId,
          children: [],
          content: { text: cleanText(props.badge || props.tagline).toUpperCase() },
          styles: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            textColor: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '9999px',
            paddingTop: '4px',
            paddingBottom: '4px',
            paddingLeft: '14px',
            paddingRight: '14px',
            alignSelf: 'flex-start',
            letterSpacing: '0.05em',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(badgeId);
      }

      // 2. Headline
      const headlineText = cleanText(props.title || props.headline || block.name || 'Envint Global');
      const h1Id = generateNodeId('heading');
      nodes[h1Id] = {
        id: h1Id,
        type: 'heading',
        name: 'Hero Title',
        parentId: containerId,
        children: [],
        content: { text: headlineText, tag: 'h1' },
        styles: {
          fontSize: '64px',
          fontWeight: 400,
          textColor: '#FFFFFF',
          lineHeight: '1.1',
          margin: '0',
          fontFamily: 'Neue Montreal, sans-serif',
          maxWidth: '900px',
        },
        responsiveStyles: {
          tablet: { fontSize: '48px' },
          mobile: { fontSize: '36px' },
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      containerChildren.push(h1Id);

      // 3. Subtitle (if exists)
      if (props.subtitle) {
        const subId = generateNodeId('paragraph');
        nodes[subId] = {
          id: subId,
          type: 'paragraph',
          name: 'Hero Subtitle',
          parentId: containerId,
          children: [],
          content: { html: `<p>${cleanText(props.subtitle)}</p>` },
          styles: {
            fontSize: '20px',
            lineHeight: '1.6',
            textColor: '#E2E8F0',
            maxWidth: '750px',
            margin: '0',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(subId);
      }

      // 4. CTA Button (if exists)
      if (props.ctaLabel || props.buttonLabel || props.ctaText) {
        const btnId = generateNodeId('button');
        nodes[btnId] = {
          id: btnId,
          type: 'button',
          name: 'Hero Action Button',
          parentId: containerId,
          children: [],
          content: {
            text: cleanText(props.ctaLabel || props.buttonLabel || props.ctaText),
            url: props.ctaUrl || props.buttonUrl || props.ctaLink || '/connect',
            variant: 'primary',
          },
          styles: {
            backgroundColor: '#10B981',
            textColor: '#002E20',
            fontSize: '15px',
            fontWeight: 600,
            paddingTop: '14px',
            paddingBottom: '14px',
            paddingLeft: '28px',
            paddingRight: '28px',
            borderRadius: '10px',
            alignSelf: 'flex-start',
            marginTop: '8px',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(btnId);
      }
      break;
    }

    case 'story-narrative': {
      sectionStyles.backgroundColor = '#FFFFFF';
      sectionStyles.paddingTop = '80px';
      sectionStyles.paddingBottom = '80px';

      // 2-Column Split Grid
      const gridId = generateNodeId('grid');
      const leftColId = generateNodeId('container');
      const rightColId = generateNodeId('container');

      containerChildren.push(gridId);

      nodes[gridId] = {
        id: gridId,
        type: 'grid',
        name: '2-Col Split Narrative',
        parentId: containerId,
        children: [leftColId, rightColId],
        content: {},
        styles: {
          display: 'grid',
          gridColumns: 'minmax(0, 460px) minmax(0, 1fr)',
          gap: '64px',
          alignItems: 'flex-start',
        },
        responsiveStyles: {
          tablet: { gridColumns: '1fr', gap: '32px' },
          mobile: { gridColumns: '1fr', gap: '24px' },
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      };

      // Left Column: Tagline & Headline
      const leftChildren: string[] = [];
      if (props.tagline) {
        const tagId = generateNodeId('badge');
        nodes[tagId] = {
          id: tagId,
          type: 'badge',
          name: 'Section Tagline',
          parentId: leftColId,
          children: [],
          content: { text: cleanText(props.tagline).toUpperCase() },
          styles: {
            textColor: '#10B981',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            margin: '0 0 12px 0',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        leftChildren.push(tagId);
      }

      const h2Text = cleanText(props.headline || props.title || 'Strategic Advisory');
      const h2Id = generateNodeId('heading');
      nodes[h2Id] = {
        id: h2Id,
        type: 'heading',
        name: 'Narrative Title',
        parentId: leftColId,
        children: [],
        content: { text: h2Text, tag: 'h2' },
        styles: {
          fontSize: '44px',
          fontWeight: 400,
          textColor: '#004E35',
          lineHeight: '1.2',
          margin: '0',
          fontFamily: 'Neue Montreal, sans-serif',
        },
        responsiveStyles: {
          mobile: { fontSize: '32px' },
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      leftChildren.push(h2Id);

      nodes[leftColId] = {
        id: leftColId,
        type: 'container',
        name: 'Left Column',
        parentId: gridId,
        children: leftChildren,
        content: {},
        styles: {},
        visibility: { desktop: true, tablet: true, mobile: true },
      };

      // Right Column: Paragraphs
      const rightChildren: string[] = [];
      const paragraphs = [
        props.paragraph1,
        props.paragraph2,
        props.description,
        props.content,
      ].filter(Boolean);

      if (paragraphs.length === 0) {
        paragraphs.push('We partner with enterprise leadership and institutional investors to address emerging sustainability challenges.');
      }

      for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
        const pId = generateNodeId('paragraph');
        const rawP = paragraphs[pIdx];
        const html = rawP.startsWith('<') ? rawP : `<p>${rawP}</p>`;
        nodes[pId] = {
          id: pId,
          type: 'paragraph',
          name: `Paragraph ${pIdx + 1}`,
          parentId: rightColId,
          children: [],
          content: { html },
          styles: {
            fontSize: '20px',
            lineHeight: '1.65',
            textColor: '#374151',
            margin: '0 0 24px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        rightChildren.push(pId);
      }

      nodes[rightColId] = {
        id: rightColId,
        type: 'container',
        name: 'Right Column',
        parentId: gridId,
        children: rightChildren,
        content: {},
        styles: {},
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      break;
    }

    case 'feature-cards': {
      sectionStyles.backgroundColor = '#F8FAFC';
      sectionStyles.paddingTop = '90px';
      sectionStyles.paddingBottom = '90px';

      // Header section: Title + Subtitle
      if (props.title || props.headline) {
        const h2Id = generateNodeId('heading');
        nodes[h2Id] = {
          id: h2Id,
          type: 'heading',
          name: 'Cards Section Title',
          parentId: containerId,
          children: [],
          content: { text: cleanText(props.title || props.headline), tag: 'h2' },
          styles: {
            fontSize: '44px',
            fontWeight: 400,
            textColor: '#004E35',
            textAlign: 'center',
            margin: '0 0 16px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          responsiveStyles: { mobile: { fontSize: '32px' } },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(h2Id);
      }

      if (props.subtitle || props.description) {
        const subId = generateNodeId('paragraph');
        nodes[subId] = {
          id: subId,
          type: 'paragraph',
          name: 'Cards Section Subtitle',
          parentId: containerId,
          children: [],
          content: { html: `<p>${cleanText(props.subtitle || props.description)}</p>` },
          styles: {
            fontSize: '18px',
            lineHeight: '1.6',
            textColor: '#64748B',
            textAlign: 'center',
            maxWidth: '780px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '48px',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(subId);
      }

      // Collect cards
      const cardList: Array<{ title: string; desc: string; link?: string }> = [];
      if (Array.isArray(props.cards)) {
        props.cards.forEach((c: any) => {
          cardList.push({
            title: c.title || c.headline || 'Solution Area',
            desc: c.desc || c.description || '',
            link: c.link || c.url || '',
          });
        });
      } else {
        for (let i = 1; i <= 6; i++) {
          const cTitle = props[`card${i}_title`];
          const cDesc = props[`card${i}_desc`] || props[`card${i}_description`];
          const cLink = props[`card${i}_link`] || props[`card${i}_url`];
          if (cTitle) {
            cardList.push({ title: cTitle, desc: cDesc || '', link: cLink });
          }
        }
      }

      const gridId = generateNodeId('grid');
      const cardNodeIds: string[] = [];

      for (let cIdx = 0; cIdx < cardList.length; cIdx++) {
        const card = cardList[cIdx];
        const cardBoxId = generateNodeId('container');
        const cardTitleId = generateNodeId('heading');
        const cardDescId = generateNodeId('paragraph');
        const cardChildren = [cardTitleId, cardDescId];

        nodes[cardTitleId] = {
          id: cardTitleId,
          type: 'heading',
          name: `Card ${cIdx + 1} Title`,
          parentId: cardBoxId,
          children: [],
          content: { text: card.title, tag: 'h3' },
          styles: {
            fontSize: '22px',
            fontWeight: 500,
            textColor: '#004E35',
            margin: '0 0 12px 0',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };

        nodes[cardDescId] = {
          id: cardDescId,
          type: 'paragraph',
          name: `Card ${cIdx + 1} Desc`,
          parentId: cardBoxId,
          children: [],
          content: { html: `<p>${card.desc}</p>` },
          styles: {
            fontSize: '15px',
            lineHeight: '1.6',
            textColor: '#4B5563',
            margin: '0',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };

        if (card.link) {
          const cardBtnId = generateNodeId('button');
          nodes[cardBtnId] = {
            id: cardBtnId,
            type: 'button',
            name: `Card ${cIdx + 1} Link`,
            parentId: cardBoxId,
            children: [],
            content: { text: 'Learn more →', url: card.link, variant: 'outline' },
            styles: {
              marginTop: '20px',
              fontSize: '14px',
              fontWeight: 600,
              textColor: '#004E35',
              paddingTop: '6px',
              paddingBottom: '6px',
              paddingLeft: '0px',
              paddingRight: '0px',
              backgroundColor: 'transparent',
            },
            visibility: { desktop: true, tablet: true, mobile: true },
          };
          cardChildren.push(cardBtnId);
        }

        nodes[cardBoxId] = {
          id: cardBoxId,
          type: 'container',
          name: `Card Item ${cIdx + 1}`,
          parentId: gridId,
          children: cardChildren,
          content: {},
          styles: {
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            paddingTop: '32px',
            paddingBottom: '32px',
            paddingLeft: '28px',
            paddingRight: '28px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#E2E8F0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };

        cardNodeIds.push(cardBoxId);
      }

      nodes[gridId] = {
        id: gridId,
        type: 'grid',
        name: 'Cards Grid',
        parentId: containerId,
        children: cardNodeIds,
        content: {},
        styles: {
          display: 'grid',
          gridColumns: cardList.length === 2 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          width: '100%',
        },
        responsiveStyles: {
          tablet: { gridColumns: 'repeat(2, 1fr)' },
          mobile: { gridColumns: '1fr' },
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      };

      containerChildren.push(gridId);
      break;
    }

    case 'stats-counter': {
      sectionStyles.backgroundColor = '#002E20';
      sectionStyles.paddingTop = '80px';
      sectionStyles.paddingBottom = '80px';

      if (props.title) {
        const h2Id = generateNodeId('heading');
        nodes[h2Id] = {
          id: h2Id,
          type: 'heading',
          name: 'Metrics Title',
          parentId: containerId,
          children: [],
          content: { text: cleanText(props.title), tag: 'h2' },
          styles: {
            fontSize: '40px',
            fontWeight: 400,
            textColor: '#FFFFFF',
            textAlign: 'center',
            margin: '0 0 48px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(h2Id);
      }

      const statList: Array<{ num: string; label: string }> = [];
      for (let i = 1; i <= 6; i++) {
        const num = props[`stat${i}_num`] || props[`stat${i}_value`];
        const label = props[`stat${i}_label`];
        if (num && label) {
          statList.push({ num, label });
        }
      }

      const gridId = generateNodeId('grid');
      const statNodeIds: string[] = [];

      for (let sIdx = 0; sIdx < statList.length; sIdx++) {
        const s = statList[sIdx];
        const statId = generateNodeId('counter');
        nodes[statId] = {
          id: statId,
          type: 'counter',
          name: `Metric ${sIdx + 1}`,
          parentId: gridId,
          children: [],
          content: { targetValue: s.num, label: s.label },
          styles: {
            textAlign: 'center',
            textColor: '#10B981',
            fontSize: '52px',
            fontWeight: 700,
            fontFamily: 'Neue Montreal, sans-serif',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        statNodeIds.push(statId);
      }

      nodes[gridId] = {
        id: gridId,
        type: 'grid',
        name: 'Metrics Grid',
        parentId: containerId,
        children: statNodeIds,
        content: {},
        styles: {
          display: 'grid',
          gridColumns: `repeat(${Math.min(statList.length || 4, 4)}, 1fr)`,
          gap: '32px',
          width: '100%',
        },
        responsiveStyles: {
          tablet: { gridColumns: 'repeat(2, 1fr)' },
          mobile: { gridColumns: '1fr', gap: '40px' },
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      };

      containerChildren.push(gridId);
      break;
    }

    case 'cta-banner': {
      sectionStyles.backgroundColor = '#004E35';
      sectionStyles.paddingTop = '80px';
      sectionStyles.paddingBottom = '80px';
      containerStyles.display = 'flex';
      containerStyles.flexDirection = 'column';
      containerStyles.alignItems = 'center';
      containerStyles.textAlign = 'center';

      const h2Text = cleanText(props.headline || props.title || 'Partner With Envint');
      const h2Id = generateNodeId('heading');
      nodes[h2Id] = {
        id: h2Id,
        type: 'heading',
        name: 'CTA Title',
        parentId: containerId,
        children: [],
        content: { text: h2Text, tag: 'h2' },
        styles: {
          fontSize: '44px',
          fontWeight: 400,
          textColor: '#FFFFFF',
          margin: '0 0 16px 0',
          fontFamily: 'Neue Montreal, sans-serif',
          maxWidth: '850px',
        },
        responsiveStyles: { mobile: { fontSize: '30px' } },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      containerChildren.push(h2Id);

      const subtext = cleanText(props.subtext || props.subtitle || props.description);
      if (subtext) {
        const pId = generateNodeId('paragraph');
        nodes[pId] = {
          id: pId,
          type: 'paragraph',
          name: 'CTA Description',
          parentId: containerId,
          children: [],
          content: { html: `<p>${subtext}</p>` },
          styles: {
            fontSize: '19px',
            lineHeight: '1.6',
            textColor: '#D1FAE5',
            maxWidth: '680px',
            margin: '0 0 32px 0',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(pId);
      }

      const btnText = cleanText(props.buttonLabel || props.ctaLabel || props.buttonText || 'Connect with Our Advisors');
      const btnUrl = props.buttonUrl || props.ctaUrl || '/connect';
      const btnId = generateNodeId('button');
      nodes[btnId] = {
        id: btnId,
        type: 'button',
        name: 'CTA Button',
        parentId: containerId,
        children: [],
        content: { text: btnText, url: btnUrl, variant: 'primary' },
        styles: {
          backgroundColor: '#10B981',
          textColor: '#002E20',
          fontSize: '16px',
          fontWeight: 600,
          paddingTop: '16px',
          paddingBottom: '16px',
          paddingLeft: '36px',
          paddingRight: '36px',
          borderRadius: '12px',
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      containerChildren.push(btnId);
      break;
    }

    case 'insights-grid': {
      sectionStyles.backgroundColor = '#FFFFFF';
      sectionStyles.paddingTop = '80px';
      sectionStyles.paddingBottom = '80px';

      if (props.title) {
        const h2Id = generateNodeId('heading');
        nodes[h2Id] = {
          id: h2Id,
          type: 'heading',
          name: 'Insights Title',
          parentId: containerId,
          children: [],
          content: { text: cleanText(props.title), tag: 'h2' },
          styles: {
            fontSize: '42px',
            fontWeight: 400,
            textColor: '#004E35',
            textAlign: 'center',
            margin: '0 0 16px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(h2Id);
      }

      if (props.subtitle) {
        const pId = generateNodeId('paragraph');
        nodes[pId] = {
          id: pId,
          type: 'paragraph',
          name: 'Insights Subtitle',
          parentId: containerId,
          children: [],
          content: { html: `<p>${cleanText(props.subtitle)}</p>` },
          styles: {
            fontSize: '18px',
            lineHeight: '1.6',
            textColor: '#64748B',
            textAlign: 'center',
            maxWidth: '750px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '48px',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(pId);
      }

      const gridNodeId = generateNodeId('insights-grid');
      nodes[gridNodeId] = {
        id: gridNodeId,
        type: 'insights-grid',
        name: 'Dynamic Insights Feed',
        parentId: containerId,
        children: [],
        content: {
          filterCategory: props.filterCategory || '',
          limit: props.limit || 6,
        },
        styles: { width: '100%' },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      containerChildren.push(gridNodeId);
      break;
    }

    case 'impact-grid': {
      sectionStyles.backgroundColor = '#FFFFFF';
      sectionStyles.paddingTop = '80px';
      sectionStyles.paddingBottom = '80px';

      if (props.title) {
        const h2Id = generateNodeId('heading');
        nodes[h2Id] = {
          id: h2Id,
          type: 'heading',
          name: 'Impact Title',
          parentId: containerId,
          children: [],
          content: { text: cleanText(props.title), tag: 'h2' },
          styles: {
            fontSize: '42px',
            fontWeight: 400,
            textColor: '#004E35',
            textAlign: 'center',
            margin: '0 0 16px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(h2Id);
      }

      if (props.subtitle) {
        const pId = generateNodeId('paragraph');
        nodes[pId] = {
          id: pId,
          type: 'paragraph',
          name: 'Impact Subtitle',
          parentId: containerId,
          children: [],
          content: { html: `<p>${cleanText(props.subtitle)}</p>` },
          styles: {
            fontSize: '18px',
            lineHeight: '1.6',
            textColor: '#64748B',
            textAlign: 'center',
            maxWidth: '750px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '48px',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(pId);
      }

      const gridNodeId = generateNodeId('impact-grid');
      nodes[gridNodeId] = {
        id: gridNodeId,
        type: 'impact-grid',
        name: 'Dynamic Impact Case Studies Feed',
        parentId: containerId,
        children: [],
        content: { limit: props.limit || 6 },
        styles: { width: '100%' },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      containerChildren.push(gridNodeId);
      break;
    }

    case 'faq-accordion': {
      sectionStyles.backgroundColor = '#F9FAFB';
      sectionStyles.paddingTop = '80px';
      sectionStyles.paddingBottom = '80px';

      if (props.title) {
        const h2Id = generateNodeId('heading');
        nodes[h2Id] = {
          id: h2Id,
          type: 'heading',
          name: 'FAQ Title',
          parentId: containerId,
          children: [],
          content: { text: cleanText(props.title), tag: 'h2' },
          styles: {
            fontSize: '40px',
            fontWeight: 400,
            textColor: '#004E35',
            textAlign: 'center',
            margin: '0 0 48px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(h2Id);
      }

      const accordionId = generateNodeId('accordion');
      const itemNodeIds: string[] = [];

      for (let i = 1; i <= 6; i++) {
        const q = props[`q${i}`];
        const a = props[`a${i}`];
        if (q && a) {
          const itemId = generateNodeId('accordion-item');
          const pId = generateNodeId('paragraph');

          nodes[pId] = {
            id: pId,
            type: 'paragraph',
            name: `Answer ${i}`,
            parentId: itemId,
            children: [],
            content: { html: `<p>${cleanText(a)}</p>` },
            styles: { fontSize: '16px', lineHeight: '1.6', textColor: '#4B5563', margin: '0' },
            visibility: { desktop: true, tablet: true, mobile: true },
          };

          nodes[itemId] = {
            id: itemId,
            type: 'accordion-item',
            name: `Question ${i}`,
            parentId: accordionId,
            children: [pId],
            content: { title: cleanText(q), defaultOpen: i === 1 },
            styles: {},
            visibility: { desktop: true, tablet: true, mobile: true },
          };

          itemNodeIds.push(itemId);
        }
      }

      nodes[accordionId] = {
        id: accordionId,
        type: 'accordion',
        name: 'FAQ Accordion Wrapper',
        parentId: containerId,
        children: itemNodeIds,
        content: {},
        styles: { maxWidth: '850px', marginLeft: 'auto', marginRight: 'auto', width: '100%' },
        visibility: { desktop: true, tablet: true, mobile: true },
      };

      containerChildren.push(accordionId);
      break;
    }

    case 'rich-text': {
      sectionStyles.backgroundColor = '#FFFFFF';
      sectionStyles.paddingTop = '80px';
      sectionStyles.paddingBottom = '80px';

      if (props.title) {
        const h2Id = generateNodeId('heading');
        nodes[h2Id] = {
          id: h2Id,
          type: 'heading',
          name: 'Section Title',
          parentId: containerId,
          children: [],
          content: { text: cleanText(props.title), tag: 'h2' },
          styles: {
            fontSize: '38px',
            fontWeight: 400,
            textColor: '#004E35',
            margin: '0 0 24px 0',
            fontFamily: 'Neue Montreal, sans-serif',
          },
          visibility: { desktop: true, tablet: true, mobile: true },
        };
        containerChildren.push(h2Id);
      }

      const pId = generateNodeId('paragraph');
      const rawHtml = props.content || props.html || '<p>Content</p>';
      nodes[pId] = {
        id: pId,
        type: 'paragraph',
        name: 'Rich Text Body',
        parentId: containerId,
        children: [],
        content: { html: rawHtml },
        styles: {
          fontSize: '18px',
          lineHeight: '1.7',
          textColor: '#374151',
          maxWidth: '900px',
        },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      containerChildren.push(pId);
      break;
    }

    default: {
      // General fallback
      const h3Id = generateNodeId('heading');
      nodes[h3Id] = {
        id: h3Id,
        type: 'heading',
        name: 'Block Title',
        parentId: containerId,
        children: [],
        content: { text: cleanText(props.title || props.headline || block.name || blockType), tag: 'h3' },
        styles: { fontSize: '28px', textColor: '#004E35', margin: '0 0 16px 0' },
        visibility: { desktop: true, tablet: true, mobile: true },
      };
      containerChildren.push(h3Id);
      break;
    }
  }

  // Create Container node
  nodes[containerId] = {
    id: containerId,
    type: 'container',
    name: 'Content Container',
    parentId: sectionId,
    children: containerChildren,
    content: {},
    styles: containerStyles,
    visibility: { desktop: true, tablet: true, mobile: true },
  };

  // Create Root Section node
  nodes[sectionId] = {
    id: sectionId,
    type: 'section',
    name: block.name || `${blockType.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} Section`,
    parentId: null,
    children: [containerId],
    content: {},
    styles: sectionStyles,
    visibility: { desktop: true, tablet: true, mobile: true },
  };

  return { rootSectionId: sectionId, nodes };
}

/**
 * Converts an entire array of legacy contentBlocks into a complete Schema v2 PageBlockTree.
 */
export function convertLegacyPageBlocksToTree(
  blocks: any[],
  pageSlug: string,
  pageTitle?: string
): PageBlockTree {
  const rootIds: string[] = [];
  const nodes: Record<string, BuilderNode> = {};

  const enabledBlocks = (blocks || []).filter((b) => b && b.enabled !== false);

  for (let idx = 0; idx < enabledBlocks.length; idx++) {
    const block = enabledBlocks[idx];
    const converted = convertLegacyBlockToNodes(block, idx);
    rootIds.push(converted.rootSectionId);
    Object.assign(nodes, converted.nodes);
  }

  return {
    version: 2,
    rootIds,
    nodes,
  };
}
