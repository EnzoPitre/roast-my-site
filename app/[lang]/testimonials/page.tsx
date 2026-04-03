'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Header } from '@/components/Header';
import { TestimonialsGrid, TESTIMONIALS, DbReview } from '@/components/TestimonialsGrid';
import { ReviewModal } from '@/components/ReviewModal';
import Link from 'next/link';
import { routeMap } from '@/lib/i18n';
import { useSession } from 'next-auth/react';

const STATIC_AVG = (TESTIMONIALS.reduce((s, t) => s + t.stars, 0) / TESTIMONIALS.length).toFixed(1);

export default function TestimonialsPage() {
  const { lang, t } = useLanguage();
  const { status } = useSession();

  const [realReviews, setRealReviews]   = useState<DbReview[]>([]);
  const [avg, setAvg]                   = useState<string>(STATIC_AVG);
  const [totalCount, setTotalCount]     = useState<number>(TESTIMONIALS.length);
  const [showModal, setShowModal]       = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        if (data.reviews) setRealReviews(data.reviews);
        if (data.average) setAvg(String(data.average));
        if (data.count !== undefined) {
          setTotalCount(data.count + TESTIMONIALS.length);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    // Re-fetch to show newly approved review
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        if (data.reviews) setRealReviews(data.reviews);
        if (data.average) setAvg(String(data.average));
        if (data.count !== undefined) setTotalCount(data.count + TESTIMONIALS.length);
      })
      .catch(() => {});
  };

  return (
    <>
      {showModal && <ReviewModal onClose={handleModalClose} />}
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-24 flex-1 w-full">

        {/* Hero */}
        <div className="text-center mb-16 relative pt-14">
          {/* Leave a Review button — top right */}
          {status === 'authenticated' && (
            <button
              onClick={() => setShowModal(true)}
              className="absolute right-0 top-0 btn-orange text-sm px-4 py-2 cursor-pointer"
            >
              {t('review.leave_review')}
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-5"
            style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
            {totalCount} {lang === 'fr' ? 'témoignages vérifiés' : 'verified reviews'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>
            {lang === 'fr' ? 'Ce que disent nos utilisateurs' : 'What our users say'}
          </h1>
          <p className="text-lg font-medium mb-8" style={{ color: '#94A3B8' }}>
            {lang === 'fr' ? 'De vrais chiffres. De vraies corrections. De vrais résultats.' : 'Real numbers. Real fixes. Real results.'}
          </p>

          {/* Average star rating */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
            style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: '#F97316', fontSize: '18px' }}>★</span>
              ))}
            </div>
            <span className="text-xl font-black" style={{ color: '#F8FAFC' }}>{avg}</span>
            <span className="text-sm font-medium" style={{ color: '#64748B' }}>
              / 5.0 · {totalCount} {lang === 'fr' ? 'avis' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Grid */}
        <TestimonialsGrid lang={lang} realReviews={loadingReviews ? [] : realReviews} />

        {/* Bottom CTA */}
        <div className="mt-20 pt-16 text-center" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>
            {lang === 'fr' ? 'Rejoignez-les.' : 'Join them.'}
          </h2>
          <p className="text-lg font-medium mb-8" style={{ color: '#94A3B8' }}>
            {lang === 'fr' ? 'Premier audit gratuit. Résultats en 30 secondes.' : 'First roast is free. Results in 30 seconds.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href={`/${lang}${routeMap.home[lang]}`} className="btn-orange text-base px-8 py-4 inline-block">
              {lang === 'fr' ? 'Auditer mon site gratuitement 🔥' : 'Roast my site for free 🔥'}
            </Link>
            {status === 'authenticated' && (
              <button
                onClick={() => setShowModal(true)}
                className="text-base px-8 py-4 rounded-xl font-black cursor-pointer transition-colors"
                style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}
              >
                {t('review.leave_review')} ✍️
              </button>
            )}
          </div>
        </div>

      </main>
    </>
  );
}
