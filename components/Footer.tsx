'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Mail, Youtube, MapPin, Phone, Lock, Check } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
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

  return (
    <footer id="Contact" className="bg-[#05080f] text-gray-400 border-t border-white/5 relative z-10 pt-20 pb-10 overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3386B7]/50 to-transparent" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#3386B7]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        
        <div className="grid lg:grid-cols-3 gap-12 mb-16 items-start">
          
          <div className="space-y-6 order-2 lg:order-1">
            <h3 className="text-white font-bold text-lg">Visit Our Secretariat</h3>
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-white/10 relative group shadow-lg hover:border-[#E7B95A]/50 transition-colors">
    
              <div className="absolute inset-0 bg-[#0C101C]/20 pointer-events-none z-10 group-hover:bg-transparent transition-colors duration-500" />
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d952.1692281297348!2d101.37660066407183!3d0.4830806454601319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5a9150d5cd463%3A0x69fb9da29539951d!2sDekanat%20Fakultas%20Teknik%20Universitas%20Riau!5e1!3m2!1sid!2sid!4v1768318989709!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="group-hover:filter-none transition-all duration-500"
              ></iframe>
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="flex items-center gap-2">
               <h2 className="text-2xl font-bold text-white tracking-tighter">
                 IEEE SB <span className="text-[#3386B7]">UNRI</span>
               </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Official Student Branch of IEEE at University of Riau. 
              Dedicated to advancing technology for humanity through research, innovation, and professional networking.
            </p>
            
            <div className="flex gap-4 pt-4">
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
                    icon: Phone,
                    href: "https://wa.me/6283185116094",
                    label: "WhatsApp"
                }
                // { 
                //     icon: Youtube, 
                //     href: "https://youtube.com/@ieeeunri",
                //     label: "Youtube" 
                // },
              ].map((Item, i) => {
                return Item.isEmail ? (
                    <button 
                        key={i} 
                        onClick={handleCopyEmail}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#E7B95A] hover:text-[#0C101C] hover:scale-110 transition-all duration-300 relative group"
                        title="Click to copy email"
                    >
                        {emailCopied ? (
                            <Check size={18} className="text-green-600 font-bold" />
                        ) : (
                            <Item.icon size={18} />
                        )}
                        
                        {emailCopied && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded font-bold whitespace-nowrap animate-fade-in-up">
                                Copied!
                            </span>
                        )}
                    </button>
                ) : (

                    <a 
                        key={i} 
                        href={Item.href} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#E7B95A] hover:text-[#0C101C] hover:scale-110 transition-all duration-300"
                        title={Item.label}
                    >
                        <Item.icon size={18} />
                    </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-6 order-3">
            <h3 className="text-white font-bold text-lg">Contact Information</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#3386B7]/10 flex items-center justify-center text-[#3386B7] group-hover:bg-[#E7B95A] group-hover:text-[#0C101C] transition-colors shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">
                  <strong>Secretariat:</strong><br />
                  Dekanat Fakultas Teknik lt 2,<br />
                  University of Riau,<br />
                  Simpang Baru, Pekanbaru.
                </span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#3386B7]/10 flex items-center justify-center text-[#3386B7] group-hover:bg-[#E7B95A] group-hover:text-[#0C101C] transition-colors shrink-0">
                  <Mail size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">ieee.sb@unri.ac.id</span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#3386B7]/10 flex items-center justify-center text-[#3386B7] group-hover:bg-[#E7B95A] group-hover:text-[#0C101C] transition-colors shrink-0">
                  <Phone size={16} />
                </div>
                <span className="group-hover:text-white transition-colors text-gray-600 italic">+62 831-8511-6094</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-xs text-gray-600">
            © {currentYear} IEEE Student Branch University of Riau. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {/* <Link href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Terms of Service</Link> */}
            
            <Link 
              href="/login" 
              className="text-gray-800 hover:text-[#E7B95A] transition-colors p-2"
              title="Member Area"
            >
              <Lock size={14} />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}