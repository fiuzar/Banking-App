'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect, Suspense } from "react"
import { credentialsAction, googleSignIn } from "@/server-functions/authentication"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

function LoginFormContent({ className, ...props }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({ success: false, message: "", type: "" })

    // Listen for "reset=success" in the URL to show a confirmation
    useEffect(() => {
        if (searchParams.get("reset") === "success") {
            setStatus({ success: true, message: "Password reset successfully. Please login.", type: "success" })
        }
    }, [searchParams])

    async function onSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setStatus({ success: false, message: "", type: "" })

        const res = await credentialsAction(email, password)

        if (res.success) {
            router.push("/app")
        } else if (res.isUnverified) {
            router.push(`/continue-signup?email=${encodeURIComponent(email)}`)
        } else {
            setStatus({ success: false, message: res.message, type: "error" })
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="rounded-[24px] border-slate-200 shadow-sm">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-black">Welcome back</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="grid gap-5">
                        {/* Dynamic Alert System */}
                        {status.message && (
                            <Alert className={cn(
                                "rounded-xl border animate-in fade-in duration-300",
                                status.type === "success" ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
                            )}>
                                {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                <AlertDescription className="text-xs font-medium ml-2">{status.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</Label>
                            <Input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="name@example.com"
                                className="rounded-xl h-12 border-slate-200 focus:ring-green-800"
                                required 
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between px-1">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
                                <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-green-800 uppercase tracking-tighter hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <Input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="rounded-xl h-12 border-slate-200 focus:ring-green-800"
                                required 
                            />
                        </div>

                        <Button disabled={loading || !email || !password} type="submit" className="w-full bg-green-800 hover:bg-green-900 rounded-xl h-12 font-bold shadow-lg shadow-green-900/10">
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "Login"}
                        </Button>

                        <div className="relative text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 my-2 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-100">
                            <span className="relative z-10 bg-white px-4">Or continue with</span>
                        </div>

                        <Button type="button" variant="outline" onClick={() => googleSignIn()} className="w-full rounded-xl h-12 border-slate-200 font-bold hover:bg-slate-50">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
                            </svg>
                            Google
                        </Button>

                        <div className="text-center text-xs text-slate-500 mt-2">
                            New here? <Link href="/register" className="text-green-800 font-bold hover:underline">Create an account</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export function LoginForm(props) {
    return (
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-300" /></div>}>
            <LoginFormContent {...props} />
        </Suspense>
    )
}