import { query } from "@/dbh";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Bitcoin, Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { finalizeCryptoTrade } from "@/server-functions/admin-crypto";

export default async function AdminCryptoPage() {
    const { rows: trades } = await query(`
        SELECT t.*, u.first_name, u.last_name, u.email 
        FROM paysense_transactions t
        JOIN paysense_users u ON t.user_id = u.id
        WHERE t.type IN ('crypto_buy', 'crypto_sell') AND t.status = 'pending'
        ORDER BY t.created_at DESC
        LIMIT 100
    `, []);

    return (
        <div className="space-y-6 px-4 md:px-0 pb-20">
            {/* Header section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase italic">
                    Crypto Settlement
                </h1>
                <p className="text-slate-500 text-sm md:text-base font-medium">
                    Confirm blockchain transfers and update transaction hashes.
                </p>
            </div>

            {/* --- MOBILE VIEW: Actionable Cards (Visible < 1024px) --- */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {trades.length === 0 ? (
                    <EmptyState />
                ) : (
                    trades.map((trade) => (
                        <div key={trade.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <AssetIcon asset={trade.metadata?.asset} />
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{trade.first_name} {trade.last_name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{trade.metadata?.asset || 'Crypto'}</p>
                                    </div>
                                </div>
                                <TradeBadge type={trade.type} />
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Amount USD</span>
                                    <span className="font-black text-slate-900">${parseFloat(trade.amount).toLocaleString()}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Destination Wallet</span>
                                    <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-lg">
                                        <code className="text-[10px] text-indigo-600 truncate flex-1">
                                            {trade.metadata?.wallet_address || "N/A"}
                                        </code>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                            <Copy size={12} />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <form 
                                action={async (formData) => {
                                    "use server"
                                    const hash = formData.get("txHash")
                                    await finalizeCryptoTrade(trade.id, hash)
                                }}
                                className="space-y-2"
                            >
                                <Input 
                                    name="txHash"
                                    placeholder="Enter Transaction Hash (TxID)" 
                                    className="h-12 rounded-xl bg-slate-50 border-none text-xs focus-visible:ring-indigo-500"
                                    required
                                />
                                <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold gap-2 shadow-lg shadow-slate-200">
                                    <CheckCircle2 size={16} />
                                    Finalize Settlement
                                </Button>
                            </form>
                        </div>
                    ))
                )}
            </div>

            {/* --- DESKTOP VIEW: Dense Table (Visible > 1024px) --- */}
            <div className="hidden lg:block bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100">
                            <TableHead className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Asset / User</TableHead>
                            <TableHead className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Destination Wallet</TableHead>
                            <TableHead className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Amount (USD)</TableHead>
                            <TableHead className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">Finalize Settlement</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4}><EmptyState /></TableCell>
                            </TableRow>
                        ) : (
                            trades.map((trade) => (
                                <TableRow key={trade.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <AssetIcon asset={trade.metadata?.asset} />
                                            <div>
                                                <div className="font-bold text-slate-900">{trade.first_name} {trade.last_name}</div>
                                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-tight">{trade.metadata?.asset || 'Crypto'}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-2 group">
                                            <code className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-600 max-w-[180px] truncate font-mono">
                                                {trade.metadata?.wallet_address || "No Address"}
                                            </code>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink size={12} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <div className="font-black text-slate-900 text-base">
                                            ${parseFloat(trade.amount).toLocaleString()}
                                        </div>
                                        <TradeBadge type={trade.type} />
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <form 
                                            action={async (formData) => {
                                                "use server"
                                                const hash = formData.get("txHash")
                                                await finalizeCryptoTrade(trade.id, hash)
                                            }}
                                            className="flex justify-end gap-2"
                                        >
                                            <Input 
                                                name="txHash"
                                                placeholder="Paste TX Hash..." 
                                                className="h-10 text-[11px] w-64 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                                                required
                                            />
                                            <Button size="sm" className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl shrink-0 shadow-md shadow-indigo-100">
                                                <CheckCircle2 size={16} />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

/** * UI SUB-COMPONENTS
 */

function AssetIcon({ asset }) {
    const firstLetter = asset?.charAt(0) || 'C';
    return (
        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner">
            {firstLetter}
        </div>
    );
}

function TradeBadge({ type }) {
    const isBuy = type === 'crypto_buy';
    return (
        <div className={`text-[10px] font-black flex items-center gap-1 ${isBuy ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isBuy ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
            {isBuy ? 'BUY ORDER' : 'SELL ORDER'}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Bitcoin className="opacity-20" size={40} />
            </div>
            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">All caught up</p>
            <p className="text-sm">No pending crypto trades found.</p>
        </div>
    );
}