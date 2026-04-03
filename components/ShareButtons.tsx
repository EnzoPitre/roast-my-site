'use client';
import { useState } from 'react';
import { X as XIcon, Link as LinkIcon, Check } from 'lucide-react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface Props {
  title: string;
  lang: Language;
}

export function ShareButtons({ title, lang }: Props) {
  const t = (key: TranslationKey) => translations[lang][key] as string;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    const text = `${title} — via @RoastMySite`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
      '_blank', 'noopener,noreferrer,width=560,height=420'
    );
  };

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', fontWeight: 700,
    padding: '6px 12px', borderRadius: '8px',
    cursor: 'pointer', transition: 'color 0.2s',
    color: '#94A3B8',
    background: 'rgba(249,115,22,0.05)',
    border: '1px solid rgba(249,115,22,0.15)',
  };

  return (
    <div className="flex items-center gap-2">
      <button style={btnStyle} onClick={handleTweet}
        onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
        <XIcon className="w-3.5 h-3.5" /> X
      </button>
      <button style={{ ...btnStyle, color: copied ? '#22C55E' : '#94A3B8' }} onClick={handleCopy}>
        {copied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
        {copied ? (t('card.copied') as string).split('!')[0] : t('blog.share')}
      </button>
    </div>
  );
}
