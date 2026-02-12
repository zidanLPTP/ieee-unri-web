'use client';

import React, { useState, useEffect, JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';
import Link from 'next/link';

const sponsors = [
  {
    id: 1,
    name: "Pertamina Hulu Rokan",
    logo: "/images/sponsors/phr.png", 
    url: "https://phr.pertamina.com/",
    color: "#ED2939" 
  },
  {
    id: 2,
    name: "PT Riau Andalan Pulp and Paper (RAPP)",
    logo: "/images/sponsors/rapp.png",
    url: "https://www.aprilasia.com",
    color: "#005EB8"
  },
  {
    id: 3,
    name: "Rohde & Schwarz Indonesia",
    logo: "/images/sponsors/rs.png",
    url: "https://www.rohde-schwarz.com",
    color: "#0096D6"
  },
];

export default function Sponsors() {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const colors = ['#E7B95A', '#7AABC3', '#FFFFFF'];
    const newParticles = Array.from({ length: 30 }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      return (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
              backgroundColor: color,
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${size * 2}px ${color}`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      );
    });
    setParticles(newParticles);
  }, []);

  return (
    <section id="sponsors" className="relative py-24 bg-[#0C101C] text-white overflow-hidden">
      
      {/* 1. Background Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles}
      </div>

      {/* 2. Vertical Moving Line (Beam) - DITAMBAHKAN DISINI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
          animate={{ top: ['-20%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 mb-4 justify-center"
          >
            <Handshake className="text-[#E7B95A]" size={24} />
            <span className="text-[#E7B95A] font-bold tracking-[0.2em] uppercase text-sm">
              Our Strategic Partners
            </span>
          </motion.div>

          <motion.h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#3386B7]">Industry Leaders</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-stretch">
          {sponsors.map((sponsor, idx) => (
            <div key={sponsor.id} className="relative h-48 md:h-64">
              <Link href={sponsor.url} target="_blank" className="block h-full w-full">
                
                {/* Animated Rotating Border (Pengganti Hover) */}
                {/* Pastikan class 'animate-spin-slow' sudah ada di tailwind.config.ts kamu. 
                    Jika belum, ganti className ini dengan <motion.div animate={{ rotate: 360 }} ... /> */}
                <div 
                  className="absolute -inset-[1px] rounded-3xl opacity-60 animate-spin-slow overflow-hidden"
                  style={{ 
                    background: `conic-gradient(from 0deg, transparent, ${sponsor.color}, transparent, ${sponsor.color}, transparent)` 
                  }} 
                />

                {/* Card Body */}
                <div className="relative h-full w-full bg-[#0C101C] rounded-[22px] p-8 flex items-center justify-center overflow-hidden border border-white/5">
                  
                  {/* Constant Ambient Glow */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(circle at center, ${sponsor.color}, transparent 80%)` }}
                  />

                  {/* Logo Image */}
                  <div className="relative w-full h-full p-4">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 80vw, 30vw"
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}