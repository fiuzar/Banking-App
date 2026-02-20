"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus, Globe, Landmark } from "lucide-react"
import Link from "next/link"
import { addBeneficiaryAction } from "@/server-functions/beneficiaries"
import { useLanguage } from "@/messages/LanguageProvider"

function ErrorModal({ open, message, onClose }) {
  const { t } = useLanguage()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-lg text-center">
        <div className="mb-4 text-red-600 font-bold text-lg">
          {t("AddBeneficiary", "error.title")}
        </div>

        <div className="mb-6 text-n-700">{message}</div>

        <Button onClick={onClose} className="w-full">
          {t("AddBeneficiary", "error.close")}
        </Button>
      </div>
    </div>
  )
}

export default function AddBeneficiary() {
  const { t } = useLanguage()

  const [type, setType] = useState("local")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    fullName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    swiftCode: "",
    nickname: ""
  })

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.accountNumber) {
      setError(t("AddBeneficiary", "error.requiredFields"))
      return
    }

    setLoading(true)

    const res = await addBeneficiaryAction({ ...formData, type })

    setLoading(false)

    if (res.success) {
      setIsSuccess(true)
    } else {
      setError(res.error)
    }
  }

  if (isSuccess) return <SuccessState />

  return (
    <div className="min-h-screen bg-background">
      <ErrorModal
        open={!!error}
        message={error}
        onClose={() => setError(null)}
      />

      {/* HEADER */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app">
          <ArrowLeft size={24} />
        </Link>

        <h1 className="text-xl font-bold">
          {t("AddBeneficiary", "header.title")}
        </h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* SWITCHER */}
        <div className="flex p-1 bg-secondary rounded-xl border border-border">
          <button
            onClick={() => setType("local")}
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
              type === "local"
                ? "bg-white text-primary shadow-sm"
                : "text-n-500"
            }`}
          >
            <Landmark size={16} />
            {t("AddBeneficiary", "switcher.local")}
          </button>

          <button
            onClick={() => setType("international")}
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
              type === "international"
                ? "bg-white text-primary shadow-sm"
                : "text-n-500"
            }`}
          >
            <Globe size={16} />
            {t("AddBeneficiary", "switcher.international")}
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* FULL NAME */}
          <div className="grid gap-2">
            <Label className="text-[10px] font-bold uppercase text-n-500">
              {t("AddBeneficiary", "form.fullName.label")}
            </Label>
            <Input
              value={formData.fullName}
              onChange={e =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder={t(
                "AddBeneficiary",
                "form.fullName.placeholder"
              )}
            />
          </div>

          {/* BANK NAME */}
          <div className="grid gap-2">
            <Label className="text-[10px] font-bold uppercase text-n-500">
              {t("AddBeneficiary", "form.bankName.label")}
            </Label>
            <Input
              value={formData.bankName}
              onChange={e =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              placeholder={t(
                "AddBeneficiary",
                "form.bankName.placeholder"
              )}
            />
          </div>

          {/* ACCOUNT NUMBER */}
          <div className="grid gap-2">
            <Label className="text-[10px] font-bold uppercase text-n-500">
              {t("AddBeneficiary", "form.accountNumber.label")}
            </Label>
            <Input
              value={formData.accountNumber}
              onChange={e =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              placeholder={t(
                "AddBeneficiary",
                "form.accountNumber.placeholder"
              )}
            />
          </div>

          {/* ROUTING OR SWIFT */}
          {type === "local" ? (
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase text-n-500">
                {t("AddBeneficiary", "form.routingNumber.label")}
              </Label>
              <Input
                value={formData.routingNumber}
                onChange={e =>
                  setFormData({ ...formData, routingNumber: e.target.value })
                }
                placeholder={t(
                  "AddBeneficiary",
                  "form.routingNumber.placeholder"
                )}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase text-n-500">
                {t("AddBeneficiary", "form.swiftCode.label")}
              </Label>
              <Input
                value={formData.swiftCode}
                onChange={e =>
                  setFormData({ ...formData, swiftCode: e.target.value })
                }
                placeholder={t(
                  "AddBeneficiary",
                  "form.swiftCode.placeholder"
                )}
              />
            </div>
          )}

          {/* NICKNAME */}
          <div className="grid gap-2">
            <Label className="text-[10px] font-bold uppercase text-n-500">
              {t("AddBeneficiary", "form.nickname.label")}
            </Label>
            <Input
              value={formData.nickname}
              onChange={e =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              placeholder={t(
                "AddBeneficiary",
                "form.nickname.placeholder"
              )}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full h-14 text-lg"
        >
          {loading
            ? t("AddBeneficiary", "form.submit.loading")
            : t("AddBeneficiary", "form.submit.idle")}
        </Button>
      </div>
    </div>
  )
}

function SuccessState() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
        <UserPlus size={40} />
      </div>

      <h2 className="text-2xl font-black text-brand-dark">
        {t("AddBeneficiary", "success.title")}
      </h2>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/app/transfer/wire">
          <Button className="btn-primary w-full h-12">
            {t("AddBeneficiary", "success.actionPrimary")}
          </Button>
        </Link>

        <Link href="/app">
          <Button variant="ghost" className="w-full">
            {t("AddBeneficiary", "success.actionSecondary")}
          </Button>
        </Link>
      </div>
    </div>
  )
}
