'use client';
import { useState } from 'react';
import { Header } from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";
import { useParams } from "next/navigation";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();
  const params = useParams();
  const lang = (params.lang as string) || 'en';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const subjects = [
    { value: 'general', label: t('contact.form.subject.general') as string },
    { value: 'bug', label: t('contact.form.subject.bug') as string },
    { value: 'partnership', label: t('contact.form.subject.partnership') as string },
    { value: 'press', label: t('contact.form.subject.press') as string },
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t('contact.form.required') as string;
    if (!email.trim()) e.email = t('contact.form.required') as string;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('contact.form.invalid_email') as string;
    if (!subject) e.subject = t('contact.form.required') as string;
    if (!message.trim()) e.message = t('contact.form.required') as string;
    else if (message.trim().length < 20) e.message = t('contact.form.min_chars') as string;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, lang }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(249,115,22,0.2)',
    borderRadius: '10px',
    color: '#F8FAFC',
    padding: '12px 16px',
    width: '100%',
    fontSize: '0.9375rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };
  const errorStyle = { fontSize: '12px', color: '#EF4444', marginTop: '4px', fontWeight: 500 };
  const labelStyle = { display: 'block' as const, fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px', letterSpacing: '0.03em', textTransform: 'uppercase' as const };

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-24 flex-1 w-full">

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>
            {t('contact.page.title')}
          </h1>
          <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>
            {t('contact.page.subtitle')}
          </p>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center text-center py-16 gap-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '20px' }}>
            <CheckCircle className="w-12 h-12" style={{ color: '#22C55E' }} />
            <h3 className="text-xl font-black" style={{ color: '#F8FAFC' }}>{t('contact.form.success')}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '20px', padding: '32px' }}>

            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle className="w-4 h-4 shrink-0" style={{ color: '#EF4444' }} />
                <p className="text-sm font-medium" style={{ color: '#FCA5A5' }}>{t('contact.form.error')}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>{t('contact.form.name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.2)' }}
                  placeholder="Enzo Pitre"
                />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>
              <div>
                <label style={labelStyle}>{t('contact.form.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.2)' }}
                  placeholder="you@example.com"
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t('contact.form.subject')}</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{ ...inputStyle, borderColor: errors.subject ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.2)', cursor: 'pointer' }}
              >
                <option value="" style={{ background: '#0A0A0F' }}>—</option>
                {subjects.map(s => (
                  <option key={s.value} value={s.value} style={{ background: '#0A0A0F' }}>{s.label}</option>
                ))}
              </select>
              {errors.subject && <p style={errorStyle}>{errors.subject}</p>}
            </div>

            <div>
              <label style={labelStyle}>{t('contact.form.message')}</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
                style={{ ...inputStyle, borderColor: errors.message ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.2)', resize: 'vertical' }}
                placeholder={lang === 'fr' ? 'Décrivez votre problème ou votre question...' : 'Describe your issue or question...'}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message ? <p style={errorStyle}>{errors.message}</p> : <span />}
                <span style={{ fontSize: '11px', color: message.length >= 20 ? '#22C55E' : '#64748B', fontWeight: 600 }}>
                  {message.length}/20+
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-orange w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {status === 'sending' ? (
                <span>{t('contact.form.sending')}</span>
              ) : (
                <><Send className="w-4 h-4" /> {t('contact.form.submit')}</>
              )}
            </button>

          </form>
        )}
      </main>
    </>
  );
}
