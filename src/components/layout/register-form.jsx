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

export function RegisterForm({ className, ...props }) {
    const router = useRouter()
    const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", password: "", confirm_password: "" })
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [status, setStatus] = useState({ success: false, message: "" })

    useEffect(() => {
        const isValid = 
            formData.first_name.trim() && 
            formData.last_name.trim() && 
            formData.email.trim() && 
            formData.password.length >= 8 && 
            formData.password === formData.confirm_password;
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
            // Give the user a moment to see the success message before redirecting
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
                    <CardTitle className="text-2xl font-black tracking-tight">Create Account</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Join Paysense to start banking</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handle_submit} className="grid gap-4">
                        {status.message && (
                            <Alert className={cn(
                                "rounded-xl border animate-in fade-in duration-300",
                                status.success ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
                            )}>
                                {status.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                <AlertDescription className="text-xs font-medium ml-2">{status.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">First Name</Label>
                                <Input 
                                    className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                                    placeholder="John" 
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Last Name</Label>
                                <Input 
                                    className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                                    placeholder="Doe" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</Label>
                            <Input 
                                type="email" 
                                className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                placeholder="name@example.com" 
                                required
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</Label>
                            <Input 
                                type="password" 
                                className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                placeholder="••••••••"
                                required
                            />
                            <PasswordStrength password={formData.password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Confirm Password</Label>
                            <Input 
                                type="password" 
                                className="rounded-xl h-11 border-slate-200 focus:ring-green-800"
                                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} 
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button 
                            disabled={isDisabled || loading} 
                            type="submit" 
                            className="w-full bg-green-800 hover:bg-green-900 text-white rounded-xl h-12 font-bold shadow-lg shadow-green-900/10 mt-2 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "Create Account"}
                        </Button>
                        
                        <div className="relative text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 my-2 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-100">
                            <span className="relative z-10 bg-white px-4">Or sign up with</span>
                        </div>
                        
                        <Button 
                            type="button"
                            onClick={() => googleSignIn()} 
                            variant="outline" 
                            className="w-full rounded-xl h-11 border-slate-200 font-bold hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            Google
                        </Button>

                        <div className="text-center text-xs text-slate-500 mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="text-green-800 font-bold hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground text-center text-[10px] leading-relaxed px-4">
                By creating an account, you agree to our <Link href="/terms" className="underline underline-offset-4 font-medium">Terms of Service</Link>{" "}
                and <Link href="/privacy-policy" className="underline underline-offset-4 font-medium">Privacy Policy</Link>.
            </div>
        </div>
    )
}