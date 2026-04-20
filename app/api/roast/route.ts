import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

interface RoastResult {
  globalScore: number
  summary: string
  killList: unknown
  fixPlan: unknown
  scores: unknown
  encouragement: string
  competitorComparison?: string
  conversionEstimate?: string
  topOpportunity?: string
  quickWins?: unknown
}
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { rateLimiter } from '@/lib/rate-limit';
import { generateRoast } from '@/lib/claude';
import { prisma } from '@/lib/prisma';
import { sendRoastEmail } from '@/lib/email';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting based on IP
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const isAllowed = await rateLimiter.check(ip);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again in an hour.' }, { status: 429 });
    }

    // 2. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // 3. Input validation
    const { url, lang = 'en', manualHtml, isFollowUp, previousRoastId } = await req.json();
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'invalid_url', errorCode: 'invalid_url' }, { status: 400 });
    }

    // 4. Check user & plan
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: session.user.email || '',
          name: session.user.name || ''
        }
      });
    }

    // 5. Determine access rights
    let isPaid = false;

    if (user.plan === 'pro') {
      // Pro user: check monthly limit
      if (user.monthlyRoastsUsed >= 10) {
        const resetDate = user.monthlyRoastsReset
          ? new Date(user.monthlyRoastsReset.getTime() + 30 * 24 * 60 * 60 * 1000)
          : new Date();
        const formattedDate = resetDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB');
        return NextResponse.json(
          { error: 'monthly_limit_reached', resetDate: formattedDate },
          { status: 403 }
        );
      }
      isPaid = true; // Pro roasts are always fully unlocked
    }
    // Free users: all roasts start locked; user pays €4.90 to unlock

    // 6. Fetch the target URL with a 10s timeout (skip if manual HTML provided)
    let html = '';
    if (manualHtml && typeof manualHtml === 'string' && manualHtml.trim().length > 100) {
      html = manualHtml;
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 RoastBot/1.0',
          }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const status = response.status;
          const errorCode = (status === 403 || status === 429 || status === 503) ? 'bot_blocked' : 'unreachable';
          return NextResponse.json({ error: errorCode, errorCode }, { status: 400 });
        }
        html = await response.text();
      } catch (e: any) {
        const isTimeout = e?.name === 'AbortError';
        const errorCode = isTimeout ? 'timeout' : 'unreachable';
        return NextResponse.json({ error: errorCode, errorCode }, { status: 400 });
      }
    }

    // 7. Parse with Cheerio
    const $ = cheerio.load(html);

    // Clean up unnecessary tags to reduce tokens
    $('script, style, noscript, svg, img, iframe, header, footer').remove();

    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';

    // Extract visible text, normalize whitespace, cap at 3000 chars
    let visibleText = $('body').text();
    visibleText = visibleText.replace(/\s+/g, ' ').trim().slice(0, 3000);

    const websiteData = `
URL: ${url}${manualHtml ? '\n[NOTE: Analyzing manually provided HTML — site blocked automated fetch]' : ''}
Title: ${title}
Description: ${description}
OgImage: ${ogImage}
---
VISIBLE TEXT (sample):
${visibleText}
    `.trim();

    // 8. Generate roast with Claude
    const result = (await generateRoast(websiteData)) as RoastResult;

    // 9. Save to Database
    const roast = await prisma.roast.create({
      data: {
        userId,
        url,
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
        isPaid,
        isFollowUp: isFollowUp === true,
        previousRoastId: isFollowUp && previousRoastId ? previousRoastId : null,
      }
    });

    // 10. Update user counters
    if (user.plan === 'pro') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          roastCount: { increment: 1 },
          monthlyRoastsUsed: { increment: 1 },
        }
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { roastCount: { increment: 1 } }
      });
    }

    // Fire-and-forget email — never awaited, never blocks the response
    const userEmail = session.user?.email;
    if (userEmail) {
      sendRoastEmail({
        userEmail,
        userName: session.user?.name,
        roastId: roast.id,
        roastUrl: url,
        globalScore: roast.globalScore,
        killList: result.killList as Array<{ rank: number; issue: string; why: string }>,
        lang: (lang === 'fr' ? 'fr' : 'en'),
      }).catch(() => {});
    }

    return NextResponse.json({
      roastId: roast.id,
      globalScore: roast.globalScore,
      url: roast.url,
      scores: roast.scores,
      killList: roast.killList,
      summary: roast.summary,
    });
  } catch (error: any) {
    console.error('Roast Engine Error:', error);
    if (error.message === 'Service temporarily unavailable') {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
