'use client';
import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="btn-orange w-full text-center cursor-pointer disabled:opacity-60"
    >
      {loading ? t('pricing.pro.subscribing') : t('pricing.pro.cta')}
    </button>
  );
}
