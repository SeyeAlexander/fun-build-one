"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSounds } from "@/hooks/useSounds";
import { MusicMarquee } from "./music-marquee";

interface PageHeaderProps {
  ctaText: string;
  ctaHref: string;
}

const cornerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 1.5, ease: "easeOut" as const },
  },
};

export function PageHeader({ ctaText, ctaHref }: PageHeaderProps) {
  const router = useRouter();
  const { playSound } = useSounds();

  const navigate = () => {
    playSound("switch");
    router.push(ctaHref);
  };

  return (
    <>
      {/* Feb. 14 — top left */}
      <motion.button
        className='absolute top-8 left-8 z-100 border-none bg-transparent text-base font-normal tracking-widest uppercase text-ink-red'
        style={{ fontFamily: "var(--font-fraunces), serif" }}
        variants={cornerVariants}
        initial='hidden'
        animate='visible'
        onClick={navigate}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Feb. 14
      </motion.button>

      {/* Music marquee — center */}
      <MusicMarquee />

      {/* RSVP — top right */}
      <motion.button
        className='absolute top-8 right-8 z-100 border-none bg-transparent text-base font-normal tracking-widest uppercase text-ink-red'
        style={{ fontFamily: "var(--font-fraunces), serif" }}
        variants={cornerVariants}
        initial='hidden'
        animate='visible'
        onClick={navigate}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        RSVP
      </motion.button>
    </>
  );
}
