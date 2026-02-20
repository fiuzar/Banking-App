import { query } from "@/dbh";
import { Badge } from "@/components/ui/badge";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { History, User, Target, Terminal } from "lucide-react";

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
        <div className="space-y-6 px-4 md:px-0 pb-10">
            {/* Header - Adapts from Stacked to Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-2xl w-fit shadow-lg shadow-slate-200">
                    <History size={24} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase italic">
                        System Logs
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Audit trail of administrative actions.
                    </p>
                </div>
            </div>

            {/* --- MOBILE VIEW: Card List (Visible < 768px) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {logs.map((log) => (
                    <div key={log.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <Badge className={`${getActionStyle(log.action_type)} text-[10px] uppercase font-black`}>
                                {log.action_type.replace('_', ' ')}
                            </Badge>
                            <span className="text-[10px] font-mono text-slate-400">
                                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-400" />
                                <p className="text-sm font-bold text-slate-900">{log.admin_f} {log.admin_l}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Target size={14} className="text-slate-400" />
                                <p className="text-xs text-slate-600 truncate">{log.target_email || "System Level"}</p>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-1">
                                    <Terminal size={12} /> Details
                                </div>
                                <pre className="text-[11px] bg-slate-50 p-2 rounded-lg font-mono text-slate-500 overflow-x-auto whitespace-pre-wrap">
                                    {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                                </pre>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- DESKTOP VIEW: Table (Visible > 768px) --- */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100">
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">Timestamp</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">Admin</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">Action</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">Target</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">Payload</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                                <TableCell className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-[10px]">
                                    {new Date(log.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell className="px-6 py-4 font-bold text-slate-800">
                                    {log.admin_f} {log.admin_l}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge className={`${getActionStyle(log.action_type)} text-[10px] px-2 py-0.5`}>
                                        {log.action_type.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-slate-600 font-medium text-xs">
                                    {log.target_email || <span className="text-slate-300 italic">System</span>}
                                </TableCell>
                                <TableCell className="px-6 py-4 max-w-[250px]">
                                    <div className="text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-slate-500 truncate hover:whitespace-normal transition-all cursor-help">
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

function getActionStyle(type: string) {
    const t = type.toUpperCase();
    if (t.includes('APPROVE') || t.includes('SUCCESS')) return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none";
    if (t.includes('KYC') || t.includes('USER')) return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none";
    if (t.includes('CRYPTO') || t.includes('WITHDRAW')) return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none";
    if (t.includes('TERMINATE') || t.includes('BAN') || t.includes('FAIL')) return "bg-red-100 text-red-700 hover:bg-red-100 border-none";
    return "bg-slate-100 text-slate-600 hover:bg-slate-100 border-none";
}