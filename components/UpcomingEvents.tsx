'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react';
import { getPublicEvents } from '@/actions/landing-actions'; 

const divisionColors: Record<string, string> = {
  "Education": "#00E5FF",       
  "PR": "#D500F9",              
  "Creative": "#FF4081",        
  "Business": "#00E676",        
  "Membership": "#FFAB00",      
  "Secretariat": "#2979FF",      
};

const getDivisionKey = (dbName: string) => {
  if (!dbName) return "Secretariat"; // Default
  if (dbName.includes("Creative") || dbName.includes("ICM")) return "Creative";
  if (dbName.includes("Public") || dbName.includes("PR")) return "PR";
  if (dbName.includes("Business")) return "Business";
  if (dbName.includes("Membership")) return "Membership";
  if (dbName.includes("Education")) return "Education";
  if (dbName.includes("Secretariat")) return "Secretariat";
  return "Secretariat"; 
};

export default function UpcomingEvents() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbEvents = await getPublicEvents();
        
        const formattedEvents = dbEvents.map((e: any) => {
            const d = new Date(e.date); 
            return {
                id: e.id,
               
                division: getDivisionKey(e.category), 
                realDivisionName: e.category, 
                
                monthIndex: d.getMonth(), 
                year: d.getFullYear(),    
                date: d.getDate(),        
                
                title: e.title,
                category: "Event",
                type: e.locationName || "Onsite",
                
                speaker: e.category || "IEEE Team", 
                
                image: e.poster || "/placeholder-event.jpg", 
                desc: e.description
            };
        });

        setEventsList(formattedEvents);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth(); 
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(monthIndex, year);
  const firstDay = getFirstDayOfMonth(monthIndex, year);
  const emptyDays = Array(firstDay).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setViewDate(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, monthIndex + 1, 1));
  const goToToday = () => setViewDate(new Date());

  const getEventOnDate = (d: number) => {
    return eventsList.find(e => e.date === d && e.monthIndex === monthIndex && e.year === year);
  };

  return (
    <section id="events" className="relative py-32 bg-[#0C101C] text-white overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[#3386B7]/10 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent opacity-50" 
          animate={{ top: ['-20%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="relative flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AABC3] to-[#3386B7]">Calendar</span>
            </h2>
            <p className="text-gray-400">Explore our agenda and activities.</p>
          </div>
          
          <div className="flex items-center gap-3">
             {(monthIndex !== today.getMonth() || year !== today.getFullYear()) && (
                <button 
                  onClick={goToToday}
                  className="text-xs font-bold text-white bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition-colors animate-fade-in border border-white/20"
                >
                  Go to Today
                </button>
             )}

             <div className="flex items-center gap-4 bg-[#151b2b] p-2 rounded-full border border-white/10">
                <button onClick={prevMonth} className="p-3 rounded-full hover:bg-white/10 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-bold min-w-[140px] text-center">{monthName} {year}</span>
                <button onClick={nextMonth} className="p-3 rounded-full hover:bg-white/10 transition-colors">
                  <ChevronRight size={20} />
                </button>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch min-h-[500px]">

          <div className="lg:col-span-5 relative z-20"> 
            <motion.div 
              layout
              className="bg-[#151b2b] border border-white/5 rounded-3xl p-8 shadow-2xl h-full flex flex-col"
            >
              <div className="grid grid-cols-7 gap-3 mb-4 text-center border-b border-white/5 pb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-xs font-bold text-gray-500 uppercase tracking-widest">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3 text-center flex-grow content-start">
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                
                {daysArray.map((day) => {
                  const event = getEventOnDate(day);
                  const isSelected = selectedEvent?.date === day && selectedEvent?.monthIndex === monthIndex;
                  const color = event ? (divisionColors[event.division] || '#fff') : 'transparent';
                  
                  const isToday = 
                    day === today.getDate() && 
                    monthIndex === today.getMonth() && 
                    year === today.getFullYear();

                  return (
                    <motion.div 
                      key={day}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => event && setSelectedEvent(event)}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative transition-all
                        ${event ? 'cursor-pointer font-bold text-[#0C101C]' : 'cursor-default'}
                        ${!event && !isToday ? 'text-gray-500' : ''} 
                        ${isToday && !event ? 'text-white font-bold' : ''}
                      `}
                      style={{ 
                        backgroundColor: event ? color : (isToday ? 'rgba(255, 255, 255, 0.1)' : 'transparent'),
                        boxShadow: isSelected ? `0 0 20px ${color}` : 'none',
                        border: isSelected 
                          ? '2px solid white' 
                          : (isToday ? '1px solid white' : 'none')
                      }}
                    >
                      <span>{day}</span>
                      
                      {isToday && !event && !isSelected && (
                         <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                      )}

                      {!event && !isToday && (
                        <span className="absolute inset-0 rounded-lg hover:bg-white/5 transition-colors" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                 <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Department Color Code</p>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(divisionColors).map(([name, color]) => (
                            <div key={name} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                                <span className="text-[10px] text-gray-400">{name}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 relative z-20">
            <AnimatePresence mode='wait'>
              
              {selectedEvent ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden mb-6 border border-white/10 group">
                      <Image 
                        src={selectedEvent.image} 
                        alt={selectedEvent.title} 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C101C] via-[#0C101C]/50 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                         <span 
                            className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#0C101C] mb-3 inline-block"
                            style={{ backgroundColor: divisionColors[selectedEvent.division] || '#fff' }}
                         >
                            {selectedEvent.realDivisionName}
                         </span>
                         <h3 className="text-3xl font-bold text-white">{selectedEvent.title}</h3>
                      </div>
                  </div>

                  <div className="bg-[#151b2b] p-6 rounded-2xl border border-white/5 flex-grow">
                      <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap text-sm">{selectedEvent.desc}</p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-500 border border-white/10 overflow-hidden">
                             
                               {selectedEvent.speaker.charAt(0)}
                            </div>
                            <div>
                               <p className="text-[10px] uppercase text-gray-500 font-bold">Organizer / Speaker</p>
                               <p className="text-sm font-bold truncate">{selectedEvent.speaker}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#214664]/30 rounded-full flex items-center justify-center text-[#7AABC3] border border-[#7AABC3]/20">
                               <CalendarIcon size={18} />
                            </div>
                            <div>
                               <p className="text-[10px] uppercase text-gray-500 font-bold">Date</p>
                               <p className="text-sm font-bold">{selectedEvent.date} {monthName} {year}</p>
                            </div>
                         </div>
                      </div>
                  </div>
                </motion.div>

              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-[#151b2b] p-10 text-center relative overflow-hidden"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#3386B7] blur-[40px] opacity-20 rounded-full" />
                    <CalendarClock size={64} className="text-[#3386B7] relative z-10 opacity-80" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isLoading ? "Loading Events..." : "No Event Selected"}
                  </h3>
                  
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    {isLoading ? "Fetching data from server..." : "Select a highlighted date on the calendar to see details."}
                    <br/>
                    {!isLoading && (
                        <span className="text-white font-bold mt-2 block border-t border-white/10 pt-2 inline-block">
                        Today is {today.getDate()} {today.toLocaleString('default', { month: 'long' })}
                        </span>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}