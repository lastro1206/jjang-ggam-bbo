"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GlitchEffect from "./GlitchEffect";

type Choice = "rock" | "paper" | "scissors";

interface ChoiceCardProps {
  choice: Choice;
  isSelected: boolean;
  isDisabled: boolean;
  isLosing: boolean;
  onClick: () => void;
}

const choiceConfig = {
  scissors: {
    image: "/gawii.png",
    label: "가위",
    color: "#FF6347",
  },
  rock: {
    image: "/bawii.png",
    label: "바위",
    color: "#8B4513",
  },
  paper: {
    image: "/bojagi.png",
    label: "보",
    color: "#4169E1",
  },
};

export default function ChoiceCard({
  choice,
  isSelected,
  isDisabled,
  isLosing,
  onClick,
}: ChoiceCardProps) {
  const config = choiceConfig[choice];

  // 색상의 어두운 버전 계산
  const darkerColor = config.color + "CC"; // 80% opacity

  return (
    <GlitchEffect isActive={isLosing}>
      <motion.button
        onClick={onClick}
        disabled={isDisabled}
        className={`pixel-border relative overflow-hidden p-8 min-w-[200px] min-h-[280px] md:min-w-[240px] md:min-h-[320px] flex flex-col items-center justify-center gap-6 transition-all ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:scale-105"
        } ${isLosing ? "grayscale" : ""}`}
        style={{
          background: `linear-gradient(to bottom, ${config.color}, ${darkerColor})`,
        }}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        animate={
          isSelected
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(255, 255, 255, 0.7)",
                  "0 0 20px 10px rgba(255, 255, 255, 0.5)",
                  "0 0 0 0 rgba(255, 255, 255, 0.7)",
                ],
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: isSelected ? Infinity : 0,
        }}>
        {/* 픽셀 캐릭터 스타일 배경 */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            )`,
          }}
        />

        <Image
          src={config.image}
          alt={config.label}
          width={128}
          height={128}
          unoptimized
          className='w-28 h-28 md:w-32 md:h-32 object-contain relative z-10 pixel-text'
          style={{ imageRendering: "pixelated" }}
        />
        <div
          className='text-xl md:text-2xl pixel-text relative z-10'
          style={{ color: "#FFFFFF" }}>
          {config.label}
        </div>
      </motion.button>
    </GlitchEffect>
  );
}
