'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, Image as ImageIcon, Clock, User, Hash, Eye,
  LayoutDashboard, Users, UserPlus, Newspaper, Calendar, LogOut, UploadCloud
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import { createGallery } from '@/actions/gallery-actions';

export default function CreateGalleryPage() {
  const router = useRouter();
  
  const [user, setUser] = useState({ name: 'Admin', role: 'Staff' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {

    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch(e) {}
    }

    const now = new Date();
    setCurrentDate(now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    localStorage.removeItem('adminUser');
    router.push('/login');
  };


  const [formData, setFormData] = useState({
    caption: '',
    tag: 'Activity', 
    image: null as string | null, 
  });

  const [file, setFile] = useState<File | null>(null);

  const handleImageUpload = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {

      setFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

 
  const handlePublish = async () => {
    if (!file) {
      alert(" Wajib upload foto!");
      return;
    }
    if (!formData.caption) {
        alert(" Harap isi caption foto.");
        return;
    }

    setIsSubmitting(true);
    try {

        const data = new FormData();
        data.append("caption", formData.caption);
        data.append("tag", formData.tag);
        data.append("author", user.name);
        data.append("image", file);

        const result = await createGallery(data);

        if (result.success) {
            router.push('/admin'); 
            router.refresh();
        } else {
            alert("Gagal mengupload foto.");
        }
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan sistem.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C]">
      
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
          <Link href="/admin/news/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all">
             <Newspaper size={18} /> New News
          </Link>
          
          <Link href="/admin/gallery/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#E7B95A] text-[#0C101C] shadow-lg shadow-yellow-500/10">
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

      <main className="flex-1 h-screen overflow-y-auto relative pb-20">
        
        <div className="sticky top-0 z-30 bg-[#0C101C]/80 backdrop-blur-md border-b border-white/5 px-8 py-5 flex justify-between items-center shadow-md">
           <div className="flex items-center gap-4">
              <div>
                 <h1 className="font-bold text-2xl text-white">Upload Moment</h1>
                 <p className="text-xs text-gray-400 mt-1">Add photos to gallery</p>
              </div>
           </div>
           <button 
             onClick={handlePublish}
             disabled={isSubmitting}
             className={`
               px-6 py-2.5 rounded-xl text-sm font-bold text-[#0C101C] flex items-center gap-2
               bg-[#E7B95A] hover:bg-[#F4D03F] transition-colors shadow-lg
               disabled:opacity-50 disabled:cursor-not-allowed
             `}
           >
              {isSubmitting ? "Uploading..." : <><UploadCloud size={16} /> Upload Now</>}
           </button>
        </div>

        <div className="container mx-auto px-6 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
                 
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Photo File <span className="text-red-500">*</span></label>
                    <div className="relative aspect-video bg-[#0C101C] border-2 border-dashed border-white/10 rounded-xl hover:border-white/30 transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                      {formData.image ? (
                          <Image src={formData.image} alt="Upload" fill className="object-cover" />
                      ) : (
                          <div className="text-center p-4">
                              <ImageIcon size={48} className="text-gray-700 mb-4 mx-auto group-hover:text-white transition-colors" />
                              <p className="text-sm text-gray-400 font-bold mb-1">Click to upload photo</p>
                              <span className="text-[10px] text-gray-600">JPG, PNG, WEBP (Max 5MB)</span>
                          </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                    <div className="md:col-span-2">
                       <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Caption <span className="text-red-500">*</span></label>
                       <input 
                         type="text" 
                         placeholder="Ex: Documentation of Monthly Meeting..."
                         value={formData.caption}
                         onChange={(e) => setFormData(prev => ({...prev, caption: e.target.value}))}
                         className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-4 text-white focus:border-[#E7B95A] outline-none placeholder:text-gray-700"
                       />
                    </div>
                
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Category Tag</label>
                       <div className="relative">
                          <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <select 
                            value={formData.tag}
                            onChange={(e) => setFormData(prev => ({...prev, tag: e.target.value}))}
                            className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#E7B95A] outline-none appearance-none cursor-pointer"
                          >
                             <option value="Activity">Activity</option>
                             <option value="Competition">Competition</option>
                             <option value="Documentation">Documentation</option>
                             <option value="Award">Award</option>
                             <option value="Social">Social</option>
                          </select>
                       </div>
                    </div>
                 </div>

              </div>
           </div>

           <div className="lg:col-span-5 sticky top-28">
               <div className="flex items-center gap-2 mb-4">
                  <Eye size={18} className="text-[#E7B95A]" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
               </div>

               <div className="bg-[#151b2b] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl group relative">
                  
                  <div className="relative aspect-video bg-[#0C101C]">
                     {formData.image ? (
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-[#0C101C]">
                           <ImageIcon size={32} className="mb-2 opacity-50"/>
                           <span className="text-xs uppercase tracking-widest">No Image Selected</span>
                        </div>
                     )}

                     <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur text-white border border-white/10">
                        {formData.tag}
                     </div>
                  </div>

                  <div className="p-8">
                     <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                        {formData.caption || "Your caption will appear here..."}
                     </h3>
                     
                     <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-[#E7B95A] text-[#0C101C] flex items-center justify-center font-bold">
                              <User size={12}/>
                           </div>
                           <span className="font-bold text-white">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock size={14}/> 
                           <span>{currentDate}</span>
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