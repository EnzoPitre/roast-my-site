import { Header } from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { translations, Language } from "@/lib/translations";
import { LeaveReviewButton } from "@/components/LeaveReviewButton";
import { DashboardClient } from "@/components/DashboardClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  return {
    title: lang === 'fr' ? 'Tableau de bord — Roast My Site' : 'Dashboard — Roast My Site',
    description: lang === 'fr'
      ? 'Accédez à l\'historique de tous vos audits de sites web.'
      : 'Access all your website audit history.',
    robots: { index: false, follow: false },
  };
}

export default async function Dashboard({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams?: { subscribed?: string };
}) {
  const lang = params.lang as Language;
  const subscribed = searchParams?.subscribed === 'true';

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/');

  const userId = (session.user as any).id;
  const userName = session.user.name?.split(' ')[0] ?? null;

  const [user, roasts, scheduledRoasts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, monthlyRoastsUsed: true },
    }),
    prisma.roast.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        globalScore: true,
        createdAt: true,
        isPaid: true,
        isFollowUp: true,
        previousRoastId: true,
      },
    }),
    prisma.scheduledRoast.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, url: true, frequency: true, nextRunAt: true, lastRunAt: true, active: true },
    }),
  ]);

  const plan = user?.plan ?? 'free';
  const monthlyRoastsUsed = user?.monthlyRoastsUsed ?? 0;

  // Compute stats server-side
  const totalAudits = roasts.length;
  const avgScore =
    totalAudits > 0
      ? Math.round((roasts.reduce((s, r) => s + r.globalScore, 0) / totalAudits) * 10) / 10
      : 0;
  const uniqueSites = new Set(roasts.map(r => r.url)).size;
  const bestScore = totalAudits > 0 ? Math.max(...roasts.map(r => r.globalScore)) : 0;

  const t = translations[lang];

  return (
    <>
      <Header />
      <main className="min-h-screen flex-1 w-full" style={{ background: '#0A0A0F' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* Success toast */}
          {subscribed && (
            <div
              className="rounded-2xl px-5 py-4 text-sm font-bold flex items-center gap-3"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E' }}
            >
              <span className="text-lg">🎉</span>
              {t['plan.subscribed_success']}
            </div>
          )}

          {/* Welcome banner */}
          <div
            className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            style={{ background: 'linear-gradient(135deg, #13131A 0%, #1a1014 100%)', border: '1px solid rgba(249,115,22,0.2)' }}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>
                {userName
                  ? t['dash.welcome'].replace('{name}', userName)
                  : t['dash.welcome.anon']}
              </h1>
              <p className="mt-1 text-sm font-medium" style={{ color: '#64748B' }}>
                {t['dash.subtitle']}
              </p>
            </div>

            {/* Plan badge */}
            {plan === 'pro' ? (
              <div className="flex flex-col gap-2 sm:items-end shrink-0">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black"
                  style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.4)' }}
                >
                  🔥 {t['dash.pro.badge']}
                </span>
                <p className="text-xs font-medium" style={{ color: '#64748B' }}>
                  {t['plan.usage'].replace('{used}', String(monthlyRoastsUsed))}
                </p>
                <div className="w-36 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(249,115,22,0.12)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ background: '#F97316', width: `${Math.min((monthlyRoastsUsed / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(100,116,139,0.1)', color: '#64748B', border: '1px solid rgba(100,116,139,0.2)' }}
                >
                  {t['dash.free.badge']}
                </span>
                <a
                  href={`/${lang}${lang === 'fr' ? '/tarifs' : '/pricing'}`}
                  className="px-4 py-1.5 rounded-full text-xs font-black transition-all"
                  style={{ background: '#F97316', color: '#0A0A0F' }}
                >
                  {t['dash.upgrade_cta']}
                </a>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t['dash.stat.total'], value: totalAudits, suffix: '' },
              { label: t['dash.stat.avg'], value: avgScore, suffix: '/10' },
              { label: t['dash.stat.sites'], value: uniqueSites, suffix: '' },
              { label: t['dash.stat.best'], value: bestScore, suffix: '/10' },
            ].map(({ label, value, suffix }) => (
              <div
                key={label}
                className="rounded-2xl p-5 flex flex-col gap-1"
                style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.12)' }}
              >
                <span className="text-3xl font-black" style={{ color: '#F97316' }}>
                  {value}{suffix}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Main client content: history + scheduled tabs */}
          <DashboardClient
            lang={lang}
            roasts={roasts}
            plan={plan}
            monthlyRoastsUsed={monthlyRoastsUsed}
            scheduledRoasts={scheduledRoasts}
          />

          {/* Leave a review */}
          {roasts.length > 0 && (
            <div
              className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.12)' }}
            >
              <div>
                <p className="text-sm font-black" style={{ color: '#F8FAFC' }}>
                  {lang === 'fr' ? 'Votre avis compte' : 'Your feedback matters'}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: '#64748B' }}>
                  {lang === 'fr'
                    ? "Partagez votre expérience et aidez d'autres fondateurs."
                    : 'Share your experience and help other founders.'}
                </p>
              </div>
              <LeaveReviewButton />
            </div>
          )}

        </div>
      </main>
    </>
  );
}
