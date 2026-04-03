import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

function AnimCounter({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <div ref={ref} className="text-4xl md:text-6xl font-black text-gradient-orange mb-2">{count}{suffix}</div>;
}

export function StatsCounter() {
  const { t } = useLanguage();
  const [dbCount, setDbCount] = useState<number>(1247);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => { if (data.count) setDbCount(data.count + 1000); })
      .catch(() => setDbCount(1247));
  }, []);

  return (
    <section className="max-w-6xl mx-auto py-24 px-6 section-divider border-t border-b border-orange-500/10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
        
        <div className="flex flex-col items-center">
          <AnimCounter end={dbCount} suffix="+" />
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8]">{t('social.websites_roasted')}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <AnimCounter end={94} suffix="%" />
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8]">{t('stats.issues_found')}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-black text-gradient-orange mb-2">2.3x</div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8]">{t('stats.conv_lift')}</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-black text-gradient-orange mb-2">&lt; 30s</div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8]">{t('stats.analysis_time')}</div>
        </div>

      </div>
    </section>
  );
}
