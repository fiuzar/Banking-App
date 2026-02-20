'use client' // Changed to client component to handle menu state

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Users, 
  ArrowLeftRight, 
  ShieldCheck, 
  LayoutDashboard, 
  Logs,
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children, session }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on link click (mobile)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 
        transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2" onClick={closeSidebar}>
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              Paysense <span className="text-indigo-400">HQ</span>
            </span>
          </Link>
          <button className="md:hidden text-slate-400" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">Main Menu</p>
          
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === '/admin'} onClick={closeSidebar} />
          <AdminNavLink href="/admin/users" icon={<Users size={18} />} label="User Management" active={pathname.startsWith('/admin/users')} onClick={closeSidebar} />
          <AdminNavLink href="/admin/wires" icon={<ArrowLeftRight size={18} />} label="Wire Transfers" active={pathname.startsWith('/admin/wires')} onClick={closeSidebar} />
          <AdminNavLink href="/admin/crypto" icon={<CreditCard size={18} />} label="Crypto Assets" active={pathname.startsWith('/admin/crypto')} onClick={closeSidebar} />
          <AdminNavLink href="/admin/support" icon={<MessageSquare size={18} />} label="Support" active={pathname.startsWith('/admin/support')} onClick={closeSidebar} />
          <AdminNavLink href="/admin/log" icon={<Logs size={18} />} label="Logs" active={pathname.startsWith('/admin/log')} onClick={closeSidebar} />
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {session?.user?.name?.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{session?.user?.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Super Admin</p>
                </div>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Toggle */}
            <button 
              className="p-2 -ml-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search HQ..." 
                className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm" className="text-slate-500 font-bold hover:text-red-600 px-2 sm:px-3">
                <LogOut size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}

function AdminNavLink({ href, icon, label, active, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
        {icon}
      </span>
      {label}
    </Link>
  )
}