'use client'

import { useState, useEffect } from "react"
import { Power, Mail, MessageSquare, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getAllActiveTickets, toggleAdminStatus, getInitialStatus } from "@/server-functions/admin"

export default function AdminSupportDashboard() {
    const [tickets, setTickets] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAdminData() {
            const [ticketRes, statusRes] = await Promise.all([
                getAllActiveTickets(),
                getInitialStatus()
            ]);
            if (ticketRes.success) setTickets(ticketRes.tickets);
            if (statusRes.success) setIsOnline(statusRes.isOnline);
            setLoading(false);
        }
        loadAdminData();
    }, []);

    const handleToggleStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus); 
        
        const res = await toggleAdminStatus(newStatus);
        if (!res.success) {
            setIsOnline(!newStatus);
            alert("Failed to update status");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            {/* --- HEADER --- */}
            <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black italic text-slate-900">Admin Queue</h1>
                    <p className="text-slate-500 font-medium text-xs md:text-sm">Real-time support management</p>
                </div>

                <button 
                    onClick={handleToggleStatus}
                    className={`flex w-full sm:w-auto cursor-pointer items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
                        isOnline ? 'bg-green-500 text-white shadow-green-200' : 'bg-slate-200 text-slate-500 shadow-slate-100'
                    }`}
                >
                    <Power size={18} />
                    <span className="text-xs md:text-sm">{isOnline ? "YOU ARE ONLINE" : "YOU ARE OFFLINE"}</span>
                </button>
            </header>

            <div className="max-w-6xl mx-auto">
                {/* --- DESKTOP TABLE VIEW --- */}
                <div className="hidden md:block bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">User / Priority</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Latest Message</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.map((ticket) => (
                                <TicketRow key={ticket.id} ticket={ticket} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- MOBILE CARD VIEW --- */}
                <div className="md:hidden space-y-4">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>

                {tickets.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                            <MessageSquare className="text-slate-300" size={24} />
                        </div>
                        <p className="text-slate-400 font-bold">Queue is empty. Good job!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * SUB-COMPONENTS
 */

function TicketRow({ ticket }) {
    const needsReply = ticket.last_sender_role === 'USER' || !ticket.last_msg_text;
    
    return (
        <tr className="group hover:bg-slate-50/50 transition-colors">
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-10 rounded-full shrink-0 ${
                        ticket.priority === 'URGENT' ? 'bg-red-500' : 'bg-slate-200'
                    }`} />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-900">{ticket.first_name} {ticket.last_name}</p>
                            {needsReply && (
                                <span className="bg-indigo-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse">
                                    NEEDS REPLY
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{ticket.subject}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <p className="text-sm font-medium text-slate-600 line-clamp-1">
                    {ticket.last_msg_text || "New Ticket - No messages yet"}
                </p>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase">
                    {new Date(ticket.last_activity).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </p>
            </td>
            <td className="px-8 py-6 text-right">
                <Link href={`/admin/support/chats/${ticket.conversation_id}`}>
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-black transition-all">
                        Open
                    </button>
                </Link>
            </td>
        </tr>
    );
}

function TicketCard({ ticket }) {
    const needsReply = ticket.last_sender_role === 'USER' || !ticket.last_msg_text;

    return (
        <Link 
            href={`/admin/support/chats/${ticket.conversation_id}`}
            className="block bg-white border border-slate-200 rounded-2xl p-4 shadow-sm active:bg-slate-50"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${ticket.priority === 'URGENT' ? 'bg-red-500' : 'bg-slate-300'}`} />
                    <span className="text-xs font-black text-slate-900">{ticket.first_name} {ticket.last_name}</span>
                </div>
                {needsReply && (
                    <span className="bg-indigo-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black">
                        NEEDS REPLY
                    </span>
                )}
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                <Mail size={10} /> {ticket.subject}
            </p>

            <div className="bg-slate-50 rounded-xl p-3 mb-3">
                <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                    "{ticket.last_msg_text || "New Ticket - No messages yet"}"
                </p>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold">{new Date(ticket.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-indigo-600 font-black text-[10px] uppercase flex items-center gap-1">
                    Respond <ChevronRight size={14} />
                </div>
            </div>
        </Link>
    );
}

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}