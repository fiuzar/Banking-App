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
import { useLanguage } from "@/messages/LanguageProvider" // Import the hook
import { HelpSearch, PopularTopics } from "@/components/app/help/help-topics"
import { CreateTicketModal } from "@/components/app/help/ticket"
import { getAgentAvailability } from "@/server-functions/support"

export default function SupportPage() {
    const router = useRouter();
    const { t } = useLanguage(); // Initialize the hook
    const [isOnline, setIsOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    useEffect(() => {
        async function checkAgentStatus() {
            try {
                const online = await getAgentAvailability();
                setIsOnline(online);
            } catch (err) {
                console.error("Status check failed:", err);
                setIsOnline(false);
            } finally {
                setIsLoading(false);
            }
        }
        checkAgentStatus();
    }, []);

    const handleChatAction = () => {
        if (isOnline) {
            router.push("/app/support/chats");
        } else {
            setIsTicketModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
                <Link href="/app" className="absolute left-6 top-6 hover:opacity-70 transition-opacity">
                    <ArrowLeft size={24} />
                </Link>
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
                    <LifeBuoy size={32} />
                </div>
                <h1 className="text-2xl font-black italic tracking-tight">
                    {t("Support", "header.title")}
                </h1>
                <p className="text-white/70 text-sm font-medium mt-1">
                    {t("Support", "header.subtitle")}
                </p>
            </div>

            <div className="max-w-md mx-auto px-6 -mt-8 space-y-6 pb-12">
                {/* Search */}
                <HelpSearch />

                {/* Primary Support Action */}
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
                                <p className="text-sm font-bold text-brand-dark">
                                    {t("Support", "liveSupport.title")}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {isLoading 
                                        ? t("Support", "liveSupport.status.checking")
                                        : isOnline 
                                            ? t("Support", "liveSupport.status.online") 
                                            : t("Support", "liveSupport.status.offline")}
                                </p>
                            </div>
                        </div>
                        <Button 
                            disabled={isLoading}
                            onClick={handleChatAction} 
                            className="bg-primary hover:bg-primary/90 text-white h-10 rounded-xl px-4 text-xs font-bold"
                        >
                            {isOnline 
                                ? t("Support", "liveSupport.actions.chat") 
                                : t("Support", "liveSupport.actions.ticket")}
                        </Button>
                    </div>

                    {/* Secondary Channels */}
                    <div className="grid grid-cols-2 gap-3">
                        <SmallSupportCard 
                            icon={<Mail size={20} />} 
                            title={t("Support", "channels.email")} 
                            href="mailto:support@paysense.com" 
                        />
                        <SmallSupportCard 
                            icon={<Phone size={20} />} 
                            title={t("Support", "channels.call")} 
                            href="tel:+1800PAYSENSE" 
                        />
                    </div>
                </div>

                {/* Popular Topics */}
                <PopularTopics />

                {/* History Links */}
                <div className="space-y-3">
                    <HistoryLink 
                        href="/app/support/chats" 
                        title={t("Support", "history.chats.title")} 
                        subtitle={t("Support", "history.chats.subtitle")} 
                    />
                    <HistoryLink 
                        href="/app/support/tickets" 
                        title={t("Support", "history.tickets.title")} 
                        subtitle={t("Support", "history.tickets.subtitle")} 
                    />
                </div>

                {/* Ticket Modal */}
                <CreateTicketModal 
                    isOpen={isTicketModalOpen} 
                    onClose={() => setIsTicketModalOpen(false)} 
                />
            </div>
        </div>
    )
}

// --- Local Components ---

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