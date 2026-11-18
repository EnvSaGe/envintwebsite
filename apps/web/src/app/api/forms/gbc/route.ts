import { NextRequest, NextResponse } from 'next/server';
import { GbcFormSchema } from '@envint/shared';
import { db, leadSubmissions } from '@envint/db';
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from '@/lib/security/rate-limit';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit('form:gbc', ip, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS);

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

    const validation = GbcFormSchema.safeParse(formData);
    if (!validation.success) {
      if (formData.website_hp) {
        return NextResponse.json({ success: true, message: 'Received' });
      }
      return NextResponse.json({ error: 'Validation failed', details: validation.error.format() }, { status: 400 });
    }

    const { fullName, email, company, phone } = validation.data;

    try {
      await db.insert(leadSubmissions).values({
        formType: 'EVENT_GBC',
        fullName,
        email,
        phone,
        company,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch {
      // Resilience during offline local dev
    }

    return NextResponse.json({ success: true, message: 'Thank you. We look forward to connecting at GBC 2024.' });
  } catch {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
