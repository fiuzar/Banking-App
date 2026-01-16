import React from "react";
import { 
  ArrowLeft, Download, Search, Filter, 
  ArrowUpRight, ArrowDownLeft, Calendar as CalendarIcon,
  ChevronRight, FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function TransactionHistoryPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-7xl mx-auto w-full">
      
      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search merchant, ID, or amount..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* 2. ADVANCED FILTERS BAR */}
      <Card className="bg-muted/40 border-none shadow-none">
        <CardContent className="p-4 flex flex-wrap gap-4">
          <Select defaultValue="all-accounts">
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-accounts">All Accounts</SelectItem>
              <SelectItem value="naira">Naira Account</SelectItem>
              <SelectItem value="dollar">Dollar Account</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-types">
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="credit">Credits (In)</SelectItem>
              <SelectItem value="debit">Debits (Out)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 bg-background">
            <CalendarIcon className="h-4 w-4" />
            Last 30 Days
          </Button>
          
          <Button variant="ghost" className="text-muted-foreground hover:text-primary ml-auto">
            Reset Filters
          </Button>
        </CardContent>
      </Card>

      {/* 3. SUMMARY CARDS (Quick Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Inflow</p>
              <p className="text-2xl font-bold text-emerald-600">+₦1,240,000.00</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <ArrowDownLeft className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Outflow</p>
              <p className="text-2xl font-bold text-red-600">-₦850,200.00</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. DATA TABLE */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Badge variant={tx.status === "Completed" ? "default" : "secondary"}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{tx.merchant}</span>
                    <span className="text-xs text-muted-foreground">Ref: {tx.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal capitalize">{tx.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {tx.date}
                </TableCell>
                <TableCell className={`text-right font-bold ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-foreground'}`}>
                  {tx.currency}{tx.amount}
                </TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

const TRANSACTIONS = [
  { id: "TXN-9021", status: "Completed", merchant: "Amazon Prime", category: "entertainment", date: "Jan 12, 2026", currency: "₦", amount: "-4,500.00" },
  { id: "TXN-9022", status: "Completed", merchant: "Salary Deposit", category: "income", date: "Jan 10, 2026", currency: "₦", amount: "+450,000.00" },
  { id: "TXN-9023", status: "Pending", merchant: "Starlink Nigeria", category: "bills", date: "Jan 09, 2026", currency: "₦", amount: "-38,000.00" },
  { id: "TXN-9024", status: "Completed", merchant: "Apple Store", category: "shopping", date: "Jan 08, 2026", currency: "$", amount: "-19.99" },
];

// import React from "react";
// import { 
//   ArrowLeft, Search, Filter, Download, 
//   ArrowUpRight, ArrowDownLeft, RefreshCcw 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter 
// } from "@/components/ui/sheet";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { TransactionItem } from "@/components/app/transaction-item";

// export default function TransactionHistoryPage() {
//   return (
//     <div className="flex flex-col gap-6 p-6 md:p-10 max-w-5xl mx-auto w-full">
      
//       {/* 1. HEADER */}
//       <header className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
//         </div>
//         <div className="flex items-center gap-2">
//           {/* SEARCH TRIGGER */}
//           <div className="hidden md:flex relative w-64">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input placeholder="Search transactions..." className="pl-10" />
//           </div>
          
//           {/* 2. FILTER SHEET */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" className="gap-2">
//                 <Filter className="h-4 w-4" /> Filters
//               </Button>
//             </SheetTrigger>
//             <SheetContent className="w-[400px] sm:w-[540px]">
//               <SheetHeader>
//                 <SheetTitle>Filter Transactions</SheetTitle>
//               </SheetHeader>
//               <div className="py-6 space-y-8">
//                 {/* CURRENCY FILTER */}
//                 <div className="space-y-4">
//                   <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Currency</h4>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["All", "USD", "EUR"].map((curr) => (
//                       <Button key={curr} variant={curr === "All" ? "default" : "outline"} className="w-full">
//                         {curr}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* TYPE FILTER */}
//                 <div className="space-y-4">
//                   <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Transaction Type</h4>
//                   <div className="space-y-3">
//                     {["Credit", "Debit", "FX Conversion", "Transfer"].map((type) => (
//                       <div key={type} className="flex items-center space-x-2">
//                         <Checkbox id={type} />
//                         <Label htmlFor={type} className="text-sm font-medium leading-none cursor-pointer">
//                           {type}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <SheetFooter className="flex-col sm:flex-col gap-2">
//                 <Button className="w-full bg-purple-600">Apply Filters</Button>
//                 <Button variant="ghost" className="w-full">Reset All</Button>
//               </SheetFooter>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </header>

//       {/* 3. TRANSACTION LIST */}
//       <div className="space-y-8">
//         {/* DATE GROUP: TODAY */}
//         <section className="space-y-4">
//           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Today — Jan 15, 2026</h3>
//           <Card className="border-slate-100 shadow-sm overflow-hidden">
//             <div className="divide-y divide-slate-50">
//               <TransactionItem title="Amazon EU" date="12:40 PM" amount="-120.00" currency="EUR" type="debit" />
              
//               {/* FX PAIRING LOGIC DISPLAY */}
//               <div className="bg-purple-50/30">
//                 <TransactionItem 
//                     title="FX Conversion (Out)" 
//                     date="11:05 AM" 
//                     amount="-1,000.00" 
//                     currency="USD" 
//                     type="debit" 
//                     icon={<RefreshCcw className="h-4 w-4" />}
//                 />
//                 <TransactionItem 
//                     title="FX Conversion (In)" 
//                     date="11:05 AM" 
//                     amount="+917.45" 
//                     currency="EUR" 
//                     type="credit" 
//                     icon={<RefreshCcw className="h-4 w-4" />}
//                 />
//               </div>

//               <TransactionItem title="Salary Credit" date="09:00 AM" amount="+4,500.00" currency="USD" type="credit" />
//             </div>
//           </Card>
//         </section>

//         {/* DATE GROUP: YESTERDAY */}
//         <section className="space-y-4">
//           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Yesterday — Jan 14, 2026</h3>
//           <Card className="border-slate-100 shadow-sm overflow-hidden">
//             <div className="divide-y divide-slate-50">
//               <TransactionItem title="Apple Subscription" date="18:30 PM" amount="-9.99" currency="USD" type="debit" />
//               <TransactionItem title="Starlink Internet" date="14:20 PM" amount="-50.00" currency="EUR" type="debit" />
//             </div>
//           </Card>
//         </section>
//       </div>

//       {/* 4. FOOTER ACTIONS */}
//       <div className="flex justify-center pt-6">
//         <Button variant="outline" className="gap-2 text-slate-500">
//           <Download className="h-4 w-4" /> Download Statement (CSV / PDF)
//         </Button>
//       </div>
//     </div>
//   );
// }

// // Internal Card helper to keep the code clean
// function Card({ children, className }) {
//   return <div className={`bg-white rounded-2xl border ${className}`}>{children}</div>;
// }