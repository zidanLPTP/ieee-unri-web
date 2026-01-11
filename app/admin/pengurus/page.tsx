'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  // Icons Sidebar
  LayoutDashboard, Users, UserPlus, Newspaper, Calendar, LogOut, Image as ImageIcon,
  // Icons UI
  Search, ChevronLeft, ChevronRight, ShieldAlert, Trash2, ShieldCheck, RefreshCw
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import { getOfficers, deleteOfficer } from '@/actions/officer-actions'; // Import Action baru

export default function AllPersonnelPage() {
  const router = useRouter();
  
  // --- STATE USER & AUTH ---
  const [user, setUser] = useState({ name: 'Admin', role: 'Staff' });
  const [accessDenied, setAccessDenied] = useState(false);
  
  // --- STATE DATA ---
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE PAGINATION & SEARCH ---
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- 1. LOAD USER & CEK AKSES ---
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // RESTRICT ACCESS: Staff/Anggota DILARANG MASUK
        const allowed = ['ADMIN', 'CORE', 'HEAD'];
        if (!allowed.includes(parsedUser.role)) {
            setAccessDenied(true);
            setLoading(false); // Stop loading biar UI denied muncul
        } else {
            // Jika boleh akses, load data
            fetchData(1, ""); 
        }
    } else {
        router.push('/login');
    }
  }, [router]);

  // --- 2. FUNGSI LOAD DATA (Server Action) ---
  const fetchData = async (pageNum: number, searchQuery: string) => {
    setLoading(true);
    const res = await getOfficers(pageNum, searchQuery);
    
    if (res.success && res.data && res.metadata) {
        setOfficers(res.data);
        setTotalPages(res.metadata.totalPages);
        setPage(res.metadata.currentPage);
    }
    setLoading(false);
  };

  // Handler Search (Debounce manual sederhana)
  useEffect(() => {
    if (!accessDenied) {
        const delayDebounce = setTimeout(() => {
            setPage(1); // Reset ke hal 1 tiap cari
            fetchData(1, search);
        }, 500); // Tunggu 500ms setelah ketik

        return () => clearTimeout(delayDebounce);
    }
  }, [search]);

  // Handler Pagination
  const handleNext = () => { if (page < totalPages) fetchData(page + 1, search); };
  const handlePrev = () => { if (page > 1) fetchData(page - 1, search); };

  // Handler Delete
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Yakin ingin menghapus ${name}?`)) {
        await deleteOfficer(id);
        fetchData(page, search); // Refresh data
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C]">
      
      {/* --- SIDEBAR BUILT-IN --- */}
      <aside className="w-64 bg-[#151b2b] border-r border-white/5 flex-col hidden md:flex sticky top-0 h-screen overflow-y-auto shrink-0 z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E7B95A] to-[#F4D03F] flex items-center justify-center text-[#0C101C] font-bold">I</div>
          <div>
            <h1 className="font-bold text-lg leading-none">IEEE Admin</h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Control Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <LayoutDashboard size={18} /> Overview
          </Link>
          <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Personnel Management</div>
          
          {/* ACTIVE STATE: YELLOW */}
          <Link href="/admin/pengurus" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#E7B95A] text-[#0C101C] shadow-lg shadow-yellow-500/10">
             <Users size={18} /> All Personnel
          </Link>
          
          <Link href="/admin/pengurus/add" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <UserPlus size={18} /> Add New
          </Link>

          <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Content Management</div>
          
          <Link href="/admin/events/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <Calendar size={18} /> New Event
          </Link>
          <Link href="/admin/news/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <Newspaper size={18} /> New News
          </Link>
          <Link href="/admin/gallery/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <ImageIcon size={18} /> New Gallery
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-4">
             <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden relative border border-white/10">
                <div className="w-full h-full flex items-center justify-center bg-[#E7B95A] text-[#0C101C] font-bold">{user.name.charAt(0)}</div>
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold truncate w-32">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.role}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all text-sm font-bold">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative">
      
        {accessDenied ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <ShieldAlert size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Access Restricted</h2>
                <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                   Sorry, you don't have permission to view this page.<br/>
                   <span className="text-white font-semibold">Only Head of Division and Core members can access this page.</span>
                </p>
                <div className="flex gap-4">
                    <button onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-sm transition-all">
                        Go Back
                    </button>
                </div>
            </div>
        ) : (
            
        <>
           <div className="sticky top-0 z-30 bg-[#0C101C]/80 backdrop-blur-md border-b border-white/5 px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
              <div>
                 <h1 className="font-bold text-lg text-white">Personnel Data</h1>
                 <p className="text-[10px] text-gray-500 uppercase tracking-wide">Manage organization members</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="relative w-full md:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Search by name..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-[#151b2b] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#E7B95A] outline-none"
                    />
                 </div>
                 <Link href="/admin/pengurus/add" className="bg-[#E7B95A] hover:bg-[#F4D03F] text-[#0C101C] px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg">
                    <UserPlus size={16} /> Add New
                 </Link>
              </div>
           </div>

           {/* CONTENT AREA */}
           <div className="p-6 md:p-8">
              
              {/* TABEL DATA */}
              <div className="bg-[#151b2b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                 {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                       <RefreshCw size={32} className="animate-spin mb-4 text-[#E7B95A]"/>
                       <p className="text-xs">Loading data...</p>
                    </div>
                 ) : (
                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-[#0C101C]/50 border-b border-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                                <th className="p-5 font-bold">Member Profile</th>
                                <th className="p-5 font-bold">Position</th>
                                <th className="p-5 font-bold">Access Level</th>
                                <th className="p-5 font-bold text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-sm">
                             {officers.length === 0 ? (
                                <tr>
                                   <td colSpan={4} className="p-10 text-center text-gray-500">
                                      {search ? `Tidak ada anggota dengan nama "${search}"` : "Belum ada data."}
                                   </td>
                                </tr>
                             ) : (
                                officers.map((officer) => (
                                   <tr key={officer.id} className="hover:bg-white/5 transition-colors group">
                                      <td className="p-5">
                                         <div className="flex items-center gap-4">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-800 border border-white/10 shrink-0">
                                               <Image src={officer.image || "/placeholder.jpg"} alt={officer.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                               <div className="font-bold text-white text-sm">{officer.name}</div>
                                               <div className="text-gray-500 text-[10px] font-mono mt-0.5">ID: <span className="text-[#E7B95A]">{officer.memberId}</span></div>
                                            </div>
                                         </div>
                                      </td>
                                      <td className="p-5">
                                         <div className="text-gray-200 font-medium">{officer.position}</div>
                                         <div className="text-gray-500 text-[10px]">{officer.division}</div>
                                      </td>
                                      <td className="p-5">
                                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                            officer.accessRole === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            officer.accessRole === 'CORE' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            officer.accessRole === 'HEAD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                         }`}>
                                            {officer.accessRole === 'ADMIN' && <ShieldAlert size={10} />}
                                            {officer.accessRole === 'CORE' && <ShieldCheck size={10} />}
                                            {officer.accessRole}
                                         </span>
                                      </td>
                                      <td className="p-5 text-right">
                                         <button 
                                            onClick={() => handleDelete(officer.id, officer.name)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete Member"
                                         >
                                            <Trash2 size={16} />
                                         </button>
                                      </td>
                                   </tr>
                                ))
                             )}
                          </tbody>
                       </table>
                    </div>
                 )}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                 <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                    <p className="text-xs text-gray-500">
                       Showing page <span className="text-white font-bold">{page}</span> of {totalPages}
                    </p>
                    <div className="flex gap-2">
                       <button 
                         onClick={handlePrev} 
                         disabled={page === 1}
                         className={`p-2 rounded-lg border border-white/10 transition-colors ${page === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-white/5'}`}
                       >
                          <ChevronLeft size={18} />
                       </button>
                       <button 
                         onClick={handleNext} 
                         disabled={page >= totalPages}
                         className={`p-2 rounded-lg border border-white/10 transition-colors ${page >= totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-white/5'}`}
                       >
                          <ChevronRight size={18} />
                       </button>
                    </div>
                 </div>
              )}

           </div>
        </>
        )}

      </main>
    </div>
  );
}