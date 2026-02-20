"use client";

import { useLanguage } from "@/messages/LanguageProvider";

export default function TermsPage() {
  const { t } = useLanguage();

  const currentDate = new Date().toLocaleString() // you can make this dynamic later

  const sections = [
    { id: "intro", key: "intro" },
    { id: "definitions", key: "definitions" },
    { id: "eligibility", key: "eligibility" },
    { id: "security", key: "security" },
    { id: "wallets", key: "wallets" },
    { id: "fx", key: "fx" },
    { id: "loans", key: "loans" },
    { id: "compliance", key: "compliance" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-n-100 py-16 bg-n-100/50">
        <div className="mx-auto max-w-7xl px-screen-p">
          <h1 className="text-4xl font-bold text-brand-dark mb-4">
            {t("TermsPage", "title")}
          </h1>
          <p className="text-n-500 font-medium">
            {t("TermsPage", "lastUpdated").replace("{date}", currentDate)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-screen-p py-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 sticky top-24 h-fit">
          <nav className="space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block py-2 px-3 text-sm font-medium text-n-500 hover:text-brand-blue hover:bg-brand-blue/5 rounded-md transition-colors"
              >
                {t("TermsPage", `sections.${s.key}.title`)}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl space-y-12 pb-24">
          
          {/* 1. Introduction */}
          <section id="intro" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              {t("TermsPage", "sections.intro.title")}
            </h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>{t("TermsPage", "sections.intro.p1")}</p>
              <p>{t("TermsPage", "sections.intro.p2")}</p>
            </div>
          </section>

          {/* 5. Wallets */}
          <section
            id="wallets"
            className="scroll-mt-24 p-8 bg-blue-50/50 rounded-brand-card border border-brand-blue/10"
          >
            <h2 className="text-2xl font-bold text-brand-blue mb-4">
              {t("TermsPage", "sections.wallets.title")}
            </h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>{t("TermsPage", "sections.wallets.p1")}</p>

              <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                {(t("TermsPage", "sections.wallets.list") || []).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>
          </section>

          {/* 7. FX */}
          <section id="fx" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              {t("TermsPage", "sections.fx.title")}
            </h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>{t("TermsPage", "sections.fx.p1")}</p>

              <p className="bg-n-100 p-4 rounded-brand-input border-l-4 border-brand-blue font-semibold italic text-sm">
                "{t("TermsPage", "sections.fx.warning")}"
              </p>

              <p>{t("TermsPage", "sections.fx.p2")}</p>
            </div>
          </section>

          {/* 9. Loans */}
          <section id="loans" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              {t("TermsPage", "sections.loans.title")}
            </h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>{t("TermsPage", "sections.loans.p1")}</p>
              <p>{t("TermsPage", "sections.loans.p2")}</p>
            </div>
          </section>

          {/* 11. Compliance */}
          <section id="compliance" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              {t("TermsPage", "sections.compliance.title")}
            </h2>
            <div className="text-n-700 space-y-4 leading-relaxed">
              <p>{t("TermsPage", "sections.compliance.p1")}</p>
              <p>{t("TermsPage", "sections.compliance.p2")}</p>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-12 border-t border-n-100">
            <p className="text-sm text-n-500 italic">
              {t("TermsPage", "footer.questions")}{" "}
              <span className="text-brand-blue font-bold">
                {t("TermsPage", "footer.email")}
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
