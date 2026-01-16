import React, { useState } from "react";
import { 
  ArrowLeft, Search, Info, AlertCircle, 
  CheckCircle2, ArrowRight, Wallet, User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function SendMoneyPage() {
  const [senderCurrency, setSenderCurrency] = useState("USD");
  const [recipientCurrency, setRecipientCurrency] = useState("EUR");
  const [consentGiven, setConsentGiven] = useState(false);

  const needsConversion = senderCurrency !== recipientCurrency;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-2xl mx-auto w-full">
      
      {/* 1. HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Send Money</h1>
      </div>

      <div className="space-y-8">
        
        {/* 2. SENDER WALLET SELECTION */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">From Wallet</Label>
          <Select defaultValue="usd" onValueChange={setSenderCurrency}>
            <SelectTrigger className="h-14 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-md text-purple-700">
                  <Wallet className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">USD Wallet</p>
                  <p className="text-xs text-muted-foreground mt-1">Balance: $12,450.00</p>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD Wallet ($12,450.00)</SelectItem>
              <SelectItem value="eur">EUR Wallet (€1,205.50)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. RECIPIENT SECTION */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Recipient</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search name, IBAN, email, or phone" 
              className="h-12 pl-10 border-slate-200"
            />
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-sm font-medium">Maria Rossi</p>
            </div>
            <div className="text-[10px] font-bold uppercase text-slate-400 bg-white px-2 py-1 rounded border">
              Recipient Currency: {recipientCurrency}
            </div>
          </div>
        </div>

        {/* 4 & 5. CURRENCY & AMOUNT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Send Currency</Label>
            <div className="flex gap-2">
              {["USD", "EUR", "GBP"].map((curr) => (
                <Button
                  key={curr}
                  variant={recipientCurrency === curr ? "default" : "outline"}
                  className={recipientCurrency === curr ? "bg-purple-600 flex-1" : "flex-1"}
                  onClick={() => setRecipientCurrency(curr)}
                >
                  {curr}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                {recipientCurrency === "USD" ? "$" : recipientCurrency === "EUR" ? "€" : "£"}
              </span>
              <Input type="number" defaultValue="1000.00" className="h-10 pl-8 font-bold text-lg" />
            </div>
          </div>
        </div>

        {/* 7. FX CONVERSION PREVIEW (Conditional) */}
        {needsConversion && (
          <Card className="border-purple-100 bg-purple-50/30 overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Conversion Preview</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">$1,000.00 USD</span>
                    <ArrowRight className="h-4 w-4 text-purple-400" />
                    <span className="text-lg font-bold text-emerald-600">€920.00 EUR</span>
                  </div>
                </div>
              </div>
              <Separator className="bg-purple-100" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Exchange Rate</p>
                  <p className="font-semibold">1 USD = 0.92 EUR</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs">Conversion Fee</p>
                  <p className="font-semibold text-purple-600">$3.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 8. EXPLICIT CONSENT */}
        {needsConversion && (
          <div className="flex items-start space-x-3 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
            <Checkbox 
              id="consent" 
              checked={consentGiven} 
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-xs text-amber-900 leading-relaxed cursor-pointer">
              I understand and approve this currency conversion based on the rate and fees shown above.
            </Label>
          </div>
        )}

        {/* 9. REVIEW BUTTON */}
        <Button 
          disabled={needsConversion && !consentGiven}
          className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100 disabled:bg-slate-200"
        >
          Review Transfer
        </Button>
      </div>
    </div>
  );
}