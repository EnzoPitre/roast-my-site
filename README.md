# Roast My Site

A production-ready SaaS for AI-powered website audits.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Prisma & PostgreSQL
- NextAuth v4 (Google)
- Stripe
- Claude 3.5 Sonnet (Anthropic SDK)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.local.example` to `.env.local` and add your keys (Database, NextAuth, Google OAuth, Stripe, Anthropic).
   ```bash
   cp .env.local.example .env.local
   ```

3. **Database Setup:**
   Run Prisma migrations to initialize your PostgreSQL database.
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Features
- **Brutal Audits:** Paste a URL and get a deep heuristic evaluation by Claude via server-side Cheerio HTML parsing.
- **Paywall:** 1 free roast per account, then an auto-enforced €4.90 one-off payment via Stripe Checkout.
- **Actionable Plans:** Quick, Medium, and Strategic fixes parsed natively.
- **Rate limiting:** In-memory request cap (max 3 / hr / IP) to prevent bot abuse.
