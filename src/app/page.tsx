"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTapSound } from "@/hooks/useSound";

const topWord = "True";
const bottomWord = "Love";

const charVariants = {
  hidden: { opacity: 0, y: 100, rotate: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const cornerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1, duration: 2, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  const router = useRouter();
  const playTap = useTapSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const percentX = (e.clientX - centerX) / centerX;
      const percentY = (e.clientY - centerY) / centerY;

      const targetWeight = 700 + percentY * 100;
      const targetSoft = 50 + percentX * 50;

      const rows = [row1Ref.current, row2Ref.current];
      rows.forEach((row, index) => {
        if (!row) return;
        const factor = index === 0 ? 1 : -0.5;
        row.style.fontVariationSettings = `"wght" ${targetWeight}, "SOFT" ${targetSoft}, "WONK" 1`;

        const moveX = percentX * 20 * factor;
        const moveY = percentY * 10 * factor;
        row.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCTA = () => {
    playTap();
    router.push("/letter");
  };

  return (
    <div className='relative flex h-screen w-screen flex-col overflow-hidden bg-cream text-ink-red'>
      {/* Corner info */}
      <motion.div
        className='absolute top-8 left-8 text-base font-normal tracking-widest uppercase'
        style={{ fontFamily: "var(--font-fraunces), serif" }}
        variants={cornerVariants}
        initial='hidden'
        animate='visible'
      >
        Feb. 14
      </motion.div>
      <motion.div
        className='absolute top-8 right-8 text-base font-normal tracking-widest uppercase'
        style={{ fontFamily: "var(--font-fraunces), serif" }}
        variants={cornerVariants}
        initial='hidden'
        animate='visible'
      >
        RSVP
      </motion.div>

      {/* Main hero */}
      <main className='relative z-10 flex flex-1 flex-col items-center justify-center'>
        <div
          ref={containerRef}
          className='flex flex-col items-center'
          style={{ lineHeight: 0.75, perspective: 1000 }}
        >
          {/* Row 1: True */}
          <div
            ref={row1Ref}
            className='relative z-[2] select-none whitespace-nowrap'
            style={{
              fontSize: "clamp(6rem, 22vw, 24rem)",
              fontWeight: 800,
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
              letterSpacing: "-0.06em",
              textTransform: "capitalize",
              fontFamily: "var(--font-fraunces), serif",
              transition: "font-variation-settings 0.1s ease",
            }}
          >
            {topWord.split("").map((char, i) => (
              <motion.span
                key={i}
                className='inline-block'
                custom={i}
                variants={charVariants}
                initial='hidden'
                animate='visible'
                style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          {/* Row 2: Love */}
          <div
            ref={row2Ref}
            className='relative z-[1] select-none whitespace-nowrap'
            style={{
              fontSize: "clamp(6rem, 22vw, 24rem)",
              fontWeight: 800,
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
              letterSpacing: "-0.06em",
              textTransform: "capitalize",
              fontFamily: "var(--font-fraunces), serif",
              marginTop: "-0.02em",
              transition: "font-variation-settings 0.1s ease",
            }}
          >
            {bottomWord.split("").map((char, i) => (
              <motion.span
                key={i}
                className='inline-block'
                custom={i + topWord.length}
                variants={charVariants}
                initial='hidden'
                animate='visible'
                style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className='relative flex w-full flex-col items-center justify-center pb-8'
        style={{ height: 120 }}
      >
        <div className='staple mb-6' />
        <motion.button
          onClick={handleCTA}
          className='relative border-none bg-transparent text-ink-red uppercase tracking-widest'
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            padding: "10px 24px",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Claim Your Date
          <motion.span
            className='absolute bottom-1 left-1/2 h-0.5 bg-ink-red'
            style={{ transform: "translateX(-50%)" }}
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.button>
      </footer>
    </div>
  );
}
