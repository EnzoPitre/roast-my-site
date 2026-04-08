'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Lock, RefreshCw, Download, Settings,
  Plus, Trash2, ToggleLeft, ToggleRight, X, ExternalLink,
  Clock, Calendar, CheckCircle2, Globe2,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface Roast {
  id: string;
  url: string;
  globalScore: number;
  createdAt: Date;
  isPaid: boolean;
  isFollowUp: boolean;
  previousRoastId: string | null;
}

interface ScheduledRoastItem {
  id: string;
  url: string;
  frequency: string;
  nextRunAt: Date;
  lastRunAt: Date | null;
  active: boolean;
}

interface Props {
  lang: string;
  roasts: Roast[];
  plan: string;
  monthlyRoastsUsed: number;
  scheduledRoasts: ScheduledRoastItem[];
}

// ─── helpers ────────────────────────────────────────────────────────────────
function scoreBadge(s: number) {
  if (s >= 7) return { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', text: '#22C55E' };
  if (s >= 5) return { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', text: '#F97316' };
  return { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#EF4444' };
}

function ScoreBadge({ score, large }: { score: number; large?: boolean }) {
  const c = scoreBadge(score);
  return (
    <span
      className="inline-flex items-center font-black rounded-full"
      style={{
        background: c.bg, border: `1px solid ${c.border}`, color: c.text,
        fontSize: large ? '18px' : '12px',
        padding: large ? '4px 14px' : '2px 8px',
      }}
    >
      {score}/10
    </span>
  );
}

function formatDate(d: Date, locale: string) {
  return new Date(d).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB');
}

function groupByUrl(roasts: Roast[]) {
  const map = new Map<string, Roast[]>();
  for (const r of roasts) {
    if (!map.has(r.url)) map.set(r.url, []);
    map.get(r.url)!.push(r);
  }
  return Array.from(map.entries());
}

function shortHost(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardClient({
  lang, roasts, plan, monthlyRoastsUsed, scheduledRoasts: initialScheduled,
}: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'roasts' | 'scheduled'>('roasts');
  const [csvLoading, setCsvLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [scheduled, setScheduled] = useState<ScheduledRoastItem[]>(initialScheduled);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [saving, setSaving] = useState(false);

  const isPro = plan === 'pro';
  const grouped = groupByUrl(roasts);
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleCsvExport = async () => {
    setCsvLoading(true);
    try {
      const res = await fetch('/api/export/csv');
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'roasts-export.csv'; a.click();
      URL.revokeObjectURL(url);
    } finally { setCsvLoading(false); }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally { setPortalLoading(false); }
  };

  const handleReRoast = (url: string, roastId: string) => {
    window.location.href = `/${lang}?${new URLSearchParams({ url, followUpFrom: roastId })}`;
  };

  const handleToggleScheduled = async (id: string, current: boolean) => {
    const res = await fetch('/api/scheduled-roasts', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !current }),
    });
    if (res.ok) setScheduled(p => p.map(s => s.id === id ? { ...s, active: !current } : s));
  };

  const handleDeleteScheduled = async (id: string) => {
    if (await fetch(`/api/scheduled-roasts?id=${id}`, { method: 'DELETE' }).then(r => r.ok))
      setScheduled(p => p.filter(s => s.id !== id));
  };

  const handleAddScheduled = async () => {
    if (!newUrl) return;
    setSaving(true);
    try {
      const res = await fetch('/api/scheduled-roasts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl, frequency: newFrequency }),
      });
      if (res.ok) {
        const data = await res.json();
        setScheduled(p => [...p, data]);
        setShowAddModal(false); setNewUrl(''); setNewFrequency('weekly');
      }
    } finally { setSaving(false); }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Section header: tabs + actions ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}>
          {(['roasts', 'scheduled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer"
              style={{
                background: activeTab === tab ? '#F97316' : 'transparent',
                color: activeTab === tab ? '#0A0A0F' : '#64748B',
              }}
            >
              {tab === 'roasts' ? t('scheduled.roasts_tab') : t('scheduled.tab')}
            </button>
          ))}
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          {isPro && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
              style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}
            >
              <Settings className="w-3.5 h-3.5" />
              {portalLoading ? '…' : t('dash.manage_sub')}
            </button>
          )}
          {roasts.length > 0 && (
            <button
              onClick={handleCsvExport}
              disabled={csvLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
              style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid rgba(249,115,22,0.08)' }}
            >
              <Download className="w-3.5 h-3.5" />
              {csvLoading ? '…' : `📥 ${t('dash.export_csv')}`}
            </button>
          )}
        </div>
      </div>

      {/* ── ROAST HISTORY TAB ──────────────────────────────────────────────── */}
      {activeTab === 'roasts' && (
        <>
          {roasts.length === 0 ? (
            /* Empty state */
            <div
              className="rounded-3xl p-14 text-center"
              style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}
            >
              <div className="text-6xl mb-5">🔥</div>
              <h3 className="text-xl font-black mb-2" style={{ color: '#F8FAFC' }}>{t('dash.empty.title')}</h3>
              <p className="mb-8 font-medium text-sm" style={{ color: '#64748B' }}>{t('dash.empty.desc')}</p>
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all"
                style={{ background: '#F97316', color: '#0A0A0F' }}
              >
                {t('dash.empty.cta')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {grouped.map(([url, urlRoasts]) => {
                const latest = urlRoasts[0];
                const history = urlRoasts.slice(1);
                const host = shortHost(url);

                return (
                  <div
                    key={url}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}
                  >
                    {/* URL group header */}
                    <div
                      className="px-5 py-4 flex items-center gap-4 flex-wrap"
                      style={{ borderBottom: history.length > 0 ? '1px solid rgba(249,115,22,0.07)' : 'none' }}
                    >
                      {/* Favicon placeholder + URL */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}
                      >
                        <Globe2 className="w-4 h-4" style={{ color: '#F97316' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: '#F8FAFC' }} title={url}>
                          {host}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: '#64748B' }}>{url}</p>
                      </div>

                      {/* Latest score */}
                      <ScoreBadge score={latest.globalScore} large />

                      {/* Date */}
                      <span className="text-xs font-medium hidden sm:block" style={{ color: '#64748B' }}>
                        {formatDate(latest.createdAt, lang)}
                      </span>

                      {/* Status */}
                      {latest.isPaid ? (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black" style={{ color: '#22C55E' }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t('dash.table.unlocked')}
                        </span>
                      ) : (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: '#64748B' }}>
                          <Lock className="w-3 h-3" /> {t('dash.table.locked')}
                        </span>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 ml-auto">
                        <button
                          onClick={() => handleReRoast(url, latest.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all"
                          style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.18)' }}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span className="hidden sm:inline">{t('dash.table.reaudit')}</span>
                        </button>
                        <Link
                          href={`/${lang}/roast/${latest.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all"
                          style={{ background: '#F97316', color: '#0A0A0F' }}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {t('dash.table.view_short')}
                        </Link>
                      </div>
                    </div>

                    {/* Previous roast rows */}
                    {history.length > 0 && (
                      <div className="px-5 py-3 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
                          {lang === 'fr' ? 'Historique' : 'History'}
                        </p>
                        {history.map((r) => (
                          <div key={r.id} className="flex items-center gap-3 flex-wrap">
                            {/* timeline dot */}
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: scoreBadge(r.globalScore).text }} />
                            <ScoreBadge score={r.globalScore} />
                            <span className="text-xs" style={{ color: '#64748B' }}>{formatDate(r.createdAt, lang)}</span>
                            {r.isPaid ? (
                              <span className="text-[10px] font-bold" style={{ color: '#22C55E' }}>✓ {t('dash.table.unlocked')}</span>
                            ) : (
                              <span className="text-[10px] font-bold" style={{ color: '#475569' }}>🔒 {t('dash.table.locked')}</span>
                            )}
                            <Link
                              href={`/${lang}/roast/${r.id}`}
                              className="text-xs font-bold ml-auto"
                              style={{ color: '#F97316' }}
                            >
                              {t('dash.table.view_short')} <ArrowRight className="w-3 h-3 inline" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── SCHEDULED ROASTS TAB ────────────────────────────────────────────── */}
      {activeTab === 'scheduled' && (
        <>
          {!isPro ? (
            /* Locked overlay for free users */
            <div className="relative rounded-3xl overflow-hidden">
              {/* Blurred fake content */}
              <div className="blur-sm pointer-events-none select-none p-6 space-y-3" aria-hidden>
                {[1, 2].map(i => (
                  <div key={i} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}>
                    <div className="w-8 h-8 rounded-lg" style={{ background: '#1E293B' }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 rounded-full w-48" style={{ background: '#1E293B' }} />
                      <div className="h-2.5 rounded-full w-32" style={{ background: '#1A1A24' }} />
                    </div>
                    <div className="h-6 w-16 rounded-full" style={{ background: '#1E293B' }} />
                  </div>
                ))}
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl" style={{ background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(4px)' }}>
                <div className="text-4xl">🔒</div>
                <p className="text-base font-black text-center" style={{ color: '#F8FAFC' }}>{t('scheduled.pro_only')}</p>
                <Link
                  href={`/${lang}${lang === 'fr' ? '/tarifs' : '/pricing'}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm"
                  style={{ background: '#F97316', color: '#0A0A0F' }}
                >
                  {t('dash.upgrade_cta')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black cursor-pointer transition-all"
                  style={{ background: '#F97316', color: '#0A0A0F' }}
                >
                  <Plus className="w-4 h-4" /> {t('scheduled.add')}
                </button>
              </div>

              {scheduled.length === 0 ? (
                <div className="rounded-3xl p-12 text-center" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}>
                  <Clock className="w-10 h-10 mx-auto mb-4" style={{ color: '#F97316', opacity: 0.4 }} />
                  <p className="font-medium text-sm" style={{ color: '#64748B' }}>{t('scheduled.empty')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduled.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl px-5 py-4 flex items-center gap-4 flex-wrap"
                      style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.1)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}
                      >
                        <Calendar className="w-4 h-4" style={{ color: '#F97316' }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: '#F8FAFC' }}>{s.url}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#64748B' }}>
                          {s.frequency === 'weekly' ? t('scheduled.weekly') : t('scheduled.monthly')}
                          {' · '}{t('scheduled.next_run')}: {new Date(s.nextRunAt).toLocaleDateString()}
                          {s.lastRunAt && ` · ${t('scheduled.last_run')}: ${new Date(s.lastRunAt).toLocaleDateString()}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleToggleScheduled(s.id, s.active)}
                          className="flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
                          style={{ color: s.active ? '#22C55E' : '#64748B' }}
                        >
                          {s.active
                            ? <ToggleRight className="w-5 h-5" />
                            : <ToggleLeft className="w-5 h-5" />}
                          <span className="hidden sm:inline">{s.active ? t('scheduled.active') : t('scheduled.inactive')}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteScheduled(s.id)}
                          className="p-1.5 rounded-lg cursor-pointer transition-colors"
                          style={{ color: '#475569' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── ADD SCHEDULED ROAST MODAL ────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-3xl p-8" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.25)' }}>
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-lg font-black" style={{ color: '#F8FAFC' }}>{t('scheduled.add')}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full cursor-pointer transition-colors" style={{ color: '#64748B' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#64748B' }}>
                  {t('scheduled.url_label')}
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://your-site.com"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-1"
                  style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#64748B' }}>
                  {t('scheduled.frequency_label')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['weekly', 'monthly'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setNewFrequency(f)}
                      className="py-3 rounded-xl text-sm font-black cursor-pointer transition-all"
                      style={{
                        background: newFrequency === f ? '#F97316' : 'rgba(249,115,22,0.05)',
                        color: newFrequency === f ? '#0A0A0F' : '#94A3B8',
                        border: `1px solid ${newFrequency === f ? '#F97316' : 'rgba(249,115,22,0.12)'}`,
                      }}
                    >
                      {f === 'weekly' ? t('scheduled.weekly') : t('scheduled.monthly')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all"
                  style={{ background: 'transparent', color: '#64748B', border: '1px solid rgba(249,115,22,0.1)' }}
                >
                  {t('scheduled.cancel')}
                </button>
                <button
                  onClick={handleAddScheduled}
                  disabled={saving || !newUrl}
                  className="flex-1 py-3 rounded-xl text-sm font-black cursor-pointer transition-all disabled:opacity-50"
                  style={{ background: '#F97316', color: '#0A0A0F' }}
                >
                  {saving ? t('scheduled.saving') : t('scheduled.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
