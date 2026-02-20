'use client'

import { Shield, Eye, Scale, Fingerprint, ArrowUpRight, Building } from 'lucide-react';
import Link from "next/link";
import {useLanguage} from "@/messages/LanguageProvider"

export default function AboutPage() {
    const {t, locale} = useLanguage()

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
            {t('AboutPage', 'hero.title')} <br />
            <span className="text-slate-400">{t('AboutPage', 'hero.titleAccent')}</span>
          </h1>
          <p className="text-lg lg:text-xl text-accent-foreground leading-relaxed">
            {t('AboutPage', 'hero.subtitle')}
          </p>
        </div>
      </section>

      {/* 2. WHO WE ARE & MISSION */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">{t('AboutPage', 'mission.title')}</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            {t('AboutPage', 'mission.description')}
          </p>
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">{t('AboutPage', 'mission.label')}</h3>
            <p className="text-xl font-medium text-slate-800">
              {t('AboutPage', 'mission.quote')}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-64 bg-secondary rounded-2xl flex items-end p-6">
            <span className="text-6xl font-bold text-white">01</span>
          </div>
          <div className="h-64 bg-accent rounded-2xl flex items-end p-6">
            <span className="text-6xl font-bold text-blue-400/30">02</span>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE STAND FOR (VALUES) */}
      <section className="py-24 bg-brand-dark text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <ValueCard
              icon={<Eye className="text-blue-400" />}
              title={t('AboutPage', 'values.transparency.title')}
              desc={t('AboutPage', 'values.transparency.desc')}
            />
            <ValueCard
              icon={<Shield className="text-blue-400" />}
              title={t('AboutPage', 'values.security.title')}
              desc={t('AboutPage','values.security.desc')}
            />
            <ValueCard
              icon={<Scale className="text-blue-400" />}
              title={t('AboutPage', 'values.compliance.title')}
              desc={t('AboutPage', 'values.compliance.desc')}
            />
            <ValueCard
              icon={<Fingerprint className="text-blue-400" />}
              title={t('AboutPage', 'values.clarity.title')}
              desc={t('AboutPage', 'values.clarity.desc')}
            />
          </div>
        </div>
      </section>

      {/* 4. WHO WE SERVE & REGULATORY */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8">{t('AboutPage', 'regulatory.title')}</h2>
            <p className="text-slate-600 text-lg mb-8">
              {t('AboutPage', 'regulatory.description')}
            </p>
            <Link href="/compliance" className="inline-flex items-center gap-2 text-brand-blue font-bold hover:underline">
              {t('AboutPage', 'regulatory.link')} <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Building size={20} /> {t('AboutPage', 'companyInfo.title')}</h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex justify-between border-b border-slate-200 pb-2"><span>{t('AboutPage', 'companyInfo.entityLabel')}</span> <strong>Paysense Ltd</strong></li>
              <li className="flex justify-between border-b border-slate-200 pb-2"><span>{t('AboutPage', 'companyInfo.foundedLabel')}</span> <strong>2026</strong></li>
              <li className="flex justify-between border-b border-slate-200 pb-2"><span>{t('AboutPage', 'companyInfo.regionLabel')}</span> <strong>Global (Lagos HQ)</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 px-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-10">{t('AboutPage', 'cta.title')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <button className="bg-brand-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
                {t('AboutPage', 'cta.personal')}
              </button>
            </Link>
            <Link href="/signup" >
              <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all">
                {t('AboutPage', 'cta.business')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="space-y-4">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
// function ValueCard({ icon, title, desc }) {
//   return (
//     <div className="space-y-4">
//       <div className="mb-6">{icon}</div>
//       <h3 className="text-xl font-bold">{title}</h3>
//       <p className="text-slate-400 leading-relaxed">{desc}</p>
//     </div>
//   );
// }