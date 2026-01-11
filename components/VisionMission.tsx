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
      }, 4000);
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
      missions[prevIndex],  
      missions[currentIndex], 
      missions[nextIndex]   
    ];
  };

  return (
    <section className="relative py-32 bg-[#0C101C] text-white overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
          animate={{ top: ['-20%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">

        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in-up">
            <Quote className="text-[#E7B95A] rotate-180" size={24} />
            <span className="text-[#E7B95A] font-bold tracking-[0.3em] text-sm uppercase">Our Vision</span>
            <Quote className="text-[#E7B95A] rotate-180" size={24} />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-medium leading-relaxed font-serif italic text-gray-200 animate-fade-in-up">
            "To strengthen IEEE SB UNRI as a <span className="text-white font-bold not-italic decoration-[#3386B7] underline decoration-4 underline-offset-4">professional, inclusive, and impactful</span> organization."
          </h2>
        </div>

        <div 
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          <div className="relative min-h-[400px] flex items-center justify-center">
            
            <div className="hidden md:grid grid-cols-3 gap-6 w-full items-center">
              <AnimatePresence mode='popLayout'>
                {getVisibleCards().map((item) => {
                  const isActive = item.id === missions[currentIndex].id;

                  return (
                    <motion.div
                      key={item.id}
                      layoutId={`card-${item.id}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0.4,
                        scale: isActive ? 1 : 0.9,
                        zIndex: isActive ? 10 : 0
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                      
                      className={`
                        relative p-8 rounded-2xl border transition-all duration-500 flex flex-col h-full justify-center
                        ${isActive 
                          ? 'bg-[#151b2b] border-[#E7B95A] shadow-[0_0_40px_rgba(231,185,90,0.15)]' 
                          : 'bg-[#0C101C] border-white/5 grayscale-[50%]'
                        }
                      `}
                    >

                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 shrink-0
                        ${isActive ? 'bg-[#E7B95A] text-[#0C101C]' : 'bg-[#3386B7]/10 text-[#3386B7]'}
                      `}>
                        <item.icon size={28} />
                      </div>
                      
                      <h3 className={`text-xl font-bold mb-3 transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="md:hidden relative w-full px-4">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={missions[currentIndex].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#151b2b] p-8 rounded-2xl border border-[#E7B95A] shadow-[0_0_20px_rgba(231,185,90,0.1)]"
                >
                  <div className="w-14 h-14 bg-[#E7B95A] rounded-xl flex items-center justify-center text-[#0C101C] mb-6 shrink-0">
                    {React.createElement(missions[currentIndex].icon, { size: 28 })}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {missions[currentIndex].title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {missions[currentIndex].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -left-2 md:-left-12 -translate-y-1/2 p-3 bg-[#214664]/50 hover:bg-[#E7B95A] text-white hover:text-[#0C101C] rounded-full backdrop-blur-sm transition-all z-20 shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -right-2 md:-right-12 -translate-y-1/2 p-3 bg-[#214664]/50 hover:bg-[#E7B95A] text-white hover:text-[#0C101C] rounded-full backdrop-blur-sm transition-all z-20 shadow-lg"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-3 mt-10">
            {missions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-[#E7B95A]' : 'w-2 bg-gray-700 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}