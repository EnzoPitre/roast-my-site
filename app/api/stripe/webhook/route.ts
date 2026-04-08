import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // One-time payment: unlock a roast
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // One-time roast payment
    if (session.mode === 'payment') {
      const roastId = session.client_reference_id;
      if (roastId) {
        await prisma.roast.update({
          where: { id: roastId },
          data: { isPaid: true },
        });
        console.log(`Roast ${roastId} has been successfully paid.`);
      }
    }

    // Subscription checkout: set user to pro
    if (session.mode === 'subscription' && session.subscription) {
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subId = session.subscription as string;

      if (userId && subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        const periodEnd = new Date((sub as any).current_period_end * 1000);

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: 'pro',
            stripeCustomerId: customerId,
            monthlyRoastsUsed: 0,
            monthlyRoastsReset: new Date(),
          },
        });

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubId: subId,
            status: sub.status,
            currentPeriodEnd: periodEnd,
          },
          update: {
            stripeSubId: subId,
            status: sub.status,
            currentPeriodEnd: periodEnd,
          },
        });

        console.log(`User ${userId} upgraded to Pro.`);
      }
    }
  }

  // Subscription created (alternate path)
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const periodEnd = new Date((sub as any).current_period_end * 1000);

    const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: sub.status === 'active' ? 'pro' : 'free' },
      });

      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeSubId: sub.id,
          status: sub.status,
          currentPeriodEnd: periodEnd,
        },
        update: {
          stripeSubId: sub.id,
          status: sub.status,
          currentPeriodEnd: periodEnd,
        },
      });
    }
  }

  // Subscription cancelled
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;

    const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: 'free' },
      });
      await prisma.subscription.updateMany({
        where: { userId: user.id },
        data: { status: 'canceled' },
      });
      console.log(`User ${user.id} downgraded to Free.`);
    }
  }

  // Invoice paid: reset monthly roast counter
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          monthlyRoastsUsed: 0,
          monthlyRoastsReset: new Date(),
        },
      });
      console.log(`Monthly roast counter reset for user ${user.id}.`);
    }
  }

  return new NextResponse(null, { status: 200 });
}
