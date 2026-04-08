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
    <>
      {/* ── FLOATING PILL HEADER ──────────────────────────────────────── */}
      <header
        className="print:hidden"
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'fit-content',
          maxWidth: '90vw',
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: '50px',
          padding: '8px 20px',
          zIndex: 1000,
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          overflow: 'visible',
        }}
      >
        <div className="flex items-center gap-5">

          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <span style={{ fontFamily: 'var(--font-orbitron), Inter, sans-serif', fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
              <span style={{ color: '#F97316' }}>Roast</span>
              <span style={{ color: '#F8FAFC' }}> My Site</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5" style={{ fontSize: '13px' }}>
            <Link href={`/${lang}${routeMap.howItWorks[lang]}`} style={{ color: '#CBD5E1' }} className="hover:text-orange-400 transition-colors duration-200 whitespace-nowrap font-medium">{t('nav.how_it_works')}</Link>
            <Link href={`/${lang}${routeMap.pricing[lang]}`} style={{ color: '#CBD5E1' }} className="hover:text-orange-400 transition-colors duration-200 font-medium">{t('nav.pricing')}</Link>
            <Link href={`/${lang}${routeMap.demo[lang]}`} style={{ color: '#CBD5E1' }} className="hover:text-orange-400 transition-colors duration-200 font-medium">{t('nav.demo')}</Link>
            <Link href={`/${lang}${routeMap.hallOfShame[lang]}`} className="hover:text-red-400 transition-colors duration-200 font-bold whitespace-nowrap" style={{ color: '#EF4444' }}>{t('nav.hall_of_shame')}</Link>
            <Link href={`/${lang}${routeMap.compare[lang]}`} style={{ color: '#CBD5E1' }} className="hover:text-orange-400 transition-colors duration-200 font-medium">{t('nav.compare')}</Link>
          </nav>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 shrink-0" style={{ background: 'rgba(249,115,22,0.2)' }} />

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3" style={{ fontSize: '13px' }}>
            {status === 'loading' ? (
              <div className="w-16 h-6 rounded-full animate-pulse" style={{ background: '#1E293B' }} />
            ) : session ? (
              <>
                <Link href={`/${lang}${routeMap.dashboard[lang]}`} style={{ color: '#CBD5E1' }} className="font-semibold hover:text-orange-400 transition-colors whitespace-nowrap">
                  {t('nav.my_roasts')}
                </Link>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}>
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full" style={{ background: '#1E293B' }} />
                  )}
                  <span className="max-w-[90px] truncate font-medium" style={{ color: '#94A3B8' }}>{session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-1.5 rounded-full transition-colors cursor-pointer"
                  style={{ color: '#64748B' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
                  title={t('nav.sign_out')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="cursor-pointer font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                style={{ background: '#F97316', color: '#0A0A0F', fontSize: '12px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#EA580C')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F97316')}
              >
                {t('nav.sign_in')}
              </button>
            )}

            {/* Lang switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 font-bold cursor-pointer transition-colors"
              style={{ color: '#64748B', fontSize: '12px' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
            >
              <Globe className="w-3.5 h-3.5" /> {lang.toUpperCase()}
            </button>
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="flex md:hidden items-center gap-3 ml-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 font-bold cursor-pointer transition-colors"
              style={{ color: '#64748B', fontSize: '12px' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
            >
              <Globe className="w-3.5 h-3.5" /> {lang.toUpperCase()}
            </button>
            <button
              className="p-1.5 rounded-full cursor-pointer transition-colors"
              style={{ color: '#E2E8F0' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — positioned below the pill */}
        {mobileMenuOpen && (
          <div
            className="md:hidden absolute left-0 right-0 rounded-[24px] p-5 flex flex-col gap-4 font-semibold"
            style={{
              top: 'calc(100% + 8px)',
              background: 'rgba(10,10,15,0.97)',
              border: '1px solid rgba(249,115,22,0.2)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <Link href={`/${lang}${routeMap.howItWorks[lang]}`} style={{ color: '#E2E8F0' }} className="text-sm hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.how_it_works')}</Link>
            <Link href={`/${lang}${routeMap.pricing[lang]}`} style={{ color: '#E2E8F0' }} className="text-sm hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.pricing')}</Link>
            <Link href={`/${lang}${routeMap.demo[lang]}`} style={{ color: '#E2E8F0' }} className="text-sm hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.demo')}</Link>
            <Link href={`/${lang}${routeMap.hallOfShame[lang]}`} className="text-sm hover:text-red-400 transition-colors font-bold" style={{ color: '#EF4444' }} onClick={() => setMobileMenuOpen(false)}>{t('nav.hall_of_shame')}</Link>
            <Link href={`/${lang}${routeMap.compare[lang]}`} style={{ color: '#E2E8F0' }} className="text-sm hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.compare')}</Link>
            <Link href={`/${lang}${routeMap.about[lang]}`} style={{ color: '#E2E8F0' }} className="text-sm hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</Link>

            <div style={{ borderTop: '1px solid rgba(249,115,22,0.12)', paddingTop: '12px', marginTop: '4px' }}>
              {status === 'loading' ? (
                <div className="w-full h-10 rounded-full animate-pulse" style={{ background: '#1E293B' }} />
              ) : session ? (
                <div className="flex flex-col gap-3">
                  <Link href={`/${lang}${routeMap.dashboard[lang]}`} style={{ color: '#E2E8F0' }} className="text-sm hover:text-orange-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.my_roasts')}
                  </Link>
                  <span className="text-xs flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.15)', color: '#94A3B8' }}>
                    {session.user?.image && <img src={session.user.image} alt="Avatar" className="w-5 h-5 rounded-full" />}
                    <span className="truncate">{session.user?.email}</span>
                  </span>
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm cursor-pointer transition-colors w-fit"
                    style={{ color: '#94A3B8' }}
                  >
                    <LogOut className="w-4 h-4" /> {t('nav.sign_out')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { signIn('google'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-full font-bold text-sm cursor-pointer transition-all"
                  style={{ background: '#F97316', color: '#0A0A0F' }}
                >
                  {t('nav.sign_in')}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer — reserves 80px of flow so content doesn't start behind the fixed pill */}
      <div style={{ height: '80px' }} className="print:hidden" aria-hidden="true" />

      {/* ── OLD STICKY HEADER (commented out — revert by removing above and uncommenting below) ──
      <header style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(249,115,22,0.12)', overflow: 'visible' }} className="sticky top-0 z-50 print:hidden transition-all">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ minHeight: '72px' }}>
          <Link href={routeMap.home[lang]} className="flex items-center hover:opacity-90 transition-opacity">
            <span style={{ fontFamily: 'var(--font-orbitron), Inter, sans-serif', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
              <span style={{ color: '#F97316' }}>Roast</span>
              <span style={{ color: '#F8FAFC' }}> My Site</span>
            </span>
          </Link>
          <nav className="hidden md:flex flex-1 justify-center gap-6 text-sm font-semibold">
            <Link href={`/${lang}${routeMap.howItWorks[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.how_it_works')}</Link>
            <Link href={`/${lang}${routeMap.pricing[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.pricing')}</Link>
            <Link href={`/${lang}${routeMap.demo[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.demo')}</Link>
            <Link href={`/${lang}${routeMap.compare[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.compare')}</Link>
            <Link href={`/${lang}${routeMap.about[lang]}`} style={{ color: '#E2E8F0' }} className="hover:text-orange-400 transition-colors duration-200">{t('nav.about')}</Link>
            <Link href={`/${lang}${routeMap.hallOfShame[lang]}`} className="hover:text-red-400 transition-colors duration-200 font-bold" style={{ color: '#EF4444' }}>{t('nav.hall_of_shame')}</Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            ... (desktop actions) ...
          </div>
          <button className="md:hidden p-2 rounded-lg cursor-pointer" style={{ color: '#E2E8F0' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        ... (mobile dropdown) ...
      </header>
      ── END OLD HEADER ── */}
    </>
  );
}
