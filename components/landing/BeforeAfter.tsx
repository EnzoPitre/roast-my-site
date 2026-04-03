'use client';
import { useLanguage } from '@/components/LanguageProvider';
import { TranslationKey } from '@/lib/translations';
import { RevealWrapper } from '@/components/ScrollObserver';
import { ArrowRight, XCircle, CheckCircle } from 'lucide-react';

export function BeforeAfter() {
  const { t } = useLanguage();

  const beforePoints = [1, 2, 3, 4, 5];
  const afterPoints = [1, 2, 3, 4, 5];

  return (
    <section className="max-w-6xl mx-auto py-24 px-6 section-divider overflow-hidden">
      <RevealWrapper animation="reveal-up">
        <h2 className="text-center text-3xl md:text-5xl font-black tracking-tight mb-16 text-[#F8FAFC]">
          {t('ba.title')}
        </h2>
      </RevealWrapper>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
        
        {/* BEFORE CARD */}
        <RevealWrapper animation="reveal-left" className="w-full lg:w-[45%]">
          <div className="glass-card p-8 border-red-500/20 hover:border-red-500/40" style={{ background: 'linear-gradient(to bottom right, rgba(239, 68, 68, 0.03), rgba(10, 10, 15, 0))' }}>
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xl font-black text-[#F8FAFC]">Before Roast</h3>
              <div className="px-3 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-lg">
                3/10
              </div>
            </div>
            <ul className="space-y-4">
              {beforePoints.map(p => (
                <li key={p} className="flex items-start gap-3 text-[#94A3B8] font-medium">
                  <XCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5 opacity-80" />
                  <span>{t(`ba.before.${p}` as TranslationKey)}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealWrapper>

        {/* ARROW */}
        <RevealWrapper animation="reveal-up" delayClass="stagger-1 text-[#64748B] hidden lg:block">
          <ArrowRight className="w-10 h-10 opacity-50 block" />
        </RevealWrapper>

        {/* AFTER CARD */}
        <RevealWrapper animation="reveal-right" className="w-full lg:w-[45%]">
          <div className="glass-card p-8 border-emerald-500/20 hover:border-emerald-500/40" style={{ background: 'linear-gradient(to bottom right, rgba(52, 211, 153, 0.03), rgba(249, 115, 22, 0.03))' }}>
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xl font-black text-[#F8FAFC]">After Fix Plan</h3>
              <div className="px-3 py-1 rounded bg-orange-500/10 border border-orange-500/40 text-orange-500 font-bold text-lg">
                8/10
              </div>
            </div>
            <ul className="space-y-4">
              {afterPoints.map(p => (
                <li key={p} className="flex items-start gap-3 text-[#E2E8F0] font-medium">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{t(`ba.after.${p}` as TranslationKey)}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealWrapper>

      </div>
    </section>
  );
}
