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