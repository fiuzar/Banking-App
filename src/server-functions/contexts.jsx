import { createContext } from "react";

export const UserContext = createContext({
    user: {},
    setUser: () => {}
});

export const AccountDetailsContext = createContext({
    accountDetails: {},
    setAccountDetails: () => {}
});

const syncNotifications = async () => {
    const res = await fetch('/api/notifications/unread-count'); // Or a server action
    const data = await res.json();
    setUnreadCount(data.count);
};

// Polling: Sync every 30 seconds
useEffect(() => {
    syncNotifications();
    const interval = setInterval(syncNotifications, 30000); 
    return () => clearInterval(interval);
}, []);