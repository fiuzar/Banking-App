import { getFullUserManagementData, terminate_user, updateKycStatus } from "@/server-functions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, UserMinus, ArrowLeft, CreditCard, Ban, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function UserManagementDetails({ params }) {
    const { id } = params;
    const { user, account, transactions, success } = await getFullUserManagementData(id);

    if (!success || !user) redirect("/admin");

    // Server Actions for the buttons
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
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Link href="/admin" className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to User List
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-indigo-200">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900">{user.first_name} {user.last_name}</h1>
                            {user.terminate && <Badge variant="destructive" className="animate-pulse">Terminated</Badge>}
                        </div>
                        <p className="text-slate-500 font-medium">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="capitalize">{user.kyc_status}</Badge>
                            <Badge variant="secondary">ID: {user.id}</Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <form action={handleVerify} className="flex-1">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12">
                            <CheckCircle2 size={18} className="mr-2" /> Verify Account
                        </Button>
                    </form>
                    <form action={handleTerminate} className="flex-1">
                        <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl h-12">
                            <Ban size={18} className="mr-2" /> Terminate
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AccountStatCard label="Checking Balance" amount={account?.checking_balance} sub={account?.checking_account_number} />
                <AccountStatCard label="Savings Balance" amount={account?.savings_balance} sub={account?.savings_account_number} />
                <AccountStatCard label="Stripe Status" amount={user.stripe_connect_id || "None"} isRaw />
            </div>

            {/* Transaction Log */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="font-black text-slate-900">Recent Activity (Last 50)</h3>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="font-bold">Date</TableHead>
                            <TableHead className="font-bold">Description</TableHead>
                            <TableHead className="font-bold">Amount</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell className="text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="font-semibold text-slate-800">{tx.description}</TableCell>
                                <TableCell className={tx.type === 'DEBIT' ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
                                    {tx.type === 'DEBIT' ? '-' : '+'}${tx.amount}
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-[10px] uppercase font-black">{tx.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function AccountStatCard({ label, amount, sub, isRaw = false }) {
    return (
        <Card className="rounded-[24px] border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-black text-slate-900">
                    {isRaw ? amount : `$${parseFloat(amount || 0).toLocaleString()}`}
                </p>
                {sub && <p className="text-xs font-mono text-slate-400 mt-1">{sub}</p>}
            </CardContent>
        </Card>
    );
}