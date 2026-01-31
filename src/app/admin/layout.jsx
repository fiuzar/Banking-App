import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  Users, 
  ArrowLeftRight, 
  ShieldCheck, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Search,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }) {
  const session = await auth();

  // Double-check role security at the layout level
  if (session?.user?.role !== "admin") {
    redirect("/app");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Paysense <span className="text-indigo-400">HQ</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">Main Menu</p>
          
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" />
          <AdminNavLink href="/admin/users" icon={<Users size={18} />} label="User Management" />
          <AdminNavLink href="/admin/wires" icon={<ArrowLeftRight size={18} />} label="Wire Transfers" />
          <AdminNavLink href="/admin/crypto" icon={<Settings size={18} />} label="Crypto Assets" />
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name?.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Super Admin</p>
                </div>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search users, TXIDs, or emails..." 
              className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm" className="text-slate-500 font-bold hover:text-red-600">
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper component for Nav Links
function AdminNavLink({ href, icon, label }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group"
    >
      <span className="text-slate-500 group-hover:text-indigo-400">{icon}</span>
      {label}
    </Link>
  );
}