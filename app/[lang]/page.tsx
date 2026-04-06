import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';
import { LandingPageClient } from '@/components/LandingPageClient';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = `${BASE_URL}/${lang}`;

  return {
    title: t['meta.home.title'],
    description: t['meta.home.description'],
    keywords: lang === 'fr'
      ? ['audit site web gratuit', 'analyser site web', 'optimisation taux de conversion', 'audit UX gratuit']
      : ['website audit', 'free website audit', 'AI website analysis', 'conversion rate optimization'],
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/en`,
        fr: `${BASE_URL}/fr`,
      },
    },
    openGraph: {
      title: t['meta.home.title'],
      description: t['meta.home.description'],
      url: canonical,
      type: 'website',
      images: [{ url: `${BASE_URL}/og?lang=${lang}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t['meta.home.title'],
      description: t['meta.home.description'],
      images: [`${BASE_URL}/og?lang=${lang}`],
    },
  };
}

export default function LandingPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = translations[lang];

  // Build FAQ JSON-LD from translation keys
  const faqItems = Array.from({ length: 12 }, (_, i) => i + 1).map(id => ({
    '@type': 'Question',
    name: t[`faq.${id}.q` as keyof typeof t] as string,
    acceptedAnswer: {
      '@type': 'Answer',
      text: t[`faq.${id}.a` as keyof typeof t] as string,
    },
  }));

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Roast My Site',
    description: t['meta.home.description'],
    applicationCategory: 'BusinessApplication',
    url: BASE_URL,
    offers: {
      '@type': 'Offer',
      price: '4.90',
      priceCurrency: 'EUR',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingPageClient />
    </>
  );
}
