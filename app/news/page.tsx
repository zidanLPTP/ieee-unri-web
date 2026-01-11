'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Coffee, ChevronLeft, ChevronRight, Calendar, User, X, Clock, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getPublicNewsPaginated } from '@/actions/landing-actions'; 

export default function NewsPage() {

  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null); 

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 8;

  // FETCH DATA
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data, totalPages } = await getPublicNewsPaginated(currentPage, itemsPerPage);
        
        const formattedArticles = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            cover: item.image || null, 
            author: item.author,
            category: item.category,
            date: new Date(item.date).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            }),
            readTime: Math.ceil(item.content.split(' ').length / 200) + ' min read'
        }));

        setArticles(formattedArticles);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentPage]);

  const hasArticles = articles.length > 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  return (
    <main className="min-h-screen bg-[#0C101C] text-white">
      <Navbar />
      
      <section className="pt-40 pb-16 px-6 container mx-auto relative">

         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E7B95A]/5 rounded-full blur-[150px] pointer-events-none" />

         <div className="text-center max-w-3xl mx-auto relative z-10">
           
           <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"> 
             News <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#E7B95A]">&
              Updates</span>
           </h1>
           <p className="text-gray-400 text-lg">
             Stay informed about our activities, achievements, and organizational announcements.
           </p>
        </div>

      </section>

      <section className="pb-20 px-6 container mx-auto min-h-[500px]">
        
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 size={48} className="text-[#3386B7] animate-spin mb-4" />
               <p className="text-gray-400">Loading articles...</p>
            </div>
        ) : !hasArticles ? (
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-3xl border border-dashed border-white/10 bg-[#151b2b]/20 flex flex-col items-center justify-center text-center p-12 md:p-24 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3386B7]/5 to-transparent opacity-50 pointer-events-none" />
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-[#151b2b] border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative">
                   <PenTool size={32} className="text-[#E7B95A]" />
                   <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#3386B7] flex items-center justify-center border-4 border-[#0C101C]">
                      <Coffee size={14} className="text-white" />
                   </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Our Editors are Typing...</h3>
                <p className="text-gray-400 max-w-md leading-relaxed mb-8">
                  We are currently curating the best stories and tech insights for you. 
                  The first edition of our digital journal will be published here soon.
                </p>
             </div>
          </motion.div>
        ) : (

          <div className="max-w-5xl mx-auto">
             <div className="grid gap-8">
               {articles.map((article: any, index: number) => (
                 <motion.article 
                   key={article.id || index}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   className="flex flex-col md:flex-row gap-6 bg-[#151b2b] border border-white/5 p-6 rounded-3xl hover:border-[#3386B7]/30 transition-all group cursor-pointer"
 
                   onClick={() => setSelectedArticle(article)}
                 >

                    <div className="w-full md:w-64 h-48 bg-gray-800 rounded-2xl overflow-hidden relative shrink-0">
                       {article.cover ? (
                          <Image src={article.cover} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                       ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-[#0C101C]">
                             <PenTool size={24} className="opacity-20"/>
                          </div>
                       )}
                    </div>

                    <div className="flex flex-col justify-center flex-grow">
                       <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1 text-[#E7B95A] font-bold uppercase"><Calendar size={12}/> {article.date}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600"/>
                          <span className="flex items-center gap-1"><User size={12}/> {article.author}</span>
                       </div>
                       
                       <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#3386B7] transition-colors line-clamp-2">
                         {article.title}
                       </h3>
                       
                       <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                         {article.content.replace(/<[^>]*>?/gm, '')} 
                       </p>

                       <button className="text-[#7AABC3] text-sm font-bold flex items-center gap-2 hover:text-white transition-colors self-start">
                         Read Article <ChevronRight size={14} />
                       </button>
                    </div>
                 </motion.article>
               ))}
             </div>

             <div className="flex justify-between items-center mt-16 border-t border-white/5 pt-8">
                <button 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 font-bold transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-600' : 'text-white hover:bg-white hover:text-[#0C101C]'}`}
                >
                  <ChevronLeft size={18} /> Previous
                </button>

                <span className="text-gray-500 text-sm font-mono">
                  Page {currentPage} of {totalPages}
                </span>

                <button 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 font-bold transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray-600' : 'text-white hover:bg-white hover:text-[#0C101C]'}`}
                >
                  Next <ChevronRight size={18} />
                </button>
             </div>
          </div>
        )}

      </section>

      <AnimatePresence>
        {selectedArticle && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setSelectedArticle(null)}
             className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
           >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#151b2b] w-full max-w-3xl h-[90vh] md:h-auto md:max-h-[90vh] rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl flex flex-col"
              >
   
                 <button 
                   onClick={() => setSelectedArticle(null)}
                   className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-[#E7B95A] hover:text-black transition-colors z-20 border border-white/10"
                 >
                    <X size={20} />
                 </button>

                 <div className="relative h-64 md:h-80 w-full shrink-0">
                    {selectedArticle.cover ? (
                       <Image src={selectedArticle.cover} alt={selectedArticle.title} fill className="object-cover" />
                    ) : (
                       <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image Available</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151b2b] to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 md:left-10">
                        {selectedArticle.category && (
                          <span className="px-3 py-1 rounded-full bg-[#E7B95A] text-[#0C101C] text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                             {selectedArticle.category.replace('-', ' ')}
                          </span>
                        )}
                        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight shadow-sm drop-shadow-md pr-10">
                          {selectedArticle.title}
                        </h2>
                    </div>
                 </div>


                 <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">

                    <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-white/5 pb-6 text-sm text-gray-400">
                       <span className="flex items-center gap-2"><User size={16} className="text-[#E7B95A]"/> {selectedArticle.author}</span>
                       <span className="flex items-center gap-2"><Calendar size={16} className="text-[#E7B95A]"/> {selectedArticle.date}</span>
                       <span className="flex items-center gap-2"><Clock size={16} className="text-[#E7B95A]"/> {selectedArticle.readTime}</span>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none">
                       {selectedArticle.content.split('\n').map((paragraph: string, idx: number) => (
                          <p key={idx} className="text-gray-300 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                       ))}
                    </div>
                 </div>

              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}