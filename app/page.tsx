"use client";

import { useState, useRef, useEffect, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpaceBackground from "./components/SpaceBackground";
import CustomCursor from "./components/CustomCursor";
import StarParticles from "./components/StarParticles";
import { playGameSound, playBackgroundMusic } from "./utils/soundPaths";
import { LiaHandPaper, LiaHandRock, LiaHandScissors } from "react-icons/lia";

type Choice = "rock" | "paper" | "scissors";
type GameResult = "win" | "lose" | "draw";
type Result = GameResult | null;
type RewardType = "PLUS_ONE" | "PLUS_TWO" | "TIMES_TWO";

interface RouletteSector {
  rewardType: RewardType | null;
  displayLabel: string;
  resultText: string;
  color: string;
  angle: number;
}

const choices: Choice[] = ["rock", "paper", "scissors"];
const choiceIcons = {
  rock: <LiaHandRock />,
  paper: <LiaHandPaper />,
  scissors: <LiaHandScissors />,
};

function getComputerChoice(): Choice {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(player: Choice, computer: Choice): GameResult {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win";
  }
  return "lose";
}

const rewardTypes: RewardType[] = ["PLUS_ONE", "PLUS_TWO", "TIMES_TWO"];
const resultTexts = ["WIN", "LOSE", "DRAW"];
const sectorColors = ["#22C55E", "#EF4444", "#3B82F6", "#EAB308"];

function createRouletteSectors(): RouletteSector[] {
  const sectors: RouletteSector[] = [];
  let winIndex = 0;
  for (let i = 0; i < 12; i++) {
    const resultText = resultTexts[i % resultTexts.length];
    const color = sectorColors[i % sectorColors.length];
    let rewardType: RewardType | null = null;
    let displayLabel = "";
    if (resultText === "WIN") {
      const rt = rewardTypes[winIndex % rewardTypes.length];
      winIndex += 1;
      rewardType = rt;
      if (rt === "PLUS_ONE") displayLabel = "+1";
      else if (rt === "PLUS_TWO") displayLabel = "+2";
      else displayLabel = "x2";
    }
    sectors.push({
      rewardType,
      displayLabel,
      resultText,
      color,
      angle: (i * 360) / 12,
    });
  }
  return sectors;
}

const rouletteSectors = createRouletteSectors();
const topBannerText: string[] = Array(4).fill(
  "🎰 신규 가입 코인 3개 지급! 🎰 7시간 즉시 환전 가능! 🎰"
);
const bottomBannerText: string[] = Array(4).fill(
  "💰 라이브 배팅 실시간 중! 💰 승률 33% 보장! 💰 신입생 전용 혜택! 💰"
);

export default function Home() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [showParticles, setShowParticles] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState<string | null>(
    null
  );
  const [activeLedIndex, setActiveLedIndex] = useState<number | null>(null);
  const [coins, setCoins] = useState<number>(100);
  const rouletteRef = useRef<HTMLDivElement>(null);
  const randomRef = useRef<() => number>(() => Math.random());
  const ledTimerRef = useRef<number | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
      if (ledTimerRef.current) clearInterval(ledTimerRef.current);
    };
  }, []);

  const handleChoice = (choice: Choice) => {
    if (isSpinning || playerChoice !== null) return;

    // 버튼 클릭 시 BGM 시작 (이미 재생 중이면 재시작하지 않음)
    if (!backgroundMusicRef.current || backgroundMusicRef.current.paused) {
      backgroundMusicRef.current = playBackgroundMusic(1.0);
    }

    setPlayerChoice(choice);
    setIsSpinning(true);
    if (ledTimerRef.current) clearInterval(ledTimerRef.current);
    let step = 0;
    setActiveLedIndex(0);
    ledTimerRef.current = window.setInterval(() => {
      step = (step + 1) % 12;
      setActiveLedIndex(step);
    }, 80);
    const computer = getComputerChoice();
    const gameResult = getResult(choice, computer);
    setComputerChoice(computer);
    setResult(gameResult);
    const resultSectors = rouletteSectors.filter(
      (s) =>
        (gameResult === "win" && s.resultText === "WIN") ||
        (gameResult === "lose" && s.resultText === "LOSE") ||
        (gameResult === "draw" && s.resultText === "DRAW")
    );
    const randomIndex = Math.floor(randomRef.current() * resultSectors.length);
    const targetSector = resultSectors[randomIndex];
    const targetSectorIndex = rouletteSectors.findIndex(
      (s) => s === targetSector
    );
    setTimeout(() => {
      setIsSpinning(false);
      if (ledTimerRef.current) clearInterval(ledTimerRef.current);
      setActiveLedIndex(targetSectorIndex);
      setSelectedMultiplier(targetSector.displayLabel);
      if (gameResult === "win") {
        setCoins((prev) => {
          if (targetSector.rewardType === "PLUS_ONE") return prev + 1;
          if (targetSector.rewardType === "PLUS_TWO") return prev + 2;
          if (targetSector.rewardType === "TIMES_TWO") return prev * 2;
          return prev;
        });
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 3000);
      } else if (gameResult === "lose") {
        setCoins((prev) => Math.max(0, prev - 1));
      } else if (gameResult === "draw") {
        setTimeout(() => resetGame(), 2000);
      }
      if (gameResult) playGameSound(gameResult, 0.5);
    }, 1800);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setShowParticles(false);
    setSelectedMultiplier(null);
    setActiveLedIndex(null);
  };

  const getChoiceIcon = (choice: Choice | null): ReactElement | string =>
    choice ? choiceIcons[choice] : "";
  const getButtonColor = (choice: Choice): string =>
    choice === "rock" ? "#FF6F00" : choice === "paper" ? "#FFD700" : "#FF1744";

  return (
    <div className='relative min-h-screen w-full overflow-hidden flex flex-col justify-between'>
      <SpaceBackground />
      <CustomCursor />
      <StarParticles isActive={showParticles} />

      {/* TOP BANNER */}
      <motion.div
        className='relative z-30'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}>
        <div className='bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 pixel-border-b overflow-hidden flex'>
          <motion.div
            className='flex w-max whitespace-nowrap'
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            <div className='flex'>
              {[...topBannerText, ...topBannerText].map((text, i) => (
                <span
                  key={i}
                  className='text-sm md:text-base pixel-text text-white px-4 inline-block py-2'>
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* SIDE AD (LEFT) */}
      <motion.div
        className='absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}>
        <motion.div className='pixel-border bg-gradient-to-b from-yellow-500 via-yellow-400 to-yellow-500 p-4 shadow-2xl'>
          <div className='text-center'>
            <div className='text-2xl pixel-text text-red-600 mb-2'>
              🔥 특별 이벤트 🔥
            </div>
            <div className='text-xl pixel-text text-white mb-1'>
              아롬 인스타 팔로우 시
            </div>
            <div className='text-3xl pixel-text text-red-600 font-bold'>
              코인 2개 지급
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* MAIN CONTENT (CENTERED) */}
      <main className='relative z-10 flex flex-grow flex-col items-center justify-center p-4'>
        <div className='flex flex-col items-center w-full max-w-[600px] gap-8'>
          {/* RESULT AREA */}
          <div className='h-20 flex items-center justify-center'>
            <AnimatePresence mode='wait'>
              {result && !isSpinning && (
                <motion.div
                  key={result}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}>
                  <div
                    className='text-2xl md:text-4xl pixel-text text-center'
                    style={{
                      color:
                        result === "win"
                          ? "#00E5FF"
                          : result === "lose"
                          ? "#FF4444"
                          : "#FFFFFF",
                      textShadow:
                        result === "win"
                          ? "0 0 20px #00E5FF"
                          : result === "lose"
                          ? "0 0 20px #FF4444"
                          : "0 0 20px #FFFFFF",
                    }}>
                    {result === "win"
                      ? `WIN! Multiplier: ${selectedMultiplier}`
                      : result === "lose"
                      ? "LOSE"
                      : "DRAW"}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ROULETTE WHEEL */}
          <div className='relative scale-90 md:scale-100'>
            <div
              ref={rouletteRef}
              className='roulette-wheel'
              style={{ width: "450px", height: "450px", position: "relative" }}>
              <svg
                className='absolute inset-0'
                viewBox='0 0 300 300'
                style={{ transform: "rotate(-90deg)" }}>
                {rouletteSectors.map((sector, index) => {
                  const startAngle = sector.angle;
                  const endAngle = sector.angle + 30;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const isActive = activeLedIndex === index;
                  const pathData = [
                    `M 150 150`,
                    `L ${150 + 150 * Math.cos(startRad)} ${
                      150 + 150 * Math.sin(startRad)
                    }`,
                    `A 150 150 0 0 1 ${150 + 150 * Math.cos(endRad)} ${
                      150 + 150 * Math.sin(endRad)
                    }`,
                    "Z",
                  ].join(" ");
                  const textAngle = (startAngle + endAngle) / 2;
                  const tX = (r: number) =>
                    150 + r * Math.cos((textAngle * Math.PI) / 180);
                  const tY = (r: number) =>
                    150 + r * Math.sin((textAngle * Math.PI) / 180);

                  return (
                    <g key={index}>
                      <path
                        d={pathData}
                        fill={sector.color}
                        stroke={isActive ? "#00E5FF" : "#000"}
                        strokeWidth={isActive ? 6 : 2}
                        opacity={isActive ? 1 : 0.9}
                        style={{
                          filter: isActive
                            ? "brightness(1.4) drop-shadow(0 0 18px rgba(0,229,255,0.9))"
                            : "none",
                        }}
                      />
                      {sector.displayLabel && (
                        <text
                          x={tX(90)}
                          y={tY(90)}
                          textAnchor='middle'
                          dominantBaseline='middle'
                          fill={isActive ? "#FFF" : "#000"}
                          fontSize={isActive ? 30 : 24}
                          fontWeight='bold'
                          transform={`rotate(${textAngle + 90}, ${tX(90)}, ${tY(
                            90
                          )})`}>
                          {sector.displayLabel}
                        </text>
                      )}
                      <text
                        x={tX(120)}
                        y={tY(120)}
                        textAnchor='middle'
                        dominantBaseline='middle'
                        fill={isActive ? "#FFF" : "#000"}
                        fontSize={isActive ? 18 : 14}
                        fontWeight='bold'
                        transform={`rotate(${textAngle + 90}, ${tX(120)}, ${tY(
                          120
                        )})`}>
                        {sector.resultText}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div
                className='absolute inset-0 rounded-full border-[6px] border-[#4DA6FF] shadow-[0_0_45px_#4DA6FF]'
                style={{ pointerEvents: "none" }}
              />
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[225px] h-[225px] bg-[#0A0A0A] rounded-full border-[3px] border-[#00E5FF] shadow-[0_0_45px_rgba(0,229,255,0.5)] flex items-center justify-center'>
                <div className='pixel-text text-[#00E5FF] text-[96px] drop-shadow-[0_0_15px_#00E5FF] mb-4'>
                  {getChoiceIcon(playerChoice || computerChoice)}
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className='flex gap-6 justify-center'>
            {choices.map((choice) => (
              <motion.button
                key={choice}
                onClick={() => handleChoice(choice)}
                disabled={isSpinning || playerChoice !== null}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF",
                  border: "3px solid #00E5FF",
                  boxShadow: `0 0 20px ${getButtonColor(
                    choice
                  )}, 0 0 40px rgba(0, 229, 255, 0.5)`,
                  cursor:
                    isSpinning || playerChoice !== null
                      ? "not-allowed"
                      : "pointer",
                  opacity: isSpinning || playerChoice !== null ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#0F172A",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
                whileHover={
                  !isSpinning && playerChoice === null
                    ? {
                        scale: 1.1,
                        boxShadow: `0 0 30px ${getButtonColor(
                          choice
                        )}, 0 0 60px rgba(0, 229, 255, 0.8)`,
                      }
                    : {}
                }
                whileTap={
                  !isSpinning && playerChoice === null ? { scale: 0.95 } : {}
                }
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}>
                {getChoiceIcon(choice)}
              </motion.button>
            ))}
          </div>

          {/* RESET BUTTON */}
          <div className='h-14'>
            <AnimatePresence>
              {result && result !== "draw" && !isSpinning && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={resetGame}
                  className='px-6 py-3 pixel-border pixel-text text-white bg-blue-600 shadow-[0_0_20px_#00E5FF]'>
                  🔄 Play Again 🔄
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* SIDE AD (RIGHT) */}
      <motion.div
        className='absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block'
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}>
        <motion.div className='pixel-border bg-gradient-to-b from-red-600 via-red-500 to-red-600 p-4 shadow-2xl'>
          <div className='text-center'>
            <div className='text-xl pixel-text text-white mb-2'>
              ⚡ 긴급 공지 ⚡
            </div>
            <div className='text-lg pixel-text text-yellow-300 mb-1'>
              즉시 뽑기 7시간
            </div>
            <div className='text-2xl pixel-text text-white font-bold'>
              무제한 출금!
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM BANNER */}
      <motion.div
        className='relative z-30'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}>
        <div className='bg-gradient-to-r from-yellow-500 via-red-600 to-yellow-500 pixel-border-t overflow-hidden flex'>
          <motion.div
            className='flex w-max whitespace-nowrap'
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            <div className='flex'>
              {[...bottomBannerText, ...bottomBannerText].map((text, i) => (
                <span
                  key={i}
                  className='text-sm md:text-base pixel-text text-white px-4 inline-block py-2'>
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
