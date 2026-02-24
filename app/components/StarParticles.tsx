"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  randomX: number;
}

interface StarParticlesProps {
  isActive: boolean;
}

export default function StarParticles({ isActive }: StarParticlesProps) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (isActive) {
      const newStars: Star[] = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          duration: Math.random() * 2 + 1,
          delay: Math.random() * 0.5,
          randomX: (Math.random() - 0.5) * 100,
        });
      }
      setStars(newStars);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: "#FFD700",
                boxShadow: "0 0 10px #FFD700, 0 0 20px #FFD700",
              }}
              initial={{
                scale: 0,
                opacity: 1,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
                y: [0, -100],
                x: [0, star.randomX],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

