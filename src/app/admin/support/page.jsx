'use client'

import { useState, useEffect } from "react"
import { ShieldAlert, Clock, User, Power, Loader2 } from "lucide-react"
import Link from "next/link"
import { getAdminDashboardStats, getAllActiveTickets, toggleAdminStatus, getInitialStatus } from "@/server-functions/admin"

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
    // Optimistically update UI
    setIsOnline(newStatus); 
    
    const res = await toggleAdminStatus(newStatus);
    if (!res.success) {
        // Revert if database fails
        setIsOnline(!newStatus);
        alert("Failed to update status");
    }
};

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black italic text-slate-900">Admin Queue</h1>
                    <p className="text-slate-500 font-medium text-sm">Real-time support management</p>
                </div>

                {/* --- THE TOGGLE YOU WANTED --- */}
                <button 
                    onClick={handleToggleStatus}
                    className={`flex cursor-pointer items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                        isOnline ? 'bg-green-500 text-white shadow-green-200' : 'bg-slate-200 text-slate-500 shadow-slate-100'
                    }`}
                >
                    <Power size={18} />
                    {isOnline ? "YOU ARE ONLINE" : "YOU ARE OFFLINE"}
                </button>
            </header>

            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400">User / Priority</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400">Latest Message</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.map((ticket) => {
    // If last sender was 'USER', or if there are NO messages yet, Admin needs to reply
    const needsReply = ticket.last_sender_role === 'USER' || !ticket.last_msg_text;

    return (
        <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-colors">
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    {/* Visual indicator for priority */}
                    <div className={`w-1.5 h-10 rounded-full ${
                        ticket.priority === 'URGENT' ? 'bg-red-500' : 'bg-slate-200'
                    }`} />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-900">
                                {ticket.first_name} {ticket.last_name}
                            </p>
                            {needsReply && (
                                <span className="bg-primary text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse">
                                    NEEDS REPLY
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase">{ticket.subject}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <p className="text-sm font-medium text-slate-600 line-clamp-1">
                    {ticket.last_msg_text || "New Ticket - No messages yet"}
                </p>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase">
                    {new Date(ticket.last_activity).toLocaleString()}
                </p>
            </td>
            <td className="px-8 py-6 text-right">
                <Link href={`/admin/support/chats/${ticket.conversation_id}`}>
                    <button className="bg-brand-dark text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-black transition-all">
                        Open
                    </button>
                </Link>
            </td>
        </tr>
    );
})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}