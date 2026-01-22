'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bitcoin, CheckCircle2, ChevronDown, Info } from "lucide-react"
import Link from "next/link"

export default function BuyCryptoPage() {
  const [amount, setAmount] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState({ name: "Bitcoin", symbol: "BTC", color: "bg-orange-500" })

  const handlePurchase = () => {
    // Logic to call your Python backend (main.py) via proxy.js
    setIsSuccess(true)
  }

  if (isSuccess) return <SuccessState asset={selectedAsset} amount={amount} />

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app"><ArrowLeft size={24} /></Link>
          <h1 className="text-xl font-bold">Buy Crypto</h1>
        </div>
        <div className="p-2 bg-white/10 rounded-full">
          <Info size={18} />
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {/* Asset Selector */}
        <div className="bg-card border border-border p-4 rounded-brand-card flex justify-between items-center cursor-pointer hover:bg-secondary transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${selectedAsset.color} rounded-full flex items-center justify-center text-white`}>
              {selectedAsset.symbol === "BTC" ? <Bitcoin size={20} /> : <span className="font-bold text-xs">ETH</span>}
            </div>
            <div>
              <p className="font-bold text-brand-dark">{selectedAsset.name}</p>
              <p className="text-[10px] text-n-500 font-bold uppercase tracking-widest">1 BTC ≈ $95,432.10</p>
            </div>
          </div>
          <ChevronDown className="text-n-300" />
        </div>

        {/* Input Section */}
        <div className="text-center space-y-4 py-6">
          <p className="text-meta font-bold uppercase tracking-[0.2em]">Enter USD Amount</p>
          <div className="relative">
            <span className="absolute left-1/2 -translate-x-[110px] top-1/2 -translate-y-1/2 text-3xl font-bold text-primary">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-center balance-xl text-primary outline-none py-4 border-b-2 border-n-100 focus:border-primary transition-colors"
            />
          </div>
          <p className="text-xs text-n-500 font-medium">
            You will receive: <span className="text-brand-dark font-bold">{(parseFloat(amount || "0") / 95432).toFixed(6)} BTC</span>
          </p>
        </div>

        {/* Payment Source */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest ml-1">Pay with</p>
          <div className="bg-secondary p-4 rounded-brand-card flex justify-between items-center border border-border">
            <div>
              <p className="text-sm font-bold text-brand-dark">USD Savings</p>
              <p className="text-[10px] text-n-500">Balance: $5,010,876.00</p>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-n-100/50 p-5 rounded-brand-card border border-n-100 space-y-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-n-500 uppercase">Network Fee</span>
            <span className="font-bold">$0.99</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-n-500 uppercase">Total to Pay</span>
            <span className="font-bold text-brand-dark">${(parseFloat(amount || "0") + 0.99).toFixed(2)}</span>
          </div>
        </div>

        <Button 
          onClick={handlePurchase}
          disabled={!amount || parseFloat(amount) <= 0}
          className="btn-primary w-full h-14 text-lg shadow-xl shadow-primary/20"
        >
          Confirm Purchase
        </Button>
      </div>
    </div>
  )
}

function SuccessState({ asset, amount }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in-95">
      <div className="w-24 h-24 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
        <CheckCircle2 size={56} strokeWidth={3} />
      </div>
      <div>
        <h2 className="text-3xl font-black text-brand-dark">Purchase Success!</h2>
        <p className="text-n-500 mt-2 max-w-[280px] mx-auto">
          You've successfully purchased {asset.symbol} using your USD Savings account.
        </p>
      </div>
      <div className="bg-secondary p-6 rounded-brand-card w-full max-w-xs border border-border">
        <p className="text-meta uppercase font-bold tracking-widest mb-1">Asset Received</p>
        <p className="balance-md text-primary">{(parseFloat(amount || "0") / 95432).toFixed(6)} {asset.symbol}</p>
      </div>
      <Link href="/app" className="w-full max-w-xs">
        <Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Return to Wallet</Button>
      </Link>
    </div>
  )
}