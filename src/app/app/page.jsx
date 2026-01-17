// import React from "react";
// import {
//   Bell, Send, Receipt, ArrowDownToLine, Wallet,
//   CreditCard, Search, Filter, Euro, DollarSign, PoundSterling,
//   ArrowRightLeft, TrendingUp, ShieldCheck
// } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";

// // Updated imports to match your file structure
// import { TransactionItem } from "@/components/app/transaction-item";
// import { AccountCard } from "@/components/app/account-card";

// export default function DashboardPage() {
//   return (
//     <div className="flex flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">

//       {/* 1. TOP HEADER & SYSTEM STATUS */}
//       <header className="flex items-center justify-between">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <h2 className="text-2xl font-bold tracking-tight text-purple-600">Welcome back, John</h2>
//             <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 rounded-full">
//               <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
//               <span className="text-[10px] font-medium text-emerald-700">Systems Live</span>
//             </div>
//           </div>
//           <p className="text-sm text-muted-foreground">Global Markets are open. EUR/USD is up 0.2%.</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <Button variant="outline" size="icon" className="relative rounded-full border-slate-200">
//             <Bell className="h-5 w-5 text-slate-600" />
//             <span className="absolute top-1 right-1 h-2 w-2 bg-purple-600 rounded-full border-2 border-background" />
//           </Button>
//           <Avatar className="h-10 w-10 border-2 border-purple-100">
//             <AvatarImage src="https://github.com/shadcn.png" />
//             <AvatarFallback>JD</AvatarFallback>
//           </Avatar>
//         </div>
//       </header>

//       {/* 2. WALLET OVERVIEW (Horizontal Scroll) */}
//       <section>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="font-semibold text-lg flex items-center gap-2">
//             <Wallet className="h-5 w-5 text-purple-600" /> My Wallets
//           </h3>
//           <Button variant="link" className="text-purple-600 text-sm">Manage Wallets</Button>
//         </div>
//         <ScrollArea className="w-full whitespace-nowrap">
//           <div className="flex w-max space-x-4 pb-4">
//             <AccountCard
//               type="USD Wallet"
//               balance="2,050.00"
//               currency={<DollarSign className="h-5 w-5" />}
//               color="bg-slate-950" // Premium dark for USD
//               trend={[10, 25, 45, 30, 50]}
//               isPrimary
//             />
//             <AccountCard
//               type="EUR Wallet"
//               balance="1,205.50"
//               currency={<Euro className="h-5 w-5" />}
//               color="bg-purple-950" // Deep purple for EUR
//               trend={[40, 35, 50, 45, 60]}
//               isPrimary
//             />
//             <AccountCard
//               type="GBP Wallet"
//               balance="0.50"
//               currency={<PoundSterling className="h-5 w-5" />}
//               color="bg-gray-100 text-slate-900 border" // Light theme for empty/low wallets
//               trend={[20, 20, 20, 20, 20]}
//             />
//           </div>
//           <ScrollBar orientation="horizontal" />
//         </ScrollArea>
//       </section>

//       {/* 3. QUICK ACTION HUB */}
//       <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {[
//           { label: "Send Money", icon: Send, color: "bg-blue-50 text-blue-600" },
//           { label: "Receive", icon: ArrowDownToLine, color: "bg-emerald-50 text-emerald-600" },
//           { label: "Convert", icon: ArrowRightLeft, color: "bg-purple-50 text-purple-600" },
//           { label: "Pay Bills", icon: Receipt, color: "bg-orange-50 text-orange-600" },
//           { label: "Cards", icon: CreditCard, color: "bg-slate-50 text-slate-600" },
//         ].map((action, i) => (
//           <Button key={i} variant="ghost" className="h-24 flex flex-col gap-2 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
//             <div className={`p-3 rounded-2xl ${action.color}`}>
//               <action.icon className="h-6 w-6" />
//             </div>
//             <span className="text-xs font-semibold">{action.label}</span>
//           </Button>
//         ))}
//       </section>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//         {/* 4. RECENT ACTIVITY & FX WIDGET */}
//         <div className="lg:col-span-2 space-y-8">

//           {/* FX CONVERSION WIDGET (Critical for Int'l) */}
//           {/* <Card className="border-purple-100 bg-transparent">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium flex items-center gap-2">
//                 <TrendingUp className="h-4 w-4 text-purple-600" /> Live Conversion
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col md:flex-row items-center gap-4">
//                 <div className="relative flex-1 w-full">
//                   <Input defaultValue="1,000" className="pl-12 h-12 text-lg font-bold" />
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">USD</span>
//                 </div>
//                 <ArrowRightLeft className="text-purple-400 rotate-90 md:rotate-0" />
//                 <div className="relative flex-1 w-full">
//                   <Input value="917.45" readOnly className="pl-12 h-12 text-lg font-bold bg-white" />
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">EUR</span>
//                 </div>
//                 <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 h-12 px-8">Convert</Button>
//               </div>
//               <p className="text-[11px] text-muted-foreground mt-3 text-center md:text-left">
//                 Mid-market rate: 1 USD = 0.9174 EUR • No hidden fees
//               </p>
//             </CardContent>
//           </Card> */}

//           {/* RECENT TRANSACTIONS */}
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg">Recent Activity</CardTitle>
//               <div className="flex gap-2">
//                 <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <TransactionItem title="FX Conversion (USD → EUR)" date="Today, 12:40" amount="-1,000.00" currency="USD" type="debit" />
//                 <TransactionItem title="FX Conversion (EUR)" date="Today, 12:40" amount="+917.45" currency="EUR" type="credit" />
//                 <TransactionItem title="Amazon.com" date="Jan 12, 09:00" amount="-45.99" currency="USD" type="debit" />
//                 <TransactionItem title="Apple Subscription" date="Jan 10, 14:20" amount="-9.99" currency="USD" type="debit" />
//                 <TransactionItem title="Salary Deposit" date="Jan 01, 18:00" amount="+4,500.00" currency="USD" type="credit" />
//               </div>
//               <Button variant="ghost" className="w-full mt-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
//                 View Full History
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* 5. SIDEBAR: CARDS & COMPLIANCE */}
//         <div className="space-y-6">
//           {/* VIRTUAL CARD PREVIEW */}
//   <Card className="bg-slate-900 text-white overflow-hidden relative border-none">
//     <CardContent className="p-6">
//       <div className="flex justify-between items-start mb-8">
//         <div className="h-8 w-12 bg-white/20 rounded-md animate-pulse" />
//         <CreditCard className="h-6 w-6 text-white/50" />
//       </div>
//       <p className="text-sm font-mono tracking-widest mb-1 text-white/60">•••• •••• •••• 4290</p>
//       <div className="flex justify-between items-end">
//         <p className="text-xs font-medium">Virtual Card • USD</p>
//         <div className="h-2 w-2 bg-emerald-400 rounded-full" />
//       </div>

//       <div className="mt-8 grid grid-cols-2 gap-2">
//         <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px]">Freeze</Button>
//         <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px]">Details</Button>
//       </div>
//     </CardContent>
//   </Card>

//           {/* COMPLIANCE WIDGET */}
//           <Card className="bg-slate-50 border-slate-200">
//             <CardContent className="p-4 space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-emerald-100 rounded-lg">
//                   <ShieldCheck className="h-5 w-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold text-slate-900">Identity Verified</p>
//                   <p className="text-[10px] text-slate-500">Tier 2: $50k monthly limit</p>
//                 </div>
//               </div>
//               <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
//                 <div className="h-full w-3/4 bg-emerald-500" />
//               </div>
//               <Button variant="link" className="p-0 h-auto text-[10px] text-purple-600 font-bold">Increase Limits</Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/dashboard/page.tsx
import WalletCard from "@/components/app/wallet-card";
import FXWidget from "@/components/app/fx-widget";
import RecentActivity from "@/components/app/recent-activity";
import { AlertCircle, ShieldCheck, CreditCard } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Compliance Indicator */}
            <div className="bg-white border border-n-300 rounded-brand-card px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-usd" size={20} />
                    <div>
                        <p className="text-sm font-bold text-brand-dark">Account Verified</p>
                        <p className="text-xs text-n-500">Your international transfer limits have been increased.</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-brand-blue uppercase">View Limits</button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left & Middle Column: Wallets & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <WalletCard currency="USD" balance="12,450.00" pending="150.00" />
                        <WalletCard currency="EUR" balance="8,300.00" />
                    </div>
                    <RecentActivity />
                </div>

                {/* Right Column: FX & Status */}
                <div className="space-y-8">
                    <FXWidget />
                    <Card className="bg-slate-900 text-white overflow-hidden relative border-none">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-8">
                                <div className="h-8 w-12 bg-white/20 rounded-md animate-pulse" />
                                <CreditCard className="h-6 w-6 text-white/50" />
                            </div>
                            <p className="text-sm font-mono tracking-widest mb-1 text-white/60">•••• •••• •••• 4290</p>
                            <div className="flex justify-between items-end">
                                <p className="text-xs font-medium">Virtual Card • USD</p>
                                <div className="h-2 w-2 bg-emerald-400 rounded-full" />
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-2">
                                <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px]">Freeze</Button>
                                <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px]">Details</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan Snapshot (Conditional) */}
                    <div className="bg-n-100 border border-n-300 rounded-brand-card p-6">
                        <h4 className="text-xs font-bold text-n-500 uppercase mb-4">Active Loan</h4>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="balance-md">$1,200.00</p>
                                <p className="text-[11px] text-bank-error font-bold uppercase mt-1">Due in 3 days</p>
                            </div>
                            <button className="text-xs font-bold text-brand-blue hover:underline">Repay Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

