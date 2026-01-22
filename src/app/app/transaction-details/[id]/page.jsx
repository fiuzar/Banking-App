'use client'

import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"

export default function TransactionDetails({ params }) {
  // Mock data for a specific transaction
  const tx = {
    id: params.id || "TXN-99201102",
    name: "Apple Store",
    amount: "-$1,299.00",
    status: "Completed",
    date: "Jan 22, 2026",
    time: "04:12 PM",
    source: "USD Checking (*** 4456)",
    reference: "PS-882-1002-990",
    category: "Shopping"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="bg-white p-6 flex justify-between items-center border-b border-slate-100">
        <Link href="/app" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-brand-dark" />
        </Link>
        <h1 className="text-sm font-black uppercase tracking-widest text-brand-dark">Transaction Details</h1>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-primary">
          <Share2 size={22} />
        </button>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Receipt Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[40px]" />
          
          <div className="w-16 h-16 bg-bank-success/10 text-bank-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>
          
          <h2 className="text-2xl font-black text-brand-dark mb-1">{tx.amount}</h2>
          <p className="text-sm font-bold text-n-500 mb-6">{tx.name}</p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bank-success/10 text-bank-success text-[10px] font-bold uppercase tracking-widest">
            {tx.status}
          </div>

          <hr className="my-8 border-dashed border-slate-200" />

          {/* Details Grid */}
          <div className="space-y-4 text-left">
            <DetailRow label="Date & Time" value={`${tx.date}, ${tx.time}`} />
            <DetailRow label="Paid From" value={tx.source} />
            <DetailRow label="Category" value={tx.category} />
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] font-bold text-n-400 uppercase tracking-widest">Reference ID</p>
                <p className="text-xs font-mono text-brand-dark">{tx.reference}</p>
              </div>
              <button className="p-2 text-n-300 hover:text-primary transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100">
          <ShieldCheck className="text-primary" size={20} />
          <p className="text-[10px] text-n-500 leading-tight">
            This transaction is protected by Paysense Secure-Shield™ and is officially settled.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="outline" className="h-14 border-slate-200 text-brand-dark font-bold rounded-2xl flex gap-2">
            <Download size={18} /> Receipt
          </Button>
          <Button variant="outline" className="h-14 border-slate-200 text-brand-dark font-bold rounded-2xl flex gap-2">
            <ExternalLink size={18} /> Support
          </Button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-n-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-brand-dark">{value}</p>
    </div>
  )
}