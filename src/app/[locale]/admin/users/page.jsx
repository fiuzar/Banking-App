import { getAdminUsers } from "@/server-functions/admin";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck, UserCog, Search, Mail, Calendar } from "lucide-react";
import Link from "next/link"

export default async function AdminPage() {
    const { users = [] } = await getAdminUsers();

    return (
        <div className="space-y-6">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 px-1">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">User Management</h1>
                    <p className="text-sm md:text-base text-slate-500 font-medium">Review and manage all registered Paysense accounts.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl self-start sm:self-auto">
                    <span className="text-indigo-700 font-bold text-sm">{users.length} Total Users</span>
                </div>
            </div>

            {/* --- MOBILE USERS LIST (Cards) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {users.map((user) => (
                    <div key={user.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                                <span className="font-black text-slate-900">{user.first_name} {user.last_name}</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Mail size={12} /> {user.email}
                                </span>
                            </div>
                            <Badge className={user.role === 'admin' ? "bg-purple-100 text-purple-700 border-none" : "bg-slate-100 text-slate-600 border-none"}>
                                {user.role}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50 mb-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">KYC Status</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className={cn("w-2 h-2 rounded-full", user.kyc_status === 'verified' ? "bg-green-500" : "bg-amber-500")} />
                                    <span className="text-xs font-bold capitalize">{user.kyc_status || 'Unverified'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Joined</p>
                                <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-700">
                                    <Calendar size={12} className="text-slate-400" />
                                    {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/admin/users/${user.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full h-10 rounded-xl border-slate-200 font-bold">
                                    <UserCog size={14} className="mr-2" /> Manage
                                </Button>
                            </Link>
                            {user.stripe_connect_id && (
                                <Button variant="secondary" size="sm" className="h-10 w-10 p-0 rounded-xl text-indigo-600">
                                    <ExternalLink size={16} />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- DESKTOP USERS TABLE --- */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold text-slate-700">User</TableHead>
                            <TableHead className="font-bold text-slate-700">Role</TableHead>
                            <TableHead className="font-bold text-slate-700">KYC Status</TableHead>
                            <TableHead className="font-bold text-slate-700">Stripe ID</TableHead>
                            <TableHead className="font-bold text-slate-700">Joined</TableHead>
                            <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col min-w-[150px]">
                                        <span className="font-bold text-slate-900">{user.first_name} {user.last_name}</span>
                                        <span className="text-xs text-slate-500 truncate">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={user.role === 'admin' ? "bg-purple-100 text-purple-700 border-none font-bold" : "bg-slate-100 text-slate-600 border-none font-bold"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            user.kyc_status === 'verified' ? "bg-green-500" : "bg-amber-500"
                                        )} />
                                        <span className="text-sm font-bold capitalize">{user.kyc_status || 'Unverified'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                                        {user.stripe_connect_id || "No Stripe ID"}
                                    </code>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500 font-medium">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/users/${user.id}`}>
                                            <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 hover:bg-slate-50 font-bold">
                                                <UserCog size={14} className="mr-2" /> Manage
                                            </Button>
                                        </Link>
                                        {user.stripe_connect_id && (
                                            <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                <ExternalLink size={14} />
                                            </Button>
                                        )}
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

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}