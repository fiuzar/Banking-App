'use client'

import { UserContext, AccountDetailsContext } from "@/server-functions/contexts";
import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DesktopNaBar, MobileNavBar } from "@/components/app/navbers";


export default function Layout({ children }) {
	const [user, setUser] = useState({});
	const [accountDetails, setAccountDetails] = useState({})

	return (
		<SessionProvider>
			<UserContext.Provider value={{ user, setUser }}>
				<AccountDetailsContext.Provider value={{ accountDetails, setAccountDetails }}>
					<div className="flex min-h-screen bg-background">
						{/* DESKTOP SIDEBAR */}
						<DesktopNaBar />

						{/* MOBILE CONTENT WRAPPER */}
						<div className="flex-1 flex flex-col min-w-0">
							<main className="flex-1 pb-24 md:pb-10">
								{children}
							</main>

							{/* MOBILE BOTTOM NAV */}
							<MobileNavBar />
						</div>
					</div>
				</AccountDetailsContext.Provider>
			</UserContext.Provider>
		</SessionProvider>
	);
}