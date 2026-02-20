'use client'

import { Building2, Briefcase, Users, ShoppingCart, ShieldCheck, Landmark, Globe, Receipt, ArrowRight } from 'lucide-react';
import Image from "next/image"
import {useLanguage} from "@/messages/LanguageProvider"


export default function BusinessPage() {
    const {t, locale} = useLanguage()


  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 px-6 lg:py-32 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 text-left">
          <div>
            <span className="inline-block py-1 px-3 mb-6 text-sm font-medium bg-accent-foreground/20 text-primary-foreground rounded-full border border-secondary/30">
              {t("BusinessPage", "hero.badge")}
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
              {t("BusinessPage", "hero.title")} <br /> 
              <span className="text-accent">{t("BusinessPage", "hero.titleAccent")}</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mb-10 leading-relaxed">
              {t("BusinessPage", "hero.description")}  
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-brand-blue text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent-foreground transition-all flex items-center justify-center gap-2">
                {t("BusinessPage", "hero.cta")} <ArrowRight size={18} />
              </button>
              <button className="bg-transparent border border-slate-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all">
                {t("BusinessPage", "hero.sales")}
              </button>
            </div>
          </div>
          {/* Illustration Mockup placeholder */}
          <div className="hidden lg:block relative">
            <Image className="w-full rounded-lg" src="/img/home1.png" width={400} height={400} alt="" />
          </div>
        </div>
      </section>

      {/* 2. WHO IT'S FOR */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-400 mb-12">{t("BusinessPage", "audience.title")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Briefcase size={20}/>, label: t("BusinessPage", "audience.freelancers")},
              { icon: <Building2 size={20}/>, label: t("BusinessPage", "audience.startups") },
              { icon: <Users size={20}/>, label: t("BusinessPage", "audience.teams") },
              { icon: <ShoppingCart size={20}/>, label: t("BusinessPage", "audience.merchants") }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-slate-600">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">{item.icon}</div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BUSINESS FEATURES (Bento Style) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureBox 
            icon={<Landmark className="text-brand-blue" />}
            title={t("BusinessPage", "features.wallets.title")}
            desc={t("BusinessPage", "features.wallets.description")}
          />
          <FeatureBox 
            icon={<Globe className="text-brand-blue" />}
            title={t("BusinessPage", "features.transfers.title")}
            desc={t("BusinessPage", "features.transfers.description")}
          />
          <FeatureBox 
            icon={<Receipt className="text-brand-blue" />}
            title={t("BusinessPage", "features.cards.title")}
            desc={t("BusinessPage", "features.cards.description")}
          />
          <FeatureBox 
            icon={<ShieldCheck className="text-brand-blue" />}
            title={t("BusinessPage", "features.loans.title")}
            desc={t("BusinessPage", "features.loans.description")}
          />
        </div>
      </section>

      {/* 4. HOW IT WORKS (The Verification Flow) */}
      <section className="py-24 border-t border-slate-100 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">{t("BusinessPage", "onboarding.title")}</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <Step num="1" title={t("BusinessPage", "onboarding.step1.title")} desc={t("BusinessPage", "onboarding.step1.description")} />
            <Step num="2" title={t("BusinessPage", "onboarding.step2.title")} desc={t("BusinessPage", "onboarding.step2.description")} />
            <Step num="3" title={t("BusinessPage", "onboarding.step2.title")} desc={t("BusinessPage", "onboarding.step3.description")} />
          </div>
        </div>
      </section>

      {/* 5. COMPLIANCE & CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-brand-dark rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">{t("BusinessPage", "footer.title")}</h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto">{t("BusinessPage", "footer.description")}</p>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all">
              {t("BusinessPage", "footer.cta")}
            </button>
            <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest font-semibold">{t("BusinessPage", "footer.note")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBox({ icon, title, desc }) {
  return (
    <div className="p-10 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-200 transition-colors">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="relative">
      <div className="text-6xl font-black text-slate-100 absolute -top-10 left-1/2 -translate-x-1/2 -z-10">{num}</div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
  );
}