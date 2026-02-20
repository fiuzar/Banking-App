'use client'

import {useLanguage} from "@/messages/LanguageProvider"

// components/home/HowItWorks.tsx
export default function HowItWorks() {
    const {t} = useLanguage()

  const steps = [t('HowItWorks', 'step1'), t('HowItWorks', 'step2'), t('HowItWorks', 'step3'), t('HowItWorks', 'step4')];
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-screen-p text-center">
        <h2 className="text-3xl font-bold mb-16">{t('title')}</h2>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 mx-auto flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-brand-blue/20">
                {i + 1}
              </div>
              <p className="font-semibold text-n-700">{step}</p>
            </div>
          ))}
          {/* Connector Line */}
          <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-n-100 z-0" />
        </div>
      </div>
    </section>
  );
}