import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRoast } from '@/lib/claude';
import { sendRoastEmail } from '@/lib/email';
import * as cheerio from 'cheerio';
import { Prisma } from '@prisma/client';

export const runtime = 'nodejs';
export const maxDuration = 300;

interface RoastResult {
  globalScore: number;
  summary: string;
  killList: unknown;
  fixPlan: unknown;
  scores: unknown;
  encouragement: string;
  competitorComparison?: string;
  conversionEstimate?: string;
  topOpportunity?: string;
  quickWins?: unknown;
}

async function fetchAndParseUrl(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 RoastBot/1.0 (ScheduledCron)' },
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const html = await response.text();
    const $ = cheerio.load(html);
    $('script, style, noscript, svg, img, iframe, header, footer').remove();
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    let visibleText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000);
    return `URL: ${url}\nTitle: ${title}\nDescription: ${description}\n---\nVISIBLE TEXT:\n${visibleText}`;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();

  const due = await prisma.scheduledRoast.findMany({
    where: { nextRunAt: { lte: now }, active: true },
    include: { user: { select: { id: true, email: true, name: true, plan: true, monthlyRoastsUsed: true } } },
  });

  console.log(`[Cron] Processing ${due.length} scheduled roasts`);

  const results = [];

  for (const scheduled of due) {
    try {
      // Skip if user is not pro or has hit monthly limit
      if (scheduled.user.plan !== 'pro' || scheduled.user.monthlyRoastsUsed >= 10) {
        console.log(`[Cron] Skipping ${scheduled.url} — user not eligible`);
        continue;
      }

      const websiteData = await fetchAndParseUrl(scheduled.url);
      if (!websiteData) {
        console.log(`[Cron] Could not fetch ${scheduled.url}`);
        continue;
      }

      const result = (await generateRoast(websiteData)) as RoastResult;

      const roast = await prisma.roast.create({
        data: {
          userId: scheduled.userId,
          url: scheduled.url,
          globalScore: result.globalScore,
          summary: result.summary,
          killList: result.killList as Prisma.InputJsonValue,
          fixPlan: result.fixPlan as Prisma.InputJsonValue,
          scores: result.scores as Prisma.InputJsonValue,
          encouragement: result.encouragement,
          competitorComparison: result.competitorComparison,
          conversionEstimate: result.conversionEstimate,
          topOpportunity: result.topOpportunity,
          quickWins: result.quickWins as Prisma.InputJsonValue,
          isPaid: true,
        },
      });

      // Update user counters
      await prisma.user.update({
        where: { id: scheduled.userId },
        data: { roastCount: { increment: 1 }, monthlyRoastsUsed: { increment: 1 } },
      });

      // Update scheduled roast timestamps
      const addDays = scheduled.frequency === 'monthly' ? 30 : 7;
      await prisma.scheduledRoast.update({
        where: { id: scheduled.id },
        data: {
          lastRunAt: now,
          nextRunAt: new Date(now.getTime() + addDays * 24 * 60 * 60 * 1000),
        },
      });

      // Send notification email
      if (scheduled.user.email) {
        sendRoastEmail({
          userEmail: scheduled.user.email,
          userName: scheduled.user.name,
          roastId: roast.id,
          roastUrl: scheduled.url,
          globalScore: roast.globalScore,
          killList: result.killList as Array<{ rank: number; issue: string; why: string }>,
          lang: 'en',
        }).catch(() => {});
      }

      results.push({ url: scheduled.url, roastId: roast.id, score: roast.globalScore });
      console.log(`[Cron] ✓ Roasted ${scheduled.url} — score: ${roast.globalScore}`);
    } catch (err) {
      console.error(`[Cron] Error processing ${scheduled.url}:`, err);
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
