"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

interface MusicContextValue {
  isPlaying: boolean;
  toggle: () => void;
  duck: (level: "cruise" | "hover" | "click") => void;
}

const MusicContext = createContext<MusicContextValue>({
  isPlaying: false,
  toggle: () => {},
  duck: () => {},
});

export const useGlobalMusic = () => useContext(MusicContext);

const SONG_SRC = "/music/confess.mp3";
const BASE_VOLUME = 0.25;
const LOW_VOLUME = 0.06;
const FADE_UP_DELAY = 3000; // 3 seconds to cruise volume

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const howlRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedOnceRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duckLevelRef = useRef<"cruise" | "hover" | "click">("cruise");

  // Get or create the Howl instance
  const getHowl = useCallback(() => {
    if (!howlRef.current) {
      howlRef.current = new Howl({
        src: [SONG_SRC],
        volume: LOW_VOLUME,
        loop: false,
        html5: true,
        preload: true,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => {
          setIsPlaying(false);
          hasPlayedOnceRef.current = true;
        },
      });
    }
    return howlRef.current;
  }, []);

  // Attempt autoplay immediately
  useEffect(() => {
    const howl = getHowl();

    const tryPlay = () => {
      if (howl.playing()) return;
      howl.volume(LOW_VOLUME);
      howl.play();

      // Fade up to cruising volume after 3s
      fadeTimerRef.current = setTimeout(() => {
        if (howl.playing()) {
          howl.fade(howl.volume(), BASE_VOLUME, 2000);
        }
      }, FADE_UP_DELAY);
    };

    // Try immediate play
    tryPlay();

    // Also listen for first interaction in case autoplay was blocked
    const unlockAndPlay = () => {
      if (!howl.playing()) {
        tryPlay();
      }
    };
    const events = ["click", "touchstart", "keydown"];
    events.forEach((e) => document.addEventListener(e, unlockAndPlay, { once: true }));

    return () => {
      events.forEach((e) => document.removeEventListener(e, unlockAndPlay));
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [getHowl]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    const howl = getHowl();
    if (howl.playing()) {
      howl.pause();
    } else {
      // If song finished and user clicks play again, restart
      if (hasPlayedOnceRef.current) {
        howl.seek(0);
        hasPlayedOnceRef.current = false;
      }
      howl.volume(LOW_VOLUME);
      howl.play();
      // Fade up
      fadeTimerRef.current = setTimeout(() => {
        const targetVol =
          duckLevelRef.current === "hover"
            ? BASE_VOLUME * 0.6
            : duckLevelRef.current === "click"
              ? BASE_VOLUME * 0.32
              : BASE_VOLUME;
        if (howl.playing()) {
          howl.fade(howl.volume(), targetVol, 1500);
        }
      }, FADE_UP_DELAY);
    }
  }, [getHowl]);

  // Volume ducking
  const duck = useCallback(
    (level: "cruise" | "hover" | "click") => {
      duckLevelRef.current = level;
      const howl = getHowl();
      if (!howl.playing()) return;

      const volumes = {
        cruise: BASE_VOLUME,
        hover: BASE_VOLUME * 0.6,
        click: BASE_VOLUME * 0.32,
      };
      howl.fade(howl.volume(), volumes[level], 600);
    },
    [getHowl],
  );

  return (
    <MusicContext.Provider value={{ isPlaying, toggle, duck }}>{children}</MusicContext.Provider>
  );
}
