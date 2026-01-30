'use client'

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Landmark, CheckCircle2, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { initiateWireTransfer } from "@/server-functions/transfer/wire-transfer"
import {AccountDetailsContext} from "@/server-functions/contexts"

export default function WireTransferPage() {
  const {accountDetails} = useContext(AccountDetailsContext)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    sourceAccount: "savings",
    recipientName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    amount: "",
    pin: ""
  })

  const handleFinalSubmit = async () => {
    setLoading(true)
    setError("")
    
    const data = new FormData()
    Object.keys(formData).forEach(key => data.append(key, formData[key]))

    const result = await initiateWireTransfer(data)
    
    if (result.success) {
      setStep(5)
    } else {
      setError(result.error)
      setStep(4) // Keep them on auth step to see error
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app"><ArrowLeft size={24} /></Link>
        <h1 className="text-xl font-bold">Wire Transfer</h1>
      </div>

      <div className="max-w-md mx-auto p-6">
        <div className="flex justify-between mb-8 px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1 flex-1 mx-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-slate-200'}`} />
          ))}
        </div>

        {step === 1 && <StepSource formData={formData} setFormData={setFormData} onNext={() => setStep(2)} savings_balance={accountDetails.savings_balance} checking_balance={accountDetails.checking_balance} />}
        {step === 2 && <StepRecipient formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepAmount formData={formData} setFormData={setFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <StepAuth formData={formData} setFormData={setFormData} onBack={() => setStep(3)} onSubmit={handleFinalSubmit} loading={loading} error={error} />}
        {step === 5 && <StepSuccess />}
      </div>
    </div>
  )
}

function StepSource({ formData, setFormData, onNext, savings_balance, checking_balance }) {
  const accounts = [
    { id: 'savings', label: 'USD Savings', balance: savings_balance },
    { id: 'checking', label: 'USD Checking', balance: checking_balance }
  ]
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold">Select Source Account</h2>
      {accounts.map((acc) => (
        <Card key={acc.id} onClick={() => { setFormData({...formData, sourceAccount: acc.id}); onNext(); }}
          className={`p-5 cursor-pointer border-2 transition-all ${formData.sourceAccount === acc.id ? 'border-primary bg-blue-50/50' : 'border-transparent'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{acc.label}</p>
              <p className="text-2xl font-black text-primary">{acc.balance}</p>
            </div>
            <ChevronRight className="text-slate-300" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function StepRecipient({ formData, setFormData, onNext, onBack }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold">Recipient Information</h2>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label className="text-xs font-bold text-slate-500">Recipient Full Name</Label>
          <Input className="h-14 rounded-xl" placeholder="John Wick" value={formData.recipientName} onChange={(e) => setFormData({...formData, recipientName: e.target.value})} />
        </div>
        <div className="grid gap-2">
          <Label className="text-xs font-bold text-slate-500">Bank Name</Label>
          <Input className="h-14 rounded-xl" placeholder="JPMorgan Chase" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label className="text-xs font-bold text-slate-500">Account Number</Label>
            <Input className="h-14 rounded-xl" placeholder="000123456" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs font-bold text-slate-500">Routing Number</Label>
            <Input className="h-14 rounded-xl" placeholder="123456789" value={formData.routingNumber} onChange={(e) => setFormData({...formData, routingNumber: e.target.value})} />
          </div>
        </div>
      </div>
      <Button onClick={onNext} disabled={!formData.recipientName || !formData.accountNumber} className="w-full h-14 text-lg font-bold rounded-xl bg-primary">Continue</Button>
      <button onClick={onBack} className="w-full text-slate-400 text-sm font-medium">Go Back</button>
    </div>
  )
}

function StepAmount({ formData, setFormData, onNext, onBack }) {
  return (
    <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold">Enter Amount</h2>
      <div className="relative py-10">
        <span className="absolute left-1/2 -translate-x-20 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-300">$</span>
        <input autoFocus type="number" placeholder="0.00" className="w-full bg-transparent text-center text-5xl font-black text-primary outline-none" 
          value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left space-y-3">
        <div className="flex justify-between text-xs"><span className="text-slate-500">Transfer Fee</span><span className="font-bold text-slate-900">$25.00</span></div>
        <div className="flex justify-between text-xs"><span className="text-slate-500">Total Deduction</span><span className="font-bold text-primary">${(parseFloat(formData.amount || 0) + 25).toFixed(2)}</span></div>
      </div>
      <Button onClick={onNext} disabled={!formData.amount} className="w-full h-14 text-lg font-bold rounded-xl bg-primary">Review & Send</Button>
      <button onClick={onBack} className="w-full text-slate-400 text-sm font-medium">Go Back</button>
    </div>
  )
}

function StepAuth({ formData, setFormData, onSubmit, onBack, loading, error }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <h2 className="text-lg font-bold text-center">Final Confirmation</h2>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-sm space-y-2">
        <div className="flex justify-between"><span className="text-slate-500">Recipient</span><span className="font-bold">{formData.recipientName}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Bank</span><span>{formData.bankName}</span></div>
        <div className="flex justify-between border-t pt-2 mt-2"><span className="text-slate-500">Amount</span><span className="font-black text-primary">${formData.amount}</span></div>
      </div>
      <div className="space-y-2">
        <Label>Enter Transaction PIN</Label>
        <Input type="password" placeholder="••••" className="h-14 text-center text-2xl tracking-widest rounded-xl" maxLength={4}
          value={formData.pin} onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })} />
        {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}
      </div>
      <Button onClick={onSubmit} disabled={loading || formData.pin.length < 4} className="w-full h-14 text-lg font-bold rounded-xl bg-primary">
        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
        {loading ? "Authorizing..." : "Confirm & Send Wire"}
      </Button>
      {!loading && <button onClick={onBack} className="w-full text-slate-400 text-sm font-medium">Back to details</button>}
    </div>
  )
}

function StepSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in-95">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
        <CheckCircle2 size={64} strokeWidth={3} />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Wire Sent!</h2>
        <p className="text-slate-500 text-sm">Your transfer is now being processed by the FedWire network.</p>
      </div>
      <Link href="/app" className="w-full"><Button variant="outline" className="w-full h-14 border-2 font-bold rounded-xl">Back to Dashboard</Button></Link>
    </div>
  )
}