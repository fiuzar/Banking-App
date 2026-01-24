"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export function SuccessState() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-brand-dark">Transfer Complete</h2>
          <p className="text-n-500 mt-2">The funds have been moved between your accounts instantly.</p>
        </div>
        <Link href="/app" className="w-full max-w-xs">
          <Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Back to Dashboard</Button>
        </Link>
      </div>
    )
}

export function FailureState() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-brand-dark">Transfer Failed</h2>
            <p className="text-n-500 mt-2">There was an issue processing your transfer. Please try again later.</p>
        </div>
        <Link href="/app/transfer/internal" className="w-full max-w-xs">
          <Button variant="outline" className="w-full h-12 border-red-500 text-red-500 font-bold">Try Again</Button>
        </Link>
      </div>
    )
}

export function AccountBox({ label, name, balance }) {
  return (
    <div className="bg-card border border-border p-5 rounded-brand-card">
      <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex justify-between items-center">
        <p className="font-bold text-brand-dark">{name}</p>
        <p className="text-sm font-mono text-n-500">{balance}</p>
      </div>
    </div>
  )
}