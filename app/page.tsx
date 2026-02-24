"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpaceBackground from "./components/SpaceBackground";
import CustomCursor from "./components/CustomCursor";
import ChoiceCard from "./components/ChoiceCard";
import StarParticles from "./components/StarParticles";

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

export default function Home() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleChoice = (choice: Choice) => {
    if (playerChoice !== null) return; // 이미 선택했으면 무시

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

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <SpaceBackground />
      <CustomCursor />
      <StarParticles isActive={showParticles} />

      <main className='relative z-10 flex flex-col items-center justify-center min-h-screen p-8'>
        {/* 결과 메시지 */}
        <AnimatePresence mode='wait'>
          {result && (
            <motion.div
              key={result}
              style={{ marginBottom: "1.5rem" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}>
              {result === "win" && (
                <motion.div
                  className='text-5xl md:text-7xl pixel-text'
                  style={{ color: "#FFD700" }}
                  animate={{
                    scale: [1, 1.2, 1],
                    textShadow: [
                      "0 0 10px #FFD700",
                      "0 0 30px #FFD700, 0 0 50px #FFD700",
                      "0 0 10px #FFD700",
                    ],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  VICTORY!
                </motion.div>
              )}
              {result === "lose" && (
                <motion.div
                  className='text-5xl md:text-7xl pixel-text'
                  style={{ color: "#FF0000" }}
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                  }}>
                  DEFEAT
                </motion.div>
              )}
              {result === "draw" && (
                <motion.div
                  className='text-5xl md:text-7xl pixel-text'
                  style={{ color: "#FFFFFF" }}
                  animate={{
                    x: isShaking ? [-10, 10, -10, 10, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}>
                  RETRY
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 선택 카드들 */}
        <div
          className={`flex flex-wrap gap-6 justify-center items-center ${
            isShaking ? "shake" : ""
          }`}
          style={{ marginBottom: "2.5rem" }}>
          {choices.map((choice) => (
            <motion.div
              key={choice}
              animate={
                isShaking && result === "draw"
                  ? {
                      x: [-10, 10, -10, 10, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
              }}>
              <ChoiceCard
                choice={choice}
                isSelected={playerChoice === choice}
                isDisabled={playerChoice !== null}
                isLosing={isLosing(choice)}
                onClick={() => handleChoice(choice)}
              />
            </motion.div>
          ))}
        </div>

        {/* 컴퓨터 선택 표시 */}
        <AnimatePresence>
          {computerChoice && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}>
              <div
                className='text-2xl pixel-text text-center'
                style={{ marginBottom: "2.25rem" }}>
                컴퓨터 선택:
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

        {/* 다시하기 버튼 */}
        <AnimatePresence>
          {result && result !== "draw" && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
              onClick={resetGame}
              className='px-8 py-4 pixel-border pixel-text text-xl bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 transition-all cursor-pointer'
              style={{ marginTop: "2.5rem", marginBottom: "2.5rem" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}>
              다시하기
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
