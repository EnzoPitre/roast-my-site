import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2024-04-10' as any,
  appInfo: {
    name: 'Roast My Site',
    version: '1.0.0',
  },
})
