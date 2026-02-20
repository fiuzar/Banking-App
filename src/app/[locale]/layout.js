// src/app/[locale]/layout.jsx
import { LanguageProvider } from "@/messages/LanguageProvider";
import { languages } from "@/lib/translations";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const messages = languages[locale] || languages.en;

  return {
    title: messages.RootLayout?.title || "Paysense",
    description: messages.RootLayout?.description || "Your No. 1 Banking and Financial App",
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} className="h-full">
      <body className="h-full">
        {/* ✅ Pass locale from URL */}
        <LanguageProvider initialLocale={locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
