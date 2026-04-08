import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function csvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const roasts = await prisma.roast.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        url: true,
        createdAt: true,
        globalScore: true,
        scores: true,
        summary: true,
        topOpportunity: true,
        conversionEstimate: true,
        isPaid: true,
      }
    });

    const headers = [
      'URL', 'Date', 'Score Global',
      'First Impression', 'Visual Design', 'Copywriting', 'Trust', 'UX', 'Mobile', 'Conversion',
      'Summary', 'Top Opportunity', 'Conversion Estimate', 'isPaid'
    ];

    const rows = roasts.map(r => {
      const scores = r.scores as Record<string, { score: number }> | null;
      return [
        csvCell(r.url),
        csvCell(formatDate(r.createdAt)),
        csvCell(r.globalScore),
        csvCell(scores?.firstImpression?.score ?? ''),
        csvCell(scores?.visualDesign?.score ?? ''),
        csvCell(scores?.copywriting?.score ?? ''),
        csvCell(scores?.trust?.score ?? ''),
        csvCell(scores?.ux?.score ?? ''),
        csvCell(scores?.mobile?.score ?? ''),
        csvCell(scores?.conversion?.score ?? ''),
        csvCell(r.summary),
        csvCell(r.topOpportunity ?? ''),
        csvCell(r.conversionEstimate ?? ''),
        csvCell(r.isPaid),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="roasts-export.csv"',
      },
    });
  } catch (error) {
    console.error('CSV Export Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
