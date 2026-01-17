import { RegisterForm } from "@/components/layout/register-form"

export const metadata = {
    title: 'Create an Account | Start your free trading journal today',
    description: 'Join thousands of traders building consistency and discipline. Create a free account to start logging trades, managing risk and improving your trading performance.',
}

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <RegisterForm />
            </div>
        </div>
    )
}