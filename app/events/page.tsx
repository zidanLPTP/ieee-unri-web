'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Calendar, Users, History, Hourglass, ChevronLeft, ChevronRight, Video, MapPin, Search, Clock, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllEvents } from '@/actions/landing-actions'; // Import Action

const divisionColors: Record<string, string> = {
  "education": "#00E5FF",       
  "pr": "#D500F9",              
  "icm": "#FF4081",        
  "business": "#00E676",        
  "membership": "#FFAB00",      
  "secretariat": "#2979FF",
  "general": "#E7B95A"     
};

// Helper untuk mapping nama Database -> Key Warna Frontend
const getDivisionKey = (dbCategory: string) => {
    const lower = dbCategory.toLowerCase();
    if (lower.includes("education")) return "education";
    if (lower.includes("public") || lower.includes("pr")) return "pr";
    if (lower.includes("creative") || lower.includes("media") || lower.includes("icm")) return "icm";
    if (lower.includes("business")) return "business";
    if (lower.includes("membership") || lower.includes("relation")) return "membership";
    if (lower.includes("secretariat")) return "secretariat";
    return "general";
};

export default function EventsPage() {
  const [viewDate, setViewDate] = useState(new Date()); // Default ke bulan sekarang
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [rawEvents, setRawEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA DARI DATABASE
  useEffect(() => {
    async function fetchData() {
        try {
            const data = await getAllEvents();
            
            // Format Data
            const formattedEvents = data.map((e: any) => ({
                id: e.id,
                title: e.title,
                date: e.date, // ISO String dari Prisma
                timeStart: e.timeStart,
                // Logic mode online/onsite
                mode: (e.locationName.toLowerCase().includes('zoom') || e.locationName.toLowerCase().includes('meet')) ? 'online' : 'onsite',
                locationName: e.locationName,
                desc: e.description,
                // Mapping Divisi
                divisionId: getDivisionKey(e.category),
                realCategory: e.category, // Simpan nama asli
                poster: e.poster || null,
                regLink: e.regLink,
                regText: "Register Now" 
            }));

            setRawEvents(formattedEvents);
        } catch (error) {
            console.error("Error loading events", error);
        } finally {
            setIsLoading(false);
        }
    }

    fetchData();
  }, []);

  const now = new Date();
  
  // Set jam ke 00:00:00 agar perbandingan tanggal akurat (hari ini masih dianggap upcoming)
  now.setHours(0,0,0,0);

  // Filter Upcoming (Hari ini dan masa depan)
  const upcomingEvents = rawEvents
    .filter(ev => new Date(ev.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter Past (Kemarin dan sebelumnya)
  const pastEvents = rawEvents
    .filter(ev => new Date(ev.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort Descending (Terbaru di atas)

  const hasPastEvents = pastEvents.length > 0;

  const stats = [
    { label: "Upcoming Events", value: upcomingEvents.length.toString(), icon: Calendar },
    { label: "Total Activities", value: rawEvents.length.toString(), icon: Users },
  ];

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const emptyDays = Array(firstDay).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getEventOnDate = (d: number) => {
    // Cari event di tanggal tersebut (Upcoming maupun Past bisa ditampilkan di kalender)
    // Tapi biasanya kalender fokus ke Upcoming atau All. Di sini kita tampilkan All Events di kalender agar user bisa lihat history juga.
    return rawEvents.find(e => {
      const eDate = new Date(e.date);
      return eDate.getDate() === d && 
             eDate.getMonth() === monthIndex && 
             eDate.getFullYear() === year;
    });
  };

  return (
    <main className="min-h-screen bg-[#0C101C] text-white">
      <Navbar />

      <section className="relative px-6 pt-32 mb-20">
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3386B7]/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
            
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
              >
                <br />
                Events
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#3386B7]">
                    & Activities
                </span>
              </motion.h1>

              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                Explore our schedule of upcoming seminars, workshops, and technical programs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full lg:w-auto min-w-[300px]">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="bg-[#151b2b] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-[#3386B7]/30 transition-colors w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-[#3386B7]/10 text-[#3386B7] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon size={20} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : stat.value}
                  </h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative">
         <div className="container mx-auto">
            <div className="bg-[#151b2b]/50 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3386B7] to-[#E7B95A]" />

               <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-5">
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">{monthName} <span className="text-gray-500">{year}</span></h2>
                        <div className="flex gap-2">
                           <button onClick={() => setViewDate(new Date(year, monthIndex - 1, 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={20}/></button>
                           <button onClick={() => setViewDate(new Date(year, monthIndex + 1, 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight size={20}/></button>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-7 gap-4 text-center mb-4">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                          <div key={i} className="text-xs font-bold text-gray-500">{d}</div>
                        ))}
                     </div>

                     <div className="grid grid-cols-7 gap-4 text-center">
                        {emptyDays.map((_, i) => <div key={`e-${i}`} />)}
                        {daysArray.map(day => {
                           const event = getEventOnDate(day);
                           const color = event ? (divisionColors[event.divisionId] || "#E7B95A") : 'transparent';
                           return (
                              <button
                                 key={day}
                                 onClick={() => event && setSelectedEvent(event)}
                                 disabled={!event}
                                 className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all relative ${event ? 'text-[#0C101C] font-bold shadow-lg hover:scale-110' : 'text-gray-600 cursor-default hover:bg-white/5'}`}
                                 style={{ backgroundColor: event ? color : 'transparent' }}
                              >
                                 {day}
                              </button>
                           )
                        })}
                     </div>
                  </div>

                  <div className="lg:col-span-7 border-l border-white/5 pl-0 lg:pl-12 pt-8 lg:pt-0">
                     <AnimatePresence mode='wait'>
                        {selectedEvent ? (
                           <motion.div key="content" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity:0, x: -20}} className="h-full flex flex-col justify-center">
                         
                              <div className="bg-[#0C101C]/50 rounded-3xl p-6 border border-white/10">
                                 <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-black/50">
                                    {selectedEvent.poster ? (
                                       <Image src={selectedEvent.poster} alt={selectedEvent.title} fill className="object-cover" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center text-gray-600 flex-col gap-2">
                                          <Calendar size={32} />
                                          <span className="text-xs uppercase">No Poster</span>
                                       </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase border border-white/10">
                                       {selectedEvent.realCategory || selectedEvent.divisionId}
                                    </div>
                                 </div>
                                 
                                 <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                                 <div className="flex gap-4 text-sm text-gray-400 mb-4">
                                    <span className="flex items-center gap-2"><Clock size={14}/> {selectedEvent.timeStart} WIB</span>
                                    <span className="flex items-center gap-2">
                                       {selectedEvent.mode === 'online' ? <Video size={14}/> : <MapPin size={14}/>}
                                       {selectedEvent.locationName}
                                    </span>
                                 </div>
                                 <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {selectedEvent.desc}
                                 </p>
                                 {selectedEvent.regLink && (
                                     <a href={selectedEvent.regLink} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E7B95A] text-[#0C101C] font-bold hover:brightness-110 transition-all">
                                       {selectedEvent.regText || "Register Now"} <ArrowRight size={18}/>
                                     </a>
                                 )}
                              </div>
                           </motion.div>
                        ) : (
                           <motion.div key="empty" initial={{opacity: 0}} animate={{opacity: 1}} className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-3xl bg-[#0C101C]/50">
                              <div className="w-20 h-20 rounded-full bg-[#151b2b] flex items-center justify-center mb-6 shadow-inner">
                                <Search size={32} className="text-gray-600" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">Select a Date</h3>
                              <p className="text-gray-500 text-sm max-w-sm">Click on any highlighted date in the calendar to view event details.</p>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <section className="py-20 px-6 relative bg-[#05080f] border-t border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
               <h2 className="text-3xl md:text-4xl font-bold mb-3">Past <span className="text-[#E7B95A]">Highlights</span></h2>
               <p className="text-gray-400">A look back at our impactful journey.</p>
            </div>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center py-10">
                <Loader2 size={32} className="animate-spin text-[#E7B95A]" />
             </div>
          ) : hasPastEvents ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {pastEvents.map((event, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-[#151b2b] border border-white/5 rounded-2xl p-6 hover:border-[#E7B95A]/30 transition-all group"
                  >
                     <p className="text-xs text-[#E7B95A] mb-2 font-mono">
                        {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </p>
                     <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#E7B95A] transition-colors line-clamp-2">{event.title}</h4>
                     <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.desc}</p>
                     <span className="text-[10px] uppercase bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">Completed</span>
                  </motion.div>
               ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full h-[400px] rounded-3xl border border-dashed border-white/10 bg-[#151b2b]/30 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3386B7]/5 to-transparent opacity-50 pointer-events-none" />
                <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-[#151b2b] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(51,134,183,0.1)]">
                    <History size={32} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">History in the Making</h3>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed mb-6">We are just getting started! Our journey log is currently empty, but exciting events are coming soon to fill this archive.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs text-gray-500 font-mono">
                    <Hourglass size={12} className="animate-spin-slow" />
                    Waiting for first event completion...
                </div>
                </div>
            </motion.div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}