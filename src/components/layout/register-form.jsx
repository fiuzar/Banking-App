'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import Link from "next/link"
import { googleSignIn, handle_Signup } from "@/server-functions/authentication"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PasswordStrength from "./password-strength" // Import your strength component

export function RegisterForm({ className, ...props }) {
    const router = useRouter()
    const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", password: "", confirm_password: "" })
    const [isDisabled, setIsDisabled] = useState(true)
    const [status, setStatus] = useState({ success: false, message: "" })

    useEffect(() => {
        const isValid = formData.first_name && formData.last_name && formData.email && formData.password.length >= 8 && formData.password === formData.confirm_password;
        setIsDisabled(!isValid)
    }, [formData])

    async function handle_submit() {
        setIsDisabled(true)
        const { success, message } = await handle_Signup(formData.first_name, formData.last_name, formData.email, formData.password, formData.confirm_password)

        setStatus({ success, message })
        if (success) {
            router.push(`/continue-signup?email=${encodeURIComponent(formData.email)}`)
        } else {
            setIsDisabled(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create Account</CardTitle>
                    <CardDescription>Join Paysense today</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {status.message && (
                            <Alert variant={status.success ? "success" : "destructive"}>
                                <AlertDescription>{status.message}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>First Name</Label>
                                <Input onChange={(e) => setFormData({...formData, first_name: e.target.value})} placeholder="John" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Last Name</Label>
                                <Input onChange={(e) => setFormData({...formData, last_name: e.target.value})} placeholder="Doe" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@example.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Password</Label>
                            <Input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            <PasswordStrength password={formData.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Confirm Password</Label>
                            <Input type="password" onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} />
                        </div>
                        <Button onClick={handle_submit} disabled={isDisabled} className="w-full bg-green-800">Create Account</Button>
                        
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="relative z-10 bg-white px-2 text-muted-foreground">Or</span>
                        </div>
                        
                        <Button onClick={() => googleSignIn()} variant="outline" className="w-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                             Continue with Google
                        </Button>
                    </div>
                    <div className="text-center text-sm mt-7">
                                Don&apos;t have an account?{" "}
                                <Link href="/login" className="underline underline-offset-4">
                                    Sign In
                                </Link>
                            </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link href="/terms">Terms of Service</Link>{" "}
                and <Link href="/privacy-policy">Privacy Policy</Link>.
            </div>
        </div>
    )
}