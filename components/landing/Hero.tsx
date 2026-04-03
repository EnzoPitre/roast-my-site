'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { ArrowRight, Zap } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/components/Analytics';

const LOADING_STEPS = [
  { key: 'loading.fetching',    target: 15 },
  { key: 'loading.visual',      target: 30 },
  { key: 'loading.copywriting', target: 45 },
  { key: 'loading.trust',       target: 60 },
  { key: 'loading.conversion',  target: 75 },
  { key: 'loading.writing',     target: 90 },
  { key: 'loading.finalizing',  target: 99 },
] as const;


export function Hero() {
  const { t, lang } = useLanguage();
  const { status } = useSession();
  const router = useRouter();

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHtmlFallback, setShowHtmlFallback] = useState(false);
  const [manualHtml, setManualHtml] = useState('');
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [reviewAvg, setReviewAvg] = useState<string | null>(null);
  const stepTimer = useRef<NodeJS.Timeout | null>(null);
  const progressRaf = useRef<number | null>(null);

  // Fetch real review avg
  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => { if (data.average) setReviewAvg(String(data.average)); })
      .catch(() => {});
  }, []);

  // Live counter count-up
  useEffect(() => {
    const target = 312;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setLiveCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // Typewriter effect
  const rawHeadlines = t('hero.headlines');
  
  const headlines = useMemo(() => {
    return Array.isArray(rawHeadlines) ? rawHeadlines : [typeof rawHeadlines === 'string' ? rawHeadlines : ''];
  }, [rawHeadlines]);

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!headlines || headlines.length === 0) return;
    const currentHeadline = headlines[currentLineIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && currentText === currentHeadline) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentLineIndex((prev) => (prev + 1) % headlines.length);
    } else {
      const nextText = isDeleting
        ? currentHeadline.substring(0, currentText.length - 1)
        : currentHeadline.substring(0, currentText.length + 1);
      timeout = setTimeout(() => setCurrentText(nextText), isDeleting ? 30 : 60);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentLineIndex, headlines]);

  // Animate progress bar smoothly toward a target value
  const animateToTarget = (target: number) => {
    if (progressRaf.current) cancelAnimationFrame(progressRaf.current);
    const step = () => {
      setProgress(prev => {
        if (prev >= target) return target;
        const next = prev + Math.max(0.3, (target - prev) * 0.04);
        if (next < target) { progressRaf.current = requestAnimationFrame(step); }
        return Math.min(next, target);
      });
    };
    progressRaf.current = requestAnimationFrame(step);
  };

  const startLoadingProgress = () => {
    setProgress(0);
    setStepIndex(0);
    let idx = 0;
    animateToTarget(LOADING_STEPS[0].target);
    stepTimer.current = setInterval(() => {
      idx = Math.min(idx + 1, LOADING_STEPS.length - 1);
      setStepIndex(idx);
      animateToTarget(LOADING_STEPS[idx].target);
    }, 3000);
  };

  const stopLoadingProgress = (success: boolean) => {
    if (stepTimer.current) { clearInterval(stepTimer.current); stepTimer.current = null; }
    if (success) animateToTarget(100);
    else {
      if (progressRaf.current) cancelAnimationFrame(progressRaf.current);
      setProgress(0);
      setStepIndex(0);
    }
  };

  const ERROR_CODE_KEYS: Record<string, string> = {
    bot_blocked: 'error.bot_blocked',
    timeout: 'error.timeout',
    unreachable: 'error.unreachable',
    invalid_url: 'error.invalid_url',
  };

  const SHOW_HTML_FALLBACK_CODES = new Set(['bot_blocked', 'unreachable', 'timeout']);

  const handleRoast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') { signIn('google'); return; }
    setError(null); setShowHtmlFallback(false); setLoading(true);
    startLoadingProgress();
    trackEvent('roast_submitted', { url });
    try {
      const body: Record<string, string> = { url, lang };
      if (manualHtml.trim().length > 100) body.manualHtml = manualHtml;
      const res = await fetch("/api/roast", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        const code = data.errorCode as string | undefined;
        const msgKey = (code && ERROR_CODE_KEYS[code]) ? ERROR_CODE_KEYS[code] : null;
        const msg = msgKey ? (t(msgKey as Parameters<typeof t>[0]) as string) : (data.error || 'Failed to generate roast');
        if (code && SHOW_HTML_FALLBACK_CODES.has(code)) setShowHtmlFallback(true);
        throw new Error(msg);
      }
      stopLoadingProgress(true);
      trackEvent('roast_completed', { roast_id: data.roastId });
      setTimeout(() => router.push(`/${lang}/roast/${data.roastId}`), 400);
    } catch (err: unknown) {
      stopLoadingProgress(false);
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  const avatars = ['#F97316', '#EA580C', '#FB923C', '#C2410C', '#9A3412'];
  const initials = ['JD', 'SR', 'MK', 'AL', 'PT'];

  return (
    <section className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center relative flex flex-col items-center min-h-[85vh] justify-center">


      <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black mb-6 tracking-tighter leading-[1.05] text-[#F8FAFC] text-balance h-auto min-h-[3em] md:min-h-[2.5em] flex items-center justify-center">
        {currentText}
        <span className="w-1 h-12 bg-orange-500 animate-pulse ml-2 mb-1" style={{ animationDuration: '0.8s' }} />
      </h1>

      <p className="text-lg md:text-[1.25rem] mb-12 max-w-2xl mx-auto font-medium leading-relaxed z-10" style={{ color: '#CBD5E1' }}>
        {t('hero.subheadline')}
      </p>

      {/* Input Form */}
      <form onSubmit={handleRoast} className="w-full max-w-2xl mx-auto relative group z-10">
        <div className="absolute -inset-[2px] rounded-2xl blur-sm transition-opacity duration-500 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.4), rgba(234,88,12,0.3))', opacity: inputFocused ? 1 : 0 }} />
        <div className="relative flex flex-col sm:flex-row gap-2 p-2 rounded-2xl shadow-2xl glass-card transition-colors">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={t('hero.placeholder')}
            required
            disabled={loading}
            className="flex-1 bg-transparent px-5 py-4 outline-none text-lg disabled:opacity-50 text-[#F8FAFC] w-full"
          />
          <button
            type="submit"
            disabled={loading || status === 'loading' || (status === 'authenticated' && !url)}
            className="w-full sm:w-auto btn-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-pulse-orange cursor-pointer whitespace-nowrap"
          >
            {status === 'loading' ? (
              <div className="w-28 h-5 rounded animate-pulse bg-white/20" />
            ) : status === 'unauthenticated' ? (
              <>{t('hero.auth_cta')} <ArrowRight className="w-4 h-4" /></>
            ) : loading ? (
              <span>{t('hero.roasting')}</span>
            ) : (
              <>{t('hero.cta')} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 rounded-xl text-left w-full" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', color: '#FCA5A5', position: 'absolute', top: '100%', left: 0 }}>
            <p className="font-medium text-sm text-center">{error}</p>
          </div>
        )}
      </form>

      {/* HTML Fallback — shown when fetch is blocked */}
      {showHtmlFallback && !loading && (
        <div className="w-full max-w-2xl mx-auto mt-20 z-10" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '16px', padding: '1.5rem' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#F97316' }}>
            {t('error.html_label' as Parameters<typeof t>[0]) as string}
          </p>
          <textarea
            value={manualHtml}
            onChange={e => setManualHtml(e.target.value)}
            placeholder={t('error.html_placeholder' as Parameters<typeof t>[0]) as string}
            rows={6}
            className="w-full text-xs font-mono rounded-xl px-4 py-3 outline-none resize-y"
            style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: '#94A3B8' }}
          />
          <button
            onClick={(e) => { handleRoast(e as any); }}
            disabled={manualHtml.trim().length < 100}
            className="btn-orange mt-3 w-full flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('error.html_cta' as Parameters<typeof t>[0]) as string}
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div
        className="w-full max-w-2xl mx-auto mt-6 z-10"
        style={{
          opacity: loading ? 1 : 0,
          transform: loading ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F97316' }}>
            {t(LOADING_STEPS[stepIndex].key as Parameters<typeof t>[0]) as string}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div style={{ height: '4px', borderRadius: '9999px', background: 'rgba(249,115,22,0.15)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, #F97316, #EA580C)',
            width: `${progress}%`,
            transition: 'width 0.1s linear',
            boxShadow: '0 0 8px rgba(249,115,22,0.6)',
          }} />
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 z-10 glass-card px-5 py-3 rounded-full">
        <div className="flex -space-x-2">
          {avatars.map((color, i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] flex items-center justify-center text-[10px] font-bold text-white shadow-lg" style={{ backgroundColor: color }}>
              {initials[i]}
            </div>
          ))}
        </div>
        <div className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>
          {t('social.trust.founders')}
        </div>
        {reviewAvg && (
          <>
            <span style={{ color: '#1E293B' }}>·</span>
            <div className="flex items-center gap-1">
              <span style={{ color: '#F97316', fontSize: '13px' }}>★</span>
              <span className="text-sm font-black" style={{ color: '#F8FAFC' }}>{reviewAvg}</span>
              <span className="text-xs font-medium" style={{ color: '#64748B' }}>/5</span>
            </div>
          </>
        )}
      </div>

      {/* Trust Badges */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 z-10">
        <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-orange-500/30 bg-[#13131A] text-[#94A3B8]">
          <Zap className="w-3.5 h-3.5 text-orange-500" /> {t('badge.time')}
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-orange-500/30 bg-[#13131A] text-[#94A3B8]">
          <span className="text-orange-500">🔒</span> {t('badge.privacy')}
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-orange-500/30 bg-[#13131A] text-[#94A3B8]">
          <span className="text-orange-500">💳</span> {t('badge.free')}
        </div>
      </div>

      {/* Live Counter */}
      <div className="mt-6 z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
        <span className="text-sm font-bold" style={{ color: '#64748B' }}>
          <span style={{ color: '#22C55E', fontWeight: 900 }}>{liveCount}</span>
          {lang === 'fr' ? ' sites audités et comptant' : ' sites roasted and counting'}
        </span>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1" style={{ opacity: loading ? 0 : 0.5 }}>
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>scroll</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: 'bounce 1.4s ease-in-out infinite' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

    </section>
  );
}
