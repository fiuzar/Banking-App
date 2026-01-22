'use client'

import { UserContext } from "@/server-functions/contexts";
import { SessionProvider } from "next-auth/react";
import DashboardShell from "@/components/app/dashboard-shell";
import React, { useState } from "react";

export default function Layout({ children }) {
	const [user, setUser] = useState({});

	return (
		<SessionProvider>
			<UserContext.Provider value={{ user, setUser }}>
				<DashboardShell>
					{/* This renders the actual page content inside our sidebar frame */}
					{children}
				</DashboardShell>
			</UserContext.Provider>
		</SessionProvider>
	);
}