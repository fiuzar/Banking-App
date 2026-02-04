'use client'

import { useState, useEffect, useContext } from "react"
import { AccountDetailsContext } from "@/server-functions/contexts" // Adjust this path if your context file is elsewhere
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle, Wallet } from "lucide-react"
import Link from "next/link"
import { getRecipientDetails, processLocalUSDTransfer } from "@/server-functions/transfer/local-transfer"

export default function LocalTransfer() {
  // Access global state from your context
  const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
  
  const [recipient, setRecipient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalState, setModalState] = useState(null)
  const [formData, setFormData] = useState({ accountNumber: '', amount: '' })

  // Logical Calculations
  const availableBalance = parseFloat(accountDetails?.checking_balance || 0)
  const amt = parseFloat(formData.amount) || 0
  const fee = amt > 0 ? Math.max(2.00, amt * 0.01) : 0
  const total = amt + fee
  const hasSufficientFunds = availableBalance >= total

  // Real-time account verification
  useEffect(() => {
    if (formData.accountNumber.length === 10) {
      setLoading(true)
      getRecipientDetails(formData.accountNumber).then(res => {
        if (res.success) setRecipient({ name: res.name, type: res.type })
        else setRecipient(null)
        setLoading(false)
      })
    } else {
      setRecipient(null)
    }
  }, [formData.accountNumber])

  const handleTransfer = async () => {
    setModalState('processing')
    const submission = new FormData()
    submission.append('amount', formData.amount)
    submission.append('accountNumber', formData.accountNumber)

    try {
      const result = await processLocalUSDTransfer(submission)
      if (result.success) {
        setAccountDetails(result.account_details)
        setModalState('success')
      } else {
        setModalState('error')
      }
    } catch (err) {
      setModalState('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header section */}
      <div className="bg-primary p-8 pt-12 text-white rounded-b-[40px] shadow-lg">
        <Link href="/app" className="inline-block p-2 bg-white/10 rounded-full mb-4">
          <ArrowLeft size={20}/>
        </Link>
        <h1 className="text-2xl font-black tracking-tight">PaySense Network</h1>
        <p className="text-white/60 text-xs">Instantly send funds to any PaySense user</p>
      </div>

      <div className="max-w-md mx-auto p-6 -mt-6 space-y-4">
        {/* Real-time Balance Display */}
        <Card className="p-4 rounded-2xl border-none shadow-sm bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wallet className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Available Checking</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        {/* Main Transfer Form */}
        <Card className="p-6 rounded-[32px] border-none shadow-xl space-y-6 bg-white">
          <div className="space-y-4">
            {/* Recipient Account Input */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Recipient Account #</Label>
              <Input 
                maxLength={10}
                className="h-14 rounded-2xl bg-slate-50 border-none text-lg font-bold focus-visible:ring-primary" 
                placeholder="10-digit account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
              />
              {recipient && (
                <div className="mt-2 p-3 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                  <div>
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-tighter">Verified Recipient</p>
                    <p className="text-sm font-black text-slate-900">{recipient.name}</p>
                  </div>
                  <div className="bg-green-600 text-white text-[9px] px-2 py-1 rounded-full font-bold uppercase">
                    {recipient.type}
                  </div>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Amount ($)</Label>
              <Input 
                type="number"
                className={`h-14 rounded-2xl bg-slate-50 border-none text-2xl font-black focus-visible:ring-primary ${!hasSufficientFunds && amt > 0 ? 'text-red-500' : 'text-slate-900'}`} 
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
              {!hasSufficientFunds && amt > 0 && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> Insufficient funds in Checking
                </p>
              )}
            </div>

            {/* Fee Calculation Summary */}
            {amt > 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in duration-300">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Network Fee (1% / Min $2)</span>
                  <span>${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Deduction</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <Button 
            disabled={!recipient || amt <= 0 || loading || !hasSufficientFunds}
            onClick={handleTransfer}
            className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirm Transfer"}
          </Button>
        </Card>
      </div>

      {/* Conditional Status Overlays */}
      {modalState && <StatusModal state={modalState} onClose={() => setModalState(null)} />}
    </div>
  )
}

function StatusModal({ state, onClose }) {
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
              <p className="text-slate-500 text-sm">Validating with the PaySense network.</p>
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
              <p className="text-slate-500 text-sm leading-relaxed">The funds have been moved to the recipient's account.</p>
            </div>
            <Link href="/app" className="block w-full">
              <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-colors">
                Return to Dashboard
              </Button>
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
              <p className="text-red-500 text-sm font-medium">Transaction declined by the network. Please try again.</p>
            </div>
            <Button onClick={onClose} className="w-full h-14 bg-primary text-white rounded-2xl font-bold">
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  )
}