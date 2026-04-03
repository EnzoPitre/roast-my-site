'use client';
import { useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { LogOut, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useRouter, usePathname } from 'next/navigation';
import { getAlternatePath, routeMap } from '@/lib/i18n';

export function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'fr' : 'en';
    const nextPath = getAlternatePath(pathname, lang);
    setLang(nextLang);
    router.push(nextPath);
  };

  return (
    <header style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(249,115,22,0.12)', overflow: 'visible' }} className="sticky top-0 z-50 print:hidden transition-all">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ minHeight: '72px' }}>

        {/* Logo */}
        <Link href={routeMap.home[lang]} className="flex items-center hover:opacity-90 transition-opacity">
          <span style={{ fontFamily: 'var(--font-orbitron), Inter, sans-serif', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
            <span style={{ color: '#F97316' }}>Roast</span>
            <span style={{ color: '#F8FAFC' }}> My Site</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-6 text-sm font-semibold">
          <Link href={`/${lang}${routeMap.howItWorks[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.how_it_works')}</Link>
          <Link href={`/${lang}${routeMap.pricing[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.pricing')}</Link>
          <Link href={`/${lang}${routeMap.demo[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.demo')}</Link>
          <Link href={`/${lang}${routeMap.compare[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.compare')}</Link>
          <Link href={`/${lang}${routeMap.about[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.about')}</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {status === 'loading' ? (
            <div className="w-24 h-9 rounded-xl animate-pulse" style={{ background: '#13131A' }} />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link href={`/${lang}${routeMap.dashboard[lang]}`} style={{ color: '#E2E8F0' }} className="text-sm font-semibold hover:text-orange-400 transition-colors">
                {t('nav.my_roasts')}
              </Link>
              <span className="text-sm font-semibold flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.15)', color: '#94A3B8' }}>
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full" style={{ background: '#1E293B' }} />
                )}
                <span className="max-w-[110px] truncate">{session.user?.email}</span>
              </span>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-full transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                title={t('nav.sign_out')}
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="btn-secondary text-sm cursor-pointer"
            >
              {t('nav.sign_in')}
            </button>
          )}

          {/* Lang switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: '#94A3B8', background: '#13131A', border: '1px solid rgba(249,115,22,0.15)' }}
            onMouseEnter={e => { (e.currentTarget.style.color = '#F97316'); (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'); }}
            onMouseLeave={e => { (e.currentTarget.style.color = '#94A3B8'); (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.15)'); }}
          >
            <Globe className="w-3.5 h-3.5" /> {lang.toUpperCase()}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg cursor-pointer transition-colors"
          style={{ color: '#E2E8F0' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 shadow-2xl p-6 flex flex-col gap-5 font-semibold" style={{ background: '#0A0A0F', borderBottom: '1px solid rgba(249,115,22,0.12)' }}>
          <Link href={`/${lang}${routeMap.howItWorks[lang]}`} style={{ color: '#E2E8F0' }} className="text-lg hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.how_it_works')}</Link>
          <Link href={`/${lang}${routeMap.pricing[lang]}`} style={{ color: '#E2E8F0' }} className="text-lg hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.pricing')}</Link>
          <Link href={`/${lang}${routeMap.demo[lang]}`} style={{ color: '#E2E8F0' }} className="text-lg hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.demo')}</Link>
          <Link href={`/${lang}${routeMap.compare[lang]}`} style={{ color: '#E2E8F0' }} className="text-lg hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.compare')}</Link>
          <Link href={`/${lang}${routeMap.about[lang]}`} style={{ color: '#E2E8F0' }} className="text-lg hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</Link>
          <button
            onClick={() => { toggleLang(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 text-base cursor-pointer w-fit transition-colors"
            style={{ color: '#94A3B8' }}
          >
            <Globe className="w-4 h-4" /> Language: {lang.toUpperCase()}
          </button>

          <div className="pt-4 mt-1" style={{ borderTop: '1px solid rgba(249,115,22,0.12)' }}>
            {status === 'loading' ? (
              <div className="w-full h-12 rounded-xl animate-pulse" style={{ background: '#13131A' }} />
            ) : session ? (
              <div className="flex flex-col gap-3">
                <Link href={`/${lang}${routeMap.dashboard[lang]}`} style={{ color: '#E2E8F0' }} className="text-lg hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.my_roasts')}
                </Link>
                <span className="text-sm flex items-center gap-3 px-3 py-2 rounded-lg truncate" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.15)', color: '#94A3B8' }}>
                  {session.user?.image && <img src={session.user.image} alt="Avatar" className="w-6 h-6 rounded-full" />}
                  {session.user?.email}
                </span>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-sm cursor-pointer transition-colors"
                  style={{ color: '#94A3B8' }}
                >
                  <LogOut className="w-4 h-4" /> {t('nav.sign_out')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { signIn('google'); setMobileMenuOpen(false); }}
                className="btn-orange w-full text-center cursor-pointer"
              >
                {t('nav.sign_in')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
