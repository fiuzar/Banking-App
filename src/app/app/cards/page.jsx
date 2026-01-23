'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Snowflake, 
  Settings, 
  Lock, 
  ShieldCheck,
  CreditCard as CardIcon,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

export default function VirtualCardPage() {
  const [showDetails, setShowDetails] = useState(false)
  const [isFrozen, setIsFrozen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app"><ArrowLeft size={24} /></Link>
          <h1 className="text-xl font-bold">My Card</h1>
        </div>
        <Settings size={20} className="opacity-60" />
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        
        {/* The Virtual Card Visual */}
        <div className={`relative aspect-[1.58/1] w-full rounded-[24px] p-8 text-white overflow-hidden transition-all duration-500 shadow-2xl ${isFrozen ? 'grayscale contrast-75' : 'bg-gradient-to-br from-brand-dark via-slate-900 to-primary'}`}>
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-[1px]" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="text-xl font-black italic tracking-tighter italic">Paysense</span>
                    <CardIcon className="opacity-80" size={24} />
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-bold">Card Number</p>
                    <p className="text-xl font-mono tracking-widest">
                        {showDetails ? "4412 8892 1002 4456" : "•••• •••• •••• 4456"}
                    </p>
                </div>

                <div className="flex gap-12">
                    <div>
                        <p className="text-[8px] uppercase opacity-50 font-bold">Expiry</p>
                        <p className="text-sm font-bold">{showDetails ? "12/28" : "••/••"}</p>
                    </div>
                    <div>
                        <p className="text-[8px] uppercase opacity-50 font-bold">CVV</p>
                        <p className="text-sm font-bold">{showDetails ? "882" : "•••"}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <img src="https://flagcdn.com/w20/us.png" className="rounded-sm opacity-80" alt="USD" />
                        <span className="text-[10px] font-bold">USD</span>
                    </div>
                </div>
            </div>

            {isFrozen && (
                <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30">
                        <Snowflake size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Frozen</span>
                    </div>
                </div>
            )}
        </div>

        {/* Quick Actions Bar */}
        <div className="flex justify-around bg-white p-4 rounded-3xl shadow-sm border border-border">
            <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex flex-col items-center gap-2 group"
            >
                <div className="p-3 bg-secondary rounded-full text-primary group-active:scale-90 transition-all">
                    {showDetails ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
                <span className="text-[10px] font-bold text-n-500 uppercase">{showDetails ? 'Hide' : 'Reveal'}</span>
            </button>

            <button 
                onClick={() => setIsFrozen(!isFrozen)}
                className="flex flex-col items-center gap-2 group"
            >
                <div className={`p-3 rounded-full transition-all group-active:scale-90 ${isFrozen ? 'bg-primary text-white' : 'bg-secondary text-primary'}`}>
                    <Snowflake size={20} />
                </div>
                <span className="text-[10px] font-bold text-n-500 uppercase">{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
            </button>

            <button className="flex flex-col items-center gap-2 group">
                <div className="p-3 bg-secondary rounded-full text-primary group-active:scale-90 transition-all">
                    <Lock size={20} />
                </div>
                <span className="text-[10px] font-bold text-n-500 uppercase">PIN</span>
            </button>
        </div>

        {/* Card Settings List */}
        <div className="space-y-3">
            <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest ml-1">Security & Limits</p>
            
            <div className="bg-white rounded-brand-card border border-border divide-y divide-border">
                <div className="p-5 flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brand-dark">Contactless Payments</p>
                            <p className="text-[10px] text-n-500">Online & POS spending</p>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>

                <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                            <CardIcon size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brand-dark">Spending Limit</p>
                            <p className="text-[10px] text-n-500">Current: $2,500.00 / mo</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-n-300" />
                </div>
            </div>
        </div>

        <Button variant="outline" className="w-full h-14 border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-2xl">
            Terminate Virtual Card
        </Button>
      </div>
    </div>
  )
}