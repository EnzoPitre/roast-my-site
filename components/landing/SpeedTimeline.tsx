'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

const STEPS = [
  {
    time: '0s',
    en: 'Paste your URL',
    fr: 'Collez votre URL',
    icon: '🔗',
  },
  {
    time: '5s',
    en: 'AI crawls your site',
    fr: 'L\'IA explore votre site',
    icon: '🤖',
  },
  {
    time: '15s',
    en: 'Scoring across 7 dimensions',
    fr: 'Score sur 7 dimensions',
    icon: '📊',
  },
  {
    time: '25s',
    en: 'Kill list generated',
    fr: 'Kill list générée',
    icon: '🔥',
  },
  {
    time: '30s',
    en: 'Full report ready',
    fr: 'Rapport complet prêt',
    icon: '✅',
  },
];

export function SpeedTimeline() {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const l = lang as 'en' | 'fr';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="w-full max-w-4xl mx-auto px-6 py-20 section-divider">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: '#F8FAFC' }}>
          {l === 'fr' ? '30 secondes. C\'est tout.' : '30 seconds. That\'s it.'}
        </h2>
        <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>
          {l === 'fr'
            ? 'Ce qui prend 3 jours à un consultant, notre IA le fait en une demi-minute.'
            : 'What takes a consultant 3 days, our AI does in half a minute.'}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Horizontal line on desktop */}
        <div className="hidden sm:block absolute top-8 left-0 right-0 h-0.5" style={{ background: 'rgba(249,115,22,0.15)' }}>
          <div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, #F97316, #EA580C)',
              width: visible ? '100%' : '0%',
              transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s',
              boxShadow: '0 0 8px rgba(249,115,22,0.4)',
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4 relative z-10">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease ${i * 180}ms, transform 0.4s ease ${i * 180}ms`,
              }}
            >
              {/* Dot */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 shrink-0"
                style={{
                  background: i === STEPS.length - 1 ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
                  border: `2px solid ${i === STEPS.length - 1 ? 'rgba(34,197,94,0.4)' : 'rgba(249,115,22,0.3)'}`,
                  boxShadow: i === STEPS.length - 1 ? '0 0 16px rgba(34,197,94,0.15)' : '0 0 12px rgba(249,115,22,0.1)',
                }}
              >
                {step.icon}
              </div>

              <div className="text-xs font-black uppercase tracking-widest mb-1"
                style={{ color: i === STEPS.length - 1 ? '#22C55E' : '#F97316' }}>
                {step.time}
              </div>
              <div className="text-sm font-bold" style={{ color: '#CBD5E1' }}>
                {step[l]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
