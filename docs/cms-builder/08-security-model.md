# 08. Security Model & Data Sanitization

## 1. Threat Modeling & Defense-in-Depth

A visual page builder provides extensive freedom to manipulate layouts, content, and styles. Without strict security controls, visual builders can become vectors for **Stored Cross-Site Scripting (XSS)**, **CSS Injection**, **Open Redirects**, and **Privilege Escalation**.

The Envint CMS implements a **four-layer defense-in-depth architecture**:

```
[Layer 1: Role-Based Access Control (RBAC)]
     │ (Only authenticated 'super_admin' or 'editor' via Clerk)
     ▼
[Layer 2: Server-Side Zod Schema Validation]
     │ (Rejects malformed tree structures, invalid node types, oversized payloads)
     ▼
[Layer 3: Content Sanitization & URL Whitelisting]
     │ (Strips <script>, onload handlers, javascript: URIs via sanitize-html)
     ▼
[Layer 4: Frontend Safe Rendering Boundary]
     │ (Never uses dangerous innerHTML without sanitization; CSP headers enforced)
```

---

## 2. Layer 1: Role-Based Access Control (RBAC)

Enforced server-side in all Server Actions and API routes:

```typescript
export async function savePageBlocksAction(pageId: string, blocks: any) {
  // Requires authenticated Clerk session with appropriate role
  await requireRole(['super_admin', 'editor']);
  // ...
}
```

### Role Capabilities:
| Action | `editor` | `super_admin` |
| :--- | :---: | :---: |
| Edit existing elements & copy | Yes | Yes |
| Add/remove sections & elements | Yes | Yes |
| Style elements via design tokens | Yes | Yes |
| Save draft & preview | Yes | Yes |
| Publish to production | Yes | Yes |
| Create/edit reusable global components | No | Yes |
| Edit custom advanced CSS classes | No | Yes |
| Manage user accounts & roles | No | Yes |

---

## 3. Layer 2: Schema Validation (Zod)

Incoming page tree payloads are validated before database persistence:

1. **Depth Limit**: Maximum tree nesting depth of 8 levels (prevents stack overflow or denial-of-service JSON recursion).
2. **Node Count Cap**: Maximum of 500 nodes per page.
3. **Payload Size Limit**: Capped at 5 MB per page payload.
4. **Valid Parent-Child References**: Every child ID must exist in `nodes`, and `parentId` references must be circular-dependency free.

---

## 4. Layer 3: Content Sanitization & URL Whitelisting

### 1. HTML Sanitization (`sanitize-html`):
All rich-text, paragraph, and headline content is sanitized before database storage and before frontend render:

```typescript
import sanitizeHtml from 'sanitize-html';

export function sanitizeContentHtml(rawHtml: string): string {
  return sanitizeHtml(rawHtml, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'b', 'i', 'strong', 'em', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'a', 'br', 'hr',
      'sub', 'sup'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title', 'class'],
      span: ['class', 'style'],
      p: ['class', 'style'],
      h1: ['class', 'style'],
      h2: ['class', 'style'],
      h3: ['class', 'style'],
      h4: ['class', 'style'],
      h5: ['class', 'style'],
      h6: ['class', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce safe external link attributes
        if (attribs.target === '_blank') {
          attribs.rel = 'noopener noreferrer';
        }
        return { tagName, attribs };
      },
    },
  });
}
```

### 2. URL Protocol Whitelist:
Every link, image source, and button target is validated:
- **Allowed**: `https://`, `http://` (dev only), `mailto:`, `tel:`, `#anchor-name`, `/internal-route`.
- **Blocked**: `javascript:`, `data:`, `vbscript:`, `file:`. Any attempt to save a `javascript:` URL is stripped and rejected.

### 3. Media Source Validation:
- Image URLs must belong to the verified S3 bucket (`envintcms.s3.ap-south-1.amazonaws.com`) or allowed CDN domains.
- Video embeds are restricted strictly to YouTube (`youtube.com`, `youtu.be`) and Vimeo (`vimeo.com`). Arbitrary `<iframe>` URLs are blocked.

---

## 5. Layer 4: CSS Property Validation

To prevent CSS injection attacks (e.g. keylogger CSS, data extraction via background URLs):

```typescript
const ALLOWED_CSS_PROPERTIES = new Set([
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'textColor',
  'textTransform', 'textDecoration', 'fontFamily',
  'width', 'maxWidth', 'minWidth', 'height', 'minHeight', 'maxHeight',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'display', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'gap',
  'gridColumns', 'gridRows',
  'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition',
  'borderRadius', 'borderWidth', 'borderStyle', 'borderColor',
  'boxShadow', 'opacity', 'overflow', 'zIndex'
]);
```

- Values are checked for prohibited expressions: `expression(`, `behavior:`, `url(data:`.
- Any unapproved property is silently discarded.
