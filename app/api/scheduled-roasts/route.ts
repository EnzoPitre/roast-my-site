import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function nextRunAt(frequency: string): Date {
  const now = new Date();
  if (frequency === 'monthly') {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const items = await prisma.scheduledRoast.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Pro only
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (user?.plan !== 'pro') {
      return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
    }

    const { url, frequency } = await req.json();
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
    if (!['weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    const item = await prisma.scheduledRoast.create({
      data: {
        userId,
        url,
        frequency,
        nextRunAt: nextRunAt(frequency),
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { id, active } = await req.json();

    const item = await prisma.scheduledRoast.findFirst({ where: { id, userId } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.scheduledRoast.update({
      where: { id },
      data: { active },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const item = await prisma.scheduledRoast.findFirst({ where: { id, userId } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.scheduledRoast.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
