'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const consentCookie = cookies.find(c => c.startsWith('cookie-consent='));
      if (consentCookie?.includes('accepted')) setConsented(true);
    };
    check();
    // Listen for live consent grant (CookieBanner dispatches this event)
    window.addEventListener('consent-granted', check);
    return () => window.removeEventListener('consent-granted', check);
  }, []);

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

// Helper: track events anywhere in the app
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}
