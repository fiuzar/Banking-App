import { query } from "@/dbh";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { CheckCircle, XCircle, Banknote, Clock } from "lucide-react";
import { approveWireTransfer } from "@/server-functions/admin-finance";

export default async function AdminWiresPage() {
    // Fetch pending transactions joined with user names
    const { rows: transactions } = await query(`
        SELECT t.*, u.first_name, u.last_name, u.email 
        FROM paysense_transactions t
        JOIN paysense_users u ON t.user_id = u.id
        WHERE t.status = 'pending'
        ORDER BY t.created_at ASC
    `, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Wire Queue</h1>
                <p className="text-slate-500">Manual verification required for fiat movements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Pending Deposits" value={transactions.filter(t => t.type === 'deposit').length} icon={<Banknote className="text-green-600" />} />
                <StatCard label="Pending Withdrawals" value={transactions.filter(t => t.type === 'withdrawal').length} icon={<Clock className="text-amber-600" />} />
            </div>

            <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
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
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                                    No pending wires to process.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="text-xs text-slate-500">
                                        {new Date(tx.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-slate-900">{tx.first_name} {tx.last_name}</div>
                                        <div className="text-[10px] text-slate-500">{tx.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={tx.type === 'deposit' ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 border-amber-200 bg-amber-50"}>
                                            {tx.type.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono font-bold text-slate-900">
                                        ${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{tx.reference_code}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <form action={async () => {
                                                "use server"
                                                await approveWireTransfer(tx.id, tx.user_id, tx.amount, tx.type)
                                            }}>
                                                <Button size="sm" className="bg-green-800 hover:bg-green-900 rounded-lg h-8">
                                                    <CheckCircle size={14} className="mr-1" /> Approve
                                                </Button>
                                            </form>
                                            <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:bg-red-50">
                                                <XCircle size={14} />
                                            </Button>
                                        </div>
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

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                {icon}
            </div>
        </div>
    )
}