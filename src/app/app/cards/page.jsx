'use client'

import { useState, useContext, useEffect } from "react"
import { 
  Plus, Shield, Eye, EyeOff, Lock, Unlock,
  CreditCard, Zap, ArrowUpRight, ArrowDownLeft, Settings, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AccountDetailsContext } from "@/server-functions/contexts"
import Link from "next/link"
import { issueVirtualCardAction, toggle_card_freeze } from "@/server-functions/cards"
import { toast } from "sonner"

export default function CardIssuingPage() {
  const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  // Determine if user has a card based on the JSONB column in your context
  const hasCard = !!accountDetails?.card_details;
  const cardData = accountDetails?.card_details;
  const isFrozen = cardData?.status === 'frozen';

  const holderName = `${accountDetails?.first_name || ''} ${accountDetails?.last_name || ''}`.trim() || "PaySense User";

  const handleIssueCard = async () => {
    if (loading) return
    setLoading(true)
    
    try {
        const { success, error, account_details } = await issueVirtualCardAction('checking')
        if (success) {
            setAccountDetails(account_details)
            toast(<div className="text-green-800">
                <h2 className="text-md font-bold">Card issued successfully!</h2>
                <p className="text-xs">Your virtual card is ready for use.</p>
            </div>)
        } else {

            toast(<div className="text-red-800">
                <h2 className="text-md font-bold">Issuance Failed</h2>
                <p className="text-xs">`${error || "Insufficient funds or database error."}`</p>
            </div>)
        }
    } catch (err) {

            toast("emma")
        // toast.error("Critical System Error", {
        //     description: "Please contact support if this persists."
        // })
    } finally {
        setLoading(false)
    }
  }

  const handleFreezeToggle = async () => {
    if (loading) return
    setLoading(true)
    
    try {
      const { success, account_details } = await toggle_card_freeze()
      if (success) {
        setAccountDetails(account_details)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6">My Virtual Card</h1>

        {!hasCard ? (
          /* ISSUE CARD STATE */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-black p-8 rounded-[32px] text-white shadow-2xl">
              <div className="relative z-10">
                <div className="w-12 h-8 bg-amber-400/20 rounded-md mb-12 border border-amber-400/30" />
                <p className="text-xl font-medium tracking-widest mb-2 opacity-20">•••• •••• •••• ••••</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40">Card Holder</p>
                        <p className="font-bold uppercase tracking-tight">{holderName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase opacity-40 italic font-black">Visa</p>
                        <p className="text-[8px] uppercase opacity-40 font-bold">Virtual</p>
                    </div>
                </div>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-900">Instant Virtual Card</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Get an instant virtual card for secure online shopping. Compatible with Apple Pay and Google Pay.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Plus size={14}/></div>
                  <span>One-time issuing fee: <strong>$5.00</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Shield size={14}/></div>
                    <span>Bank-grade encryption & 3D Secure</span>
                </div>
              </div>

              <Button 
                onClick={handleIssueCard}
                disabled={loading}
                className="w-full h-14 bg-primary rounded-2xl font-bold text-lg mt-4 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {loading ? "Issuing..." : "Issue Card for $5.00"}
              </Button>
              <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">Fee deducted from Checking Balance</p>
            </div>
          </div>
        ) : (
          /* ACTIVE CARD STATE */
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* The Visual Card */}
            <div className={`relative overflow-hidden p-8 rounded-[32px] text-white transition-all duration-500 shadow-2xl ${
                isFrozen 
                ? 'bg-slate-300 grayscale scale-[0.98]' 
                : 'bg-gradient-to-tr from-primary to-blue-600 shadow-primary/30'
            }`}>
                {/* Frozen Overlay */}
                {isFrozen && (
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl animate-bounce">
                            <Lock size={16} className="text-red-500" />
                            <span className="text-xs font-black uppercase tracking-widest">Card Frozen</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-12 relative z-10">
                    <Zap fill={isFrozen ? "#94a3b8" : "white"} size={24} className={isFrozen ? "opacity-50" : ""} />
                    <button 
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        {showDetails ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                </div>
                
                <div className="space-y-6 relative z-10">
                    <p className="text-2xl font-mono tracking-[0.2em]">
                        {showDetails ? cardData.card_number : `•••• •••• •••• ${cardData.card_number?.slice(-4)}`}
                    </p>
                    <div className="flex gap-10">
                        <div>
                            <p className="text-[9px] uppercase opacity-60 font-bold mb-1">Expiry</p>
                            <p className="font-bold text-sm tracking-widest">{cardData.expiry}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase opacity-60 font-bold mb-1">CVV</p>
                            <p className="font-bold text-sm tracking-widest">{showDetails ? cardData.cvv : "•••"}</p>
                        </div>
                    </div>
                </div>
                
                {/* Card Branding Decor */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <Button 
                    variant="outline" 
                    disabled={loading}
                    onClick={handleFreezeToggle}
                    className={`flex-1 h-14 rounded-2xl gap-2 border-2 transition-all font-bold ${
                        isFrozen ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' : 'border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {loading ? <Loader2 className="animate-spin" size={18}/> : (isFrozen ? <Unlock size={18} /> : <Lock size={18} />)}
                    {isFrozen ? "Unfreeze" : "Freeze"}
                </Button>
                <Button variant="outline" className="flex-1 h-14 rounded-2xl gap-2 border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-100">
                    <Settings size={18} /> Limits
                </Button>
            </div>

            {/* Card Transactions Section */}
            <div className="pt-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-slate-900">Card Transactions</h3>
                    <Link href="/app/transactions" className="text-[10px] font-bold text-primary uppercase tracking-widest">View All</Link>
                </div>
                <div className="space-y-3">
                    <CardTransactionItem name="Netflix.com" date="Today, 10:15 AM" amount={-15.99} status="Completed" />
                    <CardTransactionItem name="Amazon.com" date="Yesterday" amount={-84.50} status="Pending" />
                    <CardTransactionItem name="Apple Services" date="Feb 2, 2026" amount={-0.99} status="Completed" />
                    {/* Empty State if no transactions */}
                    <div className="p-8 text-center bg-white rounded-[24px] border border-dashed border-slate-200">
                        <p className="text-xs text-slate-400 font-medium">New transactions will appear here</p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CardTransactionItem({ name, date, amount, status }) {
    return (
        <div className="flex justify-between items-center p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm transition-transform active:scale-[0.98]">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                    <CreditCard size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 tracking-tight">{name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-black text-slate-900">${Math.abs(amount).toFixed(2)}</p>
                <p className={`text-[9px] font-bold uppercase tracking-tighter ${status === 'Pending' ? 'text-amber-500' : 'text-slate-300'}`}>{status}</p>
            </div>
        </div>
    )
}