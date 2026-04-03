import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';
import { BlogListClient } from '@/components/BlogListClient';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = `${BASE_URL}/${lang}/blog`;

  return {
    title: t['meta.blog.title'],
    description: t['meta.blog.description'],
    alternates: {
      canonical,
      languages: { en: `${BASE_URL}/en/blog`, fr: `${BASE_URL}/fr/blog` },
    },
    openGraph: {
      title: t['meta.blog.title'],
      description: t['meta.blog.description'],
      url: canonical,
      type: 'website',
      images: [{ url: `${BASE_URL}/og?lang=${lang}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: t['meta.blog.title'], description: t['meta.blog.description'] },
  };
}

export default function BlogPage() {
  return <BlogListClient />;
}
