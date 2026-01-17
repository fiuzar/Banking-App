// app/reset-password/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordStrength from "@/components/layout/password-strength";

export default function ResetPassword() {
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-n-100 px-screen-p py-12">
      <Card className="w-full max-w-[440px] border-none shadow-soft rounded-brand-card">
        <CardHeader className="space-y-2 pt-10 px-10 text-center">
          <CardTitle className="text-2xl font-bold text-brand-dark">Set New Password</CardTitle>
          <p className="text-n-500 text-sm">Create a strong password to protect your PaySense account.</p>
        </CardHeader>
        
        <CardContent className="space-y-5 pb-10 px-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-n-700 uppercase" htmlFor="password">New Password</label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-n-700 uppercase" htmlFor="confirm">Confirm New Password</label>
            <Input id="confirm" type="password" placeholder="••••••••" className="input-field" />
          </div>

          <Button className="btn-primary w-full shadow-lg shadow-brand-blue/10 h-[54px] mt-4">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}