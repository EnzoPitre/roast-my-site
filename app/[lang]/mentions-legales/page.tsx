import { Metadata } from 'next';

export { default } from '../legal/page';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${BASE_URL}/fr/mentions-legales`;
  return {
    title: 'Mentions légales — Roast My Site',
    description: "Informations légales sur l'éditeur du site Roast My Site et son hébergement par Vercel. Auto-entrepreneur basé à Bordeaux.",
    alternates: { canonical },
    openGraph: { title: 'Mentions légales — Roast My Site', description: "Informations légales sur l'éditeur du site Roast My Site et son hébergement par Vercel. Auto-entrepreneur basé à Bordeaux.", url: canonical, type: 'website' },
  };
}
