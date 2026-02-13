'use client'

import { ArrowLeft, Plus, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ChatListPage() {
    // This would eventually come from your database (e.g., Prisma)
    const chats = [
        { id: "1", subject: "Failed Transaction", status: "Active", lastMsg: "We are looking into it..." },
        { id: "2", subject: "Account Limit", status: "Closed", lastMsg: "Your limit has been increased." }
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/app/support"><ArrowLeft size={20} /></Link>
                    <h1 className="text-xl font-bold">My Chats</h1>
                </div>
                <Button size="sm" className="rounded-full gap-2">
                    <Plus size={16} /> New Chat
                </Button>
            </div>

            <div className="p-4 space-y-3">
                {chats.map((chat) => (
                    <Link key={chat.id} href={`/app/support/chats/${chat.id}`} className="block p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-sm">{chat.subject}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${chat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {chat.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}