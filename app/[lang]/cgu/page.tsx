import { Metadata } from 'next';

export { default } from '../terms/page';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${BASE_URL}/fr/cgu`;
  return {
    title: "Conditions Générales d'Utilisation — Roast My Site",
    description: "Conditions d'utilisation de Roast My Site : service IA fourni en l'état, achats non remboursables, droit français applicable.",
    alternates: { canonical },
    openGraph: { title: "Conditions Générales d'Utilisation — Roast My Site", description: "Conditions d'utilisation de Roast My Site : service IA fourni en l'état, achats non remboursables, droit français applicable.", url: canonical, type: 'website' },
  };
}
