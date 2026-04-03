import { Header } from "@/components/Header";
import { translations, Language, TranslationKey } from "@/lib/translations";

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<import('next').Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  return {
    title: t['meta.changelog.title'],
    description: t['meta.changelog.description'],
    alternates: { canonical: `${BASE_URL}/${lang}/changelog` },
    openGraph: { title: t['meta.changelog.title'], description: t['meta.changelog.description'], url: `${BASE_URL}/${lang}/changelog` },
  };
}

type Tag = 'new' | 'improved' | 'fixed';

interface ChangeEntry {
  tag: Tag;
  text: { en: string; fr: string };
}
interface VersionEntry {
  version: string;
  date: { en: string; fr: string };
  changes: ChangeEntry[];
}

const CHANGELOG: VersionEntry[] = [
  {
    version: 'v1.3.0',
    date: { en: 'April 2026', fr: 'Avril 2026' },
    changes: [
      { tag: 'new', text: { en: 'Compare mode — analyze two URLs side by side', fr: 'Mode comparaison — analysez deux URLs côte à côte' } },
      { tag: 'new', text: { en: 'Embed badge — share your score on any website', fr: 'Badge intégrable — partagez votre score sur n\'importe quel site' } },
      { tag: 'new', text: { en: 'Twitter/X share button on roast results', fr: 'Bouton de partage Twitter/X sur les résultats' } },
      { tag: 'new', text: { en: 'Email notification when roast is ready', fr: 'Notification par email quand le roast est prêt' } },
      { tag: 'new', text: { en: 'About page with product story and timeline', fr: 'Page À propos avec l\'histoire du produit' } },
      { tag: 'new', text: { en: 'Newsletter subscription', fr: 'Abonnement à la newsletter' } },
      { tag: 'new', text: { en: 'Full contact form with Resend integration', fr: 'Formulaire de contact complet avec intégration Resend' } },
      { tag: 'improved', text: { en: 'Global animated background across all pages', fr: 'Fond animé global sur toutes les pages' } },
    ],
  },
  {
    version: 'v1.2.0',
    date: { en: 'March 2026', fr: 'Mars 2026' },
    changes: [
      { tag: 'new', text: { en: 'Language switcher EN/FR with cookie persistence', fr: 'Sélecteur de langue EN/FR avec persistence cookie' } },
      { tag: 'new', text: { en: 'Interactive demo roast (no sign-in required)', fr: 'Démo interactive (sans connexion requise)' } },
      { tag: 'improved', text: { en: 'Richer AI reports with 12 scoring dimensions', fr: 'Rapports IA enrichis avec 12 dimensions de scoring' } },
      { tag: 'improved', text: { en: 'Animated loading progress bar with stage messages', fr: 'Barre de progression animée avec messages d\'étape' } },
      { tag: 'improved', text: { en: 'Full i18n support on all pages and components', fr: 'Support i18n complet sur toutes les pages et composants' } },
    ],
  },
  {
    version: 'v1.1.0',
    date: { en: 'March 2026', fr: 'Mars 2026' },
    changes: [
      { tag: 'new', text: { en: 'Stripe payment integration — unlock full reports for €4.90', fr: 'Intégration paiement Stripe — débloquer les rapports pour 4,90€' } },
      { tag: 'new', text: { en: 'Dashboard with full roast history', fr: 'Tableau de bord avec l\'historique complet des audits' } },
      { tag: 'new', text: { en: 'PDF export on all roast reports', fr: 'Export PDF sur tous les rapports' } },
      { tag: 'fixed', text: { en: 'Mobile layout on roast results page', fr: 'Mise en page mobile sur la page de résultats' } },
      { tag: 'fixed', text: { en: 'Stripe redirect now uses correct lang route', fr: 'La redirection Stripe utilise maintenant la bonne route de langue' } },
    ],
  },
  {
    version: 'v1.0.0',
    date: { en: 'February 2026', fr: 'Février 2026' },
    changes: [
      { tag: 'new', text: { en: 'Initial launch 🎉', fr: 'Lancement initial 🎉' } },
      { tag: 'new', text: { en: 'AI-powered website audits using Claude Sonnet', fr: 'Audits de sites par IA avec Claude Sonnet' } },
      { tag: 'new', text: { en: 'Google OAuth authentication', fr: 'Authentification Google OAuth' } },
      { tag: 'new', text: { en: '7-dimension scoring system (design, copy, trust, UX, mobile, conversion, first impression)', fr: 'Système de score 7 dimensions (design, copy, confiance, UX, mobile, conversion, 1ère impression)' } },
      { tag: 'new', text: { en: 'Kill list and prioritized fix plan', fr: 'Kill list et plan d\'action priorisé' } },
    ],
  },
];

const TAG_COLORS: Record<Tag, { bg: string; text: string; border: string; label: Record<string, string> }> = {
  new: { bg: 'rgba(34,197,94,0.1)', text: '#22C55E', border: 'rgba(34,197,94,0.3)', label: { en: 'New', fr: 'Nouveau' } },
  improved: { bg: 'rgba(249,115,22,0.1)', text: '#F97316', border: 'rgba(249,115,22,0.3)', label: { en: 'Improved', fr: 'Amélioré' } },
  fixed: { bg: 'rgba(139,92,246,0.1)', text: '#8B5CF6', border: 'rgba(139,92,246,0.3)', label: { en: 'Fixed', fr: 'Corrigé' } },
};

export default function ChangelogPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-24 flex-1 w-full">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
            {lang === 'fr' ? 'Journal des mises à jour' : 'Release Notes'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: '#F8FAFC' }}>{t('changelog.title')}</h1>
          <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>{t('changelog.subtitle')}</p>
        </div>

        {/* Entries */}
        <div className="relative pl-6" style={{ borderLeft: '2px solid rgba(249,115,22,0.15)' }}>
          {CHANGELOG.map((entry, i) => (
            <div key={entry.version} className="relative mb-16 last:mb-0 pl-6">
              {/* Dot */}
              <div className="absolute -left-[calc(1.5rem+1px)] top-1.5 w-3 h-3 rounded-full" style={{ background: i === 0 ? '#F97316' : '#1E293B', border: '2px solid rgba(249,115,22,0.4)', boxShadow: i === 0 ? '0 0 12px rgba(249,115,22,0.4)' : 'none' }} />

              {/* Version header */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xl font-black tracking-tight" style={{ color: '#F8FAFC' }}>{entry.version}</span>
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full" style={{ color: '#64748B', background: 'rgba(100,116,139,0.1)', border: '1px solid rgba(100,116,139,0.2)' }}>
                  {entry.date[lang]}
                </span>
                {i === 0 && (
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: '#22C55E', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    {lang === 'fr' ? 'Dernière version' : 'Latest'}
                  </span>
                )}
              </div>

              {/* Changes */}
              <div className="space-y-2.5">
                {entry.changes.map((change, j) => {
                  const tagStyle = TAG_COLORS[change.tag];
                  return (
                    <div key={j} className="flex items-start gap-3 py-2.5 px-4 rounded-xl" style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.07)' }}>
                      <span className="shrink-0 mt-0.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}` }}>
                        {tagStyle.label[lang]}
                      </span>
                      <span className="text-sm font-medium" style={{ color: '#CBD5E1' }}>{change.text[lang]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
