'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
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
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="group relative w-full max-w-6xl">
            
            <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-[#0C101C]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center justify-between transition-all duration-300 group-hover:border-transparent">
            
              <Link href="/" className="flex items-center gap-2 shrink-0 pl-2">
                <div className="w-28 h-auto">
                  <Image
                    src="/ieeeunri.jpg"
                    alt="IEEE UNRI"
                    width={70}
                    height={20}
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

                <ul className="hidden md:flex items-center gap-1 ml-auto">
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
                            className="absolute inset-0 rounded-full bg-[#E7B95A]/10 border border-[#E7B95A]/20 shadow-[0_0_15px_rgba(231,185,90,0.2)]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        </li>
                    );
                    })}
                </ul>

                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-[#7AABC3] hover:text-[#E7B95A] transition-colors ml-4 p-2"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-28 left-4 right-4 z-40 md:hidden"
          >
            <div className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-r from-[#7AABC3] via-[#3386B7] via-[#214664] to-[#E7B95A]">
                
                <div className="relative bg-[#0C101C] rounded-3xl p-6 shadow-2xl overflow-hidden">
                    
                    <ul className="flex flex-col gap-2 relative z-10">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                        <li key={link.name}>
                            <Link
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`
                                flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 border
                                ${isActive 
                                ? 'bg-[#E7B95A]/10 border-[#E7B95A]/30 text-[#E7B95A]' 
                                : 'border-transparent text-[#7AABC3] hover:bg-white/5 hover:text-white'
                                }
                            `}
                            >
                            <span className="font-medium text-lg tracking-wide">{link.name}</span>
                            {isActive && (
                                <motion.div 
                                layoutId="mobile-indicator"
                                className="w-2 h-2 rounded-full bg-[#E7B95A] shadow-[0_0_8px_#E7B95A]"
                                />
                            )}
                            </Link>
                        </li>
                        )
                    })}
                    </ul>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}