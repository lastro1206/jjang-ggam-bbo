"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";
import SpaceBackground from "./components/SpaceBackground";
import CustomCursor from "./components/CustomCursor";
import StarParticles from "./components/StarParticles";
import { playGameSound } from "./utils/sound";
import { LiaHandPaper, LiaHandRock, LiaHandScissors } from "react-icons/lia";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw" | null;
type RewardType = "PLUS_ONE" | "PLUS_TWO" | "TIMES_TWO";

const choices: Choice[] = ["rock", "paper", "scissors"];

const choiceIcons = {
  rock: <LiaHandRock />,
  paper: <LiaHandPaper />,
  scissors: <LiaHandScissors />,
};

function getComputerChoice(): Choice {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(player: Choice, computer: Choice): Result {
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

// 룰렛 섹터 데이터 생성 (12개 섹터)
const rewardTypes: RewardType[] = ["PLUS_ONE", "PLUS_TWO", "TIMES_TWO"];
const resultTexts = ["WIN", "LOSE", "DRAW"];
const sectorColors = ["#22C55E", "#EF4444", "#3B82F6", "#EAB308"]; // 초록, 빨강, 파랑, 노랑

function createRouletteSectors() {
  const sectors: Array<{
    rewardType: RewardType | null;
    displayLabel: string;
    resultText: string;
    color: string;
    angle: number;
  }> = [];

  // WIN 섹터에만 +1, +2, x2를 순환 배치하기 위한 카운터
  let winIndex = 0;

  // 12개 섹터 생성
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

// 컴포넌트 외부에서 한 번만 생성
const rouletteSectors = createRouletteSectors();

const topBannerText = Array(4).fill(
  "🎰 신규 가입 코인 3개 지급! 🎰 7시간 즉시 환전 가능! 🎰"
);
const bottomBannerText = Array(4).fill(
  "💰 라이브 배팅 실시간 중! 💰 승률 33% 보장! 💰 신입생 전용 혜택! 💰"
);

export default function Home() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [rouletteRotation, setRouletteRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState<string | null>(
    null
  );
  const [currentSector, setCurrentSector] = useState<number | null>(null);
  const [activeLedIndex, setActiveLedIndex] = useState<number | null>(null);
  const [coins, setCoins] = useState(100);
  const rouletteRef = useRef<HTMLDivElement>(null);
  const randomRef = useRef(() => Math.random());
  const ledTimerRef = useRef<number | null>(null);

  // 컴포넌트 언마운트 시 LED 타이머 정리
  useEffect(() => {
    return () => {
      if (ledTimerRef.current) {
        clearInterval(ledTimerRef.current);
        ledTimerRef.current = null;
      }
    };
  }, []);

  const handleChoice = (choice: Choice) => {
    if (isSpinning || playerChoice !== null) return;

    setPlayerChoice(choice);
    setIsSpinning(true);

    // LED 러너 시작: 섹터를 따라 LED가 도는 느낌
    if (ledTimerRef.current) {
      clearInterval(ledTimerRef.current);
      ledTimerRef.current = null;
    }
    let step = 0;
    setActiveLedIndex(0);
    ledTimerRef.current = window.setInterval(() => {
      step = (step + 1) % 12;
      setActiveLedIndex(step);
    }, 80);

    // 컴퓨터 선택 및 결과 계산
    const computer = getComputerChoice();
    const gameResult = getResult(choice, computer);

    setComputerChoice(computer);
    setResult(gameResult);

    // 룰렛 스핀 애니메이션
    // 결과에 맞는 섹터 찾기
    const resultSectors = rouletteSectors.filter(
      (s) =>
        (gameResult === "win" && s.resultText === "WIN") ||
        (gameResult === "lose" && s.resultText === "LOSE") ||
        (gameResult === "draw" && s.resultText === "DRAW")
    );

    // 랜덤으로 결과 섹터 중 하나 선택
    const randomIndex = Math.floor(randomRef.current() * resultSectors.length);
    const targetSector = resultSectors[randomIndex];
    const targetSectorIndex = rouletteSectors.findIndex(
      (s) => s === targetSector
    );

    // 회전 각도 계산 (여러 바퀴 + 목표 섹터로)
    const baseRotation = 360 * 4; // 4바퀴
    const sectorAngle = 360 / 12; // 섹터당 각도
    const targetAngle = targetSector.angle + sectorAngle / 2; // 섹터 중앙
    const finalRotation = baseRotation + (360 - targetAngle);

    setRouletteRotation((prev) => prev + finalRotation);

    // 스핀 완료 후 처리
    setTimeout(() => {
      // 스핀 애니메이션이 끝난 뒤에만 결과 섹터를 강조
      setIsSpinning(false);

      // LED 러너 정지 후 결과 섹터에 고정
      if (ledTimerRef.current) {
        clearInterval(ledTimerRef.current);
        ledTimerRef.current = null;
      }
      setActiveLedIndex(targetSectorIndex);
      setCurrentSector(targetSectorIndex);
      setSelectedMultiplier(targetSector.displayLabel);

      // 코인 계산 (이겼을 때만 +1, +2, x2 적용)
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
        // 비겼을 때는 자동으로 게임 리셋
        setTimeout(() => {
          resetGame();
        }, 2000); // 결과를 2초간 보여준 후 리셋
      }

      if (gameResult) {
        playGameSound(gameResult, 0.5);
      }
    }, 1800);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setShowParticles(false);
    setSelectedMultiplier(null);
    setCurrentSector(null);
    setActiveLedIndex(null);
  };

  // useEffect에서 사운드 재생은 handleChoice에서 이미 처리하므로 제거

  const getChoiceIcon = (choice: Choice | null) => {
    if (!choice) return "";
    return choiceIcons[choice];
  };

  const getButtonColor = (choice: Choice) => {
    if (choice === "rock") return "#FF6F00"; // 오렌지
    if (choice === "paper") return "#FFD700"; // 노랑
    return "#FF1744"; // 빨강
  };

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <SpaceBackground />
      <CustomCursor />
      <StarParticles isActive={showParticles} />

      <motion.div
        className='absolute top-0 left-0 right-0 z-30 overflow-hidden'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className='bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 pixel-border-b overflow-hidden flex'>
          <motion.div
            className='flex w-max whitespace-nowrap'
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            <div className='flex'>
              {topBannerText.map((text, i) => (
                <span
                  key={`top-1-${i}`}
                  className='text-sm md:text-base pixel-text text-white px-4 inline-block'>
                  {text}
                </span>
              ))}
            </div>
            <div className='flex'>
              {topBannerText.map((text, i) => (
                <span
                  key={`top-2-${i}`}
                  className='text-sm md:text-base pixel-text text-white px-4 inline-block'>
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className='absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:block'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <motion.div
          className='pixel-border bg-gradient-to-b from-yellow-500 via-yellow-400 to-yellow-500 p-4'
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 215, 0, 0.6)",
              "0 0 40px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.6)",
              "0 0 20px rgba(255, 215, 0, 0.6)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
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
            <div className='text-sm pixel-text text-white mt-2'>지금 바로!</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className='absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:block'
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <motion.div
          className='pixel-border bg-gradient-to-b from-red-600 via-red-500 to-red-600 p-4'
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 0, 0, 0.6)",
              "0 0 40px rgba(255, 0, 0, 0.9), 0 0 60px rgba(255, 0, 0, 0.6)",
              "0 0 20px rgba(255, 0, 0, 0.6)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          <div className='text-center'>
            <div className='text-xl pixel-text text-white mb-2'>
              ⚡ 긴급 공지 ⚡
            </div>
            <div className='text-lg pixel-text text-yellow-300 mb-1'>
              즉시 뽑기
            </div>
            <div className='text-2xl pixel-text text-white font-bold'>
              7시간
            </div>
            <div className='text-sm pixel-text text-yellow-300 mt-2'>
              무제한 출금!
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className='absolute bottom-0 left-0 right-0 z-30 overflow-hidden'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <div className='bg-gradient-to-r from-yellow-500 via-red-600 to-yellow-500 pixel-border-t overflow-hidden flex'>
          <motion.div
            className='flex w-max whitespace-nowrap'
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            <div className='flex'>
              {bottomBannerText.map((text, i) => (
                <span
                  key={`bot-1-${i}`}
                  className='text-sm md:text-base pixel-text text-white px-4 inline-block'>
                  {text}
                </span>
              ))}
            </div>
            <div className='flex'>
              {bottomBannerText.map((text, i) => (
                <span
                  key={`bot-2-${i}`}
                  className='text-sm md:text-base pixel-text text-white px-4 inline-block'>
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <main
        className='relative z-10 flex flex-col items-center justify-center'
        style={{
          minHeight: "100vh",
          paddingTop: "120px",
          paddingBottom: "80px",
          paddingLeft: "16px",
          paddingRight: "16px",
          boxSizing: "border-box",
        }}>
        {/* 결과 텍스트 */}
        <AnimatePresence mode='wait'>
          {result && !isSpinning && (
            <motion.div
              key={result}
              className='text-center'
              style={{ marginBottom: "32px" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}>
              {result === "win" && (
                <motion.div
                  className='text-2xl md:text-4xl pixel-text'
                  style={{ color: "#00E5FF" }}
                  animate={{
                    scale: [1, 1.2, 1],
                    textShadow: [
                      "0 0 20px #00E5FF, 0 0 40px #00E5FF",
                      "0 0 50px #00E5FF, 0 0 80px #00E5FF",
                      "0 0 20px #00E5FF, 0 0 40px #00E5FF",
                    ],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  WIN! Multiplier: {selectedMultiplier}
                </motion.div>
              )}
              {result === "lose" && (
                <motion.div
                  className='text-2xl md:text-4xl pixel-text'
                  style={{ color: "#FF4444" }}
                  animate={{
                    opacity: [1, 0.5, 1],
                    textShadow: [
                      "0 0 20px #FF4444, 0 0 40px #FF4444",
                      "0 0 50px #FF4444, 0 0 80px #FF4444",
                      "0 0 20px #FF4444, 0 0 40px #FF4444",
                    ],
                  }}
                  transition={{ duration: 0.4, repeat: Infinity }}>
                  LOSE
                </motion.div>
              )}
              {result === "draw" && (
                <motion.div
                  className='text-2xl md:text-4xl pixel-text'
                  style={{ color: "#FFFFFF" }}
                  animate={{
                    textShadow: [
                      "0 0 10px #FFFFFF",
                      "0 0 30px #FFFFFF, 0 0 50px #FFFFFF",
                      "0 0 10px #FFFFFF",
                    ],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                  }}>
                  DRAW
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 룰렛 휠 */}
        <div
          className='relative'
          style={{ marginBottom: "48px" }}>
          <div
            ref={rouletteRef}
            className='roulette-wheel'
            style={{
              width: "450px",
              height: "450px",
              position: "relative",
            }}>
            {/* 바깥 링 - 12개 섹터 */}
            <svg
              className='absolute inset-0'
              viewBox='0 0 300 300'
              style={{ transform: "rotate(-90deg)" }}>
              {rouletteSectors.map((sector, index) => {
                const startAngle = sector.angle;
                const endAngle = sector.angle + 360 / 12;
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;
                const radius = 150;
                const centerX = 150;
                const centerY = 150;

                const x1 = centerX + radius * Math.cos(startAngleRad);
                const y1 = centerY + radius * Math.sin(startAngleRad);
                const x2 = centerX + radius * Math.cos(endAngleRad);
                const y2 = centerY + radius * Math.sin(endAngleRad);

                const largeArcFlag = 360 / 12 > 180 ? 1 : 0;

                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  "Z",
                ].join(" ");

                const textAngle = (startAngle + endAngle) / 2;
                const textRadius = radius * 0.6;
                const textX =
                  centerX + textRadius * Math.cos((textAngle * Math.PI) / 180);
                const textY =
                  centerY + textRadius * Math.sin((textAngle * Math.PI) / 180);

                const resultTextRadius = radius * 0.8;
                const resultTextX =
                  centerX +
                  resultTextRadius * Math.cos((textAngle * Math.PI) / 180);
                const resultTextY =
                  centerY +
                  resultTextRadius * Math.sin((textAngle * Math.PI) / 180);

                // LED 하이라이트는 activeLedIndex 기준으로 회전 중에도 움직이고,
                // currentSector는 최종 결과 섹터를 의미
                const isActive = activeLedIndex === index;

                return (
                  <g key={index}>
                    <path
                      d={pathData}
                      fill={sector.color}
                      stroke={isActive ? "#00E5FF" : "#000000"}
                      strokeWidth={isActive ? 6 : 2}
                      opacity={isActive ? 1 : 0.9}
                      style={{
                        filter: isActive
                          ? "brightness(1.4) drop-shadow(0 0 18px rgba(0,229,255,0.9))"
                          : "none",
                      }}
                    />
                    {/* 배수 / 보상 텍스트 (WIN 섹터만) */}
                    {sector.displayLabel && (
                      <text
                        x={textX}
                        y={textY}
                        textAnchor='middle'
                        dominantBaseline='middle'
                        fill={isActive ? "#FFFFFF" : "#000000"}
                        fontSize={isActive ? 30 : 24}
                        fontWeight='bold'
                        transform={`rotate(${
                          textAngle + 90
                        }, ${textX}, ${textY})`}>
                        <tspan
                          style={{
                            textShadow: isActive
                              ? "0 0 8px rgba(0,229,255,1)"
                              : "1px 1px 2px rgba(255,255,255,0.8)",
                          }}>
                          {sector.displayLabel}
                        </tspan>
                      </text>
                    )}
                    {/* 결과 텍스트 (WIN / LOSE / DRAW 모두) */}
                    <text
                      x={resultTextX}
                      y={resultTextY}
                      textAnchor='middle'
                      dominantBaseline='middle'
                      fill={isActive ? "#FFFFFF" : "#000000"}
                      fontSize={isActive ? 18 : 14}
                      fontWeight='bold'
                      opacity={isActive ? 1 : 0.9}
                      transform={`rotate(${
                        textAngle + 90
                      }, ${resultTextX}, ${resultTextY})`}>
                      <tspan
                        style={{
                          textShadow: isActive
                            ? "0 0 6px rgba(0,229,255,1)"
                            : "1px 1px 2px rgba(255,255,255,0.8)",
                          letterSpacing: "0.08em",
                        }}>
                        {sector.resultText}
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* 룰렛 테두리 글로우 */}
            <div
              className='absolute inset-0 rounded-full'
              style={{
                border: "6px solid #4DA6FF",
                boxShadow: "0 0 45px #4DA6FF, 0 0 90px rgba(77, 166, 255, 0.4)",
                pointerEvents: "none",
              }}
            />

            {/* 중앙 LED 디스플레이 */}
            <div
              className='absolute inset-0 flex items-center justify-center'
              style={{
                width: "225px",
                height: "225px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#0A0A0A",
                borderRadius: "50%",
                border: "3px solid #00E5FF",
                boxShadow:
                  "inset 0 0 30px rgba(0, 229, 255, 0.3), 0 0 45px rgba(0, 229, 255, 0.5)",
              }}>
              <div
                className='led-display'
                style={{
                  color: "#00E5FF",
                  filter: "drop-shadow(0 0 15px #00E5FF)",
                  fontSize: "96px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  transform: "translateY(-6px)",
                }}>
                {getChoiceIcon(playerChoice || computerChoice)}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 원형 버튼 3개 */}
        <div
          className='flex gap-4 md:gap-6 justify-center items-center flex-wrap'
          style={{ marginBottom: "48px" }}>
          {choices.map((choice) => (
            <motion.button
              key={choice}
              onClick={() => handleChoice(choice)}
              disabled={isSpinning || playerChoice !== null}
              className='circular-button'
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0px",
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
              }>
              <span style={{ fontSize: "32px" }}>{getChoiceIcon(choice)}</span>
            </motion.button>
          ))}
        </div>

        {/* 다시 도전하기 버튼 */}
        <AnimatePresence>
          {result && result !== "draw" && !isSpinning && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                boxShadow: [
                  "0 0 20px rgba(0, 229, 255, 0.5)",
                  "0 0 40px rgba(0, 229, 255, 0.8)",
                  "0 0 20px rgba(0, 229, 255, 0.5)",
                ],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { delay: 1, duration: 0.3 },
                scale: { delay: 1, duration: 0.3 },
                boxShadow: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              onClick={resetGame}
              className='px-6 py-3 pixel-border pixel-text text-base md:text-lg bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all cursor-pointer'
              style={{
                color: "#FFFFFF",
                fontWeight: "bold",
                borderColor: "#00E5FF",
                marginTop: "24px",
              }}
              whileHover={{
                scale: 1.1,
                boxShadow:
                  "0 0 40px rgba(0, 229, 255, 0.9), 0 0 60px rgba(0, 229, 255, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}>
              🔄 Play Again 🔄
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
