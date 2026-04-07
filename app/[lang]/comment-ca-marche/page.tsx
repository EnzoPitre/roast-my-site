import { Metadata } from 'next';

export { default } from '../how-it-works/page';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${BASE_URL}/fr/comment-ca-marche`;
  return {
    title: "Comment fonctionne l'audit IA de site web — Roast My Site",
    description: "Notre IA analyse votre site sur 7 dimensions en 30 secondes et génère un plan d'action concret. Découvrez le fonctionnement complet.",
    keywords: ['comment auditer son site web', 'analyse UX IA', 'score site web', 'outil audit gratuit', 'comment ça marche roast my site'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/how-it-works`, fr: canonical } },
    openGraph: { title: "Comment fonctionne l'audit IA de site web — Roast My Site", description: "Notre IA analyse votre site sur 7 dimensions en 30 secondes et génère un plan d'action concret. Découvrez le fonctionnement complet.", url: canonical, type: 'website' },
  };
}
