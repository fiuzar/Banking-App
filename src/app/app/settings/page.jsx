'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Globe, 
  LogOut, 
  ChevronRight, 
  Camera,
  Mail,
  Smartphone
} from "lucide-react"
import Link from "next/link"

export default function AccountManagement() {
  const [isNotificationsOn, setIsNotificationsOn] = useState(true)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Profile Header */}
      <div className="bg-primary pt-12 pb-20 px-6 text-white text-center relative">
        <Link href="/app" className="absolute left-6 top-6">
          <ArrowLeft size={24} />
        </Link>
        
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-xl mx-auto">
            <img src="https://github.com/shadcn.png" alt="Profile" />
          </div>
          <button className="absolute bottom-0 right-0 bg-white text-primary p-2 rounded-full shadow-lg border border-slate-100">
            <Camera size={16} />
          </button>
        </div>
        
        <h1 className="mt-4 text-2xl font-black">John Doe</h1>
        <p className="text-white/70 text-sm font-medium">Lagos, Nigeria 🇳🇬</p>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-10 space-y-6">
        {/* Account Info Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-[10px] font-bold text-n-500 uppercase tracking-widest">Personal Information</h2>
          <div className="space-y-4">
            <InfoRow icon={<Mail size={18} />} label="Email" value="john.doe@example.com" />
            <InfoRow icon={<Smartphone size={18} />} label="Phone" value="+234 810 ••• ••••" />
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest ml-1">General Settings</p>
          <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <SettingsLink 
                icon={<ShieldCheck className="text-blue-500" />} 
                title="Security & Privacy" 
                subtitle="2FA, Biometrics, Password" 
            />
            <SettingsLink 
                icon={<Globe className="text-primary" />} 
                title="Language & Region" 
                subtitle="English (US), USD" 
                badge="🇳🇬"
            />
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                        <Bell size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-brand-dark">Push Notifications</p>
                        <p className="text-[10px] text-n-500">Alerts for all transactions</p>
                    </div>
                </div>
                <input 
                    type="checkbox" 
                    checked={isNotificationsOn} 
                    onChange={() => setIsNotificationsOn(!isNotificationsOn)}
                    className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-primary transition-colors relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-transform"
                />
            </div>
          </div>
        </div>

        {/* Support & Legal */}
        <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden divide-y divide-slate-50">
          <SettingsLink title="Help Center" subtitle="24/7 Live Support" />
          <SettingsLink title="Legal & Terms" subtitle="Privacy Policy, User Agreement" />
        </div>

        {/* Logout Button */}
        <Button variant="ghost" className="w-full h-14 text-red-500 font-bold flex gap-2 hover:bg-red-50 hover:text-red-600 rounded-2xl">
          <LogOut size={20} />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-n-300">{icon}</div>
            <div>
                <p className="text-[10px] text-n-500 font-bold uppercase">{label}</p>
                <p className="text-sm font-medium text-brand-dark">{value}</p>
            </div>
        </div>
    )
}

function SettingsLink({ icon, title, subtitle, badge }) {
    return (
        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
                {icon && <div className="p-2 bg-secondary rounded-lg">{icon}</div>}
                <div>
                    <p className="text-sm font-bold text-brand-dark">{title}</p>
                    <p className="text-[10px] text-n-500">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {badge && <span className="text-xs">{badge}</span>}
                <ChevronRight size={18} className="text-n-300" />
            </div>
        </div>
    )
}

function ArrowLeft({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
        </svg>
    )
}

// 'use client'

// import React from "react";
// import { 
//   User, Lock, Bell, Headset, LogOut, 
//   ShieldCheck, Smartphone, Mail, Phone,
//   ChevronRight, Fingerprint, KeyRound,
//   FileCheck
// } from "lucide-react";

// import { useSession } from "next-auth/react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";

// import { UserSetting } from "@/components/app/user-setting";
// import { SecuritySetting } from "@/components/app/security-setting";
// import { NotificationSetting } from "@/components/notification-setting";
// import { SupportSetting } from "@/components/app/support-settings";

// export default function SettingsPage() {

// 	const {data: session} = useSession()
// 	const user_id = session?.user?.id

//   return (
//     <div className="flex flex-col gap-8 p-6 md:px-10 max-w-5xl mx-auto w-full">
      
//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
//         <p className="text-sm text-muted-foreground">Manage your account preferences and security settings.</p>
//       </div>

//       <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
//         {/* TABS NAVIGATION (Vertical on desktop) */}
//         <TabsList className="flex md:flex-col h-auto bg-transparent gap-2 md:w-64 items-start justify-start">
//           <TabsTrigger value="profile" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
//             <User className="h-4 w-4" /> Personal Info
//           </TabsTrigger>
//           <TabsTrigger value="kyc" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
//             <FileCheck className="h-4 w-4" /> KYC & Compliance
//           </TabsTrigger>
//           <TabsTrigger value="security" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
//             <ShieldCheck className="h-4 w-4" /> Security
//           </TabsTrigger>
//           <TabsTrigger value="notifications" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
//             <Bell className="h-4 w-4" /> Notifications
//           </TabsTrigger>
//           <TabsTrigger value="support" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
//             <Headset className="h-4 w-4" /> Support
//           </TabsTrigger>
          
//           <Separator className="my-2" />
          
//           <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 py-3">
//             <LogOut className="h-4 w-4" /> Logout
//           </Button>
//         </TabsList>

//         {/* CONTENT SECTIONS */}
//         <div className="flex-1">
//           {/* PERSONAL INFO */}
//           <UserSetting user_id={user_id} />

//           {/* SECURITY */}
//           <SecuritySetting user_id={user_id} />

//           {/* NOTIFICATIONS */}
//           <NotificationSetting user_id={user_id} />

//           {/* SUPPORT */}
//           <SupportSetting user_id={user_id} />
//         </div>
//       </Tabs>
//     </div>
//   );
// }


// app/dashboard/settings/page.tsx
// "use client";

// import React from "react";
// import { 
//   User, Lock, Bell, Headset, LogOut, ShieldCheck, 
//   Smartphone, Mail, Phone, Fingerprint, KeyRound,
//   FileCheck, CreditCard, Globe, Wallet, ChevronRight,
//   AlertCircle
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";

// export default function SettingsPage() {
//   return (
//     <div className="flex flex-col gap-8 p-4 md:p-10 max-w-6xl mx-auto w-full pb-20">
      
//       {/* 1. HEADER */}
//       <div className="flex justify-between items-end px-2">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-brand-dark">Settings</h1>
//           <p className="text-sm text-n-500">Manage your international banking profile and security.</p>
//         </div>
//         <Badge className="bg-usd/10 text-usd border-none px-3 py-1">Tier 2 Verified</Badge>
//       </div>

//       <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-10">
//         {/* TABS NAVIGATION */}
//         <TabsList className="flex md:flex-col h-auto bg-transparent gap-1 md:w-72 items-start justify-start sticky top-24">
//           <SettingsTabTrigger value="profile" icon={<User size={18} />} label="Personal Profile" />
//           <SettingsTabTrigger value="compliance" icon={<FileCheck size={18} />} label="Compliance & KYC" isWarning />
//           <SettingsTabTrigger value="security" icon={<ShieldCheck size={18} />} label="Security" />
//           <SettingsTabTrigger value="preferences" icon={<Globe size={18} />} label="Wallet Preferences" />
//           <SettingsTabTrigger value="notifications" icon={<Bell size={18} />} label="Notifications" />
//           <SettingsTabTrigger value="support" icon={<Headset size={18} />} label="Help & Support" />
          
//           <Separator className="my-4" />
          
//           <Button variant="ghost" className="w-full justify-start gap-3 text-bank-error hover:text-white hover:bg-bank-error py-6 rounded-brand-button font-bold">
//             <LogOut className="h-5 w-5" /> Logout Session
//           </Button>
//         </TabsList>

//         {/* CONTENT SECTIONS */}
//         <div className="flex-1 space-y-6">
          
//           {/* PROFILE SECTION */}
//           <TabsContent value="profile" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4">
//             <Card className="border-none shadow-soft overflow-hidden">
//               <CardHeader className="bg-n-100/50">
//                 <CardTitle>Profile Details</CardTitle>
//                 <CardDescription>Legal name and contact information used for transfers.</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6 pt-6">
//                 <div className="flex items-center gap-6 mb-4">
//                   <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue text-2xl font-bold">AD</div>
//                   <Button variant="outline" size="sm" className="rounded-full border-n-300">Change Photo</Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="text-n-500">First Name</Label>
//                     <Input className="h-12 border-n-100" defaultValue="Alex" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-n-500">Last Name</Label>
//                     <Input className="h-12 border-n-100" defaultValue="Doe" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-n-500">Residential Address</Label>
//                   <Input className="h-12 border-n-100" defaultValue="123 Financial District, Lagos" />
//                 </div>
//                 <Button className="btn-primary w-full md:w-auto h-12 px-10">Save Profile</Button>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* COMPLIANCE SECTION (CRITICAL) */}
//           <TabsContent value="compliance" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4">
//             <Card className="border-none shadow-soft">
//               <CardHeader>
//                 <CardTitle>KYC & Limits</CardTitle>
//                 <CardDescription>Higher tiers unlock higher FX and transfer limits.</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8">
//                 <div className="space-y-3">
//                   <div className="flex justify-between text-sm font-bold">
//                     <span>Verification Progress</span>
//                     <span className="text-brand-blue">80%</span>
//                   </div>
//                   <Progress value={80} className="h-2 bg-n-100" />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <LimitCard label="Daily Transfer Limit" value="$10,000.00" />
//                   <LimitCard label="Monthly FX Limit" value="€50,000.00" />
//                 </div>

//                 <div className="space-y-4">
//                   <h4 className="text-sm font-bold text-n-500 uppercase">Documents</h4>
//                   <DocumentRow label="Government Issued ID" status="Verified" />
//                   <DocumentRow label="Proof of Address" status="Pending" isActionable />
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* WALLET PREFERENCES SECTION */}
//           <TabsContent value="preferences" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4">
//              <Card className="border-none shadow-soft">
//               <CardHeader>
//                 <CardTitle>Wallet & Display</CardTitle>
//                 <CardDescription>Configure how your multi-currency accounts behave.</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="flex items-center justify-between p-4 bg-n-100/50 rounded-xl">
//                   <div className="flex items-center gap-4">
//                     <Wallet className="text-brand-blue" />
//                     <div>
//                       <p className="text-sm font-bold">Default Payment Wallet</p>
//                       <p className="text-xs text-n-500">Used for local merchant payments</p>
//                     </div>
//                   </div>
//                   <Badge className="bg-white border-n-300 text-brand-dark">USD Wallet</Badge>
//                 </div>

//                 <div className="flex items-center justify-between p-4 bg-n-100/50 rounded-xl">
//                   <div className="flex items-center gap-4">
//                     <Globe className="text-brand-blue" />
//                     <div>
//                       <p className="text-sm font-bold">Base Reporting Currency</p>
//                       <p className="text-xs text-n-500">Consolidated analytics display</p>
//                     </div>
//                   </div>
//                   <Badge className="bg-white border-n-300 text-brand-dark">USD ($)</Badge>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//         </div>
//       </Tabs>
//     </div>
//   );
// }

// // --- Helper Components ---

// function SettingsTabTrigger({ value, icon, label, isWarning }) {
//   return (
//     <TabsTrigger 
//       value={value} 
//       className="w-full justify-between gap-3 py-4 px-4 data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-brand-blue rounded-brand-button transition-all group"
//     >
//       <div className="flex items-center gap-3 font-bold text-sm">
//         {icon} {label}
//       </div>
//       {isWarning && <div className="w-2 h-2 rounded-full bg-bank-warning animate-pulse" />}
//       {!isWarning && <ChevronRight size={14} className="opacity-0 group-data-[state=active]:opacity-100" />}
//     </TabsTrigger>
//   );
// }

// function LimitCard({ label, value }) {
//   return (
//     <div className="p-4 bg-n-100/30 border border-n-100 rounded-xl">
//       <p className="text-[10px] font-bold text-n-500 uppercase tracking-widest">{label}</p>
//       <p className="text-lg font-mono font-bold text-brand-dark">{value}</p>
//     </div>
//   );
// }

// function DocumentRow({ label, status, isActionable }) {
//   return (
//     <div className="flex items-center justify-between py-3 border-b border-n-100 last:border-none">
//       <span className="text-sm font-medium text-brand-dark">{label}</span>
//       <div className="flex items-center gap-3">
//         <Badge className={`border-none text-[10px] ${status === 'Verified' ? 'bg-usd/10 text-usd' : 'bg-bank-warning/10 text-bank-warning'}`}>
//           {status}
//         </Badge>
//         {isActionable && <Button variant="link" className="text-brand-blue text-xs font-bold p-0 h-auto">Upload</Button>}
//       </div>
//     </div>
//   );
// }