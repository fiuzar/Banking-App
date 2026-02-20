'use client'

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, Zap, Wifi, Tv, Phone, Plus, Trash2, 
  ShoppingCart, CheckCircle2, CreditCard, ChevronRight, X 
} from "lucide-react"
import Link from "next/link"
import { processBillBasket } from "@/server-functions/pay-bills"
import { AccountDetailsContext } from "@/server-functions/contexts"
import { useLanguage } from "@/messages/LanguageProvider"

const categories = [
  { id: 'elec', icon: <Zap size={18} />, color: 'bg-amber-500', fieldLabel: 'Meter Number', placeholder: 'Enter 11-digit meter #' },
  { id: 'net', icon: <Wifi size={18} />, color: 'bg-blue-500', fieldLabel: 'User ID / Account', placeholder: 'e.g. Fiber-9920' },
  { id: 'cable', icon: <Tv size={18} />, color: 'bg-purple-500', fieldLabel: 'Smartcard Number', placeholder: 'Enter IUC number' },
  { id: 'mobile', icon: <Phone size={18} />, color: 'bg-emerald-500', fieldLabel: 'Phone Number', placeholder: '0800 000 0000' },
]

const QUICK_AMOUNTS = [10, 20, 50, 100];

export default function PayBillsPage() {
  const { t } = useLanguage()
  const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
  const [basket, setBasket] = useState([])
  const [step, setStep] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [currentBill, setCurrentBill] = useState({ catId: '', identifier: '', amount: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const activeCategory = categories.find(c => c.id === currentBill.catId)
  const totalAmount = basket.reduce((sum, item) => sum + Number(item.amount), 0)

  const addToBasket = () => {
    if (basket.length >= 5) {
      setError(t("PayBills", "errors.limitReached"))
      return
    }
    setBasket([...basket, { ...currentBill, category: activeCategory }])
    setIsAdding(false)
    setCurrentBill({ catId: '', identifier: '', amount: '' })
  }

  const removeFromBasket = (index) => setBasket(basket.filter((_, i) => i !== index))

  const handleCheckout = async () => {
    setLoading(true)
    setError("")
    const result = await processBillBasket(basket)
    setLoading(false)
    if (result.success) {
      setAccountDetails(result.account_details)
      setStep(3)
    } else setError(result.message || t("PayBills", "errors.failed"))
  }

  if (step === 3) return <SuccessState />

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-green-900 p-8 pt-12 text-white rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <Link href="/app" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-sm font-black tracking-[0.3em] uppercase opacity-80">{t("PayBills", "header.title")}</h1>
          <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black">
            {t("PayBills", "header.itemCount").replace("{{count}}", basket.length.toString())}
          </div>
        </div>
        <div className="flex flex-col items-center py-4 relative z-10">
          <p className="text-green-300 text-[10px] font-black uppercase tracking-widest mb-1">{t("PayBills", "header.totalLabel")}</p>
          <h2 className="text-5xl font-black">${totalAmount.toLocaleString()}</h2>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 -mt-1 space-y-6">
        {/* Basket */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                <ShoppingCart size={14} className="text-green-800" /> {t("PayBills", "basket.title")}
              </h3>
              {basket.length < 5 && !isAdding && (
                <button onClick={() => setIsAdding(true)} className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-tighter">
                  {t("PayBills", "basket.addBtn")}
                </button>
              )}
            </div>

            {basket.length === 0 && !isAdding && (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] py-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <p className="text-slate-400 font-bold text-sm">{t("PayBills", "basket.empty.title")}</p>
                <Button onClick={() => setIsAdding(true)} variant="link" className="text-green-800 font-black uppercase text-xs">
                  {t("PayBills", "basket.empty.action")}
                </Button>
              </div>
            )}

            {basket.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center gap-4 shadow-sm group">
                <div className={`w-12 h-12 ${item.category.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                  {item.category.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-sm leading-none mb-1">{t("PayBills", `addBill.categories.${item.catId}`)}</p>
                  <p className="text-[10px] text-slate-400 font-bold font-mono">{item.identifier}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 mb-1">${item.amount}</p>
                  <button onClick={() => removeFromBasket(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Bill */}
        {isAdding && activeCategory && (
          <Card className="rounded-[32px] border-none shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900 p-5 flex justify-between items-center">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{t("PayBills", "addBill.title")}</span>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{activeCategory.fieldLabel}</Label>
                  <Input 
                     className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-green-800 transition-all" 
                     placeholder={activeCategory.placeholder}
                     value={currentBill.identifier}
                     onChange={(e) => setCurrentBill({...currentBill, identifier: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t("PayBills", "addBill.form.amountLabel")}</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-green-800 text-lg">$</span>
                    <Input 
                       type="number"
                       className="h-14 rounded-2xl bg-slate-50 border-none pl-10 font-black text-green-800 text-xl focus:ring-2 focus:ring-green-800" 
                       placeholder={t("PayBills", "addBill.form.amountPlaceholder")}
                       value={currentBill.amount}
                       onChange={(e) => setCurrentBill({...currentBill, amount: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    {QUICK_AMOUNTS.map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setCurrentBill({...currentBill, amount: amt.toString()})}
                        className="flex-1 py-2 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 hover:bg-green-50 hover:text-green-800 transition-colors"
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={addToBasket} disabled={!currentBill.identifier || !currentBill.amount} className="w-full h-14 bg-green-800 hover:bg-green-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green-900/20 mt-4">
                  {t("PayBills", "addBill.form.submit")}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Checkout */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8">
            <h2 className="text-xl font-black text-slate-900">{t("PayBills", "checkout.title")}</h2>
            <Card className="rounded-[32px] p-8 space-y-5 border-none shadow-sm">
              {basket.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.category.color} text-white rounded-lg flex items-center justify-center`}>
                      {item.category.icon}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-[10px] uppercase">{t("PayBills", `addBill.categories.${item.catId}`)}</p>
                      <p className="text-[10px] font-mono text-slate-400">{item.identifier}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">${item.amount}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("PayBills", "checkout.grandTotal")}</span>
                <span className="font-black text-green-800 text-2xl">${totalAmount.toLocaleString()}</span>
              </div>
            </Card>
            <Button onClick={handleCheckout} disabled={loading} className="w-full h-16 bg-green-800 rounded-2xl font-black text-lg shadow-xl shadow-green-900/20">
              {loading ? <Loader2 className="animate-spin" /> : t("PayBills", "checkout.authorize")}
            </Button>
            <button onClick={() => setStep(1)} className="w-full text-xs font-black text-slate-400 uppercase tracking-widest">{t("PayBills", "checkout.edit")}</button>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      {basket.length > 0 && !isAdding && step === 1 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.08)] z-50">
          <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("PayBills", "checkout.settlementSource")}</span>
              <span className="font-black text-slate-900 text-sm flex items-center gap-1">{t("PayBills", "checkout.accountName")} <ChevronRight size={12} className="text-green-800" /></span>
            </div>
            <Button onClick={() => setStep(2)} className="flex-1 h-16 bg-green-800 hover:bg-green-900 rounded-2xl font-black text-lg shadow-xl shadow-green-900/30 group">
              {t("PayBills", "checkout.authorize")} <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function SuccessState() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-green-100 text-green-800 rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
        <CheckCircle2 size={56} strokeWidth={3} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{t("PayBills", "success.title")}</h2>
      <p className="text-slate-400 text-sm font-medium max-w-[240px] mb-12">{t("PayBills", "success.description")}</p>
      <Link href="/app" className="w-full max-w-xs">
        <Button className="w-full h-16 bg-slate-900 rounded-[24px] font-black uppercase tracking-widest hover:bg-black transition-all">{t("PayBills", "success.action")}</Button>
      </Link>
    </div>
  )
}

function Loader2({ className }) {
  return <div className={`w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ${className}`} />
}
