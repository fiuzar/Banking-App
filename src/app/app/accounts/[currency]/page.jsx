// import React from "react";
// import { 
//   ArrowLeft, Copy, Eye, Info, Send, 
//   ArrowDownLeft, ArrowRightLeft, Banknote, 
//   Download, ShieldCheck, Search, Filter 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { TransactionItem } from "@/components/app/transaction-item";

// export default function AccountDetailsPage() {
//   // In a real app, you'd fetch based on params.id (USD, EUR, etc.)
//   const walletType = "USD"; 
//   const isUSD = walletType === "USD";

//   return (
//     <div className="flex flex-col gap-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      
//       {/* 1. HEADER (Context Anchor) */}
//       <header className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30 py-2">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <div>
//             <h1 className="text-xl font-bold">{walletType} Wallet</h1>
//             <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100">
//               <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2" />
//               Active
//             </Badge>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="flex items-center justify-end gap-2 text-muted-foreground">
//             <span className="text-xs font-medium uppercase tracking-wider">Available Balance</span>
//             <Eye className="h-3 w-3 cursor-pointer" />
//           </div>
//           <h2 className="text-3xl font-extrabold tracking-tight">
//             {isUSD ? "$" : "€"}12,450.00
//           </h2>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         {/* LEFT COLUMN: Banking Details & Actions */}
//         <div className="md:col-span-1 space-y-6">
          
//           {/* 2. ACCOUNT INFO CARD */}
//           <Card className="border-slate-200 shadow-sm overflow-hidden">
//             <CardHeader className="bg-slate-50/50 pb-4">
//               <CardTitle className="text-sm font-semibold flex items-center gap-2">
//                 <Info className="h-4 w-4 text-purple-600" /> Banking Identifiers
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-4 space-y-4">
//               <div className="space-y-1">
//                 <p className="text-[10px] uppercase font-bold text-slate-400">Account Number</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-mono">1234567890</span>
//                   <Copy className="h-3 w-3 text-slate-400 cursor-pointer hover:text-purple-600" />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-[10px] uppercase font-bold text-slate-400">IBAN</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-mono truncate mr-2">DE89 3704 0044 0532...</span>
//                   <Copy className="h-3 w-3 text-slate-400 cursor-pointer hover:text-purple-600" />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-[10px] uppercase font-bold text-slate-400">SWIFT / BIC</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-mono">BOFAUS3N</span>
//                   <Copy className="h-3 w-3 text-slate-400 cursor-pointer hover:text-purple-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* 3. PRIMARY ACTIONS */}
//           <div className="grid grid-cols-2 gap-3">
//             <Button className="w-full bg-purple-600 hover:bg-purple-700 gap-2 h-12">
//               <Send className="h-4 w-4" /> Send
//             </Button>
//             <Button variant="outline" className="w-full gap-2 h-12">
//               <ArrowDownLeft className="h-4 w-4" /> Receive
//             </Button>
//             <Button variant="outline" className="w-full gap-2 h-12">
//               <ArrowRightLeft className="h-4 w-4" /> Convert
//             </Button>
//             <Button variant="outline" className="w-full gap-2 h-12">
//               <Banknote className="h-4 w-4" /> Withdraw
//             </Button>
//           </div>

//           {/* 4. ACTIVITY SUMMARY */}
//           <Card className="border-none bg-slate-50">
//             <CardContent className="p-4 space-y-4">
//               <p className="text-xs font-bold uppercase text-slate-400">This Month</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-600">Incoming</span>
//                 <span className="text-sm font-bold text-emerald-600">+$8,200.00</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-600">Outgoing</span>
//                 <span className="text-sm font-bold text-slate-900">-$5,100.00</span>
//               </div>
//               <Separator />
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-600">FX Conversions</span>
//                 <span className="text-sm font-bold">2</span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN: Transactions List */}
//         <div className="md:col-span-2 space-y-6">
//           <Card className="min-h-[500px]">
//             <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
//               <CardTitle className="text-lg">Wallet Activity</CardTitle>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="space-y-8">
//                 {/* Specific Wallet Filter: Only USD items here */}
//                 <TransactionItem title="Amazon Web Services" date="Jan 12, 2026" amount="-120.00" currency="USD" type="debit" />
//                 <TransactionItem title="FX Conversion (USD → EUR)" date="Jan 10, 2026" amount="-1,000.00" currency="USD" type="debit" />
//                 <TransactionItem title="Salary Deposit" date="Jan 05, 2026" amount="+4,200.00" currency="USD" type="credit" />
//                 <TransactionItem title="Stripe Payout" date="Jan 02, 2026" amount="+2,500.00" currency="USD" type="credit" />
//               </div>
              
//               <div className="mt-10 flex justify-center">
//                 <Button variant="outline" className="text-xs gap-2">
//                   <Download className="h-3 w-3" /> Download Statement (PDF)
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
          
//           <div className="flex items-center justify-center gap-2 text-slate-400">
//             <ShieldCheck className="h-4 w-4" />
//             <p className="text-[10px] font-medium uppercase tracking-widest">End-to-end encrypted activity</p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


// app/dashboard/wallets/[id]/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Copy, Send, Download, 
  RefreshCcw, Plus, Landmark, Eye, EyeOff, Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WalletDetailsPage({ params }) {
  const [showBalance, setShowBalance] = useState(true);
  const isUSD = params.id === "usd"; // Logic to determine currency context
  const symbol = isUSD ? "$" : "€";
  const currencyName = isUSD ? "USD Wallet" : "EUR Wallet";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could trigger a shadcn toast here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. Header (Context Anchor) */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-16 z-20 py-4 -mx-4 px-4 border-b border-n-100">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-n-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-brand-dark" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-n-500 uppercase tracking-tighter">{currencyName}</h1>
            <div className="flex items-center gap-2">
              <span className="balance-lg text-brand-dark">
                {showBalance ? `${symbol}12,450.00` : "••••••"}
              </span>
              <button onClick={() => setShowBalance(!showBalance)} className="text-n-300 hover:text-brand-blue">
                {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
        </div>
        <Badge className={isUSD ? "bg-usd/10 text-usd border-none" : "bg-eur/10 text-eur border-none"}>
          {isUSD ? "US Dollar" : "Euro"}
        </Badge>
      </div>

      {/* 2. Account Info Card (Identity & Trust) */}
      <Card className="border-none shadow-soft p-6 bg-brand-dark text-white rounded-brand-card relative overflow-hidden">
        {/* Subtle background pattern for premium feel */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Landmark size={80} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <InfoItem label="Account Number" value="1234567890" onCopy={copyToClipboard} />
            <InfoItem label="SWIFT / BIC" value="PYSN US 33" onCopy={copyToClipboard} />
          </div>
          <div className="space-y-4">
            <InfoItem label="IBAN" value="DE89 3704 0044 0532 0130 00" onCopy={copyToClipboard} />
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-bold text-n-300">Wallet Status</span>
              <Badge className="bg-usd text-white border-none text-[10px]">Active</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Primary Actions */}
      <div className="grid grid-cols-4 gap-4">
        <QuickAction icon={<Send size={20} />} label="Send" />
        <QuickAction icon={<Plus size={20} />} label="Receive" />
        <QuickAction icon={<RefreshCcw size={20} />} label="Convert" href="/dashboard/convert" />
        <QuickAction icon={<Landmark size={20} />} label="Withdraw" />
      </div>

      {/* 4. Activity Summary */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryTile label="Incoming" value="+$8,200" color="text-usd" />
        <SummaryTile label="Outgoing" value="-$5,100" color="text-bank-error" />
        <SummaryTile label="Conversions" value="2" color="text-brand-blue" />
      </div>

      {/* 5. Transactions List */}
      <div className="space-y-4">
        <h3 className="font-bold text-brand-dark mt-8">Recent Activity</h3>
        <Card className="border-none shadow-soft overflow-hidden rounded-brand-card">
            <TransactionItem title="Amazon EU" date="Jan 10, 2026" amount="-€120.00" status="Completed" />
            <TransactionItem title="FX Conversion" date="Jan 09, 2026" amount="-$1,000.00" status="Completed" isFX />
            <TransactionItem title="Salary Credit" date="Jan 07, 2026" amount="+$3,200.00" status="Completed" isPositive />
        </Card>
      </div>

      {/* 7. Secondary Actions Footer */}
      <div className="flex justify-center gap-6 py-8">
        <button className="flex items-center gap-2 text-xs font-bold text-n-500 hover:text-brand-blue transition-colors">
          <Download size={14} /> Download Statement
        </button>
        <button className="flex items-center gap-2 text-xs font-bold text-n-500 hover:text-brand-blue transition-colors">
          <Info size={14} /> View Limits
        </button>
      </div>
    </div>
  );
}

// --- Internal Components ---

function InfoItem({ label, value, onCopy }) {
  return (
    <div className="space-y-1 group border-b border-white/10 pb-2">
      <p className="text-[10px] uppercase font-bold text-n-300">{label}</p>
      <div className="flex justify-between items-center">
        <span className="font-mono text-sm tracking-wider">{value}</span>
        <button onClick={() => onCopy(value)} className="p-1 hover:bg-white/10 rounded">
          <Copy size={14} className="text-n-300" />
        </button>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, href = "#" }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className="w-14 h-14 bg-white shadow-soft rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-xs font-bold text-n-700">{label}</span>
    </Link>
  );
}

function SummaryTile({ label, value, color }) {
  return (
    <div className="bg-n-100/50 p-4 rounded-brand-card border border-n-100">
      <p className="text-[10px] uppercase font-bold text-n-500 mb-1">{label}</p>
      <p className={`text-sm font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}

function TransactionItem({ title, date, amount, status, isPositive, isFX }) {
  return (
    <div className="flex justify-between items-center p-4 hover:bg-n-100/50 border-b border-n-100 last:border-none transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFX ? 'bg-brand-blue/10 text-brand-blue' : 'bg-n-100 text-n-500'}`}>
          {isFX ? <RefreshCcw size={18} /> : <Landmark size={18} />}
        </div>
        <div>
          <p className="text-sm font-bold text-brand-dark">{title}</p>
          <p className="text-[11px] text-n-500">{date} • {status}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-mono font-bold ${isPositive ? 'text-usd' : 'text-brand-dark'}`}>
          {amount}
        </p>
      </div>
    </div>
  );
}