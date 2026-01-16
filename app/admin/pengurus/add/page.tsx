'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Upload, Save, User, Hash, ShieldCheck, Briefcase, 
  LayoutDashboard, Users, UserPlus, Newspaper, Calendar, LogOut, Image as ImageIcon,
  ShieldAlert, Lock, Menu, X
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import { createOfficer } from '@/actions/officer-actions';

const OPERATIONAL_DIVISIONS = [
  "Secretariat",
  "Information & Creative Media",
  "Business Affairs",
  "Education",
  "Membership & Internal Relations",
  "Public Relations & Partnership",
];

const POSITIONS = [
  { label: "Staff", value: "Staff" },
  { label: "Head of Division", value: "Head of Division" },
  { label: "Web Master", value: "Web Master" },
  { label: "Director", value: "Director" },
  { label: "Vice Director I", value: "Vice Director I" },
  { label: "Vice Director II", value: "Vice Director II" },
  { label: "Vice Director III", value: "Vice Director III" },
  { label: "Advisor", value: "Advisor" },
  { label: "Counselor", value: "Counselor" },
];

export default function AddOfficerPage() {
  const router = useRouter();
  
  const [user, setUser] = useState({ name: 'Admin', role: 'Staff' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [accessDenied, setAccessDenied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const allowed = ['ADMIN', 'CORE', 'HEAD'];
        if (!allowed.includes(parsedUser.role)) {
            setAccessDenied(true);
        }
    } else {
        router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    await logoutAction();
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  const [formData, setFormData] = useState({
    name: '',
    memberId: '',
    position: 'Staff',
    division: OPERATIONAL_DIVISIONS[0],
    image: null as string | null, 
    accessRole: 'STAFF'
  });

  const [file, setFile] = useState<File | null>(null);

  const [showDivisionDropdown, setShowDivisionDropdown] = useState(true);

  useEffect(() => {
    let role = "STAFF";
    let div = formData.division;
    let showDiv = true;

    if (formData.position === "Web Master") {
        role = "ADMIN";
        div = "Information & Creative Media";
        showDiv = false;
    }
    else if (["Advisor", "Counselor"].includes(formData.position)) {
        role = "CORE";
        div = "Advisory Board";
        showDiv = false;
    }
    else if (["Director", "Vice Director I", "Vice Director II", "Vice Director III"].includes(formData.position)) {
        role = "CORE";
        div = "Executive Board";
        showDiv = false;
    }
    else if (formData.position === "Head of Division") {
        role = "HEAD";
        showDiv = true;
    }

    setFormData(prev => ({ ...prev, accessRole: role, division: div }));
    setShowDivisionDropdown(showDiv);

  }, [formData.position, formData.division]);

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.memberId) {
      alert("Harap lengkapi Nama dan Member ID.");
      return;
    }
    
    setIsSubmitting(true);
    try {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("memberId", formData.memberId);
        data.append("position", formData.position);
        data.append("division", formData.division);
        data.append("accessRole", formData.accessRole);
        
        if (file) {
            data.append("image", file);
        }

        const result = await createOfficer(data);
        
        if (result.success) {
            alert("Berhasil menambahkan pengurus!");
            router.push('/admin/pengurus');
            router.refresh();
        } else {
            alert(`Gagal: ${result.error}`);
        }
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan sistem.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C] relative">
      
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#151b2b] border-r border-white/5 flex flex-col h-screen overflow-y-auto transition-transform duration-300 ease-in-out shrink-0
          md:translate-x-0 md:static md:sticky md:top-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E7B95A] to-[#F4D03F] flex items-center justify-center text-[#0C101C] font-bold">I</div>
            <div>
              <h1 className="font-bold text-lg leading-none">IEEE Admin</h1>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Control Panel</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <LayoutDashboard size={18} /> Overview
          </Link>
          <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Personnel Management</div>
          <Link href="/admin/pengurus" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <Users size={18} /> All Personnel
          </Link>
          
          <Link href="/admin/pengurus/add" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#E7B95A] text-[#0C101C] shadow-lg shadow-yellow-500/10">
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

      <main className="flex-1 h-screen overflow-y-auto relative pb-20 w-full">
        
        {accessDenied ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300 relative">
                <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="md:hidden absolute top-4 left-4 p-2 bg-[#151b2b] rounded-lg text-[#E7B95A] border border-white/10"
                >
                  <Menu size={24} />
                </button>
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
            <div className="sticky top-0 z-30 bg-[#0C101C]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-5 flex justify-between items-center shadow-md gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="md:hidden p-2 bg-[#151b2b] rounded-lg text-[#E7B95A] border border-white/10 hover:bg-white/5"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="p-2 rounded-full bg-white/5 text-[#E7B95A] hidden md:block">
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-white">Add New Personnel</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide hidden md:block">Register Member & Assign Roles</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className={`
                        px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold text-[#0C101C] flex items-center gap-2
                        bg-[#E7B95A] hover:bg-[#F4D03F] transition-colors shadow-lg
                        disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                        `}
                    >
                        {isSubmitting ? "Saving..." : <><Save size={16} /> <span className="hidden md:inline">Save Data</span><span className="md:hidden">Save</span></>}
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8 text-center">
                    <div className="mb-6 relative mx-auto w-40 h-40">
                        <div className="relative w-full h-full bg-[#0C101C] border-2 border-dashed border-white/10 rounded-full hover:border-[#E7B95A] transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                        {formData.image ? (
                            <Image src={formData.image} alt="Profile" fill className="object-cover" />
                        ) : (
                            <>
                                <Upload size={32} className="text-gray-600 mb-2 group-hover:text-[#E7B95A]" />
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Upload Photo</span>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-4 text-left">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">IEEE Member ID <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                type="text" 
                                name="memberId" 
                                value={formData.memberId} 
                                onChange={handleChange}
                                placeholder="10200..." 
                                className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#E7B95A] outline-none font-mono text-center tracking-wider font-bold" 
                                />
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl border border-white/5 mt-4 ${
                            formData.accessRole === 'ADMIN' ? 'bg-red-500/10 text-red-400' :
                            formData.accessRole === 'CORE' ? 'bg-purple-500/10 text-purple-400' :
                            formData.accessRole === 'HEAD' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-emerald-500/10 text-emerald-400'
                        }`}>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-bold uppercase">System Access Level</span>
                            </div>
                            <p className="text-lg font-bold tracking-tight">{formData.accessRole}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
                <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8">
                    <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 rounded bg-[#E7B95A]" /> Personal & Structure
                    </h2>
                    
                    <div className="space-y-6">
            
                        <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                placeholder="Ex: Muhammad Fathin"
                                className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#E7B95A] outline-none text-lg font-bold placeholder:text-gray-700"
                            />
                        </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                            <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Position</label>
                            <div className="relative">
                                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <select 
                                    name="position" 
                                    value={formData.position} 
                                    onChange={handleChange}
                                    className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#E7B95A] outline-none appearance-none cursor-pointer"
                                >
                                    {POSITIONS.map((pos) => (
                                        <option key={pos.value} value={pos.value}>{pos.label}</option>
                                    ))}
                                </select>
                            </div>
                            </div>

                            <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Department</label>
                            {showDivisionDropdown ? (
                                <select 
                                    name="division"
                                    value={formData.division} 
                                    onChange={handleChange}
                                    className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#E7B95A] outline-none appearance-none cursor-pointer"
                                >
                                    {OPERATIONAL_DIVISIONS.map((div) => (
                                        <option key={div} value={div}>{div}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-gray-400 italic cursor-not-allowed select-none flex items-center gap-2">
                                    {formData.division}
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            </div>
        </>
        )}

      </main>
    </div>
  );
}