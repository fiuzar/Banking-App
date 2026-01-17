import { VerifyEmailForm } from "@/components/root/verify-email-form"

export const metadata = {
    title: "Complete Your Profile | Customize Your Trading Experience",
    description: "Finish setting up your profile to personalize your trading journal. Set your trading goals, choose preferred pairs and unlock analytics tailored to your style.",
}

export default function ContinueSignUp() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <VerifyEmailForm />
            </div>
        </div>
    )
}