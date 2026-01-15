'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Target, Zap, Globe, MapPin } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 }, 
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function AboutModern() {
  return (
    <section id="about" className="relative py-32 bg-[#0C101C] text-white overflow-hidden">
      
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[#3386B7] rounded-full blur-[180px] opacity-20 z-0 animate-pulse duration-[8000ms]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-transparent via-white to-transparent opacity-30"
          animate={{ top: ['-20%', '120%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
    
        <div className="text-center max-w-3xl mx-auto mb-20">
          
          <motion.span 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} 
            className="text-[#E7B95A] font-bold tracking-[0.2em] uppercase text-sm block"
          >
            Who We Are
          </motion.span>

          <motion.h2 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 1.2 }} 
            className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight" 
          >
            Part of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#3386B7]">IEEE Indonesia Section</span> 
          </motion.h2>

          <motion.p 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 1.2 }} 
            className="text-gray-400 text-lg leading-relaxed"
          >
            We empower students to build the future through technology, research, and professional networking.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="md:col-span-2 group relative rounded-3xl"
          >
            <div className="absolute -inset-[1.5px] rounded-3xl bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
            
            <div className="relative h-full bg-[#151b2b] border border-white/5 rounded-3xl p-10 overflow-hidden transition-colors group-hover:border-transparent">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3386B7] blur-[80px] opacity-20" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#3386B7]/20 rounded-2xl flex items-center justify-center text-[#7AABC3] mb-6">
                  <Globe size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Global Network</h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  IEEE Student Branch University of Riau acts as a bridge connecting UNRI students to the global technology community. We facilitate active participation in international standard research and scientific publications.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="row-span-2 group relative rounded-3xl h-[400px] md:h-auto"
            >
             <div className="absolute -inset-[1.5px] rounded-3xl bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />

            <div className="relative h-full w-full bg-gray-900 rounded-3xl overflow-hidden border border-white/5 group-hover:border-transparent">
                <Image 
                    src="/bento-ieeeunri.png" 
                    alt="IEEE Activity" 
                    fill 
                    className="object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C] via-[#0C101C]/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-2 text-[#E7B95A] text-sm font-bold mb-3">
                    <MapPin size={16} /> University of Riau, Indonesia
                    </div>
                    <p className="text-white font-medium text-lg leading-snug">Empowering students through real-world technical experience.</p>
                </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="group relative rounded-3xl"
          >
             <div className="absolute -inset-[1.5px] rounded-3xl bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />

              <div className="relative h-full bg-[#151b2b] border border-white/5 rounded-3xl p-10 transition-colors group-hover:border-transparent">
                <div className="w-14 h-14 bg-[#E7B95A]/10 rounded-2xl flex items-center justify-center text-[#E7B95A] mb-6">
                    <Zap size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Empowerment</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Optimizing Soft Skills & Hard Skills through managed scientific activities and workshops.
                </p>
              </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1 }}
            className="group relative rounded-3xl"
          >
             <div className="absolute -inset-[1.5px] rounded-3xl bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />

              <div className="relative h-full bg-[#151b2b] border border-white/5 rounded-3xl p-10 transition-colors group-hover:border-transparent">
                <div className="w-14 h-14 bg-[#7AABC3]/10 rounded-2xl flex items-center justify-center text-[#7AABC3] mb-6">
                    <Target size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Research</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Developing research culture and scientific publication in technology sectors.
                </p>
              </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}