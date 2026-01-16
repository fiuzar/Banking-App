'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { SessionProvider } from "next-auth/react"

export default function AppLayout({children}) {

  return (
    <SessionProvider>
      {/* Wrap everything in the TradeAccountProvider */}
      
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)"
            }
          }>
          <AppSidebar variant="inset" />
          <SidebarInset>
            {/* <SiteHeader /> */}
            <div className="px-4 py-2">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
    </SessionProvider>
  );
}