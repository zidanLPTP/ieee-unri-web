'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Users, Zap, FileText, PenTool, Briefcase, BookOpen } from 'lucide-react';
import Link from 'next/link';

const divisions = [
  { 
    id: 1, 
    name: "Membership & Internal Relations", 
    icon: Users, 
    image: "/divisi/membership.svg", 
    desc: "Responsible for managing membership databases and fostering internal cohesion. This department oversees recruitment processes, monitors member engagement, and builds a solid, inclusive organizational environment through capacity-building programs." 
  },
  { 
    id: 2, 
    name: "Public Relations & Partnership", 
    icon: Zap, 
    image: "/divisi/pr.svg", 
    desc: "Serves as the primary liaison for external affairs, establishing strategic collaborations with academic institutions and professional partners. Focuses on strengthening the institutional image and maintaining formal communication channels." 
  },
  { 
    id: 3, 
    name: "Secretariat", 
    icon: FileText, 
    image: "/divisi/secretariat.svg", 
    desc: "Oversees the organization's administrative backbone, including correspondence, archival management, and reporting. Ensures procedural efficiency, documentation accuracy, and organizational accountability." 
  },
  { 
    id: 4, 
    name: "Information & Creative Media", 
    icon: PenTool, 
    image: "/divisi/creative.svg", 
    desc: "Spearheads visual branding and information dissemination. Manages digital media channels, produces creative content, and documents activities to enhance public engagement and organizational credibility." 
  },
  { 
    id: 5, 
    name: "Business Affairs", 
    icon: Briefcase, 
    image: "/divisi/business.svg", 
    desc: "Directs financial strategy and fundraising initiatives. Manages budgets, secures sponsorships, and oversees entrepreneurial ventures to ensure the organization's long-term economic sustainability and operational feasibility." 
  },
  { 
    id: 6, 
    name: "Education", 
    icon: BookOpen, 
    image: "/divisi/education.svg", 
    desc: "Facilitates academic and professional development through technical workshops, seminars, and research initiatives. Dedicated to fostering a culture of innovation and enhancing members' technical competencies." 
  },
];

export default function DepartmentSection() {
  const { scrollYProgress } = useScroll();
  
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="relative py-32 bg-[#0C101C] text-white overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
         <motion.div
           animate={{ top: ["-20%", "120%"] }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
         />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center mb-32 relative">
           
           <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.7 }}
             className="text-4xl md:text-6xl font-bold mb-4"
           >
             Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#3386B7]">Departments</span>
           </motion.h2>
           

        </div>

        <div className="flex flex-col gap-32">
          {divisions.map((div, idx) => {
            const isEven = idx % 2 === 0; 
            
            return (
              <motion.div 
                key={div.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col md:flex-row items-center gap-10 md:gap-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                
                <div className="w-full md:w-1/2 relative group perspective-1000">
                                
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: "40px", opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={`hidden md:block absolute top-1/2 h-[1px] bg-[#3386B7]/30 ${isEven ? '-right-10 origin-left' : '-left-10 origin-right'}`}
                  />
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#E7B95A] rounded-full shadow-[0_0_10px_#E7B95A] ${isEven ? '-right-11' : '-left-11'}`} 
                  />

                  <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/10 group-hover:border-[#E7B95A]/50 transition-all duration-500 shadow-2xl bg-[#151b2b]">
                    <div className="absolute inset-0 bg-[#151b2b] animate-pulse" /> 
                    
                    <Image 
                      src={div.image} 
                      alt={div.name} 
                      fill 
                      className="object-contain p-6 md:p-8 transition-transform duration-1000 ease-out"
                    />

                    <div className="absolute bottom-3 right-4 text-[10px] text-white/50 bg-black/30 px-2 py-1 rounded-full backdrop-blur">
                      Illustration by{" "}
                      <a
                        href="https://storyset.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white"
                      >
                        Storyset
                      </a>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out transform -skew-x-12" />
                  </div>
                </div>

                <div className={`w-full md:w-1/2 ${isEven ? 'text-left' : 'text-left md:text-right'}`}>
                  
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-flex items-center justify-center p-4 rounded-2xl bg-[#3386B7]/5 border border-[#3386B7]/20 text-[#3386B7] mb-6 group-hover:bg-[#E7B95A]/10 group-hover:text-[#E7B95A] group-hover:border-[#E7B95A]/30 transition-all duration-300 ${!isEven && 'md:ml-auto'}`}
                  >
                    <div.icon size={32} />
                  </motion.div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 group-hover:text-[#E7B95A] transition-colors duration-300">
                    {div.name}
                  </h3>
                  
                  <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light tracking-wide">
                    {div.desc}
                  </p>

                  <Link href="/departments">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-white hover:border-[#E7B95A] hover:text-[#E7B95A] hover:bg-[#E7B95A]/5 transition-all font-semibold tracking-wide ${!isEven && 'md:ml-auto'}`}
                    >
                      Explore Department <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}