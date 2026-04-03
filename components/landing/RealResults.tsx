'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

const STATS = [
  {
    icon: '📈',
    metric: { en: 'Conversion Rate', fr: 'Taux de conversion' },
    before: '1.2%',
    after: '3.8%',
    context: { en: 'SaaS landing page', fr: 'Page d\'atterrissage SaaS' },
  },
  {
    icon: '⏱️',
    metric: { en: 'Bounce Rate', fr: 'Taux de rebond' },
    before: '74%',
    after: '41%',
    context: { en: 'E-commerce homepage', fr: 'Page d\'accueil e-commerce' },
  },
  {
    icon: '💳',
    metric: { en: 'Revenue / Visitor', fr: 'Revenu / visiteur' },
    before: '€0.34',
    after: '€1.12',
    context: { en: 'Digital product store', fr: 'Boutique de produits digitaux' },
  },
];

export function RealResults() {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const l = lang as 'en' | 'fr';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="w-full max-w-5xl mx-auto px-6 py-24 section-divider">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>
          {l === 'fr' ? 'Les chiffres parlent' : 'The numbers don\'t lie'}
        </h2>
        <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>
          {l === 'fr'
            ? 'Résultats constatés après correction des points de la kill list.'
            : 'Results seen after fixing the kill list items we identified.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="rounded-[20px] p-7 flex flex-col gap-4"
            style={{
              background: '#13131A',
              border: '1px solid rgba(249,115,22,0.15)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.55s ease ${i * 80}ms, transform 0.55s ease ${i * 80}ms`,
            }}
          >
            <div className="text-3xl">{stat.icon}</div>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#64748B' }}>
              {stat.metric[l]}
            </div>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <div className="text-2xl font-black line-through" style={{ color: '#EF4444', textDecorationColor: 'rgba(239,68,68,0.5)' }}>{stat.before}</div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: '#EF4444', opacity: 0.7 }}>
                  {l === 'fr' ? 'avant' : 'before'}
                </div>
              </div>
              <div className="text-xl font-black mb-0.5" style={{ color: '#64748B' }}>→</div>
              <div className="text-center">
                <div className="text-3xl font-black" style={{ color: '#22C55E' }}>{stat.after}</div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: '#22C55E', opacity: 0.8 }}>
                  {l === 'fr' ? 'après' : 'after'}
                </div>
              </div>
            </div>
            <p className="text-xs font-medium" style={{ color: '#475569' }}>{stat.context[l]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
