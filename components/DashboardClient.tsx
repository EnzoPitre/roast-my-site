'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, Flame, RefreshCw, Download, Settings, Plus, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
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
  subscribed?: boolean;
}

const scoreColor = (s: number) => s >= 8 ? '#22C55E' : s >= 5 ? '#F97316' : '#EF4444';

function groupRoastsByUrl(roasts: Roast[]) {
  const map = new Map<string, Roast[]>();
  for (const r of roasts) {
    if (!map.has(r.url)) map.set(r.url, []);
    map.get(r.url)!.push(r);
  }
  return Array.from(map.entries());
}

export function DashboardClient({ lang, roasts, plan, monthlyRoastsUsed, scheduledRoasts: initialScheduled, subscribed }: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'roasts' | 'scheduled'>('roasts');
  const [csvLoading, setCsvLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [scheduled, setScheduled] = useState<ScheduledRoastItem[]>(initialScheduled);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [saving, setSaving] = useState(false);

  const grouped = groupRoastsByUrl(roasts);

  const handleCsvExport = async () => {
    setCsvLoading(true);
    try {
      const res = await fetch('/api/export/csv');
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'roasts-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setCsvLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  };

  const handleReRoast = (url: string, roastId: string) => {
    const params = new URLSearchParams({ url, followUpFrom: roastId });
    window.location.href = `/${lang}?${params.toString()}`;
  };

  const handleToggleScheduled = async (id: string, current: boolean) => {
    const res = await fetch('/api/scheduled-roasts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !current }),
    });
    if (res.ok) {
      setScheduled(prev => prev.map(s => s.id === id ? { ...s, active: !current } : s));
    }
  };

  const handleDeleteScheduled = async (id: string) => {
    const res = await fetch(`/api/scheduled-roasts?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setScheduled(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddScheduled = async () => {
    if (!newUrl) return;
    setSaving(true);
    try {
      const res = await fetch('/api/scheduled-roasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl, frequency: newFrequency }),
      });
      if (res.ok) {
        const data = await res.json();
        setScheduled(prev => [...prev, data]);
        setShowAddModal(false);
        setNewUrl('');
        setNewFrequency('weekly');
      }
    } finally {
      setSaving(false);
    }
  };

  const isPro = plan === 'pro';

  return (
    <div className="relative z-10">
      {/* Plan Status Banner */}
      <div className="mb-8 p-5 rounded-[14px] flex items-center justify-between gap-4 flex-wrap"
        style={{ background: '#13131A', border: `1px solid ${isPro ? 'rgba(249,115,22,0.4)' : 'rgba(249,115,22,0.15)'}` }}>
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 shrink-0" style={{ color: '#F97316' }} />
          <div>
            {isPro ? (
              <>
                <p className="font-black text-sm" style={{ color: '#F8FAFC' }}>
                  {t('plan.pro_label')} — {t('plan.usage').replace('{used}', String(monthlyRoastsUsed))}
                </p>
                <div className="mt-1.5 w-40 h-1.5 rounded-full" style={{ background: 'rgba(249,115,22,0.15)' }}>
                  <div className="h-full rounded-full" style={{ background: '#F97316', width: `${Math.min((monthlyRoastsUsed / 10) * 100, 100)}%` }} />
                </div>
              </>
            ) : (
              <p className="font-black text-sm" style={{ color: '#94A3B8' }}>{t('dash.plan_banner_free')}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isPro ? (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-60"
              style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}
            >
              <Settings className="w-3.5 h-3.5 inline mr-1.5" />
              {portalLoading ? '...' : t('dash.manage_sub')}
            </button>
          ) : (
            <Link href={`/${lang}/pricing`} className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors" style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>
              Upgrade to Pro →
            </Link>
          )}
          {roasts.length > 0 && (
            <button
              onClick={handleCsvExport}
              disabled={csvLoading}
              className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-1.5"
              style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid rgba(249,115,22,0.1)' }}
            >
              <Download className="w-3.5 h-3.5" />
              {csvLoading ? '...' : t('dash.export_csv')}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.12)' }}>
        {(['roasts', 'scheduled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
            style={{
              background: activeTab === tab ? '#F97316' : 'transparent',
              color: activeTab === tab ? '#0A0A0F' : '#64748B',
            }}
          >
            {tab === 'roasts' ? t('scheduled.roasts_tab') : t('scheduled.tab')}
          </button>
        ))}
      </div>

      {activeTab === 'roasts' && (
        <>
          {roasts.length === 0 ? (
            <div className="glass-card p-14 text-center max-w-lg mx-auto">
              <div className="text-5xl mb-5">🔥</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#F8FAFC' }}>{t('dash.empty.title')}</h3>
              <p className="mb-8 font-medium" style={{ color: '#94A3B8' }}>{t('dash.empty.desc')}</p>
              <Link href={`/${lang}`} className="btn-orange inline-flex items-center gap-2 cursor-pointer">
                {t('dash.empty.cta')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.map(([url, urlRoasts]) => {
                const latest = urlRoasts[0];
                const history = urlRoasts.slice(1);
                return (
                  <div key={url} className="rounded-[14px] overflow-hidden" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.15)' }}>
                    {/* URL Header */}
                    <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap" style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-semibold truncate text-sm" style={{ color: '#E2E8F0' }} title={url}>{url}</span>
                        <span className="font-black text-base shrink-0" style={{ color: scoreColor(latest.globalScore) }}>{latest.globalScore}/10</span>
                        {!latest.isPaid && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0" style={{ background: 'rgba(249,115,22,0.08)', color: '#94A3B8', border: '1px solid rgba(249,115,22,0.15)' }}>
                            <Lock className="w-2.5 h-2.5" /> {t('dash.table.locked')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {history.length > 0 && (
                          <span className="text-xs font-medium" style={{ color: '#64748B' }}>
                            {t('followup.view_progress')}
                          </span>
                        )}
                        <button
                          onClick={() => handleReRoast(url, latest.id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                          style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}
                        >
                          <RefreshCw className="w-3 h-3" />
                          {t('followup.re_roast')}
                        </button>
                        <Link href={`/${lang}/roast/${latest.id}`} className="text-xs font-bold transition-colors flex items-center gap-1 text-[#F97316] hover:text-[#EA580C]">
                          {t('dash.table.view')} <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                    {/* History dots */}
                    {history.length > 0 && (
                      <div className="px-5 py-3 flex items-center gap-3 flex-wrap">
                        <span className="text-xs" style={{ color: '#64748B' }}>History:</span>
                        {history.map(r => (
                          <Link key={r.id} href={`/${lang}/roast/${r.id}`} className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80" style={{ color: scoreColor(r.globalScore) }}>
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: scoreColor(r.globalScore) }} />
                            {r.globalScore}/10
                            <span style={{ color: '#64748B' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                          </Link>
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

      {activeTab === 'scheduled' && (
        <div>
          {!isPro ? (
            <div className="glass-card p-10 text-center max-w-lg mx-auto">
              <div className="text-4xl mb-4">🔒</div>
              <p className="font-bold text-sm mb-4" style={{ color: '#F8FAFC' }}>{t('scheduled.pro_only')}</p>
              <Link href={`/${lang}/pricing`} className="btn-orange inline-flex items-center gap-2 cursor-pointer text-sm">
                Upgrade to Pro <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-orange text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> {t('scheduled.add')}
                </button>
              </div>

              {scheduled.length === 0 ? (
                <div className="glass-card p-10 text-center">
                  <p className="font-medium text-sm" style={{ color: '#64748B' }}>{t('scheduled.empty')}</p>
                </div>
              ) : (
                <div className="rounded-[14px] overflow-hidden" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.15)' }}>
                  {scheduled.map((s, idx) => (
                    <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap" style={{ borderTop: idx > 0 ? '1px solid rgba(249,115,22,0.08)' : 'none' }}>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: '#E2E8F0' }}>{s.url}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          {s.frequency === 'weekly' ? t('scheduled.weekly') : t('scheduled.monthly')} ·{' '}
                          {t('scheduled.next_run')}: {new Date(s.nextRunAt).toLocaleDateString()}
                          {s.lastRunAt && ` · ${t('scheduled.last_run')}: ${new Date(s.lastRunAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleScheduled(s.id, s.active)}
                          className="flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
                          style={{ color: s.active ? '#22C55E' : '#64748B' }}
                        >
                          {s.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          {s.active ? t('scheduled.active') : t('scheduled.inactive')}
                        </button>
                        <button
                          onClick={() => handleDeleteScheduled(s.id)}
                          className="p-1.5 rounded-lg cursor-pointer transition-colors"
                          style={{ color: '#64748B' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
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
        </div>
      )}

      {/* Add Scheduled Roast Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-[20px] p-8" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.3)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black" style={{ color: '#F8FAFC' }}>{t('scheduled.add')}</h3>
              <button onClick={() => setShowAddModal(false)} className="cursor-pointer" style={{ color: '#64748B' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: '#64748B' }}>
                  {t('scheduled.url_label')}
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://your-site.com"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none"
                  style={{ background: '#0A0A0F', border: '1px solid rgba(249,115,22,0.2)', color: '#F8FAFC' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: '#64748B' }}>
                  {t('scheduled.frequency_label')}
                </label>
                <div className="flex gap-3">
                  {(['weekly', 'monthly'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setNewFrequency(f)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all"
                      style={{
                        background: newFrequency === f ? '#F97316' : 'rgba(249,115,22,0.05)',
                        color: newFrequency === f ? '#0A0A0F' : '#94A3B8',
                        border: `1px solid ${newFrequency === f ? '#F97316' : 'rgba(249,115,22,0.15)'}`,
                      }}
                    >
                      {f === 'weekly' ? t('scheduled.weekly') : t('scheduled.monthly')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
                  style={{ background: 'transparent', color: '#64748B', border: '1px solid rgba(249,115,22,0.1)' }}
                >
                  {t('scheduled.cancel')}
                </button>
                <button
                  onClick={handleAddScheduled}
                  disabled={saving || !newUrl}
                  className="flex-1 btn-orange cursor-pointer disabled:opacity-60 text-sm"
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
