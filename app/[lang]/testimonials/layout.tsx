import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  return {
    title: t['meta.testimonials.title'],
    description: t['meta.testimonials.description'],
    keywords: lang === 'fr' ? ['avis roast my site', 'témoignages audit site'] : undefined,
    alternates: { canonical: `${BASE_URL}/${lang}/testimonials` },
    openGraph: { title: t['meta.testimonials.title'], description: t['meta.testimonials.description'], url: `${BASE_URL}/${lang}/testimonials` },
  };
}

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
