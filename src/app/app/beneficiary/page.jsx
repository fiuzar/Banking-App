'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus, CheckCircle2, Globe, Landmark } from "lucide-react"
import Link from "next/link"

export default function AddBeneficiary() {
  const [type, setType] = useState('local') // 'local' or 'international'
  const [isSuccess, setIsSuccess] = useState(false)

  if (isSuccess) return <SuccessState />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app"><ArrowLeft size={24} /></Link>
        <h1 className="text-xl font-bold">Add Beneficiary</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {/* Type Selector Toggle */}
        <div className="flex p-1 bg-secondary rounded-xl border border-border">
          <button 
            onClick={() => setType('local')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${type === 'local' ? 'bg-white shadow-sm text-primary' : 'text-n-500'}`}
          >
            <Landmark size={16} /> Local
          </button>
          <button 
            onClick={() => setType('international')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${type === 'international' ? 'bg-white shadow-sm text-primary' : 'text-n-500'}`}
          >
            <Globe size={16} /> International
          </button>
        </div>

        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
          <header>
            <h2 className="text-xl font-black text-brand-dark">Recipient Details</h2>
            <p className="text-meta">This beneficiary will be saved for future transfers.</p>
          </header>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Full Name</Label>
              <Input className="h-12 border-n-300" placeholder="e.g. Jane Smith" />
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Bank Name</Label>
              <Input className="h-12 border-n-300" placeholder="e.g. Wells Fargo" />
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Account Number</Label>
              <Input className="h-12 border-n-300" placeholder="0000 0000 0000" />
            </div>

            {type === 'local' ? (
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Routing Number (ABA)</Label>
                <Input className="h-12 border-n-300" placeholder="9 Digits" />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">SWIFT / BIC Code</Label>
                <Input className="h-12 border-n-300" placeholder="8-11 Characters" />
              </div>
            )}

            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Nickname (Optional)</Label>
              <Input className="h-12 border-n-300" placeholder="e.g. Mom's Account" />
            </div>
          </div>

          <Button onClick={() => setIsSuccess(true)} className="btn-primary w-full h-14 text-lg mt-4">
            Save Beneficiary
          </Button>
        </div>
      </div>
    </div>
  )
}

function SuccessState() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <UserPlus size={40} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-brand-dark tracking-tight">Beneficiary Added</h2>
          <p className="text-n-500 max-w-[250px] mx-auto text-sm font-medium">You can now send money to this recipient instantly from your dashboard.</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link href="/app/transfer/wire" className="w-full">
                <Button className="btn-primary w-full h-12">Send Money Now</Button>
            </Link>
            <Link href="/app" className="w-full">
                <Button variant="ghost" className="w-full h-12 text-n-500 font-bold">Return Home</Button>
            </Link>
        </div>
      </div>
    )
}