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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Overview</h1>
                <p className="text-slate-500 font-medium">Monitoring Paysense performance and liquidity.</p>
            </div>

            {/* --- TOP STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={stats?.totalUsers} 
                    icon={<Users className="text-blue-600" />} 
                    trend="+12% from last month" 
                />
                <StatCard 
                    title="Total Liquidity" 
                    value={`$${parseFloat(stats?.totalLiquidity).toLocaleString()}`} 
                    icon={<Wallet className="text-green-600" />} 
                    trend="System Wide" 
                />
                <StatCard 
                    title="Pending Wires" 
                    value={stats?.pendingActions} 
                    icon={<AlertCircle className="text-amber-600" />} 
                    trend="Requires Attention"
                    isAlert={stats?.pendingActions > 0}
                />
                <StatCard 
                    title="KYC Verified" 
                    value={stats?.kycData.find(k => k.kyc_status === 'verified')?.count || 0} 
                    icon={<TrendingUp className="text-indigo-600" />} 
                    trend="Trust Score" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- QUICK ACTIONS --- */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-black text-slate-900 px-1">Quick Actions</h2>
                    <div className="grid gap-3">
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

                {/* --- ACTIVITY PLACEHOLDER --- */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="text-slate-300" size={32} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Volume Visualization</h3>
                    <p className="text-slate-500 text-sm max-w-xs">
                        Transaction volume charts will appear here as the system processes more wires and crypto trades.
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, isAlert }) {
    return (
        <div className={`bg-white p-6 rounded-[28px] border transition-all ${isAlert ? 'border-amber-200 shadow-lg shadow-amber-500/5' : 'border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    {icon}
                </div>
                {isAlert && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 my-1">{value}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{trend}</p>
        </div>
    )
}

function QuickActionLink({ href, title, desc, icon }) {
    return (
        <Link href={href} className="group bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:border-indigo-500 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {icon}
            </div>
            <div>
                <p className="font-bold text-slate-900 leading-tight">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
        </Link>
    )
}