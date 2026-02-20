"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, Database, Eye, Share2, Lock } from "lucide-react";
import { useLanguage } from "@/messages/LanguageProvider";

export default function PrivacyPage() {
  const { t } = useLanguage()

  const policySections = [
    {
      id: "collect",
      title: t("PrivacyPage", "sections.collect.title"),
      icon: <Database className="w-5 h-5 text-brand-blue" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-n-900 text-sm mb-2">
              {t("PrivacyPage", "sections.collect.personal.label")}
            </h4>
            <p className="text-n-500 text-sm">
              {t("PrivacyPage", "sections.collect.personal.desc")}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-n-900 text-sm mb-2">
              {t("PrivacyPage", "sections.collect.financial.label")}
            </h4>
            <p className="text-n-500 text-sm">
              {t("PrivacyPage", "sections.collect.financial.desc")}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-n-900 text-sm mb-2">
              {t("PrivacyPage", "sections.collect.technical.label")}
            </h4>
            <p className="text-n-500 text-sm">
              {t("PrivacyPage", "sections.collect.technical.desc")}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "use",
      title: t("PrivacyPage", "sections.use.title"),
      icon: <Eye className="w-5 h-5 text-brand-blue" />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-n-500 text-sm">
          {(t("PrivacyPage", "sections.use.list") || []).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      ),
    },
    {
      id: "sharing",
      title: t("PrivacyPage", "sections.sharing.title"),
      icon: <Share2 className="w-5 h-5 text-brand-blue" />,
      content: (
        <p className="text-n-500 text-sm leading-relaxed">
          {t("PrivacyPage", "sections.sharing.p1")}{" "}
          <span className="font-bold text-brand-dark">
            {t("PrivacyPage", "sections.sharing.highlight")}
          </span>
        </p>
      ),
    },
    {
      id: "security",
      title: t("PrivacyPage", "sections.security.title"),
      icon: <Lock className="w-5 h-5 text-brand-blue" />,
      content: (
        <div className="bg-n-100 p-4 rounded-brand-card">
          <p className="text-n-700 text-sm font-medium">
            {t("PrivacyPage", "sections.security.p1")}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-n-100/50 border-b border-n-100 py-20">
        <div className="mx-auto max-w-3xl px-screen-p text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4" />
            {t("PrivacyPage", "badge")}
          </div>

          <h1 className="text-4xl font-extrabold text-brand-dark mb-4">
            {t("PrivacyPage", "title")}
          </h1>

          <p className="text-n-500 max-w-lg mx-auto">
            {t("PrivacyPage", "subtitle")}
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="mx-auto max-w-3xl px-screen-p py-16">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {policySections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border border-n-100 rounded-brand-card px-6 overflow-hidden data-[state=open]:border-brand-blue/20 transition-all"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  {section.icon}
                  <span className="text-lg font-bold text-brand-dark">
                    {section.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-8 pt-2">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Footer */}
        <div className="mt-16 p-8 bg-brand-dark rounded-brand-card text-white">
          <h3 className="text-xl font-bold mb-4">
            {t("PrivacyPage", "rights.title")}
          </h3>
          <p className="text-n-300 text-sm leading-relaxed mb-6">
            {t("PrivacyPage", "rights.description")}
          </p>
          <a
            href="mailto:privacy@paysense.com"
            className="inline-block btn-primary bg-white! text-brand-dark! px-6 py-2 h-auto text-sm"
          >
            {t("PrivacyPage", "rights.cta")}
          </a>
        </div>
      </div>
    </div>
  );
}
