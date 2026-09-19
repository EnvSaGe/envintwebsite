import React from 'react';
import { BuilderNode, PageBlockTree } from '@envint/shared';
import { generateNodeResponsiveCss } from './style-utils';
import { SectionElement } from './elements/SectionElement';
import { ContainerElement } from './elements/ContainerElement';
import { GridElement, FlexElement } from './elements/LayoutElements';
import { HeadingElement } from './elements/HeadingElement';
import { ParagraphElement } from './elements/ParagraphElement';
import { ButtonElement } from './elements/ButtonElement';
import { ImageElement } from './elements/ImageElement';
import {
  CounterElement,
  BadgeElement,
  SpacerElement,
  DividerElement,
  AccordionElement,
  AccordionItemElement,
} from './elements/UtilityElements';
import {
  TeamGridElement,
  JourneyCarouselElement,
  ServiceCardsElement,
  InsightsGridElement,
  ImpactGridElement,
  SocialShareElement,
} from './elements/DynamicModules';
import { FormElement } from './elements/FormElement';
import { SearchBarElement } from './elements/SearchBarElement';
import { TeamCardMember } from '@/components/about/TeamGrid';

interface TreeRendererProps {
  tree: PageBlockTree;
  teamCards?: TeamCardMember[];
}

function findFirstH1Id(rootIds: string[], nodes: Record<string, BuilderNode>): string | null {
  const queue = [...rootIds];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = nodes[id];
    if (!node) continue;

    if (node.type === 'heading' && String(node.content?.tag || '').toLowerCase() === 'h1') {
      return id;
    }

    if (node.children && node.children.length > 0) {
      queue.push(...node.children);
    }
  }

  return null;
}

export function TreeRenderer({ tree, teamCards }: TreeRendererProps) {
  if (!tree || !tree.rootIds || !tree.nodes) {
    return null;
  }

  const { rootIds, nodes } = tree;
  const firstH1Id = findFirstH1Id(rootIds, nodes);

  // Generate all responsive CSS overrides for SSR
  let aggregatedCss = '';
  for (const [id, node] of Object.entries(nodes)) {
    // Breakpoint styling overrides
    aggregatedCss += generateNodeResponsiveCss(
      id,
      node.responsiveStyles?.tablet,
      node.responsiveStyles?.mobile
    );

    // Device visibility rules
    if (node.visibility) {
      if (!node.visibility.desktop) {
        aggregatedCss += `@media (min-width: 1024px) { [data-builder-id="${id}"] { display: none !important; } }\n`;
      }
      if (!node.visibility.tablet) {
        aggregatedCss += `@media (min-width: 768px) and (max-width: 1023px) { [data-builder-id="${id}"] { display: none !important; } }\n`;
      }
      if (!node.visibility.mobile) {
        aggregatedCss += `@media (max-width: 767px) { [data-builder-id="${id}"] { display: none !important; } }\n`;
      }
    }
  }

  return (
    <div className="envint-dynamic-page-tree">
      {aggregatedCss && (
        <style dangerouslySetInnerHTML={{ __html: aggregatedCss }} />
      )}
      {rootIds.map((rootId) => (
        <RenderNode
          key={rootId}
          nodeId={rootId}
          nodes={nodes}
          teamCards={teamCards}
          firstH1Id={firstH1Id}
        />
      ))}
    </div>
  );
}

function RenderNode({
  nodeId,
  nodes,
  teamCards,
  firstH1Id,
}: {
  nodeId: string;
  nodes: Record<string, BuilderNode>;
  teamCards?: TeamCardMember[];
  firstH1Id?: string | null;
}) {
  const node = nodes[nodeId];
  if (!node) return null;

  // Render children recursively
  const renderedChildren = (node.children || []).map((childId) => (
    <RenderNode
      key={childId}
      nodeId={childId}
      nodes={nodes}
      teamCards={teamCards}
      firstH1Id={firstH1Id}
    />
  ));

  switch (node.type) {
    case 'section':
      return <SectionElement node={node}>{renderedChildren}</SectionElement>;

    case 'container':
    case 'columns':
      return <ContainerElement node={node}>{renderedChildren}</ContainerElement>;

    case 'grid':
      return <GridElement node={node}>{renderedChildren}</GridElement>;

    case 'flex':
      return <FlexElement node={node}>{renderedChildren}</FlexElement>;

    case 'heading':
      return <HeadingElement node={node} isFirstH1={firstH1Id ? node.id === firstH1Id : true} />;

    case 'paragraph':
    case 'rich-text':
      return <ParagraphElement node={node} />;

    case 'button':
      return <ButtonElement node={node} />;

    case 'image':
      return <ImageElement node={node} />;

    case 'counter':
      return <CounterElement node={node} />;

    case 'badge':
      return <BadgeElement node={node} />;

    case 'spacer':
      return <SpacerElement node={node} />;

    case 'divider':
      return <DividerElement node={node} />;

    case 'accordion':
      return <AccordionElement node={node}>{renderedChildren}</AccordionElement>;

    case 'accordion-item':
      return <AccordionItemElement node={node}>{renderedChildren}</AccordionItemElement>;

    case 'team-grid':
      return <TeamGridElement node={node} teamCards={teamCards} />;

    case 'journey-carousel':
      return <JourneyCarouselElement node={node} />;

    case 'service-cards':
      return <ServiceCardsElement node={node} />;

    case 'insights-grid':
      return <InsightsGridElement node={node} />;

    case 'impact-grid':
      return <ImpactGridElement node={node} />;

    case 'form':
      return <FormElement node={node} />;

    case 'search-bar':
      return <SearchBarElement node={node} />;

    case 'social-share':
      return <SocialShareElement node={node} />;

    default:
      // Graceful fallback for unknown elements
      return (
        <div data-builder-id={node.id} style={{ display: 'contents' }}>
          {renderedChildren}
        </div>
      );
  }
}
