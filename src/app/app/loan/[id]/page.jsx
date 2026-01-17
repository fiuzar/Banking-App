// app/dashboard/loans/[id]/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Landmark, Calendar, AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LoanDetailsPage({ params }) {
  const [step, setStep] = useState("details"); // details | repay | success
  
  // Mock data for a USD Loan
  const loan = {
    id: params.id,
    name: "Personal Loan",
    currency: "USD",
    outstanding: "3,450.00",
    nextDue: "Jan 30, 2026",
    amountDue: "420.00",
    interest: "12% APR"
  };

  const wallets = [
    { id: "w1", currency: "USD", balance: "1,200.00", isMatch: true },
    { id: "w2", currency: "EUR", balance: "8,300.00", isMatch: false }
  ];

  if (step === "success") return <SuccessState amount={loan.amountDue} />;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => step === "repay" ? setStep("details") : window.history.back()}>
          <ArrowLeft className="w-6 h-6 text-brand-dark" />
        </Button>
        <h1 className="text-2xl font-bold text-brand-dark">
          {step === "repay" ? "Repay Loan" : "Loan Details"}
        </h1>
      </div>

      {step === "details" ? (
        <div className="space-y-6 animate-in fade-in">
          {/* 3. Loan Summary Card */}
          <Card className="p-8 border-none shadow-soft bg-white rounded-brand-card">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest">Outstanding Balance</p>
                <h2 className="balance-xl text-brand-dark">${loan.outstanding}</h2>
              </div>
              <Badge className="bg-usd/10 text-usd border-none font-bold uppercase text-[10px]">USD Loan</Badge>
            </div>

            <div className="grid grid-cols-2 gap-y-6 border-t border-n-100 pt-6">
              <DataPoint label="Interest Rate" value={loan.interest} />
              <DataPoint label="Next Repayment" value={loan.nextDue} />
              <DataPoint label="Tenure" value="12 Months" />
              <DataPoint label="Status" value="Active" isStatus />
            </div>
          </Card>

          {/* 4. Repayment Schedule (Mini) */}
          <div className="space-y-3">
            <h3 className="font-bold text-brand-dark text-sm px-2">Repayment Schedule</h3>
            <Card className="border-none shadow-soft overflow-hidden rounded-brand-card">
               <ScheduleRow date="Jan 30, 2026" amount="$420.00" status="Pending" />
               <ScheduleRow date="Dec 30, 2025" amount="$420.00" status="Paid" isPaid />
               <ScheduleRow date="Nov 30, 2025" amount="$420.00" status="Paid" isPaid />
            </Card>
          </div>

          <Button onClick={() => setStep("repay")} className="btn-primary w-full h-14 mt-4 shadow-lg shadow-brand-blue/20">
            Make a Repayment
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          {/* 5. Repay Loan Page (The Logic Center) */}
          <div className="space-y-2 px-2">
            <label className="text-xs font-bold text-n-500 uppercase tracking-wider">Select Funding Wallet</label>
            <RadioGroup defaultValue="w1" className="space-y-3">
              {wallets.map((wallet) => (
                <label 
                  key={wallet.id}
                  className={`flex items-center justify-between p-4 rounded-brand-card border-2 transition-all cursor-pointer
                    ${wallet.isMatch ? 'border-n-300 bg-white hover:border-brand-blue' : 'opacity-50 bg-n-100 border-transparent cursor-not-allowed'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={wallet.id} disabled={!wallet.isMatch} className="border-brand-blue text-brand-blue" />
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{wallet.currency} Wallet</p>
                      <p className="text-xs text-n-500">Balance: {wallet.currency === 'USD' ? '$' : '€'}{wallet.balance}</p>
                    </div>
                  </div>
                  {!wallet.isMatch && (
                    <Badge variant="outline" className="text-[9px] border-n-300 text-n-500 uppercase">
                      Currency Mismatch
                    </Badge>
                  )}
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Alert for mismatched wallet */}
          <div className="bg-n-100 p-4 rounded-xl flex gap-3 border border-n-300/30">
            <AlertCircle className="text-brand-blue shrink-0" size={20} />
            <div className="space-y-2">
              <p className="text-xs text-brand-dark font-medium leading-relaxed">
                Repayment must be in **USD**. Need to swap currencies?
              </p>
              <Link href="/dashboard/convert" className="text-[11px] font-bold text-brand-blue flex items-center gap-1 hover:underline">
                <RefreshCcw size={12} /> Convert EUR to USD now
              </Link>
            </div>
          </div>

          <Card className="p-6 bg-white border-none shadow-soft">
             <div className="flex justify-between items-center mb-4">
               <span className="text-sm font-bold text-n-500">Repayment Amount</span>
               <span className="balance-md text-brand-dark">${loan.amountDue}</span>
             </div>
             <Button onClick={() => setStep("success")} className="btn-primary w-full h-12">
               Confirm Repayment
             </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

// --- Internal UI Components ---

function DataPoint({ label, value, isStatus }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-n-500 uppercase tracking-wider">{label}</p>
      {isStatus ? (
        <Badge className="bg-usd/10 text-usd border-none text-[10px] h-5 mt-1">{value}</Badge>
      ) : (
        <p className="text-sm font-bold text-brand-dark mt-1">{value}</p>
      )}
    </div>
  );
}

function ScheduleRow({ date, amount, status, isPaid }) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-n-100 last:border-none">
      <div className="flex items-center gap-3">
        <Calendar size={16} className="text-n-300" />
        <span className="text-sm font-medium text-brand-dark">{date}</span>
      </div>
      <div className="text-right">
        <p className={`text-sm font-mono font-bold ${isPaid ? 'text-n-300 line-through' : 'text-brand-dark'}`}>{amount}</p>
        <p className={`text-[9px] font-bold uppercase ${isPaid ? 'text-usd' : 'text-bank-warning'}`}>{status}</p>
      </div>
    </div>
  );
}

function SuccessState({ amount }) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-20 animate-in fade-in zoom-in-95">
      <div className="w-20 h-20 bg-usd/10 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-usd" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-brand-dark">Repayment Successful!</h2>
        <p className="text-n-500 mt-2">We&apos;ve processed your repayment of ${amount}.</p>
      </div>
      <Button asChild className="btn-primary w-full h-14 shadow-xl">
        <Link href="/dashboard/loans">Back to Loans Hub</Link>
      </Button>
    </div>
  );
}