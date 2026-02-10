'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Download, CheckCircle2, Copy, ExternalLink, ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getTransactionById } from "@/server-functions/transaction-history" // Update this path
import { format } from "date-fns" // Optional: npm install date-fns
import {useParams} from "next/navigation"

export default function TransactionDetails() {
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const {id} = useParams()

  useEffect(() => {
    async function loadTransaction() {
      const res = await getTransactionById(id);
      if (res.success) {
        setTx(res.transaction);
      }
      setLoading(false);
    }
    loadTransaction();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-green-800" size={32} />
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-brand-dark">Transaction Not Found</h2>
        <Link href="/app" className="mt-4 text-green-800 font-bold underline">Back to Dashboard</Link>
      </div>
    );
  }

  // Logic for Credit vs Debit
  const isExpense = tx.amount < 0;
  const statusColor = tx.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white p-6 flex justify-between items-center border-b border-slate-100">
        <Link href="/app" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-brand-dark" />
        </Link>
        <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Receipt</h1>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
          <Share2 size={20} />
        </button>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[80px] -mr-8 -mt-8" />
          
          <div className="w-20 h-20 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          
          {/* Amount logic: Format to currency */}
          <h2 className={`text-3xl font-black mb-1 ${isExpense ? 'text-brand-dark' : 'text-green-700'}`}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
          </h2>
          <p className="text-sm font-bold text-slate-500 mb-6">{tx.description}</p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
            {tx.status}
          </div>

          <hr className="my-10 border-dashed border-slate-200" />

          <div className="space-y-6 text-left">
            <DetailRow label="Date & Time" value={format(new Date(tx.created_at), "MMM dd, yyyy • hh:mm b")} />
            <DetailRow label="Transaction Type" value={tx.type.replace('_', ' ')} />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference ID</p>
                <p className="text-xs font-mono font-bold text-brand-dark bg-slate-50 px-2 py-1 rounded-md border border-slate-100 italic">
                    {tx.reference_id}
                </p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(tx.reference_id)} className="p-2 text-slate-400 hover:text-green-800 transition-colors">
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
          <div className="p-2 bg-green-50 rounded-xl">
             <ShieldCheck className="text-green-700" size={20} />
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-snug uppercase tracking-tight">
            Protected by Paysense Secure-Shield™. <br/>
            <span className="text-slate-300">Transaction Hash: {tx.id}9920x{tx.user_id}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-14 border-slate-200 text-brand-dark font-black rounded-2xl flex gap-2 hover:bg-white hover:border-green-800 transition-all">
            <Download size={18} /> Receipt
          </Button>
          <Button variant="outline" className="h-14 border-slate-200 text-brand-dark font-black rounded-2xl flex gap-2 hover:bg-white hover:border-green-800 transition-all">
            <ExternalLink size={18} /> Support
          </Button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-green-800 transition-colors">{label}</p>
      <p className="text-sm font-black text-brand-dark capitalize">{value}</p>
    </div>
  )
}