'use client';

import { useLanguage } from "@/messages/LanguageProvider";

export default function ValuePillars() {
  const { t } = useLanguage();

  const pillars = [
    {
      title: t("ValuePillars", "multiCurrencyTitle"),
      desc: t("ValuePillars", "multiCurrencyDesc"),
      icon: "🌍",
      color: "bg-blue-50"
    },
    {
      title: t("ValuePillars", "transparentFxTitle"),
      desc: t("ValuePillars", "transparentFxDesc"),
      icon: "📊",
      color: "bg-green-50"
    },
    {
      title: t("ValuePillars", "currencyCardsTitle"),
      desc: t("ValuePillars", "currencyCardsDesc"),
      icon: "💳",
      color: "bg-purple-50"
    }
  ];

  return (
    <section className="py-20 bg-n-100">
      <div className="mx-auto max-w-7xl px-screen-p">
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-brand-card shadow-soft hover:translate-y-[-4px] transition-transform"
            >
              <div
                className={`w-12 h-12 ${p.color} rounded-full flex items-center justify-center text-2xl mb-6`}
              >
                {p.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-n-900">
                {p.title}
              </h3>
              <p className="text-n-500 leading-relaxed text-sm">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
