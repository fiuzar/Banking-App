'use client'

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, ShieldCheck, MoreVertical, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getChatDetails, sendMessage } from "@/server-functions/support"

export default function ChatDetailPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatInfo, setChatInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    // 1. Fetch function for messages & info
    const fetchChat = async (isFirstLoad = false) => {
        try {
            const res = await getChatDetails(id);
            // Assuming getChatDetails returns { messages, info }
            // Note: Update your server-function to return { messages: rows, info: ticketRow }
            if (Array.isArray(res)) {
                setMessages(res);
            } else if (res.messages) {
                setMessages(res.messages);
                setChatInfo(res.info);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            if (isFirstLoad) setLoading(false);
        }
    };

    // 2. Real-time Polling & Initial Load
    useEffect(() => {
        fetchChat(true);
        const interval = setInterval(() => fetchChat(false), 4000); // Poll every 4s for live feel
        return () => clearInterval(interval);
    }, [id]);

    // 3. Smooth Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 4. Send Message Logic
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const messageToSend = newMessage;
        setNewMessage(""); // Clear input immediately
        setSending(true);

        // Optimistic UI update (shows message instantly before DB confirms)
        const tempMsg = { 
            id: Date.now(), 
            message_text: messageToSend, 
            sender_role: 'USER', 
            created_at: new Date().toISOString() 
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            await sendMessage(id, messageToSend);
        } catch (err) {
            console.error("Failed to send:", err);
            // Optional: remove tempMsg or show error
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/app/support/chats" className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-slate-900 leading-none">Paysense Support</h1>
                        <p className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-tighter animate-pulse">
                            Agent Online
                        </p>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                </button>
            </header>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                <div className="text-center my-6">
                    <span className="text-[9px] bg-slate-200/50 text-slate-500 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                        Secure Encryption Active
                    </span>
                </div>

                {messages.map((msg, index) => {
                    const isUser = msg.sender_role === 'USER';
                    return (
                        <div key={msg.id || index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[85%] px-4 py-3 rounded-[20px] text-sm shadow-sm font-medium leading-relaxed ${
                                isUser 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.message_text}
                                <div className={`text-[8px] mt-1.5 font-bold uppercase opacity-50 text-right ${isUser ? 'text-white' : 'text-slate-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t pb-10">
                <form onSubmit={handleSendMessage} className="max-w-md mx-auto flex gap-2 items-center">
                    <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 py-1 border border-transparent focus-within:border-primary/20 focus-within:bg-white focus-within:shadow-inner transition-all">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="w-full bg-transparent border-none py-3 text-sm outline-none font-medium"
                        />
                    </div>
                    <Button 
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="h-12 w-12 rounded-2xl p-0 shrink-0 shadow-lg shadow-primary/20"
                    >
                        {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </Button>
                </form>
            </div>
        </div>
    )
}