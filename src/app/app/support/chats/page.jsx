'use client'

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import the router
import { Button } from "@/components/ui/button"
import { getChatList, createNewChat } from "@/server-functions/support"

export default function ChatListPage() {
    const router = useRouter();
    const [chats, setChat] = useState([])
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false); // New state for button loading

    useEffect(() => {
        async function fetchTickets() {
            try {
                const res = await getChatList();
                setChat(res || []);
            } catch (err) {
                console.error("Error fetching chats:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, []);

    // --- FIX: Add the handleCreate function ---
    const handleCreateNewChat = async () => {
        setCreating(true);
        try {
            const res = await createNewChat("Live Support Session");
            if (res.success && res.conversationId) {
                // Redirect user to the specific chat page
                router.push(`/app/support/chats/${res.conversationId}`);
            } else {
                alert("Failed to start a new chat. Please try again.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/app/support"><ArrowLeft size={20} /></Link>
                    <h1 className="text-xl font-bold">My Chats</h1>
                </div>
                
                {/* --- UPDATED BUTTON --- */}
                <Button 
                    onClick={handleCreateNewChat} 
                    disabled={creating}
                    size="sm" 
                    className="rounded-full gap-2"
                >
                    {creating ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <Plus size={16} />
                    )} 
                    New Chat
                </Button>
            </div>

            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-slate-400 text-sm italic">Loading your chat history...</div>
                ) : chats.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
                        <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
                        <p className="text-sm font-medium text-slate-500">No support tickets found.</p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <Link key={chat.id} href={`/app/support/chats/${chat.id}`} className="block p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-sm">{chat.subject}</p>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700">
                                    Active
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">Tap to continue conversation...</p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}