'use client'

import { useSession } from "next-auth/react";
import { useContext, useState, useEffect, use } from "react";
import { UserContext, AccountDetailsContext } from "@/server-functions/contexts";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { Settings, Bell, Home, MessageSquare, LogOut } from "lucide-react"
import Link from "next/link"

import { getCurrentUser } from "@/server-functions/authentication";

export function DesktopNaBar() {

    const { data: session } = useSession();
    const user_id = session?.user?.id;
    const { user, setUser } = useContext(UserContext);
    const { accountDetails, setAccountDetails } = useContext(AccountDetailsContext)
    const pathname = usePathname()
    const [lang, setLang] = useState("en")


    useEffect(() => {
        // Auto-detect browser language
        const browserLang = navigator.language.split('-')[0]
        if (["en", "fr", "es"].includes(browserLang)) setLang(browserLang)
    }, [])

    useEffect(() => {

        async function fetchUser() {
            if (!user_id) return;

            const { success, user_details, account_details } = await getCurrentUser();

            if (success) {
                setUser(user_details[0])
                setAccountDetails(account_details[0])
            }
        }

        fetchUser();

    }, [user_id]);

    return (
        <aside className="hidden md:flex w-72 flex-col bg-card border-r border-border sticky top-0 h-screen p-6">
            <div className="mb-10 px-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg" />
                <span className="font-bold text-2xl tracking-tighter text-primary">Paysense</span>
            </div>

            <nav className="space-y-2 flex-1">
                <DesktopNavItem href="/app" icon={<Home size={20} />} label="Home" active={pathname === '/app'} />
                <DesktopNavItem href="/app/notifications" icon={<Bell size={20} />} label="Notifications" />
                <DesktopNavItem href="/app/support" icon={<MessageSquare size={20} />} label="Support" />
                <DesktopNavItem href="/app/settings" icon={<Settings size={20} />} label="Settings" />
            </nav>

            <button className="flex items-center gap-3 p-4 text-destructive hover:bg-destructive/10 rounded-brand-button transition-colors mt-auto font-medium">
                <LogOut size={20} /> Logout
            </button>
        </aside>
    )
}

export function MobileNavBar() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <MobileNavItem href="/app/settings" icon={<Settings size={22} />} label="Settings" />
                <MobileNavItem href="/app/notifications" icon={<Bell size={22} />} label="Alerts" />
                <MobileNavItem href="/app" icon={<Home size={22} />} label="Home" active={pathname === '/app'} />
                <MobileNavItem href="/app/support" icon={<MessageSquare size={22} />} label="Support" />
                <Button variant="ghost" className={`flex flex-col text-red-700 items-center gap-1 transition-colors `} onClick={() => signOut()}>
                    <LogOut size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Exit</span>
                </Button>
            </div>
        </nav>
    )
}

function DesktopNavItem({ href, icon, label, active }) {
    return (
        <Link href={href} className={`flex items-center gap-3 p-3.5 rounded-brand-button transition-all font-medium ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-primary'}`}>
            {icon} {label}
        </Link>
    )
}

function MobileNavItem({ href, icon, label, active, badgeCount }) {
    return (
        <Link href={href} className={`flex flex-col items-center gap-1 relative transition-colors ${active ? 'text-primary' : 'text-n-500'}`}>
            <div className="relative">
                {icon}
                {/* The Red Dot Badge */}
                {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                        {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </Link>
    )
}