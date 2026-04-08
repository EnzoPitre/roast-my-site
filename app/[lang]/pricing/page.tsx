import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Check } from "lucide-react";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { SubscribeButton } from "@/components/SubscribeButton";

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = lang === 'fr' ? `${BASE_URL}/fr/tarifs` : `${BASE_URL}/en/pricing`;
  return {
    title: t['meta.pricing.title'],
    description: t['meta.pricing.description'],
    keywords: lang === 'fr'
      ? ['prix audit site web', 'tarif analyse site web IA', 'audit gratuit site']
      : ['website audit pricing', 'ai audit cost', 'roast my site price', 'free website audit'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/pricing`, fr: `${BASE_URL}/fr/tarifs` } },
    openGraph: { title: t['meta.pricing.title'], description: t['meta.pricing.description'], url: canonical, type: 'website' },
  };
}

export default function Pricing({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-24 flex-1 w-full relative overflow-hidden">
        {/* Orb */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gradient-white">{t('pricing.title')}</h1>
          <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>{t('pricing.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">

          {/* Free Tier */}
          <div className="glass-card p-8 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#F8FAFC' }}>{t('pricing.free.name')}</h3>
            <div className="mb-5">
              <span className="text-4xl font-black" style={{ color: '#F8FAFC' }}>€0</span>
            </div>
            <p className="mb-8 font-medium text-sm" style={{ color: '#94A3B8' }}>{t('pricing.free.desc')}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#22C55E' }} /> {t('pricing.free.feat1')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#22C55E' }} /> {t('pricing.free.feat2')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#22C55E' }} /> {t('pricing.free.feat3')}
              </li>
            </ul>
          </div>

          {/* Pay-as-you-go Tier */}
          <div className="glass-card p-8 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#F8FAFC' }}>{t('pricing.paid.name')}</h3>
            <div className="mb-5">
              <span className="text-4xl font-black" style={{ color: '#F8FAFC' }}>€4.90</span>
              <span className="font-medium ml-2 text-sm" style={{ color: '#64748B' }}>{t('pricing.paid.per')}</span>
            </div>
            <p className="mb-8 font-medium text-sm" style={{ color: '#94A3B8' }}>{t('pricing.paid.desc')}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.paid.feat1')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.paid.feat2')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.paid.feat3')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.paid.feat4')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.paid.feat5')}
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="rounded-[16px] p-8 relative overflow-hidden" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.5)', boxShadow: '0 0 40px rgba(249,115,22,0.15)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.2), transparent 70%)', filter: 'blur(40px)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute top-3 right-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.35)' }}>
              {t('pricing.pro.badge')}
            </div>

            <h3 className="text-xl font-bold mb-2 relative z-10" style={{ color: '#F8FAFC' }}>{t('pricing.pro.name')}</h3>
            <div className="mb-5 relative z-10">
              <span className="text-4xl font-black text-gradient-orange">€14.90</span>
              <span className="font-medium ml-2 text-sm" style={{ color: '#64748B' }}>{t('pricing.pro.per')}</span>
            </div>
            <p className="mb-6 font-medium text-sm relative z-10" style={{ color: '#94A3B8' }}>{t('pricing.pro.desc')}</p>
            <ul className="space-y-3 relative z-10 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.pro.feat1')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.pro.feat2')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.pro.feat3')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.pro.feat4')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.pro.feat5')}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium" style={{ color: '#E2E8F0' }}>
                <Check className="w-4 h-4 shrink-0" style={{ color: '#F97316' }} /> {t('pricing.pro.feat6')}
              </li>
            </ul>
            <div className="relative z-10">
              <SubscribeButton />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
