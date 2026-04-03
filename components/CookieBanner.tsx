'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function getLang(): 'en' | 'fr' {
  if (typeof window === 'undefined') return 'en';
  return window.location.pathname.startsWith('/fr') ? 'fr' : 'en';
}

const COPY = {
  en: {
    message: "We use analytics cookies to understand how you use the site. No personal data sold, ever.",
    accept: "Accept",
    decline: "Decline",
    learn_more: "Privacy policy",
  },
  fr: {
    message: "Nous utilisons des cookies d'analyse pour comprendre comment vous utilisez le site. Aucune donnée personnelle vendue.",
    accept: "Accepter",
    decline: "Refuser",
    learn_more: "Politique de confidentialité",
  },
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    const l = getLang();
    setLang(l);
    const existing = document.cookie.split(';').find(c => c.trim().startsWith('cookie-consent='));
    if (!existing) setVisible(true);
  }, []);

  const setCookie = (value: 'accepted' | 'declined') => {
    document.cookie = `cookie-consent=${value}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    setVisible(false);
    if (value === 'accepted') {
      window.dispatchEvent(new Event('consent-granted'));
    }
  };

  if (!visible) return null;

  const c = COPY[lang];
  const privacyPath = lang === 'fr' ? '/fr/confidentialite' : '/en/privacy';

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        background: '#13131A',
        borderTop: '1px solid rgba(249,115,22,0.35)',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-center sm:text-left" style={{ color: '#94A3B8', maxWidth: '60ch' }}>
          {c.message}{' '}
          <Link href={privacyPath} className="underline transition-colors" style={{ color: '#F97316' }}>
            {c.learn_more}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setCookie('declined')}
            className="text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
            style={{ color: '#64748B', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {c.decline}
          </button>
          <button
            onClick={() => setCookie('accepted')}
            className="btn-orange text-sm cursor-pointer"
          >
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
