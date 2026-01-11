'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageIcon, X, ZoomIn, User, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPublicGallery } from '@/actions/landing-actions'; 

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
         date: new Date(item.date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
         })
      }));

      setGallery(formattedData);
      setTotalPages(totalPages);
      setIsLoading(false);
    }

    fetchData();
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) {
       setPage(prev => prev + 1);
       window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  const handlePrev = () => {
    if (page > 1) {
       setPage(prev => prev - 1);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#0C101C] text-white selection:bg-[#E7B95A] selection:text-[#0C101C]">
      <Navbar />

      <section className="pt-32 pb-12 px-6 text-center">
         <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Captured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7B95A] to-[#F4D03F]">Moments</span>
         </h1>
         <p className="text-gray-400 max-w-xl mx-auto">
            A visual journey through our activities, teamwork, and unforgettable memories.
         </p>
      </section>

      <section className="px-4 md:px-8 pb-32 container mx-auto">
         
         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 size={48} className="text-[#E7B95A] animate-spin mb-4" />
               <p className="text-gray-400">Loading gallery...</p>
            </div>
         ) : gallery.length > 0 ? (
            <>
               <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {gallery.map((item, idx) => (
                     <motion.div 
                       key={item.id}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.05 }}
                       className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-[#151b2b] border border-white/5 mb-4 cursor-pointer"
                       onClick={() => setSelectedImage(item)}
                     >

                        <div className="relative w-full">
                           <img 
                              src={item.image || "/placeholder-gallery.jpg"} 
                              alt={item.caption} 
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                              loading="lazy"
                           />
                           
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="text-white" size={32} />
                           </div>
                        </div>

                        <div className="p-4 bg-[#151b2b]">
                           <p className="text-sm font-bold text-white line-clamp-2 leading-snug">
                              {item.caption}
                           </p>
                           <div className="flex justify-between items-center mt-3 text-[10px] text-gray-500 uppercase tracking-wider">
                              <span className="bg-white/5 px-2 py-1 rounded">{item.tag}</span>
                              <span>{item.date}</span>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>

               <div className="flex justify-center items-center gap-6 mt-16">
                  <button 
                     onClick={handlePrev}
                     disabled={page === 1}
                     className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm"
                  >
                     <ChevronLeft size={16} /> 
                  </button>
                  
                  <span className="text-sm font-bold text-gray-500">
                     Page <span className="text-[#E7B95A] text-lg mx-1">{page}</span> of {totalPages || 1}
                  </span>

                  <button 
                     onClick={handleNext}
                     disabled={page >= totalPages}
                     className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#E7B95A] text-[#0C101C] hover:bg-[#F4D03F] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-lg shadow-yellow-500/10"
                  >
                     Next <ChevronRight size={16} />
                  </button>
               </div>
            </>
         ) : (

            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-[#151b2b]/30">
               <ImageIcon size={48} className="text-gray-600 mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">Gallery is Empty</h3>
               <p className="text-gray-500 text-sm">Upload some photos via Admin Panel to fill this wall!</p>
            </div>
         )}
      </section>

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
    </main>
  );
}