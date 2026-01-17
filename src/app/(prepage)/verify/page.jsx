// app/verify/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only numbers
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-n-100 px-screen-p py-12">
      <Card className="w-full max-w-[440px] border-none shadow-soft rounded-brand-card">
        <CardHeader className="space-y-2 text-center pt-10 px-10">
          <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">📩</span>
          </div>
          <CardTitle className="text-2xl font-bold text-brand-dark">Verify your email</CardTitle>
          <p className="text-n-500 text-sm leading-relaxed">
            We&apos;ve sent a 6-digit code to <br />
            <span className="font-bold text-brand-dark">jane***@example.com</span>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-10 px-10">
          {/* OTP Input Group */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border border-n-300 rounded-brand-input focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 outline-none transition-all bg-white"
              />
            ))}
          </div>

          <div className="space-y-4">
            <Button className="btn-primary w-full shadow-lg shadow-brand-blue/10 h-[54px]">
              Verify & Continue
            </Button>
            
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-n-500 font-medium">
                  Resend code in <span className="text-brand-blue">{timer}s</span>
                </p>
              ) : (
                <button 
                  className="text-sm font-bold text-brand-blue hover:underline cursor-pointer"
                  onClick={() => setTimer(59)}
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-n-100 text-center">
            <Link href="/signup" className="text-xs font-bold text-n-500 hover:text-brand-blue uppercase tracking-wider">
              ← Use a different email
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}