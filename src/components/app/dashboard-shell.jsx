// components/dashboard/DashboardShell.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Wallet,
	Repeat,
	Send,
	CircleDollarSign,
	History,
	UserCircle,
	Bell,
	CreditCard,
	Menu
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/button";
import { Button } from "@/components/ui/button"
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/server-functions/contexts"
import { getCurrentUser } from "@/server-functions/authentication";

const navItems = [
	{ name: "Dashboard", href: "/app", icon: LayoutDashboard },
	{ name: "Wallets", href: "/app/accounts/USD", icon: Wallet },
	{ name: "Convert", href: "/app/convert", icon: Repeat },
	{ name: "Transfers", href: "/app/transfer", icon: Send },
	{ name: "Cards", href: "/app/cards", icon: CreditCard },
	{ name: "Loans", href: "/app/loan", icon: CircleDollarSign },
	{ name: "History", href: "/app/history", icon: History },
];

export default function DashboardShell({ children }) {
	const { data: session } = useSession()
	const user_id = session?.user?.id
	const { user, setUser } = useContext(UserContext)
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {

		async function get_user() {

			if (user_id) {
				const user_data = await getCurrentUser(user_id)
				setUser(user_data)
			}

		}

		get_user()

	}, [user_id])

	return (
		<div className="flex min-h-screen bg-n-100">
			{/* Sidebar - Desktop */}
			<aside className="hidden lg:flex w-64 flex-col bg-white border-r border-n-300 sticky top-0 h-screen">
				<div className="p-8">
					<Link href="/app" className="text-2xl font-bold text-brand-blue tracking-tighter">
						PaySense
					</Link>
				</div>

				<nav className="flex-1 px-4 space-y-2">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex items-center gap-3 px-4 py-3 rounded-brand-button font-medium transition-all ${isActive
									? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
									: "text-n-500 hover:bg-n-100 hover:text-brand-dark"
									}`}
							>
								<item.icon className="w-5 h-5" />
								{item.name}
							</Link>
						);
					})}
				</nav>

				<div className="p-4 border-t border-n-100">
					<Link href="/app/settings" className="flex items-center gap-3 px-4 py-3 text-n-500 hover:text-brand-dark transition-colors">
						<UserCircle className="w-5 h-5" />
						<span className="font-medium">Profile Settings</span>
					</Link>
				</div>
			</aside>

			{/* Sidebar - Mobile Drawer */}
			{sidebarOpen && (
				<div className="fixed inset-0 z-40 flex lg:hidden">
					<div className="relative flex w-64 flex-col bg-white border-r border-n-300 h-full">
						<div className="p-8 flex justify-between items-center">
							<Link href="/app" className="text-2xl font-bold text-brand-blue tracking-tighter">
								PaySense
							</Link>
							<button
								onClick={() => setSidebarOpen(false)}
								className="ml-2 p-2 rounded hover:bg-n-100"
								aria-label="Close sidebar"
							>
								<svg className="h-6 w-6 text-n-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<nav className="flex-1 px-4 space-y-2">
							{navItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.name}
										href={item.href}
										className={`flex items-center gap-3 px-4 py-3 rounded-brand-button font-medium transition-all ${isActive
											? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
											: "text-n-500 hover:bg-n-100 hover:text-brand-dark"
											}`}
										onClick={() => setSidebarOpen(false)}
									>
										<item.icon className="w-5 h-5" />
										{item.name}
									</Link>
								);
							})}
						</nav>
						<div className="p-4 border-t border-n-100">
							<Link href="/app/settings" className="flex items-center gap-3 px-4 py-3 text-n-500 hover:text-brand-dark transition-colors" onClick={() => setSidebarOpen(false)}>
								<UserCircle className="w-5 h-5" />
								<span className="font-medium">Profile Settings</span>
							</Link>
						</div>
					</div>
					{/* Overlay */}
					<div className="flex-1 bg-black/30" onClick={() => setSidebarOpen(false)} />
				</div>
			)}

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col min-w-0">
				{/* Top Header */}
				<header className="h-16 bg-white border-b border-n-300 flex items-center justify-between px-screen-p sticky top-0 z-30">
					<span className="hidden lg:block"></span>
					{/* Hamburger menu for mobile */}
					<button
						className="lg:hidden p-2 rounded hover:bg-n-100"
						onClick={() => setSidebarOpen(true)}
						aria-label="Open sidebar"
					>
						<Menu />
					</button>
					{/* <div className="lg:hidden font-bold text-brand-blue">PaySense</div> */}
					{/* <div className="hidden lg:block text-sm font-semibold text-n-500">
            {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
          </div> */}

					<div className="flex items-center gap-4">
						<button className="p-2 text-n-500 hover:bg-n-100 rounded-full relative">
							<Bell className="w-5 h-5" />
							<span className="absolute top-2 right-2 w-2 h-2 bg-bank-error rounded-full border-2 border-white" />
						</button>
						<div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
							{user.first_name ? user.first_name.charAt(0).toUpperCase() : ""}
						</div>
					</div>
				</header>

				{/* Page Content */}
				<div className="px-screen-p py-3 overflow-y-auto overflow-x-hidden">
					{children}
				</div>
			</main>
		</div>
	);
}