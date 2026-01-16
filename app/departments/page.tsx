'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { divisions as staticDivisions } from '@/data/aboutData'; 
import { 
  Folder, FolderOpen, User, Users, FileText, 
  ChevronDown, Terminal, MoreVertical,
  Loader2, CornerDownRight, Barcode, ShieldCheck
} from 'lucide-react';
import { getAllOfficers } from '@/actions/landing-actions'; 

export default function DepartmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0C101C]" />}>
      <DepartmentsContent />
    </Suspense>
  );
}

function DepartmentsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(staticDivisions[0].id);
  const [officers, setOfficers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); 

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllOfficers();
        setOfficers(data);
      } catch (error) {
        console.error("Failed to load officers", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (tabParam) {
      const found = staticDivisions.find(d => d.id === tabParam);
      if (found) setActiveTab(found.id);
    }
  }, [tabParam]);

  const activeStaticDiv = staticDivisions.find((d) => d.id === activeTab) || staticDivisions[0];

  const coordinatorData = officers.find(o => 
    o.division === activeStaticDiv.name && o.position === "Head of Division"
  );

  const membersData = officers.filter(o => 
    o.division === activeStaticDiv.name && (o.position === "Staff" || o.position === "Web Master")
  );

  return (
    <main className="min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C] relative overflow-hidden font-sans">
      <Navbar />

      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0 pointer-events-none" />
      <div className="absolute top-[20%] right-[-15%] w-[600px] h-[600px] bg-[#3386B7] rounded-full blur-[200px] opacity-10 z-0 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] bg-[#214664] rounded-full blur-[200px] opacity-20 z-0 animate-pulse duration-[10000ms]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/5 z-0 hidden md:block">
         <motion.div
           animate={{ top: ["-20%", "120%"] }}
           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-transparent via-[#3386B7]/30 to-transparent blur-[1px]"
         />
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-28 pb-20 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
           <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                 Organizational <span className="text-[#7AABC3]">Directory</span>
              </h1>
           </div>
           
           <div className="md:hidden relative z-50">
              <button 
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="w-full flex items-center justify-between bg-[#151b2b] border border-white/10 px-4 py-3 rounded-lg text-sm font-bold text-white shadow-lg active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-2 truncate">
                   <FolderOpen size={16} className="text-[#E7B95A]" />
                   <span className="truncate">{activeStaticDiv.name}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isMobileNavOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                 {isMobileNavOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#0C101C] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto"
                    >
                       {staticDivisions.map(div => (
                          <button
                            key={div.id}
                            onClick={() => {
                               setActiveTab(div.id);
                               setIsMobileNavOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-xs font-mono border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex items-center gap-3
                               ${activeTab === div.id ? 'text-[#E7B95A] bg-white/5' : 'text-gray-400'}
                            `}
                          >
                             {activeTab === div.id ? <CornerDownRight size={14}/> : <div className="w-[14px]"/>}
                             {div.name}
                          </button>
                       ))}
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] gap-8 items-start min-h-[600px]">

          <aside className="hidden md:flex flex-col gap-1 sticky top-28">
             <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <span>System Folders</span>
             </div>

             {staticDivisions.map((div) => {
                const isActive = activeTab === div.id;
                return (
                  <button
                    key={div.id}
                    onClick={() => setActiveTab(div.id)}
                    className={`
                       group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 w-full text-left font-medium
                       ${isActive 
                         ? 'bg-[#3386B7]/10 text-[#E7B95A] shadow-[inset_2px_0_0_0_#E7B95A]' 
                         : 'text-gray-400 hover:bg-white/5 hover:text-white'
                       }
                    `}
                  >
                     {isActive 
                        ? <FolderOpen size={16} className="text-[#E7B95A]" />
                        : <Folder size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                     }
                     <span className="truncate">{div.name}</span>
                  </button>
                );
             })}
          </aside>

          <div className="relative group perspective-1000">
             
             <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-500" />

             <AnimatePresence mode="wait">
                <motion.div
                  key={activeStaticDiv.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative bg-[#151b2b] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl overflow-hidden min-h-[600px]"
                >

                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
                       <Barcode size={120} />
                    </div>

                    {isLoading ? (
                       <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                          <Loader2 size={32} className="text-[#E7B95A] animate-spin mb-4" />
                          <p className="text-gray-500 font-mono text-xs">Accessing Database...</p>
                       </div>
                    ) : (
                       <>
    
                          <div className="border-b border-white/5 pb-10 mb-10">
                             <div className="flex flex-col md:flex-row gap-10 items-start">
                                
                                <div className="shrink-0 mx-auto md:mx-0 relative z-10">
                                   
                                   <div className="absolute -inset-4 bg-[#E7B95A]/10 rounded-full blur-2xl opacity-60" />

                                   <div className="w-56 aspect-[3/4] bg-[#1a2133] rounded-lg p-1.5 shadow-2xl relative group/photo">
                                       
                                       <div className="absolute top-4 -left-3 w-1 h-12 bg-[#E7B95A] rounded-l-md shadow-[0_0_10px_#E7B95A]" />
                                       
                                       <div className="absolute inset-0 border border-[#E7B95A]/30 rounded-lg pointer-events-none" />

                                       <div className="relative w-full h-full bg-[#0C101C] rounded overflow-hidden">
                                          {coordinatorData?.image ? (
                                              <Image 
                                                src={coordinatorData.image} 
                                                alt="Coord" 
                                                fill 
                                                className="object-cover transition-all duration-700" 
                                              />
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center"><User size={48} className="opacity-20 text-[#E7B95A]"/></div>
                                          )}
                                       </div>

                                       <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#E7B95A]" />
                                       <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#E7B95A]" />
                                   </div>
                                </div>

                                <div className="flex-1 text-center md:text-left pt-2">
                                   <div className="flex items-center justify-center md:justify-start gap-3 mb-4 opacity-80">
                                      <div className="px-2 py-1 bg-[#E7B95A]/10 border border-[#E7B95A]/20 rounded text-[#E7B95A] text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                                         Head of Division
                                      </div>
                                   </div>
                                   
                                   <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                      {activeStaticDiv.name}
                                   </h2>
                                   
                                   <div className="relative">
                                      <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0 font-light">
                                         {activeStaticDiv.desc}
                                      </p>
                                   </div>

                                   <div className="mt-8 inline-flex flex-col items-center md:items-start">
                                      <span className="text-[10px] text-[#7AABC3] font-bold tracking-[0.2em] uppercase mb-1">Coordinator</span>
                                      <div className="text-xl text-white font-medium">
                                         {coordinatorData?.name || "VACANT"}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div>
                             <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                   <Users size={16} /> Division Personnel
                                </h3>
                                <div className="h-px flex-1 bg-white/5 mx-4" />
                             </div>

                             {membersData.length > 0 ? (
                               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                   {membersData.map((member, idx) => (
                                      <motion.div 
                                        key={member.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex flex-col items-center group/card"
                                      >

                                         <div className="aspect-[3/4] w-full bg-[#0C101C] rounded border border-white/10 p-1.5 shadow-sm relative overflow-hidden transition-all duration-300 group-hover/card:border-[#E7B95A]/30 group-hover/card:shadow-[0_0_15px_rgba(231,185,90,0.05)]">
                                            <div className="relative w-full h-full bg-[#1a2133] rounded-[2px] overflow-hidden">
                                               {member.image ? (
                                                  <Image 
                                                    src={member.image} 
                                                    alt={member.name} 
                                                    fill 
                                                    className="object-cover transition-all duration-500" 
                                                  />
                                               ) : (
                                                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                      <User size={24} className="opacity-30" />
                                                  </div>
                                               )}
                                            </div>
                                         </div>

                                         <div className="mt-3 text-center w-full px-1">
                                            <h4 className="text-xs font-bold text-gray-400 truncate group-hover/card:text-[#E7B95A] transition-colors leading-tight">
                                              {member.name}
                                            </h4>
                                         </div>
                                      </motion.div>
                                   ))}
                               </div>
                             ) : (
                               <div className="py-16 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                                  <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">Archive Empty</p>
                               </div>
                             )}
                          </div>
                       </>
                    )}
                </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}