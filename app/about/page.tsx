'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView, Variants, Transition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link'; 
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { organization, visionMission, divisions as staticDivisions } from '@/data/aboutData'; 
import { getAllOfficers } from '@/actions/landing-actions';
import { 
  ArrowUpRight, 
  Users, 
  PenTool, 
  Megaphone,
  Briefcase,
  BookOpen,
  Share2
} from 'lucide-react';
import Firefly from '@/components/FireflyBackground';


const getDivisionIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('creative') || lower.includes('icm')) return <PenTool size={40} />;
  if (lower.includes('public') || lower.includes('pr')) return <Megaphone size={40} />;
  if (lower.includes('business')) return <Briefcase size={40} />;
  if (lower.includes('education')) return <BookOpen size={40} />;
  if (lower.includes('membership')) return <Share2 size={40} />;
  return <Users size={40} />;
};


const TypewriterText = ({ text }: { text: string }) => {
  const words = text.split(" ");
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      } as Transition,
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      } as Transition,
    },
  };

  return (
    <motion.div
      style={{ display: "flex", flexWrap: "wrap", gap: "0.25em" }} 
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-1">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};


export default function AboutPage() {
 
  const [officers, setOfficers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllOfficers();
        setOfficers(data);
      } catch (e) {
        console.error("Failed to load officers");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getOfficerByRole = (role: string, subLabel: string = "") => {
    const found = officers.find(o => o.position === role);
    return {
      name: found ? found.name : "Vacant Position", 
      role: role,
      subRole: subLabel,
      image: found?.image || null 
    };
  };

  const counselors = [
    getOfficerByRole("Counselor 1"),
    getOfficerByRole("Counselor 2"),
    getOfficerByRole("Counselor 3"),
    getOfficerByRole("Counselor 4"),
  ];

  const director = getOfficerByRole("Director");
  
  const viceDirectors = [
    getOfficerByRole("Vice Director I", "Internal & external affairs"),
    getOfficerByRole("Vice Director II", "Administration & Creative Media"),
    getOfficerByRole("Vice Director III", "General Affairs & Treasurer"),
  ];

  const LeaderCard = ({ item, delay = 0 }: { item: any, delay?: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group relative h-[420px] w-full rounded-[2rem]"
    >

      <div className="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 blur-[3px] transition-opacity duration-500" />
      
      <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-[#151b2b] border border-white/5 transition-all duration-500 shadow-xl group-hover:border-transparent">
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-600 font-mono text-xs flex-col gap-2">
            <span>Wait for Photo</span>
            {item.name === "Vacant Position" && <span className="text-red-400 text-[10px] uppercase border border-red-500/20 px-2 py-1 rounded">Empty in DB</span>}
          </div>
          
          {item.image && (
              <Image 
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700"
              />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C] via-[#0C101C]/40 to-transparent opacity-90" />
          
          <div className="absolute bottom-0 left-0 w-full p-8 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-[#E7B95A] text-[#0C101C] text-[10px] font-bold uppercase tracking-wider rounded-md mb-3 shadow-[0_0_15px_rgba(231,185,90,0.4)]">
              {item.role}
            </span>
            <h3 className={`text-xl md:text-2xl font-bold text-white mb-1 leading-tight ${item.name === "Vacant Position" ? "text-gray-500 italic" : ""}`}>
                {item.name}
            </h3>
            {item.subRole && (
              <p className="text-xs md:text-sm text-gray-400 font-light mt-1 border-t border-white/10 pt-2 inline-block">
                {item.subRole}
              </p>
            )}
          </div>
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-[#0C101C] text-white overflow-hidden selection:bg-[#E7B95A] selection:text-[#0C101C] relative">
      <Navbar />

      <Firefly />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0">
         <motion.div
           animate={{ top: ["-10%", "110%"] }}
           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-transparent via-white/40 to-transparent blur-[1px]"
         />
      </div>

      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C] via-[#0C101C]/70 to-transparent z-10" />
          <Image 
            src="/hero-bg.png" 
            alt="IEEE UNRI Team"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[#E7B95A] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              Who We Are
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight">
              Driving <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#E7B95A]">Innovation,</span> <br />
              Empowering Students.
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {organization.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- VISION & MISSION SECTION --- */}
      <section className="py-20 px-6 container mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* VISION CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-[#151b2b]/80 backdrop-blur-sm border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-[#3386B7]/30 transition-all shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#3386B7]/10 rounded-full blur-[80px] group-hover:bg-[#3386B7]/20 transition-all" />
             <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
               <span className="w-2 h-8 bg-[#E7B95A] rounded-full" /> Our Vision
             </h2>
             <div className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light italic">
                <TypewriterText text={`"${visionMission.vision}"`} />
             </div>
          </motion.div>

          {/* TAGLINE CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-5 bg-gradient-to-br from-[#E7B95A] to-[#F4D03F] p-10 rounded-[2.5rem] text-[#0C101C] flex flex-col justify-center relative overflow-hidden shadow-[0_0_30px_rgba(231,185,90,0.2)]"
          >
             <h3 className="text-lg font-bold uppercase tracking-widest opacity-70 mb-2">Tagline</h3>
             <p className="text-3xl md:text-4xl font-extrabold leading-tight">
               {organization.tagline}
             </p>
          </motion.div>

          {/* MISSION CARD */}
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="lg:col-span-12 bg-[#151b2b]/80 backdrop-blur-sm border border-white/5 p-10 md:p-14 rounded-[2.5rem] mt-4"
          >
             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
               <span className="w-2 h-8 bg-[#3386B7] rounded-full" /> Our Missions
             </h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {visionMission.missions.map((mission, idx) => (
                 <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                    className="flex gap-4 items-start"
                 >
                   <div className="w-8 h-8 rounded-full bg-[#3386B7]/20 flex items-center justify-center text-[#3386B7] font-bold text-sm shrink-0 mt-1 shadow-lg border border-[#3386B7]/10">
                     {idx + 1}
                   </div>
                   <p className="text-gray-300 leading-relaxed">{mission}</p>
                 </motion.div>
               ))}
             </div>
          </motion.div>

        </div>
      </section>

      {/* --- EXECUTIVES SECTION --- */}
      <section className="py-24 px-6 relative">
         
         <div className="container mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="text-[#3386B7] font-bold tracking-widest uppercase text-xs mb-3 block">Organizational Structure</span>
              <h2 className="text-4xl md:text-5xl font-bold">The Executives</h2>
            </motion.div>

            <div className="flex flex-col gap-12 items-center">

              {/* 4 COUNSELORS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                 {counselors.map((leader, i) => (
                    <LeaderCard key={i} item={leader} delay={i * 0.1} />
                 ))}
              </div>
    
              <div className="hidden md:block w-px h-12 bg-gradient-to-b from-[#3386B7]/50 to-[#E7B95A]/50 -my-6 relative z-0"></div>
              
              {/* DIRECTOR */}
              <div className="w-full max-w-[400px]">
                 <LeaderCard item={director} delay={0.3} />
              </div>

              <div className="hidden md:block w-px h-12 bg-gradient-to-b from-[#E7B95A]/50 to-[#3386B7]/50 -my-6 relative z-0"></div>

              {/* VICE DIRECTORS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                 {viceDirectors.map((leader, i) => (
                    <LeaderCard key={i} item={leader} delay={0.4 + (i * 0.1)} />
                 ))}
              </div>
            </div>

         </div>
      </section>

      {/* --- DIVISIONS SECTION --- */}
      <section className="py-20 px-6 container mx-auto pb-32 relative z-10">

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
           <span className="text-[#E7B95A] font-bold tracking-widest uppercase text-xs">Our Departments</span>
           <h2 className="text-4xl md:text-5xl font-bold mt-2">Divisions & Teams</h2>
           <p className="text-gray-400 mt-4 max-w-lg mx-auto">Explore the specialized units that drive our organization forward.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

           {staticDivisions.map((div, idx) => {
             const coordinator = officers.find(o => o.division === div.name && o.position === "Head of Division");

             return (
               <Link href={`/departments?tab=${div.id}`} key={idx} className="block h-full">
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="group relative h-full rounded-[2.5rem]"
                 >

                    <div className="absolute -inset-[2px] rounded-[2.5rem] bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 blur-[3px] transition-opacity duration-500" />

                    <div className="relative h-full rounded-[2.5rem] bg-[#151b2b] border border-white/5 group-hover:border-transparent transition-all duration-300 flex flex-col overflow-hidden shadow-xl">
                        
                        <div className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-[#3386B7]/10 transition-colors rotate-[-10deg] scale-150 pointer-events-none">
                            {getDivisionIcon(div.name)}
                        </div>

                        <div className="p-8 pb-4 flex justify-between items-start relative z-10">

                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#E7B95A] group-hover:bg-[#E7B95A] group-hover:text-black transition-colors shadow-lg">
                                {React.cloneElement(getDivisionIcon(div.name) as React.ReactElement<any, any>, { size: 24 })}
                            </div>

                            <div className="p-2 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300"/>
                            </div>
                        </div>

                        <div className="px-8 mb-6 relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#3386B7] transition-colors">
                              {div.name}
                            </h3>

                            <p className="text-gray-400 leading-relaxed text-sm border-t border-white/5 pt-4 line-clamp-3 group-hover:text-gray-300 transition-colors">
                              {div.desc}
                            </p>
                        </div>

                        <div className="mt-auto h-1 w-full bg-gradient-to-r from-transparent via-[#3386B7] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                 </motion.div>
               </Link>
             );
           })}
        </div>
      </section>

      <Footer />
    </main>
  );
}