'use client'

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import Hero from "@/components/layout/hero";
import ValuePillars from "@/components/layout/value-pillars";
import HowItWorks from "@/components/layout/how-it-works";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/messages/LanguageProvider";

import Image from "next/image";

export default function HomePage() {
  const { t, locale } = useLanguage();

  // ✅ Safely access list array
  const featuresList =
    t("HomePage", "features_showcase.list") &&
    Array.isArray(
      t("HomePage", "features_showcase.list")
    )
      ? t("HomePage", "features_showcase.list")
      : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="grow">
        <div className="flex flex-col w-full">

          <Hero />
          <ValuePillars />

          {/* Features Showcase */}
          <section className="bg-white px-screen-p">
            <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-20 items-center">

              <Image
                className="order-2 md:order-1 bg-n-100 rounded-brand-card aspect-square"
                src="/img/home.png"
                width={400}
                height={400}
                alt=""
              />

              <div className="order-1 md:order-2">

                {/* Headline */}
                <h2 className="text-3xl font-bold mb-6">
                  {t("HomePage", "features_showcase.headline")}
                </h2>

                {/* Feature List */}
                <ul className="space-y-4 text-n-700">
                  {featuresList.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      ✅ {item}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button className="mt-10 btn-primary">
                  {t("HomePage", "features_showcase.cta")}
                </Button>

              </div>
            </div>
          </section>

          <HowItWorks />

          {/* Final CTA */}
          <section className="py-20 bg-brand-blue text-white text-center">
            <div className="mx-auto max-w-3xl px-screen-p">

              <h2 className="text-4xl font-bold mb-6">
                {t("HomePage", "finalCTA.headline")}
              </h2>

              <p className="text-white/80 mb-10 text-lg font-medium">
                {t("HomePage", "finalCTA.subtext")}
              </p>

              <Button className="h-14 px-12 bg-white text-brand-blue hover:bg-n-100 font-bold text-lg rounded-brand-button">
                {t("HomePage", "finalCTA.cta")}
              </Button>

            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
