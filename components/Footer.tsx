'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { routeMap } from '@/lib/i18n';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer style={{ background: '#0A0A0F', borderTop: '1px solid rgba(249,115,22,0.1)' }} className="mt-auto">

      {/* Newsletter strip */}
      <div className="py-12 px-6" style={{ borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup lang={lang} compact />
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Logo + copyright */}
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: 'var(--font-orbitron), Inter, sans-serif', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>
              <span style={{ color: '#F97316' }}>Roast</span>
              <span style={{ color: '#475569' }}> My Site</span>
            </span>
            <span className="text-sm font-semibold" style={{ color: '#475569' }}>© 2026 — {t('footer.rights')}</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium" style={{ color: '#475569' }}>
            <Link href={`/${lang}${routeMap.about[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.about')}</Link>
            <Link href={`/${lang}${routeMap.blog[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.blog')}</Link>
            <Link href={`/${lang}${routeMap.testimonials[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.testimonials')}</Link>
            <Link href={`/${lang}${routeMap.changelog[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.changelog')}</Link>
            <Link href={`/${lang}${routeMap.contact[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.contact')}</Link>
            <Link href={`/${lang}${routeMap.legal[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.legal')}</Link>
            <Link href={`/${lang}${routeMap.privacy[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.privacy')}</Link>
            <Link href={`/${lang}${routeMap.terms[lang]}`} className="hover:text-orange-400 transition-colors duration-200">{t('footer.terms')}</Link>
          </nav>

        </div>
      </div>
    </footer>
  );
}
