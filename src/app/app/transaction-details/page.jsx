'use client'

import React from "react";
import { 
  Download, 
  Share2, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Copy,
  ReceiptText,
  FileText
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function TransactionDetails({ isOpen, onClose, transaction }) {
  if (!transaction) return null;

  const isCredit = transaction.type === "credit";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            Reference ID: {transaction.id}
          </SheetDescription>
        </SheetHeader>

        {/* 1. AMOUNT & STATUS HERO */}
        <div className="flex flex-col items-center justify-center py-10 space-y-2">
          <div className={isCredit ? "text-emerald-600" : "text-foreground"}>
             <h2 className="text-4xl font-extrabold">
               {isCredit ? "+" : "-"}{transaction.currency}{transaction.amount}
             </h2>
          </div>
          <Badge variant={transaction.status === "Completed" ? "default" : "secondary"} className="rounded-full">
            {transaction.status === "Completed" ? (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            ) : (
              <AlertCircle className="mr-1 h-3 w-3" />
            )}
            {transaction.status}
          </Badge>
        </div>

        <Separator />

        {/* 2. CORE DETAILS LIST */}
        <div className="py-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="text-sm font-medium capitalize">{transaction.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date & Time</span>
            <span className="text-sm font-medium text-right">
              {transaction.date} <br />
              <span className="text-xs text-muted-foreground font-normal">14:30:12 PM</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Merchant / Recipient</span>
            <span className="text-sm font-medium text-right">{transaction.merchant}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Account Used</span>
            <Badge variant="outline" className="font-normal">
              {transaction.accountUsed}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Reference ID</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono">{transaction.id}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* 3. OPTIONAL NOTE SECTION */}
        <div className="py-6 space-y-3">
          <span className="text-sm font-medium">Add Note</span>
          <Textarea 
            placeholder="E.g. Payment for lunch, Rent for January..." 
            className="text-sm resize-none"
          />
          <p className="text-[10px] text-muted-foreground">
            Notes are only visible to you and help you track your spending.
          </p>
        </div>

        {/* 4. ACTIONS */}
        <SheetFooter className="flex-col sm:flex-col gap-2">
          <Button className="w-full gap-2">
            <ReceiptText className="h-4 w-4" /> Download Receipt
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" /> Dispute
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}