"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Mail, HeadphonesIcon, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useLanguage } from "@/messages/LanguageProvider"

export default function TerminatedPage() {
    const { t } = useLanguage()

    // Prevent new random ID on every re-render
    const referenceId = useMemo(() => {
        return Math.random().toString(36).substr(2, 9).toUpperCase()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                
                {/* Visual Alert */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
                    <div className="relative bg-white shadow-xl rounded-full w-24 h-24 flex items-center justify-center border-4 border-red-50">
                        <ShieldAlert size={48} className="text-red-500" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {t("Terminated", "title")}
                    </h1>

                    <p className="text-slate-500 font-medium leading-relaxed px-4">
                        {t("Terminated", "description")}
                    </p>
                </div>

                {/* Support Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200 text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        {t("Terminated", "appeal.header")}
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    {t("Terminated", "appeal.emailTitle")}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {t("Terminated", "appeal.emailAddress")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                <HeadphonesIcon size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    {t("Terminated", "appeal.chatTitle")}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {t("Terminated", "appeal.chatAvailability")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-4">
                    <Button 
                        onClick={() => window.location.href = `mailto:${t("Terminated", "appeal.emailAddress")}`}
                        className="w-full h-14 rounded-2xl bg-slate-900 font-black text-white shadow-lg shadow-slate-200"
                    >
                        {t("Terminated", "actions.contact")}
                    </Button>
                    
                    <button 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center justify-center gap-2 w-full text-slate-400 hover:text-red-500 font-bold transition-colors"
                    >
                        <LogOut size={16} />
                        {t("Terminated", "actions.logout")}
                    </button>
                </div>

                <p className="text-[10px] text-slate-400 font-medium">
                    {t("Terminated", "meta.reference")}: {referenceId}
                </p>
            </div>
        </div>
    )
}
