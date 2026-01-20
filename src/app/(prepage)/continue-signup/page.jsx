import { VerifyEmailForm } from "@/components/layout/verify-email-form"
import { Suspense } from "react"

export default function ContinueSignUp() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <div className="flex w-full max-w-sm flex-col gap-6">
                {/* Wrapping in Suspense fixes the 'useSearchParams' error 
                   by telling Next.js how to handle the component while 
                   it waits for the URL params.
                */}
                <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading verification...</div>}>
                    <VerifyEmailForm />
                </Suspense>
            </div>
        </div>
    )
}