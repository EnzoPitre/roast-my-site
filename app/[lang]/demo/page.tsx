import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { RoastCard } from '@/components/RoastCard';
import { ScoreTable } from '@/components/ScoreTable';
import { FixPlan } from '@/components/FixPlan';
import { translations, Language, TranslationKey } from '@/lib/translations';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DemoViewTracker } from '@/components/DemoViewTracker';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const t = translations[lang];
  const canonical = `${BASE_URL}/${lang}/demo`;
  return {
    title: t['meta.demo.title'],
    description: t['meta.demo.description'],
    keywords: lang === 'fr'
      ? ['démo audit site web', 'exemple analyse IA', 'test audit gratuit roast my site']
      : ['website audit demo', 'ai audit example', 'free site analysis demo', 'roast my site demo'],
    alternates: { canonical, languages: { en: `${BASE_URL}/en/demo`, fr: `${BASE_URL}/fr/demo` } },
    openGraph: { title: t['meta.demo.title'], description: t['meta.demo.description'], url: canonical, type: 'website' },
  };
}

const DEMO_ROAST = {
  id: 'demo',
  url: 'boutique-example.com',
  globalScore: 4,
  summary: "Your boutique site has beautiful photography — but it's silently hemorrhaging potential customers. The absence of above-fold CTAs, missing trust signals, and a mobile product grid that collapses into chaos are costing you sales every single day.",
  createdAt: new Date('2026-01-15').toISOString(),
  conversionEstimate: '~0.9%',
  topOpportunity: 'Pin a sticky "Add to Cart" button on mobile — this single fix can lift conversions by 40%.',
  competitorComparison: 'Your top competitor, Maison Lumière, shows 23 trust signals above the fold. You show zero. That gap is visible to every visitor in the first 3 seconds.',
  killList: [
    { rank: 1, issue: 'No above-fold call to action', why: 'Visitors have no clear next step. 68% bounce before scrolling past your hero image.' },
    { rank: 2, issue: 'Mobile product grid is broken', why: 'On iPhone SE and Android compact screens, products overlap. Shoppers literally cannot tap the item they want.' },
    { rank: 3, issue: 'Zero trust signals visible', why: 'No payment badges, no return policy mention, no review count. First-time buyers need reassurance before they open their wallet.' },
  ],
  scores: {
    firstImpression:  { score: 4, verdict: 'Hero image is stunning but the value proposition is buried. Visitors cannot tell what you sell in 3 seconds.' },
    visualDesign:     { score: 6, verdict: 'Strong photography and consistent palette. Spacing is inconsistent on product pages.' },
    copywriting:      { score: 3, verdict: 'Generic headlines ("Welcome to our store"). No urgency, no specificity, no hook.' },
    trust:            { score: 2, verdict: 'No reviews visible, no badges, no refund policy on product pages. Huge red flag for cold traffic.' },
    ux:               { score: 5, verdict: 'Navigation is clean on desktop. Filter sidebar collapses unexpectedly on tablet.' },
    mobile:           { score: 3, verdict: 'Product grid breaks at 375px. Checkout button clips off screen on iOS Safari.' },
    conversion:       { score: 4, verdict: 'Cart CTA is below the fold on all product pages. No sticky buy button, no urgency timers.' },
  },
  fixPlan: {
    quick:     [
      'Move "Add to Cart" button above the fold on all product pages',
      'Add a trust badge row (Visa/Mastercard/PayPal icons + "Free returns")',
      'Increase body font from 13px to 16px for readability',
      'Add star rating count next to the product title',
      'Fix product grid CSS at 375px breakpoint (gap: 8px → 4px)',
    ],
    medium:    [
      'Implement sticky "Add to Cart" bar that appears on scroll',
      'Add a "Free shipping over €50" announcement banner at top',
      'Rebuild mobile checkout flow — current 4-step flow should be 2-step',
      'Write benefit-led product descriptions (replace feature lists with outcomes)',
      'A/B test hero headline: current vs "Handcrafted pieces for modern living"',
    ],
    strategic: [
      'Implement abandoned cart email sequence (3 emails, 1h / 24h / 72h)',
      'Add product video for 3 hero SKUs — video lifts conversion by 80% on mobile',
      'Run heatmap study (Hotjar/Microsoft Clarity) for 2 weeks to identify rage-click zones',
      'Build a "Complete the look" upsell section on product pages',
    ],
  },
  quickWins:    [
    'Pin sticky CTA on mobile product pages',
    'Add "★ 4.8 (312 reviews)" below product title',
    'Replace hero headline with a specific value prop',
  ],
  encouragement: "Your product photography is genuinely world-class — most e-commerce sites would kill for images this good. That's your biggest competitive advantage. Now let's build a conversion machine worthy of it.",
  isPaid: true,
};

export default function DemoPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  return (
    <>
      <DemoViewTracker />
      <Header />
      <main className="min-h-screen pt-8 px-4 sm:px-6 relative pb-32">

        {/* Demo banner */}
        <div className="max-w-5xl mx-auto mb-6 px-5 py-4 rounded-xl text-center" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.45)' }}>
          <span className="font-black uppercase tracking-widest text-sm" style={{ color: '#F97316' }}>🔥 {t('demo.page.banner')}</span>
          <span className="ml-3 text-sm font-medium" style={{ color: '#94A3B8' }}>— {t('demo.page.banner.desc')}</span>
        </div>

        <RoastCard roast={DEMO_ROAST}>
          {/* Kill List */}
          <div className="mt-8 pt-10" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
            <h3 className="font-black mb-2 text-2xl tracking-tight" style={{ color: '#F8FAFC' }}>{t('roast.kill_list.title')}</h3>
            <p className="mb-8 font-medium" style={{ color: '#94A3B8' }}>{t('roast.kill_list.desc')}</p>
            <div className="grid gap-5 sm:grid-cols-3 mb-16">
              {DEMO_ROAST.killList.map((issue, idx) => (
                <div key={idx} className="rounded-[16px] p-6 relative overflow-hidden cursor-default" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="absolute -right-4 -bottom-6 font-black pointer-events-none leading-none select-none" style={{ fontSize: '120px', color: 'rgba(249,115,22,0.05)' }}>{issue.rank}</span>
                  <h4 className="font-black mb-2 text-base leading-tight relative z-10" style={{ color: '#F8FAFC' }}>{issue.issue}</h4>
                  <p className="text-sm relative z-10 leading-relaxed font-medium" style={{ color: '#94A3B8' }}>{issue.why}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div className="mb-14">
            <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3" style={{ color: '#F8FAFC' }}>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>1</span>
              {t('roast.dim_breakdown')}
            </h2>
            {/* @ts-ignore JSON safe */}
            <ScoreTable scores={DEMO_ROAST.scores} />
          </div>

          {/* Fix Plan */}
          <div className="mb-14">
            <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3" style={{ color: '#F8FAFC' }}>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>2</span>
              {t('roast.fix_plan')}
            </h2>
            <FixPlan plan={DEMO_ROAST.fixPlan} quickWins={DEMO_ROAST.quickWins} />
          </div>

          {/* Encouragement */}
          <div className="mt-4 rounded-[16px] p-8 sm:p-10" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <h3 className="font-black mb-3 text-xs uppercase tracking-widest flex items-center gap-2" style={{ color: '#F97316' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: '#F97316' }} /> {t('roast.encouragement')}
            </h3>
            <p className="font-medium text-lg leading-relaxed italic" style={{ color: '#CBD5E1' }}>&ldquo;{DEMO_ROAST.encouragement}&rdquo;</p>
          </div>
        </RoastCard>

        {/* Bottom CTA */}
        <div className="text-center mt-4 pb-8">
          <Link href={`/${lang}`} className="btn-orange text-base px-8 py-4 inline-flex items-center gap-2">
            {t('demo.page.cta')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>
    </>
  );
}
