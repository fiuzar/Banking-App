'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { requestPasswordReset } from "@/server-functions/authentication"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({ success: false, message: "" })

    async function onSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setStatus({ success: false, message: "" })

        const res = await requestPasswordReset(email)
        
        if (res.success) {
            setStatus({ success: true, message: res.message })
        } else {
            setStatus({ success: false, message: res.message })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-6">
            <div className="w-full max-w-md flex flex-col gap-6">
                <Card className="rounded-[24px] border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="pt-8 text-center">
                        <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail size={24} />
                        </div>
                        <CardTitle className="text-2xl font-black">Reset Password</CardTitle>
                        <p className="text-sm text-slate-500 mt-2">
                            Enter your email and we'll send you a link to get back into your account.
                        </p>
                    </CardHeader>
                    <CardContent className="pb-8">
                        {status.success ? (
                            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                <Alert className="bg-green-50 border-green-100 text-green-900 rounded-2xl">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="font-medium">
                                        {status.message}
                                    </AlertDescription>
                                </Alert>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full rounded-xl mt-4">
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="grid gap-4">
                                {status.message && (
                                    <Alert variant="destructive" className="rounded-2xl">
                                        <AlertDescription>{status.message}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        Email Address
                                    </Label>
                                    <Input 
                                        id="email"
                                        type="email" 
                                        placeholder="name@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="rounded-xl h-12 border-slate-200 focus:ring-green-800"
                                        required
                                    />
                                </div>
                                <Button 
                                    disabled={loading || !email} 
                                    type="submit" 
                                    className="w-full bg-green-800 hover:bg-green-900 text-white rounded-xl h-12 font-bold transition-all"
                                >
                                    {loading ? "Sending link..." : "Send Reset Link"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
                <div className="text-center">
                    <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-green-800 transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}