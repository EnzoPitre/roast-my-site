'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useSession } from 'next-auth/react';
import { TranslationKey } from '@/lib/translations';

const SECTORS = [
  { key: 'ecommerce', labelKey: 'review.modal.sector.ecommerce' },
  { key: 'saas',      labelKey: 'review.modal.sector.saas' },
  { key: 'freelance', labelKey: 'review.modal.sector.freelance' },
  { key: 'agency',    labelKey: 'review.modal.sector.agency' },
  { key: 'local',     labelKey: 'review.modal.sector.local' },
  { key: 'other',     labelKey: 'review.modal.sector.other' },
] as const;

interface Props {
  onClose: () => void;
}

export function ReviewModal({ onClose }: Props) {
  const { t } = useLanguage();
  const { data: session } = useSession();

  const [name, setName]       = useState('');
  const [role, setRole]       = useState('');
  const [company, setCompany] = useState('');
  const [sector, setSector]   = useState('');
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  // Pre-fill name from Google session
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rating) { setError(t('review.modal.error.rating') as string); return; }
    if (comment.trim().length < 50) { setError(t('review.modal.error.min_chars') as string); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, company, sector, rating, comment }),
      });
      const data = await res.json();
      if (res.status === 409) { setError(t('review.modal.already_reviewed') as string); return; }
      if (!res.ok) { setError(data.error || (t('review.modal.error.general') as string)); return; }
      setSuccess(true);
    } catch {
      setError(t('review.modal.error.general') as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg rounded-[20px] p-8 overflow-y-auto max-h-[90vh]"
        style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.3)', boxShadow: '0 0 80px rgba(249,115,22,0.12)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer"
          style={{ color: '#64748B' }}
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-black tracking-tight mb-6" style={{ color: '#F8FAFC' }}>
          {t('review.modal.title')}
        </h2>

        {success ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">🔥</div>
            <p className="font-semibold text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
              {t('review.modal.success')}
            </p>
            <button onClick={onClose} className="btn-orange mt-6 cursor-pointer">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#64748B' }}>
                {t('review.modal.name')}
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('review.modal.name_placeholder') as string}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#64748B' }}>
                {t('review.modal.role')}
              </label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder={t('review.modal.role_placeholder') as string}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#64748B' }}>
                {t('review.modal.company')}
              </label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder={t('review.modal.company_placeholder') as string}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
              />
            </div>

            {/* Sector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#64748B' }}>
                {t('review.modal.sector')}
              </label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer"
                style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: sector ? '#F8FAFC' : '#64748B' }}
              >
                <option value="" disabled>—</option>
                {SECTORS.map(s => (
                  <option key={s.key} value={s.key}>
                    {t(s.labelKey as TranslationKey) as string}
                  </option>
                ))}
              </select>
            </div>

            {/* Star rating */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748B' }}>
                {t('review.modal.rating')}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    style={{ fontSize: '28px', color: star <= (hovered || rating) ? '#F97316' : '#1E293B', lineHeight: 1 }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-black uppercase tracking-widest" style={{ color: '#64748B' }}>
                  {t('review.modal.comment')}
                </label>
                <span className="text-xs font-medium" style={{ color: comment.length >= 50 ? '#22C55E' : '#64748B' }}>
                  {comment.length} {t('review.modal.char_count')}
                </span>
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={t('review.modal.comment_placeholder') as string}
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none resize-none"
                style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
              />
            </div>

            {error && (
              <p className="text-sm font-semibold px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-orange w-full flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('review.modal.submitting') : t('review.modal.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
