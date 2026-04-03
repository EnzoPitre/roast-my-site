'use client';
import { useLanguage } from '@/components/LanguageProvider';
import { TranslationKey } from '@/lib/translations';
import { RevealWrapper } from '@/components/ScrollObserver';

export function Testimonials() {
  const { t } = useLanguage();

  const numMap = [1, 2, 3, 4, 5, 6];
  const colors = ['#F97316', '#EA580C', '#FB923C', '#C2410C', '#9A3412', '#F97316'];

  return (
    <section className="max-w-6xl mx-auto py-24 px-6 section-divider">
      <RevealWrapper animation="reveal-up">
        <h2 className="text-center text-3xl md:text-5xl font-black tracking-tight mb-16 text-[#F8FAFC]">
          {t('testi.title')}
        </h2>
      </RevealWrapper>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {numMap.map((id, index) => {
          const color = colors[index % colors.length];
          const initials = (t(`testi.${id}.name` as TranslationKey) as string)
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

          return (
            <RevealWrapper key={id} animation="reveal-up" delayClass={`stagger-${(index % 3) + 1}`}>
              <div className="glass-card p-8 flex flex-col h-full hover:border-orange-500/30 group">
                <div className="flex gap-0.5 mb-2 text-orange-500 text-lg">
                  {'★'.repeat(5)}
                </div>
                <div className="text-[10px] uppercase font-black tracking-widest text-[#34D399] mb-5">
                  ✓ {t('testi.verified')}
                </div>
                
                <p className="font-medium text-[15px] leading-relaxed mb-8 flex-1 text-[#CBD5E1]">
                  &quot;{t(`testi.${id}.quote` as TranslationKey)}&quot;
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-sm font-black shadow-inner" style={{ background: `${color}20`, border: `1px solid ${color}50`, color: color }}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#F8FAFC] truncate">
                      {t(`testi.${id}.name` as TranslationKey)}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider mt-1 text-[#64748B] flex flex-col sm:flex-row gap-1">
                      <span className="truncate">{t(`testi.${id}.role` as TranslationKey)}</span>
                      {t(`testi.${id}.company` as TranslationKey) ? (
                        <span className="hidden sm:inline-block truncate">
                          @ {t(`testi.${id}.company` as TranslationKey)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </RevealWrapper>
          );
        })}
      </div>
    </section>
  );
}
