"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium"></h1>
        <div className="ml-auto flex items-center">
          {/* <DropdownMenu>
            <DropdownMenuTrigger className="bg-zinc-100 dark:bg-zinc-900 cursor-pointer p-2 rounded-lg hover:bg-background">
              <User2Icon size={20}/>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={`mr-8 gap-y-4 text-sm`}>
              <Link href={`/app/profile`} className="flex gap-2 mb-1 hover:bg-zinc-800 py-1 px-2 rounded-md">
                <User /> Profile
              </Link>
              <Link href={`/app/trade-accounts`} className="flex gap-2 mb-1 hover:bg-zinc-800 px-2 py-1 rounded-md">
                <LogsIcon /> Trade Accounts
              </Link>
              <Link href={`/app/billing`} className="flex gap-2 mb-1 hover:bg-zinc-800 px-2 py-1 rounded-md">
                <Receipt /> Billing
              </Link>
              <Link href={`/app/billing`} className="flex gap-2 mb-1 hover:bg-zinc-800 px-2 py-1 rounded-md">
                <Settings /> Settings
              </Link>
              <Link href={`/app/affiliate`} className="flex gap-2 mb-1 hover:bg-zinc-800 px-2 py-1 rounded-md">
                <IconAffiliate /> Affiliate
              </Link>
              <DropdownMenuSeparator />
              <Button onClick={() => signOut({redirectTo: "/login"})} className="flex gap-2 mb-1 hover:bg-zinc-800 px-2 py-1 rounded-md bg-red-700 w-full text-white">
                <LogOutIcon /> Logout
              </Button>
            </DropdownMenuContent>
          </DropdownMenu> */}
          {/* <Link href="/app/profile">
            <Button variant="ghost" className="bg-zinc-100 dark:bg-zinc-900 cursor-pointer">
              
            </Button>
          </Link> */}
        </div>
      </div>
    </header>
  );
}
