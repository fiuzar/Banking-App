'use client'

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, CheckCircle2, MessageSquare, ShieldCheck, Send, Loader2, Paperclip, X, FileIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/messages/LanguageProvider"
import { getTicketDetails, sendMessage } from "@/server-functions/support"

export default function TicketDetailPage() {
    const { id } = useParams();
    const { t } = useLanguage();
    const [ticket, setTicket] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    const fetchData = async (isFirstLoad = false) => {
        try {
            const res = await getTicketDetails(id);
            if (res.success) {
                setTicket(res.ticket);
                setReplies(res.replies || []);
            }
        } catch (err) {
            console.error("Error loading ticket:", err);
        } finally {
            if (isFirstLoad) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(true);
        const interval = setInterval(() => fetchData(false), 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [replies]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large. Max 5MB.");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSendReply = async () => {
        if ((!replyText.trim() && !selectedFile) || sending) return;
        setSending(true);
        
        const messageToSend = replyText;
        const fileToUpload = selectedFile;

        setReplyText("");
        setSelectedFile(null);

        try {
            // Updated to handle both text and file
            const newMsg = await sendMessage(ticket.conversation_id, messageToSend, fileToUpload);
            if (newMsg) {
                setReplies(prev => [...prev, newMsg]);
            }
        } catch (err) {
            alert(t("TicketDetail", "errors.sendFailed") || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    if (!ticket) return (
        <div className="h-screen flex flex-col items-center justify-center p-10 text-center">
            <p className="text-slate-500 font-bold mb-4">Ticket not found.</p>
            <Link href="/app/support/tickets">
                <Button variant="outline">Back to Tickets</Button>
            </Link>
        </div>
    );

    const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';

    return (
        <div className="flex flex-col h-[calc(100vh-76px)] bg-slate-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center gap-4 shrink-0 z-10 shadow-sm">
                <Link href="/app/support/tickets" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-sm font-black text-slate-900 leading-tight">
                        {t("TicketDetail", "header.ticketPrefix") || "TIC-"}{ticket.id.slice(-5).toUpperCase()}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'OPEN' ? 'bg-blue-500' : 'bg-green-500'}`} />
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {ticket.status === 'RESOLVED' 
                                ? t("TicketDetail", "messages.status.resolved") 
                                : t("TicketDetail", "messages.status.inProgress")}
                        </p>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                {/* Main Issue Description */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-black rounded-lg uppercase tracking-tighter">
                            {ticket.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold italic">
                            {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900 mb-3 leading-tight">{ticket.subject}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl italic">
                        "{ticket.description}"
                    </p>
                </div>

                {/* Chat Timeline */}
                <div className="space-y-6 relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200/50" />
                    
                    {replies.map((reply, index) => (
                        <div key={index} className="relative pl-12 animate-in slide-in-from-bottom-2 duration-300">
                            <div className={`absolute left-0 w-8 h-8 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white ${
                                reply.sender_role === 'ADMIN' ? 'bg-primary text-white' : 'bg-white text-slate-400'
                            }`}>
                                {reply.sender_role === 'ADMIN' ? <ShieldCheck size={14} /> : <MessageSquare size={14} />}
                            </div>
                            
                            <div className={`p-4 rounded-[24px] shadow-sm border border-slate-100 ${
                                reply.sender_role === 'ADMIN' ? 'bg-white' : 'bg-slate-100/50'
                            }`}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-wide">
                                        {reply.sender_role === 'ADMIN' 
                                            ? t("TicketDetail", "messages.agentLabel") 
                                            : t("TicketDetail", "messages.userLabel")}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                                        {new Date(reply.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{reply.message_text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Resolved Banner */}
                {ticket.status === 'RESOLVED' && (
                    <div className="bg-green-500 text-white p-5 rounded-[24px] flex items-center gap-4 shadow-lg shadow-green-100 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 size={24} />
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest">{t("TicketDetail", "messages.status.resolved")}</p>
                            <p className="text-[11px] opacity-90 font-medium">This ticket has been marked as complete.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Footer Input */}
            {!isResolved && (
                <div className="p-4 bg-white border-t shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                    {selectedFile && (
                        <div className="mb-2 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 w-fit animate-in slide-in-from-bottom-2">
                            <FileIcon size={14} className="text-primary" />
                            <span className="text-[10px] font-bold truncate max-w-[150px]">{selectedFile.name}</span>
                            <button onClick={() => setSelectedFile(null)} className="p-1 bg-slate-200 rounded-full">
                                <X size={10} />
                            </button>
                        </div>
                    )}

                    <div className="max-w-md mx-auto flex gap-3 items-center">
                        <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-3 border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*,.pdf" 
                                className="hidden" 
                            />
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                            >
                                <Paperclip size={20} />
                            </button>
                            <input 
                                type="text" 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                                placeholder={t("TicketDetail", "input.placeholder")} 
                                className="w-full bg-transparent border-none py-3 text-sm font-medium outline-none text-slate-900"
                            />
                        </div>
                        <Button 
                            onClick={handleSendReply}
                            disabled={sending || (!replyText.trim() && !selectedFile)}
                            className="rounded-2xl h-12 w-12 p-0 shrink-0 shadow-lg shadow-primary/20"
                        >
                            {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}