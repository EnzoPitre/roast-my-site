'use client';
import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BadgeProps { score: number; }

function ScoreBadge({ score }: BadgeProps) {
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

function ScoreBar({ score, delay, visible }: { score: number; delay: number; visible: boolean }) {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? '#22C55E' : score >= 5 ? '#F97316' : '#EF4444';

  return (
    <div style={{ height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: '6px' }}>
      <div style={{
        height: '100%',
        borderRadius: '9999px',
        background: color,
        width: visible ? `${pct}%` : '0%',
        transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        boxShadow: `0 0 6px ${color}60`,
      }} />
    </div>
  );
}

export function ScoreTable({ scores }: { scores: Record<string, { score: number; verdict: string }> }) {
  const labels: Record<string, string> = {
    firstImpression: 'First Impression',
    visualDesign: 'Visual Design',
    copywriting: 'Copywriting',
    trust: 'Trust & Credibility',
    ux: 'Navigation & UX Flow',
    mobile: 'Mobile Experience',
    conversion: 'Conversion Arch.',
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!scores) return null;

  const entries = Object.entries(scores);

  return (
    <div ref={containerRef} className="rounded-[16px] overflow-hidden" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(249,115,22,0.12)', padding: '12px 24px' }}>
        <div className="grid text-[10px] font-black uppercase tracking-widest" style={{ gridTemplateColumns: '1fr 100px 1fr', color: '#64748B' }}>
          <span>Dimension</span>
          <span>Score</span>
          <span>Verdict</span>
        </div>
      </div>
      {entries.map(([key, data], idx) => (
        <div
          key={key}
          className="grid items-start px-6 py-4"
          style={{
            gridTemplateColumns: '1fr 100px 1fr',
            borderTop: idx > 0 ? '1px solid rgba(249,115,22,0.06)' : 'none',
            gap: '12px',
          }}
        >
          <div>
            <div className="text-sm font-bold" style={{ color: '#F8FAFC' }}>{labels[key] || key}</div>
            <ScoreBar score={data.score} delay={idx * 80} visible={visible} />
          </div>
          <div className="pt-0.5">
            <ScoreBadge score={data.score} />
          </div>
          <div className="text-sm italic pt-0.5" style={{ color: '#94A3B8' }}>
            &quot;{data.verdict}&quot;
          </div>
        </div>
      ))}
    </div>
  );
}
