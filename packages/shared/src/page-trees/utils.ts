import { BuilderNode, ElementStyles, ElementType, PageBlockTree } from '../builder-schema';

export function resolveCmsImage(url?: string | null): string {
  if (!url) return '';
  if (url.includes('services-investment.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/services-responsible.webp';
  }
  if (url.includes('mapsense-banner.jpg')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/mapsense-hero.webp';
  }
  if (url.includes('careers-polo.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/careers-polo-people.webp';
  }
  if (url.includes('careers-footer.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/careers-footer.jpg';
  }
  if (url.includes('careers-wifu-3.webp') || url.includes('careers-wifu-4.webp')) {
    return 'https://envintcms.s3.ap-south-1.amazonaws.com/images/careers-typical-day.webp';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/images/')) {
    return `https://envintcms.s3.ap-south-1.amazonaws.com${url}`;
  }
  if (url.startsWith('/media/uploads/')) {
    return `https://envintcms.s3.ap-south-1.amazonaws.com${url}`;
  }
  return `https://envintcms.s3.ap-south-1.amazonaws.com/images/${url.replace(/^\/+/, '')}`;
}

function safeStyles(s: any): ElementStyles {
  return typeof s === 'object' && s !== null && !Array.isArray(s) ? s : {};
}

function safeResponsiveStyles(r: any): BuilderNode['responsiveStyles'] {
  return typeof r === 'object' && r !== null && !Array.isArray(r) ? r : {};
}

export function makeSection(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any
): BuilderNode {
  let name = id;
  let children: string[] = [];
  let styles: ElementStyles = {};
  let responsiveStyles: BuilderNode['responsiveStyles'] = {};

  if (Array.isArray(arg2)) {
    children = arg2;
    styles = safeStyles(arg3);
    name = typeof arg4 === 'string' ? arg4 : typeof arg5 === 'string' ? arg5 : id;
    responsiveStyles = safeResponsiveStyles(typeof arg4 === 'object' ? arg4 : arg5);
  } else {
    name = typeof arg2 === 'string' ? arg2 : id;
    children = Array.isArray(arg3) ? arg3 : [];
    styles = safeStyles(arg4);
    responsiveStyles = safeResponsiveStyles(arg5);
  }

  return {
    id,
    type: 'section',
    name,
    parentId: null,
    children,
    content: {},
    styles: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      paddingTop: '80px',
      paddingBottom: '80px',
      paddingLeft: '24px',
      paddingRight: '24px',
      ...styles,
    },
    responsiveStyles: {
      tablet: { paddingTop: '60px', paddingBottom: '60px' },
      mobile: { paddingTop: '40px', paddingBottom: '40px' },
      ...responsiveStyles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeContainer(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let children: string[] = [];
  let styles: ElementStyles = {};
  let responsiveStyles: BuilderNode['responsiveStyles'] = {};

  if (Array.isArray(arg3)) {
    parentId = typeof arg2 === 'string' ? arg2 : '';
    children = arg3;
    styles = safeStyles(arg4);
    name = typeof arg5 === 'string' ? arg5 : id;
    responsiveStyles = safeResponsiveStyles(arg5);
  } else {
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    children = Array.isArray(arg4) ? arg4 : [];
    styles = safeStyles(arg5);
    responsiveStyles = safeResponsiveStyles(arg6);
  }

  return {
    id,
    type: 'container',
    name,
    parentId,
    children,
    content: {},
    styles: {
      maxWidth: '1280px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      ...styles,
    },
    responsiveStyles,
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeGrid(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any,
  arg7?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let children: string[] = [];
  let styles: ElementStyles = {};
  let responsiveStyles: BuilderNode['responsiveStyles'] = {};

  if (Array.isArray(arg3)) {
    // makeGrid(id, parentId, children, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    children = arg3;
    styles = safeStyles(arg4);
    name = typeof arg5 === 'string' ? arg5 : id;
    responsiveStyles = safeResponsiveStyles(arg5);
  } else if (Array.isArray(arg4)) {
    // makeGrid(id, name, parentId, children, styles, responsiveStyles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    children = arg4;
    styles = safeStyles(arg5);
    responsiveStyles = safeResponsiveStyles(arg6);
  } else if (Array.isArray(arg5)) {
    // makeGrid(id, parentId, columns, gap, children, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    const cols = typeof arg3 === 'string' || typeof arg3 === 'number' ? arg3 : '3';
    const gap = typeof arg4 === 'string' ? arg4 : '24px';
    children = arg5;
    styles = {
      gridColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap,
      ...safeStyles(arg6),
    };
    name = typeof arg7 === 'string' ? arg7 : id;
    const defaultTabletCols = String(cols) === '4' ? 'repeat(2, minmax(0, 1fr))' : String(cols) === '3' ? 'repeat(2, minmax(0, 1fr))' : '1fr';
    const defaultMobileCols = '1fr';
    responsiveStyles = safeResponsiveStyles(
      typeof arg7 === 'object' && arg7 !== null
        ? arg7
        : {
            tablet: { gridColumns: defaultTabletCols },
            mobile: { gridColumns: defaultMobileCols },
          }
    );
  } else {
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    children = Array.isArray(arg4) ? arg4 : [];
    styles = safeStyles(arg5);
    responsiveStyles = safeResponsiveStyles(arg6);
  }

  return {
    id,
    type: 'grid',
    name,
    parentId,
    children,
    content: {},
    styles: {
      display: 'grid',
      gap: '24px',
      width: '100%',
      ...styles,
    },
    responsiveStyles,
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeFlex(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let children: string[] = [];
  let styles: ElementStyles = {};
  let responsiveStyles: BuilderNode['responsiveStyles'] = {};

  if (Array.isArray(arg3)) {
    parentId = typeof arg2 === 'string' ? arg2 : '';
    children = arg3;
    styles = safeStyles(arg4);
    name = typeof arg5 === 'string' ? arg5 : id;
    responsiveStyles = safeResponsiveStyles(arg5);
  } else {
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    children = Array.isArray(arg4) ? arg4 : [];
    styles = safeStyles(arg5);
    responsiveStyles = safeResponsiveStyles(arg6);
  }

  return {
    id,
    type: 'flex',
    name,
    parentId,
    children,
    content: {},
    styles: {
      display: 'flex',
      gap: '16px',
      width: '100%',
      ...styles,
    },
    responsiveStyles,
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeHeading(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any,
  arg7?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let text = '';
  let tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2';
  let styles: ElementStyles = {};
  let responsiveStyles: BuilderNode['responsiveStyles'] = {};

  const validTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  if (typeof arg4 === 'string' && validTags.includes(arg4.toLowerCase())) {
    // makeHeading(id, parentId, text, tag, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    text = String(arg3 ?? '');
    tag = arg4.toLowerCase() as any;
    styles = safeStyles(arg5);
    name = typeof arg6 === 'string' ? arg6 : id;
    responsiveStyles = safeResponsiveStyles(arg6);
  } else {
    // makeHeading(id, name, parentId, text, tag, styles, responsiveStyles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    text = String(arg4 ?? '');
    tag = (typeof arg5 === 'string' && validTags.includes(arg5.toLowerCase()) ? arg5.toLowerCase() : 'h2') as any;
    styles = safeStyles(arg6);
    responsiveStyles = safeResponsiveStyles(arg7);
  }

  return {
    id,
    type: 'heading',
    name,
    parentId,
    children: [],
    content: { text, tag },
    styles: {
      fontFamily: 'Neue Montreal, sans-serif',
      fontSize: tag === 'h1' ? '48px' : tag === 'h2' ? '40px' : '28px',
      fontWeight: 400,
      textColor: '#004E35',
      lineHeight: '1.15',
      marginBottom: '16px',
      ...styles,
    },
    responsiveStyles: {
      tablet: { fontSize: tag === 'h1' ? '36px' : '30px' },
      mobile: { fontSize: tag === 'h1' ? '28px' : '24px' },
      ...responsiveStyles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeParagraph(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let text = '';
  let styles: ElementStyles = {};
  let responsiveStyles: BuilderNode['responsiveStyles'] = {};

  if (typeof arg4 === 'object' && arg4 !== null && !Array.isArray(arg4)) {
    // makeParagraph(id, parentId, text, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    text = String(arg3 ?? '');
    styles = safeStyles(arg4);
    name = typeof arg5 === 'string' ? arg5 : id;
    responsiveStyles = safeResponsiveStyles(arg5);
  } else {
    // makeParagraph(id, name, parentId, text, styles, responsiveStyles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    text = String(arg4 ?? '');
    styles = safeStyles(arg5);
    responsiveStyles = safeResponsiveStyles(arg6);
  }

  return {
    id,
    type: 'paragraph',
    name,
    parentId,
    children: [],
    content: { html: text, text },
    styles: {
      fontFamily: 'Neue Montreal, sans-serif',
      fontSize: '18px',
      fontWeight: 400,
      textColor: '#393939',
      lineHeight: '1.6',
      marginBottom: '16px',
      ...styles,
    },
    responsiveStyles: {
      mobile: { fontSize: '16px', lineHeight: '1.5' },
      ...responsiveStyles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeImage(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any,
  arg7?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let src = '';
  let alt = '';
  let styles: ElementStyles = {};
  let responsiveStyles: BuilderNode['responsiveStyles'] = {};

  if (typeof arg5 === 'object' && arg5 !== null && !Array.isArray(arg5)) {
    // makeImage(id, parentId, src, alt, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    src = typeof arg3 === 'string' ? arg3 : '';
    alt = typeof arg4 === 'string' ? arg4 : '';
    styles = safeStyles(arg5);
    name = typeof arg6 === 'string' ? arg6 : id;
    responsiveStyles = safeResponsiveStyles(arg6);
  } else {
    // makeImage(id, name, parentId, src, alt, styles, responsiveStyles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    src = typeof arg4 === 'string' ? arg4 : '';
    alt = typeof arg5 === 'string' ? arg5 : '';
    styles = safeStyles(arg6);
    responsiveStyles = safeResponsiveStyles(arg7);
  }

  return {
    id,
    type: 'image',
    name,
    parentId,
    children: [],
    content: {
      src: resolveCmsImage(src),
      alt,
      objectFit: (styles as any)?.objectFit || 'cover',
    },
    styles: {
      width: '100%',
      borderRadius: '12px',
      display: 'block',
      ...styles,
    },
    responsiveStyles,
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeBadge(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let text = '';
  let styles: ElementStyles = {};

  if (typeof arg4 === 'object' && arg4 !== null && !Array.isArray(arg4)) {
    // makeBadge(id, parentId, text, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    text = typeof arg3 === 'string' ? arg3 : '';
    styles = safeStyles(arg4);
    name = typeof arg5 === 'string' ? arg5 : id;
  } else {
    // makeBadge(id, name, parentId, text, styles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    text = typeof arg4 === 'string' ? arg4 : '';
    styles = safeStyles(arg5);
  }

  return {
    id,
    type: 'badge',
    name,
    parentId,
    children: [],
    content: { text },
    styles: {
      backgroundColor: 'rgba(0, 78, 53, 0.08)',
      textColor: '#004E35',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.08em',
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '14px',
      paddingRight: '14px',
      borderRadius: '9999px',
      width: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      ...styles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeButton(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any,
  arg7?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let label = '';
  let url = '#';
  let styles: ElementStyles = {};

  if (typeof arg6 === 'object' && arg6 !== null && !Array.isArray(arg6)) {
    if (typeof arg7 === 'string') {
      // makeButton(id, parentId, label, url, variant, styles, name)
      parentId = typeof arg2 === 'string' ? arg2 : '';
      label = typeof arg3 === 'string' ? arg3 : '';
      url = typeof arg4 === 'string' ? arg4 : '#';
      styles = safeStyles(arg6);
      name = arg7;
    } else {
      // makeButton(id, name, parentId, label, url, styles)
      name = typeof arg2 === 'string' ? arg2 : id;
      parentId = typeof arg3 === 'string' ? arg3 : '';
      label = typeof arg4 === 'string' ? arg4 : '';
      url = typeof arg5 === 'string' ? arg5 : '#';
      styles = safeStyles(arg6);
    }
  } else if (typeof arg5 === 'object' && arg5 !== null && !Array.isArray(arg5)) {
    // makeButton(id, parentId, label, url, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    label = typeof arg3 === 'string' ? arg3 : '';
    url = typeof arg4 === 'string' ? arg4 : '#';
    styles = safeStyles(arg5);
    name = typeof arg6 === 'string' ? arg6 : id;
  } else {
    // makeButton(id, name, parentId, label, url, styles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    label = typeof arg4 === 'string' ? arg4 : '';
    url = typeof arg5 === 'string' ? arg5 : '#';
    styles = safeStyles(arg6);
  }

  return {
    id,
    type: 'button',
    name,
    parentId,
    children: [],
    content: {
      label,
      action: { type: 'link', url },
      variant: 'primary',
    },
    styles: {
      backgroundColor: '#004E35',
      textColor: '#FFFFFF',
      fontSize: '16px',
      fontWeight: 500,
      paddingTop: '12px',
      paddingBottom: '12px',
      paddingLeft: '28px',
      paddingRight: '28px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'fit-content',
      ...styles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeCounter(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let value = '';
  let label = '';
  let styles: ElementStyles = {};

  if (typeof arg5 === 'object' && arg5 !== null && !Array.isArray(arg5)) {
    parentId = typeof arg2 === 'string' ? arg2 : '';
    value = typeof arg3 === 'string' ? arg3 : '';
    label = typeof arg4 === 'string' ? arg4 : '';
    styles = safeStyles(arg5);
    name = typeof arg6 === 'string' ? arg6 : id;
  } else {
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    value = typeof arg4 === 'string' ? arg4 : '';
    label = typeof arg5 === 'string' ? arg5 : '';
    styles = safeStyles(arg6);
  }

  return {
    id,
    type: 'counter',
    name,
    parentId,
    children: [],
    content: { value, label },
    styles: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      ...styles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeDivider(
  id: string,
  parentId: string,
  styles?: ElementStyles,
  name?: string
): BuilderNode {
  return {
    id,
    type: 'divider',
    name: name || id,
    parentId,
    children: [],
    content: {},
    styles: {
      width: '100%',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: '#E5E7EB',
      ...styles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeAccordion(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let children: string[] = [];
  let styles: ElementStyles = {};

  if (Array.isArray(arg3)) {
    // makeAccordion(id, parentId, children, styles, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    children = arg3;
    styles = safeStyles(arg4);
    name = typeof arg5 === 'string' ? arg5 : id;
  } else {
    // makeAccordion(id, name, parentId, children, styles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    children = Array.isArray(arg4) ? arg4 : [];
    styles = safeStyles(arg5);
  }

  return {
    id,
    type: 'accordion',
    name,
    parentId,
    children,
    content: {},
    styles: {
      width: '100%',
      ...styles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeAccordionItem(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let title = '';
  let children: string[] = [];
  let styles: ElementStyles = {};

  if (Array.isArray(arg4)) {
    // makeAccordionItem(id, parentId, title, children, styles/defaultOpen, name)
    parentId = typeof arg2 === 'string' ? arg2 : '';
    title = typeof arg3 === 'string' ? arg3 : '';
    children = arg4;
    styles = safeStyles(arg5);
    name = typeof arg6 === 'string' ? arg6 : (typeof arg5 === 'string' ? arg5 : id);
  } else {
    // makeAccordionItem(id, name, parentId, title, children, styles)
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    title = typeof arg4 === 'string' ? arg4 : '';
    children = Array.isArray(arg5) ? arg5 : [];
    styles = safeStyles(arg6);
  }

  return {
    id,
    type: 'accordion-item',
    name,
    parentId,
    children,
    content: { title },
    styles: {
      width: '100%',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#E2E8F0',
      paddingTop: '16px',
      paddingBottom: '16px',
      ...styles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeDynamicModule(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): BuilderNode {
  const dynamicTypes = ['team-grid', 'insights-grid', 'article-reader', 'contact-form', 'impact-grid'];
  let type: ElementType = 'insights-grid';
  let name = id;
  let parentId = '';
  let styles: ElementStyles = {};
  let content: Record<string, any> = {};

  if (dynamicTypes.includes(arg2 as any)) {
    type = arg2 as ElementType;
    name = typeof arg3 === 'string' ? arg3 : id;
    parentId = typeof arg4 === 'string' ? arg4 : '';
    if (arg5 && (arg5.category !== undefined || arg5.limit !== undefined || arg5.filter !== undefined)) {
      content = arg5;
      styles = safeStyles(arg6);
    } else {
      styles = safeStyles(arg5);
      content = typeof arg6 === 'object' && arg6 !== null ? arg6 : {};
    }
  } else {
    parentId = typeof arg2 === 'string' ? arg2 : '';
    type = (dynamicTypes.includes(arg3 as any) ? arg3 : 'insights-grid') as ElementType;
    if (arg4 && (arg4.category !== undefined || arg4.limit !== undefined || arg4.filter !== undefined)) {
      content = arg4;
      styles = safeStyles(arg6);
      name = typeof arg5 === 'string' ? arg5 : id;
    } else {
      styles = safeStyles(arg4);
      name = typeof arg5 === 'string' ? arg5 : id;
      content = typeof arg6 === 'object' && arg6 !== null ? arg6 : {};
    }
  }

  return {
    id,
    type,
    name,
    parentId,
    children: [],
    content,
    styles: {
      width: '100%',
      ...styles,
    },
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeForm(
  id: string,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any
): BuilderNode {
  let name = id;
  let parentId = '';
  let content: any = { formType: 'contact', action: '/api/forms/contact' };
  let styles: ElementStyles = {};

  if (typeof arg4 === 'object' && arg4 !== null) {
    parentId = typeof arg2 === 'string' ? arg2 : '';
    content = { ...content, ...arg3 };
    styles = safeStyles(arg4);
    name = typeof arg5 === 'string' ? arg5 : id;
  } else {
    name = typeof arg2 === 'string' ? arg2 : id;
    parentId = typeof arg3 === 'string' ? arg3 : '';
    content = { ...content, ...(typeof arg4 === 'object' ? arg4 : {}) };
    styles = safeStyles(arg5);
  }

  return {
    id,
    type: 'form',
    name,
    parentId,
    children: [],
    content,
    styles: {
      width: '100%',
      ...styles,
    },
    responsiveStyles: {},
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function makeSocialShare(
  id: string,
  parentId: string,
  channels?: Array<{ id: string; name: string; enabled: boolean; color?: string; url?: string }>,
  options?: {
    buttonSize?: number;
    borderRadius?: number;
    gap?: number;
    alignment?: 'left' | 'center' | 'right';
  },
  styles?: ElementStyles,
  name: string = 'Social Share Bar'
): BuilderNode {
  const defaultChannels = [
    { id: 'email', name: 'Email', enabled: true, color: '#ea4335', url: '' },
    { id: 'linkedin', name: 'LinkedIn', enabled: true, color: '#0a66c2', url: '' },
    { id: 'twitter', name: 'X / Twitter', enabled: true, color: '#000000', url: '' },
    { id: 'facebook', name: 'Facebook', enabled: true, color: '#1877f2', url: '' },
  ];

  return {
    id,
    type: 'social-share',
    name,
    parentId,
    children: [],
    content: {
      channels: channels || defaultChannels,
      buttonSize: options?.buttonSize || 32,
      borderRadius: options?.borderRadius ?? 4,
      gap: options?.gap ?? 10,
      alignment: options?.alignment || 'left',
    },
    styles: {
      width: '100%',
      ...safeStyles(styles),
    },
    responsiveStyles: {},
    visibility: { desktop: true, tablet: true, mobile: true },
  };
}

export function assembleTree(rootIds: string[], nodes: Record<string, BuilderNode>): PageBlockTree {
  // Sanitize all node styles and make sure no non-plain object or string leaked into styles
  for (const [key, node] of Object.entries(nodes)) {
    if (!node.styles || typeof node.styles !== 'object' || Array.isArray(node.styles)) {
      node.styles = {};
    } else {
      // Remove any numeric keys that could have come from string spreading (e.g. "0", "1")
      for (const k of Object.keys(node.styles)) {
        if (/^\d+$/.test(k)) {
          delete (node.styles as any)[k];
        }
      }
    }
  }

  return {
    version: 2,
    rootIds,
    nodes,
  };
}
