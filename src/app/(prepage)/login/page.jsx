import { LoginForm } from "@/components/layout/login-form"

export const metadata = {
	title: 'Log In | Access Your Trading Journal and Dashboard',
	description: 'Log in to your trading journal to manage trades, review performance and track your journey toward prop firm rediness. Secure and fast access to your personal dashboard.',
}

export default function LoginPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<LoginForm />
			</div>
		</div>
	)
}