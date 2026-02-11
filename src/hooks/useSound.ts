"use client";

import { useCallback, useRef } from "react";

export function useTapSound(soundUrl: string = "/sounds/tap.mp3") {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    // Create a fresh audio instance each time for overlapping sounds
    const audio = new Audio(soundUrl);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Silently fail if autoplay is blocked
    });
  }, [soundUrl]);

  return play;
}

export function useBackgroundMusic(musicUrl: string = "/sounds/ambient.mp3") {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15;
    }
    return audioRef.current;
  }, [musicUrl]);

  const play = useCallback(() => {
    const audio = getAudio();
    audio.play().catch(() => {});
  }, [getAudio]);

  const pause = useCallback(() => {
    const audio = getAudio();
    audio.pause();
  }, [getAudio]);

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    return !audio.paused;
  }, [getAudio]);

  return { play, pause, toggle };
}
