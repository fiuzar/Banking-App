// import React from "react";
// import { 
//   ArrowLeft, Download, Share2, Copy, 
//   ExternalLink, CheckCircle2, RefreshCcw, 
//   HelpCircle, FileText 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";

// export default function TransactionReceiptPage() {
//   // Logic check: Is this an FX Conversion or a Standard Payment?
//   const isFX = true; 

//   return (
//     <div className="flex flex-col gap-6 p-6 md:p-10 max-w-2xl mx-auto w-full">
      
//       {/* 1. HEADER */}
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <h1 className="text-sm font-bold uppercase tracking-widest text-slate-400">Transaction Receipt</h1>
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <Share2 className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* 2. MAIN STATUS & AMOUNT HERO */}
//       <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
//         <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
//           <CheckCircle2 className="h-10 w-10" />
//         </div>
//         <div>
//           <h2 className="text-4xl font-extrabold text-slate-900">
//             {isFX ? "-$1,000.00" : "-€120.00"}
//           </h2>
//           <p className="text-slate-500 font-medium mt-1">Amazon Web Services</p>
//         </div>
//         <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-1">
//           Completed
//         </Badge>
//       </div>

//       {/* 3. TRANSACTION DATA CARD */}
//       <Card className="border-slate-200 shadow-sm overflow-hidden">
//         <CardContent className="p-0">
//           <div className="p-6 space-y-6">
            
//             {/* CONDITIONAL FX SECTION */}
//             {isFX && (
//               <div className="bg-purple-50 p-4 rounded-xl space-y-4">
//                 <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase">
//                   <RefreshCcw className="h-3 w-3" /> Currency Conversion
//                 </div>
//                 <div className="flex justify-between items-end">
//                   <div>
//                     <p className="text-[10px] text-purple-400 font-bold uppercase">Sent (USD)</p>
//                     <p className="text-lg font-bold text-slate-900">$1,000.00</p>
//                   </div>
//                   <div className="h-px flex-1 bg-purple-200 mx-4 mb-2 border-dotted border-t-2" />
//                   <div className="text-right">
//                     <p className="text-[10px] text-purple-400 font-bold uppercase">Received (EUR)</p>
//                     <p className="text-lg font-bold text-emerald-600">€917.45</p>
//                   </div>
//                 </div>
//                 <div className="flex justify-between text-xs pt-2 border-t border-purple-100">
//                   <span className="text-purple-700">Exchange Rate</span>
//                   <span className="font-bold text-purple-900">1 USD = 0.91745 EUR</span>
//                 </div>
//               </div>
//             )}

//             {/* STANDARD DETAILS */}
//             <div className="space-y-4 pt-2">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-500">Date & Time</span>
//                 <span className="text-sm font-semibold text-slate-900">Jan 15, 2026 • 12:40 PM</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-500">Payment Method</span>
//                 <span className="text-sm font-semibold text-slate-900">USD Wallet (..4290)</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-500">Transaction ID</span>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-mono text-slate-900">TXN-882910029X</span>
//                   <Copy className="h-3 w-3 text-slate-400 cursor-pointer" />
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-500">Merchant Reference</span>
//                 <span className="text-sm font-semibold text-slate-900">AWS-INV-2026-01</span>
//               </div>
//             </div>

//             <Separator />

//             {/* OPTIONAL NOTE */}
//             <div className="space-y-2">
//               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note</span>
//               <p className="text-sm text-slate-600 italic">&quot;Server hosting fees for Q1 expansion&quot;</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* 4. ACTIONS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Button variant="outline" className="h-12 gap-2 border-slate-200 shadow-sm">
//           <FileText className="h-4 w-4" /> Download PDF Receipt
//         </Button>
//         <Button variant="outline" className="h-12 gap-2 border-slate-200 shadow-sm text-red-600 hover:text-red-700 hover:bg-red-50">
//           <HelpCircle className="h-4 w-4" /> Dispute Transaction
//         </Button>
//       </div>

//       <p className="text-[10px] text-center text-slate-400 px-10">
//         This is an official transaction record. If you have questions, please reference the Transaction ID above when contacting support.
//       </p>
//     </div>
//   );
// }


// app/dashboard/history/[id]/page.tsx
"use client";

import { ArrowLeft, Copy, Share2, Download, ExternalLink, RefreshCcw, Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TransactionDetails({ params }) {
  // Mock data for an FX Conversion pairing
  const isFX = true; 

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/history" className="p-2 hover:bg-n-300/20 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-brand-dark" />
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-n-500"><Share2 size={20} /></Button>
          <Button variant="ghost" size="icon" className="rounded-full text-n-500"><Download size={20} /></Button>
        </div>
      </div>

      <div className="space-y-6 flex flex-col items-center">
        {/* 2. Status & Hero Amount */}
        <div className="text-center space-y-4 w-full">
          <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
            {isFX ? <RefreshCcw size={32} /> : <Landmark size={32} />}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-mono font-bold text-brand-dark">-$1,000.00</h1>
            <p className="text-sm font-bold text-n-500 uppercase tracking-widest">USD Wallet</p>
          </div>
          <Badge className="bg-usd/10 text-usd border-none px-4 py-1">Completed</Badge>
        </div>

        {/* 3. The Details Card */}
        <Card className="w-full border-none shadow-soft rounded-brand-card overflow-hidden bg-white">
          <div className="p-8 space-y-6">
            {/* Context Section */}
            <div className="space-y-4">
              <DetailRow label="Transaction Type" value="FX Conversion" />
              <DetailRow label="Date & Time" value="Jan 11, 2026 • 14:32" />
              <DetailRow label="Reference" value="PS-9920-X12B" isCopyable />
            </div>

            {/* 5. FX Pair Logic (The "Bridge" View) */}
            {isFX && (
              <div className="bg-n-100 rounded-xl p-6 space-y-4 border border-n-300/30">
                <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest">Conversion Details</p>
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-xs text-n-500">You Sold</p>
                    <p className="font-mono font-bold text-brand-dark">$1,000.00</p>
                  </div>
                  <div className="h-px flex-1 bg-n-300 mx-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-n-100 px-2 text-brand-blue">
                      <RefreshCcw size={14} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-n-500">You Received</p>
                    <p className="font-mono font-bold text-brand-blue">€917.00</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-n-300/30 flex justify-between text-[11px] font-bold text-n-500">
                  <span>Rate: 1 USD = 0.92 EUR</span>
                  <span>Fee: $3.00</span>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <DetailRow label="Recipient" value="Self (EUR Wallet)" />
              <DetailRow label="Network" value="Internal PaySense Transfer" />
            </div>
          </div>

          {/* 4. Footer Actions */}
          <div className="bg-n-100/50 p-6 flex flex-col gap-3 border-t border-n-100">
            <Button variant="outline" className="w-full h-12 font-bold border-n-300 text-brand-dark gap-2">
              <ExternalLink size={16} /> View on Blockchain / Ledger
            </Button>
            <button className="text-xs font-bold text-bank-error hover:underline py-2">
              Report a problem with this transaction
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- Internal Helper ---
function DetailRow({ label, value, isCopyable }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-n-500 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-dark font-bold text-right max-w-[200px]">{value}</span>
        {isCopyable && (
          <button className="text-n-300 hover:text-brand-blue transition-colors">
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}