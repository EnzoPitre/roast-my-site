'use client';
import { useLanguage } from '@/components/LanguageProvider';

export function PressRow() {
  const { t } = useLanguage();

  const logos = [
    "Product Hunt",
    "Indie Hackers",
    "Hacker News",
    "BetaList",
    "Startup Daily",
    "Y Combinator"
  ];

  return (
    <section className="w-full bg-[#050508] py-16 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-[#64748B] mb-8">
          {t('media.title')}
        </h3>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 items-center flex-1">
          {logos.map((logo, i) => (
            <div key={i} className="text-xl md:text-2xl font-black tracking-tight" style={{ color: '#4B5563' }}>
              {logo.includes(' ') ? (
                <span>
                  <span className="font-bold">{logo.split(' ')[0]}</span>{' '}
                  <span className="font-light">{logo.split(' ')[1]}</span>
                </span>
              ) : (
                logo
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs font-bold text-orange-500/70">
          {t('media.subtitle')}
        </div>
      </div>
    </section>
  );
}
