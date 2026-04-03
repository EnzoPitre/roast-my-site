import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/Header";
import { RoastCard } from "@/components/RoastCard";
import { ScoreTable } from "@/components/ScoreTable";
import { FixPlan } from "@/components/FixPlan";
import { Paywall } from "@/components/Paywall";
import { RefreshOnSuccess } from "@/components/RefreshOnSuccess";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { Suspense } from "react";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { Metadata } from 'next';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { id: string; lang: string } }): Promise<Metadata> {
  const roast = await prisma.roast.findUnique({ where: { id: params.id }, select: { url: true, globalScore: true, summary: true } });
  if (!roast) return {};
  const lang = params.lang as Language;
  const title = lang === 'fr'
    ? `Audit de ${roast.url} — ${roast.globalScore}/10 | Roast My Site`
    : `Roast of ${roast.url} — Score ${roast.globalScore}/10 | Roast My Site`;
  const description = roast.summary.slice(0, 155) + (roast.summary.length > 155 ? '…' : '');
  const ogUrl = `${BASE_URL}/og?score=${roast.globalScore}&url=${encodeURIComponent(roast.url)}&lang=${lang}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  };
}

export default async function RoastPage({ params }: { params: { id: string; lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  const session = await getServerSession(authOptions);

  const roast = await prisma.roast.findUnique({ where: { id: params.id } });
  if (!roast) notFound();

  const isOwner = session?.user && (session.user as any).id === roast.userId;
  const showPaywall = !roast.isPaid;

  if (showPaywall && !isOwner) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>🔒</div>
          <h1 className="text-3xl font-black mb-4 tracking-tight" style={{ color: '#F8FAFC' }}>{t('roast.private.title')}</h1>
          <p className="max-w-md text-base font-medium" style={{ color: '#94A3B8' }}>{t('roast.private.desc')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ReadingProgressBar />
      <Suspense fallback={null}><RefreshOnSuccess /></Suspense>
      <Header />
      <main className="min-h-screen pt-16 px-4 sm:px-6 relative pb-32">
        <RoastCard roast={roast}>
          {showPaywall && <Paywall roastId={roast.id} />}

          <div className={`transition-all duration-1000 ${showPaywall ? 'blur-md select-none pointer-events-none opacity-30' : ''}`}>

            {/* Kill List */}
            <div className="mt-8 pt-10" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
              <h3 className="font-black mb-2 text-2xl tracking-tight" style={{ color: '#F8FAFC' }}>{t('roast.kill_list.title')}</h3>
              <p className="mb-8 font-medium" style={{ color: '#94A3B8' }}>{t('roast.kill_list.desc')}</p>
              <div className="grid gap-5 sm:grid-cols-3 mb-16">
                {/* @ts-ignore JSON safe */}
                {(roast.killList as any[])?.map((issue, idx) => (
                  <div key={idx} className="rounded-[16px] p-6 relative overflow-hidden cursor-default group hover:border-[#F97316]/[0.4] transition-colors" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <span className="absolute -right-4 -bottom-6 font-black pointer-events-none leading-none select-none" style={{ fontSize: '120px', color: 'rgba(249,115,22,0.05)' }}>
                      {issue.rank}
                    </span>
                    <h4 className="font-black mb-2 text-base leading-tight relative z-10" style={{ color: '#F8FAFC' }}>{issue.issue}</h4>
                    <p className="text-sm relative z-10 leading-relaxed font-medium" style={{ color: '#94A3B8' }}>{issue.why}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimension Breakdown */}
            <div className="mb-14">
              <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3" style={{ color: '#F8FAFC' }}>
                <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>1</span>
                {t('roast.dim_breakdown')}
              </h2>
              {/* @ts-ignore JSON safe */}
              <ScoreTable scores={roast.scores} />
            </div>

            {/* Fix Plan */}
            <div className="mb-14">
              <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3" style={{ color: '#F8FAFC' }}>
                <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>2</span>
                {t('roast.fix_plan')}
              </h2>
              {/* @ts-ignore JSON safe */}
              <FixPlan plan={roast.fixPlan} />
            </div>

            {/* Encouragement */}
            <div className="mt-4 rounded-[16px] p-8 sm:p-10" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <h3 className="font-black mb-3 text-xs uppercase tracking-widest flex items-center gap-2" style={{ color: '#F97316' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#F97316' }} /> {t('roast.encouragement')}
              </h3>
              <p className="font-medium text-lg leading-relaxed italic" style={{ color: '#CBD5E1' }}>&ldquo;{roast.encouragement}&rdquo;</p>
            </div>

          </div>
        </RoastCard>
      </main>
    </>
  );
}
