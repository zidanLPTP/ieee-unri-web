'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageIcon, X, ZoomIn, User, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPublicGallery } from '@/actions/landing-actions'; 
import Firefly from '@/components/FireflyBackground';

const getBentoClass = (index: number, page: number) => {
  const patternIndex = page % 3;
  const layouts = [
     ["md:col-span-2 md:row-span-2", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-2", "md:col-span-1 md:row-span-1", "md:col-span-2 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-2 md:row-span-1"],
     ["md:col-span-1 md:row-span-2", "md:col-span-2 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-2", "md:col-span-2 md:row-span-2", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-2 md:row-span-1"],
     ["md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-2 md:row-span-2", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-2", "md:col-span-1 md:row-span-1", "md:col-span-2 md:row-span-1", "md:col-span-1 md:row-span-1"]
  ];
  return layouts[patternIndex][index % 8] || "md:col-span-1 md:row-span-1";
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data, totalPages } = await getPublicGallery(page, 8);
      const formattedData = data.map((item: any) => ({
         ...item,
         date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      }));
      setGallery(formattedData);
      setTotalPages(totalPages);
      setIsLoading(false);
    }
    fetchData();
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) { setPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
  const handlePrev = () => {
    if (page > 1) { setPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C]">
      <Navbar />

      <Firefly />

      <main className="flex-1 w-full relative overflow-hidden">

         <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-6 text-center relative z-10">
            <h1 className="text-3xl md:text-6xl font-extrabold mb-3 md:mb-4">
               Captured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7B95A] to-[#F4D03F]">Moments</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
               A visual journey through our activities, teamwork, and unforgettable memories.
            </p>
         </section>

         <section className="px-4 md:px-8 pb-32 container mx-auto relative z-10">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 size={48} className="text-[#E7B95A] animate-spin mb-4" />
                  <p className="text-gray-400">Loading gallery...</p>
               </div>
            ) : gallery.length > 0 ? (
               <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[280px]">
                     {gallery.map((item, idx) => {
                        const spanClass = getBentoClass(idx, page);
                        return (
                           <motion.div 
                             key={item.id}
                             initial={{ opacity: 0, scale: 0.9 }}
                             whileInView={{ opacity: 1, scale: 1 }}
                             viewport={{ once: true }}
                             transition={{ duration: 0.4, delay: idx * 0.05 }}
                             className={`relative group rounded-3xl overflow-hidden bg-[#151b2b] border border-white/5 cursor-pointer shadow-lg ${spanClass}`}
                             onClick={() => setSelectedImage(item)}
                           >
                              <div className="relative w-full h-full">
                                 <Image 
                                    src={item.image || "/placeholder-gallery.jpg"} 
                                    alt={item.caption} 
                                    fill
                                    className="object-cover transition-transform duration-700 ease-in-out" 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                                       <ZoomIn className="text-white" size={24} />
                                    </div>
                                 </div>
                                 <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="inline-block bg-[#E7B95A] text-[#0C101C] text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-wide">
                                       {item.tag}
                                    </span>
                                    <p className="text-sm md:text-base font-bold text-white line-clamp-2 leading-tight mb-1 text-shadow-sm">
                                       {item.caption}
                                    </p>
                                    <p className="text-[10px] text-gray-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                       {item.date}
                                    </p>
                                 </div>
                              </div>
                           </motion.div>
                        );
                     })}
                  </div>

                  <div className="flex justify-center items-center gap-6 mt-16">
                     <button onClick={handlePrev} disabled={page === 1} className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm">
                        <ChevronLeft size={16} /> 
                     </button>
                     <span className="text-sm font-bold text-gray-500">
                        Page <span className="text-[#E7B95A] text-lg mx-1">{page}</span> of {totalPages || 1}
                     </span>
                     <button onClick={handleNext} disabled={page >= totalPages} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#E7B95A] text-[#0C101C] hover:bg-[#F4D03F] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-lg shadow-yellow-500/10">
                        Next <ChevronRight size={16} />
                     </button>
                  </div>
               </>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-[#151b2b]/30">
                  <ImageIcon size={48} className="text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Gallery is Empty</h3>
                  <p className="text-gray-500 text-sm">Upload some photos to fill this wall!</p>
               </div>
            )}
         </section>
      </main>

      <AnimatePresence>
         {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            >
               <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                  <X size={32} />
               </button>
               <div className="relative w-full max-w-5xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                  <div className="relative w-full h-[70vh] md:h-[80vh]">
                     <Image 
                       src={selectedImage.image || "/placeholder-gallery.jpg"} 
                       alt="Full View" 
                       fill 
                       className="object-contain" 
                     />
                  </div>
                  <div className="mt-4 text-center max-w-2xl">
                     <p className="text-lg md:text-xl font-bold text-white">{selectedImage.caption}</p>
                     <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-2">
                        <User size={14}/> {selectedImage.author} • {selectedImage.date}
                     </p>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}