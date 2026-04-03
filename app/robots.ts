import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || 'https://roastmysite.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/en/dashboard',
          '/fr/dashboard',
          '/en/roast',
          '/fr/roast',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
