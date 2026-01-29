'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  FileText,
  UserCheck,
  X 
} from "lucide-react"
import Link from "next/link"
import { submitKYC } from "@/server-functions/authentication"

export default function KYCPage() {
  const [step, setStep] = useState(1)
  const [idType, setIdType] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setError("") 
    }
  }

  if (step === 3) return <SuccessState />

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-100">
        <Link href="/app/settings">
          <ArrowLeft size={24} className="text-brand-dark" />
        </Link>
        <h1 className="text-lg font-black text-brand-dark">Identity Verification</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <header>
              <h2 className="text-xl font-black text-brand-dark">Select ID Type</h2>
              <p className="text-sm text-slate-500">Choose the document for verification.</p>
            </header>
            <div className="grid gap-3">
              <IDOption icon={<FileText />} title="Passport" selected={idType === 'passport'} onClick={() => setIdType('passport')} />
              <IDOption icon={<CreditCard />} title="Driver's License" selected={idType === 'license'} onClick={() => setIdType('license')} />
              <IDOption icon={<UserCheck />} title="National ID" selected={idType === 'national'} onClick={() => setIdType('national')} />
            </div>
            {/* FIXED: was disabled={idType}, should be disabled={!idType} */}
            <Button disabled={!idType} onClick={() => setStep(2)} className="w-full h-14 rounded-2xl bg-green-900 text-white font-bold">
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header>
              <h2 className="text-xl font-black text-brand-dark">Upload Document</h2>
              <p className="text-sm text-slate-500">Take a clear photo of your {idType}.</p>
            </header>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/2] w-full border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center bg-slate-50 hover:border-green-800 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-green-800 mb-4">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-brand-dark">Tap to capture or upload</p>
              </div>
            ) : (
              <div className="relative aspect-[3/2] w-full rounded-[32px] overflow-hidden border-2 border-green-800">
                <img src={preview} alt="ID Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setPreview(null); setFile(null) }}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Your data is encrypted and used solely for identity verification required by financial regulations.
              </p>
            </div>

            <form action={async (formData) => {
              setError("");
              if (!file) {
                setError("Please upload a document first");
                return;
              }
              setIsSubmitting(true);
              formData.append('idType', idType);
              formData.append('document', file);
              
              try {
                const res = await submitKYC(formData);
                if (!res.success) {
                  throw new Error(res.error);
                }
                setStep(3);
              } catch (e) {
                setError(e.message || "Failed to submit documents. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                disabled={!file || isSubmitting} 
                className="w-full h-14 rounded-2xl bg-green-900 text-white font-bold shadow-lg"
              >
                {isSubmitting ? "Processing..." : "Submit for Review"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function IDOption({ icon, title, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${selected ? 'border-green-800 bg-green-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-green-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-brand-dark">{title}</span>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-green-800 bg-green-800' : 'border-slate-200'}`}>
        {selected && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
    </div>
  )
}

function SuccessState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
        <CheckCircle2 size={40} strokeWidth={2.5} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">Verification Pending</h2>
        <p className="text-slate-500 max-w-[280px] mx-auto text-sm font-medium">
          Your documents have been submitted. We usually review KYC applications within 2-4 hours.
        </p>
      </div>
      <Link href="/app/settings" className="w-full max-w-xs">
        <Button className="w-full h-12 bg-green-900 text-white rounded-xl">Back to Settings</Button>
      </Link>
    </div>
  )
}