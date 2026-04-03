import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { TranslationKey } from '@/lib/translations';
import { RevealWrapper } from '@/components/ScrollObserver';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const numMap = Array.from({ length: 12 }, (_, i) => i + 1);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto py-24 px-6 section-divider">
      <RevealWrapper animation="reveal-up">
        <h2 className="text-center text-3xl md:text-5xl font-black tracking-tight mb-16 text-[#F8FAFC]">
          {t('faq.title')}
        </h2>
      </RevealWrapper>

      <div className="flex flex-col gap-4">
        {numMap.map((id, index) => {
          const isOpen = openIndex === index;
          return (
            <RevealWrapper key={id} animation="reveal-up" delayClass={`stagger-${(index % 4) + 1}`}>
              <div 
                className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? 'border-orange-500/50' : 'border-white/5 hover:border-orange-500/20'}`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className={`font-bold text-lg md:text-xl transition-colors ${isOpen ? 'text-[#F97316]' : 'text-[#F8FAFC]'}`}>
                    {t(`faq.${id}.q` as TranslationKey)}
                  </span>
                  <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : 'text-[#64748B]'}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>
                
                <div 
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out px-6"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="text-[#94A3B8] text-base md:text-lg pb-6 leading-relaxed">
                      {t(`faq.${id}.a` as TranslationKey)}
                    </p>
                  </div>
                </div>
              </div>
            </RevealWrapper>
          );
        })}
      </div>
    </section>
  );
}
