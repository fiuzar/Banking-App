'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Landmark, CheckCircle2, Loader2, AlertCircle, ChevronRight, Edit3 } from "lucide-react"
import Link from "next/link"
import { processLocalUSDTransfer } from "@/server-functions/transfer/local-transfer"

export default function LocalTransfer() {
  const [step, setStep] = useState(1) // 1: Recipient, 2: Amount, 3: Review
  const [modalState, setModalState] = useState(null) // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("")
  
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    amount: ''
  })

  const handleTransfer = async () => {
    setModalState('processing')
    
    const submissionData = new FormData()
    submissionData.append('amount', formData.amount)
    submissionData.append('routingNumber', formData.routingNumber)
    submissionData.append('accountNumber', formData.accountNumber)
    submissionData.append('bankName', formData.bankName)
    submissionData.append('accountHolderName', "User Account")

    try {
      const result = await processLocalUSDTransfer(submissionData)

      if (result.success) {
        setModalState('success')
      } else {
        setErrorMessage(result.error || "Transaction declined by network.")
        setModalState('error')
      }
    } catch (err) {
      setErrorMessage("Connection lost. Please check your internet.")
      setModalState('error')
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app"><ArrowLeft size={24} /></Link>
        <h1 className="text-xl font-bold">Local Transfer</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6 pb-24">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-slate-100'}`} />
          ))}
        </div>

        {/* STEP 1: RECIPIENT */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header>
              <h2 className="text-2xl font-black text-brand-dark">Recipient</h2>
              <p className="text-slate-500 text-xs">Enter domestic bank details</p>
            </header>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Bank Name</Label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="h-14 pl-12 rounded-2xl border-slate-200" 
                    placeholder="e.g. Bank of America" 
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Account Number</Label>
                <Input 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="h-14 rounded-2xl border-slate-200" 
                  placeholder="0000 0000 00" 
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Routing Number (ABA)</Label>
                <Input 
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
                  className="h-14 rounded-2xl border-slate-200" 
                  placeholder="9 Digits" 
                />
              </div>
            </div>

            <Button 
              disabled={!formData.accountNumber || !formData.routingNumber}
              onClick={() => setStep(2)} 
              className="bg-primary hover:bg-primary/90 w-full h-14 text-lg font-bold rounded-2xl"
            >
              Next
            </Button>
          </div>
        )}

        {/* STEP 2: AMOUNT */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header>
              <h2 className="text-2xl font-black text-brand-dark">Amount</h2>
              <p className="text-slate-500 text-xs">Funds move via ACH network</p>
            </header>

            <div className="py-10 text-center border-b border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">You are sending</p>
              <div className="relative inline-block">
                <span className="absolute -left-6 top-1 text-2xl font-bold text-primary">$</span>
                <input 
                  autoFocus 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00" 
                  className="text-4xl font-black text-primary bg-transparent outline-none w-full max-w-[200px] text-center" 
                />
              </div>
            </div>

            <Button 
              disabled={!formData.amount || parseFloat(formData.amount) <= 0}
              onClick={() => setStep(3)} 
              className="bg-primary hover:bg-primary/90 w-full h-16 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
            >
              Review Transfer
            </Button>
            <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-slate-400">Back to details</button>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header>
              <h2 className="text-2xl font-black text-brand-dark">Review</h2>
              <p className="text-slate-500 text-xs">Confirm details before sending</p>
            </header>

            <Card className="p-6 rounded-[24px] border-slate-100 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Recipient Bank</p>
                  <p className="font-bold text-slate-900">{formData.bankName || 'Not Specified'}</p>
                </div>
                <button onClick={() => setStep(1)}><Edit3 size={16} className="text-primary" /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Account #</p>
                  <p className="font-mono text-sm">{formData.accountNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Routing #</p>
                  <p className="font-mono text-sm">{formData.routingNumber}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <p className="text-sm font-bold text-slate-900">Total to Send</p>
                <p className="text-xl font-black text-primary">${formData.amount}</p>
              </div>
            </Card>

            <div className="bg-blue-50/50 p-4 rounded-2xl">
              <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                Note: Local transfers are processed via ACH and typically take 1-3 business days to reflect in the recipient's account.
              </p>
            </div>

            <Button 
              onClick={handleTransfer} 
              className="bg-primary hover:bg-primary/90 w-full h-16 text-lg font-bold rounded-2xl shadow-lg"
            >
              Confirm & Send Now
            </Button>
            <button onClick={() => setStep(2)} className="w-full text-sm font-bold text-slate-400">Change Amount</button>
          </div>
        )}
      </div>

      {/* STATUS MODAL OVERLAY */}
      {modalState && (
        <StatusModal 
          state={modalState} 
          error={errorMessage} 
          onClose={() => setModalState(null)} 
        />
      )}
    </div>
  )
}

function StatusModal({ state, error, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
        
        {state === 'processing' && (
          <>
            <div className="flex justify-center">
              <Loader2 size={64} className="text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Processing...</h3>
              <p className="text-slate-500 text-sm">Validating with the ACH network.</p>
            </div>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="flex justify-center">
              <div className="bg-green-50 p-4 rounded-full">
                <CheckCircle2 size={64} className="text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Transfer Sent!</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Your transfer has been initiated successfully. It will appear in your history shortly.</p>
            </div>
            <Link href="/app" className="block w-full">
              <Button className="w-full h-14 bg-slate-900 rounded-2xl font-bold">Return to Dashboard</Button>
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="flex justify-center">
              <div className="bg-red-50 p-4 rounded-full">
                <AlertCircle size={64} className="text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Transfer Failed</h3>
              <p className="text-red-500 text-sm font-medium leading-relaxed">{error}</p>
            </div>
            <div className="space-y-3 pt-4">
              <Button onClick={onClose} className="w-full h-14 bg-primary rounded-2xl font-bold">Try Again</Button>
              <button onClick={onClose} className="text-sm font-bold text-slate-400">Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}