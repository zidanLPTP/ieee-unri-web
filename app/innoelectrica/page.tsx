'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Check
} from 'lucide-react'

/* ======================================================
   COUNTDOWN
====================================================== */
const Countdown = () => {
  const target = new Date('2026-11-10T00:00:00').getTime()
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) return

      setTime({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60)
      })
    }

    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])

  return (
    <div className="flex gap-3 justify-center mt-10 flex-wrap">
      {Object.entries(time).map(([k, v]) => (
        <div key={k} className="relative">
          <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#3f80ef] to-[#ffc209] blur-md opacity-70" />
          <div className="relative bg-[#040a43]/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 min-w-[80px] text-center">
            <div className="text-3xl font-bold">{String(v).padStart(2, '0')}</div>
            <div className="text-xs uppercase tracking-widest text-[#ffc209]">
              {k}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ======================================================
   SMOOTH SCROLL
====================================================== */
const scrollToGallery = () => {
  document.getElementById('gallery')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

/* ======================================================
   GLASS NAVBAR
====================================================== */
const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="relative w-full max-w-6xl">
          <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-r from-[#3f80ef] via-[#ffc209] to-[#3f80ef] blur-sm opacity-60" />
          <div className="relative bg-[#040a43]/60 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
            <span className="font-bold tracking-wide">InnoElectrica26</span>

            <div className="hidden md:flex gap-6 text-sm">
              <button onClick={scrollToGallery} className="hover:text-[#ffc209]">
                Gallery
              </button>
              <button className="hover:text-[#ffc209]">
                Contact
              </button>
            </div>

            <button onClick={() => setOpen(!open)} className="md:hidden">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-28 left-4 right-4 z-40 bg-[#040a43]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <button
              onClick={() => {
                scrollToGallery()
                setOpen(false)
              }}
              className="block w-full py-3 text-left hover:text-[#ffc209]"
            >
              Gallery
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ======================================================
   FIREFLIES (DENSER + GLOWIER)
====================================================== */
const Fireflies = () => {
  const [flies, setFlies] = useState<any[]>([])

  useEffect(() => {
    setFlies(
      Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        x: Math.random() * 120 - 60,
        y: Math.random() * 180 - 90,
        dur: Math.random() * 12 + 8
      }))
    )
  }, [])

  return (
    <>
      {flies.map(f => (
        <div
          key={f.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: f.size,
            height: f.size,
            background: '#fff',
            top: `${f.top}%`,
            left: `${f.left}%`,
            boxShadow: `0 0 ${f.size * 10}px rgba(255,255,255,.9)`,
            animation: `fly ${f.dur}s ease-in-out infinite alternate`,
            ['--x' as any]: `${f.x}px`,
            ['--y' as any]: `${f.y}px`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fly {
          to {
            transform: translate(var(--x), var(--y));
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

/* ======================================================
   SHOOTING STARS (BRIGHTER)
====================================================== */
const ShootingStars = () => {
  const [stars, setStars] = useState<any[]>([])

  useEffect(() => {
    const spawn = () => {
      const s = {
        id: Math.random(),
        top: Math.random() * 40,
        left: Math.random() * 100
      }
      setStars(p => [...p, s])
      setTimeout(() => setStars(p => p.filter(x => x.id !== s.id)), 1500)
    }

    const i = setInterval(spawn, 2200)
    spawn()
    return () => clearInterval(i)
  }, [])

  return (
    <>
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute w-[2px] h-[2px] rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            boxShadow: '0 0 12px 5px rgba(255,255,255,.9)',
            animation: 'shoot 1.5s linear forwards'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes shoot {
          to {
            transform: translate(420px, 420px);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

/* ======================================================
   SWIPE GALLERY (SMOOTHER)
====================================================== */
const GalleryCarousel = () => {
  // Dot indicator sizing
  const DOT_SIZE = 8; // px
  const DOT_GAP = 12; // px

  const images = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    'https://images.unsplash.com/photo-1558403194-611308249627?w=800',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800'
  ];

  const [[index, direction], setIndex] = useState([0, 0]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevIndex, setPrevIndex] = useState(0);

  // Calculate visible items based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width >= 1536) setVisibleCount(5); // 2xl
      else if (width >= 1280) setVisibleCount(5); // xl
      else if (width >= 1024) setVisibleCount(4); // lg
      else if (width >= 768) setVisibleCount(3); // md
      else setVisibleCount(1); // mobile
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const paginate = (dir: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(([i]) => [(i + dir + images.length) % images.length, dir]);
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Calculate visible images based on current index
  const getVisibleImages = () => {
    const visible = [];
    const centerOffset = Math.floor(visibleCount / 2);

    for (let i = -centerOffset; i <= centerOffset; i++) {
      const imgIndex = (index + i + images.length) % images.length;
      visible.push({ imgIndex, position: i });
    }

    return visible;
  };

  const visibleImages = getVisibleImages();
  const centerPosition = 0;

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* DESKTOP & TABLET */}
      <div className="hidden md:flex justify-center items-center py-20 overflow-hidden relative">
        <div className="relative w-full max-w-6xl h-[520px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            {visibleImages.map(({ imgIndex, position }) => {
              const isCenter = position === 0;
              const distance = Math.abs(position);

              return (
                <motion.div
                  key={`${imgIndex}-${position}`}
                  custom={direction}
                  initial={{
                    x: position * 260 + (direction > 0 ? 420 : -420),
                    scale: 0.75,
                    opacity: 0,
                    filter: 'blur(12px)',
                  }}
                  animate={{
                    x: position * 260,
                    scale: isCenter ? 1 : 0.78,
                    opacity: isCenter ? 1 : 0.45,
                    filter: isCenter ? 'blur(0px)' : `blur(${Math.abs(position) * 3}px)`,
                    zIndex: isCenter ? 20 : 10 - Math.abs(position),
                  }}
                  exit={{
                    x: position * 260 + (direction > 0 ? -420 : 420),
                    scale: 0.72,
                    opacity: 0,
                    filter: 'blur(14px)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 240,
                    damping: 26,
                    mass: 0.9,
                  }}
                  className={`absolute rounded-3xl overflow-hidden
    bg-white/10 backdrop-blur-xl border border-white/15
    ${isCenter
                      ? 'w-80 h-[440px] lg:w-96 lg:h-[480px]'
                      : 'w-56 h-72 lg:w-64 lg:h-80'
                    }`}
                >

                  {/* OUTER GLOW (CENTER ONLY) */}
                  {isCenter && (
                    <motion.div
                      className="absolute -inset-[4px] rounded-3xl
                bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                blur-2xl opacity-70 -z-10"
                      animate={{
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* IMAGE */}
                  <img
                    src={images[imgIndex]}
                    alt={`Gallery image ${imgIndex + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* CENTER OVERLAY */}
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t
                from-black/70 via-black/10 to-transparent
                flex items-end p-6"
                    >
                      <div className="text-white">
                        <h3 className="text-xl font-bold">Featured Image</h3>
                        <p className="text-sm text-white/80">
                          Click arrows to explore
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>


      {/* MOBILE */}
      <div className="md:hidden relative h-[400px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction > 0 ? 300 : -300,
              scale: 0.9,
              rotateY: direction > 0 ? 20 : -20
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              rotateY: 0
            }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -300 : 300,
              scale: 0.9,
              rotateY: direction > 0 ? -20 : 20
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) paginate(1);
              if (info.offset.x > 80) paginate(-1);
            }}
            className="absolute w-[90%] h-[350px] rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/15"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* MOBILE OUTER GLOW */}
            <motion.div
              className="absolute -inset-[3px] rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-60 -z-10"
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            <img
              src={images[index]}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <h3 className="text-lg font-bold">Featured Image</h3>
                <p className="text-sm text-white/80">Swipe to explore</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NAV BUTTONS */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => paginate(-1)}
        disabled={isAnimating}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/15 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => paginate(1)}
        disabled={isAnimating}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/15 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </motion.button>

      <div className="flex justify-center gap-2 mt-8">
        {images.map((_, i) => {
          const isActive = i === index

          return (
            <motion.div
              key={i}
              className="h-2 rounded-full bg-white/30 overflow-hidden"
              animate={{
                width: isActive ? 32 : 8,
                backgroundColor: isActive
                  ? "rgba(168,85,247,1)"
                  : "rgba(255,255,255,0.3)",
              }}
              transition={{
                width: { duration: 0.35, ease: "easeInOut" },
                backgroundColor: { duration: 0.2 },
              }}
              onAnimationComplete={() => {
                if (isActive) setIsAnimating(false)
              }}
            />
          )
        })}
      </div>




      {/* IMAGE COUNTER */}
      <div className="text-center mt-6">
        <p className="text-white/60 text-sm">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};

/* ======================================================
   FULL FOOTER
====================================================== */
const Footer = () => {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText('ieee.sb@unri.ac.id')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer id="Contact" className="bg-[#05080f] text-gray-400 pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12 mb-16">

        <div>
          <h3 className="text-white font-bold mb-4">Visit Our Secretariat</h3>
          <iframe
            className="w-full h-56 rounded-2xl border border-white/10"
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d952.1692281297348!2d101.37660066407183!3d0.4830806454601319"
          />
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">IEEE SB UNRI</h3>
          <p className="text-sm leading-relaxed">
            Dekanat Fakultas Teknik lt. 2<br />
            University of Riau<br />
            Pekanbaru, Indonesia
          </p>

          <div className="flex gap-4 mt-6">
            <a href="https://www.linkedin.com/company/ieee-student-branch-universitas-riau" target="_blank"><Linkedin /></a>
            <a href="https://www.instagram.com/ieee.sb.unri" target="_blank"><Instagram /></a>
            <button onClick={copyEmail}>
              {copied ? <Check className="text-green-500" /> : <Mail />}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Contact</h3>
          <p className="flex gap-2"><MapPin /> Fakultas Teknik UNRI</p>
          <p className="flex gap-2"><Phone /> +62 831-8511-6094</p>
        </div>

      </div>

      <div className="border-t border-white/5 pt-6 flex justify-between items-center px-6 text-xs">
        <p>© 2026 IEEE Student Branch University of Riau</p>
      </div>
    </footer>
  )
}

/* ======================================================
   PAGE
====================================================== */
export default function Page() {
  return (
    <div className="bg-[#040a43] text-white min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0">
        <Fireflies />
        <ShootingStars />
      </div>

      <section className="min-h-screen flex items-center justify-center text-center relative z-10">
        <div>
          <h1 className="text-6xl md:text-8xl font-black mb-4">
            InnoElectrica 26
          </h1>
          <p className="text-xl text-gray-300">
            Sustainable Technology
          </p>
          <Countdown />
        </div>
      </section>

      <section id="gallery" className="py-32 relative z-10">
        <div className="text-center mb-16">
          <span className="uppercase tracking-widest text-sm text-[#ffc209] font-bold">
            Last Year Highlights
          </span>
        </div>
        <GalleryCarousel />
      </section>

      <Footer />
    </div>
  )
}
