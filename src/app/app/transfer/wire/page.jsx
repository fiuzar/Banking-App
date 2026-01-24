'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Landmark, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function WireTransferPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    sourceAccount: "savings",
    recipientName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    amount: "",
    pin: ""
  })

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Wire Transfer</h1>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-8 px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1 flex-1 mx-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-n-300'}`} />
          ))}
        </div>

        {step === 1 && <StepSource formData={formData} setFormData={setFormData} onNext={nextStep} />}
        {step === 2 && <StepRecipient formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <StepAmount formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />}
        {step === 4 && <StepAuth formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />}
        {step === 5 && <StepSuccess />}
      </div>
    </div>
  )
}

function StepSource({ formData, setFormData, onNext }) {
  const accounts = [
    { id: 'savings', label: 'USD Savings', balance: '$5,010,876.00' },
    { id: 'checking', label: 'USD Checking', balance: '$12,450.00' }
  ]

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold text-brand-dark">Select Source Account</h2>
      {accounts.map((acc) => (
        <Card 
          key={acc.id}
          onClick={() => { setFormData({...formData, sourceAccount: acc.id}); onNext(); }}
          className={`p-4 cursor-pointer border-2 transition-all ${formData.sourceAccount === acc.id ? 'border-primary bg-accent' : 'border-transparent'}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold opacity-60 uppercase">{acc.label}</p>
              <p className="balance-md text-primary">{acc.balance}</p>
            </div>
            <ChevronRight className="text-n-300" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function StepRecipient({ formData, setFormData, onNext, onBack }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold text-brand-dark">Recipient Information</h2>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label>Recipient Full Name</Label>
          <Input className="h-12" placeholder="John Wick" onChange={(e) => setFormData({...formData, recipientName: e.target.value})} />
        </div>
        <div className="grid gap-2">
          <Label>Bank Name</Label>
          <Input className="h-12" placeholder="JPMorgan Chase" onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Account Number</Label>
            <Input className="h-12" placeholder="000123456" onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
          </div>
          <div className="grid gap-2">
            <Label>Routing Number</Label>
            <Input className="h-12" placeholder="123456789" onChange={(e) => setFormData({...formData, routingNumber: e.target.value})} />
          </div>
        </div>
      </div>
      <Button onClick={onNext} className="btn-primary w-full h-14 text-lg mt-4">Continue</Button>
      <button onClick={onBack} className="w-full text-n-500 text-sm font-medium">Go Back</button>
    </div>
  )
}

function StepAmount({ formData, setFormData, onNext, onBack }) {
  return (
    <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold text-brand-dark">Enter Amount</h2>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-n-300">$</span>
        <input 
          type="number" 
          placeholder="0.00"
          className="w-full bg-transparent text-center balance-xl text-primary outline-none py-8 border-b-2 border-n-100 focus:border-primary transition-colors"
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
        />
      </div>
      <div className="bg-n-100 p-4 rounded-xl text-left">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-n-500 uppercase">Transfer Fee</span>
          <span className="font-bold">$25.00</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-n-500 uppercase">Estimated Arrival</span>
          <span className="font-bold">1-3 Business Days</span>
        </div>
      </div>
      <Button onClick={onNext} className="btn-primary w-full h-14 text-lg">Send Wire Now</Button>
      <button onClick={onBack} className="w-full text-n-500 text-sm font-medium">Go Back</button>
    </div>
  )
}

function StepAuth({ formData, setFormData, onNext, onBack }) {
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.pin || formData.pin.length < 4) {
      setError("Please enter your 4-digit PIN.")
      return
    }
    setError("")
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold text-brand-dark text-center">Authenticate Transaction</h2>
      {/* Mini transaction receipt */}
      <div className="bg-n-100 rounded-xl p-4 mb-2 text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-n-500">To</span>
          <span className="font-semibold">{formData.recipientName || <span className="text-n-300">Recipient</span>}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-n-500">Bank</span>
          <span>{formData.bankName || <span className="text-n-300">Bank Name</span>}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-n-500">Account #</span>
          <span>{formData.accountNumber || <span className="text-n-300">••••••••</span>}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-n-500">Routing #</span>
          <span>{formData.routingNumber || <span className="text-n-300">•••••••••</span>}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-n-500">Amount</span>
          <span className="font-bold text-primary">${formData.amount || "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-n-500">Fee</span>
          <span className="font-bold">$25.00</span>
        </div>
      </div>
      {/* PIN input */}
      <div className="grid gap-2">
        <Label htmlFor="pin">Enter your PIN</Label>
        <Input
          id="pin"
          type="password"
          inputMode="numeric"
          maxLength={6}
          minLength={4}
          autoComplete="off"
          className="h-12 text-center text-xl tracking-widest"
          placeholder="••••"
          value={formData.pin}
          onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
      <Button type="submit" className="btn-primary w-full h-14 text-lg mt-2">Confirm & Send</Button>
      <button type="button" onClick={onBack} className="w-full text-n-500 text-sm font-medium">Go Back</button>
    </form>
  )
}

function StepSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
        <CheckCircle2 size={64} strokeWidth={3} />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-black text-brand-dark">Wire Sent!</h2>
        <p className="text-n-500 mt-2">Your transfer is being processed by the banking network.</p>
      </div>
      <Link href="/app" className="w-full">
        <Button variant="outline" className="w-full h-12 border-primary text-primary hover:bg-accent font-bold">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}