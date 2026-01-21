'use client';

import React, { useState, useEffect, JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Newspaper, Zap, Hash, User, Loader2 } from 'lucide-react';
import { getPublicNews, getWritersCount } from '@/actions/landing-actions'; 
import Link from 'next/link';

export default function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [writersCount, setWritersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsData, totalWriters] = await Promise.all([
           getPublicNews(),
           getWritersCount()
        ]);
        
        setNews(newsData);
        setWritersCount(totalWriters);
      } catch (error) {
        console.error("Failed to load news section", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const colors = ['#E7B95A', '#7AABC3', '#FFFFFF'];
    const newParticles = Array.from({ length: 40 }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const yOffset = Math.random() * 100 - 50;
      const xOffset = Math.random() * 60 - 30;
      const delay = Math.random() * 5;

      return (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
              backgroundColor: color,
              width: size,
              height: size,
              top: `${top}%`,
              left: `${left}%`,
              boxShadow: `0 0 ${size * 2}px ${color}`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, yOffset, 0],
            x: [0, xOffset, 0]
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: delay
          }}
        />
      );
    });
    setParticles(newParticles);
  }, []);

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <section id="news" className="py-32 bg-[#0C101C] text-white overflow-hidden relative">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
          animate={{ top: ['-20%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="relative flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#E7B95A] font-bold tracking-[0.2em] uppercase text-sm block mb-3"
            >
              Insight & Updates
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold leading-tight"
            >
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#3386B7]">News</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 h-full relative group rounded-3xl overflow-hidden border border-white/5 bg-[#151b2b] flex flex-col justify-end z-20"
          >
            {!news[0] ? (

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#151b2b]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                    <Newspaper size={40} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-500 mb-2">{isLoading ? "Loading..." : "Headline Slot Empty"}</h3>
                <p className="text-gray-600 max-w-md">
                    {isLoading ? "Fetching latest news..." : "Waiting for the first major update from our divisions."}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3386B7]/20 to-transparent" />
              </div>
            ) : (
        
              <>
                  <Link href={`/news`} className="absolute inset-0 z-30" />
                  <Image 
                    src={news[0].image || "/placeholder-news.jpg"} 
                    alt={news[0].title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C] via-[#0C101C]/40 to-transparent" />
                  <div className="relative p-8 md:p-12">
                    <span className="inline-block px-3 py-1 mb-4 rounded-lg bg-[#E7B95A] text-[#0C101C] text-xs font-bold uppercase">
                      {news[0].category || "Featured"}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover:text-[#7AABC3] transition-colors line-clamp-3">
                      {news[0].title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-2"><User size={14}/> {news[0].author}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"/>
                        <span>{formatDate(news[0].date)}</span>
                    </div>
                  </div>
              </>
            )}
          </motion.div>

          <div className="lg:col-span-1 flex flex-col gap-6 h-full z-20"> 
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-1 rounded-3xl border border-white/5 bg-[#151b2b] relative overflow-hidden group hover:border-[#3386B7]/30 transition-colors p-6 flex flex-col justify-center"
            >
              {!news[1] ? (
            
                <div className="flex items-start gap-4 opacity-50">
                  <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0 animate-pulse" />
                  <div className="space-y-2 w-full">
                      <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              ) : (
            
                <div>
                    <Link href={`/news/${news[1].slug}`} className="absolute inset-0 z-30" />
                    <div className="flex items-center gap-2 text-[#7AABC3] text-xs font-bold uppercase mb-2">
                       <Zap size={12} /> {news[1].category || "Update"}
                    </div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-[#E7B95A] transition-colors line-clamp-2">
                        {news[1].title}
                    </h4>
                    <div className="text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: news[1].content.substring(0, 100) }} />
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1 rounded-3xl border border-white/5 bg-[#151b2b] relative overflow-hidden group hover:border-[#3386B7]/30 transition-colors p-6 flex flex-col justify-center"
            >
               {!news[2] ? (
              
                <div className="flex items-start gap-4 opacity-50">
                  <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0 animate-pulse" />
                  <div className="space-y-2 w-full">
                      <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              ) : (
             
                  <div>
                    <Link href={`/news/${news[2].slug}`} className="absolute inset-0 z-30" />
                    <div className="flex items-center gap-2 text-[#E7B95A] text-xs font-bold uppercase mb-2">
                       <Hash size={12} /> {news[2].category || "Community"}
                    </div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-[#E7B95A] transition-colors line-clamp-2">
                        {news[2].title}
                    </h4>
                    <div className="text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: news[2].content.substring(0, 100) }} />
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="h-24 rounded-3xl bg-gradient-to-r from-[#214664] to-[#151b2b] p-6 flex items-center justify-between border border-white/10"
            >
               <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Writers</p>
                  <p className="text-2xl font-bold text-white">
                      {isLoading ? "-" : writersCount} 
                      <span className="text-sm text-gray-500 font-normal ml-2">Contributors</span>
                  </p>
               </div>
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={20} className="text-[#7AABC3]" />
               </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}