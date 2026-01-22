// // app/dashboard/cards/page.tsx
// "use client";

// import { Plus, CreditCard, ShieldCheck, Snowflake, Settings2, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// const myCards = [
//   { id: 1, type: 'Virtual', currency: 'USD', last4: '4832', balance: '$4,200.00', status: 'Active', color: 'bg-brand-dark' },
//   { id: 2, type: 'Physical', currency: 'EUR', last4: '9921', balance: '€1,800.00', status: 'Active', color: 'bg-brand-blue' },
// ];

// export default function CardsPage() {
//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-20">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-brand-dark">My Cards</h1>
//         <Button className="btn-primary gap-2 h-10 px-4">
//           <Plus size={18} /> New Card
//         </Button>
//       </div>

//       {/* 1. Cards Horizontal Scroll */}
//       <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 snap-x">
//         {myCards.map((card) => (
//           <div key={card.id} className="snap-center shrink-0">
//              <PaymentCard card={card} />
//           </div>
//         ))}
//       </div>

//       {/* 6. FX Spending Transparency (Critical Scenario) */}
//       <div className="space-y-4">
//         <div className="flex justify-between items-end px-2">
//           <h3 className="font-bold text-brand-dark">Recent Card Spending</h3>
//           <p className="text-[10px] font-bold text-n-500 uppercase">Live FX Applied</p>
//         </div>
        
//         <Card className="border-none shadow-soft divide-y divide-n-100 overflow-hidden">
//           {/* Scenario B: Merchant Currency ≠ Card Currency */}
//           <div className="p-4 bg-brand-blue/[0.02]">
//             <div className="flex justify-between items-start mb-3">
//               <div className="flex gap-3">
//                 <div className="w-10 h-10 bg-white border border-n-100 rounded-full flex items-center justify-center">
//                   <span className="text-lg">🇩🇪</span>
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-brand-dark">Amazon DE</p>
//                   <p className="text-[11px] text-n-500 font-medium">Jan 12, 2026 • 15:04</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-mono font-bold text-brand-dark">-$133.44 USD</p>
//                 <Badge className="bg-usd/10 text-usd border-none text-[9px] h-4">Completed</Badge>
//               </div>
//             </div>
            
//             {/* The Mandatory FX Breakdown */}
//             <div className="bg-white rounded-lg p-3 border border-n-300/50 flex justify-between items-center text-[11px]">
//                <div className="space-y-1">
//                  <p className="text-n-500 font-medium">Original: <span className="text-brand-dark font-bold">€120.00 EUR</span></p>
//                  <p className="text-n-500 font-medium">Exchange Rate: <span className="text-brand-dark font-bold">1 EUR = 1.087 USD</span></p>
//                </div>
//                <div className="text-right space-y-1">
//                  <p className="text-n-500 font-medium">FX Fee: <span className="text-brand-dark font-bold">$3.00 USD</span></p>
//                  <p className="text-brand-blue font-bold">Total Charged</p>
//                </div>
//             </div>
//           </div>

//           {/* Scenario A: Merchant Currency = Card Currency */}
//           <div className="p-4 flex justify-between items-center bg-white">
//             <div className="flex gap-3">
//               <div className="w-10 h-10 bg-n-100 rounded-full flex items-center justify-center text-n-500">
//                 <CreditCard size={18} />
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-brand-dark">Netflix US</p>
//                 <p className="text-[11px] text-n-500">Jan 10, 2026</p>
//               </div>
//             </div>
//             <p className="text-sm font-mono font-bold text-brand-dark">-$15.99 USD</p>
//           </div>
//         </Card>
//       </div>

//       {/* 8. Quick Controls Hub */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <CardAction icon={<Snowflake size={20} />} label="Freeze" />
//         <CardAction icon={<Settings2 size={20} />} label="Limits" />
//         <CardAction icon={<ShieldCheck size={20} />} label="PIN/Details" />
//         <CardAction icon={<Plus size={20} />} label="Replace" />
//       </div>
//     </div>
//   );
// }

// // --- Internal UI Components ---

// function PaymentCard({ card }) {
//   return (
//     <div className={`w-[320px] h-[200px] ${card.color} rounded-[20px] p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]`}>
//       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
//         <CreditCard size={120} />
//       </div>
      
//       <div className="flex justify-between items-start relative z-10">
//         <div>
//           <Badge className="bg-white/20 text-white border-none text-[10px] mb-2">{card.type}</Badge>
//           <p className="text-xs font-bold opacity-60 uppercase tracking-tighter">{card.currency} WALLET</p>
//         </div>
//         <div className="h-8 w-12 bg-white/20 rounded-md" /> {/* Simulating a chip */}
//       </div>

//       <div className="relative z-10">
//         <p className="text-xl font-mono tracking-[0.2em] mb-4">•••• •••• •••• {card.last4}</p>
//         <div className="flex justify-between items-end">
//           <div>
//             <p className="text-[10px] opacity-60 uppercase">Available</p>
//             <p className="text-lg font-bold">{card.balance}</p>
//           </div>
//           <div className="flex -space-x-2">
//             <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
//             <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CardAction({ icon, label }) {
//   return (
//     <Card className="p-4 flex flex-col items-center gap-2 border-none shadow-soft hover:bg-n-100 transition-colors cursor-pointer">
//       <div className="text-brand-blue">{icon}</div>
//       <span className="text-[11px] font-bold text-n-700 uppercase">{label}</span>
//     </Card>
//   );
// }


// // import React from "react";
// // import { 
// //   Plus, ShieldOff, Eye, 
// //   Zap, ArrowRight 
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// // import { Switch } from "@/components/ui/switch";
// // import { Label } from "@/components/ui/label";
// // import { Slider } from "@/components/ui/slider";
// // import { Badge } from "@/components/ui/badge";

// // export default function CardsPage() {
// //   return (
// //     <div className="flex flex-col gap-8 p-6 md:p-10 max-w-6xl mx-auto w-full">
      
// //       {/* 1. HEADER */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold tracking-tight">My Cards</h1>
// //           <p className="text-sm text-muted-foreground">Manage your physical and virtual payment methods.</p>
// //         </div>
// //         <Button className="gap-2">
// //           <Plus className="h-4 w-4" /> New Virtual Card
// //         </Button>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
// //         {/* 2. THE CARD VISUALIZER */}
// //         <div className="lg:col-span-2 space-y-6">
// //           {/* Card Preview */}
// //           <div className="relative h-56 w-full max-w-md mx-auto rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-2xl overflow-hidden group">
// //             <div className="flex justify-between items-start">
// //               <div className="space-y-1">
// //                 <p className="text-[10px] uppercase tracking-widest opacity-60">Virtual Card</p>
// //                 <p className="font-semibold italic text-lg">PaySense</p>
// //               </div>
// //               <Zap className="h-8 w-8 text-emerald-400 fill-emerald-400" />
// //             </div>
            
// //             <div className="mt-12">
// //               <p className="text-2xl font-mono tracking-[0.2em]">••••  ••••  ••••  4290</p>
// //             </div>

// //             <div className="mt-6 flex justify-between items-end">
// //               <div>
// //                 <p className="text-[10px] uppercase opacity-60">Card Holder</p>
// //                 <p className="font-medium">ALEX DOE</p>
// //               </div>
// //               <div>
// //                 <p className="text-[10px] uppercase opacity-60 text-right">Expires</p>
// //                 <p className="font-medium">08/28</p>
// //               </div>
// //             </div>
// //             {/* Hover Overlay */}
// //             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
// //               <Button variant="secondary" size="sm" className="gap-2">
// //                 <Eye className="h-4 w-4" /> Reveal Details
// //               </Button>
// //             </div>
// //           </div>

// //           {/* Quick Stats below card */}
// //           <div className="grid grid-cols-2 gap-4">
// //              <Card>
// //                <CardContent className="p-4">
// //                  <p className="text-xs text-muted-foreground">Monthly Spending</p>
// //                  <p className="text-xl font-bold">₦142,000.00</p>
// //                </CardContent>
// //              </Card>
// //              <Card>
// //                <CardContent className="p-4">
// //                  <p className="text-xs text-muted-foreground">Status</p>
// //                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Active</Badge>
// //                </CardContent>
// //              </Card>
// //           </div>
// //         </div>

// //         {/* 3. CARD CONTROLS SIDEBAR */}
// //         <div className="space-y-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="text-lg">Security Controls</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-6">
              
// //               <div className="flex items-center justify-between">
// //                 <div className="space-y-0.5">
// //                   <Label className="text-sm font-medium">Freeze Card</Label>
// //                   <p className="text-xs text-muted-foreground">Temporarily disable transactions</p>
// //                 </div>
// //                 <Switch />
// //               </div>

// //               <div className="flex items-center justify-between">
// //                 <div className="space-y-0.5">
// //                   <Label className="text-sm font-medium">Online Payments</Label>
// //                   <p className="text-xs text-muted-foreground">Allow web transactions</p>
// //                 </div>
// //                 <Switch defaultChecked />
// //               </div>

// //               <div className="space-y-4 pt-4 border-t">
// //                 <div className="flex justify-between items-center">
// //                   <Label className="text-sm font-medium">Spending Limit</Label>
// //                   <span className="text-sm font-bold">₦500k</span>
// //                 </div>
// //                 <Slider defaultValue={[50]} max={100} step={1} />
// //                 <p className="text-[10px] text-muted-foreground">Adjust your daily maximum spending limit.</p>
// //               </div>

// //               <div className="space-y-2 pt-4 border-t">
// //                 <Button variant="outline" className="w-full justify-between group">
// //                   Change PIN <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
// //                 </Button>
// //                 <Button variant="outline" className="w-full justify-between text-destructive hover:bg-destructive/5 group">
// //                   Terminate Card <ShieldOff className="h-4 w-4" />
// //                 </Button>
// //               </div>

// //             </CardContent>
// //           </Card>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// // 'use client'

// // import React, { useState } from "react";
// // import { 
// //   ArrowLeft, Plus, ShieldCheck, Snowflake, 
// //   Settings, CreditCard, Eye, EyeOff, 
// //   ChevronRight, Globe, Zap, AlertCircle
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Switch } from "@/components/ui/switch";
// // import { Label } from "@/components/ui/label";

// // export default function CardsModule() {
// //   const [showDetails, setShowDetails] = useState(false);
// //   const [isFrozen, setIsFrozen] = useState(false);

// //   return (
// //     <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl mx-auto w-full">
      
// //       {/* 1. HEADER */}
// //       <header className="flex items-center justify-between">
// //         <div className="flex items-center gap-4">
// //           <Button variant="ghost" size="icon" className="rounded-full">
// //             <ArrowLeft className="h-5 w-5" />
// //           </Button>
// //           <h1 className="text-2xl font-bold tracking-tight">My Cards</h1>
// //         </div>
// //         <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
// //           <Plus className="h-4 w-4" /> New Card
// //         </Button>
// //       </header>

// //       {/* 2. THE VIRTUAL CARD COMPONENT */}
// //       <div className="relative group perspective-1000">
// //         <Card className={`relative h-56 w-full md:w-[400px] mx-auto overflow-hidden transition-all duration-500 shadow-2xl border-none ${isFrozen ? 'grayscale brightness-75' : 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900'}`}>
// //           <CardContent className="p-8 text-white h-full flex flex-col justify-between">
// //             <div className="flex justify-between items-start">
// //               <div className="space-y-1">
// //                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Virtual Card</p>
// //                 <div className="flex items-center gap-2">
// //                   <span className="font-bold">USD Wallet</span>
// //                   <Badge className="bg-white/10 text-[10px] border-none">Debit</Badge>
// //                 </div>
// //               </div>
// //               <CreditCard className="h-8 w-8 opacity-40" />
// //             </div>

// //             <div className="space-y-4">
// //               <p className="text-2xl font-mono tracking-[0.25em]">
// //                 {showDetails ? "4832 9901 2234 5510" : "•••• •••• •••• 5510"}
// //               </p>
// //               <div className="flex gap-8">
// //                 <div>
// //                   <p className="text-[8px] uppercase opacity-50 font-bold mb-1">Expiry</p>
// //                   <p className="text-sm font-mono tracking-widest">08/27</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-[8px] uppercase opacity-50 font-bold mb-1">CVV</p>
// //                   <p className="text-sm font-mono tracking-widest">{showDetails ? "912" : "•••"}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </CardContent>

// //           {/* Frozen Overlay */}
// //           {isFrozen && (
// //             <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
// //               <Badge variant="destructive" className="px-4 py-1 text-sm gap-2">
// //                 <Snowflake className="h-4 w-4" /> Frozen
// //               </Badge>
// //             </div>
// //           )}
// //         </Card>
// //       </div>

// //       {/* 3. PRIMARY CARD ACTIONS */}
// //       <div className="grid grid-cols-3 gap-4">
// //         <Button 
// //           variant="outline" 
// //           className="flex flex-col h-20 gap-2 border-slate-200"
// //           onClick={() => setShowDetails(!showDetails)}
// //         >
// //           {showDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
// //           <span className="text-[10px] font-bold uppercase">{showDetails ? "Hide" : "Show"} Details</span>
// //         </Button>
// //         <Button 
// //           variant="outline" 
// //           className={`flex flex-col h-20 gap-2 border-slate-200 ${isFrozen ? 'text-purple-600 bg-purple-50' : ''}`}
// //           onClick={() => setIsFrozen(!isFrozen)}
// //         >
// //           <Snowflake className="h-5 w-5" />
// //           <span className="text-[10px] font-bold uppercase">{isFrozen ? "Unfreeze" : "Freeze"}</span>
// //         </Button>
// //         <Button variant="outline" className="flex flex-col h-20 gap-2 border-slate-200">
// //           <Settings className="h-5 w-5" />
// //           <span className="text-[10px] font-bold uppercase">Settings</span>
// //         </Button>
// //       </div>

// //       {/* 4. CROSS-BORDER FX SPENDING (Scenario B) */}
// //       <section className="space-y-4">
// //         <div className="flex items-center justify-between">
// //           <h3 className="font-bold text-lg">Recent Card Activity</h3>
// //           <Button variant="link" className="text-purple-600">View All</Button>
// //         </div>

// //         <Card className="border-slate-100">
// //           <CardContent className="p-0 divide-y divide-slate-50">
// //             {/* Standard Spending */}
// //             <div className="p-4 flex items-center justify-between">
// //               <div className="flex items-center gap-4">
// //                 <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
// //                   <Zap className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-bold">Netflix US</p>
// //                   <p className="text-xs text-slate-400">Standard Subscription</p>
// //                 </div>
// //               </div>
// //               <p className="text-sm font-bold">-$15.99</p>
// //             </div>

// //             {/* MANDATORY FX BREAKDOWN ITEM */}
// //             <div className="p-4 space-y-3 bg-purple-50/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-4">
// //                   <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
// //                     <Globe className="h-5 w-5" />
// //                   </div>
// //                   <div>
// //                     <p className="text-sm font-bold">Amazon DE</p>
// //                     <p className="text-xs text-slate-400">Jan 12, 2026 • Munich, DE</p>
// //                   </div>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-sm font-bold text-slate-900">-$133.44</p>
// //                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Charged in USD</p>
// //                 </div>
// //               </div>
              
// //               <div className="ml-14 p-3 rounded-lg border border-purple-100 bg-white space-y-2">
// //                 <div className="flex justify-between text-[10px]">
// //                   <span className="text-slate-500">Original Amount</span>
// //                   <span className="font-bold">€120.00 EUR</span>
// //                 </div>
// //                 <div className="flex justify-between text-[10px]">
// //                   <span className="text-slate-500">Mid-market Rate</span>
// //                   <span className="font-bold">1 EUR = 1.087 USD</span>
// //                 </div>
// //                 <div className="flex justify-between text-[10px]">
// //                   <span className="text-slate-500">FX Fee (Transaction)</span>
// //                   <span className="font-bold text-purple-600">$3.00</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </section>

// //       {/* 5. CARD LIMITS CONTROLS */}
// //       <Card>
// //         <CardContent className="p-6 space-y-6">
// //           <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Card Controls</h4>
          
// //           <div className="flex items-center justify-between">
// //             <div className="space-y-1">
// //               <Label className="text-sm font-bold">Online Payments</Label>
// //               <p className="text-xs text-slate-500">Allow card usage for web and app purchases</p>
// //             </div>
// //             <Switch defaultChecked />
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="space-y-1">
// //               <Label className="text-sm font-bold">International Usage</Label>
// //               <p className="text-xs text-slate-500">Allow card to work outside of your home region</p>
// //             </div>
// //             <Switch defaultChecked />
// //           </div>

// //           <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-amber-600">
// //             <AlertCircle className="h-4 w-4" />
// //             <p className="text-[10px] font-bold uppercase">Daily Limit: $2,000 / Monthly Limit: $10,000</p>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Snowflake, 
  Settings, 
  Lock, 
  ShieldCheck,
  CreditCard as CardIcon,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

export default function VirtualCardPage() {
  const [showDetails, setShowDetails] = useState(false)
  const [isFrozen, setIsFrozen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app"><ArrowLeft size={24} /></Link>
          <h1 className="text-xl font-bold">My Card</h1>
        </div>
        <Settings size={20} className="opacity-60" />
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        
        {/* The Virtual Card Visual */}
        <div className={`relative aspect-[1.58/1] w-full rounded-[24px] p-8 text-white overflow-hidden transition-all duration-500 shadow-2xl ${isFrozen ? 'grayscale contrast-75' : 'bg-gradient-to-br from-brand-dark via-slate-900 to-primary'}`}>
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-[1px]" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="text-xl font-black italic tracking-tighter italic">Paysense</span>
                    <CardIcon className="opacity-80" size={24} />
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-bold">Card Number</p>
                    <p className="text-xl font-mono tracking-widest">
                        {showDetails ? "4412 8892 1002 4456" : "•••• •••• •••• 4456"}
                    </p>
                </div>

                <div className="flex gap-12">
                    <div>
                        <p className="text-[8px] uppercase opacity-50 font-bold">Expiry</p>
                        <p className="text-sm font-bold">{showDetails ? "12/28" : "••/••"}</p>
                    </div>
                    <div>
                        <p className="text-[8px] uppercase opacity-50 font-bold">CVV</p>
                        <p className="text-sm font-bold">{showDetails ? "882" : "•••"}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <img src="https://flagcdn.com/w20/us.png" className="rounded-sm opacity-80" alt="USD" />
                        <span className="text-[10px] font-bold">USD</span>
                    </div>
                </div>
            </div>

            {isFrozen && (
                <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30">
                        <Snowflake size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Frozen</span>
                    </div>
                </div>
            )}
        </div>

        {/* Quick Actions Bar */}
        <div className="flex justify-around bg-white p-4 rounded-3xl shadow-sm border border-border">
            <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex flex-col items-center gap-2 group"
            >
                <div className="p-3 bg-secondary rounded-full text-primary group-active:scale-90 transition-all">
                    {showDetails ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
                <span className="text-[10px] font-bold text-n-500 uppercase">{showDetails ? 'Hide' : 'Reveal'}</span>
            </button>

            <button 
                onClick={() => setIsFrozen(!isFrozen)}
                className="flex flex-col items-center gap-2 group"
            >
                <div className={`p-3 rounded-full transition-all group-active:scale-90 ${isFrozen ? 'bg-primary text-white' : 'bg-secondary text-primary'}`}>
                    <Snowflake size={20} />
                </div>
                <span className="text-[10px] font-bold text-n-500 uppercase">{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
            </button>

            <button className="flex flex-col items-center gap-2 group">
                <div className="p-3 bg-secondary rounded-full text-primary group-active:scale-90 transition-all">
                    <Lock size={20} />
                </div>
                <span className="text-[10px] font-bold text-n-500 uppercase">PIN</span>
            </button>
        </div>

        {/* Card Settings List */}
        <div className="space-y-3">
            <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest ml-1">Security & Limits</p>
            
            <div className="bg-white rounded-brand-card border border-border divide-y divide-border">
                <div className="p-5 flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brand-dark">Contactless Payments</p>
                            <p className="text-[10px] text-n-500">Online & POS spending</p>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>

                <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                            <CardIcon size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brand-dark">Spending Limit</p>
                            <p className="text-[10px] text-n-500">Current: $2,500.00 / mo</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-n-300" />
                </div>
            </div>
        </div>

        <Button variant="outline" className="w-full h-14 border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-2xl">
            Terminate Virtual Card
        </Button>
      </div>
    </div>
  )
}