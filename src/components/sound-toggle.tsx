"use client";

import { useSounds } from "@/hooks/useSounds";
import { motion } from "framer-motion";

export function SoundToggle() {
  const { enabled, toggleSound, playSound } = useSounds();

  const handleClick = () => {
    playSound("switch");
    toggleSound();
  };

  return (
    <motion.button
      onClick={handleClick}
      className='fixed top-8 right-20 z-[200] flex h-8 w-8 items-center justify-center rounded-full text-ink-red/60 transition-colors hover:text-ink-red'
      style={{ fontFamily: "var(--font-fraunces), serif" }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      title={enabled ? "Mute sounds" : "Unmute sounds"}
      aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
    >
      {enabled ? (
        // Speaker with sound waves
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
          <path d='M15.54 8.46a5 5 0 0 1 0 7.07' />
          <path d='M19.07 4.93a10 10 0 0 1 0 14.14' />
        </svg>
      ) : (
        // Speaker muted
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
          <line x1='23' y1='9' x2='17' y2='15' />
          <line x1='17' y1='9' x2='23' y2='15' />
        </svg>
      )}
    </motion.button>
  );
}
