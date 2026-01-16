'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Upload, MapPin, Link as LinkIcon, Calendar, 
  Clock, Eye, Video, MousePointer,
  LayoutDashboard, Users, UserPlus, Newspaper, Image as ImageIcon, LogOut, Send, Menu, X
} from 'lucide-react';
import { divisions } from '@/data/aboutData'; 
import { logoutAction } from '@/actions/auth-actions';
import { createEvent } from '@/actions/event-actions';

const divisionColors: Record<string, string> = {
  secretariat: "from-blue-500 to-cyan-400",
  icm: "from-purple-500 to-pink-500",
  business: "from-emerald-500 to-green-400",
  education: "from-orange-500 to-amber-400",
  membership: "from-indigo-500 to-blue-600",
  pr: "from-rose-500 to-red-400",
};

export default function CreateEventPage() {
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
    divisionId: divisions[0].id,
    date: '',
    timeStart: '',
    timeEnd: '',
    mode: 'onsite', 
    locationName: '', 
    locationLink: '', 
    poster: null as string | null, 
    desc: '',
    regLink: '',
    regText: 'Register Now'
  });


  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);

      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, poster: imageUrl }));
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.date || !formData.timeStart || !formData.locationName || !formData.desc) {
      alert("Harap lengkapi kolom wajib (*) sebelum mempublikasikan event.");
      return; 
    }

    setIsSubmitting(true);
    try {

      const data = new FormData();
      
      data.append("title", formData.title);
      data.append("desc", formData.desc);
      data.append("date", formData.date); 
      data.append("timeStart", formData.timeStart);
      
      const divName = divisions.find(d => d.id === formData.divisionId)?.name || "General";
      data.append("category", divName); 

      data.append("locationName", formData.locationName);
      data.append("regLink", formData.regLink);
      
      if (posterFile) {
        data.append("image", posterFile);
      }

      const result = await createEvent(data);

      if (result.success) {
        router.push('/admin'); 
        router.refresh();
      } else {
        alert(result.message || "Gagal menyimpan event.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTheme = divisionColors[formData.divisionId] || "from-gray-500 to-slate-400";
  const selectedDivName = divisions.find(d => d.id === formData.divisionId)?.name || "General";

  return (
    <div className="flex min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C] relative">
      
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#151b2b] border-r border-white/5 flex flex-col h-screen overflow-y-auto transition-transform duration-300 ease-in-out
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
          
          <Link href="/admin/events/create" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#E7B95A] text-[#0C101C] shadow-lg shadow-yellow-500/10">
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
        
        <div className="sticky top-0 z-30 bg-[#0C101C]/90 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-5 flex justify-between items-center shadow-md gap-4">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="md:hidden p-2 bg-[#151b2b] rounded-lg text-[#E7B95A] border border-white/10 hover:bg-white/5"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="font-bold text-xl md:text-2xl text-white">Event Publisher</h1>
                    <p className="text-xs text-gray-400 mt-1 hidden md:block">Create and schedule a new agenda for the organization.</p>
                </div>
            </div>
            
            <button 
              onClick={handlePublish}
              disabled={isSubmitting}
              className={`
                px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold text-[#0C101C] flex items-center gap-2
                bg-gradient-to-r ${currentTheme} 
                hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg 
                disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
              `}
            >
               {isSubmitting ? "Publishing..." : (
                 <>
                   <Send size={16} /> <span className="hidden md:inline">Publish Event</span><span className="md:hidden">Publish</span>
                 </>
               )}
            </button>
        </div>

        <div className="container mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-8">
                
                <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8">
                   <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <span className={`w-1 h-6 rounded bg-gradient-to-b ${currentTheme}`} /> General Information
                   </h2>
                   <div className="space-y-6">
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Event Title <span className="text-red-500">*</span></label>
                         <input 
                           type="text" name="title" value={formData.title} onChange={handleChange} 
                           placeholder="Ex: Artificial Intelligence Workshop 2026" 
                           className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-4 text-white focus:border-[#E7B95A] outline-none text-lg font-bold placeholder:font-normal placeholder:text-gray-700" 
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Hosted By (Division)</label>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {divisions.map((div) => (
                               <button key={div.id} onClick={() => setFormData(prev => ({ ...prev, divisionId: div.id }))} className={`px-3 py-2.5 rounded-lg text-xs font-bold border transition-all text-left truncate ${formData.divisionId === div.id ? `bg-white/10 border-white/20 text-white` : 'bg-[#0C101C] border-white/5 text-gray-500 hover:bg-white/5'}`}>{div.name}</button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8">
                   <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <span className={`w-1 h-6 rounded bg-gradient-to-b ${currentTheme}`} /> Date & Venue
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Date <span className="text-red-500">*</span></label>
                          <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none cursor-pointer [color-scheme:dark]" 
                          />
                       </div>
                       <div className="flex gap-3">
                          <div className="flex-1">
                             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Start <span className="text-red-500">*</span></label>
                             <input type="time" name="timeStart" value={formData.timeStart} onChange={handleChange} className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none [color-scheme:dark]" />
                          </div>
                          <div className="flex-1">
                             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">End</label>
                             <input type="time" name="timeEnd" value={formData.timeEnd} onChange={handleChange} className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none [color-scheme:dark]" />
                          </div>
                       </div>
                   </div>
                   
                   <div className="bg-[#0C101C] rounded-xl p-1.5 flex mb-6 border border-white/10 w-fit">
                       <button onClick={() => setFormData(prev => ({ ...prev, mode: 'onsite' }))} className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${formData.mode === 'onsite' ? 'bg-[#151b2b] text-white shadow ring-1 ring-white/10' : 'text-gray-500 hover:text-white'}`}><MapPin size={14} /> Onsite (Offline)</button>
                       <button onClick={() => setFormData(prev => ({ ...prev, mode: 'online' }))} className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${formData.mode === 'online' ? 'bg-[#151b2b] text-white shadow ring-1 ring-white/10' : 'text-gray-500 hover:text-white'}`}><Video size={14} /> Online (Virtual)</button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                             {formData.mode === 'onsite' ? 'Building / Room Name' : 'Platform Name'} <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="locationName" 
                            value={formData.locationName} 
                            onChange={handleChange} 
                            placeholder={formData.mode === 'onsite' ? "Ex: Gedung C, Lab RPL, UNRI" : "Ex: Zoom Meeting / Google Meet"}
                            className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none placeholder:text-gray-700" 
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                             {formData.mode === 'onsite' ? 'Google Maps Link' : 'Meeting URL'}
                          </label>
                          <input 
                            type="text" 
                            name="locationLink" 
                            value={formData.locationLink} 
                            onChange={handleChange} 
                            placeholder="Opsional: Link Maps / Link Zoom"
                            className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none text-sm font-mono placeholder:text-gray-700" 
                          />
                       </div>
                   </div>
                </div>

                <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 md:p-8">
                   <h2 className="font-bold text-lg mb-6 flex items-center gap-2"><span className={`w-1 h-6 rounded bg-gradient-to-b ${currentTheme}`} /> Registration & Media</h2>
                   <div className="flex flex-col md:flex-row gap-8">
         
                      <div className="w-full md:w-1/3">
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Event Poster</label>
                         <div className="relative aspect-[3/4] bg-[#0C101C] border-2 border-dashed border-white/10 rounded-xl hover:border-white/30 transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                            {formData.poster ? <Image src={formData.poster} alt="Preview" fill className="object-cover" /> : <><Upload size={24} className="text-gray-500 mb-2 group-hover:text-white" /><span className="text-[10px] text-gray-500">Upload Poster (9:16)</span></>}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                      </div>

                      <div className="flex-1 space-y-6">
                          <div>
                             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Registration Link</label>
                             <div className="relative">
                                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" name="regLink" value={formData.regLink} onChange={handleChange} placeholder="https://bit.ly/..." className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#E7B95A] outline-none font-mono text-sm placeholder:text-gray-700" />
                             </div>
                          </div>
                          <div>
                             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Button CTA Text</label>
                             <div className="relative">
                                <MousePointer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" name="regText" value={formData.regText} onChange={handleChange} placeholder="Ex: Register Now" className="w-full bg-[#0C101C] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#E7B95A] outline-none font-bold placeholder:text-gray-700" />
                             </div>
                          </div>
                          <div>
                             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Description <span className="text-red-500">*</span></label>
                             <textarea name="desc" value={formData.desc} onChange={handleChange} rows={5} placeholder="Jelaskan detail acara..." className="w-full bg-[#0C101C] border border-white/10 rounded-xl p-3 text-white focus:border-[#E7B95A] outline-none text-sm leading-relaxed placeholder:text-gray-700" />
                          </div>
                      </div>
                   </div>
                </div>
            </div>

            <div className="lg:col-span-5 sticky top-28 hidden lg:block">
                <div className="flex items-center gap-2 mb-4">
                    <Eye size={18} className="text-[#E7B95A]" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview Card</span>
                </div>
                <div className="bg-[#151b2b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl group relative transition-all">
                    <div className="relative aspect-video bg-[#0C101C] overflow-hidden">
                    {formData.poster ? (
                        <Image src={formData.poster} alt="Poster" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 gap-2">
                            <ImageIcon size={24} className="text-gray-700" />
                            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">No Poster</span>
                        </div>
                    )}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#0C101C] bg-gradient-to-r ${currentTheme} shadow-lg`}>
                        {selectedDivName}
                    </div>
                    </div>

                    <div className="p-6 md:p-8 relative">
                        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20 bg-gradient-to-br ${currentTheme} pointer-events-none`} />
                        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{formData.title || "Your Event Title"}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0"><Calendar size={18} /></div>
                                <div className="overflow-hidden"><p className="text-[10px] text-gray-500 uppercase font-bold">Date</p><p className="text-sm font-bold truncate">{formData.date || "-"}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0"><Clock size={18} /></div>
                                <div className="overflow-hidden"><p className="text-[10px] text-gray-500 uppercase font-bold">Time</p><p className="text-sm font-bold truncate">{formData.timeStart ? `${formData.timeStart} - ${formData.timeEnd || 'End'}` : "-"}</p></div>
                            </div>
                            <div className="col-span-2 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 shrink-0 ${formData.mode === 'onsite' ? 'bg-white/5' : 'bg-purple-500/10 text-purple-400'}`}>
                                    {formData.mode === 'onsite' ? <MapPin size={18} /> : <Video size={18} />}
                                </div>
                                <div className="overflow-hidden"><p className="text-[10px] text-gray-500 uppercase font-bold">{formData.mode === 'onsite' ? "Location" : "Platform"}</p><p className="text-sm font-bold truncate">{formData.locationName || "-"}</p></div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{formData.desc || "Description preview..."}</p>
                        <button className={`block w-full py-4 rounded-xl text-center font-bold text-[#0C101C] bg-gradient-to-r ${currentTheme} shadow-lg opacity-90`}>{formData.regText || "Register Now"}</button>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}