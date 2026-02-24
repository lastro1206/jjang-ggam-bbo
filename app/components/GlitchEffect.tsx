"use client";

import { motion } from "framer-motion";

interface GlitchEffectProps {
  children: React.ReactNode;
  isActive: boolean;
}

export default function GlitchEffect({ children, isActive }: GlitchEffectProps) {
  return (
    <motion.div
      className={isActive ? "glitch-effect" : ""}
      animate={
        isActive
          ? {
              filter: [
                "grayscale(100%) contrast(150%)",
                "grayscale(100%) contrast(200%) hue-rotate(90deg)",
                "grayscale(100%) contrast(150%) hue-rotate(180deg)",
                "grayscale(100%) contrast(200%) hue-rotate(270deg)",
                "grayscale(100%) contrast(150%)",
              ],
              x: [0, -2, 2, -2, 2, 0],
              y: [0, 2, -2, 2, -2, 0],
            }
          : {}
      }
      transition={{
        duration: 0.3,
        repeat: isActive ? Infinity : 0,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
}

