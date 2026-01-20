'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import Link from "next/link"
import { otpVerification, handle_Signup } from "@/app/actions/auth" // Updated path
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function VerifyEmailForm({ className, ...props }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") // Get email from URL
    
    const [otp, setOtp] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [status, setStatus] = useState({ success: false, message: "" })

    useEffect(() => {
        setIsDisabled(otp.length !== 6)
    }, [otp])

    async function handle_submit() {
        setIsDisabled(true)
        const { success, message } = await otpVerification(otp, email)

        setStatus({ success, message: message || (success ? "Verified successfully!" : "Error") })

        if (success) {
            setTimeout(() => router.push("/login"), 2000)
        } else {
            setIsDisabled(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Verify your email</CardTitle>
                    <CardDescription>Enter the 6-digit code sent to {email}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {status.message && (
                            <Alert variant={status.success ? "success" : "destructive"}>
                                <AlertTitle>{status.success ? "Success" : "Error"}</AlertTitle>
                                <AlertDescription>{status.message}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid gap-3">
                            <Label>One-Time Password</Label>
                            <div className="flex justify-center">
                                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>
                        <Button onClick={handle_submit} disabled={isDisabled} className="w-full bg-green-800 text-white">
                            Verify Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}