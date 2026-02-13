'use client'

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {getTicketDetails} from "@/server-functions/support"

export default function TicketDetailPage() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTicketDetails() {
            try {
                const res = await getTicketDetails(id);
                setTicket(res.ticket);
                setReplies(res.replies || []);
            } catch (err) {
                console.error("Error loading ticket:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchTicketDetails();
    }, [id]);

    if (loading) return <div className="p-10 text-center text-sm">Loading ticket details...</div>;
    if (!ticket) return <div className="p-10 text-center text-sm">Ticket not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <Link href="/app/support/tickets" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-sm font-bold text-slate-900 leading-tight">Ticket #{ticket.id.slice(-5)}</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{ticket.status}</p>
                </div>
            </div>

            <div className="max-w-md mx-auto p-6 space-y-6">
                {/* Main Issue Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase">
                            {ticket.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-400">{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">{ticket.subject}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{ticket.description}</p>
                </div>

                {/* Timeline / Replies */}
                <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {replies.map((reply, index) => (
                        <div key={index} className="relative pl-10">
                            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-50 ${reply.sender_role === 'ADMIN' ? 'bg-primary text-white' : 'bg-white text-slate-400 border-slate-200'}`}>
                                {reply.sender_role === 'ADMIN' ? <ShieldCheck size={14} /> : <MessageSquare size={14} />}
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[11px] font-bold text-slate-900">
                                        {reply.sender_role === 'ADMIN' ? 'Paysense Support' : 'You'}
                                    </p>
                                    <p className="text-[10px] text-slate-400">{new Date(reply.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <p className="text-xs text-slate-600">{reply.message_text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resolution Status */}
                {ticket.status === 'RESOLVED' && (
                    <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="text-green-500" size={20} />
                        <p className="text-xs font-medium text-green-700">This issue has been marked as resolved.</p>
                    </div>
                )}
            </div>

            {/* Quick Reply Bar (Only if not closed) */}
            {ticket.status !== 'CLOSED' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                    <div className="max-w-md mx-auto flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Add a follow-up..." 
                            className="flex-1 bg-slate-100 border-none rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <Button className="rounded-xl px-6">Send</Button>
                    </div>
                </div>
            )}
        </div>
    )
}