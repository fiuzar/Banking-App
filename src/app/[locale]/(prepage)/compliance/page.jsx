'use client'

import { ShieldCheck, UserCheck, Search, Database, AlertCircle, Mail } from 'lucide-react';
import { useLanguage } from '@/messages/LanguageProvider';

export default function CompliancePage() {
  const { t } = useLanguage();

  // ✅ Safe array access
  const frameworkItems = t("CompliancePage", "framework.items") || [];
  const kycList = t("CompliancePage", "verification.kyc.list") || [];
  const kybList = t("CompliancePage", "verification.kyb.list") || [];

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100">

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 px-6 lg:pt-48 lg:pb-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {t("CompliancePage", "hero.title")}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t("CompliancePage", "hero.description")}
          </p>
        </div>
      </section>

      {/* 2. REGULATORY FRAMEWORK */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 mb-8">
            {t("CompliancePage", "framework.intro")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {Array.isArray(frameworkItems) &&
              frameworkItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                  <ShieldCheck className="text-blue-600" size={20} />
                  <span className="font-medium text-slate-800">{item}</span>
                </div>
              ))}
          </div>
        </div>

        {/* 3. KYC & KYB */}
        <div className="space-y-12 py-12 border-t border-slate-100">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <UserCheck className="text-blue-600" />
            {t("CompliancePage", "verification.title")}
          </h2>

          <div className="grid md:grid-cols-2 gap-12">

            {/* KYC */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                {t("CompliancePage", "verification.kyc.title")}
              </h3>

              <p className="text-slate-600 mb-4">
                {t("CompliancePage", "verification.kyc.description")}
              </p>

              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                {Array.isArray(kycList) &&
                  kycList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>

            {/* KYB */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                {t("CompliancePage", "verification.kyb.title")}
              </h3>

              <p className="text-slate-600 mb-4">
                {t("CompliancePage", "verification.kyb.description")}
              </p>

              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                {Array.isArray(kybList) &&
                  kybList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>

          </div>
        </div>

        {/* 4. AML & MONITORING */}
        <div className="py-12 border-t border-slate-100">
          <div className="bg-slate-900 text-white p-10 rounded-4xl flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400">
              <Search size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">
                {t("CompliancePage", "monitoring.title")}
              </h3>
              <p className="text-slate-400">
                {t("CompliancePage", "monitoring.description")}
              </p>
            </div>
          </div>
        </div>

        {/* 5. DATA + RISK */}
        <div className="grid md:grid-cols-2 gap-12 py-12 border-t border-slate-100">

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Database size={20} className="text-blue-600" />
              {t("CompliancePage", "protection.data.title")}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("CompliancePage", "protection.data.description")}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-600" />
              {t("CompliancePage", "protection.risk.title")}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("CompliancePage", "protection.risk.description")}
            </p>
          </div>

        </div>

        {/* 6. CONTACT */}
        <div className="mt-12 p-8 bg-secondary border border-blue-100 rounded-2xl text-center">
          <p className="text-slate-700 font-medium mb-4 flex items-center justify-center gap-2">
            <Mail size={18} className="text-blue-600" />
            {t("CompliancePage", "contact.label")}
          </p>

          <a
            href={`mailto:${t("CompliancePage", "contact.email")}`}
            className="text-2xl font-bold text-brand-blue hover:underline"
          >
            {t("CompliancePage", "contact.email")}
          </a>
        </div>

      </section>
    </div>
  );
}
