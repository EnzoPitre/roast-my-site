import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { translations, Language, TranslationKey } from "@/lib/translations";
import Link from 'next/link';
import { Flame } from 'lucide-react';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = `${BASE_URL}/${lang}/hall-of-shame`;
  return {
    title: t['meta.shame.title'],
    description: t['meta.shame.description'],
    keywords: lang === 'fr'
      ? ['pires sites web', 'hall of shame', 'mauvais scores audit site']
      : ['worst websites', 'hall of shame', 'bad website audit scores'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/hall-of-shame`, fr: `${BASE_URL}/fr/hall-of-shame` } },
    openGraph: { title: t['meta.shame.title'], description: t['meta.shame.description'], url: canonical, type: 'website' },
  };
}

interface ShameEntry {
  rank: number;
  url: string;
  globalScore: number;
  summaryExcerpt: string;
  scores: Record<string, number>;
  createdAt: string;
}

async function getHallOfShame(): Promise<{ results: ShameEntry[]; period: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/hall-of-shame`, { next: { revalidate: 3600 } });
    if (!res.ok) return { results: [], period: 'week' };
    return res.json();
  } catch {
    return { results: [], period: 'week' };
  }
}

const scoreColor = (s: number) => s >= 8 ? '#22C55E' : s >= 5 ? '#F97316' : '#EF4444';

export default async function HallOfShame({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;
  const { results, period } = await getHallOfShame();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-24 flex-1 w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="text-center mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            <Flame className="w-3.5 h-3.5" />
            {period === 'month' ? t('shame.period_month') : t('shame.period_week')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gradient-white">{t('shame.title')}</h1>
          <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>{t('shame.subtitle')}</p>
        </div>

        {results.length === 0 ? (
          <div className="glass-card p-14 text-center relative z-10 max-w-lg mx-auto">
            <div className="text-5xl mb-5">🏆</div>
            <p className="mb-6 font-medium" style={{ color: '#94A3B8' }}>{t('shame.empty')}</p>
            <Link href={`/${lang}`} className="btn-orange inline-flex items-center gap-2 cursor-pointer">
              {lang === 'fr' ? 'Soumettre un site →' : 'Submit a site →'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {results.map((entry) => (
              <div
                key={entry.rank}
                className="rounded-[16px] p-6 relative overflow-hidden transition-all hover:border-red-500/40"
                style={{
                  background: '#13131A',
                  border: entry.rank === 1 ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(239,68,68,0.15)',
                  boxShadow: entry.rank === 1 ? '0 0 30px rgba(239,68,68,0.1)' : 'none',
                }}
              >
                {entry.rank === 1 && (
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)', filter: 'blur(30px)', transform: 'translate(20%, -20%)' }} />
                )}

                <div className="flex items-center gap-5 flex-wrap">
                  {/* Rank badge */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full font-black text-sm shrink-0"
                    style={{
                      background: entry.rank === 1 ? '#EF4444' : 'rgba(239,68,68,0.1)',
                      color: entry.rank === 1 ? '#fff' : '#EF4444',
                      border: entry.rank === 1 ? 'none' : '1px solid rgba(239,68,68,0.3)',
                    }}>
                    #{entry.rank}
                  </div>

                  {/* URL */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: '#E2E8F0' }}>{entry.url}</p>
                    {entry.rank === 1 && (
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#EF4444' }}>
                        {t('shame.worst_badge')}
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black" style={{ color: scoreColor(entry.globalScore) }}>{entry.globalScore}</span>
                    <span className="text-sm font-bold" style={{ color: '#64748B' }}>/10</span>
                  </div>
                </div>

                {/* Summary excerpt with blur after 50 chars */}
                {entry.summaryExcerpt && (
                  <div className="mt-4 relative overflow-hidden">
                    <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>
                      {entry.summaryExcerpt.slice(0, 50)}
                      <span className="blur-sm select-none">{entry.summaryExcerpt.slice(50)}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center relative z-10">
          <p className="font-medium mb-4 text-sm" style={{ color: '#64748B' }}>
            {lang === 'fr' ? 'Votre site est-il sur cette liste ?' : 'Is your site on this list?'}
          </p>
          <Link href={`/${lang}`} className="btn-orange inline-flex items-center gap-2 cursor-pointer">
            {lang === 'fr' ? 'Auditer mon site 🔥' : 'Audit my site 🔥'}
          </Link>
        </div>
      </main>
    </>
  );
}
