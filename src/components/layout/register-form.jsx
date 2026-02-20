'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { googleSignIn, handle_Signup } from "@/server-functions/authentication"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PasswordStrength from "./password-strength"
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/messages/LanguageProvider"

export function RegisterForm({ className, ...props }) {
    const router = useRouter()
    const { t } = useLanguage()

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [status, setStatus] = useState({ success: false, message: "" })

    useEffect(() => {
        const isValid =
            formData.first_name.trim() &&
            formData.last_name.trim() &&
            formData.email.trim() &&
            formData.password.length >= 8 &&
            formData.password === formData.confirm_password

        setIsDisabled(!isValid)
    }, [formData])

    async function handle_submit(e) {
        e.preventDefault()
        setLoading(true)
        setStatus({ success: false, message: "" })

        const res = await handle_Signup(
            formData.first_name,
            formData.last_name,
            formData.email,
            formData.password,
            formData.confirm_password
        )

        if (res.success) {
            setStatus({ success: true, message: res.message })
            setTimeout(() => {
                router.push(`/continue-signup?email=${encodeURIComponent(formData.email)}`)
            }, 1500)
        } else {
            setStatus({ success: false, message: res.message })
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="rounded-[24px] border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="text-center pb-2">
                    <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                        <UserPlus size={24} />
                    </div>

                    <CardTitle className="text-2xl font-black tracking-tight">
                        {t("RegisterForm", "createAccount")}
                    </CardTitle>

                    <CardDescription className="text-slate-500 font-medium">
                        {t("RegisterForm", "joinPaysense")}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handle_submit} className="grid gap-4">

                        {status.message && (
                            <Alert className={cn(
                                "rounded-xl border",
                                status.success
                                    ? "bg-green-50 border-green-100 text-green-800"
                                    : "bg-red-50 border-red-100 text-red-800"
                            )}>
                                {status.success
                                    ? <CheckCircle2 size={16} />
                                    : <AlertCircle size={16} />}
                                <AlertDescription className="text-xs font-medium ml-2">
                                    {status.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                    {t("RegisterForm", "firstName")}
                                </Label>
                                <Input
                                    className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                    placeholder={t("RegisterForm", "placeholderFirstName")}
                                    onChange={(e) =>
                                        setFormData({ ...formData, first_name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                    {t("RegisterForm", "lastName")}
                                </Label>
                                <Input
                                    className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                    placeholder={t("RegisterForm", "placeholderLastName")}
                                    onChange={(e) =>
                                        setFormData({ ...formData, last_name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                {t("RegisterForm", "emailAddress")}
                            </Label>
                            <Input
                                type="email"
                                className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                placeholder={t("RegisterForm", "placeholderEmail")}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                {t("RegisterForm", "password")}
                            </Label>
                            <Input
                                type="password"
                                className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />
                            <PasswordStrength password={formData.password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                {t("RegisterForm", "confirmPassword")}
                            </Label>
                            <Input
                                type="password"
                                className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                onChange={(e) =>
                                    setFormData({ ...formData, confirm_password: e.target.value })
                                }
                                required
                            />
                        </div>

                        <Button
                            disabled={isDisabled || loading}
                            type="submit"
                            className="w-full bg-green-800 hover:bg-green-900 text-white rounded-xl h-12 font-bold shadow-lg shadow-green-900/10 mt-2"
                        >
                            {loading
                                ? <Loader2 className="animate-spin mr-2" size={18} />
                                : t("RegisterForm", "createAccountButton")}
                        </Button>

                        <div className="relative text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 my-2 after:absolute after:inset-0 after:top-1/2 after:border-t after:border-slate-100">
                            <span className="relative z-10 bg-white px-4">
                                {t("RegisterForm", "orSignUpWith")}
                            </span>
                        </div>

                        <Button
                            type="button"
                            onClick={() => googleSignIn()}
                            variant="outline"
                            className="w-full rounded-xl h-11 border-slate-200 font-bold hover:bg-slate-50"
                        >
                            {t("RegisterForm", "google")}
                        </Button>

                        <div className="text-center text-xs text-slate-500 mt-2">
                            {t("RegisterForm", "alreadyHaveAccount")}{" "}
                            <Link href="/login" className="text-green-800 font-bold hover:underline">
                                {t("RegisterForm", "signIn")}
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-muted-foreground text-center text-[10px] leading-relaxed px-4">
                {t("RegisterForm", "termsAgreement")}{" "}
                <Link href="/terms" className="underline underline-offset-4 font-medium">
                    {t("RegisterForm", "termsOfService")}
                </Link>{" "}
                &{" "}
                <Link href="/privacy-policy" className="underline underline-offset-4 font-medium">
                    {t("RegisterForm", "privacyPolicy")}
                </Link>
                .
            </div>
        </div>
    )
}
