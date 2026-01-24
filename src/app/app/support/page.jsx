'use client'

import {
    ArrowLeft,
    MessageCircle,
    Mail,
    Phone,
    ChevronRight,
    LifeBuoy,
    FileText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpSearch, PopularTopics } from "@/components/app/help/help-topics"
import TawkChat from "@/components/app/help/tawkChat"
import { useSession } from "next-auth/react"
import { CreateTicketModal } from "@/components/app/help/ticket"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function SupportPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    
    // Check if user is currently searching
    const isSearching = !!searchParams.get('q');
    
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    const handleChatStart = () => {
        if (window.Tawk_API) {
            // If offline, Tawk automatically shows the Email/Ticket form
            // If online, it starts a live session
            window.Tawk_API.maximize();
            window.Tawk_API.showWidget();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Load Tawk Script & Identify User */}
            <TawkChat 
                name={session?.user?.name || ""} 
                email={session?.user?.email || ""} 
            />

            {/* Header */}
            <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
                <Link href="/app" className="absolute left-6 top-6 hover:opacity-70 transition-opacity">
                    <ArrowLeft size={24} />
                </Link>
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
                    <LifeBuoy size={32} />
                </div>
                <h1 className="text-2xl font-black italic tracking-tight">How can we help?</h1>
                <p className="text-white/70 text-sm font-medium mt-1">We&apos;re here 24/7 for your peace of mind.</p>
            </div>

            <div className="max-w-md mx-auto px-6 -mt-8 space-y-6 pb-12">
                {/* Search Bar - Always visible */}
                <HelpSearch />

                {/* 1. Support Channels - HIDE WHEN SEARCHING for better focus */}
                {!isSearching && (
                    <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <SupportCard
                            icon={<MessageCircle className="text-primary" />}
                            title="Live Chat"
                            desc="Average wait: 2 mins"
                            action="Start Chat"
                            onClick={handleChatStart}
                        />
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
                )}

                {/* 2. FAQ / Search Results - This will now move up when search starts */}
                <PopularTopics />

                {/* 3. Ticket Section - HIDE WHEN SEARCHING */}
                {!isSearching && (
                    <div
                        onClick={() => setIsTicketModalOpen(true)}
                        className="p-5 bg-white rounded-[24px] border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-dark">My Support Tickets</p>
                                <p className="text-[10px] text-bank-success font-bold uppercase tracking-tighter">View or open tickets</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-n-300" />
                    </div>
                )}

                <CreateTicketModal
                    isOpen={isTicketModalOpen}
                    onClose={() => setIsTicketModalOpen(false)}
                />
            </div>
        </div>
    )
}

function SupportCard({ icon, title, desc, action, onClick }) {
    return (
        <div className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-brand-dark">{title}</p>
                    <p className="text-xs text-n-500">{desc}</p>
                </div>
            </div>
            {/* Added onClick here - previously the button didn't trigger anything */}
            <Button onClick={onClick} className="bg-primary hover:bg-primary/90 text-white h-10 rounded-xl px-4 text-xs font-bold">
                {action}
            </Button>
        </div>
    )
}

function SmallSupportCard({ icon, title, href }) {
    return (
        <Link
            href={href}
            className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
            <div className="text-primary opacity-60">{icon}</div>
            <span className="text-[11px] font-bold text-brand-dark uppercase tracking-tight">{title}</span>
        </Link>
    )
}