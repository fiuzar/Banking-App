import React from "react";
import { 
  ArrowLeft, Copy, Eye, Info, Send, 
  ArrowDownLeft, ArrowRightLeft, Banknote, 
  Download, ShieldCheck, Search, Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TransactionItem } from "@/components/app/transaction-item";

export default function AccountDetailsPage() {
  // In a real app, you'd fetch based on params.id (USD, EUR, etc.)
  const walletType = "USD"; 
  const isUSD = walletType === "USD";

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      
      {/* 1. HEADER (Context Anchor) */}
      <header className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30 py-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{walletType} Wallet</h1>
            <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2" />
              Active
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Available Balance</span>
            <Eye className="h-3 w-3 cursor-pointer" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {isUSD ? "$" : "€"}12,450.00
          </h2>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Banking Details & Actions */}
        <div className="md:col-span-1 space-y-6">
          
          {/* 2. ACCOUNT INFO CARD */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-600" /> Banking Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Account Number</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono">1234567890</span>
                  <Copy className="h-3 w-3 text-slate-400 cursor-pointer hover:text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">IBAN</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono truncate mr-2">DE89 3704 0044 0532...</span>
                  <Copy className="h-3 w-3 text-slate-400 cursor-pointer hover:text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">SWIFT / BIC</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono">BOFAUS3N</span>
                  <Copy className="h-3 w-3 text-slate-400 cursor-pointer hover:text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. PRIMARY ACTIONS */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 gap-2 h-12">
              <Send className="h-4 w-4" /> Send
            </Button>
            <Button variant="outline" className="w-full gap-2 h-12">
              <ArrowDownLeft className="h-4 w-4" /> Receive
            </Button>
            <Button variant="outline" className="w-full gap-2 h-12">
              <ArrowRightLeft className="h-4 w-4" /> Convert
            </Button>
            <Button variant="outline" className="w-full gap-2 h-12">
              <Banknote className="h-4 w-4" /> Withdraw
            </Button>
          </div>

          {/* 4. ACTIVITY SUMMARY */}
          <Card className="border-none bg-slate-50">
            <CardContent className="p-4 space-y-4">
              <p className="text-xs font-bold uppercase text-slate-400">This Month</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Incoming</span>
                <span className="text-sm font-bold text-emerald-600">+$8,200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Outgoing</span>
                <span className="text-sm font-bold text-slate-900">-$5,100.00</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">FX Conversions</span>
                <span className="text-sm font-bold">2</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Transactions List */}
        <div className="md:col-span-2 space-y-6">
          <Card className="min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-lg">Wallet Activity</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* Specific Wallet Filter: Only USD items here */}
                <TransactionItem title="Amazon Web Services" date="Jan 12, 2026" amount="-120.00" currency="USD" type="debit" />
                <TransactionItem title="FX Conversion (USD → EUR)" date="Jan 10, 2026" amount="-1,000.00" currency="USD" type="debit" />
                <TransactionItem title="Salary Deposit" date="Jan 05, 2026" amount="+4,200.00" currency="USD" type="credit" />
                <TransactionItem title="Stripe Payout" date="Jan 02, 2026" amount="+2,500.00" currency="USD" type="credit" />
              </div>
              
              <div className="mt-10 flex justify-center">
                <Button variant="outline" className="text-xs gap-2">
                  <Download className="h-3 w-3" /> Download Statement (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[10px] font-medium uppercase tracking-widest">End-to-end encrypted activity</p>
          </div>
        </div>

      </div>
    </div>
  );
}