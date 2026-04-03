'use client';
import { Header } from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Language } from "@/lib/translations";

import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { StatsCounter } from "@/components/landing/StatsCounter";
import { PressRow } from "@/components/landing/PressRow";
import { FAQ } from "@/components/landing/FAQ";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AuditDimensions } from "@/components/landing/AuditDimensions";
import { RealResults } from "@/components/landing/RealResults";
import { SpeedTimeline } from "@/components/landing/SpeedTimeline";

export function LandingPageClient() {
  const { lang: urlLang } = useParams();
  const { lang, setLang } = useLanguage();

  // Sync language provider with url param
  useEffect(() => {
    if (urlLang === 'en' || urlLang === 'fr') {
      if (lang !== urlLang) {
        setLang(urlLang as Language);
      }
    }
  }, [urlLang, lang, setLang]);

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden flex flex-col items-center">

        <Hero />
        <PressRow />
        <HowItWorks />
        <SpeedTimeline />
        <AuditDimensions />
        <StatsCounter />
        <Testimonials />
        <BeforeAfter />
        <RealResults />

        {/* Newsletter — between BeforeAfter and FAQ */}
        <section className="w-full max-w-2xl mx-auto px-6 py-10 z-10">
          <NewsletterSignup lang={lang as Language} />
        </section>

        <FAQ />

        {/* ── FOOTER CTA ── */}
        <section className="w-full relative z-10 py-32 px-6 flex flex-col items-center text-center mt-12 bg-gradient-to-t from-orange-500/10 to-transparent">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-[#F8FAFC]">
            {lang === 'fr' ? 'Arrêtez de deviner. Commencez à roaster.' : 'Stop guessing. Start roasting.'}
          </h2>
          <p className="text-xl text-[#94A3B8] max-w-xl mb-10 font-medium leading-relaxed">
            {lang === 'fr'
              ? 'Découvrez exactement ce qui brise votre funnel en trente secondes.'
              : "Discover exactly what's breaking your funnel in thirty seconds."}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-orange text-lg px-8 py-4 animate-glow cursor-pointer"
          >
            {lang === 'fr' ? 'Auditer mon site gratuitement 🔥' : 'Roast my site for free 🔥'}
          </button>
        </section>

      </main>
    </>
  );
}
