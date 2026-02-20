"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Share2, Download, ExternalLink, RefreshCcw, Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/messages/LanguageProvider";

export default function TransactionDetails({ params }) {
  const { t } = useLanguage();
  const isFX = true; // FX Conversion example

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/history" className="p-2 hover:bg-n-300/20 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-brand-dark" />
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-n-500">
            <Share2 size={20} /> {t("TransactionDetails", "actions.share")}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-n-500">
            <Download size={20} /> {t("TransactionDetails", "actions.download")}
          </Button>
        </div>
      </div>

      <div className="space-y-6 flex flex-col items-center">
        {/* 2. Status & Hero Amount */}
        <div className="text-center space-y-4 w-full">
          <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
            {isFX ? <RefreshCcw size={32} /> : <Landmark size={32} />}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-mono font-bold text-brand-dark">-$1,000.00</h1>
            <p className="text-sm font-bold text-n-500 uppercase tracking-widest">USD Wallet</p>
          </div>
          <Badge className="bg-usd/10 text-usd border-none px-4 py-1">
            {t("TransactionDetails", "labels.status.completed")}
          </Badge>
        </div>

        {/* 3. The Details Card */}
        <Card className="w-full border-none shadow-soft rounded-brand-card overflow-hidden bg-white">
          <div className="p-8 space-y-6">
            {/* Context Section */}
            <div className="space-y-4">
              <DetailRow label={t("TransactionDetails", "labels.type")} value="FX Conversion" />
              <DetailRow label={t("TransactionDetails", "labels.date")} value="Jan 11, 2026 • 14:32" />
              <DetailRow label={t("TransactionDetails", "referenceId")} value="PS-9920-X12B" isCopyable />
              <DetailRow label={t("TransactionDetails", "labels.merchant")} value="Self (EUR Wallet)" />
            </div>

            {/* FX Pair Logic */}
            {isFX && (
              <div className="bg-n-100 rounded-xl p-6 space-y-4 border border-n-300/30">
                <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest">
                  Conversion Details
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-xs text-n-500">You Sold</p>
                    <p className="font-mono font-bold text-brand-dark">$1,000.00</p>
                  </div>
                  <div className="h-px flex-1 bg-n-300 mx-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-n-100 px-2 text-brand-blue">
                      <RefreshCcw size={14} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-n-500">You Received</p>
                    <p className="font-mono font-bold text-brand-blue">€917.00</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-n-300/30 flex justify-between text-[11px] font-bold text-n-500">
                  <span>Rate: 1 USD = 0.92 EUR</span>
                  <span>Fee: $3.00</span>
                </div>
              </div>
            )}

            <DetailRow label={t("TransactionDetails", "labels.account")} value="Internal PaySense Transfer" />
          </div>

          {/* Footer Actions */}
          <div className="bg-n-100/50 p-6 flex flex-col gap-3 border-t border-n-100">
            <Button variant="outline" className="w-full h-12 font-bold border-n-300 text-brand-dark gap-2">
              <ExternalLink size={16} /> {t("TransactionDetails", "actions.download")}
            </Button>
            <button className="text-xs font-bold text-bank-error hover:underline py-2">
              {t("TransactionDetails", "actions.dispute")}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- Internal Helper ---
function DetailRow({ label, value, isCopyable }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-n-500 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-dark font-bold text-right max-w-[200px]">{value}</span>
        {isCopyable && (
          <button className="text-n-300 hover:text-brand-blue transition-colors">
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
