import { query } from "@/dbh";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { CheckCircle, XCircle, Banknote, Clock, User, Hash } from "lucide-react";
import { approveWireTransfer } from "@/server-functions/admin-finance";

export default async function AdminWiresPage() {
    const { rows: transactions } = await query(`
        SELECT t.*, u.first_name, u.last_name, u.email 
        FROM paysense_transactions t
        JOIN paysense_users u ON t.user_id = u.id
        WHERE t.status = 'pending'
        ORDER BY t.created_at ASC
    `, []);

    return (
        <div className="space-y-6">
            <div className="px-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Wire Queue</h1>
                <p className="text-sm md:text-base text-slate-500">Manual verification required for fiat movements.</p>
            </div>

            {/* --- TOP STATS --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <StatCard label="Deposits" value={transactions.filter(t => t.type === 'deposit').length} icon={<Banknote size={20} className="text-green-600" />} />
                <StatCard label="Withdrawals" value={transactions.filter(t => t.type === 'withdrawal').length} icon={<Clock size={20} className="text-amber-600" />} />
                {/* Visible on md+ to fill space */}
                <div className="hidden md:flex bg-indigo-50 p-6 rounded-[24px] border border-indigo-100 items-center justify-between">
                    <p className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Total Queue</p>
                    <p className="text-2xl font-black text-indigo-900">{transactions.length}</p>
                </div>
            </div>

            {/* --- DESKTOP VIEW (Table) --- */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold">Date</TableHead>
                            <TableHead className="font-bold">User</TableHead>
                            <TableHead className="font-bold">Type</TableHead>
                            <TableHead className="font-bold">Amount</TableHead>
                            <TableHead className="font-bold">Ref Code</TableHead>
                            <TableHead className="text-right font-bold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? <EmptyState /> : transactions.map((tx) => (
                            <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-xs text-slate-500 font-medium">
                                    {new Date(tx.created_at).toLocaleDateString()} <br/>
                                    <span className="opacity-60">{new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="font-bold text-slate-900">{tx.first_name} {tx.last_name}</div>
                                    <div className="text-[10px] text-slate-500">{tx.email}</div>
                                </TableCell>
                                <TableCell>
                                    <TypeBadge type={tx.type} />
                                </TableCell>
                                <TableCell className="font-mono font-bold text-slate-900">
                                    ${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200">{tx.reference_code}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <ActionButtons tx={tx} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* --- MOBILE VIEW (Card List) --- */}
            <div className="md:hidden space-y-4">
                {transactions.length === 0 ? <EmptyState /> : transactions.map((tx) => (
                    <div key={tx.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-2 items-center">
                                <TypeBadge type={tx.type} />
                                <span className="text-[10px] font-mono text-slate-400">#{tx.reference_code}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="mb-4">
                            <div className="font-black text-lg text-slate-900">
                                ${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-sm font-bold text-slate-600 flex items-center gap-1">
                                <User size={12} /> {tx.first_name} {tx.last_name}
                            </div>
                        </div>

                        <ActionButtons tx={tx} fullWidth />
                    </div>
                ))}
            </div>
        </div>
    );
}

/** * UI SUB-COMPONENTS
 */

function ActionButtons({ tx, fullWidth }) {
    return (
        <div className={`flex items-center gap-2 ${fullWidth ? 'w-full' : 'justify-end'}`}>
            <form action={async () => {
                "use server"
                await approveWireTransfer(tx.id, tx.user_id, tx.amount, tx.type)
            }} className={fullWidth ? "flex-1" : ""}>
                <Button size="sm" className={`bg-green-800 hover:bg-green-900 rounded-lg h-9 md:h-8 ${fullWidth ? 'w-full' : ''}`}>
                    <CheckCircle size={14} className="mr-1" /> Approve
                </Button>
            </form>
            <Button variant="ghost" size="sm" className="h-9 md:h-8 text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent md:border-none">
                <XCircle size={14} className="md:mr-1" /> <span className="md:hidden lg:inline">Reject</span>
            </Button>
        </div>
    );
}

function TypeBadge({ type }) {
    return (
        <Badge variant="outline" className={`font-black tracking-tighter text-[10px] ${
            type === 'deposit' 
            ? "text-green-600 border-green-200 bg-green-50" 
            : "text-amber-600 border-amber-200 bg-amber-50"
        }`}>
            {type.toUpperCase()}
        </Badge>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-16 bg-white rounded-[24px] border border-dashed border-slate-300">
            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-slate-300" size={24} />
            </div>
            <p className="text-slate-400 font-bold">No pending wires to process.</p>
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[24px] border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-xl md:text-2xl font-black text-slate-900">{value}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                {icon}
            </div>
        </div>
    )
}