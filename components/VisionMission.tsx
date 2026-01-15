'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Users, Handshake, BookOpen, ShieldCheck, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VisionMission() {
  
  const missions = [
    {
      id: 1,
      icon: Settings,
      title: "Organizational Excellence",
      desc: "Enhance internal performance through structured management and transparent coordination."
    },
    {
      id: 2,
      icon: Users,
      title: "Member Engagement",
      desc: "Foster active involvement by creating meaningful, collaborative, and student-centered programs."
    },
    {
      id: 3,
      icon: Handshake,
      title: "Strategic Collaboration",
      desc: "Strengthen internal and external partnerships with academic and industrial communities."
    },
    {
      id: 4,
      icon: BookOpen,
      title: "Skill Development",
      desc: "Support the growth of technical, leadership, and professional skills among all members."
    },
    {
      id: 5,
      icon: ShieldCheck,
      title: "Sustainability",
      desc: "Ensure sustainable and well-managed programs aligned with IEEE global values."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % missions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + missions.length) % missions.length);
  };

  const getVisibleCards = () => {
    const prevIndex = (currentIndex - 1 + missions.length) % missions.length;
    const nextIndex = (currentIndex + 1) % missions.length;
    
    return [
      { ...missions[prevIndex], role: 'prev' },  
      { ...missions[currentIndex], role: 'active' }, 
      { ...missions[nextIndex], role: 'next' }   
    ];
  };

  return (
    <section className="relative py-32 bg-[#0C101C] text-white overflow-hidden">
      
      <div className="absolute top-1/4 left-[-15%] w-[600px] h-[600px] bg-[#3386B7] rounded-full blur-[180px] opacity-20 z-0 animate-pulse duration-[8000ms]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
          animate={{ top: ['-20%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">

        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <Quote className="text-[#E7B95A] rotate-180" size={24} />
            <span className="text-[#E7B95A] font-bold tracking-[0.3em] text-sm uppercase">Our Vision</span>
            <Quote className="text-[#E7B95A] rotate-180" size={24} />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-medium leading-relaxed font-serif italic text-gray-200">
            "To strengthen IEEE SB UNRI as a <span className="text-white font-bold not-italic decoration-[#3386B7] underline decoration-4 underline-offset-4">professional, inclusive, and impactful</span> organization."
          </h2>
        </div>

        <div 
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          <div className="relative min-h-[450px] flex items-center justify-center">
            
            <div className="hidden md:flex justify-center items-center gap-6 w-full perspective-1000">
              <AnimatePresence mode='popLayout'>
                {getVisibleCards().map((item) => {
                  const isActive = item.role === 'active';
                  
                  return (
                    <motion.div
                      key={item.id}
                      layoutId={`card-${item.id}`}
                      initial={{ opacity: 0, scale: 0.8, x: item.role === 'next' ? 100 : -100 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0.5,
                        scale: isActive ? 1 : 0.85,
                        x: 0,
                        zIndex: isActive ? 10 : 0,
                        filter: isActive ? 'blur(0px)' : 'blur(2px)'
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 20,
                        mass: 1 
                      }}
                      className="relative w-1/3 min-w-[350px] h-[400px]"
                    >
                      {isActive && (
                         <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] blur-[4px] -z-10 animate-pulse duration-3000" />
                      )}

                      <div className={`
                        relative w-full h-full p-10 rounded-3xl border transition-all duration-500 flex flex-col justify-center backdrop-blur-md
                        ${isActive 
                          ? 'bg-[#151b2b]/90 border-transparent shadow-2xl' 
                          : 'bg-[#0C101C]/80 border-white/5'
                        }
                      `}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300 shrink-0
                          ${isActive ? 'bg-[#E7B95A] text-[#0C101C] shadow-[0_0_20px_rgba(231,185,90,0.3)]' : 'bg-[#3386B7]/10 text-[#3386B7]'}
                        `}>
                          <item.icon size={32} />
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-4 transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
                          {item.title}
                        </h3>
                        
                        <p className={`text-sm leading-relaxed transition-colors ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="md:hidden relative w-full px-4">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={missions[currentIndex].id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative p-[1.5px] rounded-3xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7AABC3] via-[#214664] to-[#E7B95A] animate-pulse" />
                  
                  <div className="relative bg-[#151b2b] p-8 rounded-3xl h-full">
                    <div className="w-14 h-14 bg-[#E7B95A] rounded-xl flex items-center justify-center text-[#0C101C] mb-6 shrink-0 shadow-lg">
                        {React.createElement(missions[currentIndex].icon, { size: 28 })}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                        {missions[currentIndex].title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {missions[currentIndex].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 p-4 bg-[#0C101C]/50 border border-white/10 hover:border-[#E7B95A] text-gray-400 hover:text-[#E7B95A] rounded-full backdrop-blur-xl transition-all z-20 hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 p-4 bg-[#0C101C]/50 border border-white/10 hover:border-[#E7B95A] text-gray-400 hover:text-[#E7B95A] rounded-full backdrop-blur-xl transition-all z-20 hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-3 mt-12">
            {missions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex 
                    ? 'w-12 bg-gradient-to-r from-[#3386B7] to-[#E7B95A]' 
                    : 'w-2 bg-gray-800 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}