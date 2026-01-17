// 'use client'

// import React, { useState } from "react";
// import { 
//   ArrowLeft, Search, Info, AlertCircle, 
//   CheckCircle2, ArrowRight, Wallet, User 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { 
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Separator } from "@/components/ui/separator";

// export default function SendMoneyPage() {
//   const [senderCurrency, setSenderCurrency] = useState("USD");
//   const [recipientCurrency, setRecipientCurrency] = useState("EUR");
//   const [consentGiven, setConsentGiven] = useState(false);

//   const needsConversion = senderCurrency !== recipientCurrency;

//   return (
//     <div className="flex flex-col gap-8 p-6 md:p-10 max-w-2xl mx-auto w-full">
      
//       {/* 1. HEADER */}
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <h1 className="text-2xl font-bold tracking-tight">Send Money</h1>
//       </div>

//       <div className="space-y-8">
        
//         {/* 2. SENDER WALLET SELECTION */}
//         <div className="space-y-3">
//           <Label className="text-sm font-semibold">From Wallet</Label>
//           <Select defaultValue="usd" onValueChange={setSenderCurrency}>
//             <SelectTrigger className="h-14 border-slate-200 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-purple-100 rounded-md text-purple-700">
//                   <Wallet className="h-4 w-4" />
//                 </div>
//                 <div className="text-left">
//                   <p className="text-sm font-bold leading-none">USD Wallet</p>
//                   <p className="text-xs text-muted-foreground mt-1">Balance: $12,450.00</p>
//                 </div>
//               </div>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="usd">USD Wallet ($12,450.00)</SelectItem>
//               <SelectItem value="eur">EUR Wallet (€1,205.50)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* 3. RECIPIENT SECTION */}
//         <div className="space-y-3">
//           <Label className="text-sm font-semibold">Recipient</Label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input 
//               placeholder="Search name, IBAN, email, or phone" 
//               className="h-12 pl-10 border-slate-200"
//             />
//           </div>
//           <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
//                 <User className="h-4 w-4 text-slate-500" />
//               </div>
//               <p className="text-sm font-medium">Maria Rossi</p>
//             </div>
//             <div className="text-[10px] font-bold uppercase text-slate-400 bg-white px-2 py-1 rounded border">
//               Recipient Currency: {recipientCurrency}
//             </div>
//           </div>
//         </div>

//         {/* 4 & 5. CURRENCY & AMOUNT */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-3">
//             <Label className="text-sm font-semibold">Send Currency</Label>
//             <div className="flex gap-2">
//               {["USD", "EUR", "GBP"].map((curr) => (
//                 <Button
//                   key={curr}
//                   variant={recipientCurrency === curr ? "default" : "outline"}
//                   className={recipientCurrency === curr ? "bg-purple-600 flex-1" : "flex-1"}
//                   onClick={() => setRecipientCurrency(curr)}
//                 >
//                   {curr}
//                 </Button>
//               ))}
//             </div>
//           </div>
//           <div className="space-y-3">
//             <Label className="text-sm font-semibold">Amount</Label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
//                 {recipientCurrency === "USD" ? "$" : recipientCurrency === "EUR" ? "€" : "£"}
//               </span>
//               <Input type="number" defaultValue="1000.00" className="h-10 pl-8 font-bold text-lg" />
//             </div>
//           </div>
//         </div>

//         {/* 7. FX CONVERSION PREVIEW (Conditional) */}
//         {needsConversion && (
//           <Card className="border-purple-100 bg-purple-50/30 overflow-hidden">
//             <CardContent className="p-5 space-y-4">
//               <div className="flex justify-between items-start">
//                 <div className="space-y-1">
//                   <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Conversion Preview</p>
//                   <div className="flex items-center gap-2">
//                     <span className="text-lg font-bold text-slate-900">$1,000.00 USD</span>
//                     <ArrowRight className="h-4 w-4 text-purple-400" />
//                     <span className="text-lg font-bold text-emerald-600">€920.00 EUR</span>
//                   </div>
//                 </div>
//               </div>
//               <Separator className="bg-purple-100" />
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-slate-500 text-xs">Exchange Rate</p>
//                   <p className="font-semibold">1 USD = 0.92 EUR</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-slate-500 text-xs">Conversion Fee</p>
//                   <p className="font-semibold text-purple-600">$3.00</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* 8. EXPLICIT CONSENT */}
//         {needsConversion && (
//           <div className="flex items-start space-x-3 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
//             <Checkbox 
//               id="consent" 
//               checked={consentGiven} 
//               onCheckedChange={(checked) => setConsentGiven(checked === true)}
//               className="mt-1"
//             />
//             <Label htmlFor="consent" className="text-xs text-amber-900 leading-relaxed cursor-pointer">
//               I understand and approve this currency conversion based on the rate and fees shown above.
//             </Label>
//           </div>
//         )}

//         {/* 9. REVIEW BUTTON */}
//         <Button 
//           disabled={needsConversion && !consentGiven}
//           className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100 disabled:bg-slate-200"
//         >
//           Review Transfer
//         </Button>
//       </div>
//     </div>
//   );
// }

// app/dashboard/transfers/send/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Info, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function SendMoneyPage() {
  const [step, setStep] = useState(1); // 1: Entry, 2: Review, 3: Success
  const [senderWallet, setSenderWallet] = useState("USD");
  const [recipientCurrency, setRecipientCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [consent, setConsent] = useState(false);

  const isFXRequired = senderWallet !== recipientCurrency;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* 1. Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 hover:bg-n-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-brand-dark" />
        </Link>
        <h1 className="text-2xl font-bold text-brand-dark">Send Money</h1>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* 2. Sender Wallet Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-n-500 uppercase tracking-wider">From Wallet</label>
            <div className="flex items-center justify-between p-4 bg-white border border-n-300 rounded-brand-card shadow-sm cursor-pointer hover:border-brand-blue transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${senderWallet === 'USD' ? 'bg-usd/10 text-usd' : 'bg-eur/10 text-eur'}`}>
                  {senderWallet}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">{senderWallet} Wallet</p>
                  <p className="text-xs text-n-500">Balance: {senderWallet === 'USD' ? '$12,450.00' : '€8,300.00'}</p>
                </div>
              </div>
              <ChevronDown className="text-n-300" size={20} />
            </div>
          </div>

          {/* 3. Recipient Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Recipient</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-n-300" size={18} />
              <Input 
                className="input-field pl-12 h-14" 
                placeholder="Search name, IBAN, email, or phone" 
              />
            </div>
          </div>

          {/* 4. Amount & Currency Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-n-500">
                  {senderWallet === 'USD' ? '$' : '€'}
                </span>
                <Input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-8 h-14 balance-md" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Send Currency</label>
              <div className="flex gap-2 p-1 bg-n-100 rounded-brand-button h-14">
                <button 
                  onClick={() => setRecipientCurrency("USD")}
                  className={`flex-1 rounded-brand-button text-sm font-bold transition-all ${recipientCurrency === "USD" ? "bg-white text-brand-blue shadow-sm" : "text-n-500"}`}
                >
                  USD
                </button>
                <button 
                  onClick={() => setRecipientCurrency("EUR")}
                  className={`flex-1 rounded-brand-button text-sm font-bold transition-all ${recipientCurrency === "EUR" ? "bg-white text-brand-blue shadow-sm" : "text-n-500"}`}
                >
                  EUR
                </button>
              </div>
            </div>
          </div>

          {/* 7. FX Conversion Preview (Conditional) */}
          {isFXRequired && amount && (
            <Card className="border-none bg-brand-blue/5 p-6 rounded-brand-card space-y-4 border-l-4 border-brand-blue">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Currency Conversion</h3>
                <Badge variant="outline" className="bg-white border-brand-blue/20 text-brand-blue">Live Rate</Badge>
              </div>
              <div className="space-y-2 border-b border-brand-blue/10 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-n-500">You are sending</span>
                  <span className="font-bold text-brand-dark">${amount} (USD)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-n-500">Recipient receives</span>
                  <span className="font-bold text-brand-blue text-lg">€{(parseFloat(amount) * 0.92).toFixed(2)} (EUR)</span>
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-n-500 uppercase">
                <span>Rate: 1 USD = 0.92 EUR</span>
                <span>Fee: $3.00</span>
              </div>

              {/* 8. Explicit Consent */}
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox 
                  id="consent" 
                  checked={consent} 
                  onCheckedChange={(checked) => setConsent(!!checked)}
                  className="border-brand-blue data-[state=checked]:bg-brand-blue" 
                />
                <label htmlFor="consent" className="text-xs text-brand-dark font-medium cursor-pointer leading-tight">
                  I understand and approve this currency conversion and the associated fees.
                </label>
              </div>
            </Card>
          )}

          <Button 
            disabled={!amount || (isFXRequired && !consent)}
            onClick={() => setStep(2)}
            className="btn-primary w-full h-14 text-lg mt-4 shadow-lg shadow-brand-blue/20"
          >
            Review Transfer
          </Button>
        </div>
      )}

      {/* 10. Confirmation Gate */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in zoom-in-95">
          <Card className="p-8 border-none shadow-soft space-y-8 bg-white rounded-brand-card">
            <div className="text-center space-y-2">
              <p className="text-xs font-bold text-n-500 uppercase tracking-widest">You are sending</p>
              <h2 className="balance-xl text-brand-dark">${amount}.00</h2>
            </div>

            <div className="space-y-4 border-t border-b border-n-100 py-6">
              <SummaryItem label="From" value="USD Wallet" />
              <SummaryItem label="To" value="Maria Rossi (EUR)" />
              <SummaryItem label="Recipient Gets" value={`€${(parseFloat(amount) * 0.92).toFixed(2)}`} />
              <SummaryItem label="Exchange Rate" value="1 USD = 0.92 EUR" />
              <SummaryItem label="Fee" value="$3.00" />
            </div>

            <div className="bg-bank-warning/10 p-4 rounded-lg flex gap-3">
              <AlertCircle className="text-bank-warning shrink-0" size={20} />
              <p className="text-[11px] text-bank-warning font-medium leading-relaxed">
                Exchange rates are final for this transaction. This payment will be processed immediately.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={() => setStep(3)} className="btn-primary w-full h-14">Confirm & Send</Button>
              <Button onClick={() => setStep(1)} variant="ghost" className="w-full text-n-500 font-bold">Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {/* 11. Success State */}
      {step === 3 && (
        <div className="text-center space-y-6 py-12 animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 bg-usd/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-usd" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-brand-dark">Transfer Sent!</h2>
            <p className="text-n-500 mt-2">We’ve sent ${amount}.00 to Maria Rossi.</p>
          </div>
          <Card className="p-4 bg-n-100/50 border-none max-w-xs mx-auto">
             <p className="text-[10px] text-n-500 uppercase font-bold">Transaction Ref</p>
             <p className="text-sm font-mono font-bold text-brand-dark">PS-9920-X12B</p>
          </Card>
          <div className="pt-8 space-y-3">
            <Button onClick={() => window.location.href='/dashboard'} className="btn-primary w-full h-14">Back to Dashboard</Button>
            <Button variant="outline" className="w-full h-14 font-bold border-n-300">View Receipt</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-n-500 font-medium">{label}</span>
      <span className="text-sm text-brand-dark font-bold">{value}</span>
    </div>
  );
}

function Badge({ children, variant, className }) {
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${className}`}>{children}</span>;
}