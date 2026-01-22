'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CardDeposit() {
  const [step, setStep] = useState(1) // 1: Details, 2: Success
  const [amount, setAmount] = useState("")

  if (step === 2) return <SuccessState amount={amount} />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app"><ArrowLeft size={24} /></Link>
          <h1 className="text-xl font-bold">Card Deposit</h1>
        </div>
        <Lock size={20} className="opacity-60" />
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <header>
            <h2 className="text-xl font-black text-brand-dark">Add Funds</h2>
            <p className="text-meta">Deposit USD instantly via Debit/Credit Card</p>
          </header>

          <div className="space-y-4">
            {/* Amount Section */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">$</span>
                <Input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 pl-8 bg-white balance-md text-primary" 
                  placeholder="0.00" 
                />
              </div>
            </div>

            {/* Destination Selector */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Deposit Into</Label>
              <select className="h-14 w-full bg-white border border-input rounded-md px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary">
                <option>USD Savings (*** 6708)</option>
                <option>USD Checking (*** 1234)</option>
              </select>
            </div>

            {/* Card Information */}
            <div className="p-5 bg-secondary rounded-brand-card space-y-4 border border-border">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold uppercase text-n-500">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-n-300" size={18} />
                    <Input className="h-12 pl-10 bg-white" placeholder="0000 0000 0000 0000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase text-n-500">Expiry</Label>
                    <Input className="h-12 bg-white" placeholder="MM/YY" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase text-n-500">CVV</Label>
                    <Input className="h-12 bg-white" placeholder="123" />
                  </div>
                </div>
            </div>
          </div>

          {/* Fee Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
                <span className="text-n-500 uppercase">Processing Fee (2.5%)</span>
                <span className="font-bold text-brand-dark">${(parseFloat(amount || "0") * 0.025).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-medium pt-2 border-t border-n-100">
                <span className="text-n-900 font-bold uppercase">Total to Charge</span>
                <span className="font-bold text-primary">${(parseFloat(amount || "0") * 1.025).toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={() => setStep(2)} className="btn-primary w-full h-14 text-lg shadow-lg shadow-primary/20">
            Authorize Deposit
          </Button>
          
          <p className="text-[10px] text-center text-n-500 font-medium">
            Your payment is processed securely via 256-bit encryption.
          </p>
        </div>
      </div>
    </div>
  )
}

function SuccessState({ amount }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in-95">
      <div className="w-20 h-20 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
        <CheckCircle2 size={48} strokeWidth={3} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">Deposit Received</h2>
        <p className="text-n-500 mt-2 max-w-[250px] mx-auto text-sm font-medium">
          Successfully added <span className="text-brand-dark font-bold">${amount}</span> to your USD Savings account.
        </p>
      </div>
      <Link href="/app" className="w-full max-w-xs">
        <Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Back to Wallet</Button>
      </Link>
    </div>
  )
}