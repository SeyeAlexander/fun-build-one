"use client";

import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";

interface MusicOptions {
  src: string;
  baseVolume?: number;
  fadeInDuration?: number;
}

/**
 * Background music hook with volume ducking.
 *
 * Volume levels:
 * - cruising: baseVolume (default 0.25)
 * - hover: baseVolume * 0.6
 * - click: baseVolume * 0.32
 * - fadeOut: 0
 */
export function useMusic(options: MusicOptions) {
  const howlRef = useRef<Howl | null>(null);
  const volumeRef = useRef(0);
  const baseVolumeRef = useRef(options.baseVolume ?? 0.25);
  const isMountedRef = useRef(true);

  const getHowl = useCallback(() => {
    if (!howlRef.current) {
      howlRef.current = new Howl({
        src: [options.src],
        volume: 0,
        loop: true,
        html5: true, // stream for large music files
        preload: true,
      });
    }
    return howlRef.current;
  }, [options.src]);

  // Smooth volume transition
  const fadeTo = useCallback(
    (targetVolume: number, duration: number = 800) => {
      const howl = getHowl();
      if (!howl.playing()) return;

      // Clamp target
      const clamped = Math.max(0, Math.min(1, targetVolume));
      volumeRef.current = clamped;

      howl.fade(howl.volume(), clamped, duration);
    },
    [getHowl],
  );

  // Start playing with fade-in
  const play = useCallback(() => {
    const howl = getHowl();
    if (howl.playing()) return;

    howl.volume(0);
    howl.play();

    // Start at low volume, fade to cruising
    const fadeInTime = options.fadeInDuration ?? 2000;
    setTimeout(() => {
      if (isMountedRef.current) {
        fadeTo(baseVolumeRef.current, fadeInTime);
      }
    }, 100);
  }, [getHowl, options.fadeInDuration, fadeTo]);

  // Volume ducking presets
  const duck = useCallback(
    (level: "cruise" | "hover" | "click" | "silent") => {
      const base = baseVolumeRef.current;
      const volumes = {
        cruise: base,
        hover: base * 0.6,
        click: base * 0.32,
        silent: 0,
      };
      fadeTo(volumes[level], level === "silent" ? 1500 : 600);
    },
    [fadeTo],
  );

  // Fade out and stop
  const fadeOut = useCallback(
    (duration: number = 1500) => {
      const howl = getHowl();
      if (!howl.playing()) return;

      howl.fade(howl.volume(), 0, duration);
      setTimeout(() => {
        howl.stop();
      }, duration);
    },
    [getHowl],
  );

  // Stop immediately
  const stop = useCallback(() => {
    const howl = getHowl();
    howl.stop();
  }, [getHowl]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (howlRef.current) {
        howlRef.current.fade(howlRef.current.volume(), 0, 1500);
        setTimeout(() => {
          howlRef.current?.stop();
          howlRef.current?.unload();
          howlRef.current = null;
        }, 1500);
      }
    };
  }, []);

  return { play, stop, fadeOut, duck, fadeTo };
}
