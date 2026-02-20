'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createCardDepositIntent } from '@/server-functions/stripe'
import { ArrowLeft, Landmark, Wallet, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/messages/LanguageProvider'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function CardDeposit() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const initialAccount = searchParams.get('account') || 'checking'

  const [amount, setAmount] = useState('')
  const [targetAccount, setTargetAccount] = useState(initialAccount)
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)

  const startDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return alert(t("CardDeposit", "errors.invalidAmount"))
    }

    setLoading(true)
    const res = await createCardDepositIntent(amount, targetAccount)
    if (res.clientSecret) {
      setClientSecret(res.clientSecret)
    } else {
      alert(t("CardDeposit", "errors.initFailed"))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="bg-green-900 pt-8 pb-20 px-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="flex items-center gap-4 relative z-10">
          <Link href="/app" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold">{t("CardDeposit", "header.title")}</h1>
        </div>
      </div>

      <div className="px-6 -mt-10 max-w-md mx-auto relative z-20">
        {!clientSecret ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Step 1: Destination Selection */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-black">1</div>
                <div>
                  <h3 className="font-bold text-slate-900">{t("CardDeposit", "steps.destination.title")}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{t("CardDeposit", "steps.destination.description")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AccountButton 
                  label={t("CardDeposit", "steps.destination.options.checking")} 
                  icon={<Landmark size={20} />} 
                  isActive={targetAccount === 'checking'} 
                  onClick={() => setTargetAccount('checking')} 
                />
                <AccountButton 
                  label={t("CardDeposit", "steps.destination.options.savings")} 
                  icon={<Wallet size={20} />} 
                  isActive={targetAccount === 'savings'} 
                  onClick={() => setTargetAccount('savings')} 
                />
              </div>
            </div>

            {/* Step 2: Amount Entry */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-black">2</div>
                <div>
                  <h3 className="font-bold text-slate-900">{t("CardDeposit", "steps.amount.title")}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{t("CardDeposit", "steps.amount.description")}</p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-3xl text-slate-300">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="0.00"
                  className="w-full p-8 pl-12 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-green-800 focus:bg-white text-3xl font-black transition-all outline-none"
                />
              </div>
            </div>

            {/* Step 3: Action */}
            <div className="space-y-4">
              <button 
                disabled={loading}
                onClick={startDeposit} 
                className="w-full bg-green-800 text-white font-bold h-16 rounded-3xl shadow-xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading && <Zap className="animate-pulse" />}
                {loading ? t("CardDeposit", "checkout.status.initializing") : t("CardDeposit", "checkout.button")}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t("CardDeposit", "checkout.security")}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
             <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900">{t("CardDeposit", "checkout.title")}</h3>
                  <p className="text-xs text-slate-400">
                    {t("CardDeposit", "checkout.summary").replace("{{amount}}", parseFloat(amount).toFixed(2))}
                  </p>
                </div>

                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeCheckoutForm amount={amount} targetAccount={targetAccount} />
                </Elements>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AccountButton({ label, icon, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${
        isActive 
        ? 'border-green-800 bg-green-50 text-green-800 shadow-inner' 
        : 'border-slate-100 bg-white text-slate-400 grayscale'
      }`}
    >
      <div className={`p-2 rounded-full ${isActive ? 'bg-green-800 text-white' : 'bg-slate-50'}`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase tracking-tighter">{label}</span>
    </button>
  )
}

function StripeCheckoutForm({ amount, targetAccount }) {
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useLanguage()
  const [isPaying, setIsPaying] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsPaying(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { 
        return_url: `${window.location.origin}/app/deposit/success?amount=${amount}&account=${targetAccount}`,
      },
    })
    
    if (error) {
      alert(error.message)
      setIsPaying(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-2 bg-slate-50 rounded-2xl">
        <PaymentElement />
      </div>
      <button 
        disabled={isPaying}
        className="w-full bg-green-800 text-white h-16 rounded-3xl font-black text-lg shadow-xl shadow-green-900/20 active:scale-95 transition-all"
      >
        {isPaying 
          ? t("CardDeposit", "checkout.status.verifying") 
          : t("CardDeposit", "checkout.status.pay").replace("{{amount}}", parseFloat(amount).toFixed(2))
        }
      </button>
    </form>
  )
}
