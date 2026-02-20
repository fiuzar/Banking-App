'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { otpVerification, create_otp } from "@/server-functions/authentication"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/messages/LanguageProvider"

export function VerifyEmailForm({ className, ...props }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useLanguage()

    const email = searchParams.get("email")

    const [otp, setOtp] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [status, setStatus] = useState({ success: false, message: "" })

    useEffect(() => {
        setIsDisabled(otp.length !== 6)
    }, [otp])

    async function handle_submit() {
        setIsDisabled(true)

        const { success, message } = await otpVerification(otp, email)

        setStatus({
            success,
            message:
                message ||
                (success
                    ? t("VerifyEmailForm", "successMessage")
                    : t("VerifyEmailForm", "errorMessage"))
        })

        if (success) {
            setTimeout(() => router.push("/login"), 2000)
        } else {
            setIsDisabled(false)
        }
    }

    async function handleResend() {
        const { success, message } = await create_otp(email)

        setStatus({
            success,
            message:
                message ||
                (success
                    ? t("VerifyEmailForm", "successMessage")
                    : t("VerifyEmailForm", "errorMessage"))
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {t("VerifyEmailForm", "title")}
                    </CardTitle>

                    <CardDescription>
                        {t("VerifyEmailForm", "description").replace("{email}", email || "")}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6">

                        {status.message && (
                            <Alert variant={status.success ? "success" : "destructive"}>
                                <AlertTitle>
                                    {status.success
                                        ? t("VerifyEmailForm", "successTitle")
                                        : t("VerifyEmailForm", "errorTitle")}
                                </AlertTitle>
                                <AlertDescription>
                                    {status.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-3">

                            <div className="flex justify-between items-center">
                                <Label>
                                    {t("VerifyEmailForm", "otpLabel")}
                                </Label>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleResend}
                                    className="underline text-green-800"
                                >
                                    {t("VerifyEmailForm", "resend")}
                                </Button>
                            </div>

                            <div className="flex justify-center">
                                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>

                                    <InputOTPSeparator />

                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        <Button
                            onClick={handle_submit}
                            disabled={isDisabled}
                            className="w-full bg-green-800 text-white"
                        >
                            {t("VerifyEmailForm", "verifyButton")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
