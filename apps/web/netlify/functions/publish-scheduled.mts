/**
 * Netlify's hourly scheduler invokes this function. The publishing logic
 * remains in the authenticated Next.js route so manual runs and alternate
 * schedulers use the same due-at-or-before implementation.
 */
export default async function publishScheduled(): Promise<Response> {
  const siteUrl = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!siteUrl || !secret) {
    return Response.json({ error: 'URL or CRON_SECRET is not configured.' }, { status: 500 });
  }

  const response = await fetch(`${siteUrl.replace(/\/+$/, '')}/api/cron/publish-scheduled`, {
    method: 'GET',
    headers: { 'x-cron-secret': secret },
  });
  if (!response.ok) {
    return Response.json(
      { error: 'Scheduled publishing route failed.', status: response.status },
      { status: 502 },
    );
  }
  return new Response(null, { status: 204 });
}

export const config = { schedule: '@hourly' };
