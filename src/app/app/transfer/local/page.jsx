'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Landmark, CheckCircle2, Search } from "lucide-react"
import Link from "next/link"

export default function LocalTransfer() {
  const [step, setStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  if (isSuccess) return <SuccessState />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app"><ArrowLeft size={24} /></Link>
        <h1 className="text-xl font-bold">Local Transfer</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Step Indicator */}
        <div className="flex gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-n-100'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-n-100'}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header>
                <h2 className="text-2xl font-black text-brand-dark">Recipient</h2>
                <p className="text-meta">Enter domestic bank details</p>
            </header>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-n-500">Bank Name</Label>
                <div className="relative">
                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-n-300" size={18} />
                    <Input className="h-14 pl-12 rounded-brand-input border-n-300" placeholder="e.g. Bank of America" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-n-500">Account Number</Label>
                <Input className="h-14 rounded-brand-input border-n-300" placeholder="0000 0000 00" />
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-n-500">Routing Number (ABA)</Label>
                <Input className="h-14 rounded-brand-input border-n-300" placeholder="9 Digits" />
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="btn-primary w-full h-14 text-lg">Next</Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header>
                <h2 className="text-2xl font-black text-brand-dark">Amount</h2>
                <p className="text-meta">Available: $5,010,876.00</p>
            </header>

            <div className="py-10 text-center border-b border-n-100">
                <p className="text-meta font-bold uppercase mb-2">You are sending</p>
                <div className="relative inline-block">
                    <span className="absolute -left-6 top-1 text-2xl font-bold text-primary">$</span>
                    <input autoFocus type="number" placeholder="0.00" className="balance-xl text-primary bg-transparent outline-none w-full max-w-[200px] text-center" />
                </div>
            </div>

            <div className="bg-secondary p-5 rounded-brand-card space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="text-n-500">Transaction Fee</span>
                    <span className="font-bold text-bank-success">FREE</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-n-500">Processing Time</span>
                    <span className="font-bold">Instant to 1 Day</span>
                </div>
            </div>

            <Button onClick={() => setIsSuccess(true)} className="btn-primary w-full h-14 text-lg">Confirm & Send</Button>
            <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-n-500">Back to details</button>
          </div>
        )}
      </div>
    </div>
  )
}

function SuccessState() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-black text-brand-dark">Transfer Initiated</h2>
        <p className="text-n-500 max-w-[250px] mx-auto">Your local transfer has been queued and will be processed shortly.</p>
        <Link href="/app" className="w-full max-w-xs">
          <Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Return Home</Button>
        </Link>
      </div>
    )
}