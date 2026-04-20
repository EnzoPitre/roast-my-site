'use client';
import { useState } from 'react';
import { ScoreTable } from '@/components/ScoreTable';
import { FixPlan } from '@/components/FixPlan';
import { useLanguage } from '@/components/LanguageProvider';
import { ArrowRight, Lock, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface RoastBodyProps {
  roast: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  lang: string;
  showPaywall: boolean;
}

function DualPaywallCTA({ roastId, lang }: { roastId: string; lang: string }) {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

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

  const pricingHref = `/${lang}${lang === 'fr' ? '/tarifs' : '/pricing'}`;

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
        {t('paywall.title')}
      </h3>
      <p className="mb-7 text-sm leading-relaxed max-w-sm mx-auto" style={{ color: '#94A3B8' }}>
        {t('paywall.desc')}
      </p>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-orange inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-8 w-full max-w-xs"
      >
        {loading
          ? t('paywall.redirecting')
          : <><span>{t('paywall.cta')}</span><ArrowRight className="w-4 h-4" /></>}
      </button>

      <p className="text-xs font-semibold my-4" style={{ color: '#475569' }}>{t('paywall.or')}</p>

      <Link
        href={pricingHref}
        className="inline-flex items-center justify-center gap-2 w-full max-w-xs px-8 py-3 rounded-xl font-black text-sm transition-all cursor-pointer"
        style={{ background: 'transparent', border: '1px solid rgba(249,115,22,0.4)', color: '#F97316' }}
      >
        {t('paywall.pro_cta')}
      </Link>

      <p className="text-xs mt-5" style={{ color: '#475569' }}>{t('paywall.secure')}</p>
    </div>
  );
}

function PreviewScoreBadge({ score }: { score: number }) {
  if (score >= 8) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
      <CheckCircle2 className="w-3 h-3" /> {score}/10
    </span>
  );
  if (score >= 5) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.35)' }}>
      <AlertTriangle className="w-3 h-3" /> {score}/10
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.35)' }}>
      <AlertCircle className="w-3 h-3" /> {score}/10
    </span>
  );
}

const scoreLabels: Record<string, string> = {
  firstImpression: 'First Impression',
  visualDesign: 'Visual Design',
  copywriting: 'Copywriting',
  trust: 'Trust & Credibility',
  ux: 'Navigation & UX Flow',
  mobile: 'Mobile Experience',
  conversion: 'Conversion Arch.',
};

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
      // silently fail
    } finally {
      setTranslating(false);
    }
  };

  // ── PREVIEW MODE (unpaid) ─────────────────────────────────────────────
  if (showPaywall) {
    const killList = (roast.killList as any[]) || []; // eslint-disable-line @typescript-eslint/no-explicit-any
    const scores = (roast.scores as Record<string, { score: number; verdict: string }>) || {};
    const scoreEntries = Object.entries(scores);
    const previewScores = scoreEntries.slice(0, 3);
    const lockedScores = scoreEntries.slice(3);

    return (
      <div className="mt-8 pt-10" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
        {/* Preview badge */}
        <div className="flex items-center gap-2 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.25)' }}>
            👁️ {t('paywall.preview_label')}
          </span>
          <span className="text-xs font-medium" style={{ color: '#475569' }}>— {t('paywall.preview_hint')}</span>
        </div>

        {/* Kill list: 1 real + 2 ghost */}
        <h3 className="font-black mb-2 text-2xl tracking-tight" style={{ color: '#F8FAFC' }}>{t('roast.kill_list.title')}</h3>
        <p className="mb-8 font-medium" style={{ color: '#94A3B8' }}>{t('roast.kill_list.desc')}</p>
        <div className="grid gap-5 sm:grid-cols-3 mb-16">
          {killList[0] && (
            <div className="rounded-[16px] p-6 relative overflow-hidden" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="absolute -right-4 -bottom-6 font-black pointer-events-none leading-none select-none" style={{ fontSize: '120px', color: 'rgba(249,115,22,0.05)' }}>
                {killList[0].rank}
              </span>
              <h4 className="font-black mb-2 text-base leading-tight relative z-10" style={{ color: '#F8FAFC' }}>{killList[0].issue}</h4>
              <p className="text-sm relative z-10 leading-relaxed font-medium" style={{ color: '#94A3B8' }}>{killList[0].why}</p>
            </div>
          )}
          {[1, 2].map(i => (
            <div key={i} className="rounded-[16px] p-6 relative overflow-hidden select-none" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', filter: 'blur(5px)', pointerEvents: 'none' }}>
              <div className="h-4 rounded mb-3" style={{ background: 'rgba(239,68,68,0.2)', width: '80%' }} />
              <div className="h-3 rounded mb-2" style={{ background: 'rgba(148,163,184,0.15)', width: '100%' }} />
              <div className="h-3 rounded mb-2" style={{ background: 'rgba(148,163,184,0.15)', width: '90%' }} />
              <div className="h-3 rounded" style={{ background: 'rgba(148,163,184,0.15)', width: '70%' }} />
            </div>
          ))}
        </div>

        {/* Dimension scores: 3 real + rest blurred */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3" style={{ color: '#F8FAFC' }}>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>1</span>
              {t('roast.dim_breakdown')}
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}>
              3 / 7 {t('paywall.scores_shown')}
            </span>
          </div>

          <div className="rounded-[16px] overflow-hidden" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(249,115,22,0.12)', padding: '12px 24px' }}>
              <div className="grid text-[10px] font-black uppercase tracking-widest" style={{ gridTemplateColumns: '1fr 100px 1fr', color: '#64748B' }}>
                <span>Dimension</span>
                <span>Score</span>
                <span>Verdict</span>
              </div>
            </div>
            {previewScores.map(([key, sd], idx) => (
              <div key={key} className="grid items-start px-6 py-4" style={{ gridTemplateColumns: '1fr 100px 1fr', borderTop: idx > 0 ? '1px solid rgba(249,115,22,0.06)' : 'none', gap: '12px' }}>
                <div>
                  <div className="text-sm font-bold" style={{ color: '#F8FAFC' }}>{scoreLabels[key] || key}</div>
                  <div style={{ height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: '6px' }}>
                    <div style={{ height: '100%', borderRadius: '9999px', background: sd.score >= 8 ? '#22C55E' : sd.score >= 5 ? '#F97316' : '#EF4444', width: `${(sd.score / 10) * 100}%`, transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)' }} />
                  </div>
                </div>
                <div className="pt-0.5"><PreviewScoreBadge score={sd.score} /></div>
                <div className="text-sm italic pt-0.5" style={{ color: '#94A3B8' }}>&quot;{sd.verdict}&quot;</div>
              </div>
            ))}
            {lockedScores.length > 0 && (
              <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}>
                {lockedScores.map(([key, sd], idx) => (
                  <div key={key} className="grid items-start px-6 py-4" style={{ gridTemplateColumns: '1fr 100px 1fr', borderTop: '1px solid rgba(249,115,22,0.06)', gap: '12px' }}>
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#F8FAFC' }}>{scoreLabels[key] || key}</div>
                      <div style={{ height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: '6px' }}>
                        <div style={{ height: '100%', borderRadius: '9999px', background: sd.score >= 8 ? '#22C55E' : sd.score >= 5 ? '#F97316' : '#EF4444', width: `${(sd.score / 10) * 100}%` }} />
                      </div>
                    </div>
                    <div className="pt-0.5"><PreviewScoreBadge score={sd.score} /></div>
                    <div className="text-sm italic pt-0.5" style={{ color: '#94A3B8' }}>&quot;{sd.verdict}&quot;</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DualPaywallCTA roastId={roast.id} lang={lang} />
      </div>
    );
  }

  // ── FULL UNLOCKED CONTENT ──────────────────────────────────────────────
  return (
    <div>
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
          {(data.killList as any[])?.map((issue: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
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
