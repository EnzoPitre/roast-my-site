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

    // Read lang from cookie
    const cookieHeader = req.headers.get('cookie') ?? '';
    const langCookie = cookieHeader.split('; ').find(c => c.startsWith('roast-lang='))?.split('=')[1];
    const lang = langCookie === 'fr' ? 'fr' : 'en';

    const body = await req.json();
    const { roastId } = body;

    if (!roastId) {
      return NextResponse.json({ error: 'Roast ID is required' }, { status: 400 });
    }

    // Verify Roast belongs to user
    const roast = await prisma.roast.findUnique({
      where: { id: roastId, userId: (session.user as any).id }
    });

    if (!roast) {
      return NextResponse.json({ error: 'Roast not found' }, { status: 404 });
    }

    if (roast.isPaid) {
      return NextResponse.json({ error: 'This roast is already unlocked' }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) throw new Error('STRIPE_PRICE_ID not set');

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/${lang}/roast/${roastId}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${lang}/roast/${roastId}?canceled=true`,
      client_reference_id: roastId,
      metadata: {
        userId: (session.user as any).id,
        roastId: roastId,
      }
    });

    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'An error occurred during checkout' }, { status: 500 });
  }
}
