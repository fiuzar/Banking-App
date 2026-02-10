export function formatRelativeTime(dateInput) {
    // 1. If date is missing entirely, just say "now"
    if (!dateInput) return "now";
    
    // 2. Convert string/timestamp to a real Javascript Date object
    const past = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    // 3. If the date is garbled or invalid, return "now" instead of crashing
    if (isNaN(past.getTime())) return "now";

    const now = new Date();
    const diffInSeconds = Math.floor((now - past) / 1000);

    // 4. The Math
    if (diffInSeconds < 60) return "now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    // 5. Fallback for old notifications: "Oct 12"
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}