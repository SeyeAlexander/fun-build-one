"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSounds } from "@/hooks/useSounds";
import { useGlobalMusic } from "@/components/music-provider";
import { ValPrompt } from "@/components/val-prompt";
import { PageHeader } from "@/components/page-header";
import { RotatingHero } from "@/components/rotating-hero";

export default function HomePage() {
  const router = useRouter();
  const { playSound } = useSounds();
  const { duck } = useGlobalMusic();

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Mouse tracking for font variation + music ducking
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

    // Volume ducking on hero hover
    const heroEl = document.getElementById("hero-text");
    const handleHeroEnter = () => duck("hover");
    const handleHeroLeave = () => duck("cruise");

    document.addEventListener("mousemove", handleMouseMove);
    heroEl?.addEventListener("mouseenter", handleHeroEnter);
    heroEl?.addEventListener("mouseleave", handleHeroLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      heroEl?.removeEventListener("mouseenter", handleHeroEnter);
      heroEl?.removeEventListener("mouseleave", handleHeroLeave);
    };
  }, [duck]);

  const handleCTA = () => {
    playSound("switch");
    duck("click");
    setTimeout(() => {
      router.push("/letter");
    }, 200);
  };

  return (
    <div className='relative flex h-screen w-screen flex-col overflow-hidden bg-cream text-ink-red'>
      <PageHeader ctaText='Claim Your Date' ctaHref='/letter' />

      {/* Main hero */}
      <main className='relative z-10 flex w-full flex-1 flex-col items-center justify-center'>
        <RotatingHero row1Ref={row1Ref} row2Ref={row2Ref} />

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
          className='group relative border-none bg-transparent uppercase tracking-widest text-ink-red'
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
          <span className='absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-ink-red transition-all duration-300 group-hover:w-full' />
        </motion.button>
      </footer>
    </div>
  );
}
