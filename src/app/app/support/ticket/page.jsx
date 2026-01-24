'use client'

import { ArrowLeft, Clock, CheckCircle2, MessageSquare, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Simulated Data (This would come from your PostgreSQL)
const tickets = [
  {
    id: "TIC-8829",
    subject: "Missing Wire Transfer",
    status: "in-progress",
    date: "Oct 24, 2023",
    category: "Transactions"
  },
  {
    id: "TIC-7741",
    subject: "KYC Verification Level 2",
    status: "resolved",
    date: "Oct 12, 2023",
    category: "Account"
  }
];

export default function TicketHistoryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-50 rounded-full">
            <ArrowLeft size={24} className="text-brand-dark" />
          </button>
          <h1 className="text-xl font-black text-brand-dark">Support Tickets</h1>
        </div>
        
        {/* Simple Tabs */}
        <div className="flex gap-6 mt-4">
          <button className="text-sm font-bold text-primary border-b-2 border-primary pb-2">Active</button>
          <button className="text-sm font-bold text-n-400 pb-2">Resolved</button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {tickets.map((ticket) => (
          <Link 
            href={`/support/tickets/${ticket.id}`} 
            key={ticket.id}
            className="block bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${ticket.status === 'in-progress' ? 'bg-amber-400' : 'bg-bank-success'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-n-400">{ticket.id}</span>
              </div>
              <span className="text-[10px] font-bold text-n-400 bg-slate-50 px-2 py-1 rounded-md">
                {ticket.date}
              </span>
            </div>

            <h3 className="text-sm font-bold text-brand-dark mb-1">{ticket.subject}</h3>
            <p className="text-xs text-n-500 mb-4">{ticket.category}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare size={14} />
                <span className="text-[10px] font-bold">View Conversation</span>
              </div>
              <ChevronRight size={16} className="text-n-200" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}