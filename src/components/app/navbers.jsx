'use client'

import { useSession, signOut } from "next-auth/react";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext, AccountDetailsContext } from "@/server-functions/contexts";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Settings, Bell, Home, MessageSquare, LogOut } from "lucide-react"
import Link from "next/link"
import { get_unread_notification_count } from "@/server-functions/notifications";
import { useLanguage } from "@/messages/LanguageProvider"; // Importing your provider

/**
 * SHARED DATA HOOK
 * Ensures both NavBars use the exact same localized strings and data
 */
function useNavigationLogic() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const user_id = session?.user?.id;
    const { setUser } = useContext(UserContext);
    const { setAccountDetails } = useContext(AccountDetailsContext);
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    // Sync User Profile & Account
    const syncInternalData = useCallback(async () => {
        if (!user_id) return;
        try {
            const response = await fetch('/api/user/get-user-details', { 
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user_details);
                setAccountDetails(data.account_details);
            }
        } catch (error) {
            console.error("Sync Error:", error);
        }
    }, [user_id, setUser, setAccountDetails]);

    // Check Notifications
    const checkNotifications = useCallback(async () => {
        if (!user_id) return;
        const { success, count } = await get_unread_notification_count();
        if (success) setUnreadCount(count);
    }, [user_id]);

    useEffect(() => {
        syncInternalData();
    }, [pathname, syncInternalData]);

    useEffect(() => {
        checkNotifications();
        const interval = setInterval(checkNotifications, 30000);
        return () => clearInterval(interval);
    }, [checkNotifications]);

    return { unreadCount, pathname, t };
}

export function DesktopNavBar() {
    const { unreadCount, pathname, t } = useNavigationLogic();

    return (
        <aside className="hidden md:flex w-72 flex-col bg-card border-r border-border sticky top-0 h-screen p-6">
            <div className="mb-10 px-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg shadow-sm" />
                <span className="font-bold text-2xl tracking-tighter text-primary uppercase">Paysense</span>
            </div>

            <nav className="space-y-2 flex-1">
                <DesktopNavItem 
                    href="/app" 
                    icon={<Home size={20} />} 
                    label={t("NavBar", "home")} 
                    active={pathname === '/app'} 
                />
                <DesktopNavItem 
                    href="/app/notifications" 
                    icon={<Bell size={20} />} 
                    label={t("NavBar", "notifications")} 
                    active={pathname === '/app/notifications'}
                    badge={unreadCount > 0}
                />
                <DesktopNavItem 
                    href="/app/support" 
                    icon={<MessageSquare size={20} />} 
                    label={t("NavBar", "support")} 
                    active={pathname?.startsWith('/app/support')} 
                />
                <DesktopNavItem 
                    href="/app/settings" 
                    icon={<Settings size={20} />} 
                    label={t("NavBar", "settings")} 
                    active={pathname === '/app/settings'} 
                />
            </nav>

            <button 
                onClick={() => signOut()} 
                className="flex items-center gap-3 p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors mt-auto font-bold uppercase text-xs tracking-widest"
            >
                <LogOut size={20} /> {t("NavBar", "logout")}
            </button>
        </aside>
    );
}

export function MobileNavBar() {
    const { unreadCount, pathname, t } = useNavigationLogic();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border px-4 py-3">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <MobileNavItem 
                    href="/app/settings" 
                    icon={<Settings size={22} />} 
                    label={t("NavBar", "settings")} 
                    active={pathname === '/app/settings'} 
                />
                <MobileNavItem 
                    href="/app/notifications" 
                    icon={<Bell size={22} />} 
                    label={t("NavBar", "alerts")} 
                    active={pathname === '/app/notifications'}
                    badgeCount={unreadCount} 
                />
                <MobileNavItem 
                    href="/app" 
                    icon={<Home size={22} />} 
                    label={t("NavBar", "home")} 
                    active={pathname === '/app'} 
                />
                <MobileNavItem 
                    href="/app/support" 
                    icon={<MessageSquare size={22} />} 
                    label={t("NavBar", "support")} 
                    active={pathname?.startsWith('/app/support')} 
                />
                
                <button 
                    className="flex flex-col text-destructive items-center gap-1 group" 
                    onClick={() => signOut()}
                >
                    <LogOut size={22} className="group-active:scale-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                        {t("NavBar", "exit")}
                    </span>
                </button>
            </div>
        </nav>
    );
}

// Sub-components remain the same but now strictly receive the "label" prop from the parent
function DesktopNavItem({ href, icon, label, active, badge }) {
    return (
        <Link href={href} className={`flex items-center justify-between p-3.5 rounded-xl transition-all font-bold text-sm ${
            active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-primary'
        }`}>
            <div className="flex items-center gap-3">
                {icon} {label}
            </div>
            {badge && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </Link>
    );
}

function MobileNavItem({ href, icon, label, active, badgeCount }) {
    return (
        <Link href={href} className={`flex flex-col items-center gap-1 relative transition-all ${
            active ? 'text-primary scale-110' : 'text-muted-foreground'
        }`}>
            <div className="relative">
                {icon}
                {badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-card">
                        {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
        </Link>
    );
}