import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Link2, Bot, Flame } from "lucide-react";
import { translations, Language, TranslationKey } from "@/lib/translations";

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  if (lang === 'fr') {
    const canonical = `${BASE_URL}/fr/comment-ca-marche`;
    return {
      title: "Comment fonctionne l'audit IA de site web — Roast My Site",
      description: "Notre IA analyse votre site sur 7 dimensions en 30 secondes et génère un plan d'action concret. Découvrez le fonctionnement complet.",
      keywords: ['comment auditer son site web', 'analyse UX IA', 'score site web', 'outil audit gratuit'],
      alternates: { canonical, languages: { en: `${BASE_URL}/en/how-it-works`, fr: canonical } },
      openGraph: { title: "Comment fonctionne l'audit IA de site web — Roast My Site", description: "Notre IA analyse votre site sur 7 dimensions en 30 secondes et génère un plan d'action concret. Découvrez le fonctionnement complet.", url: canonical, type: 'website' },
    };
  }
  const canonical = `${BASE_URL}/en/how-it-works`;
  return {
    title: 'How AI Website Audits Work in 30 Seconds — Roast My Site',
    description: 'Roast My Site analyzes 7 dimensions: design, copywriting, trust signals, UX, mobile, conversion, and first impression. Get your action plan.',
    keywords: ['how website audit works', 'ai website analysis', 'ux audit tool', 'site audit dimensions', 'how to audit a website'],
    alternates: { canonical, languages: { en: canonical, fr: `${BASE_URL}/fr/comment-ca-marche` } },
    openGraph: { title: 'How AI Website Audits Work in 30 Seconds — Roast My Site', description: 'Roast My Site analyzes 7 dimensions: design, copywriting, trust signals, UX, mobile, conversion, and first impression. Get your action plan.', url: canonical, type: 'website' },
  };
}

export default function HowItWorks({ params }: { params: { lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  const steps = [
    { icon: Link2, title: t('hiw.page.step1.title'), desc: t('hiw.page.step1.desc') },
    { icon: Bot,   title: t('hiw.page.step2.title'), desc: t('hiw.page.step2.desc') },
    { icon: Flame, title: t('hiw.page.step3.title'), desc: t('hiw.page.step3.desc') },
  ];

  const faqs = [
    { q: t('hiw.page.faq.1.q'), a: t('hiw.page.faq.1.a') },
    { q: t('hiw.page.faq.2.q'), a: t('hiw.page.faq.2.a') },
    { q: t('hiw.page.faq.3.q'), a: t('hiw.page.faq.3.a') },
    { q: t('hiw.page.faq.4.q'), a: t('hiw.page.faq.4.a') },
    { q: t('hiw.page.faq.5.q'), a: t('hiw.page.faq.5.a') },
  ];

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-24 flex-1 w-full relative overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.09), transparent 70%)', filter: 'blur(80px)' }} />

        <h1 className="text-4xl md:text-5xl font-black mb-16 text-center tracking-tight text-gradient-white relative z-10">
          {t('hiw.page.title')}
        </h1>

        <div className="grid md:grid-cols-3 gap-5 mb-24 relative z-10">
          {steps.map((s, i) => (
            <div key={i} className="glass-card p-8 text-center group cursor-default">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#F97316' }}>
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#F8FAFC' }}>{s.title}</h3>
              <p className="text-sm font-medium leading-relaxed" style={{ color: '#94A3B8' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-black mb-10 text-center tracking-tight relative z-10" style={{ color: '#F8FAFC' }}>
          {t('hiw.page.faq.title')}
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto relative z-10">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card p-6">
              <h4 className="font-bold text-base mb-2" style={{ color: '#F8FAFC' }}>{faq.q}</h4>
              <p className="font-medium text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
