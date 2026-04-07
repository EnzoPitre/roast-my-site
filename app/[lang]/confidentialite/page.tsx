import { Metadata } from 'next';

export { default } from '../privacy/page';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${BASE_URL}/fr/confidentialite`;
  return {
    title: 'Politique de confidentialité — Roast My Site',
    description: "Découvrez comment Roast My Site collecte, utilise et protège vos données personnelles. Conformité RGPD et droits d'accès garantis.",
    alternates: { canonical },
    openGraph: { title: 'Politique de confidentialité — Roast My Site', description: "Découvrez comment Roast My Site collecte, utilise et protège vos données personnelles. Conformité RGPD et droits d'accès garantis.", url: canonical, type: 'website' },
  };
}
