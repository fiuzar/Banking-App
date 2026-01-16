import React from "react";
import { 
  Plus, ShieldOff, Eye, 
  Zap, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function CardsPage() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-6xl mx-auto w-full">
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Cards</h1>
          <p className="text-sm text-muted-foreground">Manage your physical and virtual payment methods.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Virtual Card
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. THE CARD VISUALIZER */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Preview */}
          <div className="relative h-56 w-full max-w-md mx-auto rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-2xl overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest opacity-60">Virtual Card</p>
                <p className="font-semibold italic text-lg">PaySense</p>
              </div>
              <Zap className="h-8 w-8 text-emerald-400 fill-emerald-400" />
            </div>
            
            <div className="mt-12">
              <p className="text-2xl font-mono tracking-[0.2em]">••••  ••••  ••••  4290</p>
            </div>

            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                <p className="font-medium">ALEX DOE</p>
              </div>
              <div>
                <p className="text-[10px] uppercase opacity-60 text-right">Expires</p>
                <p className="font-medium">08/28</p>
              </div>
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <Button variant="secondary" size="sm" className="gap-2">
                <Eye className="h-4 w-4" /> Reveal Details
              </Button>
            </div>
          </div>

          {/* Quick Stats below card */}
          <div className="grid grid-cols-2 gap-4">
             <Card>
               <CardContent className="p-4">
                 <p className="text-xs text-muted-foreground">Monthly Spending</p>
                 <p className="text-xl font-bold">₦142,000.00</p>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <p className="text-xs text-muted-foreground">Status</p>
                 <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Active</Badge>
               </CardContent>
             </Card>
          </div>
        </div>

        {/* 3. CARD CONTROLS SIDEBAR */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Freeze Card</Label>
                  <p className="text-xs text-muted-foreground">Temporarily disable transactions</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Online Payments</Label>
                  <p className="text-xs text-muted-foreground">Allow web transactions</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Spending Limit</Label>
                  <span className="text-sm font-bold">₦500k</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} />
                <p className="text-[10px] text-muted-foreground">Adjust your daily maximum spending limit.</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full justify-between group">
                  Change PIN <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
                <Button variant="outline" className="w-full justify-between text-destructive hover:bg-destructive/5 group">
                  Terminate Card <ShieldOff className="h-4 w-4" />
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// 'use client'

// import React, { useState } from "react";
// import { 
//   ArrowLeft, Plus, ShieldCheck, Snowflake, 
//   Settings, CreditCard, Eye, EyeOff, 
//   ChevronRight, Globe, Zap, AlertCircle
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";

// export default function CardsModule() {
//   const [showDetails, setShowDetails] = useState(false);
//   const [isFrozen, setIsFrozen] = useState(false);

//   return (
//     <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl mx-auto w-full">
      
//       {/* 1. HEADER */}
//       <header className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-2xl font-bold tracking-tight">My Cards</h1>
//         </div>
//         <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
//           <Plus className="h-4 w-4" /> New Card
//         </Button>
//       </header>

//       {/* 2. THE VIRTUAL CARD COMPONENT */}
//       <div className="relative group perspective-1000">
//         <Card className={`relative h-56 w-full md:w-[400px] mx-auto overflow-hidden transition-all duration-500 shadow-2xl border-none ${isFrozen ? 'grayscale brightness-75' : 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900'}`}>
//           <CardContent className="p-8 text-white h-full flex flex-col justify-between">
//             <div className="flex justify-between items-start">
//               <div className="space-y-1">
//                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Virtual Card</p>
//                 <div className="flex items-center gap-2">
//                   <span className="font-bold">USD Wallet</span>
//                   <Badge className="bg-white/10 text-[10px] border-none">Debit</Badge>
//                 </div>
//               </div>
//               <CreditCard className="h-8 w-8 opacity-40" />
//             </div>

//             <div className="space-y-4">
//               <p className="text-2xl font-mono tracking-[0.25em]">
//                 {showDetails ? "4832 9901 2234 5510" : "•••• •••• •••• 5510"}
//               </p>
//               <div className="flex gap-8">
//                 <div>
//                   <p className="text-[8px] uppercase opacity-50 font-bold mb-1">Expiry</p>
//                   <p className="text-sm font-mono tracking-widest">08/27</p>
//                 </div>
//                 <div>
//                   <p className="text-[8px] uppercase opacity-50 font-bold mb-1">CVV</p>
//                   <p className="text-sm font-mono tracking-widest">{showDetails ? "912" : "•••"}</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>

//           {/* Frozen Overlay */}
//           {isFrozen && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
//               <Badge variant="destructive" className="px-4 py-1 text-sm gap-2">
//                 <Snowflake className="h-4 w-4" /> Frozen
//               </Badge>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* 3. PRIMARY CARD ACTIONS */}
//       <div className="grid grid-cols-3 gap-4">
//         <Button 
//           variant="outline" 
//           className="flex flex-col h-20 gap-2 border-slate-200"
//           onClick={() => setShowDetails(!showDetails)}
//         >
//           {showDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//           <span className="text-[10px] font-bold uppercase">{showDetails ? "Hide" : "Show"} Details</span>
//         </Button>
//         <Button 
//           variant="outline" 
//           className={`flex flex-col h-20 gap-2 border-slate-200 ${isFrozen ? 'text-purple-600 bg-purple-50' : ''}`}
//           onClick={() => setIsFrozen(!isFrozen)}
//         >
//           <Snowflake className="h-5 w-5" />
//           <span className="text-[10px] font-bold uppercase">{isFrozen ? "Unfreeze" : "Freeze"}</span>
//         </Button>
//         <Button variant="outline" className="flex flex-col h-20 gap-2 border-slate-200">
//           <Settings className="h-5 w-5" />
//           <span className="text-[10px] font-bold uppercase">Settings</span>
//         </Button>
//       </div>

//       {/* 4. CROSS-BORDER FX SPENDING (Scenario B) */}
//       <section className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h3 className="font-bold text-lg">Recent Card Activity</h3>
//           <Button variant="link" className="text-purple-600">View All</Button>
//         </div>

//         <Card className="border-slate-100">
//           <CardContent className="p-0 divide-y divide-slate-50">
//             {/* Standard Spending */}
//             <div className="p-4 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
//                   <Zap className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold">Netflix US</p>
//                   <p className="text-xs text-slate-400">Standard Subscription</p>
//                 </div>
//               </div>
//               <p className="text-sm font-bold">-$15.99</p>
//             </div>

//             {/* MANDATORY FX BREAKDOWN ITEM */}
//             <div className="p-4 space-y-3 bg-purple-50/20">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
//                     <Globe className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold">Amazon DE</p>
//                     <p className="text-xs text-slate-400">Jan 12, 2026 • Munich, DE</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-bold text-slate-900">-$133.44</p>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Charged in USD</p>
//                 </div>
//               </div>
              
//               <div className="ml-14 p-3 rounded-lg border border-purple-100 bg-white space-y-2">
//                 <div className="flex justify-between text-[10px]">
//                   <span className="text-slate-500">Original Amount</span>
//                   <span className="font-bold">€120.00 EUR</span>
//                 </div>
//                 <div className="flex justify-between text-[10px]">
//                   <span className="text-slate-500">Mid-market Rate</span>
//                   <span className="font-bold">1 EUR = 1.087 USD</span>
//                 </div>
//                 <div className="flex justify-between text-[10px]">
//                   <span className="text-slate-500">FX Fee (Transaction)</span>
//                   <span className="font-bold text-purple-600">$3.00</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </section>

//       {/* 5. CARD LIMITS CONTROLS */}
//       <Card>
//         <CardContent className="p-6 space-y-6">
//           <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Card Controls</h4>
          
//           <div className="flex items-center justify-between">
//             <div className="space-y-1">
//               <Label className="text-sm font-bold">Online Payments</Label>
//               <p className="text-xs text-slate-500">Allow card usage for web and app purchases</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-1">
//               <Label className="text-sm font-bold">International Usage</Label>
//               <p className="text-xs text-slate-500">Allow card to work outside of your home region</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-amber-600">
//             <AlertCircle className="h-4 w-4" />
//             <p className="text-[10px] font-bold uppercase">Daily Limit: $2,000 / Monthly Limit: $10,000</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }