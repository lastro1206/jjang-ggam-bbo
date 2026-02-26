"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpaceBackground from "./components/SpaceBackground";
import CustomCursor from "./components/CustomCursor";
import ChoiceCard from "./components/ChoiceCard";
import StarParticles from "./components/StarParticles";
import { playGameSound } from "./utils/sound";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw" | null;

const choices: Choice[] = ["rock", "paper", "scissors"];

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
  const [isShaking, setIsShaking] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleChoice = (choice: Choice) => {
    if (playerChoice !== null) return;

    const computer = getComputerChoice();
    const gameResult = getResult(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);

    if (gameResult === "win") {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 3000);
    } else if (gameResult === "draw") {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        resetGame();
      }, 1500);
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setIsShaking(false);
    setShowParticles(false);
  };

  const isLosing = (choice: Choice) => {
    return result === "lose" && playerChoice === choice;
  };

  const isWinning = (choice: Choice) => {
    return result === "win" && playerChoice === choice;
  };

  useEffect(() => {
    if (result) {
      playGameSound(result, 0.5);
    }
  }, [result]);

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
            <div className='text-xl pixel-text text-black mb-1'>
              아롬 인스타 팔로우 시
            </div>
            <div className='text-3xl pixel-text text-red-600 font-bold'>
              코인 2개 지급
            </div>
            <div className='text-sm pixel-text text-black mt-2'>지금 바로!</div>
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

      <main className='relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-6 pt-16 pb-16'>
        <AnimatePresence mode='wait'>
          {result && (
            <motion.div
              key={result}
              className='text-center'
              style={{ marginBottom: "1rem" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}>
              {result === "win" && (
                <motion.div
                  className='text-5xl md:text-7xl pixel-text'
                  style={{ color: "#FFD700" }}
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 5, -5, 5, -5, 0],
                    textShadow: [
                      "0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700",
                      "0 0 50px #FFD700, 0 0 80px #FFD700, 0 0 100px #FFD700, 0 0 120px #FFD700",
                      "0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700",
                    ],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity }}>
                    💰
                  </motion.span>{" "}
                  JACKPOT!{" "}
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      delay: 0.15,
                    }}>
                    💰
                  </motion.span>
                </motion.div>
              )}
              {result === "lose" && (
                <motion.div
                  className='text-5xl md:text-7xl pixel-text'
                  style={{ color: "#FF0000" }}
                  animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1, 0.9, 1],
                    textShadow: [
                      "0 0 20px #FF0000, 0 0 40px #FF0000",
                      "0 0 50px #FF0000, 0 0 80px #FF0000, 0 0 100px #FF0000",
                      "0 0 20px #FF0000, 0 0 40px #FF0000",
                    ],
                  }}
                  transition={{ duration: 0.4, repeat: Infinity }}>
                  ❌ GAME OVER ❌
                </motion.div>
              )}
              {result === "draw" && (
                <motion.div
                  className='text-4xl md:text-6xl pixel-text'
                  style={{ color: "#FFFFFF" }}
                  animate={{
                    x: isShaking ? [-10, 10, -10, 10, 0] : 0,
                    textShadow: [
                      "0 0 10px #FFFFFF",
                      "0 0 30px #FFFFFF, 0 0 50px #FFFFFF",
                      "0 0 10px #FFFFFF",
                    ],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isShaking ? 0 : Infinity,
                  }}>
                  🔄 RETRY 🔄
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`flex flex-wrap gap-4 md:gap-6 justify-center items-center ${
            isShaking ? "shake" : ""
          }`}
          style={{ marginBottom: "1.5rem" }}>
          {choices.map((choice) => (
            <motion.div
              key={choice}
              animate={
                isShaking && result === "draw"
                  ? { x: [-10, 10, -10, 10, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}>
              <ChoiceCard
                choice={choice}
                isSelected={playerChoice === choice}
                isDisabled={playerChoice !== null}
                isLosing={isLosing(choice)}
                isWinning={isWinning(choice)}
                onClick={() => handleChoice(choice)}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {computerChoice && (
            <motion.div
              className='flex flex-col items-center'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}>
              <div
                className='text-xl md:text-2xl pixel-text text-center'
                style={{
                  marginBottom: "1.5rem",
                  color: "#FFD700",
                  textShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
                }}>
                🎰 상대방 선택: 🎰
              </div>
              <div className='flex justify-center'>
                <ChoiceCard
                  choice={computerChoice}
                  isSelected={false}
                  isDisabled={true}
                  isLosing={false}
                  onClick={() => {}}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && result !== "draw" && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                boxShadow: [
                  "0 0 20px rgba(255, 215, 0, 0.5)",
                  "0 0 40px rgba(255, 215, 0, 0.8)",
                  "0 0 20px rgba(255, 215, 0, 0.5)",
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
              className='px-10 py-5 pixel-border pixel-text text-xl md:text-2xl bg-gradient-to-b from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-700 transition-all cursor-pointer'
              style={{
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
                color: "#FFFFFF",
                fontWeight: "bold",
              }}
              whileHover={{
                scale: 1.2,
                boxShadow:
                  "0 0 40px rgba(255, 0, 0, 0.9), 0 0 60px rgba(255, 0, 0, 0.6)",
                rotate: [0, -3, 3, 0],
              }}
              whileTap={{ scale: 0.95 }}>
              🔥 다시 도전하기 🔥
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
