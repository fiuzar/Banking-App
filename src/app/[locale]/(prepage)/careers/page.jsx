'use client'

import { Target, Star, TrendingUp, MapPin, ArrowUpRight, Mail } from 'lucide-react';
import {useLanguage} from "@/messages/LanguageProvider"

export default function CareersPage() {
  const teams = ["Engineering", "Product & Design", "Compliance & Risk", "Operations", "Customer Support", "Business & Partnerships"];
  const {t} = useLanguage()

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 bg-indigo-50/30 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-7xl font-bold tracking-tight mb-8">
            {t("CareersPage", 'hero.title')} <br />
            <span className="text-indigo-600">{t("CareersPage", 'hero.titleAccent')}</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t("CareersPage", 'hero.subtitle')}
          </p>
        </div>
      </section>

      {/* 2. WHY WORK WITH US */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <CultureCard 
            icon={<Target className="text-indigo-600" />} 
            title={t("CareersPage", 'culture.meaningful.title')} 
            desc={t("CareersPage", 'culture.meaningful.desc')}  
          />
          <CultureCard 
            icon={<Star className="text-indigo-600" />} 
            title={t("CareersPage", 'culture.standards.title')} 
            desc={t("CareersPage", 'culture.standards.desc')}  
          />
          <CultureCard 
            icon={<TrendingUp className="text-indigo-600" />} 
            title={t("CareersPage", 'culture.growth.title')}  
            desc={t("CareersPage", 'culture.growth.desc')}
          />
          <CultureCard 
            icon={<MapPin className="text-indigo-600" />} 
            title={t("CareersPage", 'culture.flexible.title')}
            desc={t("CareersPage", 'culture.flexible.desc')}
          />
        </div>
      </section>

      {/* 3. TEAMS & ROLES */}
      <section className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">{t("CareersPage", 'teams.title')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {t("CareersPage", 'teams.list').map((team, idx) => (
              <div key={idx} className="p-6 border border-slate-700 rounded-2xl hover:border-indigo-500 transition-colors group">
                <h3 className="text-xl font-semibold flex items-center justify-between">
                  {team} <ArrowUpRight className="text-slate-500 group-hover:text-indigo-400" size={18} />
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OPEN POSITIONS & PROCESS */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 mb-24">
          <h2 className="text-3xl font-bold mb-6">{t("CareersPage", 'openPositions.title')}</h2>
          <p className="text-slate-600 mb-8 italic">
            &ldquo;{t("CareersPage", 'openPositions.quote')}&ldquo;
          </p>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            {t("CareersPage", 'openPositions.cta')}
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-12">{t("CareersPage", 'hiringProcess.title')}</h2>
          <div className="space-y-8">
            {t("CareersPage", 'hiringProcess.steps').map((s, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <span className="text-indigo-600 font-mono font-bold">{s.id}</span>
                <div>
                  <h4 className="font-bold text-lg">{s.title}</h4>
                  <p className="text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DIVERSITY & CTA */}
      <section className="py-24 px-6 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 max-w-2xl mx-auto">
             <h3 className="font-bold text-xl mb-4">{t("CareersPage", 'inclusion.title')}</h3>
             <p className="text-slate-600">{t("CareersPage", 'inclusion.text')}</p>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
            <h2 className="text-3xl font-bold mb-4">{t("CareersPage", 'cta.title')}</h2>
            <p className="text-slate-500 mb-10">{t("CareersPage", 'cta.subtitle')}</p>
            <div className="flex flex-col items-center gap-4">
               <a href="mailto:careers@company.com" className="text-2xl font-bold text-indigo-600 hover:underline flex items-center gap-2">
                 <Mail size={24}/> careers@company.com
               </a>
               <button className="mt-4 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition-all">
                 {t("CareersPage", 'cta.button')}
               </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CultureCard({ icon, title, desc }) {
  return (
    <div className="space-y-4 text-center lg:text-left">
      <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}