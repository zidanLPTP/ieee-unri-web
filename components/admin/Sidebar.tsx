"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  LogOut,
  Settings
} from "lucide-react";
import { logoutAction } from "@/actions/auth-actions"; // Pastikan path ini sesuai

// Konfigurasi Menu Sidebar
const menuGroups = [
  {
    label: "Main",
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Personnel Management",
    items: [
      { name: "All Personnel", href: "/admin/pengurus", icon: Users },
      { name: "Add New", href: "/admin/pengurus/add", icon: UserPlus },
    ],
  },
  {
    label: "Content Management",
    items: [
      { name: "Events", href: "/admin/events/create", icon: Calendar },
      { name: "Articles", href: "/admin/articles/create", icon: FileText }, 
      { name: "Gallery", href: "/admin/gallery/create", icon: ImageIcon }, 
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login"); 
  };

  return (
    <div className="h-full w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col text-white shadow-xl fixed md:relative z-50">
      
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#fbbf24] rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">

            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#0f172a]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div>
            <h1 className="font-bold text-lg tracking-tight">IEEE Admin</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Control Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-[#fbbf24] text-[#0f172a] shadow-md shadow-yellow-500/10"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <item.icon
                        size={18}
                        className={`transition-colors ${
                          isActive ? "text-[#0f172a]" : "text-slate-500 group-hover:text-white"
                        }`}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#fbbf24] flex items-center justify-center text-[#0f172a] font-bold text-sm overflow-hidden relative">
                <Image src="/teams/icm/zidan.png" alt="Profile" fill className="object-cover" /> 
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">Fathin Ahmad Z.</p>
                <p className="text-xs text-slate-500 truncate">Web Master</p>
            </div>
        </div>
        
        <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 py-2.5 rounded-lg text-xs font-bold transition-all border border-slate-700 hover:border-red-500/20"
        >
            <LogOut size={14} />
            Sign Out
        </button>
      </div>

    </div>
  );
}