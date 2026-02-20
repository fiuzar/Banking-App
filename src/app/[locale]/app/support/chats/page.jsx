'use client'

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/messages/LanguageProvider"
import { getChatList, createNewChat } from "@/server-functions/support"

export default function ChatListPage() {
    const router = useRouter()
    const { t } = useLanguage()
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        async function fetchChats() {
            try {
                const res = await getChatList()
                // Safety: res is the array from your sample
                setChats(res || [])
            } catch (err) {
                console.error("Error fetching chats:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchChats()
    }, [])

    const handleCreateNewChat = async () => {
        setCreating(true)
        try {
            const res = await createNewChat("Live Support Session")
            if (res.success && res.conversationId) {
                router.push(`/app/support/chats/${res.conversationId}`)
            } else {
                alert(t("ChatList", "alerts.createFailed") || "Failed to start chat.")
            }
        } catch (err) {
            console.error(err)
            alert(t("ChatList", "alerts.createFailed") || "Connection error.")
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="min-h-screen bg-white pb-24"> {/* Added pb-24 for navbar clearance */}
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                    <Link href="/app/support" className="p-1">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold">
                        {t("ChatList", "header.title") || "My Chats"}
                    </h1>
                </div>

                <Button 
                    onClick={handleCreateNewChat} 
                    disabled={creating}
                    size="sm" 
                    className="rounded-full gap-2 font-bold"
                >
                    {creating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    {t("ChatList", "header.newChat") || "New Chat"}
                </Button>
            </div>

            {/* Chat List */}
            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center py-20 text-slate-400 gap-2">
                        <Loader2 className="animate-spin text-primary" size={24} />
                        <p className="text-sm italic">{t("ChatList", "states.loading") || "Loading..."}</p>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                        <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
                        <p className="text-sm font-medium text-slate-500">
                            {t("ChatList", "states.empty") || "No chats found."}
                        </p>
                    </div>
                ) : (
                    chats.map((chat) => {
                        // Logic based on your sample data fields
                        const isActive = chat.is_active === true;
                        
                        return (
                            <Link 
                                key={chat.id} 
                                href={`/app/support/chats/${chat.id}`} 
                                className="block p-4 border border-slate-100 rounded-2xl bg-white hover:border-primary/20 transition-all active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-sm text-slate-900 truncate pr-2">
                                        {chat.subject || "Support Session"}
                                    </p>
                                    
                                    {/* Status Badge using is_active logic */}
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                                        isActive 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {isActive 
                                            ? (t("ChatList", "status.active") || "Active") 
                                            : (t("ChatList", "status.closed") || "Closed")
                                        }
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                    {t("ChatList", "states.continue") || "Tap to continue..."}
                                </p>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    )
}