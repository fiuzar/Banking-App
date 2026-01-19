import { VerifyEmailForm } from "@/components/layout/verify-email-form"

export default function ContinueSignUp() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <VerifyEmailForm />
            </div>
        </div>
    )
}