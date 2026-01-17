import { Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FXWidget() {
  return (
    <div className="bg-brand-dark rounded-brand-card p-6 text-white shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-n-300">Quick Convert</h3>
        <span className="text-[10px] bg-white/10 px-2 py-1 rounded">Live Rate: 1 USD = 0.92 EUR</span>
      </div>
      
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-brand-input border border-white/10">
        <div className="flex-1">
          <p className="text-[10px] text-n-300 font-bold uppercase">From USD</p>
          <input className="bg-transparent border-none outline-none balance-md w-full" placeholder="0.00" />
        </div>
        <Repeat className="text-brand-blue" size={20} />
        <div className="flex-1 text-right">
          <p className="text-[10px] text-n-300 font-bold uppercase">To EUR</p>
          <p className="balance-md text-n-100">€0.00</p>
        </div>
      </div>

      <Button className="btn-primary w-full mt-6 bg-brand-blue hover:bg-brand-blue/90 h-12">
        Review Conversion
      </Button>
    </div>
  );
}