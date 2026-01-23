'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  FileText,
  UserCheck
} from "lucide-react"
import Link from "next/link"
import { submitKYC } from "@/server-functions/authentication"

export default function KYCPage() {
  const [step, setStep] = useState(1) // 1: Select ID, 2: Upload, 3: Success
  const [idType, setIdType] = useState('')

  if (step === 3) return <SuccessState />

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-100">
        <Link href="/app/settings"><ArrowLeft size={24} className="text-brand-dark" /></Link>
        <h1 className="text-lg font-black text-brand-dark">Identity Verification</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <header>
              <h2 className="text-xl font-black text-brand-dark">Select ID Type</h2>
              <p className="text-sm text-n-500">Choose the document you wish to use for verification.</p>
            </header>

            <div className="grid gap-3">
              <IDOption 
                icon={<FileText />} 
                title="International Passport" 
                selected={idType === 'passport'} 
                onClick={() => setIdType('passport')} 
              />
              <IDOption 
                icon={<CreditCard />} 
                title="Driver's License" 
                selected={idType === 'license'} 
                onClick={() => setIdType('license')} 
              />
              <IDOption 
                icon={<UserCheck />} 
                title="National ID Card" 
                selected={idType === 'national'} 
                onClick={() => setIdType('national')} 
              />
            </div>

            <Button 
              disabled={!idType} 
              onClick={() => setStep(2)} 
              className="btn-primary w-full h-14 text-lg mt-4"
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header>
              <h2 className="text-xl font-black text-brand-dark">Upload Document</h2>
              <p className="text-sm text-n-500">Take a clear photo of your {idType} front page.</p>
            </header>

            <div className="aspect-[3/2] w-full border-2 border-dashed border-n-200 rounded-[32px] flex flex-col items-center justify-center bg-slate-50 group hover:border-primary transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-4">
                <Upload size={24} />
              </div>
              <p className="text-sm font-bold text-brand-dark">Tap to capture or upload</p>
              <p className="text-[10px] text-n-400 mt-1 uppercase font-bold tracking-widest">JPG, PNG or PDF (Max 5MB)</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Your data is encrypted and used solely for identity verification required by financial regulations.
              </p>
            </div>

            <form action={async (formData) => {
                formData.append('idType', idType);
                await submitKYC(formData);
                setStep(3);
            }}>
                <Button type="submit" className="btn-primary w-full h-14 text-lg">
                    Submit for Review
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
            className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-primary text-white' : 'bg-secondary text-n-400'}`}>
                    {icon}
                </div>
                <span className="text-sm font-bold text-brand-dark">{title}</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
        </div>
    )
}

function SuccessState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-bank-success/10 text-bank-success rounded-full flex items-center justify-center">
        <CheckCircle2 size={40} strokeWidth={2.5} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">Verification Pending</h2>
        <p className="text-n-500 max-w-[280px] mx-auto text-sm font-medium">
          Your documents have been submitted. We usually review KYC applications within 2-4 hours.
        </p>
      </div>
      <Link href="/app/settings" className="w-full max-w-xs">
        <Button className="btn-primary w-full h-12">Back to Settings</Button>
      </Link>
    </div>
  )
}