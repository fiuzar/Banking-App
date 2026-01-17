// app/forgot-password/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-n-100 px-screen-p py-12">
      <Card className="w-full max-w-[440px] border-none shadow-soft rounded-brand-card text-center">
        <CardHeader className="space-y-2 pt-10 px-10">
          <div className="mx-auto w-12 h-12 bg-n-300/20 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">🔐</span>
          </div>
          <CardTitle className="text-2xl font-bold text-brand-dark">Forgot Password?</CardTitle>
          <p className="text-n-500 text-sm leading-relaxed">
            Enter the email address associated with your account and we'll send instructions to reset your password.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-10 px-10">
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-n-700 uppercase" htmlFor="email">Email Address</label>
            <Input id="email" type="email" placeholder="jane@example.com" className="input-field" />
          </div>

          <Button className="btn-primary w-full shadow-lg shadow-brand-blue/10 h-[54px]">
            Send Instructions
          </Button>

          <div className="pt-4">
            <Link href="/login" className="text-sm font-bold text-brand-blue hover:underline">
              Return to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}