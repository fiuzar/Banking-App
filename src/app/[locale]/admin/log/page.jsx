import { query } from "@/dbh";
import { Badge } from "@/components/ui/badge";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { History, ShieldAlert, Activity } from "lucide-react";

export default async function AdminLogsPage() {
    const { rows: logs } = await query(`
        SELECT l.*, 
               a.first_name as admin_f, a.last_name as admin_l,
               u.email as target_email
        FROM paysense_audit_logs l
        JOIN paysense_users a ON l.admin_id = a.id
        LEFT JOIN paysense_users u ON l.target_user_id = u.id
        ORDER BY l.created_at DESC
        LIMIT 100
    `, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                    <History size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">System Logs</h1>
                    <p className="text-slate-500 font-medium">Complete audit trail of all administrative actions.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold">Timestamp</TableHead>
                            <TableHead className="font-bold">Admin</TableHead>
                            <TableHead className="font-bold">Action</TableHead>
                            <TableHead className="font-bold">Target User</TableHead>
                            <TableHead className="font-bold">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="text-sm">
                                <TableCell className="whitespace-nowrap text-slate-500 font-mono text-[11px]">
                                    {new Date(log.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-bold text-slate-900">
                                    {log.admin_f} {log.admin_l}
                                </TableCell>
                                <TableCell>
                                    <Badge className={getActionStyle(log.action_type)}>
                                        {log.action_type.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    {log.target_email || "System"}
                                </TableCell>
                                <TableCell className="max-w-[300px]">
                                    <div className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono truncate hover:whitespace-normal transition-all">
                                        {JSON.stringify(log.details)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function getActionStyle(type) {
    if (type.includes('APPROVE')) return "bg-green-100 text-green-700 border-none";
    if (type.includes('KYC')) return "bg-blue-100 text-blue-700 border-none";
    if (type.includes('CRYPTO')) return "bg-orange-100 text-orange-700 border-none";
    return "bg-slate-100 text-slate-600 border-none";
}