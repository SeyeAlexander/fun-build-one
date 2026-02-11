"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSounds } from "@/hooks/useSounds";
import { useMusic } from "@/hooks/useMusic";
import { ValPrompt } from "@/components/val-prompt";
import { SoundToggle } from "@/components/sound-toggle";

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
  const { playSound } = useSounds();
  const music = useMusic({
    src: "/music/slow.mp3",
    baseVolume: 0.25,
    fadeInDuration: 2000,
  });

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const musicStartedRef = useRef(false);

  // Start music on first user interaction (browser autoplay policy)
  const startMusic = useCallback(() => {
    if (musicStartedRef.current) return;
    musicStartedRef.current = true;
    music.play();
  }, [music]);

  useEffect(() => {
    // Listen for any interaction to start music
    const events = ["click", "mousemove", "touchstart", "keydown"];
    events.forEach((e) => document.addEventListener(e, startMusic, { once: true }));
    return () => {
      events.forEach((e) => document.removeEventListener(e, startMusic));
    };
  }, [startMusic]);

  // Mouse tracking for font variation + music ducking
  useEffect(() => {
    let isHovering = false;

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

    // Volume ducking on hero hover
    const heroEl = document.getElementById("hero-text");
    const handleHeroEnter = () => {
      isHovering = true;
      music.duck("hover");
    };
    const handleHeroLeave = () => {
      isHovering = false;
      music.duck("cruise");
    };

    document.addEventListener("mousemove", handleMouseMove);
    heroEl?.addEventListener("mouseenter", handleHeroEnter);
    heroEl?.addEventListener("mouseleave", handleHeroLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      heroEl?.removeEventListener("mouseenter", handleHeroEnter);
      heroEl?.removeEventListener("mouseleave", handleHeroLeave);
    };
  }, [music]);

  const handleCTA = () => {
    playSound("switch");
    music.duck("click");
    setTimeout(() => {
      music.fadeOut(1200);
      router.push("/letter");
    }, 300);
  };

  return (
    <div className='relative flex h-screen w-screen flex-col overflow-hidden bg-cream text-ink-red'>
      <SoundToggle />

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
        className='absolute top-8 right-28 text-base font-normal tracking-widest uppercase'
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
          id='hero-text'
          className='flex flex-col items-center'
          style={{ lineHeight: 0.75, perspective: 1000 }}
        >
          {/* Row 1: True */}
          <div
            ref={row1Ref}
            className='relative z-2 select-none whitespace-nowrap'
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
              >
                {char}
              </motion.span>
            ))}
          </div>
          {/* Row 2: Love */}
          <div
            ref={row2Ref}
            className='relative z-1 select-none whitespace-nowrap'
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
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Val Prompt — bottom right of hero */}
        <ValPrompt />
      </main>

      {/* Footer */}
      <footer
        className='relative flex w-full flex-col items-center justify-center pb-8'
        style={{ height: 120 }}
      >
        <div className='staple mb-6' />
        <motion.button
          onClick={handleCTA}
          className='relative border-none bg-transparent uppercase tracking-widest text-ink-red'
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
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          />
        </motion.button>
      </footer>
    </div>
  );
}
