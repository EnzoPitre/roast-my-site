'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { Language, TranslationKey } from '@/lib/translations';
import { Header } from '@/components/Header';
import { signIn, useSession } from 'next-auth/react';
import { ArrowRight, Flame } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DimScore {
  score: number;
  verdict: string;
}

interface KillItem {
  rank: number;
  issue: string;
  why: string;
}

interface RoastResult {
  roastId: string;
  globalScore: number;
  url: string;
  scores: Record<string, DimScore>;
  killList: KillItem[];
  summary: string;
}

type SlotState = 'idle' | 'loading' | 'done' | 'error';

// ─── Dimension label map ──────────────────────────────────────────────────────
const DIM_LABELS: Record<string, string> = {
  firstImpression: 'First Impression',
  visualDesign:    'Visual Design',
  copywriting:     'Copywriting',
  trust:           'Trust Signals',
  ux:              'UX / Navigation',
  mobile:          'Mobile',
  conversion:      'Conversion',
};

// ─── Inline CompareScoreTable (local — doesn't touch shared ScoreTable) ───────
function CompareScoreTable({ scores, otherScores }: { scores: Record<string, DimScore>; otherScores: Record<string, DimScore> }) {
  const keys = Object.keys(DIM_LABELS);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(249,115,22,0.12)' }}>
      {keys.map((key, i) => {
        const mine = scores[key];
        const theirs = otherScores[key];
        if (!mine) return null;
        const higher = theirs ? mine.score > theirs.score : null;
        const lower  = theirs ? mine.score < theirs.score : null;
        const dotColor = higher ? '#22C55E' : lower ? '#EF4444' : '#F97316';
        return (
          <div key={key} className="flex items-center gap-4 px-4 py-3" style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)', borderTop: i > 0 ? '1px solid rgba(249,115,22,0.06)' : 'none' }}>
            <span className="text-xs font-semibold w-32 shrink-0" style={{ color: '#64748B' }}>{DIM_LABELS[key] ?? key}</span>
            <span className="text-lg font-black w-8 text-center" style={{ color: dotColor }}>{mine.score}</span>
            <span className="text-xs flex-1 leading-relaxed" style={{ color: '#94A3B8' }}>{mine.verdict}</span>
            {higher !== null && (
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0" style={{ background: higher ? 'rgba(34,197,94,0.1)' : lower ? 'rgba(239,68,68,0.1)' : 'transparent', color: dotColor }}>
                {higher ? '▲' : lower ? '▼' : '='}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="rounded-[16px] p-6 animate-pulse" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}>
      <div className="h-6 w-3/4 rounded mb-4" style={{ background: '#1E293B' }} />
      <div className="h-4 w-1/2 rounded mb-8" style={{ background: '#1E293B' }} />
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-3 rounded mb-3" style={{ background: '#1E293B', width: `${60 + (i * 5) % 30}%` }} />
      ))}
    </div>
  );
}

// ─── Result column ────────────────────────────────────────────────────────────
function ResultColumn({ result, other }: { result: RoastResult; other: RoastResult }) {
  const scoreColor = result.globalScore >= 8 ? '#22C55E' : result.globalScore >= 5 ? '#F97316' : '#EF4444';
  const isWinner = result.globalScore >= other.globalScore;

  return (
    <div className="rounded-[16px] overflow-hidden" style={{ background: '#13131A', border: `1px solid ${isWinner ? 'rgba(34,197,94,0.35)' : 'rgba(249,115,22,0.15)'}` }}>
      {/* Header */}
      <div className="p-6" style={{ background: '#0A0A0F', borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            {isWinner && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
                🏆 Winner
              </div>
            )}
            <h3 className="font-black text-lg break-all" style={{ color: '#F8FAFC' }}>{result.url}</h3>
          </div>
          <div className="text-center shrink-0">
            <div className="text-5xl font-black" style={{ color: scoreColor }}>{result.globalScore}</div>
            <div className="text-xs font-semibold" style={{ color: '#475569' }}>/10</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{result.summary}</p>
      </div>

      {/* Kill list */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
        <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>Top Issues</h4>
        <div className="space-y-3">
          {result.killList.slice(0, 3).map((issue, i) => (
            <div key={i} className="text-sm" style={{ color: '#E2E8F0' }}>
              <span className="font-bold">{i + 1}. {issue.issue}</span>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#64748B' }}>{issue.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scores */}
      <div className="p-5">
        <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>Scores</h4>
        <CompareScoreTable scores={result.scores} otherScores={other.scores} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const { lang: urlLang } = useParams();
  const { lang, setLang, t } = useLanguage();
  const { status } = useSession();

  const langStr = (Array.isArray(urlLang) ? urlLang[0] : urlLang) ?? 'en';

  useEffect(() => {
    if (langStr === 'en' || langStr === 'fr') {
      if (lang !== langStr) setLang(langStr as Language);
    }
  }, [langStr, lang, setLang]);

  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [state1, setState1] = useState<SlotState>('idle');
  const [state2, setState2] = useState<SlotState>('idle');
  const [result1, setResult1] = useState<RoastResult | null>(null);
  const [result2, setResult2] = useState<RoastResult | null>(null);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const isLoading = state1 === 'loading' || state2 === 'loading';

  const fetchRoast = async (
    url: string,
    setState: (s: SlotState) => void,
    setResult: (r: RoastResult) => void,
    setError: (e: string) => void,
  ) => {
    setState('loading');
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, lang: langStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Roast failed');
      setResult({
        roastId:     data.roastId,
        globalScore: data.globalScore,
        url:         data.url,
        scores:      data.scores as Record<string, DimScore>,
        killList:    data.killList as KillItem[],
        summary:     data.summary,
      });
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setState('error');
    }
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') { signIn('google'); return; }
    setError1(null); setError2(null);
    setResult1(null); setResult2(null);

    await Promise.all([
      fetchRoast(url1, setState1, setResult1 as (r: RoastResult) => void, setError1),
      fetchRoast(url2, setState2, setResult2 as (r: RoastResult) => void, setError2),
    ]);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 px-4 sm:px-6 pb-32 max-w-6xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest" style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
            <Flame className="w-3.5 h-3.5" /> Compare
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-gradient-white">{t('compare.title' as TranslationKey)}</h1>
          <p className="text-lg font-medium max-w-xl mx-auto" style={{ color: '#94A3B8' }}>{t('compare.subtitle' as TranslationKey)}</p>
        </div>

        {/* URL form */}
        <form onSubmit={handleCompare} className="max-w-3xl mx-auto mb-12">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* URL 1 */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748B' }}>{t('compare.url1' as TranslationKey)}</label>
              <input
                type="url"
                value={url1}
                onChange={e => setUrl1(e.target.value)}
                placeholder="https://site-one.com"
                required
                disabled={isLoading}
                className="w-full bg-transparent px-4 py-3 rounded-xl outline-none text-base disabled:opacity-50 text-[#F8FAFC]"
                style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}
              />
              {error1 && <p className="mt-2 text-xs font-medium" style={{ color: '#EF4444' }}>{error1}</p>}
            </div>
            {/* URL 2 */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748B' }}>{t('compare.url2' as TranslationKey)}</label>
              <input
                type="url"
                value={url2}
                onChange={e => setUrl2(e.target.value)}
                placeholder="https://site-two.com"
                required
                disabled={isLoading}
                className="w-full bg-transparent px-4 py-3 rounded-xl outline-none text-base disabled:opacity-50 text-[#F8FAFC]"
                style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}
              />
              {error2 && <p className="mt-2 text-xs font-medium" style={{ color: '#EF4444' }}>{error2}</p>}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || !url1 || !url2}
              className="btn-orange px-8 py-4 text-base flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('compare.loading' as TranslationKey) : <>{t('compare.cta' as TranslationKey)} <ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-xs font-medium" style={{ color: '#475569' }}>{t('compare.credits' as TranslationKey)}</p>
          </div>
        </form>

        {/* Loading / results */}
        {(state1 !== 'idle' || state2 !== 'idle') && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Slot 1 */}
            <div>
              {state1 === 'loading' && <Skeleton />}
              {state1 === 'done' && result1 && result2 && <ResultColumn result={result1} other={result2} />}
              {state1 === 'done' && result1 && !result2 && <Skeleton />}
            </div>

            {/* VS divider (desktop) */}
            {/* Slot 2 */}
            <div>
              {state2 === 'loading' && <Skeleton />}
              {state2 === 'done' && result2 && result1 && <ResultColumn result={result2} other={result1} />}
              {state2 === 'done' && result2 && !result1 && <Skeleton />}
            </div>
          </div>
        )}

        {/* ── Static Demo ── */}
        <DemoComparison lang={langStr} />

      </main>
    </>
  );
}

// ─── Static demo comparison ───────────────────────────────────────────────────
function DemoComparison({ lang }: { lang: string }) {
  const isFr = lang === 'fr';
  const bad: RoastResult = {
    roastId: 'demo-bad',
    globalScore: 3,
    url: 'generic-saas.com',
    summary: isFr
      ? 'Aucune hiérarchie visuelle claire, copy générique, zéro preuve sociale. Les visiteurs repartent avant même d\'avoir lu la proposition de valeur.'
      : 'No clear visual hierarchy, generic copy, zero social proof. Visitors leave before they even read the value prop.',
    scores: {
      firstImpression: { score: 2, verdict: isFr ? 'Hero trop chargé, proposition floue' : 'Cluttered hero, vague proposition' },
      visualDesign:    { score: 4, verdict: isFr ? 'Design daté, couleurs incohérentes' : 'Dated design, inconsistent colors' },
      copywriting:     { score: 2, verdict: isFr ? '"Solution innovante" ne veut rien dire' : '"Innovative solution" means nothing' },
      trust:           { score: 3, verdict: isFr ? 'Pas d\'avis, pas de logos clients' : 'No reviews, no customer logos' },
      ux:              { score: 4, verdict: isFr ? 'Navigation confuse, trop d\'options' : 'Confusing nav, too many options' },
      mobile:          { score: 3, verdict: isFr ? 'Texte illisible, boutons trop petits' : 'Text too small, buttons hard to tap' },
      conversion:      { score: 2, verdict: isFr ? 'CTA enterré, pas de friction réduite' : 'CTA buried, no friction reduction' },
    },
    killList: [
      { rank: 1, issue: isFr ? 'Titre du hero incompréhensible' : 'Incomprehensible hero headline', why: isFr ? 'Les visiteurs ne comprennent pas ce que vous vendez en 3 secondes' : 'Visitors can\'t understand what you sell in 3 seconds' },
      { rank: 2, issue: isFr ? 'Aucune preuve sociale visible' : 'No visible social proof', why: isFr ? 'Sans avis ou logos, personne ne vous fait confiance' : 'Without reviews or logos, nobody trusts you' },
      { rank: 3, issue: isFr ? 'CTA noyé dans le bas de page' : 'CTA buried at page bottom', why: isFr ? 'Les utilisateurs ne scrollent pas assez loin pour trouver le bouton' : 'Users don\'t scroll far enough to find the button' },
    ],
  };
  const good: RoastResult = {
    roastId: 'demo-good',
    globalScore: 8,
    url: 'well-optimized-saas.com',
    summary: isFr
      ? 'Proposition claire dès le premier scroll, preuve sociale visible, CTA omniprésent. Un funnel qui fait le job.'
      : 'Clear proposition above the fold, visible social proof, CTA everywhere it matters. A funnel that converts.',
    scores: {
      firstImpression: { score: 9, verdict: isFr ? 'Accroche immédiate, bénéfice limpide' : 'Hooks immediately, benefit crystal-clear' },
      visualDesign:    { score: 8, verdict: isFr ? 'Design sobre, hiérarchie maîtrisée' : 'Clean design, strong hierarchy' },
      copywriting:     { score: 8, verdict: isFr ? 'Orienté douleur, verbes d\'action' : 'Pain-oriented, action verbs' },
      trust:           { score: 9, verdict: isFr ? 'Logos, avis, garantie remboursement' : 'Logos, reviews, money-back guarantee' },
      ux:              { score: 7, verdict: isFr ? 'Navigation simple, 3 clics max' : 'Simple nav, 3 clicks max' },
      mobile:          { score: 8, verdict: isFr ? 'Thumb-friendly, rapide à charger' : 'Thumb-friendly, fast loading' },
      conversion:      { score: 9, verdict: isFr ? 'CTA présent toutes les 2 sections' : 'CTA every 2 sections, can\'t miss it' },
    },
    killList: [
      { rank: 1, issue: isFr ? 'Page pricing sans FAQ' : 'Pricing page without FAQ', why: isFr ? 'Les objections restent sans réponse juste avant l\'achat' : 'Objections go unanswered right before purchase' },
      { rank: 2, issue: isFr ? 'Pas de chat support visible' : 'No visible support chat', why: isFr ? 'Les prospects hésitants n\'ont nulle part où aller' : 'Hesitant prospects have nowhere to turn' },
      { rank: 3, issue: isFr ? 'Vitesse mobile à améliorer' : 'Mobile speed could improve', why: isFr ? 'LCP > 2.5s sur mobile = rebond avant chargement' : 'LCP > 2.5s on mobile = bounce before load' },
    ],
  };

  return (
    <div className="mt-20 pt-16" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4"
          style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
          {isFr ? 'Exemple de rapport' : 'Sample report'}
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ color: '#F8FAFC' }}>
          {isFr ? 'Voici à quoi ressemble un vrai comparatif' : 'Here\'s what a real comparison looks like'}
        </h2>
        <p className="text-base font-medium" style={{ color: '#94A3B8' }}>
          {isFr ? 'Deux sites dans le même secteur. L\'écart est saisissant.' : 'Two sites in the same niche. The gap is striking.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ResultColumn result={bad} other={good} />
        <ResultColumn result={good} other={bad} />
      </div>
    </div>
  );
}
