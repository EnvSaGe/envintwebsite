import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { token, path } = await request.json();
    const secret = process.env.DRAFT_PREVIEW_SECRET;

    if (!token || !path || !secret) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify token format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return NextResponse.json({ error: 'Malformed token' }, { status: 401 });
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToSign = `${headerB64}.${payloadB64}`;
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(dataToSign)
      .digest('base64url');

    if (signatureB64 !== expectedSig) {
      return NextResponse.json({ error: 'Invalid token signature' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);

    // Validate expiration and audience
    if (payload.exp < now || payload.aud !== 'envint-web') {
      return NextResponse.json({ error: 'Expired or invalid token audience' }, { status: 401 });
    }

    // Validate path regex
    if (!/^\/([a-zA-Z0-9-_\/]+)?$/.test(path)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Enable Next.js Draft Mode (sets HttpOnly cookie)
    const draft = await draftMode();
    draft.enable();

    // 303 Redirect to preview route
    return NextResponse.redirect(new URL(path, request.url), 303);
  } catch {
    return NextResponse.json({ error: 'Draft preview initialization failed' }, { status: 500 });
  }
}
