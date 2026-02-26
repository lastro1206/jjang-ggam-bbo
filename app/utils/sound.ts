type GameResult = "win" | "lose" | "draw";

const soundPaths: Record<GameResult, string> = {
  win: "/sounds/win.mp3",
  lose: "/sounds/lose.mp3",
  draw: "/sounds/draw.mp3",
};

/**
 * 게임 결과에 맞는 사운드를 재생합니다.
 * @param result - 게임 결과 ("win" | "lose" | "draw")
 * @param volume - 볼륨 (0.0 ~ 1.0, 기본값: 0.5)
 */
export function playGameSound(result: GameResult, volume: number = 0.5): void {
  try {
    const audio = new Audio(soundPaths[result]);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch((error) => {
      // 파일이 없거나 재생 실패 시 조용히 실패
      console.warn(`Failed to play sound for ${result}:`, error);
    });
  } catch (error) {
    // Audio 객체 생성 실패 시 조용히 실패
    console.warn(`Failed to create audio for ${result}:`, error);
  }
}

