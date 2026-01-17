// app/dashboard/loans/apply/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Info, Calculator, Landmark, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoanApplicationFlow() {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState(null);
  const [amount, setAmount] = useState("1000");

  const monthlyRepayment = (parseFloat(amount || "0") * 1.12) / 12;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step >= s ? 'bg-brand-blue text-white' : 'bg-n-300/30 text-n-500'}`}>
              {s}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Currency Selection */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-brand-dark">Select Loan Currency</h1>
            <p className="text-n-500 text-sm">Choose the wallet where you want to receive funds.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CurrencyOption 
              selected={currency === "USD"} 
              onClick={() => setCurrency("USD")} 
              label="US Dollar" 
              code="USD" 
              flag="🇺🇸" 
            />
            <CurrencyOption 
              selected={currency === "EUR"} 
              onClick={() => setCurrency("EUR")} 
              label="Euro" 
              code="EUR" 
              flag="🇪🇺" 
            />
          </div>

          <Card className="p-4 bg-bank-warning/5 border-none flex gap-3">
            <Info className="text-bank-warning shrink-0" size={20} />
            <p className="text-xs text-bank-warning font-medium leading-relaxed">
              <strong>Important:</strong> Your selection is final. If you choose USD, you must repay the loan using your USD wallet. Cross-currency repayment is not supported.
            </p>
          </Card>

          <Button 
            disabled={!currency} 
            onClick={() => setStep(2)} 
            className="btn-primary w-full h-14 mt-4"
          >
            Continue to Calculator
          </Button>
        </div>
      )}

      {/* Step 2: Amount & Calculator */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => setStep(1)}><ArrowLeft /></Button>
            <h1 className="text-xl font-bold text-brand-dark">Loan Calculator ({currency})</h1>
          </div>

          <Card className="p-8 border-none shadow-soft space-y-8 bg-white">
            <div className="space-y-2">
              <label className="text-xs font-bold text-n-500 uppercase tracking-widest">How much do you need?</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-mono font-bold text-n-300">
                  {currency === "USD" ? "$" : "€"}
                </span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-right balance-lg border-none focus:ring-0 p-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-n-100">
              <div>
                <p className="text-[10px] font-bold text-n-500 uppercase">Monthly Pay</p>
                <p className="text-lg font-mono font-bold text-brand-blue">
                  {currency === "USD" ? "$" : "€"}{monthlyRepayment.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-n-500 uppercase">Interest Rate</p>
                <p className="text-lg font-bold text-brand-dark">12.0% APR</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <ShieldCheck className="text-usd" size={18} />
              <p className="text-xs text-n-500">No hidden charges. No early repayment fees.</p>
            </div>
            <Button onClick={() => setStep(3)} className="btn-primary w-full h-14">
              Review & Accept Offer
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Final Review & Acceptance */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-brand-dark">Final Review</h1>
            <p className="text-n-500 text-sm">Please confirm your loan details below.</p>
          </div>

          <Card className="divide-y divide-n-100 border-none shadow-soft bg-white">
            <ReviewRow label="Loan Amount" value={`${currency === "USD" ? "$" : "€"}${amount}`} />
            <ReviewRow label="Currency" value={currency === "USD" ? "US Dollar" : "Euro"} />
            <ReviewRow label="Tenure" value="12 Months" />
            <ReviewRow label="Disbursement Wallet" value={`${currency} Wallet`} />
          </Card>

          <div className="bg-n-100 p-6 rounded-brand-card">
            <p className="text-xs text-n-500 leading-relaxed italic">
              &ldquo;I hereby authorize PaySense to disburse the sum of {currency === "USD" ? "$" : "€"}{amount} into my {currency} wallet and agree to the repayment schedule provided.&ldquo;
            </p>
          </div>

          <Button onClick={() => window.location.href='/dashboard/loans'} className="btn-primary w-full h-14 shadow-xl shadow-brand-blue/20">
            Accept & Receive Funds
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Internal UI Components ---

function CurrencyOption({ selected, onClick, label, code, flag }) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-brand-card border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${selected ? 'border-brand-blue bg-brand-blue/5' : 'border-n-100 bg-white hover:border-n-300'}`}
    >
      <span className="text-3xl">{flag}</span>
      <div className="text-center">
        <p className={`font-bold ${selected ? 'text-brand-blue' : 'text-brand-dark'}`}>{code}</p>
        <p className="text-[10px] text-n-500 font-bold uppercase">{label}</p>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between p-5 text-sm">
      <span className="text-n-500 font-medium">{label}</span>
      <span className="text-brand-dark font-bold">{value}</span>
    </div>
  );
}