// components/dashboard/WalletCard.tsx
import { ArrowUpRight, ArrowDownLeft, RefreshCcw, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletCard({ currency, balance, pending }) {
  const isUSD = currency === "USD";
  const symbol = isUSD ? "$" : "€";
  const accentColor = isUSD ? "border-usd" : "border-eur";

  return (
    <div className={`bg-white rounded-brand-card p-6 border-l-4 ${accentColor} shadow-soft`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold text-n-500 uppercase tracking-wider">{currency} Wallet</p>
          <h2 className="balance-xl mt-1">{symbol}{balance}</h2>
          {pending && (
            <p className="text-[11px] text-n-500 font-medium mt-1">
              Pending: {symbol}{pending}
            </p>
          )}
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold ${isUSD ? 'bg-usd/10 text-usd' : 'bg-eur/10 text-eur'}`}>
          {currency}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-6">
        <ActionButton icon={<ArrowUpRight size={18} />} label="Send" />
        <ActionButton icon={<ArrowDownLeft size={18} />} label="Receive" />
        <ActionButton icon={<RefreshCcw size={18} />} label="Convert" />
        <ActionButton icon={<Landmark size={18} />} label="Withdraw" />
      </div>
    </div>
  );
}

function ActionButton({ icon, label }) {
  return (
    <button className="flex flex-col items-center gap-1 group">
      <div className="w-10 h-10 rounded-full bg-n-100 flex items-center justify-center text-brand-dark group-hover:bg-brand-blue group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-[11px] font-bold text-n-500">{label}</span>
    </button>
  );
}