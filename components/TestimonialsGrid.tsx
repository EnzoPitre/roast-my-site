'use client';
import { useState } from 'react';

export type Sector = 'all' | 'saas' | 'ecommerce' | 'freelance' | 'agency' | 'local' | 'other';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  sector: Exclude<Sector, 'all'>;
  stars: number;
  quote: { en: string; fr: string };
  initials: string;
  color: string;
  metric?: string;
}

export interface DbReview {
  id: string;
  name: string;
  role: string;
  company: string | null;
  sector: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Thomas R.',
    role: 'Founder',
    company: 'Launchpad Studio',
    sector: 'saas',
    stars: 5,
    initials: 'TR',
    color: '#F97316',
    metric: '2×',
    quote: {
      en: "I built my SaaS landing page myself and thought it was decent. Roast My Site gave it a 3/10. Brutal. Accurate. After fixing the top 3 issues, my trial signups doubled in 2 weeks.",
      fr: "J'ai construit ma landing page moi-même et je pensais qu'elle était correcte. Roast My Site lui a donné 3/10. Brutal. Exact. Après avoir corrigé les 3 problèmes principaux, mes inscriptions ont doublé en 2 semaines.",
    },
  },
  {
    id: 2,
    name: 'Camille D.',
    role: 'Freelance UX Designer',
    company: '',
    sector: 'freelance',
    stars: 5,
    initials: 'CD',
    color: '#8B5CF6',
    quote: {
      en: "I roast client sites before kickoff calls now. It gives me instant credibility and a concrete list of issues to fix. Worth every cent.",
      fr: "Je roaste les sites clients avant mes appels de lancement maintenant. Ça me donne une crédibilité immédiate et une liste concrète de problèmes à corriger. Chaque centime bien dépensé.",
    },
  },
  {
    id: 3,
    name: 'Karim B.',
    role: 'E-commerce Manager',
    company: 'Maison Nude',
    sector: 'ecommerce',
    stars: 5,
    initials: 'KB',
    color: '#22C55E',
    metric: '1.2% → 2.8%',
    quote: {
      en: "Our add-to-cart rate was at 1.2%. The audit spotted a CTA buried below the fold we had ignored for months. Fixed it. Now at 2.8%.",
      fr: "Notre taux d'ajout au panier était à 1,2%. L'audit a repéré un CTA enterré sous la ligne de flottaison qu'on ignorait depuis des mois. Corrigé. Maintenant à 2,8%.",
    },
  },
  {
    id: 4,
    name: 'Sarah M.',
    role: 'Growth Lead',
    company: 'Stackr',
    sector: 'saas',
    stars: 5,
    initials: 'SM',
    color: '#F97316',
    metric: '+34%',
    quote: {
      en: "The kill list was uncomfortable to read. Every point was true. We fixed the top 5 issues in a sprint. Conversion up 34% the next month.",
      fr: "La kill list était inconfortable à lire. Chaque point était vrai. On a corrigé les 5 principaux problèmes en un sprint. Conversion +34% le mois suivant.",
    },
  },
  {
    id: 5,
    name: 'Remi L.',
    role: 'Solo Founder',
    company: 'TaskFlow',
    sector: 'saas',
    stars: 4,
    initials: 'RL',
    color: '#EA580C',
    quote: {
      en: "I knew my landing page needed work. I didn't know it needed this much work. The fix plan gave me a clear roadmap instead of vague 'improve your copy' advice.",
      fr: "Je savais que ma landing page avait besoin de travail. Je ne savais pas que c'était à ce point. Le plan d'action m'a donné une feuille de route claire au lieu de conseils vagues.",
    },
  },
  {
    id: 6,
    name: 'Ana P.',
    role: 'Marketing Strategist',
    company: '',
    sector: 'freelance',
    stars: 5,
    initials: 'AP',
    color: '#EC4899',
    quote: {
      en: "I used this to audit a client's site before presenting a proposal. Showed up with data instead of opinions. Closed the deal same day.",
      fr: "J'ai utilisé ça pour auditer le site d'un client avant de présenter une proposition. J'ai présenté des données plutôt que des opinions. Contrat signé le jour même.",
    },
  },
  {
    id: 7,
    name: 'Julien M.',
    role: 'E-commerce Manager',
    company: 'VeloCity Shop',
    sector: 'ecommerce',
    stars: 5,
    initials: 'JM',
    color: '#22C55E',
    metric: '78% → 61%',
    quote: {
      en: "Our cart abandonment was 78%. The roast identified that our shipping costs only appeared at checkout. We moved them to product pages. Abandonment dropped to 61% in 2 weeks.",
      fr: "Notre abandon de panier était à 78%. Le roast a identifié que nos frais de livraison n'apparaissaient qu'à la caisse. On les a déplacés sur les pages produit. L'abandon est tombé à 61% en 2 semaines.",
    },
  },
  {
    id: 8,
    name: 'Marie C.',
    role: 'Founder',
    company: 'CleanBox SaaS',
    sector: 'saas',
    stars: 5,
    initials: 'MC',
    color: '#F97316',
    metric: '+23% MRR',
    quote: {
      en: "I roasted our pricing page after 3 months of low conversions. Score: 3/10. The AI found we had 6 pricing tiers (too many) and no annual discount. Simplified to 3 tiers + annual. MRR up 23% next month.",
      fr: "J'ai roasté notre page de tarification après 3 mois de faibles conversions. Score : 3/10. L'IA a trouvé qu'on avait 6 niveaux de prix (trop) et pas de remise annuelle. Simplifié à 3 niveaux + annuel. MRR +23% le mois suivant.",
    },
  },
  {
    id: 9,
    name: 'Pierre D.',
    role: 'Web Designer',
    company: '',
    sector: 'freelance',
    stars: 4,
    initials: 'PD',
    color: '#8B5CF6',
    metric: '3/4 deals',
    quote: {
      en: "I use this for every client discovery call. Walk in with a roast = instant authority. Closed 3 of my last 4 proposals.",
      fr: "Je l'utilise pour chaque appel de découverte client. Arriver avec un roast = autorité instantanée. Signé 3 de mes 4 dernières propositions.",
    },
  },
  {
    id: 10,
    name: 'Nina B.',
    role: 'Agency Director',
    company: 'Studio Pixel',
    sector: 'agency',
    stars: 5,
    initials: 'NB',
    color: '#EC4899',
    quote: {
      en: "We roast competitor sites for our pitch decks. Shows clients exactly why their current site is underperforming vs industry. Game changer for new business.",
      fr: "On roaste les sites concurrents pour nos pitchs. Montre aux clients exactement pourquoi leur site sous-performe par rapport au secteur. Changeur de jeu pour le new business.",
    },
  },
  {
    id: 11,
    name: 'Hassan K.',
    role: 'Restaurant Owner',
    company: '',
    sector: 'local',
    stars: 5,
    initials: 'HK',
    color: '#22C55E',
    metric: '+180%',
    quote: {
      en: "Score: 3/10. Main issue: no online reservation button above fold. Added one. Online reservations up 180% in the first month.",
      fr: "Score : 3/10. Problème principal : pas de bouton de réservation en ligne au-dessus de la ligne de flottaison. En ajouté un. Réservations en ligne +180% le premier mois.",
    },
  },
  {
    id: 12,
    name: 'Laura S.',
    role: 'Marketing Manager',
    company: '',
    sector: 'saas',
    stars: 5,
    initials: 'LS',
    color: '#F97316',
    quote: {
      en: "Ran our competitor through Roast My Site before a campaign. Their weaknesses became our ad copy. Best €4.90 I've spent on competitive intel.",
      fr: "On a fait passer notre concurrent dans Roast My Site avant une campagne. Leurs faiblesses sont devenues notre copy publicitaire. Le meilleur 4,90€ dépensé en veille concurrentielle.",
    },
  },
  {
    id: 13,
    name: 'Antoine R.',
    role: 'Dropshipper',
    company: '',
    sector: 'ecommerce',
    stars: 4,
    initials: 'AR',
    color: '#EA580C',
    metric: '0.4% → 1.8%',
    quote: {
      en: "My store had zero trust signals. No reviews, no about page, no return policy visible. The AI called it 'a recipe for cart abandonment'. Fixed everything. Conversion went from 0.4% to 1.8%.",
      fr: "Ma boutique n'avait aucun signal de confiance. Pas d'avis, pas de page à propos, pas de politique de retour visible. L'IA a appelé ça 'une recette pour l'abandon de panier'. Tout corrigé. Conversion passée de 0,4% à 1,8%.",
    },
  },
  {
    id: 14,
    name: 'Céline V.',
    role: 'Consultant',
    company: '',
    sector: 'freelance',
    stars: 5,
    initials: 'CV',
    color: '#8B5CF6',
    metric: '3× inquiries',
    quote: {
      en: "I sent my portfolio through. Got a 5/10. Harsh but the feedback about my CTA being 'contact me' (vague) vs 'Book a free 30-min call' (specific) was spot on. Inquiries tripled.",
      fr: "J'ai envoyé mon portfolio. J'ai eu 5/10. Sévère mais le feedback sur mon CTA 'contactez-moi' (vague) vs 'Réservez un appel gratuit de 30 min' (spécifique) était parfait. Les demandes ont triplé.",
    },
  },
  {
    id: 15,
    name: 'Marc T.',
    role: 'CTO',
    company: 'DevFlow',
    sector: 'saas',
    stars: 5,
    initials: 'MT',
    color: '#22C55E',
    metric: '+44%',
    quote: {
      en: "Our developer tool landing page scored 4/10 due to jargon overload. The fix plan suggested leading with the outcome not the tech. Rewrote hero. Trial signups +44%.",
      fr: "Notre landing page d'outil développeur a eu 4/10 à cause de la surcharge de jargon. Le plan suggérait de mettre en avant le résultat, pas la techno. Hero réécrit. Inscriptions +44%.",
    },
  },
];

const SECTOR_FILTERS: { key: Sector; labelEn: string; labelFr: string }[] = [
  { key: 'all',       labelEn: 'All',            labelFr: 'Tous' },
  { key: 'saas',      labelEn: 'SaaS & Tech',    labelFr: 'SaaS & Tech' },
  { key: 'ecommerce', labelEn: 'E-commerce',     labelFr: 'E-commerce' },
  { key: 'freelance', labelEn: 'Freelancers',    labelFr: 'Freelances' },
  { key: 'agency',    labelEn: 'Agencies',       labelFr: 'Agences' },
  { key: 'local',     labelEn: 'Local Business', labelFr: 'Commerce local' },
  { key: 'other',     labelEn: 'Other',          labelFr: 'Autre' },
];

const REVIEW_COLORS = ['#F97316', '#8B5CF6', '#22C55E', '#EC4899', '#EA580C', '#06B6D4'];

function getReviewColor(id: string): string {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return REVIEW_COLORS[sum % REVIEW_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase();
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < stars ? '#F97316' : '#1E293B', fontSize: '14px' }}>★</span>
      ))}
    </div>
  );
}

interface Props {
  lang: 'en' | 'fr';
  realReviews?: DbReview[];
}

export function TestimonialsGrid({ lang, realReviews = [] }: Props) {
  const [sector, setSector] = useState<Sector>('all');

  // Map real DB reviews to a unified display format
  const realCards = realReviews.map(r => ({
    key: r.id,
    name: r.name,
    role: r.role,
    company: r.company ?? '',
    sector: r.sector as Exclude<Sector, 'all'>,
    stars: r.rating,
    quote: r.comment,
    initials: getInitials(r.name),
    color: getReviewColor(r.id),
    metric: undefined as string | undefined,
    isReal: true,
  }));

  // Map static testimonials
  const staticCards = TESTIMONIALS.map(t => ({
    key: String(t.id),
    name: t.name,
    role: t.role,
    company: t.company,
    sector: t.sector,
    stars: t.stars,
    quote: t.quote[lang],
    initials: t.initials,
    color: t.color,
    metric: t.metric,
    isReal: false,
  }));

  // Real reviews first, then static
  const allCards = [...realCards, ...staticCards];

  const filtered = allCards.filter(c => sector === 'all' || c.sector === sector);

  // Only show 'other' filter tab if there are real reviews in that sector
  const visibleFilters = SECTOR_FILTERS.filter(f =>
    f.key !== 'other' || realCards.some(r => r.sector === 'other')
  );

  return (
    <>
      {/* Sector filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {visibleFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setSector(f.key)}
            className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all cursor-pointer"
            style={{
              background: sector === f.key ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
              color: sector === f.key ? '#F97316' : '#64748B',
              border: `1px solid ${sector === f.key ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {lang === 'fr' ? f.labelFr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(card => (
          <div
            key={card.key}
            className="rounded-[16px] p-6 flex flex-col gap-4 transition-all hover:border-orange-500/25"
            style={{ background: '#13131A', border: '1px solid rgba(249,115,22,0.12)' }}
          >
            {/* Stars + badge */}
            <div className="flex items-center justify-between">
              <StarRating stars={card.stars} />
              {card.isReal ? (
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  {lang === 'fr' ? 'Utilisateur vérifié ✓' : 'Verified User ✓'}
                </span>
              ) : (
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}
                >
                  {SECTOR_FILTERS.find(f => f.key === card.sector)?.[lang === 'fr' ? 'labelFr' : 'labelEn']}
                </span>
              )}
            </div>

            {/* Quote */}
            <p className="text-sm font-medium leading-relaxed italic flex-1" style={{ color: '#CBD5E1' }}>
              &ldquo;{card.quote}&rdquo;
            </p>

            {/* Metric highlight */}
            {card.metric && (
              <div className="text-xl font-black" style={{ color: card.color }}>
                {card.metric}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(249,115,22,0.08)' }}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0"
                style={{ background: `${card.color}20`, color: card.color, border: `1px solid ${card.color}40` }}
              >
                {card.initials}
              </div>
              <div>
                <div className="text-sm font-black" style={{ color: '#F8FAFC' }}>{card.name}</div>
                <div className="text-xs font-medium" style={{ color: '#64748B' }}>
                  {card.role}{card.company ? ` @ ${card.company}` : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
