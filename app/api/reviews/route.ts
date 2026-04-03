import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_SECTORS = ['ecommerce', 'saas', 'freelance', 'agency', 'local', 'other'];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sector = searchParams.get('sector');

  const where: { approved: boolean; sector?: string } = { approved: true };
  if (sector && sector !== 'all' && VALID_SECTORS.includes(sector)) {
    where.sector = sector;
  }

  const [reviews, total, aggResult] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, role: true, company: true, sector: true, rating: true, comment: true, createdAt: true },
    }),
    prisma.review.count({ where: { approved: true } }),
    prisma.review.aggregate({ where: { approved: true }, _avg: { rating: true } }),
  ]);

  return NextResponse.json({
    reviews,
    count: total,
    average: aggResult._avg.rating ? Number(aggResult._avg.rating.toFixed(1)) : null,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const { rating, comment, name, role, company, sector } = body;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }
  if (!comment || comment.trim().length < 50) {
    return NextResponse.json({ error: 'Comment must be at least 50 characters' }, { status: 400 });
  }
  if (!name?.trim() || !role?.trim() || !sector) {
    return NextResponse.json({ error: 'Name, role, and sector are required' }, { status: 400 });
  }
  if (!VALID_SECTORS.includes(sector)) {
    return NextResponse.json({ error: 'Invalid sector' }, { status: 400 });
  }

  const existing = await prisma.review.findUnique({ where: { userId } });
  if (existing) {
    return NextResponse.json({ error: 'already_reviewed' }, { status: 409 });
  }

  // TODO: set approved: false and add admin panel later
  const review = await prisma.review.create({
    data: {
      userId,
      rating: Number(rating),
      comment: comment.trim(),
      name: name.trim(),
      role: role.trim(),
      company: company?.trim() || null,
      sector,
      approved: true,
    },
  });

  return NextResponse.json({ success: true, reviewId: review.id });
}
