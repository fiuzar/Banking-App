'use client'

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, CheckCircle2, User, Mail, Clock, Loader2, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { adminSendMessage, getChatMessages, getTicketDetails } from "@/server-functions/admin"

export default function AdminChatPage() {
    const { id: conversationId } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [ticket, setTicket] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Ref for the bottom-most point
    const scrollBottomRef = useRef(null);
    const containerRef = useRef(null);

    const loadData = async (isFirstLoad = false) => {
        const [msgRes, ticketRes] = await Promise.all([
            getChatMessages(conversationId),
            getTicketDetails(conversationId)
        ]);
        
        if (msgRes.success) {
            // Check if user is already scrolled up before forcing scroll
            const isAtBottom = containerRef.current 
                ? containerRef.current.scrollHeight - containerRef.current.scrollTop <= containerRef.current.clientHeight + 100
                : true;

            setMessages(msgRes.messages);

            // Only force scroll to bottom on first load OR if user is already at the bottom
            if (isFirstLoad || isAtBottom) {
                setTimeout(() => {
                    scrollBottomRef.current?.scrollIntoView({ behavior: isFirstLoad ? "auto" : "smooth" });
                }, 100);
            }
        }
        if (ticketRes.success) setTicket(ticketRes.ticket);
        if (isFirstLoad) setLoading(false);
    };

    useEffect(() => {
        loadData(true);
        const interval = setInterval(() => loadData(false), 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    async function handleSend(shouldResolve = false) {
        if (!newMessage.trim() && !shouldResolve) return;
        setSending(true);
        
        try {
            const res = await adminSendMessage(conversationId, newMessage, shouldResolve);
            if (res.success) {
                setNewMessage("");
                await loadData(false); 
                // Force scroll after admin sends a message
                scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
            <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
    );

    return (
        <div className="h-[100dvh] bg-slate-50 flex flex-col lg:flex-row overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-white lg:border-r overflow-hidden">
                
                {/* Header */}
                <div className="p-3 md:p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-2 md:gap-4 min-w-0">
                        <Link href="/admin/support" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="min-w-0">
                            <h2 className="font-black italic text-slate-900 leading-none truncate text-sm md:text-base">
                                {ticket?.subject || "Support Request"}
                            </h2>
                            <p className="text-[9px] md:text-[10px] font-bold text-indigo-600 uppercase mt-1 tracking-tighter truncate">
                                {ticket?.first_name} {ticket?.last_name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Info Trigger for Mobile */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Info size={20} className="text-slate-400" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                                    <SidebarContent ticket={ticket} />
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Button 
                            onClick={() => handleSend(true)}
                            variant="outline" 
                            disabled={sending}
                            className="rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold text-[10px] md:text-xs h-9 px-3 md:px-4"
                        >
                            <CheckCircle2 size={14} className="mr-1 md:mr-2" /> 
                            <span className="hidden xs:inline">Resolve</span>
                            <span className="xs:hidden">Done</span>
                        </Button>
                    </div>
                </div>

                {/* Messages List - FIXED SCROLLING */}
                <div 
                    ref={containerRef}
                    className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 scroll-smooth"
                >
                    <div className="flex flex-col justify-end min-h-full">
                        {messages.map((msg, i) => {
                            const isAdmin = msg.sender_role === 'ADMIN';
                            return (
                                <div key={msg.id || i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-[20px] shadow-sm ${
                                        isAdmin 
                                        ? 'bg-slate-900 text-white rounded-tr-none' 
                                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                    }`}>
                                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                                        <p className={`text-[8px] mt-2 font-black uppercase opacity-40 ${isAdmin ? 'text-right' : 'text-left'}`}>
                                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Anchor for automatic scrolling */}
                        <div ref={scrollBottomRef} className="h-2" />
                    </div>
                </div>

                {/* Input Bar */}
                <div className="p-3 md:p-4 bg-white border-t safe-area-bottom">
                    <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-3">
                        <Textarea 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            rows={1}
                            className="flex-1 min-h-[48px] max-h-[150px] rounded-2xl bg-slate-100 border-none focus-visible:ring-2 focus-visible:ring-indigo-600/20 resize-none p-3 text-sm font-medium transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(false);
                                }
                            }}
                        />
                        <Button 
                            disabled={sending || !newMessage.trim()}
                            onClick={() => handleSend(false)}
                            className="h-12 w-12 rounded-2xl bg-slate-900 shadow-lg shrink-0 active:scale-95 transition-transform"
                        >
                            {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sidebar (Desktop only) */}
            <aside className="hidden lg:block w-80 bg-slate-50 overflow-y-auto border-l">
                <SidebarContent ticket={ticket} />
            </aside>
        </div>
    )
}

/**
 * Extracted Sidebar to use in both Desktop Aside and Mobile Sheet
 */
function SidebarContent({ ticket }) {
    return (
        <div className="p-6 space-y-6">
            <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <User size={32} className="text-indigo-600" />
                </div>
                <h3 className="font-black text-slate-900 text-md leading-tight">
                    {ticket?.first_name} {ticket?.last_name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 break-all">{ticket?.email}</p>
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
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Original Request</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            "{ticket?.description || 'No description'}"
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-indigo-600 rounded-2xl text-white">
                <p className="text-[10px] font-black uppercase opacity-70 mb-1">Internal Note</p>
                <p className="text-xs font-bold leading-tight">This user has a verified KYC status. Handle with priority.</p>
            </div>
        </div>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-400 shrink-0">
                {icon}
                <span className="text-[10px] font-black uppercase">{label}</span>
            </div>
            <span className="text-xs font-black text-slate-700 uppercase truncate">{value}</span>
        </div>
    )
}