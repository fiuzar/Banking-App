'use client'

import { useState } from "react"
import { 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  Phone, 
  Search, 
  ChevronRight, 
  LifeBuoy,
  FileText
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
        <Link href="/app" className="absolute left-6 top-6">
          <ArrowLeft size={24} />
        </Link>
        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
          <LifeBuoy size={32} />
        </div>
        <h1 className="text-2xl font-black">How can we help?</h1>
        <p className="text-white/70 text-sm font-medium mt-1">We&apos;re here 24/7 for your peace of mind.</p>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-8 space-y-6">
        {/* Search Bar */}
        <div className="relative shadow-xl shadow-primary/5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-n-300" size={18} />
          <Input 
            className="h-14 pl-12 bg-white rounded-2xl border-none text-brand-dark font-medium shadow-sm" 
            placeholder="Search for help topics..." 
          />
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 gap-3">
          <SupportCard 
            icon={<MessageCircle className="text-primary" />} 
            title="Live Chat" 
            desc="Average wait: 2 mins" 
            action="Start Chat"
            isPrimary
          />
          <div className="grid grid-cols-2 gap-3">
            <SmallSupportCard icon={<Mail size={20} />} title="Email" />
            <SmallSupportCard icon={<Phone size={20} />} title="Call Us" />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest ml-1">Popular Topics</p>
          <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <FAQLink title="Limits & Verification" />
            <FAQLink title="Card Security & Freezing" />
            <FAQLink title="Wire Transfer Timelines" />
            <FAQLink title="Crypto Deposit Issues" />
          </div>
        </div>

        {/* Ticket Status */}
        <div className="p-5 bg-white rounded-[24px] border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
                 <FileText size={20} />
              </div>
              <div>
                 <p className="text-sm font-bold text-brand-dark">My Support Tickets</p>
                 <p className="text-[10px] text-bank-success font-bold uppercase tracking-tighter">1 Active Ticket</p>
              </div>
           </div>
           <ChevronRight size={18} className="text-n-300" />
        </div>
      </div>
    </div>
  )
}

function SupportCard({ icon, title, desc, action, isPrimary }) {
  return (
    <div className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-brand-dark">{title}</p>
          <p className="text-xs text-n-500">{desc}</p>
        </div>
      </div>
      <Button className="btn-primary h-10 rounded-xl px-4 text-xs">{action}</Button>
    </div>
  )
}

function SmallSupportCard({ icon, title }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="text-primary opacity-60">{icon}</div>
      <span className="text-xs font-bold text-brand-dark">{title}</span>
    </div>
  )
}

function FAQLink({ title }) {
  return (
    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
      <span className="text-sm font-medium text-brand-dark">{title}</span>
      <ChevronRight size={16} className="text-n-300" />
    </div>
  )
}