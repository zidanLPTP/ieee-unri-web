'use client';

import React, { useState, useEffect, JSX } from 'react';
import { motion } from 'framer-motion';

export default function FireflyBackground() {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {

    const particleCount = 50;
    const colors = ['#E7B95A', '#7AABC3', '#FFFFFF'];

    const newParticles = Array.from({ length: particleCount }).map((_, i) => {

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
            x: [0, xOffset, 0],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: delay,
          }}
        />
      );
    });

    setParticles(newParticles);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[0] pointer-events-none overflow-hidden"
      aria-hidden
    >
      {particles}
    </div>
  );
}