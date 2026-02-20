"use client";

import {
  Search,
  Wallet,
  RefreshCw,
  Send,
  CreditCard,
  Landmark,
  ShieldCheck,
  HelpCircle,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/messages/LanguageProvider";

export default function HelpPage() {
  const { t } = useLanguage();

  const categories = [
    { icon: <Wallet size={24} />, key: "wallets" },
    { icon: <RefreshCw size={24} />, key: "fx" },
    { icon: <Send size={24} />, key: "transfers" },
    { icon: <CreditCard size={24} />, key: "cards" },
    { icon: <Landmark size={24} />, key: "loans" },
    { icon: <ShieldCheck size={24} />, key: "security" },
  ];

  const faqKeys = ["currencies", "automatic", "cardLinking", "kyc"];

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans">
      {/* HEADER */}
      <section className="bg-brand-dark pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            {t("HelpPage", "header.title")}
          </h1>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder={t("HelpPage", "header.searchPlaceholder")}
              className="w-full bg-accent-foreground border border-slate-700 text-white rounded-2xl py-5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center flex flex-col items-center gap-3"
            >
              <div className="text-accent-foreground">{cat.icon}</div>
              <span className="text-sm font-semibold text-slate-700">
                {t("HelpPage", `categories.${cat.key}`)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-2xl font-bold mb-12 flex items-center gap-2">
          <HelpCircle className="text-blue-600" />
          {t("HelpPage", "faq.title")}
        </h2>

        <div className="space-y-6">
          {faqKeys.map((key) => (
            <FAQItem
              key={key}
              question={t("HelpPage", `faq.items.${key}.question`)}
              answer={t("HelpPage", `faq.items.${key}.answer`)}
            />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Email */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex items-start gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl text-brand-dark">
              <Mail />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">
                {t("HelpPage", "contact.email.title")}
              </h4>
              <p className="text-slate-500 text-sm mb-4">
                {t("HelpPage", "contact.email.responseTime")}
              </p>
              <a
                href={`mailto:${t("HelpPage", "contact.email.value")}`}
                className="text-brand-blue font-semibold hover:underline"
              >
                {t("HelpPage", "contact.email.value")}
              </a>
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex items-start gap-6">
            <div className="bg-green-50 p-4 rounded-2xl text-green-600">
              <MessageSquare />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">
                {t("HelpPage", "contact.chat.title")}
              </h4>
              <p className="text-slate-500 text-sm mb-4">
                {t("HelpPage", "contact.chat.availability")}
              </p>
              <button className="text-green-600 font-semibold hover:underline">
                {t("HelpPage", "contact.chat.cta")}
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <details className="group bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-800">
        {question}
        <span className="transition-transform group-open:rotate-180 text-brand-blue">
          +
        </span>
      </summary>
      <div className="px-6 pb-6 text-slate-600 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}
