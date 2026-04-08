import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const priceId = process.env.STRIPE_PRO_PRICE_ID;
    if (!priceId) {
      return NextResponse.json({ error: 'Pro plan not configured' }, { status: 500 });
    }

    // Read lang from cookie
    const cookieHeader = req.headers.get('cookie') ?? '';
    const langCookie = cookieHeader.split('; ').find(c => c.startsWith('roast-lang='))?.split('=')[1];
    const lang = langCookie === 'fr' ? 'fr' : 'en';

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
    }

    const pricingPath = lang === 'fr' ? '/tarifs' : '/pricing';
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/${lang}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${lang}${pricingPath}`,
      metadata: { userId },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Subscribe Error:', error);
    return NextResponse.json({ error: 'Failed to create subscription session' }, { status: 500 });
  }
}
