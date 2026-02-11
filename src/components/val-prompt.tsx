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

    setTimeout(() => router.push("/letter"), 1800);
  };

  const handleNo = () => {
    playSound("tap");
    const next = noCount + 1;
    setNoCount(next);

    if (next >= 3) {
      setShowBanner(true);
      setTimeout(() => router.push("/letter"), 2500);
    }
  };

  // Scale factors based on no count
  const yesSize = 80 + noCount * 30;
  const noScale = Math.max(0.3, 1 - noCount * 0.3);
  const noOpacity = Math.max(0.2, 1 - noCount * 0.35);
  // Shift content up as Yes grows
  const liftY = noCount * -15;

  if (!visible) return null;

  return (
    <>
      {/* Banner overlay */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className='fixed inset-0 z-100 flex items-center justify-center'
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
        className='absolute right-16 bottom-20 z-30 flex flex-col items-center md:right-24 md:bottom-24 lg:right-32'
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: liftY }}
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
        <div className='flex items-end gap-6'>
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

          {/* Yes button - SVG heart */}
          <motion.button
            onClick={handleYes}
            className='relative flex items-center justify-center'
            style={{
              width: yesSize,
              height: yesSize,
              fontFamily: "var(--font-fraunces), serif",
            }}
            animate={{ width: yesSize, height: yesSize }}
            transition={{ type: "spring", damping: 12 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              viewBox='0 0 100 100'
              className='absolute inset-0 h-full w-full'
              style={{ filter: "drop-shadow(0 4px 12px rgba(217, 26, 26, 0.3))" }}
            >
              <defs>
                <linearGradient id='heartGrad' x1='0' y1='0' x2='1' y2='1'>
                  <stop offset='0%' stopColor='#D91A1A' />
                  <stop offset='100%' stopColor='#ff4444' />
                </linearGradient>
              </defs>
              <path
                d='M50 88 C25 68, 0 50, 0 30 C0 10, 15 0, 30 0 C40 0, 48 8, 50 15 C52 8, 60 0, 70 0 C85 0, 100 10, 100 30 C100 50, 75 68, 50 88Z'
                fill='url(#heartGrad)'
              />
            </svg>
            <span
              className='relative z-10 font-semibold text-white'
              style={{ fontSize: `${Math.max(0.8, yesSize / 90)}rem`, marginTop: "4px" }}
            >
              Yes
            </span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
