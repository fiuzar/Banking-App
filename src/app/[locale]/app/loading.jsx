import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-sm z-50">
      <div className="relative flex items-center justify-center">
        {/* Outer subtle ring */}
        <div className="absolute w-16 h-16 border-4 border-primary/10 rounded-full"></div>
        
        {/* The Spinning Icon */}
        <Loader2 
          className="text-primary animate-spin" 
          size={40} 
          strokeWidth={2.5} 
        />
      </div>
      
      {/* Optional Brand Text */}
      <p className="mt-4 text-xs font-bold text-n-400 uppercase tracking-[0.2em] animate-pulse">
        Securing Connection...
      </p>
    </div>
  );
}