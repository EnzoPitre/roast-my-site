import { Header } from "@/components/Header";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { routeMap } from "@/lib/i18n";

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<import('next').Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const title = lang === 'fr' ? 'À propos | Roast My Site' : 'About | Roast My Site';
  return {
    title,
    description: t['meta.about.description'],
    alternates: { canonical: `${BASE_URL}/${lang}/about` },
    openGraph: { title, description: t['meta.about.description'], url: `${BASE_URL}/${lang}/about` },
  };
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  const roastCount = await prisma.roast.count().catch(() => 247);

  const values = [
    { key: 'honesty' as const, icon: '🔥' },
    { key: 'speed' as const, icon: '⚡' },
    { key: 'action' as const, icon: '🎯' },
  ];

  const timeline = [
    { date: lang === 'fr' ? 'Janvier 2026' : 'January 2026', desc: t('about.timeline.jan'), color: '#64748B' },
    { date: lang === 'fr' ? 'Février 2026' : 'February 2026', desc: t('about.timeline.feb'), color: '#F97316' },
    { date: lang === 'fr' ? 'Mars 2026' : 'March 2026', desc: t('about.timeline.mar'), color: '#22C55E' },
  ];

  const stack = [
    { name: 'Next.js 14', icon: '▲', desc: lang === 'fr' ? 'App Router, SSR' : 'App Router, SSR' },
    { name: 'Claude AI', icon: '🤖', desc: lang === 'fr' ? 'Anthropic Claude Sonnet' : 'Anthropic Claude Sonnet' },
    { name: 'Stripe', icon: '💳', desc: lang === 'fr' ? 'Paiements sécurisés' : 'Secure payments' },
    { name: 'PostgreSQL', icon: '🐘', desc: lang === 'fr' ? 'Via Prisma ORM' : 'Via Prisma ORM' },
  ];

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-24 flex-1 w-full">

        {/* Hero */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6" style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
            {t('about.bordeaux')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6" style={{ color: '#F8FAFC', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
            {t('about.title')}
          </h1>
        </div>

        {/* Avatar + Story */}
        <div className="glass-card p-8 sm:p-12 mb-12 flex flex-col sm:flex-row gap-8 items-start" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
          {/* Founder photo */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <Image
              src="/founder.jpg"
              alt="Enzo Pitre — Founder"
              width={120}
              height={120}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #F97316',
              }}
            />
            <div className="text-center">
              <p className="text-sm font-black" style={{ color: '#F8FAFC' }}>Enzo P.</p>
              <p className="text-xs font-medium" style={{ color: '#64748B' }}>Founder</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black mb-4 tracking-tight" style={{ color: '#F97316' }}>{t('about.story.title')}</h2>
            <p className="text-base leading-relaxed font-medium" style={{ color: '#CBD5E1' }}>
              {t('about.intro')}
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-12 p-8 rounded-[20px] text-center" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,88,12,0.04))', border: '1px solid rgba(249,115,22,0.2)' }}>
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-black mb-4 tracking-tight" style={{ color: '#F8FAFC' }}>{t('about.mission.title')}</h2>
          <p className="text-lg font-medium italic" style={{ color: '#CBD5E1', maxWidth: '60ch', margin: '0 auto' }}>
            &ldquo;{t('about.mission.body')}&rdquo;
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-6 rounded-[16px] text-center" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="text-4xl font-black mb-1" style={{ color: '#F97316' }}>{roastCount}+</div>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#64748B' }}>{t('about.stats.roasts')}</div>
          </div>
          <div className="p-6 rounded-[16px] text-center" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="text-4xl font-black mb-1" style={{ color: '#22C55E' }}>30s</div>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#64748B' }}>{lang === 'fr' ? 'Temps d\'analyse' : 'Analysis Time'}</div>
          </div>
          <div className="p-6 rounded-[16px] text-center" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="text-4xl font-black mb-1" style={{ color: '#8B5CF6' }}>7</div>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#64748B' }}>{lang === 'fr' ? 'Dimensions auditées' : 'Audit Dimensions'}</div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-6 tracking-tight" style={{ color: '#F8FAFC' }}>{t('about.values.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {values.map(v => (
              <div key={v.key} className="p-6 rounded-[16px]" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.15)' }}>
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-black text-base mb-2" style={{ color: '#F8FAFC' }}>
                  {t(`about.values.${v.key}` as TranslationKey)}
                </h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: '#94A3B8' }}>
                  {t(`about.values.${v.key}.desc` as TranslationKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-8 tracking-tight" style={{ color: '#F8FAFC' }}>{t('about.timeline.title')}</h2>
          <div className="relative pl-6" style={{ borderLeft: '2px solid rgba(249,115,22,0.2)' }}>
            {timeline.map((item, i) => (
              <div key={i} className="relative mb-8 last:mb-0 pl-6">
                <div className="absolute -left-[calc(1.5rem+1px)] top-1 w-3 h-3 rounded-full" style={{ background: item.color, border: '2px solid #0A0A0F', boxShadow: `0 0 8px ${item.color}60` }} />
                <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: item.color }}>{item.date}</div>
                <div className="text-sm font-medium" style={{ color: '#CBD5E1' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-2 tracking-tight" style={{ color: '#F8FAFC' }}>{t('about.tech.title')}</h2>
          <p className="text-sm font-medium mb-6" style={{ color: '#64748B' }}>{t('about.tech.body')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stack.map(s => (
              <div key={s.name} className="p-4 rounded-[12px] text-center" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.12)' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-sm font-black" style={{ color: '#F8FAFC' }}>{s.name}</div>
                <div className="text-[10px] font-medium mt-1" style={{ color: '#64748B' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-10 rounded-[20px]" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <h3 className="text-2xl font-black mb-4 tracking-tight" style={{ color: '#F8FAFC' }}>
            {lang === 'fr' ? 'Prêt à voir la vérité sur votre site ?' : 'Ready to see the truth about your site?'}
          </h3>
          <Link href={`/${lang}${routeMap.home[lang]}`} className="btn-orange inline-block">
            {t('about.cta')}
          </Link>
        </div>

        {/* Newsletter */}
        <div className="mt-16">
          <NewsletterSignup lang={lang} />
        </div>

      </main>
    </>
  );
}
