'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect, Suspense } from "react"
import { credentialsAction, googleSignIn, otpVerification } from "@/server-functions/authentication"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, AlertCircle, Loader2, ShieldCheck, ArrowLeft } from "lucide-react"
import { signIn } from "next-auth/react"
import { useLanguage } from "@/messages/LanguageProvider"

function LoginFormContent({ className, ...props }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useLanguage()

    // Auth States
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")

    // UI States
    const [show2FA, setShow2FA] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({ success: false, message: "", type: "" })

    // Handle reset success message
    useEffect(() => {
        if (searchParams.get("reset") === "success") {
            setStatus({
                success: true,
                message: t("Login", "passwordResetSuccess"),
                type: "success"
            })
        }
    }, [searchParams, t])

    async function onLoginSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setStatus({ success: false, message: "", type: "" })

        const res = await credentialsAction(email, password)

        if (res.success) {
            router.push("/app")
        } else if (res.isTerminated) {
            router.push("/app/account-terminated")
        } else if (res.isUnverified) {
            router.push(`/continue-signup?email=${encodeURIComponent(email)}`)
        } else if (res.requires2FA) {
            setShow2FA(true)
            setLoading(false)
        } else {
            setStatus({ success: false, message: res.message, type: "error" })
            setLoading(false)
        }
    }

    async function onOTPSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const res = await otpVerification(otp, email)

        if (res.success) {
            const result = await signIn("credentials", {
                email: email.toLowerCase(),
                id: "2fa_verified",
                redirect: false,
            })

            if (result?.ok) {
                router.push("/app")
            } else {
                setStatus({
                    success: false,
                    message: t("Login", "sessionFailed"),
                    type: "error"
                })
                setLoading(false)
            }
        } else {
            setStatus({
                success: false,
                message: res.message || t("Login", "invalidCode"),
                type: "error"
            })
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="text-center pb-2 pt-8 relative">

                    {show2FA && (
                        <button
                            onClick={() => setShow2FA(false)}
                            className="absolute left-6 top-8 p-2 hover:bg-slate-50 rounded-full text-slate-400"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    <div className="mx-auto w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-2">
                        {show2FA
                            ? <ShieldCheck className="text-green-700" />
                            : <div className="font-black text-green-800 text-xl">P</div>}
                    </div>

                    <CardTitle className="text-2xl font-black tracking-tight">
                        {show2FA
                            ? t("Login", "verifyIdentity")
                            : t("Login", "welcomeBack")}
                    </CardTitle>

                    {show2FA && (
                        <p className="text-xs text-slate-500 font-medium">
                            {t("Login", "otpInstruction")}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="p-8 pt-4">

                    {status.message && (
                        <Alert className={cn(
                            "rounded-2xl border mb-6",
                            status.type === "success"
                                ? "bg-green-50 border-green-100 text-green-800"
                                : "bg-red-50 border-red-100 text-red-800"
                        )}>
                            {status.type === "success"
                                ? <CheckCircle2 size={16} />
                                : <AlertCircle size={16} />}
                            <AlertDescription className="text-xs font-bold ml-2">
                                {status.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    {!show2FA ? (
                        <form onSubmit={onLoginSubmit} className="grid gap-5">

                            <div className="grid gap-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                                    {t("Login", "emailAddress")}
                                </Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("Login", "emailPlaceholder")}
                                    className="rounded-2xl h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-green-800 transition-all"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between px-1">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                        {t("Login", "password")}
                                    </Label>
                                    <Link href="/forgot-password" className="text-[10px] font-black text-green-800 uppercase hover:underline">
                                        {t("Login", "forgotPassword")}
                                    </Link>
                                </div>

                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="rounded-2xl h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-green-800 transition-all"
                                    required
                                />
                            </div>

                            <Button
                                disabled={loading || !email || !password}
                                type="submit"
                                className="w-full bg-green-800 hover:bg-green-900 rounded-2xl h-14 font-black text-lg shadow-lg shadow-green-900/20 mt-2"
                            >
                                {loading
                                    ? <Loader2 className="animate-spin mr-2" size={18} />
                                    : t("Login", "signIn")}
                            </Button>

                            <div className="relative text-center text-[10px] font-black uppercase tracking-widest text-slate-300 my-4 after:absolute after:inset-0 after:top-1/2 after:border-t after:border-slate-100">
                                <span className="relative z-10 bg-white px-4">
                                    {t("Login", "orContinueWith")}
                                </span>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => googleSignIn()}
                                className="w-full rounded-2xl h-14 border-slate-200 font-black hover:bg-slate-50"
                            >
                                {t("Login", "googleAccount")}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={onOTPSubmit} className="grid gap-6">

                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-center text-slate-400">
                                    {t("Login", "verificationCode")}
                                </Label>
                                <Input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder={t("Login", "otpPlaceholder")}
                                    className="rounded-2xl h-20 text-center text-3xl font-black tracking-[0.5em] border-slate-100 bg-slate-50"
                                    required
                                />
                            </div>

                            <Button
                                disabled={loading || otp.length < 6}
                                type="submit"
                                className="w-full bg-green-800 hover:bg-green-900 rounded-2xl h-14 font-black text-lg"
                            >
                                {loading
                                    ? <Loader2 className="animate-spin mr-2" size={18} />
                                    : t("Login", "verifyAndLogin")}
                            </Button>

                            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {t("Login", "didntGetCode")}{" "}
                                <button
                                    type="button"
                                    onClick={onLoginSubmit}
                                    className="text-green-800 underline"
                                >
                                    {t("Login", "resend")}
                                </button>
                            </p>
                        </form>
                    )}

                    {!show2FA && (
                        <div className="text-center text-xs text-slate-500 mt-8 font-medium">
                            {t("Login", "noAccount")}{" "}
                            <Link href="/register" className="text-green-800 font-black hover:underline">
                                {t("Login", "joinPaysense")}
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export function LoginForm(props) {
    return (
        <Suspense fallback={
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin text-slate-300" />
            </div>
        }>
            <LoginFormContent {...props} />
        </Suspense>
    )
}
