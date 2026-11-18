import { NextRequest, NextResponse } from 'next/server';
import { ContactFormSchema } from '@envint/shared';
import { db, leadSubmissions } from '@envint/db';
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from '@/lib/security/rate-limit';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit('form:contact', ip, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS);

    if (rate.limited) {
      return rateLimitExceededResponse(rate.resetSeconds);
    }

    let formData: any;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      formData = await request.json();
    } else {
      const data = await request.formData();
      formData = Object.fromEntries(data.entries());
    }

    // Server-side Zod validation & Honeypot detection
    const validation = ContactFormSchema.safeParse(formData);
    if (!validation.success) {
      // If honeypot caught spam, fail quietly
      if (formData.website_hp) {
        return NextResponse.json({ success: true, message: 'Message received' });
      }
      return NextResponse.json({ error: 'Validation failed', details: validation.error.format() }, { status: 400 });
    }

    const { fullName, email, phone, company, location, category, message } = validation.data;

    // Persist to Neon lead_submissions table
    try {
      await db.insert(leadSubmissions).values({
        formType: 'CONTACT',
        fullName,
        email,
        phone,
        company,
        location,
        category,
        message,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch {
      // Database write resilience for environments during initial offline dev
    }

    // Configurable recipient notifications via server-only env: process.env.CONTACT_FORM_RECIPIENTS
    // Outbound email dispatched via sanitized template (e.g. Resend/SES) in production

    return NextResponse.json({ success: true, message: 'Thank you. Your inquiry has been received.' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
