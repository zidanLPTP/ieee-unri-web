'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Instagram, Linkedin, Mail, Youtube, ArrowRight, ChevronDown, Check, Phone, PhoneCall } from 'lucide-react';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = "ieee.sb@unri.ac.id";

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        triggerCopiedState();
        return;
      } catch (err) {
        console.error("Copy failed", err);
      }
    }

    const textArea = document.createElement("textarea");
    textArea.value = email;
    textArea.style.position = "fixed"; 
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      triggerCopiedState();
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    
    document.body.removeChild(textArea);
  };

  const triggerCopiedState = () => {
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C101C] text-white font-sans selection:bg-[#E7B95A] selection:text-[#0C101C] relative overflow-hidden flex items-center justify-center">
      
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-hero-banner.png"
          alt="Background Gedung"
          fill
          className="object-cover grayscale opacity-50 md:opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-[#214664]/90 mix-blend-multiply" /> 
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C101C]/60 via-transparent to-[#0C101C]/90" />
      </div>

      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#3386B7] rounded-full blur-[150px] opacity-20 z-0 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#214664] rounded-full blur-[150px] opacity-30 z-0" />

      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-8 items-center">

        {/* Garis Atas */}
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#7AABC3]/50"></div>
        
        {[
          { 
            icon: Linkedin, 
            href: "https://www.linkedin.com/company/ieee-student-branch-universitas-riau", 
            label: "LinkedIn" 
          },
          { 
            icon: Instagram, 
            href: "https://www.instagram.com/ieee.sb.unri", 
            label: "Instagram" 
          },
          { 
            icon: Mail, 
            href: "#", 
            label: "Email",
            isEmail: true 
          },
          {
            icon : Phone,
            href: "https://wa.me/6283185116094",
            label: "WhatsApp"
          }

          // { 
          //   icon: Youtube, 
          //   href: "https://youtube.com/@ieeeunri",
          //   label: "Youtube" 
          // },
        ].map((Item, idx) => {
              return Item.isEmail ? (
 
                <button 
                  key={idx} 
                  onClick={handleCopyEmail}
                  className="group relative flex items-center justify-center text-[#7AABC3] hover:text-[#E7B95A] transition-all duration-300"
                >
                  <div className="group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                    {emailCopied ? (
                      <Check size={28} strokeWidth={3} className="text-green-400" />
                    ) : (
                      <Item.icon size={28} strokeWidth={1.5} />
                    )}
                  </div>

                  <span className={`absolute left-full ml-4 px-2 py-1 text-[#0C101C] text-xs font-bold rounded transition-all duration-300 pointer-events-none whitespace-nowrap
                    ${emailCopied ? 'bg-green-400 opacity-100 translate-x-0' : 'bg-[#E7B95A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
                  `}>
                    {emailCopied ? "Email Copied!" : Item.label}
                    <span className={`absolute top-1/2 -left-1 -translate-y-1/2 border-t-[4px] border-b-[4px] border-r-[4px] border-t-transparent border-b-transparent 
                      ${emailCopied ? 'border-r-green-400' : 'border-r-[#E7B95A]'}
                    `} />
                  </span>
                </button>
              ) : (

                <a 
                  key={idx} 
                  href={Item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center text-[#7AABC3] hover:text-[#E7B95A] transition-all duration-300"
                >
                  <div className="group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                    <Item.icon size={28} strokeWidth={1.5} />
                  </div>

                  <span className="absolute left-full ml-4 px-2 py-1 bg-[#E7B95A] text-[#0C101C] text-xs font-bold rounded opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    {Item.label}
                    <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-t-[4px] border-b-[4px] border-r-[4px] border-t-transparent border-b-transparent border-r-[#E7B95A]" />
                  </span>
                </a>
              );
            })}

        {/* Garis Bawah */}
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#7AABC3]/50 to-transparent"></div>
        
      </div>

      <main className="container mx-auto px-6 z-10 flex flex-col items-center text-center pt-10">
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-white drop-shadow-2xl mb-6 tracking-tight">
          IEEE <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] via-white to-[#A9D6E5]">
            SB UNRI
          </span>
        </h1>
        
        <h2 className="text-xl md:text-2xl text-[#7AABC3] font-light max-w-2xl mx-auto mb-4 drop-shadow-md">
          Institute of Electrical and Electronics Engineers <br />
          <span className="text-white font-medium">Universitas Riau Student Branch</span>
        </h2>

        <p className="text-lg italic text-gray-400 font-serif mb-10">
          &quot;Synergy Collaboration for Sustainable Technology&quot;
        </p>

      </main>

      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#7AABC3]"
        style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
      >
        <span className="text-[10px] tracking-widest uppercase font-bold opacity-70">Scroll Down</span>
        <ChevronDown size={32} className="animate-bounce" />
      </div>

    </div>
  );
}