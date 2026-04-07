import { Metadata } from 'next';

export { default } from '../pricing/page';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${BASE_URL}/fr/tarifs`;
  return {
    title: 'Tarifs Audit Site Web — Gratuit + 4,90€ | Roast My Site',
    description: '1 audit gratuit, puis 4,90€ par rapport complet. Sans abonnement, sans frais cachés. Débloquez votre analyse IA complète.',
    keywords: ['tarif audit site web', 'prix analyse site web IA', 'audit gratuit site web', 'roast my site tarifs'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/pricing`, fr: canonical } },
    openGraph: { title: 'Tarifs Audit Site Web — Gratuit + 4,90€ | Roast My Site', description: '1 audit gratuit, puis 4,90€ par rapport complet. Sans abonnement, sans frais cachés. Débloquez votre analyse IA complète.', url: canonical, type: 'website' },
  };
}
