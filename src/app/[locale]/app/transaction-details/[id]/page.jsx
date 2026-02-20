'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Printer, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getTransactionById } from "@/server-functions/transaction-history"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import { useLanguage } from "@/messages/LanguageProvider"

export default function TransactionDetails() {
  const { t } = useLanguage()
  const [tx, setTx] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    async function loadTransaction() {
      try {
        const res = await getTransactionById(id)
        if (res.success) setTx(res.transaction)
      } catch (err) {
        console.error("Error loading transaction:", err)
      } finally {
        setLoading(false)
      }
    }
    loadTransaction()
  }, [id])

  const handlePrint = () => window.print()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-green-800" size={32} />
    </div>
  )

  if (!tx) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <AlertCircle className="text-slate-300 mb-4" size={48} />
      <p className="text-slate-500 mb-6 font-medium">Transaction not found</p>
      <Link href="/app" className="text-primary font-bold hover:underline">
        {t("TransactionDetails", "actions.dispute") || "Return Home"}
      </Link>
    </div>
  )

  const isExpense = tx.amount < 0

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white print:p-0 pb-24">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; size: auto; }
          body { margin: 1cm; overflow: hidden; }
          .no-print { display: none !important; }
        }
      `}} />

      {/* HEADER */}
      <div className="bg-white p-6 flex justify-between items-center border-b border-slate-100 print:hidden sticky top-0 z-20">
        <Link href="/app" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("TransactionDetails", "title") || "Transaction Receipt"}
        </h1>
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6 print:p-0 print:m-0 print:max-w-full">
        {/* MAIN RECEIPT CARD */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-300">
          
          {/* PRINT STAMP */}
          <div className="hidden print:flex absolute top-10 right-10 border-4 border-green-600/30 text-green-600/30 px-4 py-1 rounded-xl font-black text-2xl uppercase tracking-tighter -rotate-12 select-none">
            Verified
          </div>

          {/* PRINT LOGO */}
          <div className="hidden print:flex flex-col items-center mb-10">
            <div className="w-10 h-10 bg-green-800 rounded-xl mb-2 flex items-center justify-center text-white font-black">PS</div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Paysense</h1>
            <p className="text-[8px] uppercase tracking-[0.3em] text-slate-400 font-bold">Official Ledger Receipt</p>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[80px] -mr-8 -mt-8 print:hidden" />
          
          <div className="w-20 h-20 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner print:w-14 print:h-14">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          
          <h2 className={`text-4xl font-black mb-1 ${isExpense ? 'text-slate-900' : 'text-green-700'}`}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(tx.amount))}
          </h2>
          <p className="text-sm font-bold text-slate-500 mb-6">{tx.description || "No Description"}</p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'} print:border print:border-green-100`}>
            {t("TransactionDetails", `labels.status.${tx.status?.toLowerCase()}`) || tx.status}
          </div>

          <hr className="my-10 border-dashed border-slate-200 print:my-8" />

          {/* WATERMARK */}
          <div className="hidden print:block absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-35deg] text-[120px] font-black uppercase select-none">
            Paysense
          </div>

          {/* DETAILS */}
          <div className="space-y-6 text-left relative z-10">
            <DetailRow 
                label={t("TransactionDetails", "labels.date") || "Date & Time"} 
                value={tx.created_at ? format(new Date(tx.created_at), "MMM dd, yyyy • hh:mm b") : "---"} 
            />
            <DetailRow 
                label={t("TransactionDetails", "referenceId") || "Reference ID"} 
                value={tx.reference_id || "---"} 
                isMono 
            />
            <DetailRow 
                label={t("TransactionDetails", "labels.account") || "Account Used"} 
                value="Standard Account (***4201)" 
            />
            <DetailRow 
                label={t("TransactionDetails", "labels.type") || "Status"} 
                value={t("TransactionDetails", `labels.status.${tx.status?.toLowerCase()}`) || "Settled"} 
            />
          </div>
          
          {/* PRINT FOOTER */}
          <div className="hidden print:block mt-16 pt-8 border-t border-slate-100 text-[9px] text-slate-400 text-center leading-relaxed">
            <p className="font-bold">This is an electronic receipt and doesn't require a physical signature.</p>
            <p>Generated on {format(new Date(), "PPpp")}</p>
            <p className="mt-2 text-[7px] uppercase tracking-tighter opacity-50 font-mono">HASH: {tx.reference_id}-{tx.id}-secure</p>
          </div>
        </div>

        {/* SECURITY SHIELD */}
        <div className="flex items-center gap-4 px-5 py-4 bg-white rounded-[24px] border border-slate-100 shadow-sm print:hidden">
          <div className="p-2 bg-green-50 rounded-xl">
             <ShieldCheck className="text-green-700" size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold leading-snug uppercase tracking-tight">
                Secure Transaction Authenticated <br/>
                <span className="text-slate-300 font-mono text-[9px]">AUTH-ID: PS-{tx.id?.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4 print:hidden">
          <Button onClick={handlePrint} className="h-14 bg-green-800 text-white font-black rounded-2xl flex gap-2 shadow-lg shadow-green-900/20 active:scale-95 transition-all">
            <Printer size={18} /> {t("TransactionDetails", "actions.share") || "Print"}
          </Button>
          <Button variant="outline" className="h-14 border-slate-200 text-slate-500 font-black rounded-2xl active:scale-95 transition-all">
            {t("TransactionDetails", "actions.dispute") || "Support"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, isMono = false }) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black text-slate-900 ${isMono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}