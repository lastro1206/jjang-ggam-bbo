export type SoundType =
  | "countdown-3"
  | "countdown-2"
  | "countdown-1"
  | "reveal"
  | "success"
  | "fail"
  | "stage-complete"
  | "game-complete"
  | "background";

export const SOUND_PATHS: Record<SoundType, string> = {
  "countdown-3": "/sounds/countdown-3.mp3",
  "countdown-2": "/sounds/countdown-2.mp3",
  "countdown-1": "/sounds/countdown-1.mp3",
  reveal: "/sounds/reveal.mp3",
  success: "/sounds/success.mp3",
  fail: "/sounds/fail.mp3",
  "stage-complete": "/sounds/stage-complete.mp3",
  "game-complete": "/sounds/game-complete.mp3",
  background: "/sounds/background.mp3",
};

/**
 * 사운드를 재생합니다.
 * @param soundType - 재생할 사운드 타입
 * @param volume - 볼륨 (0.0 ~ 1.0, 기본값: 0.5)
 * @param loop - 반복 재생 여부 (기본값: false)
 * @returns Audio 객체 (반복 재생 시 관리용)
 */
export function playSound(
  soundType: SoundType,
  volume: number = 0.5,
  loop: boolean = false
): HTMLAudioElement | null {
  try {
    const audio = new Audio(SOUND_PATHS[soundType]);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.loop = loop;
    audio.play().catch((error) => {
      // 파일이 없거나 재생 실패 시 조용히 실패
      console.warn(`Failed to play sound for ${soundType}:`, error);
    });
    return audio;
  } catch (error) {
    // Audio 객체 생성 실패 시 조용히 실패
    console.warn(`Failed to create audio for ${soundType}:`, error);
    return null;
  }
}

/**
 * 배경음악을 재생합니다. (반복 재생)
 * @param volume - 볼륨 (0.0 ~ 1.0, 기본값: 0.3)
 * @returns Audio 객체 (정지 시 사용)
 */
export function playBackgroundMusic(
  volume: number = 0.3
): HTMLAudioElement | null {
  return playSound("background", volume, true);
}

/**
 * 게임 결과에 맞는 사운드를 재생합니다. (기존 호환성 유지)
 * @param result - 게임 결과 ("win" | "lose" | "draw")
 * @param volume - 볼륨 (0.0 ~ 1.0, 기본값: 0.5)
 */
export function playGameSound(
  result: "win" | "lose" | "draw",
  volume: number = 0.5
): void {
  const soundMap: Record<"win" | "lose" | "draw", SoundType> = {
    win: "success",
    lose: "fail",
    draw: "reveal",
  };
  playSound(soundMap[result], volume);
}
