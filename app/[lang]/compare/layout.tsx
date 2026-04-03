import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  return {
    title: t['meta.compare.title'],
    description: t['meta.compare.description'],
    alternates: { canonical: `${BASE_URL}/${lang}/compare` },
    openGraph: { title: t['meta.compare.title'], description: t['meta.compare.description'], url: `${BASE_URL}/${lang}/compare` },
  };
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
