import React from "react";
import { 
  User, Lock, Bell, Headset, LogOut, 
  ShieldCheck, Smartphone, Mail, Phone,
  ChevronRight, Fingerprint, KeyRound
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-5xl mx-auto w-full">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences and security settings.</p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
        {/* TABS NAVIGATION (Vertical on desktop) */}
        <TabsList className="flex md:flex-col h-auto bg-transparent gap-2 md:w-64 items-start justify-start">
          <TabsTrigger value="profile" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
            <User className="h-4 w-4" /> Personal Info
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
            <ShieldCheck className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="support" className="w-full justify-start gap-3 py-3 data-[state=active]:bg-muted">
            <Headset className="h-4 w-4" /> Support
          </TabsTrigger>
          
          <Separator className="my-2" />
          
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 py-3">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </TabsList>

        {/* CONTENT SECTIONS */}
        <div className="flex-1">
          {/* PERSONAL INFO */}
          <TabsContent value="profile" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details and contact info.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Alex" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input id="email" defaultValue="alex.doe@example.com" readOnly className="bg-muted" />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+234 812 345 6789" />
                </div>
                <Button className="mt-4">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>Manage your passwords and authentication methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full"><KeyRound className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium">Transaction PIN</p>
                      <p className="text-xs text-muted-foreground">Required for all transfers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full"><Fingerprint className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium">Biometric Login</p>
                      <p className="text-xs text-muted-foreground">Face ID or Fingerprint</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full"><Smartphone className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-muted-foreground">Secure your account with OTP</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Decide how you want to be notified.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex flex-col gap-1">
                      <span>Transaction Alerts</span>
                      <span className="text-xs font-normal text-muted-foreground">Get notified of debits and credits.</span>
                    </Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex flex-col gap-1">
                      <span>Login Alerts</span>
                      <span className="text-xs font-normal text-muted-foreground">Alert me when my account is accessed.</span>
                    </Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex flex-col gap-1">
                      <span>Marketing & Promotions</span>
                      <span className="text-xs font-normal text-muted-foreground">News about new features and offers.</span>
                    </Label>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPPORT */}
          <TabsContent value="support" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>Get in touch with us 24/7.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Phone className="h-5 w-5" />
                  Call Help Desk
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}


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