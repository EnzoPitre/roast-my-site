import { Header } from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Flame } from "lucide-react";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { LeaveReviewButton } from "@/components/LeaveReviewButton";
import { DashboardClient } from "@/components/DashboardClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  return {
    title: lang === 'fr' ? 'Tableau de bord — Roast My Site' : 'Dashboard — Roast My Site',
    description: lang === 'fr'
      ? 'Accédez à l\'historique de tous vos audits de sites web et débloquez vos rapports complets.'
      : 'Access all your website audit history and unlock your full AI-powered reports.',
    robots: { index: false, follow: false },
  };
}

export default async function Dashboard({ params, searchParams }: { params: { lang: string }; searchParams?: { subscribed?: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;
  const subscribed = searchParams?.subscribed === 'true';

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/');

  const userId = (session.user as any).id;

  const [user, roasts, scheduledRoasts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { plan: true, monthlyRoastsUsed: true } }),
    prisma.roast.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, url: true, globalScore: true, createdAt: true, isPaid: true, isFollowUp: true, previousRoastId: true }
    }),
    prisma.scheduledRoast.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, url: true, frequency: true, nextRunAt: true, lastRunAt: true, active: true }
    }),
  ]);

  const plan = user?.plan ?? 'free';
  const monthlyRoastsUsed = user?.monthlyRoastsUsed ?? 0;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-24 flex-1 w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[50%] rounded-full pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 rounded-xl" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
            <Flame className="w-5 h-5" style={{ color: '#F97316' }} />
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>{t('dash.title')}</h1>
        </div>

        {subscribed && (
          <div className="mb-6 relative z-10 p-4 rounded-[12px] text-sm font-bold" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
            {t('plan.subscribed_success')}
          </div>
        )}

        <DashboardClient
          lang={lang}
          roasts={roasts}
          plan={plan}
          monthlyRoastsUsed={monthlyRoastsUsed}
          scheduledRoasts={scheduledRoasts}
          subscribed={subscribed}
        />

        {/* Leave a Review — only after at least 1 roast */}
        {roasts.length > 0 && (
          <div className="mt-10 relative z-10 flex items-center gap-4 p-6 rounded-[16px]"
            style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="flex-1">
              <p className="font-black text-sm" style={{ color: '#F8FAFC' }}>
                {lang === 'fr' ? 'Votre avis compte' : 'Your feedback matters'}
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#64748B' }}>
                {lang === 'fr'
                  ? 'Partagez votre expérience et aidez d\'autres fondateurs.'
                  : 'Share your experience and help other founders.'}
              </p>
            </div>
            <LeaveReviewButton />
          </div>
        )}
      </main>
    </>
  );
}
