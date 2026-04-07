import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = `${BASE_URL}/${lang}/compare`;
  return {
    title: t['meta.compare.title'],
    description: t['meta.compare.description'],
    keywords: lang === 'fr'
      ? ['comparer sites web', 'audit concurrentiel IA', 'analyse comparative site web']
      : ['compare websites', 'side by side site audit', 'competitor website analysis', 'ai website comparison'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/compare`, fr: `${BASE_URL}/fr/compare` } },
    openGraph: { title: t['meta.compare.title'], description: t['meta.compare.description'], url: canonical, type: 'website' },
  };
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
