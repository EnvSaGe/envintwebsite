# 05 — System Architecture & Revalidation Design

This document details the decoupled headless architecture for **Envint**, connecting the public Next.js website, dedicated Admin CMS (`admin.envintglobal.com`), Neon PostgreSQL database, AWS S3 storage, Netlify Image CDN, and Netlify edge deployment.

---

## 1. High-Level Architecture Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph Editors ["Content Editors & Administrators"]
        EditorUser["Editor in Browser"]
    end

    subgraph AdminCMS ["Admin CMS (admin.envintglobal.com)"]
        CMSUI["Admin Dashboard UI"]
        AuthServer["Auth.js Google OAuth\n+ Email Allowlist & RBAC"]
        DraftPreview["Draft Mode Preview Engine"]
        RevalTrigger["HMAC Revalidation Dispatcher"]
    end

    subgraph StorageLayer ["Data & Storage"]
        NeonDB[("Neon PostgreSQL\n(Content & Leads)")]
        S3Bucket[("AWS S3 Bucket\n(Master Media Assets)")]
    end

    subgraph PublicWeb ["Public Website (envintglobal.com - Netlify)"]
        EdgeCDN["Netlify Edge Network / Cache"]
        ImageCDN["Netlify Image CDN / next/image"]
        NextApp["Next.js App Router (SSG / ISR)"]
        RevalEndpoint["/api/revalidate\n(HMAC Signature + Timestamp + Allowlist)"]
    end

    subgraph PublicUsers ["Website Visitors & Search Engines"]
        Visitor["Global Visitor"]
        GoogleBot["Googlebot / Crawlers"]
    end

    EditorUser -->|Google OAuth HTTPS| CMSUI
    CMSUI --> AuthServer
    AuthServer -->|Transactional SQL (Drizzle)| NeonDB
    CMSUI -->|Pre-Signed S3 Upload (@aws-sdk/v3)| S3Bucket

    CMSUI -->|Draft Mode Request| DraftPreview
    DraftPreview -->|Draft Mode Cookie| NextApp

    CMSUI -->|Publish Action| RevalTrigger
    RevalTrigger -->|HMAC Signed POST /api/revalidate| RevalEndpoint
    RevalEndpoint -->|revalidateTag / revalidatePath| NextApp
    NextApp -->|Invalidate Edge Cache| EdgeCDN

    Visitor -->|Edge Cached Static HTML| EdgeCDN
    Visitor -->|Optimized WebP/AVIF| ImageCDN
    ImageCDN -->|Fetch Master Asset| S3Bucket
    GoogleBot -->|Static HTML + JSON-LD Schema| EdgeCDN
```

---

## 2. Public Website Architecture (`envintglobal.com`)

### 2.1 Next.js App Router Configuration
- **Framework:** Next.js (App Router with React Server Components)
- **Rendering Strategy:** Static Site Generation (SSG) with On-Demand Incremental Static Regeneration (ISR).
- **Reduced Database Overhead:** Normal visitors receive statically cached HTML and JSON from Netlify Edge nodes without initiating live database queries on every page request.
- **Image Delivery:** The initial architecture uses **AWS S3 for master asset storage** and **Netlify Image CDN via `next/image`** for on-demand transformation into responsive WebP and AVIF variants.

---

## 3. Admin CMS Architecture (`admin.envintglobal.com`)

### 3.1 Separation of Concerns
The Admin CMS is built as an independent application deployed to a dedicated subdomain (`admin.envintglobal.com`):
1. **Isolated Security Boundary:** Admin routes and session cookies are completely separated from public traffic.
2. **Independent Deployability:** CMS UI iterations do not trigger rebuilds of the public marketing site.
3. **Build Independence:** Routine content publishing occurs via database transactions and on-demand cache revalidation.

### 3.2 Authentication & Authorization (Auth.js Google OAuth)
- **Authentication Provider:** Google OAuth via **Auth.js (NextAuth v5)**.
- **Access Control:**
  - Login is restricted to an explicit server-side allowlist of authorized company email addresses (`ALLOWED_ADMIN_EMAILS`).
  - Role-based permissions (`SUPER_ADMIN`, `EDITOR`) are enforced server-side on all mutation routes.
  - No local password hashes are stored in the database.

---

## 4. Secure On-Demand Revalidation Protocol

### 4.1 Threat Model & Security Controls
To prevent unauthorized cache invalidation attacks or denial-of-service, the `/api/revalidate` endpoint implements strict defense-in-depth controls:
1. **HMAC SHA-256 Signatures:** Requests must include an `x-revalidation-signature` header computed as `HMAC-SHA256(REVALIDATION_SECRET, timestamp + "." + JSON.stringify(body))`.
2. **Replay Protection:** The payload includes a Unix timestamp (`timestamp`). If `|currentTime - timestamp| > 300 seconds`, the request is rejected.
3. **Constant-Time Verification:** Signatures are compared using `crypto.timingSafeEqual` to prevent timing attacks.
4. **Tag & Path Allowlisting:** Requested tags and paths are validated against strict regex patterns (e.g. `^/([a-z0-9-]+/)?$`) to prevent arbitrary path pollution.
5. **Body Size & Rate Limits:** Request payloads are capped at 10 KB, with rate limiting applied to the endpoint.

### 4.2 Endpoint Implementation (`app/api/revalidate/route.ts`)

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'crypto';

const ALLOWED_TAG_PATTERN = /^(insights|impacts|team|services|categories|tags|page:[a-z0-9-]+|insight:[a-z0-9-]+|impact:[a-z0-9-]+|team:[a-z0-9-]+|service:[a-z0-9-]+)$/;
const ALLOWED_PATH_PATTERN = /^\/([a-zA-Z0-9-_\/]+)?$/;
const MAX_AGE_SECONDS = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-revalidation-signature');
    const timestampHeader = request.headers.get('x-revalidation-timestamp');
    const secret = process.env.REVALIDATION_SECRET_TOKEN;

    if (!signature || !timestampHeader || !secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);

    // Replay attack protection
    if (isNaN(timestamp) || Math.abs(now - timestamp) > MAX_AGE_SECONDS) {
      return NextResponse.json({ error: 'Request expired' }, { status: 401 });
    }

    const rawBody = await request.text();
    if (rawBody.length > 10240) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    // Verify HMAC
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { paths = [], tags = [] } = JSON.parse(rawBody);

    // Validate and execute tag revalidation
    for (const tag of tags) {
      if (typeof tag === 'string' && ALLOWED_TAG_PATTERN.test(tag)) {
        revalidateTag(tag);
      }
    }

    // Validate and execute path revalidation
    for (const path of paths) {
      if (typeof path === 'string' && ALLOWED_PATH_PATTERN.test(path)) {
        revalidatePath(path, 'page');
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      tags,
      revalidatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Revalidation processing failed' }, { status: 500 });
  }
}
```

### 4.3 Revalidation Timing Semantics
Route Handler revalidation marks targeted edge cache entries as stale. Updated HTML is generated when the next visitor requests the page (stale-while-revalidate), after which the fresh page is cached across Netlify edge nodes.

---

## 5. Media & AWS S3 Storage Architecture (AWS SDK v3)

### 5.1 Pre-Signed Uploads via AWS SDK for JavaScript v3
The Admin CMS uses modern `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` to generate secure, time-limited upload URLs:

```typescript
// lib/s3.ts (Admin CMS)
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function createPresignedUploadUrl(filename: string, contentType: string) {
  const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  return { uploadUrl, key };
}
```

---

## 6. Netlify Hosting, Credits & Staging Protection

- **Deployment Credit Protection:** Routine content publishing requires no new production deployment and therefore no production-deployment credit charge. Revalidation may still consume web-request/function-compute/bandwidth credits.
- **Staging vs Production Protection (No Edge Middleware Overhead):**
  - Staging environments and deploy previews are protected by Netlify project visibility / password authentication.
  - As defense in depth, a build-context script outputs a static `_headers` file with `X-Robots-Tag: noindex, nofollow` only during non-production builds (`process.env.CONTEXT !== 'production'`).
  - Production builds (`CONTEXT === 'production'`) never receive the noindex header and serve standard indexable headers without consuming edge middleware compute on every request.
