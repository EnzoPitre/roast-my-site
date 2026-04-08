import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function anonymizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    let hostname = parsed.hostname; // e.g. "www.example.fr"
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      // Keep first 3 chars of main domain name, mask middle, keep extension
      const tld = parts[parts.length - 1];
      const sld = parts[parts.length - 2];
      const subdomain = parts.length > 2 ? parts.slice(0, parts.length - 2).join('.') + '.' : '';
      const visible = sld.slice(0, 3);
      const masked = '*'.repeat(Math.max(sld.length - 3, 3));
      hostname = `${subdomain}${visible}${masked}.${tld}`;
    }
    return hostname;
  } catch {
    return url.slice(0, 10) + '***';
  }
}

export async function GET() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Try last 7 days first
    let roasts = await prisma.roast.findMany({
      where: {
        isPaid: true,
        globalScore: { lte: 4 },
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { globalScore: 'asc' },
      take: 10,
      select: {
        url: true,
        globalScore: true,
        summary: true,
        scores: true,
        createdAt: true,
      },
    });

    let period = 'week';

    // Fall back to 30 days if fewer than 5
    if (roasts.length < 5) {
      roasts = await prisma.roast.findMany({
        where: {
          isPaid: true,
          globalScore: { lte: 4 },
          createdAt: { gte: thirtyDaysAgo },
        },
        orderBy: { globalScore: 'asc' },
        take: 10,
        select: {
          url: true,
          globalScore: true,
          summary: true,
          scores: true,
          createdAt: true,
        },
      });
      period = 'month';
    }

    const results = roasts.map((r, index) => ({
      rank: index + 1,
      url: anonymizeUrl(r.url),
      globalScore: r.globalScore,
      summaryExcerpt: r.summary.slice(0, 100),
      scores: r.scores,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ results, period, count: results.length });
  } catch (error) {
    console.error('Hall of Shame Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
