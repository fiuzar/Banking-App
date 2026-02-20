import { getFullUserManagementData, terminate_user, updateKycStatus } from "@/server-functions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Ban, CheckCircle2, Mail, Fingerprint, Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function UserManagementDetails({ params }) {
    const { id } = await params;
    const { user, account, transactions, success } = await getFullUserManagementData(id);

    if (!success || !user) redirect("/admin");

    async function handleVerify() {
        "use server";
        await updateKycStatus(id, 'verified');
        revalidatePath(`/admin/users/${id}`);
    }

    async function handleTerminate() {
        "use server";
        await terminate_user(id);
        revalidatePath(`/admin/users/${id}`);
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
            {/* Navigation */}
            <Link href="/admin/users" className="flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors w-fit">
                <ArrowLeft size={16} className="mr-2" /> Back to User List
            </Link>

            {/* --- USER PROFILE HEADER --- */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
                    {/* Initials Avatar */}
                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-lg shadow-indigo-100">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    
                    <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 truncate">
                                {user.first_name} {user.last_name}
                            </h1>
                            {user.terminate && <Badge variant="destructive" className="animate-pulse">Terminated</Badge>}
                        </div>
                        <p className="text-slate-500 font-medium flex items-center gap-1.5 text-sm md:text-base">
                            <Mail size={14} className="text-slate-400" /> {user.email}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="capitalize bg-slate-50">{user.kyc_status}</Badge>
                            <Badge variant="secondary" className="font-mono text-[10px]">ID: {user.id}</Badge>
                        </div>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 w-full lg:w-auto">
                    <form action={handleVerify} className="w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 px-6">
                            <CheckCircle2 size={18} className="mr-2" /> Verify
                        </Button>
                    </form>
                    <form action={handleTerminate} className="w-full">
                        <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl h-12 px-6">
                            <Ban size={18} className="mr-2" /> Terminate
                        </Button>
                    </form>
                </div>
            </div>

            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <AccountStatCard 
                    label="Checking Balance" 
                    amount={account?.checking_balance} 
                    sub={account?.checking_account_number} 
                    icon={<Fingerprint size={16} className="text-slate-400" />}
                />
                <AccountStatCard 
                    label="Savings Balance" 
                    amount={account?.savings_balance} 
                    sub={account?.savings_account_number} 
                    icon={<Calendar size={16} className="text-slate-400" />}
                />
                <AccountStatCard 
                    label="Stripe Connection" 
                    amount={user.stripe_connect_id || "None"} 
                    isRaw 
                />
            </div>

            {/* --- TRANSACTION LOG --- */}
            <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-black text-slate-900">Recent Activity</h3>
                    <Badge variant="outline" className="text-slate-400 border-slate-200">Last 50</Badge>
                </div>
                
                {/* Horizontal Scroll for Table on Small Screens */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="font-bold min-w-[120px]">Date</TableHead>
                                <TableHead className="font-bold min-w-[200px]">Description</TableHead>
                                <TableHead className="font-bold">Amount</TableHead>
                                <TableHead className="font-bold text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-slate-400 font-medium">
                                        No transaction history found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="text-slate-500 text-xs">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-800 text-sm">
                                            {tx.description}
                                        </TableCell>
                                        <TableCell className={`${tx.type === 'DEBIT' ? "text-red-600" : "text-emerald-600"} font-bold`}>
                                            {tx.type === 'DEBIT' ? '-' : '+'}${parseFloat(tx.amount).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter">
                                                {tx.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function AccountStatCard({ label, amount, sub, isRaw = false, icon }) {
    return (
        <Card className="rounded-[20px] md:rounded-[24px] border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xl md:text-2xl font-black text-slate-900 truncate">
                    {isRaw ? amount : `$${parseFloat(amount || 0).toLocaleString()}`}
                </p>
                {sub && (
                    <p className="text-[10px] md:text-xs font-mono text-slate-400 mt-1 flex items-center gap-1">
                        {icon} {sub}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}