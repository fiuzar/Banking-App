'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import Link from "next/link"

import { ContinueSignup } from "@/server-functions/authentication"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function VerifyEmailForm({
    className,
    ...props
}) {

    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)

    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(emailParam)
        }
        else {
            router.push("/register")
        }
    }, [])

    useEffect(() => {

        if (name && password && confirmPassword && email) {
            setIsDisabled(false)
        }
        else {
            setIsDisabled(true)
        }

    }, [name, password, email, confirmPassword])

    async function handle_submit() {
        setIsDisabled(true)
        const { success, message } = await ContinueSignup(name, email, password, confirmPassword)

        if (success) {
            setSuccess(true)
            setMessage("Sign up successful, proceed to login ...")

            router.push("/login")
        }
        else {
            setSuccess(false)
            setMessage(message)
            setIsDisabled(false)
        }

        setTimeout(() => {
            setMessage("")
        }, 3000)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome to Pips</CardTitle>
                    <CardDescription>
                        Register your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        <div className="grid gap-6">
                            <div className="grid gap-6">

                                {message && (
                                    <Alert variant={success ? "success" : "destructive"}>
                                        <AlertTitle>
                                            {success ? "Success" : "Error"}
                                        </AlertTitle>
                                        <AlertDescription>{message}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="name">Full Name</Label>
                                    </div>
                                    <Input id="name" type="text" placeholder="John Emmanuel" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="confirm_password">Confirm Password</Label>
                                    </div>
                                    <Input id="confirm_password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                                <Button onClick={handle_submit} disabled={isDisabled} type="submit" className="w-full bg-green-800 text-white cursor-pointer hover:text-black">
                                    Continue
                                </Button>
                            </div>

                        </div>
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