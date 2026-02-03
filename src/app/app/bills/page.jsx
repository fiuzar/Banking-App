'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, Zap, Wifi, Tv, Phone, Home, Plus, Trash2, 
  ShoppingCart, CheckCircle2, CreditCard, ChevronRight 
} from "lucide-react"
import Link from "next/link"
import { processBillBasket } from "@/server-functions/pay-bills"

const categories = [
  { id: 'elec', name: 'Electricity', icon: <Zap size={18} />, color: 'bg-amber-500' },
  { id: 'net', name: 'Internet', icon: <Wifi size={18} />, color: 'bg-blue-500' },
  { id: 'cable', name: 'Cable TV', icon: <Tv size={18} />, color: 'bg-purple-500' },
  { id: 'mobile', name: 'Airtime', icon: <Phone size={18} />, color: 'bg-emerald-500' },
]

export default function PayBillsPage() {
  const [basket, setBasket] = useState([]) // Array of up to 5 bills
  const [step, setStep] = useState(1) // 1: Basket/Select, 2: Checkout, 3: Success
  const [isAdding, setIsAdding] = useState(false)
  const [currentBill, setCurrentBill] = useState({ catId: '', customerId: '', amount: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const addToBasket = () => {
    if (basket.length >= 5) return alert("Maximum 5 bills per transaction")
    const category = categories.find(c => c.id === currentBill.catId)
    setBasket([...basket, { ...currentBill, category }])
    setIsAdding(false)
    setCurrentBill({ catId: '', customerId: '', amount: '' })
  }

  const removeFromBasket = (index) => {
    setBasket(basket.filter((_, i) => i !== index))
  }

  const totalAmount = basket.reduce((sum, item) => sum + Number(item.amount), 0)

  // Checkout handler
  const handleCheckout = async () => {
    setLoading(true)
    setError("")
    const result = await processBillBasket(basket)
    setLoading(false)
    if (result.success) {
      setStep(3)
    } else {
      setError(result.message || "Payment failed. Please try again.")
    }
  }

  if (step === 3) return <SuccessState />

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-green-900 p-8 pt-12 mb-7 text-white rounded-b-[40px] shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <Link href="/app" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-black tracking-tight uppercase">Bill Center</h1>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
            {basket.length}/5
          </div>
        </div>
        
        <div className="flex flex-col items-center py-4">
          <p className="text-green-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Basket Value</p>
          <h2 className="text-4xl font-black">${totalAmount.toLocaleString()}</h2>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 -mt-8 space-y-6">
        {/* THE BASKET */}
        {step === 1 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart size={16} /> My Items
            </h3>
            {basket.length < 5 && !isAdding && (
                <button onClick={() => setIsAdding(true)} className="text-green-700 font-bold text-xs flex items-center gap-1 hover:underline">
                    <Plus size={14} /> Add Another
                </button>
            )}
          </div>

          {basket.length === 0 && !isAdding && (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <CreditCard size={32} />
                 </div>
                 <p className="text-slate-400 font-bold text-sm">Your basket is empty</p>
                 <Button onClick={() => setIsAdding(true)} variant="link" className="text-green-800 font-black uppercase text-xs mt-2">Start Adding</Button>
            </div>
          )}

          {basket.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-[24px] border border-slate-200 flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
              <div className={`w-12 h-12 ${item.category.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10`}>
                {item.category.icon}
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900 text-sm leading-tight">{item.category.name}</p>
                <p className="text-[10px] text-slate-500 font-bold font-mono truncate max-w-[120px]">{item.customerId}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <span className="font-black text-slate-900">${item.amount}</span>
                <button onClick={() => removeFromBasket(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* ADD BILL FORM */}
        {isAdding && (
          <Card className="rounded-[32px] border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-5 flex justify-between items-center">
              <span className="text-white text-xs font-black uppercase tracking-widest">New Bill Entry</span>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white"><Plus className="rotate-45" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {categories.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setCurrentBill({...currentBill, catId: c.id})}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${currentBill.catId === c.id ? 'bg-green-800 text-white scale-105' : 'bg-slate-50 text-slate-400'}`}
                  >
                    {c.icon}
                    <span className="text-[8px] font-black uppercase">{c.id}</span>
                  </button>
                ))}
              </div>
              
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Customer ID</Label>
                <Input 
                   className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                   placeholder="Meter or Smartcard #"
                   value={currentBill.customerId}
                   onChange={(e) => setCurrentBill({...currentBill, customerId: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Amount ($)</Label>
                <Input 
                   type="number"
                   className="h-12 rounded-xl bg-slate-50 border-none font-black text-green-800 text-lg" 
                   placeholder="0.00"
                   value={currentBill.amount}
                   onChange={(e) => setCurrentBill({...currentBill, amount: e.target.value})}
                />
              </div>

              <Button onClick={addToBasket} disabled={!currentBill.catId || !currentBill.amount} className="w-full h-12 bg-green-800 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-green-900/20">
                Add to Basket
              </Button>
            </div>
          </Card>
        )}

        {/* CHECKOUT STEP */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-black text-slate-900 mb-2">Review & Pay</h2>
            <Card className="rounded-[24px] p-6 space-y-4 border-slate-100 shadow-sm">
              {basket.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 ${item.category.color} text-white rounded-xl flex items-center justify-center`}>
                      {item.category.icon}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{item.category.name}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-500">{item.customerId}</span>
                  <span className="font-black text-slate-900">${item.amount}</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className="font-bold text-slate-500">Total</span>
                <span className="font-black text-green-800 text-lg">${totalAmount.toLocaleString()}</span>
              </div>
            </Card>
            {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}
            <Button onClick={handleCheckout} disabled={loading} className="w-full h-14 bg-green-800 rounded-2xl font-black text-lg shadow-xl shadow-green-900/20">
              {loading ? "Processing..." : "Confirm & Pay"}
            </Button>
            <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-slate-400 mt-2">Back to Basket</button>
          </div>
        )}

        {/* FOOTER ACTION */}
        {basket.length > 0 && !isAdding && step === 1 && (
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pay via Checking</span>
                        <span className="font-black text-slate-900">**** 6708</span>
                    </div>
                    <Button onClick={() => setStep(2)} className="flex-1 h-14 bg-green-800 rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 group">
                        Confirm & Pay <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

function SuccessState() {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-green-800 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-900/40">
                <CheckCircle2 size={48} strokeWidth={3} />
            </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Success!</h2>
        <p className="text-slate-500 font-medium max-w-[280px] mb-8">
            Your bills have been settled. ALAT processing reference: <span className="font-mono text-green-700">#AL-992384</span>
        </p>
        <Link href="/app" className="w-full max-w-xs">
          <Button className="w-full h-14 bg-slate-900 rounded-2xl font-black uppercase tracking-widest">Done</Button>
        </Link>
      </div>
    )
  }