'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createCardDepositIntent } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CardDeposit() {
  const [amount, setAmount] = useState(0)
  const [clientSecret, setClientSecret] = useState('')

  const startDeposit = async () => {
    const res = await createCardDepositIntent(amount)
    if (res.clientSecret) setClientSecret(res.clientSecret)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {!clientSecret ? (
        <div className="space-y-4">
          <input 
            type="number" 
            onChange={(e) => setAmount(Number(e.target.value))} 
            placeholder="Enter Amount"
            className="w-full p-4 rounded-2xl bg-slate-100 font-bold"
          />
          <button onClick={startDeposit} className="w-full btn-primary h-14 rounded-2xl">
            Continue
          </button>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeCheckoutForm amount={amount} />
        </Elements>
      )}
    </div>
  )
}

function StripeCheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/app/deposit/success` },
    })
    
    if (error) console.error(error.message)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button className="w-full btn-primary h-14 rounded-2xl font-black">
        Deposit ${amount}
      </button>
    </form>
  )
}