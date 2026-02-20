'use client'

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, CheckCircle2, User, Mail, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { adminSendMessage, getChatMessages, getTicketDetails } from "@/server-functions/admin"

export default function AdminChatPage() {
    const { id: conversationId } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [ticket, setTicket] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    // Optimized Data Loader
    const loadData = async (isFirstLoad = false) => {
        const [msgRes, ticketRes] = await Promise.all([
            getChatMessages(conversationId),
            getTicketDetails(conversationId)
        ]);
        
        if (msgRes.success) setMessages(msgRes.messages);
        if (ticketRes.success) setTicket(ticketRes.ticket);
        if (isFirstLoad) setLoading(false);
    };

    useEffect(() => {
        loadData(true);
        const interval = setInterval(() => loadData(false), 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    async function handleSend(shouldResolve = false) {
        if (!newMessage.trim() && !shouldResolve) return;
        setSending(true);
        
        try {
            const res = await adminSendMessage(conversationId, newMessage, shouldResolve);
            if (res.success) {
                setNewMessage("");
                // Refresh messages immediately after sending
                await loadData(false); 
                if (shouldResolve) router.push('/admin/support');
            }
        } catch (error) {
            console.error("Failed to send:", error);
        } finally {
            setSending(false);
        }
    }

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-white border-r">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/support" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="font-black italic text-slate-900 leading-none truncate max-w-[200px]">
                                {ticket?.subject || "Support Request"}
                            </h2>
                            <p className="text-[10px] font-bold text-primary uppercase mt-1 tracking-tighter">
                                ID: {String(ticket?.id || conversationId).slice(-8)}
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => handleSend(true)}
                        variant="outline" 
                        disabled={sending}
                        className="rounded-xl border-green-200 text-green-600 hover:bg-green-50 font-bold text-xs"
                    >
                        <CheckCircle2 size={16} className="mr-2" /> Mark Resolved
                    </Button>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                    {messages.map((msg, i) => {
                        const isAdmin = msg.sender_role === 'ADMIN';
                        return (
                            <div key={msg.id || i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}>
                                <div className={`max-w-[75%] p-4 rounded-[22px] shadow-sm ${
                                    isAdmin 
                                    ? 'bg-slate-900 text-white rounded-tr-none' 
                                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                }`}>
                                    <p className="text-sm font-medium leading-relaxed">{msg.message_text}</p>
                                    <p className={`text-[9px] mt-2 font-black uppercase opacity-40 ${isAdmin ? 'text-right' : 'text-left'}`}>
                                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-white border-t">
                    <div className="max-w-4xl mx-auto flex items-end gap-3">
                        <Textarea 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your reply..."
                            className="flex-1 min-h-[80px] rounded-2xl bg-slate-100 border-none focus-visible:ring-2 focus-visible:ring-primary/20 resize-none p-4 text-sm font-medium"
                        />
                        <Button 
                            disabled={sending || !newMessage.trim()}
                            onClick={() => handleSend(false)}
                            className="h-14 w-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 shrink-0"
                        >
                            {sending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sidebar (Desktop only) */}
            <aside className="hidden lg:block w-80 bg-slate-50 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                        <User size={32} className="text-slate-400" />
                    </div>
                    <h3 className="font-black text-slate-900 text-md leading-tight">
                        {ticket?.first_name} {ticket?.last_name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{ticket?.email}</p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Metadata</h4>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                        <InfoRow 
                            icon={<Clock size={14}/>} 
                            label="Created" 
                            value={ticket?.ticket_created ? new Date(ticket.ticket_created).toLocaleDateString() : '...'} 
                        />
                        <InfoRow 
                            icon={<Mail size={14}/>} 
                            label="Type" 
                            value={ticket?.type || 'Standard'} 
                        />
                        <div className="pt-4 border-t">
                            <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Issue Context</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                                "{ticket?.description || 'No description'}"
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
                {icon}
                <span className="text-[10px] font-black uppercase">{label}</span>
            </div>
            <span className="text-xs font-black text-slate-700 uppercase">{value}</span>
        </div>
    )
}