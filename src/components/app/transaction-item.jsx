import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function TransactionItem({ title, date, amount, currency, type }) {
  const isCredit = type === "credit";

  return (
    <div className="flex items-center justify-between group hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center",
          isCredit ? "bg-emerald-50 text-green-600" : "bg-slate-100 text-red-600"
        )}>
          {isCredit ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-white hover:text-black">{title}</p>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className={cn(
          "text-sm font-bold",
          isCredit ? "text-emerald-600" : "text-red-600"
        )}>
          {amount}
        </p>
        <div className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">
          {currency}
        </div>
      </div>
    </div>
  );
}