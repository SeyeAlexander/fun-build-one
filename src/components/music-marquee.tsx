"use client";

import { useGlobalMusic } from "./music-provider";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/useSounds";

export function MusicMarquee() {
  const { isPlaying, toggle } = useGlobalMusic();
  const { playSound } = useSounds();

  const handleClick = () => {
    playSound("switch");
    toggle();
  };

  const songName = "Confess To You — Lim Kim";

  return (
    <motion.button
      onClick={handleClick}
      className='group fixed top-8 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2 overflow-hidden rounded-full border border-ink-red/15 bg-cream/80 px-4 py-1.5 backdrop-blur-sm transition-colors hover:border-ink-red/30'
      style={{ width: 200, fontFamily: "var(--font-fraunces), serif" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isPlaying ? "Pause music" : "Play music"}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {/* Play/Pause indicator */}
      <span className='flex-shrink-0 text-xs text-ink-red/60'>{isPlaying ? "♫" : "▶"}</span>

      {/* Marquee container */}
      <div className='relative flex-1 overflow-hidden'>
        <div
          className='whitespace-nowrap text-xs tracking-wider text-ink-red/60'
          style={{
            animation: isPlaying ? "marquee-scroll 8s linear infinite" : "none",
          }}
        >
          <span>{songName}</span>
          <span className='mx-4'>·</span>
          <span>{songName}</span>
          <span className='mx-4'>·</span>
          <span>{songName}</span>
        </div>
      </div>
    </motion.button>
  );
}
