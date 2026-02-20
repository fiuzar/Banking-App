import { getAdminStats } from "@/server-functions/admin-stats";
import { 
    Users, 
    Wallet, 
    AlertCircle, 
    TrendingUp, 
    ArrowUpRight, 
    CreditCard 
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-6 md:space-y-8">
            {/* --- HEADER --- */}
            <div className="px-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                    Platform Overview
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium">
                    Monitoring Paysense performance and liquidity.
                </p>
            </div>

            {/* --- TOP STATS --- */}
            {/* Changed to grid-cols-2 on small screens to save vertical space */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard 
                    title="Total Users" 
                    value={stats?.totalUsers} 
                    icon={<Users className="text-blue-600" size={20} />} 
                    trend="+12% from last month" 
                />
                <StatCard 
                    title="Liquidity" 
                    value={`$${parseFloat(stats?.totalLiquidity || 0).toLocaleString()}`} 
                    icon={<Wallet className="text-green-600" size={20} />} 
                    trend="System Wide" 
                />
                <StatCard 
                    title="Pending" 
                    value={stats?.pendingActions} 
                    icon={<AlertCircle className="text-amber-600" size={20} />} 
                    trend="Requires Action"
                    isAlert={stats?.pendingActions > 0}
                />
                <StatCard 
                    title="Verified" 
                    value={stats?.kycData?.find(k => k.kyc_status === 'verified')?.count || 0} 
                    icon={<TrendingUp className="text-indigo-600" size={20} />} 
                    trend="Trust Score" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* --- QUICK ACTIONS --- */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-black text-slate-900 px-1">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                        <QuickActionLink 
                            href="/admin/users" 
                            title="Verify KYC" 
                            desc="Check pending Stripe IDs" 
                            icon={<CreditCard size={20}/>} 
                        />
                        <QuickActionLink 
                            href="/admin/wires" 
                            title="Approve Wires" 
                            desc="Move fiat to checking" 
                            icon={<ArrowUpRight size={20}/>} 
                        />
                    </div>
                </div>

                {/* --- ACTIVITY VISUALIZATION --- */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-6 md:p-12 flex flex-col justify-center items-center text-center min-h-[300px]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="text-slate-300" size={32} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Volume Visualization</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Transaction volume charts will appear here as the system processes more wires and crypto trades.
                    </p>
                    
                    {/* Visual aid for context */}
                    
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, isAlert }) {
    return (
        <div className={`bg-white p-4 md:p-6 rounded-[20px] md:rounded-[28px] border transition-all ${
            isAlert ? 'border-amber-200 shadow-lg shadow-amber-500/5' : 'border-slate-200 shadow-sm'
        }`}>
            <div className="flex justify-between items-start mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center">
                    {icon}
                </div>
                {isAlert && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>}
            </div>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest truncate">{title}</p>
            <h3 className="text-lg md:text-2xl font-black text-slate-900 my-0.5 md:my-1 truncate">{value}</h3>
            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{trend}</p>
        </div>
    )
}

function QuickActionLink({ href, title, desc, icon }) {
    return (
        <Link href={href} className="group bg-white p-4 rounded-xl md:rounded-2xl border border-slate-200 flex items-center gap-4 hover:border-indigo-500 hover:shadow-md transition-all active:scale-[0.98]">
            <div className="w-10 h-10 shrink-0 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="font-bold text-slate-900 leading-tight truncate">{title}</p>
                <p className="text-xs text-slate-500 truncate">{desc}</p>
            </div>
        </Link>
    )
}