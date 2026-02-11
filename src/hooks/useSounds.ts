"use client";

import { Howl } from "howler";
import { useCallback, useEffect, useState } from "react";

type SoundType = "tap" | "switch";

const VOLUME_MAP: Record<SoundType, number> = {
  tap: 0.18,
  switch: 0.15,
};

const STORAGE_KEY = "valentine-sound-enabled";

// ---- Global singleton state ----
let globalEnabled = true;
let globalInitialized = false;
let audioUnlocked = false;
const listeners = new Set<(enabled: boolean) => void>();

// Howl instances (lazy-init to avoid SSR issues)
let sounds: Record<SoundType, Howl> | null = null;

function getSounds(): Record<SoundType, Howl> {
  if (!sounds) {
    sounds = {
      tap: new Howl({
        src: ["/sounds/tap.wav"],
        volume: VOLUME_MAP.tap,
        preload: true,
      }),
      switch: new Howl({
        src: ["/sounds/switch.wav"],
        volume: VOLUME_MAP.switch,
        preload: true,
      }),
    };
  }
  return sounds;
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  const s = getSounds();
  Object.entries(s).forEach(([key, sound]) => {
    const originalVolume = VOLUME_MAP[key as SoundType];
    sound.volume(0);
    sound.play();
    sound.stop();
    sound.volume(originalVolume);
  });
}

function initializeFromStorage() {
  if (globalInitialized) return;
  globalInitialized = true;

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      globalEnabled = stored === "true";
    }
  }
}

function setGlobalEnabled(enabled: boolean) {
  globalEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }
  listeners.forEach((listener) => listener(enabled));
}

export function useSounds() {
  const [enabled, setEnabled] = useState(globalEnabled);

  useEffect(() => {
    initializeFromStorage();
    setEnabled(globalEnabled);
  }, []);

  useEffect(() => {
    const listener = (newEnabled: boolean) => {
      setEnabled(newEnabled);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    unlockAudio();
    if (!globalEnabled) return;

    try {
      const s = getSounds();
      const sound = s[type];
      sound.stop();
      sound.play();
    } catch {
      // Silently fail — never block interaction
    }
  }, []);

  const toggleSound = useCallback(() => {
    setGlobalEnabled(!globalEnabled);
  }, []);

  return {
    enabled,
    playSound,
    toggleSound,
  };
}
