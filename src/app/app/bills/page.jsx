'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Zap, 
  Wifi, 
  Tv, 
  Phone, 
  Home, 
  Search,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

const categories = [
  { id: 'elec', name: 'Electricity', icon: <Zap size={20} />, color: 'bg-yellow-500' },
  { id: 'net', name: 'Internet', icon: <Wifi size={20} />, color: 'bg-blue-500' },
  { id: 'cable', name: 'Cable TV', icon: <Tv size={20} />, color: 'bg-purple-500' },
  { id: 'mobile', name: 'Mobile', icon: <Phone size={20} />, color: 'bg-green-500' },
  { id: 'rent', name: 'Rent', icon: <Home size={20} />, color: 'bg-red-500' },
]

export default function PayBillsPage() {
  const [step, setStep] = useState(1) // 1: Select Category, 2: Details, 3: Success
  const [selectedCat, setSelectedCat] = useState(null)

  if (step === 3) return <SuccessState />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center gap-4">
        <Link href="/app"><ArrowLeft size={24} /></Link>
        <h1 className="text-xl font-bold">Pay Bills</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-n-300" size={18} />
              <Input className="h-12 pl-12 bg-white" placeholder="Search billers..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => { setSelectedCat(cat); setStep(2); }}
                  className="flex flex-col items-center p-6 bg-white border border-border rounded-brand-card hover:border-primary transition-all group"
                >
                  <div className={`w-12 h-12 ${cat.color} text-white rounded-full flex items-center justify-center mb-3 group-active:scale-90 transition-transform shadow-lg`}>
                    {cat.icon}
                  </div>
                  <span className="text-sm font-bold text-brand-dark">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <header className="flex items-center gap-3">
              <div className={`w-10 h-10 ${selectedCat?.color} text-white rounded-full flex items-center justify-center`}>
                {selectedCat?.icon}
              </div>
              <div>
                <h2 className="text-xl font-black text-brand-dark">{selectedCat?.name}</h2>
                <p className="text-xs text-n-500 font-bold uppercase tracking-widest">Billing Details</p>
              </div>
            </header>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Customer ID / Account Number</Label>
                <Input className="h-14 bg-white" placeholder="e.g. 123456789" />
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Amount to Pay (USD)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">$</span>
                  <Input type="number" className="h-14 pl-8 bg-white balance-md text-primary" placeholder="0.00" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-n-500">Pay From</Label>
                <select className="h-14 w-full bg-white border border-input rounded-md px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary">
                  <option>USD Checking (*** 1234)</option>
                  <option>USD Savings (*** 6708)</option>
                </select>
              </div>
            </div>

            <Button onClick={() => setStep(3)} className="btn-primary w-full h-14 text-lg mt-4">
              Pay Bill Now
            </Button>
            <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-n-500">Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

function SuccessState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-bank-success/20 text-bank-success rounded-full flex items-center justify-center animate-bounce">
        <CheckCircle2 size={48} strokeWidth={3} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">Payment Successful</h2>
        <p className="text-n-500 mt-2 max-w-[250px] mx-auto">Your bill has been settled and a receipt has been sent to your email.</p>
      </div>
      <Link href="/app" className="w-full max-w-xs pt-4">
        <Button variant="outline" className="w-full h-12 border-primary text-primary font-bold">Back to Dashboard</Button>
      </Link>
    </div>
  )
}