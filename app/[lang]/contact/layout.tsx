import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  return {
    title: t['meta.contact.title'],
    description: t['meta.contact.description'],
    alternates: { canonical: `${BASE_URL}/${lang}/contact` },
    openGraph: { title: t['meta.contact.title'], description: t['meta.contact.description'], url: `${BASE_URL}/${lang}/contact` },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
