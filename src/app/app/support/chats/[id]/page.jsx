'use client'

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, ShieldCheck, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ChatDetailPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatInfo, setChatInfo] = useState(null);
    const scrollRef = useRef(null);

    // 1. Auto-scroll to bottom whenever messages update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 2. Initial Fetch of Conversation & Messages
    useEffect(() => {
        async function fetchChat() {
            const res = await fetch(`/api/support/conversations/${id}`);
            const data = await res.json();
            setMessages(data.messages || []);
            setChatInfo(data.info);
        }
        fetchChat();
    }, [id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic UI update
        const tempMsg = { 
            id: Date.now(), 
            message_text: newMessage, 
            sender_role: 'USER', 
            created_at: new Date() 
        };
        setMessages([...messages, tempMsg]);
        setNewMessage("");

        // Send to PostgreSQL
        await fetch(`/api/support/messages/send`, {
            method: 'POST',
            body: JSON.stringify({ conversation_id: id, text: newMessage })
        });
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header: Identity of who they are talking to */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Link href="/app/support/chats" className="p-1">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 leading-none">Paysense Support</h1>
                        <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-tighter">Always Active</p>
                    </div>
                </div>
                <button className="p-2 text-slate-400"><MoreVertical size={18} /></button>
            </header>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                <div className="text-center my-4">
                    <span className="text-[10px] bg-slate-200/50 text-slate-500 px-3 py-1 rounded-full font-medium">
                        Chat started about {chatInfo?.subject || "Support"}
                    </span>
                </div>

                {messages.map((msg) => {
                    const isUser = msg.sender_role === 'USER';
                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                isUser 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.message_text}
                                <div className={`text-[9px] mt-1 opacity-60 text-right ${isUser ? 'text-white' : 'text-slate-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t pb-8">
                <form onSubmit={handleSendMessage} className="max-w-md mx-auto flex gap-2 items-center">
                    <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 py-1 border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="w-full bg-transparent border-none py-2 text-sm outline-none"
                        />
                    </div>
                    <Button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="h-10 w-10 rounded-full p-0 shrink-0"
                    >
                        <Send size={18} />
                    </Button>
                </form>
            </div>
        </div>
    )
}