'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, User, CheckCircle2, Loader2, AlertCircle, Wallet } from "lucide-react"
import Link from "next/link"
import { getRecipientDetails, processLocalUSDTransfer } from "@/server-functions/transfer/local-transfer"

export default function LocalTransfer() {
  const [recipient, setRecipient] = useState<{name: string, type: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalState, setModalState] = useState<null | 'processing' | 'success' | 'error'>(null)
  const [formData, setFormData] = useState({ accountNumber: '', amount: '' })

  const amt = parseFloat(formData.amount) || 0
  const fee = amt > 0 ? Math.max(2.00, amt * 0.01) : 0
  const total = amt + fee

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

    const result = await processLocalUSDTransfer(submission)
    if (result.success) setModalState('success')
    else setModalState('error')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-primary p-8 pt-12 text-white rounded-b-[40px] shadow-lg">
        <Link href="/app" className="inline-block p-2 bg-white/10 rounded-full mb-4"><ArrowLeft size={20}/></Link>
        <h1 className="text-2xl font-black">PaySense Network</h1>
        <p className="text-white/60 text-xs">Send money to any PaySense account number</p>
      </div>

      <div className="max-w-md mx-auto p-6 -mt-6 space-y-4">
        <Card className="p-6 rounded-[32px] border-none shadow-xl space-y-6">
          <div className="space-y-4">
            {/* Account Input */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Recipient Account #</Label>
              <Input 
                maxLength={10}
                className="h-14 rounded-2xl bg-slate-50 border-none text-lg font-bold" 
                placeholder="10-digit Savings or Checking #"
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
                className="h-14 rounded-2xl bg-slate-50 border-none text-2xl font-black" 
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            {/* Fee Summary */}
            {amt > 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Network Fee (1% / Min $2)</span>
                  <span>${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t pt-2">
                  <span>Total Deduction</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <Button 
            disabled={!recipient || amt <= 0 || loading}
            onClick={handleTransfer}
            className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirm Transfer"}
          </Button>
        </Card>
      </div>

      {modalState && <StatusModal state={modalState} onClose={() => setModalState(null)} />}
    </div>
  )
}