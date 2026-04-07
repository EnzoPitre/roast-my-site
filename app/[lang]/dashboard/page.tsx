import { Header } from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Lock, Flame } from "lucide-react";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { LeaveReviewButton } from "@/components/LeaveReviewButton";
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

export default async function Dashboard({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/');

  const userId = (session.user as any).id;
  const roasts = await prisma.roast.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, url: true, globalScore: true, createdAt: true, isPaid: true }
  });

  const scoreColor = (s: number) => s >= 8 ? '#22C55E' : s >= 5 ? '#F97316' : '#EF4444';

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-24 flex-1 w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[50%] rounded-full pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="flex items-center gap-3 mb-10 relative z-10">
          <div className="p-2 rounded-xl" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
            <Flame className="w-5 h-5" style={{ color: '#F97316' }} />
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>{t('dash.title')}</h1>
        </div>

        {roasts.length === 0 ? (
          <div className="glass-card p-14 text-center relative z-10 max-w-lg mx-auto">
            <div className="text-5xl mb-5">🔥</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#F8FAFC' }}>{t('dash.empty.title')}</h3>
            <p className="mb-8 font-medium" style={{ color: '#94A3B8' }}>{t('dash.empty.desc')}</p>
            <Link href={`/${lang}`} className="btn-orange inline-flex items-center gap-2 cursor-pointer">
              {t('dash.empty.cta')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="rounded-[16px] overflow-hidden relative z-10" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(249,115,22,0.12)' }}>
                  <tr>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-left text-xs" style={{ color: '#64748B' }}>{t('dash.table.url')}</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-left text-xs" style={{ color: '#64748B' }}>{t('dash.table.date')}</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-left text-xs" style={{ color: '#64748B' }}>{t('dash.table.score')}</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-left text-xs" style={{ color: '#64748B' }}>{t('dash.table.status')}</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-right text-xs" style={{ color: '#64748B' }}>{t('dash.table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {roasts.map((r, idx) => (
                    <tr key={r.id} className="transition-colors whitespace-nowrap hover:bg-[#F97316]/[0.04]" style={{ borderTop: idx > 0 ? '1px solid rgba(249,115,22,0.06)' : 'none' }}>
                      <td className="px-6 py-4 font-semibold truncate max-w-[200px]" style={{ color: '#E2E8F0' }} title={r.url}>{r.url}</td>
                      <td className="px-6 py-4 text-xs" style={{ color: '#64748B' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="font-black text-base" style={{ color: scoreColor(r.globalScore) }}>{r.globalScore}/10</span>
                      </td>
                      <td className="px-6 py-4">
                        {r.isPaid ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
                            {t('dash.table.unlocked')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(249,115,22,0.08)', color: '#94A3B8', border: '1px solid rgba(249,115,22,0.15)' }}>
                            <Lock className="w-2.5 h-2.5" /> {t('dash.table.locked')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/${lang}/roast/${r.id}`} className="text-xs font-bold transition-colors flex items-center gap-1 justify-end text-[#F97316] hover:text-[#EA580C]">
                          {t('dash.table.view')} <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
