'use client'

import { useEffect, useState } from "react"
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react"
import { createStripeAccountLink } from "@/server-functions/stripe-actions"
import Link from "next/link"
import { useLanguage } from "@/messages/LanguageProvider"

export default function StripeSetupBridge() {
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getLink() {
      const result = await createStripeAccountLink()
      if (result.url) {
        window.location.href = result.url // Redirect to Stripe
      } else {
        setError(result.error || t("StripeSetup", "bridge.error.default"))
      }
    }
    getLink()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      {!error ? (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <h2 className="text-xl font-black">{t("StripeSetup", "bridge.loading.title")}</h2>
          <p className="text-slate-500 text-sm">{t("StripeSetup", "bridge.loading.description")}</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl">
            <p className="font-bold">{error}</p>
          </div>
          <Link href="/app/settings">
            <button className="flex items-center gap-2 text-primary font-bold">
              <ArrowLeft size={18} /> {t("StripeSetup", "bridge.error.goBack")}
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
