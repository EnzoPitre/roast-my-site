'use client';
import { useLanguage } from '@/components/LanguageProvider';
import { RevealWrapper } from '@/components/ScrollObserver';

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    { icon: '🔗', title: t('hiw.step1.title'), desc: t('hiw.step1.desc') },
    { icon: '🤖', title: t('hiw.step2.title'), desc: t('hiw.step2.desc') },
    { icon: '🔥', title: t('hiw.step3.title'), desc: t('hiw.step3.desc') },
  ];

  return (
    <section className="max-w-5xl mx-auto py-24 px-6 section-divider relative overflow-hidden">
      <RevealWrapper animation="reveal-up">
        <h2 className="text-center text-3xl md:text-5xl font-black tracking-tight mb-20 text-[#F8FAFC]">
          {t('nav.how_it_works')}
        </h2>
      </RevealWrapper>

      <div className="relative">
        {/* Connector Line */}
        <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500/0 via-orange-500/20 to-orange-500/0 md:-ml-[1px]" />

        <div className="flex flex-col gap-12 md:gap-20">
          {steps.map((step, i) => (
            <RevealWrapper key={i} animation="reveal-up" delayClass={`stagger-${i+1}`}>
              <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Visual Half */}
                <div className={`w-full md:w-1/2 flex justify-center ${i % 2 === 1 ? 'md:justify-start' : 'md:justify-end'}`}>
                  <div className="glass-card w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-4xl md:text-5xl relative z-10 shrink-0">
                    <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-xs font-black text-orange-500 z-20">
                      {i + 1}
                    </div>
                    {step.icon}
                  </div>
                </div>

                {/* Text Half */}
                <div className={`w-full md:w-1/2 md:py-6 ${i % 2 === 1 ? 'text-left md:text-right' : 'text-left'}`}>
                  <h3 className="text-2xl font-bold mb-3 text-[#F8FAFC]">{step.title}</h3>
                  <p className="text-lg text-[#94A3B8] leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
