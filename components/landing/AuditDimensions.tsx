'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

const DIMENSIONS = [
  {
    icon: '🎯',
    en: { title: 'First Impression', desc: 'Does your hero section grab attention in under 3 seconds?' },
    fr: { title: 'Première impression', desc: 'Votre hero accroche-t-il l\'attention en moins de 3 secondes ?' },
  },
  {
    icon: '🎨',
    en: { title: 'Visual Design', desc: 'Is your layout clean, modern, and distraction-free?' },
    fr: { title: 'Design visuel', desc: 'Votre mise en page est-elle propre, moderne et sans distraction ?' },
  },
  {
    icon: '✍️',
    en: { title: 'Copywriting', desc: 'Does your copy speak to pain and push people to act?' },
    fr: { title: 'Copywriting', desc: 'Votre texte parle-t-il de la douleur et pousse-t-il à agir ?' },
  },
  {
    icon: '🛡️',
    en: { title: 'Trust & Credibility', desc: 'Social proof, guarantees, and signals that say "safe to buy."' },
    fr: { title: 'Confiance & Crédibilité', desc: 'Preuves sociales, garanties et signaux qui rassurent l\'acheteur.' },
  },
  {
    icon: '🧭',
    en: { title: 'Navigation & UX', desc: 'Can users find what they need without thinking?' },
    fr: { title: 'Navigation & UX', desc: 'Les utilisateurs trouvent-ils ce qu\'ils cherchent sans effort ?' },
  },
  {
    icon: '📱',
    en: { title: 'Mobile Experience', desc: 'Does it work as well on a phone as on a desktop?' },
    fr: { title: 'Expérience mobile', desc: 'Fonctionne-t-il aussi bien sur téléphone que sur bureau ?' },
  },
  {
    icon: '💰',
    en: { title: 'Conversion Architecture', desc: 'Are CTAs clear, well-placed, and impossible to miss?' },
    fr: { title: 'Architecture de conversion', desc: 'Vos CTAs sont-ils clairs, bien placés et impossibles à rater ?' },
  },
];

export function AuditDimensions() {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  const l = lang as 'en' | 'fr';

  return (
    <section ref={containerRef} className="w-full max-w-5xl mx-auto px-6 py-24 section-divider">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-5"
          style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
          {l === 'fr' ? '7 dimensions analysées' : '7 dimensions audited'}
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>
          {l === 'fr' ? 'Ce qu\'on passe au crible' : 'What we put under the microscope'}
        </h2>
        <p className="text-lg font-medium" style={{ color: '#94A3B8', maxWidth: '52ch', margin: '0 auto' }}>
          {l === 'fr'
            ? 'Chaque audit couvre 7 dimensions critiques qui font ou brisent vos conversions.'
            : 'Every roast covers 7 critical dimensions that make or break your conversions.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIMENSIONS.map((dim, i) => (
          <div
            key={i}
            className="rounded-[16px] p-6 transition-all hover:border-orange-500/30"
            style={{
              background: '#13131A',
              border: '1px solid rgba(249,115,22,0.12)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`,
            }}
          >
            <div className="text-3xl mb-4">{dim.icon}</div>
            <h3 className="font-black text-base mb-2" style={{ color: '#F8FAFC' }}>{dim[l].title}</h3>
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#94A3B8' }}>{dim[l].desc}</p>
          </div>
        ))}
        {/* 7th card fills 2 cols on lg to balance 3+3+1 */}
      </div>
    </section>
  );
}
