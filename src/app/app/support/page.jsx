'use client'

import { useState, useEffect } from "react"
import { 
    ArrowLeft, 
    MessageCircle, 
    Mail, 
    Phone, 
    LifeBuoy, 
    FileText,
    ChevronRight 
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HelpSearch, PopularTopics } from "@/components/app/help/help-topics"
import { CreateTicketModal } from "@/components/app/help/ticket"

export default function SupportPage() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    // 1. Check if any admin is online from your new Postgres table
    useEffect(() => {
        async function checkAgentStatus() {
            try {
                const res = await fetch('/api/support/agent-status');
                const data = await res.json();
                setIsOnline(data.isOnline);
            } catch (err) {
                console.error("Failed to check agent status");
            } finally {
                setIsLoading(false);
            }
        }
        checkAgentStatus();
    }, []);

    const handleChatAction = () => {
        if (isOnline) {
            // Take them to their native chat list
            router.push("/app/support/chats");
        } else {
            // If no one is online, go straight to ticket creation
            setIsTicketModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
                <Link href="/app" className="absolute left-6 top-6 hover:opacity-70 transition-opacity">
                    <ArrowLeft size={24} />
                </Link>
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
                    <LifeBuoy size={32} />
                </div>
                <h1 className="text-2xl font-black italic tracking-tight">Support Center</h1>
                <p className="text-white/70 text-sm font-medium mt-1">Direct help from the Paysense team.</p>
            </div>

            <div className="max-w-md mx-auto px-6 -mt-8 space-y-6 pb-12">
                {/* Search Knowledge Base */}
                <HelpSearch />

                {/* Primary Support Action: Live Chat or Ticket */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center relative">
                                <MessageCircle className="text-primary" />
                                {isOnline && (
                                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-dark">Live Support</p>
                                <p className="text-xs text-slate-500">
                                    {isLoading ? "Checking availability..." : isOnline ? "Agents are online now" : "Agents are currently away"}
                                </p>
                            </div>
                        </div>
                        <Button 
                            disabled={isLoading}
                            onClick={handleChatAction} 
                            className="bg-primary hover:bg-primary/90 text-white h-10 rounded-xl px-4 text-xs font-bold"
                        >
                            {isOnline ? "Start Chat" : "Open Ticket"}
                        </Button>
                    </div>

                    {/* Secondary Channels */}
                    <div className="grid grid-cols-2 gap-3">
                        <SmallSupportCard 
                            icon={<Mail size={20} />} 
                            title="Email" 
                            href="mailto:support@paysense.com" 
                        />
                        <SmallSupportCard 
                            icon={<Phone size={20} />} 
                            title="Call Us" 
                            href="tel:+1800PAYSENSE" 
                        />
                    </div>
                </div>

                <PopularTopics />

                {/* Internal Support History Links */}
                <div className="space-y-3">
                    <HistoryLink 
                        href="/app/support/chats" 
                        title="Chat History" 
                        subtitle="Your live conversations" 
                    />
                    <HistoryLink 
                        href="/app/support/tickets" 
                        title="My Tickets" 
                        subtitle="Track unresolved issues" 
                    />
                </div>

                <CreateTicketModal 
                    isOpen={isTicketModalOpen} 
                    onClose={() => setIsTicketModalOpen(false)} 
                />
            </div>
        </div>
    )
}

function HistoryLink({ href, title, subtitle }) {
    return (
        <Link href={href} className="p-5 bg-white rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm active:scale-95 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
                    <FileText size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-brand-dark">{title}</p>
                    <p className="text-[10px] text-brand-dark/50 font-bold uppercase tracking-tight">{subtitle}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
        </Link>
    )
}

function SmallSupportCard({ icon, title, href }) {
    return (
        <Link href={href} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <div className="text-primary opacity-60">{icon}</div>
            <span className="text-[11px] font-bold text-brand-dark uppercase tracking-tight">{title}</span>
        </Link>
    )
}