// import React from "react";
// import { 
//   ArrowLeft, ArrowUpDown, Info, CheckCircle2, 
//   TrendingUp, AlertCircle, RefreshCcw 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { 
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
// } from "@/components/ui/select";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
// } from "@/components/ui/dialog";

// export default function ConvertPage() {
//   return (
//     <div className="flex flex-col gap-6 p-6 md:p-10 max-w-2xl mx-auto w-full">
      
//       {/* 1. HEADER */}
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <h1 className="text-2xl font-bold tracking-tight text-slate-900">Convert Currency</h1>
//       </div>

//       <div className="space-y-4">
//         {/* 2. INPUT SECTION */}
//         <div className="relative space-y-2">
//           {/* FROM CARD */}
//           <Card className="border-slate-200 shadow-sm overflow-hidden">
//             <CardContent className="p-0">
//               <div className="flex items-center p-4 gap-4">
//                 <div className="flex-1">
//                   <Label className="text-[10px] uppercase font-bold text-slate-400">You Send</Label>
//                   <Input 
//                     type="number" 
//                     defaultValue="1000" 
//                     className="border-none p-0 text-3xl font-bold focus-visible:ring-0 h-auto shadow-none" 
//                   />
//                 </div>
//                 <Select defaultValue="usd">
//                   <SelectTrigger className="w-[100px] bg-slate-50 border-none font-bold">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="usd">USD</SelectItem>
//                     <SelectItem value="eur">EUR</SelectItem>
//                     <SelectItem value="gbp">GBP</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* SWITCH BUTTON (Absolute positioned between cards) */}
//           <div className="absolute left-1/2 -translate-x-1/2 top-[44%] -translate-y-1/2 z-20">
//             <Button size="icon" variant="outline" className="rounded-full bg-white border-2 border-slate-100 shadow-md hover:text-purple-600 transition-transform hover:rotate-180 duration-500">
//               <ArrowUpDown className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* TO CARD */}
//           <Card className="border-slate-200 shadow-sm bg-slate-50/50">
//             <CardContent className="p-0">
//               <div className="flex items-center p-4 gap-4">
//                 <div className="flex-1">
//                   <Label className="text-[10px] uppercase font-bold text-slate-400">You Receive</Label>
//                   <div className="text-3xl font-bold text-slate-900 h-9">917.45</div>
//                 </div>
//                 <Select defaultValue="eur">
//                   <SelectTrigger className="w-[100px] bg-white border-none font-bold">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="eur">EUR</SelectItem>
//                     <SelectItem value="usd">USD</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* 3. LIVE DETAILS & FEES */}
//         <Card className="border-none bg-purple-50/50">
//           <CardContent className="p-4 space-y-3">
//             <div className="flex justify-between items-center text-sm">
//               <div className="flex items-center gap-2 text-slate-500">
//                 <TrendingUp className="h-4 w-4 text-purple-600" />
//                 <span>Exchange Rate</span>
//               </div>
//               <span className="font-bold text-slate-900">1 USD = 0.91745 EUR</span>
//             </div>
            
//             <div className="flex justify-between items-center text-sm">
//               <div className="flex items-center gap-2 text-slate-500">
//                 <Info className="h-4 w-4 text-purple-600" />
//                 <span>Conversion Fee (0.3%)</span>
//               </div>
//               <span className="font-bold text-slate-900">$3.00</span>
//             </div>

//             <div className="pt-2 border-t border-purple-100 flex justify-between items-center">
//               <span className="text-sm font-medium text-purple-900">Guaranteed for 5m</span>
//               <div className="flex items-center gap-1 text-[10px] text-purple-400">
//                 <RefreshCcw className="h-3 w-3 animate-spin-slow" />
//                 Updating Live
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* 4. CONFIRMATION MODAL */}
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200">
//               Preview Conversion
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="text-center">Confirm Conversion</DialogTitle>
//             </DialogHeader>
//             <div className="py-6 space-y-6">
//               <div className="flex flex-col items-center gap-2">
//                 <div className="flex items-center gap-4 text-2xl font-bold">
//                   <span>$1,000.00</span>
//                   <ArrowRightLeft className="h-5 w-5 text-purple-600" />
//                   <span className="text-emerald-600">€917.45</span>
//                 </div>
//                 <p className="text-xs text-muted-foreground uppercase tracking-widest">Mid-Market Rate</p>
//               </div>
              
//               <div className="bg-slate-50 p-4 rounded-xl space-y-2">
//                 <div className="flex justify-between text-xs">
//                   <span className="text-slate-500">From Wallet</span>
//                   <span className="font-bold">USD Wallet (...4290)</span>
//                 </div>
//                 <div className="flex justify-between text-xs">
//                   <span className="text-slate-500">To Wallet</span>
//                   <span className="font-bold">EUR Wallet (...1105)</span>
//                 </div>
//                 <div className="flex justify-between text-xs">
//                   <span className="text-slate-500">Processing Time</span>
//                   <span className="font-bold text-emerald-600">Instant</span>
//                 </div>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button className="w-full bg-purple-600 h-12 text-md font-bold">Confirm & Convert</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* 5. FOOTER NOTICE */}
//       <div className="flex items-start gap-2 p-4 rounded-lg bg-slate-50 border border-slate-100">
//         <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5" />
//         <p className="text-[11px] text-slate-500 leading-relaxed">
//           The exchange rate provided is mid-market and may fluctuate until you confirm the transaction. 
//           Funds will be deducted immediately from your USD wallet.
//         </p>
//       </div>
//     </div>
//   );
// }

// // Sub-component used for the arrow animation
// function ArrowRightLeft({ className }) {
//   return (
//     <svg 
//       className={className} 
//       xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//     >
//       <path d="m2 8 2 2 2-2"/><path d="m22 16-2-2-2 2"/><path d="M4 10h16"/><path d="M2 16h16"/>
//     </svg>
//   );
// }


// app/dashboard/convert/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Repeat, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ConvertPage() {
  const [amount, setAmount] = useState("1000");
  const [showSuccess, setShowSuccess] = useState(false);

  // Hardcoded for the vibe - in a real app these come from a hook/state
  const rate = 0.92;
  const fee = 3.0;
  const receiveAmount = (parseFloat(amount || "0") - fee) * rate;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* 1. Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/app" className="p-2 hover:bg-n-300/20 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-brand-dark" />
        </Link>
        <h1 className="text-2xl font-bold text-brand-dark">Convert Currency</h1>
      </div>

      <div className="space-y-6">
        {/* 2. Conversion Input Section */}
        <Card className="border-none shadow-soft p-8 rounded-brand-card bg-white">
          <div className="space-y-8">
            {/* From Wallet */}
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <p className="text-xs font-bold text-n-500 uppercase tracking-wider">From Wallet</p>
                <div className="flex items-center gap-2 bg-n-100 px-3 py-2 rounded-lg font-bold text-brand-dark">
                  🇺🇸 USD
                </div>
              </div>
              <div className="text-right flex-1 ml-8">
                <p className="text-xs font-bold text-n-500 uppercase tracking-wider mb-1">Amount to Convert</p>
                <div className="relative">
                   <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-mono font-bold text-n-300">$</span>
                   <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-right balance-md border-none focus:ring-0 p-0 placeholder:text-n-300" 
                    placeholder="0.00"
                   />
                </div>
              </div>
            </div>

            {/* Switch Icon Divider */}
            <div className="relative flex justify-center">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-n-100"></div>
               </div>
               <div className="relative w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-blue/30 border-4 border-white cursor-pointer hover:scale-110 transition-transform">
                 <Repeat size={18} />
               </div>
            </div>

            {/* To Wallet */}
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <p className="text-xs font-bold text-n-500 uppercase tracking-wider">To Wallet</p>
                <div className="flex items-center gap-2 bg-n-100 px-3 py-2 rounded-lg font-bold text-brand-dark">
                  🇪🇺 EUR
                </div>
              </div>
              <div className="text-right flex-1">
                <p className="text-xs font-bold text-n-500 uppercase tracking-wider mb-1">You Receive</p>
                <p className="balance-md text-brand-blue">€{receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Rate & Fee Details Section */}
        <Card className="border-none shadow-none bg-n-100/50 p-6 rounded-brand-card">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-n-500 font-medium">Exchange Rate</span>
              <span className="text-brand-dark font-bold">1 USD = {rate} EUR</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-1 text-n-500 font-medium">
                PaySense Fee <Info size={14} className="text-n-300" />
              </span>
              <span className="text-brand-dark font-bold">${fee.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-n-300/30 flex justify-between items-center">
              <span className="text-brand-dark font-bold">Total to Convert</span>
              <span className="balance-md text-brand-dark">${parseFloat(amount || "0").toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* 4. Confirmation Section */}
        <div className="pt-4">
          <Button 
            onClick={() => setShowSuccess(true)}
            disabled={!amount || parseFloat(amount) <= 0}
            className="btn-primary w-full h-14 text-lg shadow-xl shadow-brand-blue/20"
          >
            Confirm Conversion
          </Button>
          <p className="text-center text-[11px] text-n-500 mt-4 leading-relaxed px-10">
            By confirming, you agree to the current exchange rate. Conversions are processed instantly and cannot be reversed.
          </p>
        </div>
      </div>

      {/* 5. Confirmation Modal (Success State) */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-[400px] border-none rounded-brand-card p-0 overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-usd/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-usd" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-brand-dark">Conversion Successful!</DialogTitle>
              <p className="text-n-500">Your EUR wallet has been credited.</p>
            </div>
            
            <div className="bg-n-100 p-4 rounded-xl space-y-2">
               <div className="flex justify-between text-xs font-bold uppercase text-n-500">
                 <span>You Received</span>
                 <span className="text-brand-dark">€{receiveAmount.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xs font-bold uppercase text-n-500">
                 <span>New EUR Balance</span>
                 <span className="text-brand-dark">€9,217.00</span>
               </div>
            </div>

            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="btn-primary w-full h-12"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}