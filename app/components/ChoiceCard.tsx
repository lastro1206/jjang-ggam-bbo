"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
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
    color: "#FF1744", // 더 밝은 빨강
  },
  rock: {
    image: "/bawii.png",
    label: "바위",
    color: "#FF6F00", // 금색 느낌의 주황
  },
  paper: {
    image: "/bojagi.png",
    label: "보",
    color: "#FFD700", // 금색
  },
};

export default function ChoiceCard({
  choice,
  isSelected,
  isDisabled,
  isLosing,
  isWinning = false,
  onClick,
}: ChoiceCardProps) {
  const config = choiceConfig[choice];
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 색상의 어두운 버전 계산
  const darkerColor = config.color + "CC"; // 80% opacity

  // isDisabled나 isLosing이 false로 변경되면 스타일 리셋
  useEffect(() => {
    if (buttonRef.current && !isDisabled && !isLosing) {
      buttonRef.current.style.background = `linear-gradient(135deg, ${config.color} 0%, ${darkerColor} 50%, ${config.color} 100%)`;
      buttonRef.current.style.filter = "none";
      buttonRef.current.style.opacity = "1";
    }
  }, [isDisabled, isLosing, config.color, darkerColor]);

  return (
    <GlitchEffect isActive={isLosing}>
      <motion.button
        ref={buttonRef}
        onClick={onClick}
        disabled={isDisabled}
        className={`pixel-border relative overflow-hidden p-8 min-w-[200px] min-h-[280px] md:min-w-[240px] md:min-h-[320px] flex flex-col items-center justify-center gap-6 ${
          isDisabled && !isWinning
            ? "opacity-50 cursor-not-allowed"
            : isDisabled && isWinning
            ? "cursor-not-allowed"
            : "cursor-pointer"
        } ${isLosing ? "grayscale" : ""}`}
        style={{
          background: `linear-gradient(135deg, ${config.color} 0%, ${darkerColor} 50%, ${config.color} 100%)`,
          backgroundSize: "200% 200%",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.currentTarget.style.background = `linear-gradient(135deg, ${config.color} 0%, ${darkerColor} 50%, ${config.color} 100%)`;
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, ${config.color} 0%, ${darkerColor} 50%, ${config.color} 100%)`;
        }}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        animate={
          isSelected
            ? {
                boxShadow: `0 0 30px ${config.color}, 0 0 50px ${config.color}80`,
              }
            : {}
        }
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
