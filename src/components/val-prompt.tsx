"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSounds } from "@/hooks/useSounds";
import confetti from "canvas-confetti";

export function ValPrompt() {
  const [visible, setVisible] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();
  const { playSound } = useSounds();

  // Appear 2 seconds after mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    playSound("switch");

    // Confetti burst!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.7, x: 0.7 },
      colors: ["#D91A1A", "#ff6b6b", "#ff1493", "#FFD700", "#fff"],
    });
    confetti({
      particleCount: 80,
      spread: 120,
      origin: { y: 0.6, x: 0.5 },
      colors: ["#D91A1A", "#ff6b6b", "#ff1493", "#FFD700"],
    });

    // Navigate after confetti
    setTimeout(() => router.push("/letter"), 1800);
  };

  const handleNo = () => {
    playSound("tap");
    const next = noCount + 1;
    setNoCount(next);

    if (next >= 3) {
      // 3rd no — she said "yes"
      setShowBanner(true);
      setTimeout(() => router.push("/letter"), 2500);
    }
  };

  // Scale factors based on no count
  const yesScale = 1 + noCount * 0.45;
  const noScale = Math.max(0.3, 1 - noCount * 0.3);
  const noOpacity = Math.max(0.2, 1 - noCount * 0.35);

  if (!visible) return null;

  return (
    <>
      {/* Banner overlay */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className='fixed inset-0 z-[100] flex items-center justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='rounded-2xl px-10 py-6 text-center shadow-2xl'
              style={{
                background: "linear-gradient(135deg, #D91A1A, #ff6b6b)",
                fontFamily: "var(--font-fraunces), serif",
              }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <p className='text-3xl font-bold text-white'>Ohh woow she said yes 😉</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Val prompt */}
      <motion.div
        className='absolute right-12 bottom-16 z-30 flex flex-col items-center overflow-visible md:right-20 md:bottom-20 lg:right-28'
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
      >
        {/* Flower */}
        <motion.div
          className='mb-2 text-5xl'
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, delay: 0.2 }}
        >
          🌸
        </motion.div>

        {/* Text */}
        <motion.p
          className='mb-4 text-center text-ink-red'
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1.1rem",
            fontWeight: 500,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Hey Snowflake,
          <br />
          be my Val?
        </motion.p>

        {/* Buttons */}
        <div className='flex items-center gap-4'>
          {/* No button */}
          <motion.button
            onClick={handleNo}
            className='rounded-full border border-ink-red/30 px-3 py-1 text-ink-red/50 transition-colors hover:text-ink-red/70'
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: `${0.75 * noScale}rem`,
            }}
            animate={{
              scale: noScale,
              opacity: noOpacity,
            }}
            transition={{ type: "spring", damping: 12 }}
            whileTap={{ scale: noScale * 0.9 }}
          >
            No
          </motion.button>

          {/* Yes button - heart shaped */}
          <motion.button
            onClick={handleYes}
            className='relative flex items-center justify-center text-white font-semibold'
            style={{
              fontFamily: "var(--font-fraunces), serif",
              background: "linear-gradient(135deg, #D91A1A, #ff4444)",
              clipPath:
                "path('M 50 90 C 25 70, 0 50, 0 30 C 0 10, 15 0, 30 0 C 40 0, 48 8, 50 15 C 52 8, 60 0, 70 0 C 85 0, 100 10, 100 30 C 100 50, 75 70, 50 90 Z')",
              width: `${80 * yesScale}px`,
              height: `${80 * yesScale}px`,
              fontSize: `${0.85 * yesScale}rem`,
            }}
            animate={{ scale: yesScale }}
            transition={{ type: "spring", damping: 12 }}
            whileHover={{ scale: yesScale * 1.1 }}
            whileTap={{ scale: yesScale * 0.95 }}
          >
            <span className='mt-2'>Yes</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
