'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Camera, CheckCircle2, Info, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function CheckDeposit() {
  const [step, setStep] = useState(1) // 1: Details & Photos, 2: Success
  const [frontImage, setFrontImage] = useState(false)
  const [backImage, setBackImage] = useState(false)

  if (step === 2) return <SuccessState />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app"><ArrowLeft size={24} /></Link>
          <h1 className="text-xl font-bold">Check Deposit</h1>
        </div>
        <Info size={20} className="opacity-60" />
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <header>
            <h2 className="text-xl font-black text-brand-dark">Deposit a Check</h2>
            <p className="text-meta">Standard processing: 1-3 Business Days</p>
          </header>

          {/* Amount & Destination */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Check Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">$</span>
                <Input type="number" className="h-14 pl-8 bg-white balance-md text-primary" placeholder="0.00" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Deposit Into</Label>
              <select className="h-14 w-full bg-white border border-input rounded-md px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary">
                <option>USD Checking (*** 1234)</option>
                <option>USD Savings (*** 6708)</option>
              </select>
            </div>
          </div>

          {/* Capture Area */}
          <div className="grid grid-cols-1 gap-4">
             <CaptureSlot 
                label="Front of Check" 
                active={frontImage} 
                onClick={() => setFrontImage(true)} 
             />
             <CaptureSlot 
                label="Back of Check" 
                active={backImage} 
                subtext="Must be endorsed with 'For Mobile Deposit Only'"
                onClick={() => setBackImage(true)} 
             />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 border border-blue-100">
             <Info className="text-blue-500 shrink-0" size={18} />
             <p className="text-[11px] text-blue-800 leading-relaxed">
               Ensure the check is placed on a dark, flat surface with good lighting. All four corners must be visible.
             </p>
          </div>

          <Button 
            onClick={() => setStep(2)} 
            disabled={!frontImage || !backImage}
            className="btn-primary w-full h-14 text-lg shadow-lg shadow-primary/20"
          >
            Submit Deposit
          </Button>
        </div>
      </div>
    </div>
  )
}

function CaptureSlot({ label, active, onClick, subtext }) {
    return (
        <div 
            onClick={onClick}
            className={`relative h-32 w-full border-2 border-dashed rounded-brand-card flex flex-col items-center justify-center transition-all cursor-pointer ${active ? 'border-primary bg-primary/5' : 'border-n-300 bg-white hover:border-n-500'}`}
        >
            {active ? (
                <>
                    <ImageIcon className="text-primary mb-2" size={28} />
                    <span className="text-xs font-bold text-primary">Image Captured</span>
                </>
            ) : (
                <>
                    <Camera className="text-n-300 mb-2" size={28} />
                    <span className="text-xs font-bold text-n-500">{label}</span>
                    {subtext && <span className="text-[9px] text-n-400 mt-1">{subtext}</span>}
                </>
            )}
        </div>
    )
}

function SuccessState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
        <CheckCircle2 size={48} strokeWidth={3} />
      </div>
      <h2 className="text-2xl font-black text-brand-dark tracking-tight">Check Submitted</h2>
      <p className="text-n-500 max-w-[280px] mx-auto text-sm">
        We&apos;ve received your check images. Most deposits are cleared within 24-48 hours.
      </p>
      <Link href="/app" className="w-full max-w-xs pt-4">
        <Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Return Home</Button>
      </Link>
    </div>
  )
}