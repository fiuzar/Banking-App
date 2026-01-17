// 'use client'

// import React, { useState } from "react";
// import { 
//   ArrowLeft, Calendar, Info, CheckCircle2, 
//   Ban, Wallet, ArrowRight, FileText, TrendingDown
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";

// export default function LoansModule() {
//   const [step, setStep] = useState("overview");
//   const loanCurrency = "USD";

//   return (
//     <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl mx-auto w-full">
      
//       {/* 1. HEADER */}
//       <header className="flex items-center gap-4">
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           className="rounded-full"
//           onClick={() => setStep("overview")}
//         >
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <h1 className="text-2xl font-bold tracking-tight">
//           {step === "overview" ? "Personal Loan" : "Repay Loan"}
//         </h1>
//         <Badge className="ml-2 bg-slate-900 text-white border-none">{loanCurrency}</Badge>
//       </header>

//       {step === "overview" ? (
//         <>
//           {/* 2. LOAN SUMMARY HERO */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="md:col-span-2 border-none bg-slate-900 text-white shadow-xl overflow-hidden relative">
//               <CardContent className="p-8 space-y-6">
//                 <div>
//                   <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-60 mb-2">Total Outstanding</p>
//                   <h2 className="text-4xl font-extrabold">$3,450.00</h2>
//                 </div>
//                 <div className="flex gap-8 border-t border-white/10 pt-6">
//                   <div>
//                     <p className="text-[10px] uppercase opacity-50 font-bold mb-1">Next Payment</p>
//                     <p className="text-sm font-bold">Jan 30, 2026</p>
//                   </div>
//                   <div>
//                     <p className="text-[10px] uppercase opacity-50 font-bold mb-1">Interest Rate</p>
//                     <p className="text-sm font-bold">12% APR</p>
//                   </div>
//                 </div>
//                 <Button 
//                   className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-12"
//                   onClick={() => setStep("repay")}
//                 >
//                   Make a Repayment
//                 </Button>
//               </CardContent>
//               <TrendingDown className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 opacity-20" />
//             </Card>

//             <Card className="border-slate-200">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-purple-600" /> Loan Metadata
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-500">Principal</span>
//                   <span className="font-bold">$5,000</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-500">Tenure</span>
//                   <span className="font-bold">12 Months</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-slate-500">Status</span>
//                   <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Active</Badge>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* 3. REPAYMENT SCHEDULE */}
//           <section className="space-y-4">
//             <h3 className="font-bold text-lg flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-purple-600" /> Repayment Schedule
//             </h3>
//             <Card className="border-slate-100 shadow-sm">
//               <div className="divide-y divide-slate-50">
//                 {[
//                   { date: "Jan 30, 2026", amount: "$420.00", status: "Pending" },
//                   { date: "Dec 30, 2025", amount: "$420.00", status: "Paid" },
//                   { date: "Nov 30, 2025", amount: "$420.00", status: "Paid" },
//                 ].map((item, i) => (
//                   <div key={i} className="p-4 flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">{item.date}</p>
//                       <p className="text-xs text-slate-500 font-medium">{item.amount}</p>
//                     </div>
//                     <Badge variant={item.status === "Paid" ? "secondary" : "outline"} 
//                            className={item.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-none" : ""}>
//                       {item.status}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           </section>
//         </>
//       ) : (
//         /* 4. REPAYMENT FLOW (Non-Negotiable Currency Restriction) */
//         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
//           <section className="space-y-4">
//             <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Step 1: Select Funding Wallet</Label>
//             <RadioGroup defaultValue="usd" className="grid gap-4">
//               {/* WALLET MATCH: USD (Enabled) */}
//               <div className="flex items-center space-x-4 border p-4 rounded-xl cursor-pointer hover:border-purple-600 transition-colors">
//                 <RadioGroupItem value="usd" id="usd" />
//                 <div className="flex-1 flex justify-between items-center">
//                   <Label htmlFor="usd" className="cursor-pointer">
//                     <p className="font-bold">USD Wallet</p>
//                     <p className="text-xs text-slate-500">Balance: $1,200.00</p>
//                   </Label>
//                   <Badge variant="outline">Recommended</Badge>
//                 </div>
//               </div>

//               {/* WALLET MISMATCH: EUR (Disabled) */}
//               <div className="flex items-center space-x-4 border p-4 rounded-xl bg-slate-50 opacity-60 cursor-not-allowed">
//                 <RadioGroupItem value="eur" id="eur" disabled />
//                 <div className="flex-1 flex justify-between items-center">
//                   <Label htmlFor="eur" className="cursor-not-allowed">
//                     <p className="font-bold text-slate-400">EUR Wallet</p>
//                     <p className="text-xs text-slate-400">Balance: €5,000.00</p>
//                   </Label>
//                   <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase">
//                     <Ban className="h-3 w-3" /> Currency Mismatch
//                   </div>
//                 </div>
//               </div>
//             </RadioGroup>
//           </section>

//           <section className="space-y-4">
//             <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Step 2: Repayment Amount</Label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-2xl">$</span>
//               <input 
//                 type="number" 
//                 defaultValue="420.00" 
//                 className="w-full h-16 pl-10 pr-4 rounded-xl border border-slate-200 text-2xl font-bold focus:ring-2 focus:ring-purple-600 outline-none"
//               />
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold">Minimum Due</Button>
//               <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold">Full Outstanding</Button>
//             </div>
//           </section>

//           <Card className="bg-amber-50 border-amber-100">
//             <CardContent className="p-4 flex items-start gap-3">
//               <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
//               <div className="space-y-1">
//                 <p className="text-xs font-bold text-amber-900">Important Repayment Notice</p>
//                 <p className="text-[10px] text-amber-800 leading-relaxed">
//                   Loan repayments must be made in the original loan currency (USD). 
//                   Currency conversion is not supported for these payments to ensure accurate debt settlement.
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-lg font-bold shadow-lg shadow-purple-200">
//             Confirm & Repay $420.00
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// app/dashboard/loans/page.tsx
"use client";

import { Plus, Info, Calendar, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activeLoans = [
  { id: "ln_1", name: "Personal Loan", currency: "USD", outstanding: "3,450.00", nextDue: "Jan 30, 2026", status: "Active" },
  { id: "ln_2", name: "Business Expansion", currency: "EUR", outstanding: "7,200.00", nextDue: "Feb 05, 2026", status: "Active" },
];

export default function LoansHub() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      
      {/* 1. Entry Point: Apply for a Loan */}
      <section>
        <Card className="relative overflow-hidden border-none bg-brand-dark p-8 text-white rounded-brand-card shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold">Need more capital?</h2>
              <p className="text-n-300 text-sm max-w-sm">
                Get instant loans in USD or EUR with flexible repayment plans. 
                Funds land in your wallet in minutes.
              </p>
            </div>
            <Link href="/app/loan/apply">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 h-14 px-8 rounded-brand-button font-bold text-lg gap-2">
                <Plus size={20} /> Apply for a Loan
              </Button>
            </Link>
          </div>
          {/* Abstract decoration */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl" />
        </Card>
      </section>

      {/* 2. Your Active Loans (The Currency-Locked Cards) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-brand-dark text-lg">Your Active Loans</h3>
          <Badge variant="outline" className="border-n-300 text-n-500 font-bold">
            {activeLoans.length} Loans
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {activeLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      </section>

      {/* 3. Loan Insights & Education */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-brand-card border border-n-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-usd/10 rounded-full flex items-center justify-center text-usd shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-dark">Build Credit</p>
            <p className="text-xs text-n-500 mt-1">Timely USD repayments improve your PaySense score.</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-brand-card border border-n-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue shrink-0">
            <Info size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-dark">Currency Rule</p>
            <p className="text-xs text-n-500 mt-1">Repayments are locked to the loan&apos;s currency.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-brand-card border border-n-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-bank-warning/10 rounded-full flex items-center justify-center text-bank-warning shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-dark">No Late Fees</p>
            <p className="text-xs text-n-500 mt-1">Grace periods apply for all international transfers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Sub-component ---

function LoanCard({ loan }) {
  const isUSD = loan.currency === "USD";
  
  return (
    <Card className="border-none shadow-soft p-6 bg-white hover:ring-2 ring-brand-blue/10 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h4 className="font-bold text-brand-dark">{loan.name}</h4>
          <Badge className={`${isUSD ? 'bg-usd/10 text-usd' : 'bg-eur/10 text-eur'} border-none text-[10px] uppercase font-bold`}>
            {loan.currency} Loan
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-n-500 font-bold uppercase tracking-wider">Outstanding</p>
          <p className="balance-md text-brand-dark">
            {isUSD ? "$" : "€"}{loan.outstanding}
          </p>
        </div>
      </div>

      <div className="bg-n-100/50 rounded-xl p-4 flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-n-500">
          <Calendar size={14} />
          <span className="text-xs font-medium">Next Due: {loan.nextDue}</span>
        </div>
        <div className="flex items-center gap-1 text-bank-warning">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-[10px] font-bold uppercase">Pending</span>
        </div>
      </div>

      <Link href={`/app/loan/${loan.id}`}>
        <Button variant="outline" className="w-full border-n-300 text-brand-dark font-bold group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition-all">
          Manage Loan <ArrowRight size={16} className="ml-2" />
        </Button>
      </Link>
    </Card>
  );
}