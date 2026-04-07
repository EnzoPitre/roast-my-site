import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = `${BASE_URL}/${lang}/contact`;
  return {
    title: t['meta.contact.title'],
    description: t['meta.contact.description'],
    keywords: lang === 'fr'
      ? ['contact roast my site', 'support audit site web', 'signaler un bug']
      : ['contact roast my site', 'website audit support', 'report a bug'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/contact`, fr: `${BASE_URL}/fr/contact` } },
    openGraph: { title: t['meta.contact.title'], description: t['meta.contact.description'], url: canonical, type: 'website' },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
