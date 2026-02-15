'use client';

import React, { useState, useEffect, Suspense } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Quote } from 'lucide-react';
import { getNewsById } from '@/actions/landing-actions';

export default function NewsDetailPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0C101C]" />}>
      <NewsContent />
    </Suspense>
  );
}

function NewsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); 
  
  const [news, setNews] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 40,
    restDelta: 0.001
  });

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const data = await getNewsById(Number(id));
        setNews(data);
      } catch (error) {
        console.error("Error fetching news", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const formatDate = (dateString: Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0C101C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#3386B7] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-xs animate-pulse tracking-widest uppercase">Loading Story...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[#0C101C] flex flex-col items-center justify-center text-white px-6 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4 text-[#E7B95A]">404</h1>
        <p className="text-gray-500 mb-8 text-sm">Story not found.</p>
        <Link 
          href="/"
          className="px-6 py-2 rounded-full border border-white/10 hover:border-[#E7B95A] hover:text-[#E7B95A] transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#0C101C] text-white relative font-sans selection:bg-[#E7B95A] selection:text-[#0C101C]">

      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#E7B95A] origin-left z-50"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 z-0 bg-[#0C101C]" />

      <div className="relative z-10 pt-24 md:pt-32 pb-20 container mx-auto px-6">
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 border-b border-white/5 pb-12">
            
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col">
                
                <div className="flex items-center gap-4 mb-6 text-xs font-medium text-gray-500">
                    <Link href="/#news" className="hover:text-[#E7B95A] transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> NEWS
                    </Link>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className="uppercase tracking-wider">{news.category || "General"}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span>{formatDate(news.date)}</span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white font-serif tracking-tight">
                    {news.title}
                </h1>

                <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden relative border border-white/10">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#151b2b] to-[#0C101C] text-gray-400 font-serif">
                            {news.author ? news.author.charAt(0) : "I"}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{news.author || "IEEE Team"}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Editor & Contributor</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
                <div className="relative w-full aspect-video lg:aspect-[16/9] rounded-xl overflow-hidden bg-[#151b2b] border border-white/5 shadow-2xl">
                    <Image
                        src={news.image || "/placeholder-news.jpg"}
                        alt={news.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                    />
                </div>
                <p className="mt-2 text-[10px] text-right text-gray-600 uppercase tracking-widest">
                    Fig 1.0 — Documentation
                </p>
            </div>

        </div>

        <div className="grid lg:grid-cols-12 gap-12">

            <div className="lg:col-span-8 lg:col-start-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    <div 
                        className="prose prose-lg prose-invert max-w-none
                        /* Styling yang sama seperti sebelumnya tetap ada disini */
                        [&>p:first-of-type]:text-xl [&>p:first-of-type]:leading-loose [&>p:first-of-type]:text-gray-300 [&>p:first-of-type]:font-serif [&>p:first-of-type]:mb-8
                        [&>p:first-of-type]:first-letter:text-4xl [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:text-[#E7B95A] [&>p:first-of-type]:first-letter:mr-2 [&>p:first-of-type]:first-letter:float-left
                        [&>blockquote]:border-l-2 [&>blockquote]:border-[#E7B95A] [&>blockquote]:pl-6 [&>blockquote]:py-1 [&>blockquote]:my-10 [&>blockquote]:italic [&>blockquote]:text-xl [&>blockquote]:text-gray-200 [&>blockquote]:font-serif
                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-4
                        [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-200 [&>h3]:mt-8 [&>h3]:mb-3
                        [&>p>a]:text-[#3386B7] [&>p>a]:underline [&>p>a]:decoration-1 [&>p>a]:underline-offset-4 hover:[&>p>a]:text-[#E7B95A] hover:[&>p>a]:no-underline
                        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:text-gray-400
                        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:text-gray-400
                        text-gray-400 leading-8 font-light
                        "
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center gap-6 justify-center text-center md:text-left">
                        <Quote className="text-[#3386B7] shrink-0 rotate-180 opacity-50" size={24} />
                        <p className="text-gray-500 italic text-sm font-serif max-w-lg">
                            "Innovation connects us. Keep building, keep learning."
                        </p>
                    </div>
                    
                </motion.div>
            </div>

        </div>

      </div>
    </article>
  );
}