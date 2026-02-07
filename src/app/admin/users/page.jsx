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
import { ExternalLink, ShieldCheck, UserCog } from "lucide-react";

export default async function AdminPage() {
    const { users = [] } = await getAdminUsers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">User Management</h1>
                    <p className="text-slate-500">Review and manage all registered Paysense accounts.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl">
                    <span className="text-indigo-700 font-bold text-sm">{users.length} Total Users</span>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
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
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">{user.first_name} {user.last_name}</span>
                                        <span className="text-xs text-slate-500">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={user.role === 'admin' ? "bg-purple-100 text-purple-700 border-none" : "bg-slate-100 text-slate-600 border-none"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            user.kyc_status === 'verified' ? "bg-green-500" : "bg-amber-500"
                                        )} />
                                        <span className="text-sm font-medium capitalize">{user.kyc_status || 'Unverified'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600">
                                        {user.stripe_connect_id || "No Stripe ID"}
                                    </code>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/users/${user.id}`}>
    <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200">
        <UserCog size={14} className="mr-2" />
        Manage
    </Button>
</Link>
                                        {user.stripe_connect_id && (
                                            <Button variant="ghost" size="sm" className="h-8 text-indigo-600">
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

// Simple helper for conditional classes
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}