'use client'

import { useState } from "react"
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  Trash2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldAlert, 
  Zap 
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Money Received",
      desc: "Your USD Savings was credited with $4,500.00 from Stripe.",
      time: "2m ago",
      type: "credit",
      isRead: false
    },
    {
      id: 2,
      title: "New Login Detected",
      desc: "A new login was detected from a Chrome browser on MacOS.",
      time: "1h ago",
      type: "security",
      isRead: false
    },
    {
      id: 3,
      title: "Bill Payment Successful",
      desc: "Your Electricity bill of $120.50 has been settled.",
      time: "5h ago",
      type: "debit",
      isRead: true
    }
  ])

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Link href="/app">
            <ArrowLeft size={24} className="text-brand-dark" />
          </Link>
          <h1 className="text-xl font-black text-brand-dark">Alerts</h1>
        </div>
        <button 
          onClick={markAllRead}
          className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-2">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 rounded-3xl transition-all flex gap-4 ${n.isRead ? 'bg-white opacity-60' : 'bg-secondary border border-primary/10 shadow-sm'}`}
            >
              {/* Icon Type */}
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                n.type === 'credit' ? 'bg-bank-success/10 text-bank-success' :
                n.type === 'security' ? 'bg-red-50 text-red-500' :
                'bg-primary/10 text-primary'
              }`}>
                {n.type === 'credit' && <ArrowDownLeft size={20} />}
                {n.type === 'debit' && <ArrowUpRight size={20} />}
                {n.type === 'security' && <ShieldAlert size={20} />}
              </div>

              {/* Text Content */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-brand-dark leading-tight">{n.title}</p>
                  <span className="text-[10px] font-medium text-n-400">{n.time}</span>
                </div>
                <p className="text-xs text-n-500 leading-relaxed">{n.desc}</p>
              </div>

              {!n.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="text-n-200" size={32} />
            </div>
            <p className="font-bold text-brand-dark">No new alerts</p>
            <p className="text-xs text-n-400">We&apos;ll notify you when something happens.</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-8 left-0 right-0 px-6 max-w-md mx-auto">
        <Button variant="outline" className="w-full h-12 border-slate-200 rounded-2xl flex gap-2 text-n-500 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
          <Trash2 size={18} /> Clear Notification History
        </Button>
      </div>
    </div>
  )
}