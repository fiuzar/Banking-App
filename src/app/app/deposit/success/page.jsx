'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Clock, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function SuccessContent() {
    const searchParams = useSearchParams()
    const amount = searchParams.get('amount')
    const account = searchParams.get('account')

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
            {/* Animated Clock Icon for 'Pending' feel */}
            <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 relative">
                <Clock size={50} strokeWidth={2.5} className="animate-pulse" />
                <div className="absolute -right-1 -bottom-1 bg-white p-1 rounded-full shadow-sm">
                   <ShieldCheck size={24} className="text-green-800" />
                </div>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-2">Deposit Pending</h1>
            
            <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm mb-8 w-full max-w-xs">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Estimated Amount</p>
                <p className="text-4xl font-black text-green-900">${parseFloat(amount || 0).toFixed(2)}</p>
                <div className="h-[1px] bg-slate-100 my-4" />
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Your <span className="text-slate-900 font-bold capitalize">{account}</span> deposit is being verified by our secure systems. This usually takes less than 60 seconds.
                </p>
            </div>

            <div className="w-full max-w-xs space-y-4">
                <Link href="/app">
                    <Button className="w-full h-16 bg-green-900 hover:bg-green-800 text-white font-black rounded-3xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                        Back to Dashboard <ArrowRight size={18} />
                    </Button>
                </Link>
                
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={12} /> Secure Bank-Grade Transfer
                </p>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}