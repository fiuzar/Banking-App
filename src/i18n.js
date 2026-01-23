import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          wire: "Wire Transfer",
          local: "Local Transfer",
          internal: "Internal Transfer",
          crypto: "Buy Crypto",
          bills: "Pay Bills",
          add: "Add Beneficiary",
          // ...add all your translations
        }
      },
      fr: {
        translation: {
          wire: "Virement Bancaire",
          local: "Transfert Local",
          internal: "Transfert Interne",
          crypto: "Acheter Crypto",
          bills: "Factures",
          add: "Ajouter Bénéficiaire",
          // ...add all your translations
        }
      },
      // Add more languages as needed
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
