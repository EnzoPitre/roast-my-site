'use client';
import { useState, useMemo } from 'react';
import { Header } from "@/components/Header";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { BLOG_POSTS, Category } from "@/lib/blog-posts";

const CATEGORIES: { key: Category | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'blog.category.all' },
  { key: 'cro', labelKey: 'blog.category.cro' },
  { key: 'ux', labelKey: 'blog.category.ux' },
  { key: 'copy', labelKey: 'blog.category.copy' },
  { key: 'seo', labelKey: 'blog.category.seo' },
  { key: 'cases', labelKey: 'blog.category.cases' },
];

export function BlogListClient() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchCat = activeCategory === 'all' || post.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q
        || post.title[lang as 'en' | 'fr'].toLowerCase().includes(q)
        || post.excerpt[lang as 'en' | 'fr'].toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search, lang]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-24 flex-1 w-full">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: '#F8FAFC' }}>The Audit Log</h1>
          <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>
            {lang === 'fr' ? 'Vérités brutales et conseils actionnables pour augmenter vos conversions.' : 'Brutal truths and actionable advice on lifting conversions.'}
          </p>
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('blog.search.placeholder') as string}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all cursor-pointer"
                style={{
                  background: activeCategory === cat.key ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                  color: activeCategory === cat.key ? '#F97316' : '#64748B',
                  border: `1px solid ${activeCategory === cat.key ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {t(cat.labelKey as Parameters<typeof t>[0]) as string}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: '#64748B' }}>
            {lang === 'fr' ? 'Aucun article trouvé.' : 'No articles found.'}
          </div>
        )}

        {featured && (
          <Link href={`/${lang}/blog/${featured.slug}`} className="block mb-8 group">
            <div className="rounded-[20px] p-8 md:p-10 transition-all hover:border-orange-500/30" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.15)', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.8), transparent 70%)', filter: 'blur(40px)', transform: 'translate(30%,-30%)' }} />
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(249,115,22,0.1)', color: featured.tagColor, border: `1px solid ${featured.tagColor}40` }}>
                  ★ {t('blog.featured') as string}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.06)', color: featured.tagColor, border: `1px solid ${featured.tagColor}30` }}>
                  {featured.tag[lang as 'en' | 'fr']}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#475569' }}>{featured.date}</span>
                <span className="text-xs font-bold" style={{ color: '#475569' }}>{featured.readTime} {t('blog.min_read') as string}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight" style={{ color: '#F8FAFC' }}>
                {featured.title[lang as 'en' | 'fr']}
              </h2>
              <p className="text-base font-medium mb-6 leading-relaxed" style={{ color: '#94A3B8', maxWidth: '65ch' }}>
                {featured.excerpt[lang as 'en' | 'fr']}
              </p>
              <div className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#F97316' }}>
                {t('blog.read_more') as string} <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rest.map(post => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="block group">
                <div className="glass-card p-6 h-full flex flex-col transition-all hover:border-orange-500/25" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <div className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.06)', color: post.tagColor, border: `1px solid ${post.tagColor}30` }}>
                      {post.tag[lang as 'en' | 'fr']}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>{post.date}</span>
                    <span className="text-[10px] font-bold" style={{ color: '#475569' }}>{post.readTime} {t('blog.min_read') as string}</span>
                  </div>
                  <h3 className="text-lg font-black mb-2 leading-tight flex-1" style={{ color: '#F8FAFC' }}>
                    {post.title[lang as 'en' | 'fr']}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed mb-5" style={{ color: '#94A3B8' }}>
                    {post.excerpt[lang as 'en' | 'fr']}
                  </p>
                  <div className="text-xs font-bold flex items-center gap-1.5 mt-auto" style={{ color: '#F97316' }}>
                    {t('blog.read_more') as string} <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>
    </>
  );
}
