'use client'

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, ShieldCheck, MoreVertical, Loader2, Paperclip, FileIcon, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/messages/LanguageProvider"
import { getChatDetails, sendMessage } from "@/server-functions/support"

export default function ChatDetailPage() {
    const { id } = useParams();
    const { t } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // State for the file
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    const fetchChat = async (isFirstLoad = false) => {
        try {
            const res = await getChatDetails(id);
            if (Array.isArray(res)) {
                setMessages(res);
            } else if (res?.messages) {
                setMessages(res.messages);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            if (isFirstLoad) setLoading(false);
        }
    };

    useEffect(() => {
        fetchChat(true);
        const interval = setInterval(() => fetchChat(false), 4000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Optional: Limit size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large. Max 5MB.");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || sending) return;

        setSending(true);
        const messageText = newMessage;
        const fileToUpload = selectedFile;
        
        setNewMessage(""); 
        setSelectedFile(null);

        // Optimistic UI for text
        const tempMsg = { 
            id: Date.now(), 
            message_text: fileToUpload ? `📎 ${fileToUpload.name}` : messageText, 
            sender_role: 'USER', 
            created_at: new Date().toISOString() 
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            // Note: Update your sendMessage function to handle FormData if sending files
            await sendMessage(id, messageText, fileToUpload);
        } catch (err) {
            console.error("Failed to send:", err);
            alert(t("ChatDetail", "errors.sendFailed"));
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
        <div className="flex flex-col h-[calc(100vh-150px)] bg-slate-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between shrink-0 z-10 shadow-sm">
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
                        <h1 className="text-sm font-black text-slate-900 leading-none">{t("ChatDetail", "header.title")}</h1>
                        <p className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-tighter animate-pulse">
                            {t("ChatDetail", "header.agentStatus")}
                        </p>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
            </header>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                <div className="text-center my-4">
                    <span className="text-[9px] bg-slate-200/50 text-slate-500 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                        {t("ChatDetail", "system.encryptionNote")}
                    </span>
                </div>

                {messages.map((msg, index) => {
                    const isUser = msg.sender_role === 'USER';
                    return (
                        <div key={msg.id || index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-3 rounded-[20px] text-sm shadow-sm font-medium ${
                                isUser ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
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
            <div className="p-4 bg-white border-t shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                {/* File Previewer */}
                {selectedFile && (
                    <div className="mb-2 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 w-fit">
                        <FileIcon size={16} className="text-primary" />
                        <span className="text-xs font-bold truncate max-w-[150px]">{selectedFile.name}</span>
                        <button onClick={() => setSelectedFile(null)} className="p-1 bg-slate-200 rounded-full"><X size={12} /></button>
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="max-w-md mx-auto flex gap-2 items-center">
                    <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-3 border border-transparent focus-within:border-primary/20 focus-within:bg-white focus-within:shadow-inner transition-all">
                        {/* Hidden Input */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*,.pdf" 
                            className="hidden" 
                        />
                        
                        {/* Paperclip Button */}
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                        >
                            <Paperclip size={20} />
                        </button>

                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={t("ChatDetail", "input.placeholder")} 
                            className="w-full bg-transparent border-none py-3 text-sm outline-none font-medium text-slate-900"
                        />
                    </div>
                    <Button 
                        type="submit"
                        disabled={(!newMessage.trim() && !selectedFile) || sending}
                        className="h-12 w-12 rounded-2xl p-0 shrink-0 shadow-lg shadow-primary/20"
                    >
                        {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </Button>
                </form>
            </div>
        </div>
    )
}