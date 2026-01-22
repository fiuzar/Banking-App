'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, QrCode, AlertCircle, Bitcoin } from "lucide-react"
import Link from "next/link"

export default function CryptoDeposit() {
  const [copied, setCopied] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState({ name: "Bitcoin", symbol: "BTC", network: "BTC Network", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" })

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedCoin.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app"><ArrowLeft size={24} /></Link>
        <h1 className="text-xl font-bold">Crypto Deposit</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Asset Toggle (BTC/ETH) */}
        <div className="flex bg-secondary p-1 rounded-xl border border-border">
            <button 
                onClick={() => setSelectedCoin({ name: "Bitcoin", symbol: "BTC", network: "BTC Network", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" })}
                className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${selectedCoin.symbol === 'BTC' ? 'bg-white text-primary shadow-sm' : 'text-n-500'}`}
            >
                Bitcoin (BTC)
            </button>
            <button 
                onClick={() => setSelectedCoin({ name: "Ethereum", symbol: "ETH", network: "ERC-20", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" })}
                className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${selectedCoin.symbol === 'ETH' ? 'bg-white text-primary shadow-sm' : 'text-n-500'}`}
            >
                Ethereum (ETH)
            </button>
        </div>

        {/* QR Code Section */}
        <div className="bg-white border border-border rounded-[32px] p-8 flex flex-col items-center shadow-sm">
            <div className="w-48 h-48 bg-secondary rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-n-100">
                <QrCode size={140} className="text-brand-dark" />
            </div>
            
            <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest mb-2">Your {selectedCoin.symbol} Address</p>
            <div 
                onClick={handleCopy}
                className="w-full bg-secondary p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-n-100 transition-colors group"
            >
                <span className="text-xs font-mono break-all text-brand-dark pr-4">
                    {selectedCoin.address}
                </span>
                {copied ? <Check className="text-bank-success" size={20} /> : <Copy className="text-n-300 group-hover:text-primary" size={20} />}
            </div>
        </div>

        {/* Important Warning */}
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-3">
            <AlertCircle className="text-orange-500 shrink-0" size={20} />
            <div className="space-y-1">
                <p className="text-xs font-bold text-orange-800">Ensure the network is correct</p>
                <p className="text-[10px] text-orange-700 leading-relaxed">
                    Only send <span className="font-bold">{selectedCoin.symbol}</span> via the <span className="font-bold">{selectedCoin.network}</span>. 
                    Sending any other coin or using the wrong network will result in permanent loss of funds.
                </p>
            </div>
        </div>

        {/* Info List */}
        <div className="space-y-3 px-1">
            <div className="flex justify-between items-center py-3 border-b border-n-100">
                <span className="text-xs font-medium text-n-500">Minimum Deposit</span>
                <span className="text-xs font-bold text-brand-dark">0.0001 {selectedCoin.symbol}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-n-100">
                <span className="text-xs font-medium text-n-500">Confirmations Required</span>
                <span className="text-xs font-bold text-brand-dark">3 Network Confirmations</span>
            </div>
        </div>

        <Link href="/app" className="block pt-4">
            <Button variant="outline" className="w-full h-14 border-n-300 text-n-500 font-bold hover:bg-secondary">
                Back to Wallet
            </Button>
        </Link>
      </div>
    </div>
  )
}