"use client"

import Link from "next/link"
import * as React from "react"

import {useEffect} from "react"

import {
   History,
   LayoutDashboard,
   CreditCard,
   ShieldCheck,
   LogOut,
   Settings,
   HelpCircle,
   DollarSign
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: LayoutDashboard,
    },
    {
      title: "Transfer",
      url: "/app/send",
      icon: LayoutDashboard,
    },
    {
      title: "History",
      url: "/app/history",
      icon: History,
    },
    {
      title: "Cards",
      url: "/app/cards",
      icon: CreditCard,
    },
    {
      title: "Loan Request",
      url: "/app/loan",
      icon: DollarSign,
    }
  ],
  navSecondary: [
    // {
    //   title: "Fees & Rates",
    //   url: "/app/settings",
    //   icon: Settings,
    // },
    {
      title: "Settings",
      url: "/app/settings",
      icon: Settings,
    },
    {
      title: "Help Center",
      url: "/app/help",
      icon: HelpCircle,
    },
    {
      title: "Log Out",
      url: "/logout",
      icon: LogOut,
    },
  ],
}

export function AppSidebar({ ...props }) {
  // 3. Theme Setup
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="#">
                {/* <Image src="/img/logo.png" alt="Pip Logo" width={32} height={32} className="rounded-sm" /> */}
                <span className="bg-purple-800 h-8 w-8 rounded-sm"></span>
                <span className="text-base font-semibold">PaySense</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}