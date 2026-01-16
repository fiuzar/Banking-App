import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AccountCard({ type, balance, currency, color, trend, isPrimary }) {
  return (
    <Card className={cn(
      "w-[280px] h-[180px] border-none shadow-lg overflow-hidden relative transition-all cursor-pointer hover:shadow-xl",
      color,
      !isPrimary && "text-slate-900" 
    )}>
      <CardContent className="p-6 flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
            {currency}
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", isPrimary ? "text-white/60" : "text-slate-400")}>
            {type}
          </span>
        </div>

        <div>
          <h3 className={cn("text-3xl font-bold tracking-tight", isPrimary ? "text-white" : "text-slate-900")}>
            {balance}
          </h3>
          <p className={cn("text-[10px] mt-1 font-medium", isPrimary ? "text-emerald-400" : "text-emerald-600")}>
            ↑ 2.4% this week
          </p>
        </div>
      </CardContent>
      
      {/* Abstract Background for Premium Feel */}
      <div className="absolute right-0 bottom-0 opacity-20 translate-x-4 translate-y-4">
        {currency}
      </div>
    </Card>
  );
}