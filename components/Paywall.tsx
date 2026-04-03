'use client';
import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/components/Analytics';

export function Paywall({ roastId }: { roastId: string }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    trackEvent('payment_initiated', { roast_id: roastId });
    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roastId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch {
      alert('An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-b-2xl" style={{ background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="p-8 sm:p-10 rounded-[16px] max-w-md w-full text-center mx-4" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.4)', boxShadow: '0 0 60px rgba(249,115,22,0.15)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.35)' }}>
          <Lock className="w-7 h-7" style={{ color: '#F97316' }} />
        </div>
        <h3 className="text-2xl font-black mb-3 tracking-tight" style={{ color: '#F8FAFC' }}>{t('paywall.title')}</h3>
        <p className="mb-8 leading-relaxed" style={{ color: '#94A3B8' }}>
          {t('paywall.desc')}{' '}
          <strong style={{ color: '#F97316' }}>€4.90</strong>.
        </p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="btn-orange w-full text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('paywall.redirecting') : <><span>{t('paywall.cta')}</span> <ArrowRight className="w-4 h-4" /></>}
        </button>
        <p className="text-xs mt-4" style={{ color: '#475569' }}>{t('paywall.secure')}</p>
      </div>
    </div>
  );
}
