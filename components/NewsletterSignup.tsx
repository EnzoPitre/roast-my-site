'use client';
import { useState } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface Props {
  lang: Language;
  compact?: boolean;
}

export function NewsletterSignup({ lang, compact = false }: Props) {
  const t = (key: TranslationKey) => translations[lang][key] as string;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus('error'); return; }
      setStatus(data.duplicate ? 'duplicate' : 'success');
    } catch {
      setStatus('error');
    }
  };

  const done = status === 'success' || status === 'duplicate';
  const msg = status === 'success' ? t('newsletter.success')
    : status === 'duplicate' ? t('newsletter.duplicate')
    : status === 'error' ? t('newsletter.error')
    : null;

  if (compact) {
    return (
      <div>
        {done ? (
          <p className="text-sm font-bold" style={{ color: '#22C55E' }}>{msg}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              className="flex-1 bg-transparent px-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
            />
            <button type="submit" disabled={status === 'loading'} className="btn-orange text-sm px-4 py-2 cursor-pointer disabled:opacity-50 shrink-0">
              {t('newsletter.cta')}
            </button>
          </form>
        )}
        {status === 'error' && <p className="text-xs mt-1 font-medium" style={{ color: '#EF4444' }}>{msg}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-[20px] p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,88,12,0.04))', border: '1px solid rgba(249,115,22,0.2)' }}>
      <div className="text-3xl mb-3">📬</div>
      <h3 className="text-xl font-black mb-2 tracking-tight" style={{ color: '#F8FAFC' }}>{t('newsletter.title')}</h3>
      <p className="text-sm font-medium mb-6" style={{ color: '#94A3B8', maxWidth: '40ch', margin: '0 auto 1.5rem' }}>{t('newsletter.desc')}</p>
      {done ? (
        <p className="font-bold text-base" style={{ color: '#22C55E' }}>{msg}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            required
            className="flex-1 px-5 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.25)', color: '#F8FAFC' }}
          />
          <button type="submit" disabled={status === 'loading'} className="btn-orange cursor-pointer disabled:opacity-50 shrink-0">
            {status === 'loading' ? '...' : t('newsletter.cta')}
          </button>
        </form>
      )}
      {status === 'error' && <p className="text-xs mt-3 font-medium" style={{ color: '#EF4444' }}>{msg}</p>}
    </div>
  );
}
