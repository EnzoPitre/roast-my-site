import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/Header";
import { RoastCard } from "@/components/RoastCard";
import { RoastBody } from "@/components/RoastBody";
import { RefreshOnSuccess } from "@/components/RefreshOnSuccess";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { Suspense } from "react";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { Metadata } from 'next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  };
}

function ScoreDelta({ current, previous, label }: { current: number; previous: number; label: string }) {
  const delta = current - previous;
  const color = delta > 0 ? '#22C55E' : delta < 0 ? '#EF4444' : '#64748B';
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  return (
    <div className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
      <span className="text-sm font-medium" style={{ color: '#94A3B8' }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold" style={{ color: '#64748B' }}>{previous}/10</span>
        <span style={{ color: '#64748B' }}>→</span>
        <span className="text-sm font-bold" style={{ color: '#E2E8F0' }}>{current}/10</span>
        <div className="flex items-center gap-1 text-xs font-black" style={{ color }}>
          <Icon className="w-3.5 h-3.5" />
          {delta > 0 ? `+${delta}` : delta}
        </div>
      </div>
    </div>
  );
}

export default async function RoastPage({ params }: { params: { id: string; lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  const session = await getServerSession(authOptions);

  const roast = await prisma.roast.findUnique({ where: { id: params.id } });
  if (!roast) notFound();

  // Fetch previous roast if this is a follow-up
  let previousRoast: typeof roast | null = null;
  if (roast.isFollowUp && roast.previousRoastId) {
    previousRoast = await prisma.roast.findUnique({ where: { id: roast.previousRoastId } });
  }

  const showPaywall = !roast.isPaid;

  const dimensionLabels: Record<string, string> = {
    firstImpression: lang === 'fr' ? 'Première Impression' : 'First Impression',
    visualDesign: lang === 'fr' ? 'Design Visuel' : 'Visual Design',
    copywriting: 'Copywriting',
    trust: lang === 'fr' ? 'Confiance' : 'Trust',
    ux: 'UX',
    mobile: 'Mobile',
    conversion: 'Conversion',
  };

  return (
    <>
      <ReadingProgressBar />
      <Suspense fallback={null}><RefreshOnSuccess /></Suspense>
      <Header />
      <main className="min-h-screen pt-16 px-4 sm:px-6 relative pb-32">
        {/* Progression section — only for follow-up roasts */}
        {previousRoast && (
          <div className="max-w-4xl mx-auto mb-8 rounded-[16px] p-6" style={{ background: '#13131A', border: '1px solid rgba(34,197,94,0.3)' }}>
            <h2 className="text-lg font-black mb-5 flex items-center gap-2" style={{ color: '#F8FAFC' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#22C55E' }} />
              📈 {t('followup.progress_title')}
            </h2>

            {/* Global score comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-[12px] text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(249,115,22,0.1)' }}>
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>
                  {t('followup.previous_score')}
                </p>
                <p className="text-3xl font-black" style={{ color: previousRoast.globalScore >= 5 ? '#F97316' : '#EF4444' }}>
                  {previousRoast.globalScore}/10
                </p>
                <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                  {new Date(previousRoast.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                </p>
              </div>
              <div className="p-4 rounded-[12px] text-center" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>
                  {t('followup.current_score')}
                </p>
                <p className="text-3xl font-black" style={{ color: roast.globalScore >= 5 ? '#22C55E' : '#EF4444' }}>
                  {roast.globalScore}/10
                </p>
                <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                  {new Date(roast.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                </p>
              </div>
            </div>

            {/* Per-dimension comparison */}
            {previousRoast.scores && roast.scores && (
              <div className="space-y-0">
                {Object.entries(roast.scores as Record<string, { score: number }>).map(([key, val]) => {
                  const prevScores = previousRoast!.scores as Record<string, { score: number }>;
                  const prevScore = prevScores[key]?.score ?? 0;
                  const currScore = val.score;
                  if (currScore === prevScore) return null;
                  return (
                    <ScoreDelta
                      key={key}
                      current={currScore}
                      previous={prevScore}
                      label={dimensionLabels[key] ?? key}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        <RoastCard roast={roast}>
          <RoastBody roast={roast} lang={lang} showPaywall={showPaywall} />
        </RoastCard>
      </main>
    </>
  );
}
