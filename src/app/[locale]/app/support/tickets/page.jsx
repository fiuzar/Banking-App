'use client'

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, AlertCircle, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreateTicketModal } from "@/components/app/help/ticket"
import { getTicketList } from "@/server-functions/support"
import { useLanguage } from "@/messages/LanguageProvider"

export default function TicketsListPage() {
    const { t } = useLanguage()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchTickets = async () => {
        try {
            const res = await getTicketList()
            setTickets(res || [])
        } catch (err) {
            console.error("Error fetching tickets:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const getStatusStyles = (status) => {
        const s = status?.toUpperCase() || ''
        switch (s) {
            case 'OPEN': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'RESOLVED': return 'bg-green-50 text-green-600 border-green-100'
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100'
            default: return 'bg-slate-50 text-slate-600 border-slate-100'
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/app/support" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold">
                        {t("TicketHistory", "header.title") || "Support Tickets"}
                    </h1>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)} 
                    size="sm" 
                    className="rounded-full gap-2 font-bold shadow-sm"
                >
                    <Plus size={16} /> 
                    {t("TicketHistory", "tabs.active") || "New Ticket"}
                </Button>
            </div>

            <div className="max-w-md mx-auto p-6 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                        <Loader2 className="animate-spin text-primary" size={24} />
                        <p className="text-sm italic">
                            {t("TicketHistory", "ticketCard.viewConversation") || "Loading tickets..."}
                        </p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200 animate-in fade-in zoom-in-95">
                        <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
                        <p className="text-sm font-medium text-slate-50 px-10 text-slate-500">
                            {t("TicketHistory", "empty") || "No tickets found."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tickets.map((ticket) => {
                            const isResolved = ticket.status?.toUpperCase() === 'RESOLVED';
                            
                            return (
                                <Link 
                                    key={ticket.id} 
                                    href={`/app/support/tickets/${ticket.id}`}
                                    className="block bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all hover:border-primary/20"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusStyles(ticket.status)}`}>
                                            {isResolved 
                                                ? (t("TicketHistory", "ticketCard.status.resolved") || "Resolved")
                                                : (t("TicketHistory", "ticketCard.status.inProgress") || "In Progress")
                                            }
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '---'}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                                        {ticket.subject || "No Subject"}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-1 mb-4">
                                        {ticket.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                ticket.priority?.toUpperCase() === 'URGENT' ? 'bg-red-500' : 'bg-slate-300'
                                            }`} />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                {ticket.priority || "Normal"} Priority
                                            </span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            <CreateTicketModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false)
                    fetchTickets() // Refresh list after closing modal
                }} 
            />
        </div>
    )
}