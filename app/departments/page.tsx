'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { divisions as staticDivisions } from '@/data/aboutData'; 
import { FolderOpen, User, Users, Hash, Loader2 } from 'lucide-react';
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
    <main className="min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C] overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        
        <div className="text-center mb-16">
           <span className="text-[#E7B95A] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
             Classified Personnel
           </span>
           <h1 className="text-4xl md:text-6xl font-extrabold">
             Division <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#E7B95A]">Members</span>
           </h1>
           <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base">
             Accessing personnel records. Select a folder below to view department details and staff composition.
           </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-5xl mx-auto">
          {staticDivisions.map((div) => {
             const isActive = activeTab === div.id;
             return (
               <button
                 key={div.id}
                 onClick={() => setActiveTab(div.id)}
                 className={`relative px-6 py-3 md:px-8 md:py-4 rounded-t-2xl font-bold text-sm md:text-base transition-all duration-300 flex items-center gap-2 border-t border-x border-white/10 shadow-[-5px_-5px_15px_rgba(255,255,255,0.02)]
                 ${isActive 
                    ? 'bg-[#151b2b] text-[#E7B95A] translate-y-2 z-10 border-b-0 pb-6' 
                    : 'bg-[#0f131f] text-gray-500 hover:bg-[#1a2133] hover:text-gray-300 hover:-translate-y-1 z-0'
                 }`}
               >
                 {isActive && <FolderOpen size={18} className="animate-pulse"/>}
                 {div.name}
                 {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E7B95A] to-[#F4D03F] rounded-t-full" />}
               </button>
             );
          })}
        </div>

        <div className="relative z-20 -mt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStaticDiv.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-[#151b2b] border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden min-h-[500px]"
              >
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3386B7]/5 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" />
                  
                  {isLoading ? (
                     <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 size={40} className="text-[#E7B95A] animate-spin mb-4" />
                        <p className="text-gray-500">Retrieving personnel data...</p>
                     </div>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-16 relative z-10 items-start">
                          
                          <div className="shrink-0 relative group mx-auto md:mx-0">
                             <div className="w-48 h-56 md:w-56 md:h-64 bg-gray-800 rounded-xl border-4 border-white/5 overflow-hidden relative shadow-lg rotate-2 group-hover:rotate-0 transition-transform duration-500">
                                 {coordinatorData?.image ? (
                                    <Image 
                                      src={coordinatorData.image} 
                                      alt={coordinatorData.name}
                                      fill
                                      className="object-cover"
                                    />
                                 ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a2133] text-gray-500">
                                       <User size={64} className="mb-2 opacity-50" />
                                       <span className="text-xs uppercase tracking-widest">No Photo</span>
                                    </div>
                                 )}

                                 <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-3 text-center border-t border-white/10">
                                    <span className="text-[#E7B95A] font-bold text-xs uppercase tracking-wider block">
                                      HEAD OF DIVISION
                                    </span>
                                 </div>
                             </div>
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-12 border-4 border-gray-400 rounded-full z-20 bg-transparent shadow-sm" />
                          </div>

                          <div className="flex-1 text-center md:text-left pt-4">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3386B7]/10 text-[#3386B7] border border-[#3386B7]/20 text-xs font-bold uppercase tracking-widest mb-4">
                                <Hash size={12} /> ID: {activeStaticDiv.id.toUpperCase()}
                             </div>
                             <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                                {activeStaticDiv.name}
                             </h2>
                             <h3 className="text-xl text-gray-400 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                                 Coordinator: <span className="text-white">{coordinatorData?.name || "TBA"}</span>
                             </h3>
                             <div className="p-6 bg-[#0C101C]/50 border-l-4 border-[#E7B95A] rounded-r-xl">
                                <p className="text-gray-300 leading-relaxed italic">
                                   "{activeStaticDiv.desc}"
                                </p>
                             </div>
                          </div>
                      </div>

                      <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                            <Users size={24} className="text-[#E7B95A]" />
                            <h3 className="text-2xl font-bold">Active Personnel</h3>
                         </div>
                         
                         {membersData.length > 0 ? (
                           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                               {membersData.map((member, idx) => (
                                  <motion.div 
                                    key={member.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative"
                                  >
                                     <div className="bg-[#0f131f] border border-white/5 p-3 rounded-xl hover:border-[#3386B7]/50 hover:bg-[#151b2b] transition-all duration-300 shadow-lg hover:-translate-y-2">
                                        
                                        <div className="aspect-square rounded-lg bg-[#1a2133] overflow-hidden relative mb-3 border border-white/5">
                                           {member.image ? (
                                              <Image 
                                                src={member.image} 
                                                alt={member.name} 
                                                fill 
                                                className="object-cover" 
                                              />
                                           ) : (
                                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-[#151b2b]">
                                                  <User size={32} className="opacity-50 group-hover:text-[#3386B7] transition-colors" />
                                              </div>
                                           )}
                                           
                                        </div>
                                        
                                        <div className="text-center">
                                           <h4 className="font-bold text-sm text-white truncate group-hover:text-[#3386B7] transition-colors">
                                             {member.name}
                                           </h4>
                                           <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">
                                             {member.position}
                                           </p>
                                        </div>
                                     </div>
                                  </motion.div>
                               ))}
                           </div>
                         ) : (
                           <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                              <p className="text-gray-500">No personnel data available for this division.</p>
                           </div>
                         )}
                      </div>
                    </>
                  )}

              </motion.div>
            </AnimatePresence>
        </div>

      </div>
      <Footer />
    </main>
  );
}