'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

const DIMENSIONS = [
  {
    icon: '🎯',
    en: { title: 'First Impression', desc: 'Does your site pass the 5-second test?' },
    fr: { title: 'Première Impression', desc: 'Votre site passe-t-il le test des 5 secondes ?' },
  },
  {
    icon: '🎨',
    en: { title: 'Design & Visual Hierarchy', desc: 'Layout, spacing, typography, consistency' },
    fr: { title: 'Design & Hiérarchie Visuelle', desc: 'Mise en page, espacement, typographie, cohérence' },
  },
  {
    icon: '✍️',
    en: { title: 'Copywriting & Messaging', desc: 'Headlines, value proposition, calls to action' },
    fr: { title: 'Copywriting & Messaging', desc: 'Titres, proposition de valeur, appels à l\'action' },
  },
  {
    icon: '🛡️',
    en: { title: 'Trust & Credibility', desc: 'Social proof, certifications, professionalism' },
    fr: { title: 'Confiance & Crédibilité', desc: 'Preuves sociales, certifications, professionnalisme' },
  },
  {
    icon: '🧭',
    en: { title: 'Navigation & UX', desc: 'Can users find what they need in 3 clicks?' },
    fr: { title: 'Navigation & UX', desc: 'Les utilisateurs trouvent-ils ce qu\'ils cherchent ?' },
  },
  {
    icon: '📱',
    en: { title: 'Mobile Experience', desc: 'Is your mobile experience first-class?' },
    fr: { title: 'Expérience Mobile', desc: 'Votre mobile est-il un citoyen de première classe ?' },
  },
  {
    icon: '💰',
    en: { title: 'Conversion Architecture', desc: 'CTAs, friction points, checkout flow' },
    fr: { title: 'Architecture de Conversion', desc: 'CTAs, points de friction, tunnel d\'achat' },
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
  const howItWorksHref = `/${l}${l === 'fr' ? '/comment-ca-marche' : '/how-it-works'}`;

  return (
    <section ref={containerRef} className="w-full max-w-5xl mx-auto px-6 py-24 section-divider">
      <div className="text-center mb-16">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-5"
          style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}
        >
          {l === 'fr' ? '7 dimensions analysées' : '7 dimensions analyzed'}
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>
          {l === 'fr' ? '7 dimensions analysées par notre IA' : '7 dimensions analyzed by our AI'}
        </h2>
        <p className="text-lg font-medium" style={{ color: '#94A3B8', maxWidth: '52ch', margin: '0 auto' }}>
          {l === 'fr'
            ? 'Une analyse complète de votre site en 30 secondes, sur tous les aspects qui impactent vos conversions.'
            : 'A complete analysis of your website in 30 seconds, covering every aspect that impacts your conversions.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIMENSIONS.map((dim, i) => (
          <Link
            key={i}
            href={howItWorksHref}
            className="group rounded-[16px] p-6 transition-all cursor-pointer block"
            style={{
              background: '#13131A',
              border: '1px solid rgba(249,115,22,0.12)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms, border-color 0.2s ease, box-shadow 0.2s ease`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.4)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(249,115,22,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.12)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div className="text-3xl mb-4">{dim.icon}</div>
            <h3 className="font-black text-base mb-2" style={{ color: '#F8FAFC' }}>{dim[l].title}</h3>
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#94A3B8' }}>{dim[l].desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
