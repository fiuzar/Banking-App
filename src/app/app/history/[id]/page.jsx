import React from "react";
import { 
  ArrowLeft, Download, Share2, Copy, 
  ExternalLink, CheckCircle2, RefreshCcw, 
  HelpCircle, FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function TransactionReceiptPage() {
  // Logic check: Is this an FX Conversion or a Standard Payment?
  const isFX = true; 

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-2xl mx-auto w-full">
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-400">Transaction Receipt</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* 2. MAIN STATUS & AMOUNT HERO */}
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900">
            {isFX ? "-$1,000.00" : "-€120.00"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">Amazon Web Services</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-1">
          Completed
        </Badge>
      </div>

      {/* 3. TRANSACTION DATA CARD */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 space-y-6">
            
            {/* CONDITIONAL FX SECTION */}
            {isFX && (
              <div className="bg-purple-50 p-4 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase">
                  <RefreshCcw className="h-3 w-3" /> Currency Conversion
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-purple-400 font-bold uppercase">Sent (USD)</p>
                    <p className="text-lg font-bold text-slate-900">$1,000.00</p>
                  </div>
                  <div className="h-px flex-1 bg-purple-200 mx-4 mb-2 border-dotted border-t-2" />
                  <div className="text-right">
                    <p className="text-[10px] text-purple-400 font-bold uppercase">Received (EUR)</p>
                    <p className="text-lg font-bold text-emerald-600">€917.45</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-purple-100">
                  <span className="text-purple-700">Exchange Rate</span>
                  <span className="font-bold text-purple-900">1 USD = 0.91745 EUR</span>
                </div>
              </div>
            )}

            {/* STANDARD DETAILS */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Date & Time</span>
                <span className="text-sm font-semibold text-slate-900">Jan 15, 2026 • 12:40 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Payment Method</span>
                <span className="text-sm font-semibold text-slate-900">USD Wallet (..4290)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-900">TXN-882910029X</span>
                  <Copy className="h-3 w-3 text-slate-400 cursor-pointer" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Merchant Reference</span>
                <span className="text-sm font-semibold text-slate-900">AWS-INV-2026-01</span>
              </div>
            </div>

            <Separator />

            {/* OPTIONAL NOTE */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note</span>
              <p className="text-sm text-slate-600 italic">&quot;Server hosting fees for Q1 expansion&quot;</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="h-12 gap-2 border-slate-200 shadow-sm">
          <FileText className="h-4 w-4" /> Download PDF Receipt
        </Button>
        <Button variant="outline" className="h-12 gap-2 border-slate-200 shadow-sm text-red-600 hover:text-red-700 hover:bg-red-50">
          <HelpCircle className="h-4 w-4" /> Dispute Transaction
        </Button>
      </div>

      <p className="text-[10px] text-center text-slate-400 px-10">
        This is an official transaction record. If you have questions, please reference the Transaction ID above when contacting support.
      </p>
    </div>
  );
}