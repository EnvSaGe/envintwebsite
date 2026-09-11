import { NextRequest, NextResponse } from 'next/server';
import { NewsletterFormSchema } from '@envint/shared';
import { db, leadSubmissions } from '@envint/db';

export async function POST(request: NextRequest) {
  try {
    let formData: any;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      formData = await request.json();
    } else {
      const data = await request.formData();
      formData = Object.fromEntries(data.entries());
    }

    const validation = NewsletterFormSchema.safeParse(formData);
    if (!validation.success) {
      if (formData.website_hp) {
        return NextResponse.json({ success: true, message: 'Subscribed' });
      }
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { email } = validation.data;

    try {
      await db.insert(leadSubmissions).values({
        formType: 'NEWSLETTER_ESQ',
        email,
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch {
      // Resilience during offline local dev
    }

    return NextResponse.json({ success: true, message: 'Thank you for subscribing to ESQ.' });
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
