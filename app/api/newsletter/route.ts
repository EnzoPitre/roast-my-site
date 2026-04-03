import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, lang = 'en' } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }

    // Upsert: if already subscribed, return success silently
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    await prisma.newsletterSubscriber.create({ data: { email, lang } });

    // Optional welcome email — fire and forget
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const isFr = lang === 'fr';
        await resend.emails.send({
          from: 'Roast My Site <noreply@roastmysite.com>',
          to: email,
          subject: isFr
            ? '🔥 Bienvenue dans Roast My Site'
            : '🔥 Welcome to Roast My Site',
          html: `
            <div style="font-family:system-ui,sans-serif;background:#0A0A0F;color:#F8FAFC;padding:32px;border-radius:12px;max-width:600px">
              <h2 style="color:#F97316">${isFr ? 'Bienvenue !' : 'Welcome!'}</h2>
              <p style="color:#CBD5E1;line-height:1.6">
                ${isFr
                  ? 'Merci de vous être abonné à la newsletter Roast My Site. Chaque semaine, vous recevrez des conseils brutaux et actionnables pour améliorer votre taux de conversion.'
                  : 'Thanks for subscribing to Roast My Site. Every week, you\'ll get brutal, actionable tips to improve your website\'s conversion rate.'
                }
              </p>
              <a href="https://roastmysite.com/${lang}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#F97316;color:#fff;border-radius:8px;font-weight:700;text-decoration:none">
                ${isFr ? 'Tester gratuitement →' : 'Try it free →'}
              </a>
            </div>
          `,
        });
      } catch {
        // swallow — non-critical
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
