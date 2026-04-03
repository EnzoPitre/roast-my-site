import { Header } from "@/components/Header";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPost, getRelatedPosts, BLOG_POSTS } from "@/lib/blog-posts";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { routeMap } from "@/lib/i18n";
import { ShareButtons } from "@/components/ShareButtons";

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { slug: string; lang: string } }): Promise<import('next').Metadata> {
  const post = getPost(params.slug);
  const lang = params.lang as Language;
  if (!post) return {};
  const title = `${post.title[lang]} | Roast My Site Blog`;
  const description = post.excerpt[lang];
  const canonical = `${BASE_URL}/${lang}/blog/${params.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: `${BASE_URL}/og?lang=${lang}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function BlogPost({ params }: { params: { slug: string; lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.related);
  const title = post.title[lang];
  const content = post.content[lang];

  // Render markdown-like bold (**text**) and headings (### text)
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-black mt-8 mb-3 tracking-tight" style={{ color: '#F8FAFC' }}>{line.slice(4)}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-black text-base mt-5 mb-1" style={{ color: '#F8FAFC' }}>{line.slice(2, -2)}</p>;
      }
      if (line.match(/^\*\*(.+)\*\*/)) {
        // Inline bold in a line
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="leading-relaxed" style={{ color: '#CBD5E1', fontSize: '1.0625rem' }}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} style={{ color: '#F8FAFC', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
      if (line.startsWith('☐ ')) {
        return (
          <div key={i} className="flex items-start gap-3 py-1.5" style={{ color: '#CBD5E1', fontSize: '0.9375rem' }}>
            <span style={{ color: '#F97316', fontWeight: 700, flexShrink: 0 }}>☐</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\. /)) {
        const num = line.match(/^(\d+)\. (.+)$/);
        if (num) return (
          <div key={i} className="flex items-start gap-3 my-2">
            <span className="font-black text-sm mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316' }}>{num[1]}</span>
            <p className="leading-relaxed" style={{ color: '#CBD5E1', fontSize: '1.0625rem' }}>{num[2]}</p>
          </div>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 leading-relaxed list-disc" style={{ color: '#CBD5E1', fontSize: '1.0625rem' }}>{line.slice(2)}</li>;
      }
      if (line.trim() === '') return <div key={i} className="h-4" />;
      return <p key={i} className="leading-relaxed" style={{ color: '#CBD5E1', fontSize: '1.0625rem' }}>{line}</p>;
    });
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: post.excerpt[lang],
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Enzo P.', url: `${BASE_URL}/${lang}/about` },
    publisher: { '@type': 'Organization', name: 'Roast My Site', url: BASE_URL },
    url: `${BASE_URL}/${lang}/blog/${params.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ReadingProgressBar />
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 flex-1 w-full">

        {/* Back */}
        <Link
          href={`/${lang}${routeMap.blog[lang]}`}
          className="inline-flex items-center gap-2 text-sm font-bold mb-10 transition-colors group"
          style={{ color: '#64748B' }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" style={{ color: '#F97316' }} />
          <span className="hover:text-orange-400 transition-colors">{t('blog.back')}</span>
        </Link>

        <article>
          {/* Tag + Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(249,115,22,0.1)', color: post.tagColor, border: `1px solid ${post.tagColor}40` }}>
              {post.tag[lang]}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#475569' }}>{post.date}</span>
            <span className="text-xs font-bold" style={{ color: '#475569' }}>{post.readTime} {t('blog.min_read')}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight" style={{ color: '#F8FAFC' }}>{title}</h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-10 pb-8" style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff' }}>
              EP
            </div>
            <div>
              <div className="text-sm font-black" style={{ color: '#F8FAFC' }}>Enzo P.</div>
              <div className="text-xs font-medium" style={{ color: '#64748B' }}>Founder, Roast My Site</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            {renderContent(content)}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 flex items-center gap-4" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#64748B' }}>{t('blog.share')}</span>
            <ShareButtons title={title} lang={lang} />
          </div>
        </article>

        {/* Newsletter */}
        <div className="mt-12">
          <div className="mb-3">
            <h3 className="text-lg font-black" style={{ color: '#F8FAFC' }}>{t('blog.newsletter.title')}</h3>
            <p className="text-sm font-medium mt-1" style={{ color: '#94A3B8' }}>{t('blog.newsletter.desc')}</p>
          </div>
          <NewsletterSignup lang={lang} compact />
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black mb-6 tracking-tight" style={{ color: '#F8FAFC' }}>{t('blog.related')}</h2>
            <div className="space-y-3">
              {related.map(rel => (
                <Link key={rel.slug} href={`/${lang}/blog/${rel.slug}`} className="block group">
                  <div className="p-4 rounded-xl flex items-start gap-4 transition-colors hover:border-orange-500/20" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}>
                    <div className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 mt-0.5" style={{ background: 'rgba(249,115,22,0.06)', color: rel.tagColor, border: `1px solid ${rel.tagColor}30` }}>
                      {rel.tag[lang]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm group-hover:text-orange-400 transition-colors" style={{ color: '#F8FAFC' }}>
                        {rel.title[lang]}
                      </p>
                    </div>
                    <ArrowLeft className="w-4 h-4 shrink-0 rotate-180 group-hover:translate-x-1 transition-transform" style={{ color: '#F97316' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
    </>
  );
}
