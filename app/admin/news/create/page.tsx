'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, User, Clock, 
  ImageIcon, Eye,
  LayoutDashboard, Users, UserPlus, Newspaper, Calendar, LogOut, Menu, X
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import { createNews } from '@/actions/news-actions'; 

export default function CreateNewsPage() {
  const router = useRouter();
  
  const [user, setUser] = useState({ name: 'Admin', role: 'Staff' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch(e) {}
    }
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    cover: null as string | null, 
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {

      setFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
      setFormData(prev => ({ ...prev, cover: imageUrl }));
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.content) {
      alert("Harap isi Judul dan Konten berita.");
      return;
    }

    setIsSubmitting(true);
    try {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("author", user.name);
        
        if (file) {
            data.append("image", file);
        }

        const result = await createNews(data);

        if (result.success) {
            router.push('/admin');
            router.refresh();
        } else {
            alert("Gagal menerbitkan berita.");
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
          <Link href="/admin/pengurus/add" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <UserPlus size={18} /> Add New
          </Link>
          <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Content Management</div>
          
          <Link href="/admin/events/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <Calendar size={18} /> New Event
          </Link>
          
          <Link href="/admin/news/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#E7B95A] text-[#0C101C] shadow-lg shadow-yellow-500/10">
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
        
        <div className="sticky top-0 z-30 bg-[#0C101C]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-5 flex justify-between items-center shadow-md gap-4">
           <div className="flex items-center gap-4">
              <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="md:hidden p-2 bg-[#151b2b] rounded-lg text-[#E7B95A] border border-white/10 hover:bg-white/5"
              >
                  <Menu size={24} />
              </button>
              <div>
                 <h1 className="font-bold text-xl md:text-2xl text-white">News Publisher</h1>
                 <p className="text-xs text-gray-400 mt-1 hidden md:block">Share achievements & updates</p>
              </div>
           </div>
           
           <div className="flex gap-3">
              <button 
                onClick={handlePublish}
                disabled={isSubmitting}
                className={`
                  px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold text-[#0C101C] flex items-center gap-2
                  bg-[#E7B95A] hover:bg-[#F4D03F] transition-colors shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                `}
              >
                 {isSubmitting ? "Publishing..." : <><CheckCircle size={16} /> <span className="hidden md:inline">Publish Now</span><span className="md:hidden">Publish</span></>}
              </button>
           </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8">
                 <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 rounded bg-[#E7B95A]" /> Media & Cover
                 </h2>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Upload Image</label>
                    <div className="relative aspect-video bg-[#0C101C] border-2 border-dashed border-white/10 rounded-xl hover:border-white/30 transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                      {formData.cover ? (
                          <Image src={formData.cover} alt="Cover" fill className="object-cover" />
                      ) : (
                          <div className="text-center p-4">
                              <ImageIcon size={48} className="text-gray-700 mb-4 mx-auto group-hover:text-white transition-colors" />
                              <p className="text-sm text-gray-400 font-bold mb-1">Click to upload documentation</p>
                              <span className="text-xs text-gray-600">Recomended: Landscape 16:9</span>
                          </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                 </div>
              </div>

              <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8">
                 <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 rounded bg-[#E7B95A]" /> Article Content
                 </h2>
                 <div className="space-y-6">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Headline Title <span className="text-red-500">*</span></label>
                       <input 
                         type="text" name="title" value={formData.title} onChange={handleChange}
                         placeholder="Ex: Team IEEE UNRI Wins 1st Place at Gemastik 2026"
                         className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-4 text-white focus:border-[#E7B95A] outline-none text-xl font-bold placeholder:text-gray-700"
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Main Story <span className="text-red-500">*</span></label>
                       <textarea 
                         name="content" value={formData.content} onChange={handleChange} rows={12}
                         placeholder="Write the full story, achievement details, or announcement here..."
                         className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-4 text-white focus:border-[#E7B95A] outline-none text-base leading-relaxed placeholder:text-gray-700" 
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 flex items-center justify-between opacity-80">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#E7B95A]">
                       <User size={20} />
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Posting As</p>
                       <p className="font-bold text-white">{user.name}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-right">
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Publish Date</p>
                       <p className="font-bold text-white font-mono">{new Date().toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#E7B95A]">
                       <Clock size={20} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-5 lg:sticky lg:top-28">
               <div className="flex items-center gap-2 mb-4">
                  <Eye size={18} className="text-[#E7B95A]" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
               </div>

               <div className="bg-[#151b2b] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl group relative">
                  
                  <div className="relative aspect-video bg-[#0C101C]">
                     {formData.cover ? (
                        <Image src={formData.cover} alt="Preview" fill className="object-cover" />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-[#0C101C]">
                           <ImageIcon size={32} className="mb-2 opacity-50"/>
                           <span className="text-xs uppercase tracking-widest">No Cover Image</span>
                        </div>
                     )}
                     <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur text-white border border-white/10">
                        NEWS UPDATE
                     </div>
                  </div>

                  <div className="p-8">
                     <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock size={12}/> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"/>
                        <span className="flex items-center gap-1 text-[#E7B95A] font-bold"><User size={12}/> {user.name}</span>
                     </div>
                     
                     <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                        {formData.title || "Your News Headline Will Appear Here..."}
                     </h3>
                     
                     <div className="text-gray-400 text-sm line-clamp-4 leading-relaxed mb-6">
                        {formData.content || "The content description will be shown here. Make sure to write a compelling first paragraph to attract readers."}
                     </div>

                     <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500">Read Full Story</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white">
                           <ArrowLeft size={14} className="rotate-180"/>
                        </div>
                     </div>
                  </div>

                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E7B95A]/5 rounded-full blur-[80px] pointer-events-none" />
               </div>
           </div>

        </div>
      </main>
    </div>
  );
}