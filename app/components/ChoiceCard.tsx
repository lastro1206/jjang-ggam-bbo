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
  isWinning?: boolean;
  onClick: () => void;
}

const choiceConfig = {
  scissors: {
    image: "/gawii.png",
    label: "가위",
    color: "#FF1744",
  },
  rock: {
    image: "/bawii.png",
    label: "바위",
    color: "#FF6F00",
  },
  paper: {
    image: "/bojagi.png",
    label: "보",
    color: "#FFD700",
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

  return (
    <GlitchEffect isActive={isLosing}>
      <motion.button
        onClick={onClick}
        disabled={isDisabled}
        className={`pixel-border relative overflow-hidden p-8 min-w-[200px] min-h-[280px] md:min-w-[240px] md:min-h-[320px] flex flex-col items-center justify-center gap-6 ${
          isDisabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          backgroundColor: config.color,
        }}
        initial={{ backgroundColor: config.color }}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        animate={{
          backgroundColor: config.color,
          ...(isSelected
            ? {
                boxShadow: `0 0 30px ${config.color}, 0 0 50px ${config.color}80`,
              }
            : {}),
        }}
        transition={{ duration: 0.2 }}>
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
