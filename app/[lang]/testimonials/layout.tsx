import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = `${BASE_URL}/${lang}/testimonials`;
  return {
    title: t['meta.testimonials.title'],
    description: t['meta.testimonials.description'],
    keywords: lang === 'fr'
      ? ['avis roast my site', 'témoignages audit site web', 'retours clients audit IA']
      : ['roast my site reviews', 'website audit testimonials', 'ai audit user feedback'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/testimonials`, fr: `${BASE_URL}/fr/testimonials` } },
    openGraph: { title: t['meta.testimonials.title'], description: t['meta.testimonials.description'], url: canonical, type: 'website' },
  };
}

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
