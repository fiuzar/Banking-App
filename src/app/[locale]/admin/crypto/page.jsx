import { query } from "@/dbh";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Bitcoin, Wallet, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { finalizeCryptoTrade } from "@/server-functions/admin-crypto";

export default async function AdminCryptoPage() {
    // Fetch pending crypto trades
    const { rows: trades } = await query(`
        SELECT t.*, u.first_name, u.last_name, u.email 
        FROM paysense_transactions t
        JOIN paysense_users u ON t.user_id = u.id
        WHERE t.type IN ('crypto_buy', 'crypto_sell') AND t.status = 'pending'
        ORDER BY t.created_at DESC
    `, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Crypto Settlement</h1>
                <p className="text-slate-500">Confirm blockchain transfers and update transaction hashes.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold">Asset / User</TableHead>
                            <TableHead className="font-bold">Destination Wallet</TableHead>
                            <TableHead className="font-bold">Amount (USD)</TableHead>
                            <TableHead className="font-bold">Finalize</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-16 text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Bitcoin className="opacity-20" size={48} />
                                        <p>No pending crypto trades found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            trades.map((trade) => (
                                <TableRow key={trade.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold">
                                                {trade.metadata?.asset?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{trade.first_name} {trade.last_name}</div>
                                                <div className="text-[10px] text-slate-500 uppercase font-black">{trade.metadata?.asset || 'Crypto'}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="text-[10px] bg-slate-100 p-1.5 rounded text-slate-600 max-w-[150px] truncate">
                                                {trade.metadata?.wallet_address || "No Address Provided"}
                                            </code>
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <Wallet size={12} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-slate-900">
                                            ${parseFloat(trade.amount).toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-green-600 font-bold flex items-center">
                                            <ArrowUpRight size={10} className="mr-1" /> BUY
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <form 
                                            action={async (formData) => {
                                                "use server"
                                                const hash = formData.get("txHash")
                                                await finalizeCryptoTrade(trade.id, hash)
                                            }}
                                            className="flex gap-2"
                                        >
                                            <Input 
                                                name="txHash"
                                                placeholder="Paste TX Hash..." 
                                                className="h-8 text-[10px] w-48 rounded-lg"
                                                required
                                            />
                                            <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                                                <CheckCircle2 size={14} />
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