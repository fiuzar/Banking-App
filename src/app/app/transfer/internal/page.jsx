'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowUpDown, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function InternalTransfer() {
  const [isSavingsToChecking, setIsSavingsToChecking] = useState(true)
  const [amount, setAmount] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const accountData = {
    savings: { label: "USD Savings", balance: "$5,010,876.00" },
    checking: { label: "USD Checking", balance: "$12,450.00" }
  }

  const handleTransfer = () => {
    // Here you would call your Python backend via proxy.js
    setIsSuccess(true)
  }

  if (isSuccess) return <SuccessState />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app"><ArrowLeft size={24} /></Link>
        <h1 className="text-xl font-bold">Internal Transfer</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {/* The Swap UI */}
        <div className="relative space-y-2">
          <AccountBox 
            label="From" 
            name={isSavingsToChecking ? accountData.savings.label : accountData.checking.label} 
            balance={isSavingsToChecking ? accountData.savings.balance : accountData.checking.balance}
          />
          
          {/* Swap Button */}
          <button 
            onClick={() => setIsSavingsToChecking(!isSavingsToChecking)}
            className="absolute left-1/2 -translate-x-1/2 top-[42%] z-10 bg-primary text-white p-3 rounded-full border-4 border-background shadow-lg active:scale-90 transition-transform"
          >
            <ArrowUpDown size={20} />
          </button>

          <AccountBox 
            label="To" 
            name={isSavingsToChecking ? accountData.checking.label : accountData.savings.label} 
            balance={isSavingsToChecking ? accountData.checking.balance : accountData.savings.balance}
          />
        </div>

        {/* Amount Input */}
        <div className="text-center space-y-2">
          <label className="text-meta font-bold uppercase tracking-widest">Amount to Transfer</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-n-300">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-center balance-xl text-primary outline-none py-6 border-b-2 border-n-100 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="bg-secondary p-4 rounded-brand-card">
           <div className="flex justify-between text-xs font-medium">
              <span className="text-n-500 uppercase">Transfer Speed</span>
              <span className="text-bank-success font-bold">INSTANT</span>
           </div>
        </div>

        <Button 
          onClick={handleTransfer}
          disabled={!amount || parseFloat(amount) <= 0}
          className="btn-primary w-full h-14 text-lg shadow-xl shadow-primary/20"
        >
          Confirm Transfer
        </Button>
      </div>
    </div>
  )
}

function AccountBox({ label, name, balance }) {
  return (
    <div className="bg-card border border-border p-5 rounded-brand-card">
      <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex justify-between items-center">
        <p className="font-bold text-brand-dark">{name}</p>
        <p className="text-sm font-mono text-n-500">{balance}</p>
      </div>
    </div>
  )
}

function SuccessState() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-brand-dark">Transfer Complete</h2>
          <p className="text-n-500 mt-2">The funds have been moved between your accounts instantly.</p>
        </div>
        <Link href="/app" className="w-full max-w-xs">
          <Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Back to Dashboard</Button>
        </Link>
      </div>
    )
}