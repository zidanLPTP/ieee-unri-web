'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathname = usePathname(); 

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); 
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },  
    { name: 'Event', href: '/events' },  
    { name: 'News', href: '/news' },     
    { name: 'Gallery', href: '/gallery' }, 
    { name: 'Contact Us', href: '#Contact' }, 
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >

        <div className="bg-[#0C101C]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 shadow-2xl w-full max-w-6xl flex items-center justify-between transition-all duration-300 hover:border-[#E7B95A]/30">
          
          <Link href="/" className="flex items-center gap-2 group shrink-0 pl-4">
            <div className="font-bold text-xl tracking-tighter text-white transition-colors">
              IEEE <span className="text-[#7AABC3]">UNRI</span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-2 ml-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.name} className="relative">
                  <Link 
                    href={link.href}
                    className={`relative z-10 block px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-[#E7B95A]' : 'text-[#7AABC3] hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>

                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-[#E7B95A]/10 border border-[#E7B95A]/20 shadow-[0_0_15px_rgba(231,185,90,0.15)] backdrop-blur-sm -z-0"
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30 
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-[#E7B95A] transition-colors ml-4 p-2 rounded-full hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-4 right-4 z-40 bg-[#0C101C]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3386B7]/20 blur-[50px] pointer-events-none" />

            <ul className="flex flex-col gap-2 relative z-10">
              {navLinks.map((link) => {
                 const isActive = pathname === link.href;
                 return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 border
                        ${isActive 
                          ? 'bg-[#E7B95A]/10 border-[#E7B95A]/30 text-[#E7B95A] shadow-[0_0_15px_rgba(231,185,90,0.1)]' 
                          : 'border-transparent text-[#7AABC3] hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <span className="font-medium text-lg">{link.name}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="mobile-indicator"
                          className="w-2 h-2 rounded-full bg-[#E7B95A] shadow-[0_0_5px_#E7B95A]"
                        />
                      )}
                    </Link>
                  </li>
                 )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}