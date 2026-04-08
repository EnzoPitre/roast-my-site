import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { BLOG_POSTS } from '@/lib/blog-posts';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

const STATIC_ROUTES: { en: string; fr: string; priority: number; changeFreq: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
  { en: '/en',                     fr: '/fr',                      priority: 1.0,  changeFreq: 'daily' },
  { en: '/en/pricing',             fr: '/fr/tarifs',               priority: 0.9,  changeFreq: 'monthly' },
  { en: '/en/how-it-works',        fr: '/fr/comment-ca-marche',    priority: 0.8,  changeFreq: 'monthly' },
  { en: '/en/demo',                fr: '/fr/demo',                 priority: 0.8,  changeFreq: 'monthly' },
  { en: '/en/compare',             fr: '/fr/compare',              priority: 0.7,  changeFreq: 'monthly' },
  { en: '/en/blog',                fr: '/fr/blog',                 priority: 0.8,  changeFreq: 'weekly' },
  { en: '/en/testimonials',        fr: '/fr/testimonials',         priority: 0.7,  changeFreq: 'monthly' },
  { en: '/en/about',               fr: '/fr/about',                priority: 0.6,  changeFreq: 'monthly' },
  { en: '/en/changelog',           fr: '/fr/changelog',            priority: 0.5,  changeFreq: 'weekly' },
  { en: '/en/contact',             fr: '/fr/contact',              priority: 0.5,  changeFreq: 'yearly' },
  { en: '/en/hall-of-shame',       fr: '/fr/hall-of-shame',        priority: 0.8,  changeFreq: 'weekly' },
  { en: '/en/legal',               fr: '/fr/mentions-legales',     priority: 0.3,  changeFreq: 'yearly' },
  { en: '/en/privacy',             fr: '/fr/confidentialite',      priority: 0.3,  changeFreq: 'yearly' },
  { en: '/en/terms',               fr: '/fr/cgu',                  priority: 0.3,  changeFreq: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes — one entry per language
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(route => [
    {
      url: `${BASE_URL}${route.en}`,
      lastModified: now,
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: {
        languages: {
          en: `${BASE_URL}${route.en}`,
          fr: `${BASE_URL}${route.fr}`,
        },
      },
    },
    {
      url: `${BASE_URL}${route.fr}`,
      lastModified: now,
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: {
        languages: {
          en: `${BASE_URL}${route.en}`,
          fr: `${BASE_URL}${route.fr}`,
        },
      },
    },
  ]);

  // Blog posts — both EN and FR
  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.flatMap(post => [
    {
      url: `${BASE_URL}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fr/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]);

  // Public paid roasts — dynamic entries
  let roastEntries: MetadataRoute.Sitemap = [];
  try {
    const publicRoasts = await prisma.roast.findMany({
      where: { isPaid: true },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    roastEntries = publicRoasts.flatMap(r => [
      {
        url: `${BASE_URL}/en/roast/${r.id}`,
        lastModified: r.createdAt,
        changeFrequency: 'never' as const,
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/fr/roast/${r.id}`,
        lastModified: r.createdAt,
        changeFrequency: 'never' as const,
        priority: 0.5,
      },
    ]);
  } catch {
    // DB unavailable at build time — skip dynamic entries
  }

  return [...staticEntries, ...blogEntries, ...roastEntries];
}
