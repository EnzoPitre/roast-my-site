'use client';
import { useState } from 'react';
import { CheckSquare, Square, Zap, Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface FixPlanProps {
  plan: {
    quick: string[];
    medium: string[];
    strategic: string[];
  };
  quickWins?: string[];
}

export function FixPlan({ plan, quickWins }: FixPlanProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'quick' | 'medium' | 'strategic'>('quick');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  if (!plan) return null;

  const toggleCheck = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const tabs = [
    { id: 'quick', label: t('fixplan.quick'), icon: Zap, data: plan.quick || [] },
    { id: 'medium', label: t('fixplan.medium'), icon: Clock, data: plan.medium || [] },
    { id: 'strategic', label: t('fixplan.strategic'), icon: TrendingUp, data: plan.strategic || [] },
  ] as const;

  return (
    <div className="flex flex-col gap-6">

      {/* Quick Wins (< 1 hour) */}
      {quickWins && quickWins.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.25)' }}>
          <h3 className="font-black mb-4 flex items-center gap-2 text-base" style={{ color: '#F97316' }}>
            <Zap className="w-5 h-5 fill-current" /> &lt; {t('fixplan.quick_wins_label')}
          </h3>
          <ul className="space-y-3">
            {quickWins.map((item, idx) => {
              const id = `qw-${idx}`;
              const isDone = checked[id];
              return (
                <li key={idx} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleCheck(id)}>
                  <button className="mt-0.5 shrink-0 transition-colors" style={{ color: isDone ? '#F97316' : 'rgba(249,115,22,0.35)' }}>
                    {isDone ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                  <span className="text-sm font-medium leading-relaxed transition-all" style={{ color: isDone ? '#64748B' : '#E2E8F0', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Tabbed Fix Plan */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.2)' }}>
        {/* Tab Bar */}
        <div className="flex" style={{ borderBottom: '1px solid rgba(249,115,22,0.12)', background: 'rgba(0,0,0,0.25)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-3.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors border-b-2"
                style={{
                  borderColor: active ? '#F97316' : 'transparent',
                  color: active ? '#F97316' : '#64748B',
                  background: active ? 'rgba(249,115,22,0.05)' : 'transparent',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span>({tab.data.length})</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <ul className="space-y-3">
            {tabs.find(tab => tab.id === activeTab)?.data.map((item, idx) => {
              const id = `${activeTab}-${idx}`;
              const isDone = checked[id];
              return (
                <li key={idx} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleCheck(id)}>
                  <button className="mt-0.5 shrink-0 transition-colors" style={{ color: isDone ? '#F97316' : 'rgba(249,115,22,0.25)' }}>
                    {isDone ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                  <span className="text-sm leading-relaxed font-medium transition-all" style={{ color: isDone ? '#64748B' : '#E2E8F0', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item}
                  </span>
                </li>
              );
            })}
            {tabs.find(tab => tab.id === activeTab)?.data.length === 0 && (
              <div className="text-center py-8 text-sm italic" style={{ color: '#475569' }}>
                {t('fixplan.none_needed')}
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
