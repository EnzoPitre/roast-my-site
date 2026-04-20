'use client';
import { useRef, useState, useEffect } from 'react';
import { Printer, Share, Flame, X as XIcon, Code, ImageIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/components/Analytics';

interface RoastCardProps {
  roast: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  children: React.ReactNode;
}

export function RoastCard({ roast, children }: RoastCardProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  };

  // Embed modal
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const embedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getEmbedCode = () =>
    `<iframe src="https://roastmysite.com/${lang}/embed/${roast.id}" width="280" height="120" frameborder="0" style="border:none;border-radius:12px;"></iframe>`;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(t('card.copied') as string);
    trackEvent('share_report', { roast_id: roast.id });
  };

  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePrint = async () => {
    if (!roast.isPaid) {
      showToast('Unlock the full report to download PDF ↓');
      document.getElementById('paywall-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const { generatePdf } = await import('@/lib/generatePdf');
      await generatePdf(roast, lang as 'en' | 'fr');
    } catch {
      showToast('PDF generation failed — try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleTweet = () => {
    const raw = t('card.tweet_text') as string;
    const text = raw.replace('{score}', String(roast.globalScore));
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank',
      'noopener,noreferrer,width=560,height=420'
    );
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(getEmbedCode());
    if (embedTimer.current) clearTimeout(embedTimer.current);
    setEmbedCopied(true);
    embedTimer.current = setTimeout(() => setEmbedCopied(false), 2000);
  };

  // Share Score modal
  const [showShareScore, setShowShareScore] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleCopyImage = async () => {
    if (!shareCardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#0A0A0F',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob(async blob => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 2000);
      }, 'image/png');
    } catch {
      showToast('Screenshot the card to share!');
    }
  };

  // Score count-up animation
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    const target = roast.globalScore;
    const duration = 800;
    const start = performance.now();
    const raf = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [roast.globalScore]);

  const scoreColor = roast.globalScore >= 8 ? '#22C55E' : roast.globalScore >= 5 ? '#F97316' : '#EF4444';

  const displaySummary = roast.isPaid
    ? roast.summary
    : (() => {
        const sentences = (roast.summary as string)?.split(/(?<=\.)\s+/) ?? [];
        return sentences.length > 2 ? sentences.slice(0, 2).join(' ') + '…' : roast.summary;
      })();

  const actionBtnStyle = {
    color: '#94A3B8',
    background: 'rgba(249,115,22,0.05)',
    border: '1px solid rgba(249,115,22,0.15)',
  };

  return (
    <>
      <div className="overflow-hidden max-w-5xl mx-auto mb-20 rounded-[16px]" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.25)', boxShadow: '0 0 50px rgba(249,115,22,0.08)' }}>

        {/* Header */}
        <div className="p-6 sm:p-10 relative overflow-hidden" style={{ background: '#0A0A0F', borderBottom: '1px solid rgba(249,115,22,0.12)' }}>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-20 animate-float" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.5), transparent 70%)', filter: 'blur(60px)', transform: 'translate(30%, -30%)' }} />

          {/* Badge row */}
          <div className="relative z-10 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest" style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <Flame className="w-3.5 h-3.5" /> {t('card.brutal_audit')}
            </div>
          </div>

          {/* Two-column grid: info + score */}
          <div className="roastcard-grid relative z-10" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: '2rem',
            alignItems: 'start',
          }}>
            {/* Left: URL, summary, competitor — min-width:0 prevents grid blowout */}
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <h1
                className="font-black tracking-tight leading-snug mb-3"
                style={{ color: '#F8FAFC', fontSize: '1.1rem', wordBreak: 'break-all', overflowWrap: 'anywhere', maxWidth: '100%' }}
              >
                {roast.url}
              </h1>
              <p className="mb-4" style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>{displaySummary}</p>

              {roast.competitorComparison && (
                <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', width: '100%', boxSizing: 'border-box' }}>
                  <span className="text-base leading-none mt-0.5 shrink-0">📊</span>
                  <p className="font-medium leading-relaxed text-sm" style={{ color: '#E2E8F0', minWidth: 0, wordBreak: 'break-word' }}>{roast.competitorComparison}</p>
                </div>
              )}
            </div>

            {/* Right: Score + conversion estimate */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '160px', flexShrink: 0, minWidth: '160px' }}>
              <div className="rounded-2xl p-5 flex flex-col items-center w-full" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
                <span className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>{t('card.global_score')}</span>
                <span className="text-5xl font-black tracking-tight" style={{ color: scoreColor }}>{displayScore}</span>
                <span className="text-[10px] font-semibold mt-1.5" style={{ color: '#475569' }}>{t('card.out_of')}</span>
              </div>

              {roast.conversionEstimate && (
                <div className="rounded-xl px-4 py-3 text-center w-full" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: '#64748B' }}>{t('card.conv_estimate')}</span>
                  <span className="text-base font-black" style={{ color: '#34D399' }}>{roast.conversionEstimate}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Opportunity Banner */}
        {roast.topOpportunity && (
          <div className="px-8 py-5 flex items-start gap-4" style={{ background: 'rgba(249,115,22,0.07)', borderBottom: '1px solid rgba(249,115,22,0.12)' }}>
            <div className="p-2 rounded-lg shrink-0 text-xl" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>🎯</div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-1" style={{ color: '#F97316' }}>{t('card.top_opportunity')}</h4>
              <p className="font-semibold text-base" style={{ color: '#F8FAFC' }}>{roast.topOpportunity}</p>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="px-8 py-3.5 flex flex-wrap justify-between items-center gap-2 print:hidden" style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
            {t('card.scanned')} {new Date(roast.createdAt).toISOString().split('T')[0]}
          </span>
          <div className="flex flex-wrap gap-2">
            {/* Share */}
            <button onClick={handleShare} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors" style={actionBtnStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
              <Share className="w-3.5 h-3.5" /> {t('card.share')}
            </button>
            {/* X / Twitter */}
            <button onClick={handleTweet} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors" style={actionBtnStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
              <XIcon className="w-3.5 h-3.5" /> {t('card.share_x')}
            </button>
            {/* Embed */}
            <button onClick={() => setShowEmbed(true)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors" style={actionBtnStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
              <Code className="w-3.5 h-3.5" /> {t('card.embed')}
            </button>
            {/* Share Score */}
            <button onClick={() => setShowShareScore(true)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors" style={actionBtnStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
              <ImageIcon className="w-3.5 h-3.5" /> {t('card.share_score')}
            </button>
            {/* Print/PDF */}
            <button onClick={handlePrint} disabled={pdfLoading} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={actionBtnStyle}
              onMouseEnter={e => { if (!pdfLoading) e.currentTarget.style.color = '#F97316'; }}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
              {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
              {pdfLoading ? 'Generating...' : 'Save PDF'}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 relative" style={{ background: '#0D0D14' }}>
          {children}
        </div>
      </div>

      {/* Toast notification */}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
        background: '#13131A', border: '1px solid rgba(249,115,22,0.5)',
        color: '#F8FAFC', padding: '12px 20px', borderRadius: '12px',
        fontSize: '14px', fontWeight: 600,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        opacity: toastVisible ? 1 : 0,
        transform: toastVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: 'none',
      }}>
        🔥 {toastMsg}
      </div>

      {/* Share Score modal */}
      {showShareScore && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setShowShareScore(false)}
        >
          <div style={{ maxWidth: '580px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#F8FAFC', fontWeight: 900, fontSize: '18px', marginBottom: '6px' }}>{t('share.modal.title')}</h3>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '16px' }}>{t('share.modal.hint')}</p>

            {/* The shareable card — captured by html2canvas */}
            <div ref={shareCardRef} style={{
              width: '500px', height: '280px', background: '#0A0A0F',
              borderRadius: '16px', padding: '28px', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(249,115,22,0.3)',
            }}>
              {/* Decorative glow */}
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

              {/* Top row: brand + score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                    <span style={{ color: '#F97316' }}>Roast</span>
                    <span style={{ color: '#F8FAFC' }}> My Site</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>URL audited</div>
                  <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, maxWidth: '280px', wordBreak: 'break-all' }}>
                    {roast.url.length > 45 ? roast.url.slice(0, 45) + '…' : roast.url}
                  </div>
                </div>
                <div style={{ textAlign: 'center', background: '#13131A', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '14px', padding: '12px 20px' }}>
                  <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Score</div>
                  <div style={{ fontSize: '52px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{roast.globalScore}</div>
                  <div style={{ fontSize: '10px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>/ 10</div>
                </div>
              </div>

              {/* Middle: top issue */}
              {roast.killList?.[0] && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', position: 'relative' }}>
                  <div style={{ fontSize: '9px', color: '#EF4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{t('share.modal.top_issue')}</div>
                  <div style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: 700 }}>{(roast.killList as any[])[0].issue}</div>
                </div>
              )}

              {/* Bottom: subtitle + CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>{t('share.modal.subtitle')}</div>
                <div style={{ fontSize: '11px', color: '#F97316', fontWeight: 800 }}>{t('share.modal.roast_url')}</div>
              </div>

              {/* Bottom gradient bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F97316, #EA580C)' }} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCopyImage}
                className="btn-orange flex-1 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                {imageCopied ? t('share.modal.copied_image') : t('share.modal.copy_image')}
              </button>
              <button
                onClick={() => setShowShareScore(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Embed modal */}
      {showEmbed && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowEmbed(false)}
        >
          <div
            style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '16px', padding: '32px', maxWidth: '520px', width: '90%' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: '#F8FAFC', fontWeight: 900, fontSize: '18px', marginBottom: '8px' }}>{t('embed.modal.title')}</h3>
            <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '20px' }}>{t('embed.modal.desc')}</p>

            {/* Preview */}
            <p style={{ color: '#64748B', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>{t('embed.modal.preview')}</p>
            <div style={{ marginBottom: '20px', background: '#0A0A0F', borderRadius: '12px', padding: '16px', display: 'inline-block' }}>
              <iframe
                src={`/${lang}/embed/${roast.id}`}
                width="280"
                height="120"
                style={{ border: 'none', borderRadius: '12px', display: 'block' }}
              />
            </div>

            {/* Code */}
            <textarea
              readOnly
              value={getEmbedCode()}
              rows={3}
              style={{ width: '100%', background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '8px', padding: '12px', color: '#94A3B8', fontSize: '11px', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }}
            />
            <button
              onClick={handleCopyEmbed}
              className="btn-orange mt-4 w-full cursor-pointer"
              style={{ display: 'block', textAlign: 'center' }}
            >
              {embedCopied ? t('embed.modal.copied') : t('embed.modal.copy')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
