'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Sparkles, Rocket, CalendarHeart } from 'lucide-react';

const TARGET_DATE = new Date('2026-02-22T00:00:00').getTime();

export default function AbsentComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  const backgroundParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
    size: Math.random() * 10 + 5,
  }));

  return (
    <div className="min-h-screen bg-[#0C101C] text-white flex flex-col relative overflow-hidden selection:bg-[#E7B95A] selection:text-[#0C101C]">
      
      <div className="absolute inset-0 pointer-events-none">
        {isClient && backgroundParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#E7B95A]/10 blur-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <header className="absolute top-0 left-0 w-full p-6 z-20">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:scale-105 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">Back to Dashboard</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 text-center">
        
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E7B95A] to-[#F4D03F] flex items-center justify-center shadow-[0_0_50px_rgba(231,185,90,0.3)]">
            <CalendarHeart size={48} className="text-[#0C101C]" />
          </div>
          <motion.div 
            className="absolute -top-4 -right-4 text-yellow-300"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={32} />
          </motion.div>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E7B95A] to-white">
          Absence System
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          We are building something <span className="text-[#E7B95A] font-bold">awesome</span> to manage attendance easily. Stay tuned!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <CountdownBox label="Days" value={timeLeft.days} />
          <CountdownBox label="Hours" value={timeLeft.hours} />
          <CountdownBox label="Minutes" value={timeLeft.minutes} />
          <CountdownBox label="Seconds" value={timeLeft.seconds} color="text-[#E7B95A]" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-4 rounded-2xl bg-[#151b2b] border border-[#E7B95A]/30 overflow-hidden font-bold text-[#E7B95A] shadow-lg flex items-center gap-3"
        >
          <div className="absolute inset-0 bg-[#E7B95A]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
        </motion.button>

      </main>

      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#E7B95A]/50 to-transparent" />
    </div>
  );
}

function CountdownBox({ label, value, color = "text-white" }: { label: string, value: number, color?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#151b2b]/50 backdrop-blur-md border border-white/5 p-4 rounded-2xl w-24 md:w-32 flex flex-col items-center justify-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <motion.span 
        key={value} 
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={`text-3xl md:text-5xl font-black ${color} mb-1`}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      
      <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </span>
    </motion.div>
  );
}