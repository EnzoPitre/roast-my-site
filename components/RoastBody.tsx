'use client';
import { useState } from 'react';
import { ScoreTable } from '@/components/ScoreTable';
import { FixPlan } from '@/components/FixPlan';
import { useLanguage } from '@/components/LanguageProvider';
import { ArrowRight, Lock } from 'lucide-react';

interface RoastBodyProps {
  roast: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  lang: string;
  showPaywall: boolean;
}

function InlinePaywallCTA({ roastId }: { roastId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roastId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="paywall-section"
      className="rounded-[16px] p-8 sm:p-10 text-center"
      style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.4)', boxShadow: '0 0 40px rgba(249,115,22,0.08)' }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.35)' }}>
        <Lock className="w-6 h-6" style={{ color: '#F97316' }} />
      </div>
      <h3 className="text-xl font-black mb-3 tracking-tight" style={{ color: '#F8FAFC' }}>
        🔒 Unlock the full report for <span style={{ color: '#F97316' }}>€4.90</span>
      </h3>
      <p className="mb-7 text-sm leading-relaxed max-w-sm mx-auto" style={{ color: '#94A3B8' }}>
        Get the complete kill list, dimension scores, fix plan, quick wins, and personalised recommendations.
      </p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-orange inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-8"
      >
        {loading ? 'Redirecting…' : <><span>Pay €4.90 — Unlock Report</span><ArrowRight className="w-4 h-4" /></>}
      </button>
      <p className="text-xs mt-4" style={{ color: '#475569' }}>Secure payment via Stripe · One-time · Instant access</p>
    </div>
  );
}

export function RoastBody({ roast, lang, showPaywall }: RoastBodyProps) {
  const { t } = useLanguage();
  const [translating, setTranslating] = useState(false);
  const [translatedRoast, setTranslatedRoast] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [showTranslated, setShowTranslated] = useState(false);

  const data = showTranslated && translatedRoast ? { ...roast, ...translatedRoast } : roast;

  const handleTranslate = async () => {
    if (translatedRoast) {
      setShowTranslated(prev => !prev);
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roast }),
      });
      const json = await res.json();
      if (json.translated) {
        setTranslatedRoast(json.translated);
        setShowTranslated(true);
      }
    } catch {
      // silently fail — keep original content
    } finally {
      setTranslating(false);
    }
  };

  if (showPaywall) {
    return (
      <div className="mt-8 pt-10" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
        <InlinePaywallCTA roastId={roast.id} />
      </div>
    );
  }

  return (
    <div>
      {/* Translate button — only in FR locale since AI output is in English */}
      {lang === 'fr' && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: '#94A3B8', background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}
            onMouseEnter={e => { if (!translating) (e.currentTarget as HTMLButtonElement).style.color = '#F97316'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8'; }}
          >
            🌐 {translating
              ? 'Traduction en cours...'
              : showTranslated
                ? 'Voir en anglais'
                : 'Traduire en français'}
          </button>
        </div>
      )}

      {/* Kill List */}
      <div className="mt-8 pt-10" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
        <h3 className="font-black mb-2 text-2xl tracking-tight" style={{ color: '#F8FAFC' }}>{t('roast.kill_list.title')}</h3>
        <p className="mb-8 font-medium" style={{ color: '#94A3B8' }}>{t('roast.kill_list.desc')}</p>
        <div className="grid gap-5 sm:grid-cols-3 mb-16">
          {(data.killList as any[])?.map((issue: any, idx: number) => (
            <div key={idx} className="rounded-[16px] p-6 relative overflow-hidden cursor-default group hover:border-[#F97316]/[0.4] transition-colors" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="absolute -right-4 -bottom-6 font-black pointer-events-none leading-none select-none" style={{ fontSize: '120px', color: 'rgba(249,115,22,0.05)' }}>
                {issue.rank}
              </span>
              <h4 className="font-black mb-2 text-base leading-tight relative z-10" style={{ color: '#F8FAFC' }}>{issue.issue}</h4>
              <p className="text-sm relative z-10 leading-relaxed font-medium" style={{ color: '#94A3B8' }}>{issue.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="mb-14">
        <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3" style={{ color: '#F8FAFC' }}>
          <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>1</span>
          {t('roast.dim_breakdown')}
        </h2>
        {/* @ts-ignore JSON safe */}
        <ScoreTable scores={data.scores} />
      </div>

      {/* Fix Plan */}
      <div className="mb-14">
        <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3" style={{ color: '#F8FAFC' }}>
          <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>2</span>
          {t('roast.fix_plan')}
        </h2>
        {/* @ts-ignore JSON safe */}
        <FixPlan plan={data.fixPlan} quickWins={data.quickWins} />
      </div>

      {/* Encouragement */}
      <div className="mt-4 rounded-[16px] p-8 sm:p-10" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
        <h3 className="font-black mb-3 text-xs uppercase tracking-widest flex items-center gap-2" style={{ color: '#F97316' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: '#F97316' }} /> {t('roast.encouragement')}
        </h3>
        <p className="font-medium text-lg leading-relaxed italic" style={{ color: '#CBD5E1' }}>&ldquo;{data.encouragement}&rdquo;</p>
      </div>
    </div>
  );
}
