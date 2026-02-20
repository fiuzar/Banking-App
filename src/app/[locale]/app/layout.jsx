'use client'

import { UserContext, AccountDetailsContext } from "@/server-functions/contexts";
import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DesktopNavBar, MobileNavBar } from "@/components/app/navbers";
import {Toaster} from "sonner"


export default function Layout({ children }) {
	const [user, setUser] = useState({});
	const [accountDetails, setAccountDetails] = useState({})

	return (
		<SessionProvider>
			<UserContext.Provider value={{ user, setUser }}>
				<AccountDetailsContext.Provider value={{ accountDetails, setAccountDetails }}>
					<div className="flex min-h-screen bg-background">
						{/* DESKTOP SIDEBAR */}
						<DesktopNavBar />

						{/* MOBILE CONTENT WRAPPER */}
						<div className="flex-1 flex flex-col min-w-0">
							<main className="flex-1 pb-24 md:pb-10">
								{children}
							</main>

							{/* MOBILE BOTTOM NAV */}
							<MobileNavBar />
						</div>
						<Toaster position="top-center" richColors />
					</div>
				</AccountDetailsContext.Provider>
			</UserContext.Provider>
		</SessionProvider>
	);
}