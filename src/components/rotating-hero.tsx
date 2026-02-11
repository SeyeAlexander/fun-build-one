"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHRASES = [
  ["True", "Love"],
  ["Alex's", "Baby"],
  ["Fola", "Ski"],
  ["Fola", "Yemi"],
  ["Snow", "Flake"],
  ["Emi", "Oga"],
  ["Be my", "Val?"],
  ["Ehn", "Baby"],
  ["Baby", "Mi"],
];

const INTERVAL = 7000; // 5 seconds per phrase

export function RotatingHero({
  row1Ref,
  row2Ref,
}: {
  row1Ref: React.RefObject<HTMLDivElement | null>;
  row2Ref: React.RefObject<HTMLDivElement | null>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PHRASES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const [topWord, bottomWord] = PHRASES[currentIndex];

  return (
    <div
      id='hero-text'
      className='flex flex-col items-center mt-[350px] md:mt-0'
      style={{ lineHeight: 0.75, perspective: 1000 }}
    >
      {/* Row 1 */}
      <div
        ref={row1Ref}
        className='relative z-2 select-none whitespace-nowrap'
        style={{
          fontSize: "clamp(7.5rem, 22vw, 24rem)",
          fontWeight: 800,
          fontVariationSettings: '"SOFT" 100, "WONK" 1',
          letterSpacing: "-0.06em",
          textTransform: "capitalize",
          fontFamily: "var(--font-fraunces), serif",
          transition: "font-variation-settings 0.1s ease",
        }}
      >
        <AnimatePresence mode='wait'>
          <motion.span
            key={`top-${currentIndex}`}
            className='inline-block'
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            style={{ transformOrigin: "center bottom" }}
          >
            {topWord}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Row 2 — slightly delayed flip */}
      <div
        ref={row2Ref}
        className='relative z-1 select-none whitespace-nowrap'
        style={{
          fontSize: "clamp(7.5rem, 22vw, 24rem)",
          fontWeight: 800,
          fontVariationSettings: '"SOFT" 100, "WONK" 1',
          letterSpacing: "-0.06em",
          textTransform: "capitalize",
          fontFamily: "var(--font-fraunces), serif",
          marginTop: "-0.02em",
          transition: "font-variation-settings 0.1s ease",
        }}
      >
        <AnimatePresence mode='wait'>
          <motion.span
            key={`bottom-${currentIndex}`}
            className='inline-block'
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            style={{ transformOrigin: "center top" }}
          >
            {bottomWord}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
