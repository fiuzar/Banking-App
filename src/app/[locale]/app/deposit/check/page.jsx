'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Camera, CheckCircle2, Info, Image as ImageIcon, Loader2, X } from "lucide-react"
import Link from "next/link"
import { submitCheckDeposit } from "@/server-functions/deposits"
import { useLanguage } from "@/messages/LanguageProvider"

export default function CheckDeposit() {
    const { t } = useLanguage()

    const [step, setStep] = useState(1) // 1: Details, 2: Success
    const [amount, setAmount] = useState("")
    const [account, setAccount] = useState("USD Checking (*** 1234)")

    const [frontFile, setFrontFile] = useState(null)
    const [backFile, setBackFile] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const frontInputRef = useRef(null)
    const backInputRef = useRef(null)

    const handleFileChange = (e, side) => {
        const file = e.target.files[0]
        if (file) {
            if (side === 'front') setFrontFile(file)
            else setBackFile(file)
            setError("")
        }
    }

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError(t("CheckDeposit", "status.errorInvalidAmount"))
            return
        }

        setIsSubmitting(true)
        setError("")

        const formData = new FormData()
        formData.append('amount', amount)
        formData.append('accountType', account)
        formData.append('frontImage', frontFile)
        formData.append('backImage', backFile)

        try {
            const res = await submitCheckDeposit(formData)
            if (res.success) setStep(2)
            else setError(res.error || t("CheckDeposit", "status.errorConnection"))
        } catch (err) {
            setError(t("CheckDeposit", "status.errorConnection"))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (step === 2) return <SuccessState />

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-green-900 p-6 text-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <Link href="/app"><ArrowLeft size={24} /></Link>
                    <h1 className="text-xl font-bold">{t("CheckDeposit", "header.title")}</h1>
                </div>
                <Info size={20} className="opacity-60" />
            </div>

            <div className="max-w-md mx-auto p-6 space-y-8">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <header>
                        <h2 className="text-xl font-black text-slate-900">{t("CheckDeposit", "header.title")}</h2>
                        <p className="text-xs font-bold text-green-700 uppercase tracking-wider">
                            {t("CheckDeposit", "header.processingTime")}
                        </p>
                    </header>

                    {/* Amount & Destination */}
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {t("CheckDeposit", "form.amountLabel")}
                            </Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-green-900">$</span>
                                <Input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder={t("CheckDeposit", "form.placeholder")}
                                    className="h-14 pl-8 bg-white border-slate-200 rounded-2xl text-lg font-bold text-green-900 focus:ring-green-900"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {t("CheckDeposit", "form.destinationLabel")}
                            </Label>
                            <select 
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                className="h-14 w-full bg-white border border-slate-200 rounded-2xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-green-900 appearance-none"
                            >
                                <option>USD Checking (*** 1234)</option>
                                <option>USD Savings (*** 6708)</option>
                            </select>
                        </div>
                    </div>

                    {/* Hidden File Inputs */}
                    <input type="file" accept="image/*" capture="environment" ref={frontInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'front')} />
                    <input type="file" accept="image/*" capture="environment" ref={backInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'back')} />

                    {/* Capture Area */}
                    <div className="grid grid-cols-1 gap-4">
                        <CaptureSlot 
                            label={t("CheckDeposit", "capture.front")} 
                            file={frontFile} 
                            onClick={() => frontInputRef.current.click()} 
                            onClear={() => setFrontFile(null)}
                        />
                        <CaptureSlot 
                            label={t("CheckDeposit", "capture.back")} 
                            subtext={t("CheckDeposit", "capture.endorsementHint")}
                            file={backFile} 
                            onClick={() => backInputRef.current.click()} 
                            onClear={() => setBackFile(null)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 border border-blue-100">
                        <Info className="text-blue-500 shrink-0" size={18} />
                        <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                            {t("CheckDeposit", "capture.instructions")}
                        </p>
                    </div>

                    <Button 
                        onClick={handleSubmit} 
                        disabled={!frontFile || !backFile || isSubmitting}
                        className="w-full h-14 text-lg bg-green-900 hover:bg-green-800 text-white rounded-2xl font-bold shadow-xl disabled:opacity-50 transition-all"
                    >
                        {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("CheckDeposit", "status.submitting")}</> : t("CheckDeposit", "status.submit")}
                    </Button>
                </div>
            </div>
        </div>
    )
}

function CaptureSlot({ label, file, onClick, onClear, subtext }) {
    return (
        <div className="relative group">
            <div 
                onClick={file ? null : onClick}
                className={`relative h-36 w-full border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center transition-all overflow-hidden ${file ? 'border-green-800 bg-green-50' : 'border-slate-200 bg-white hover:border-green-800 cursor-pointer'}`}
            >
                {file ? (
                    <>
                        <img 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            className="absolute inset-0 w-full h-full object-cover opacity-40" 
                        />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-green-800 text-white p-2 rounded-full mb-1">
                                <ImageIcon size={20} />
                            </div>
                            <span className="text-[10px] font-black text-green-900 uppercase tracking-tighter">
                                {t("CheckDeposit", "capture.statusReady")}
                            </span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="absolute top-3 right-3 z-20 bg-white/80 p-1.5 rounded-full text-slate-600 hover:bg-white"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="bg-slate-50 p-3 rounded-full mb-2 text-slate-300 group-hover:text-green-800 group-hover:bg-green-50 transition-colors">
                            <Camera size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{label}</span>
                        {subtext && <span className="text-[9px] text-slate-400 mt-1 font-medium">{subtext}</span>}
                    </>
                )}
            </div>
        </div>
    )
}

function SuccessState() {
    const { t } = useLanguage()
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-white animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-800 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 size={56} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("CheckDeposit", "success.title")}</h2>
                <p className="text-slate-500 max-w-[280px] mx-auto text-sm font-medium leading-relaxed">{t("CheckDeposit", "success.description")}</p>
            </div>
            <Link href="/app" className="w-full max-w-xs pt-4">
                <Button className="w-full h-14 bg-green-900 text-white rounded-2xl font-bold shadow-lg">{t("CheckDeposit", "success.action")}</Button>
            </Link>
        </div>
    )
}
