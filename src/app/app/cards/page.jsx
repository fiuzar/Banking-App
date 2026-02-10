'use client'

import { useState, useContext, useEffect } from "react"
import { 
  Plus, Shield, Eye, EyeOff, Lock, Unlock,
  CreditCard, Zap, Settings, Loader2, ArrowRight, Copy, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountDetailsContext } from "@/server-functions/contexts"
import Link from "next/link"
import { issueVirtualCardAction, toggle_card_freeze, getCardTransactions } from "@/server-functions/cards"
import { toast } from "sonner"

export default function CardIssuingPage() {
  const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(true)

  const hasCard = !!accountDetails?.card_details;
  const cardData = accountDetails?.card_details;
  const isFrozen = cardData?.status === 'frozen';
  const holderName = `${accountDetails?.first_name || ''} ${accountDetails?.last_name || ''}`.trim() || "PaySense User";

  useEffect(() => {
    async function loadTransactions() {
      if (!hasCard) return;
      setTxLoading(true)
      const res = await getCardTransactions()
      if (res.success) setTransactions(res.transactions)
      setTxLoading(false)
    }
    loadTransactions()
  }, [hasCard])

  const handleCopy = () => {
    if (!cardData?.card_number) return;
    navigator.clipboard.writeText(cardData.card_number);
    setCopied(true);
    toast.success("Card number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  const handleIssueCard = async () => {
    if (loading) return
    setLoading(true)
    try {
        const { success, error, account_details } = await issueVirtualCardAction('checking')
        if (success) {
            setAccountDetails(account_details)
            toast.success("Virtual card activated!")
        } else {
            toast.error(error || "Issuance Failed")
        }
    } catch (err) {
        toast.error("Connection error. Try again.")
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
        toast.success(isFrozen ? "Card is now active" : "Card frozen successfully")
      }
    } catch (err) {
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="p-6 max-w-md mx-auto">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-900">Virtual Card</h1>
            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Status: </span>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${hasCard ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {hasCard ? (isFrozen ? 'Frozen' : 'Active') : 'Inactive'}
                </span>
            </div>
        </header>

        {!hasCard ? (
          /* --- ISSUE CARD STATE --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] text-white shadow-2xl min-h-[220px] flex flex-col justify-between border border-white/10">
               <div className="relative z-10 flex justify-between items-start">
                 <div className="w-12 h-9 bg-amber-400/20 rounded-lg border border-amber-400/30 backdrop-blur-sm" />
                 <Zap className="text-white/20" size={24} />
               </div>
               <div className="relative z-10">
                 <p className="text-xl font-mono tracking-[0.25em] mb-4 opacity-30">•••• •••• •••• ••••</p>
                 <div className="flex justify-between items-end">
                     <div>
                         <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Card Holder</p>
                         <p className="font-bold uppercase text-sm tracking-tight">{holderName}</p>
                     </div>
                     <p className="text-xs font-black italic opacity-40">VISA</p>
                 </div>
               </div>
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="font-black text-xl text-slate-900 mb-2">Instant Issuing</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Generate a secure Visa card for online payments. Funds are drawn directly from your checking account.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center"><Plus size={18}/></div>
                  <div className="text-xs font-bold text-slate-600">One-time fee: <span className="text-slate-900">$5.00</span></div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><Shield size={18}/></div>
                  <div className="text-xs font-bold text-slate-600">Secure 3D-Authentication</div>
                </div>
              </div>

              <Button 
                onClick={handleIssueCard}
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.97]"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Activate Card"}
              </Button>
            </div>
          </div>
        ) : (
          /* --- ACTIVE CARD STATE --- */
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className={`relative overflow-hidden p-8 rounded-[40px] text-white transition-all duration-700 shadow-2xl min-h-[220px] flex flex-col justify-between border ${
                isFrozen ? 'bg-slate-300 grayscale scale-[0.98]' : 'bg-gradient-to-tr from-primary to-blue-700 shadow-primary/30 border-white/10'
            }`}>
                {isFrozen && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <div className="bg-white text-slate-900 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-2xl scale-110">
                            <Lock size={16} className="text-red-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Card Frozen</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-9 bg-white/20 rounded-lg border border-white/30 backdrop-blur-md" />
                    <div className="flex gap-2">
                        <button onClick={handleCopy} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                            {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18}/>}
                        </button>
                        <button onClick={() => setShowDetails(!showDetails)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                            {showDetails ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-2xl font-mono tracking-[0.2em] mb-6">
                        {showDetails ? cardData.card_number : `•••• •••• •••• ${cardData.card_number?.slice(-4)}`}
                    </p>
                    <div className="flex justify-between items-end">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[8px] uppercase opacity-60 font-black tracking-widest mb-1">Expiry</p>
                                <p className="font-bold text-sm tracking-tighter">{cardData.expiry}</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase opacity-60 font-black tracking-widest mb-1">CVV</p>
                                <p className="font-bold text-sm tracking-tighter">{showDetails ? cardData.cvv : "•••"}</p>
                            </div>
                        </div>
                        <p className="text-xs font-black italic opacity-60">VISA</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <Button variant="outline" disabled={loading} onClick={handleFreezeToggle} className={`flex-1 h-16 rounded-[24px] gap-2 border-2 font-black transition-all ${
                    isFrozen ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-slate-100 text-slate-600'
                }`}>
                    {loading ? <Loader2 className="animate-spin" size={20}/> : (isFrozen ? <Unlock size={20} /> : <Lock size={20} />)}
                    {isFrozen ? "Unfreeze" : "Freeze"}
                </Button>
                <Button variant="outline" className="flex-1 h-16 rounded-[24px] gap-2 border-2 border-slate-100 text-slate-600 font-black">
                    <Settings size={20} /> Limits
                </Button>
            </div>

            {/* Activity Feed */}
            <section className="pt-2">
                <div className="flex justify-between items-end mb-5 px-1">
                    <h3 className="font-black text-lg text-slate-900">Recent Activity</h3>
                    <Link href="/app/transactions" className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 mb-1">
                        Full History <ArrowRight size={12}/>
                    </Link>
                </div>

                <div className="space-y-3">
                    {txLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-20 w-full bg-slate-200/50 rounded-[28px] animate-pulse" />
                        ))
                    ) : transactions.length > 0 ? (
                        transactions.map((tx, idx) => (
                            <CardTransactionItem 
                                key={idx}
                                tr_id={tx.id} 
                                name={tx.name} 
                                date={tx.date} 
                                amount={tx.amount} 
                                status={tx.status} 
                                category={tx.category}
                            />
                        ))
                    ) : (
                        <div className="p-12 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                <CreditCard size={28} />
                            </div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No Card Activity Found</p>
                        </div>
                    )}
                </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function CardTransactionItem({ tr_id, name, date, amount, status, category }) {
    // Ensuring the amount has 2 decimal places regardless of backend input
    const formatValue = (val) => {
        const numeric = parseFloat(val.replace(/[^\d.-]/g, ''));
        const prefix = val.startsWith('-') ? '-' : '+';
        return `${prefix}$${Math.abs(numeric).toFixed(2)}`;
    }

    return (
        <Link href={`/app/transaction-details/${tr_id}`}>
        <div className="group flex justify-between items-center p-4 bg-white rounded-[28px] border border-slate-100 shadow-sm transition-all active:scale-[0.98] hover:border-primary/20">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-50 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    {category === 'service' ? <Zap size={20} /> : <CreditCard size={20} />}
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900 truncate max-w-[150px] leading-tight">{name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-black ${amount.startsWith('-') ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {formatValue(amount)}
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                    <div className={`w-1 h-1 rounded-full ${status === 'Pending' ? 'bg-amber-400' : 'bg-slate-200'}`} />
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${status === 'Pending' ? 'text-amber-500' : 'text-slate-300'}`}>
                        {status}
                    </p>
                </div>
            </div>
        </div>
        </Link>
    )
}