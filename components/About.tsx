'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Target, Zap, Globe, MapPin } from 'lucide-react';


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 }, 
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function AboutModern() {
  return (
    <section id="about" className="relative py-32 bg-[#0C101C] text-white overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
          animate={{ top: ['-20%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
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
            transition={{ delay: 0.2, duration: 0.8 }} 
            className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight" 
          >
            Part of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#3386B7]">IEEE Indonesia Section</span> 
          </motion.h2>

          <motion.p 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 0.8 }} 
            className="text-gray-400 text-lg leading-relaxed"
          >
            We empower students to build the future through technology, research, and professional networking.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* MAIN DESCRIPTION */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2 bg-[#151b2b] border border-white/5 p-8 rounded-3xl hover:border-[#3386B7]/30 transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3386B7] blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#3386B7]/20 rounded-xl flex items-center justify-center text-[#7AABC3] mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Global Network</h3>
              <p className="text-gray-400 leading-relaxed">
                IEEE Student Branch Universitas Riau acts as a bridge connecting UNRI students to the global technology community. We facilitate active participation in international standard research and scientific publications.
              </p>
            </div>
          </motion.div>

          {/* PHOTO CARD  */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="row-span-2 relative bg-gray-900 rounded-3xl overflow-hidden border-2 border-white/5 hover:border-[#E7B95A] hover:shadow-[0_0_30px_rgba(231,185,90,0.25)] transition-all duration-500 h-[400px] md:h-auto group"
            >
            <Image 
                src="/bento-ieeeunri.png" 
                alt="IEEE Activity" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C] via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 text-[#E7B95A] text-sm font-bold mb-2">
                <MapPin size={16} /> Universitas Riau
                </div>
                <p className="text-white font-medium">Empowering students through real-world technical experience.</p>
            </div>
          </motion.div>

          {/* MISSION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-[#151b2b] border border-white/5 p-8 rounded-3xl hover:border-[#E7B95A]/30 transition-colors group"
          >
              <div className="w-12 h-12 bg-[#E7B95A]/10 rounded-xl flex items-center justify-center text-[#E7B95A] mb-6 group-hover:rotate-12 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Empowerment</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Optimizing Soft Skills & Hard Skills through managed scientific activities and workshops.
              </p>
          </motion.div>

        {/* VISION  */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-[#151b2b] border border-white/5 p-8 rounded-3xl hover:border-[#7AABC3]/30 transition-colors group"
          >
              <div className="w-12 h-12 bg-[#7AABC3]/10 rounded-xl flex items-center justify-center text-[#7AABC3] mb-6 group-hover:rotate-12 transition-transform">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Research</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Developing research culture and scientific publication in technology sectors.
              </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}