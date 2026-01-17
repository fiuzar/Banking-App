// 'use client'

// import { AppSidebar } from "@/components/app-sidebar"
// import { SiteHeader } from "@/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"

// import { SessionProvider } from "next-auth/react"

// export default function AppLayout({children}) {

//   return (
//     <SessionProvider>
//       {/* Wrap everything in the TradeAccountProvider */}
      
//         <SidebarProvider
//           style={
//             {
//               "--sidebar-width": "calc(var(--spacing) * 72)",
//               "--header-height": "calc(var(--spacing) * 12)"
//             }
//           }>
//           <AppSidebar variant="inset" />
//           <SidebarInset>
//             {/* <SiteHeader /> */}
//             <div className="py-2 px-4 lg:px-8">
//               {children}
//             </div>
//           </SidebarInset>
//         </SidebarProvider>
//     </SessionProvider>
//   );
// }

// app/dashboard/layout.tsx
import DashboardShell from "@/components/app/dashboard-shell";

export default function Layout({ children }) {
  return (
    <DashboardShell>
      {/* This renders the actual page content inside our sidebar frame */}
      {children}
    </DashboardShell>
  );
}