"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSounds } from "@/hooks/useSounds";
import { useGlobalMusic } from "@/components/music-provider";
import { Snowflakes } from "@/components/snowflakes";
import { FloatingHearts } from "@/components/floating-hearts";
import { PageHeader } from "@/components/page-header";

export default function LetterPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const { playSound } = useSounds();
  const { duck } = useGlobalMusic();

  // Duck music based on envelope state
  useEffect(() => {
    if (isReading) {
      duck("click");
    } else if (isOpen) {
      duck("hover");
    } else {
      duck("cruise");
    }
  }, [isOpen, isReading, duck]);

  // Show floating hearts 5 seconds after letter opens
  useEffect(() => {
    if (!isReading) {
      setShowHearts(false);
      return;
    }
    const timer = setTimeout(() => setShowHearts(true), 5000);
    return () => clearTimeout(timer);
  }, [isReading]);

  const handleEnvelopeClick = () => {
    playSound("tap");
    if (!isOpen) {
      setIsOpen(true);
    } else if (!isReading) {
      playSound("switch");
      setIsReading(true);
    }
  };

  return (
    <div className='relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-cream'>
      <PageHeader ctaText='Home to Alex' ctaHref='/' />
      <Snowflakes slowMode={isOpen} />
      {showHearts && <FloatingHearts />}

      <AnimatePresence mode='wait'>
        {isReading ? (
          /* ===== Full Letter View ===== */
          <motion.div
            key='letter-full'
            className='relative z-60 flex flex-col items-center'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            <div
              className='relative rounded-sm bg-white p-10 shadow-2xl md:p-16'
              style={{
                width: "min(90vw, 580px)",
                minHeight: "60vh",
                fontFamily: "var(--font-fraunces), serif",
                boxShadow: "0 25px 60px rgba(139, 0, 0, 0.15), 0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              {/* Decorative red border accent */}
              <div
                className='absolute top-0 left-0 h-1.5 w-full rounded-t-sm'
                style={{
                  background: "linear-gradient(90deg, #8B0000, #D91A1A, #A31515)",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <p
                  className='mb-6 italic text-ink-red'
                  style={{ fontSize: "1.6rem", fontWeight: 400 }}
                >
                  Ife mi,
                </p>

                <div
                  className='space-y-4 text-ink-red/80'
                  style={{ fontSize: "1.05rem", lineHeight: 1.9 }}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Aridunu mi, Fola mi — loving you feels perfect, beautiful in every way.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    You are the verse I never knew I was searching for, the rhythm beneath every
                    quiet thought, the warmth that turns my coldest days into something worth
                    remembering.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    Every heartbeat writes your name. Every breath carries the weight of a love so
                    reckless, so whole, it refuses to be ordinary.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className='italic'
                  >
                    &apos;Til time itself says to our love —<br />
                    <span className='font-semibold'>&quot;you lot outlived me.&quot;</span>
                  </motion.p>
                </div>

                <motion.p
                  className='mt-10 text-right italic text-ink-red'
                  style={{ fontSize: "1.3rem" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  Forever yours ❤️
                </motion.p>
              </motion.div>
            </div>

            {/* Back button */}
            <motion.button
              className='mt-8 text-sm uppercase tracking-widest text-ink-red/60'
              style={{ fontFamily: "var(--font-fraunces), serif" }}
              onClick={() => {
                playSound("tap");
                setIsReading(false);
              }}
              whileHover={{ color: "#D91A1A" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              ← Close letter
            </motion.button>
          </motion.div>
        ) : (
          /* ===== Envelope View ===== */
          <motion.div
            key='envelope'
            className='relative z-60 flex flex-col items-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            <div
              className='relative'
              style={{
                width: "min(90vw, 600px)",
                aspectRatio: "5 / 3.2",
                cursor: "none",
              }}
              onClick={handleEnvelopeClick}
              role='button'
              tabIndex={0}
              aria-label={isOpen ? "Click to read the letter" : "Click to open the envelope"}
            >
              {/* Envelope body */}
              <div
                className='absolute inset-0 overflow-hidden rounded-md'
                style={{
                  background: "#A31515",
                  boxShadow: "0 20px 50px rgba(139, 0, 0, 0.25), 0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                {/* Bottom triangle */}
                <div
                  className='absolute bottom-0 left-0 w-full'
                  style={{
                    height: "60%",
                    background: "#8B0000",
                    clipPath: "polygon(0 100%, 50% 20%, 100% 100%)",
                  }}
                />
                {/* Left triangle */}
                <div
                  className='absolute top-0 left-0 h-full'
                  style={{
                    width: "50%",
                    background: "#7A0000",
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  }}
                />
                {/* Right triangle */}
                <div
                  className='absolute top-0 right-0 h-full'
                  style={{
                    width: "50%",
                    background: "#B71C1C",
                    clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                  }}
                />

                {/* "Mon Cœur" — centered on envelope */}
                {!isOpen && (
                  <div
                    className='absolute inset-0 z-[6] flex items-center justify-center'
                    style={{ pointerEvents: "none" }}
                  >
                    <p
                      className='text-center italic text-white/70'
                      style={{
                        fontFamily: "var(--font-fraunces), serif",
                        fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                        fontWeight: 300,
                        letterSpacing: "0.08em",
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      Mon Cœur
                    </p>
                  </div>
                )}

                {/* Stamp — top right corner */}
                {!isOpen && (
                  <div
                    className='absolute top-3 right-3 z-[7] flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-white/30 bg-white/10 p-1.5 backdrop-blur-sm md:top-4 md:right-4 md:p-2'
                    style={{
                      width: "clamp(48px, 8vw, 72px)",
                      height: "clamp(56px, 9vw, 84px)",
                    }}
                  >
                    {/* Heart inside stamp */}
                    <svg
                      viewBox='0 0 40 40'
                      className='mb-0.5 w-5 md:w-6'
                      style={{
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                      }}
                    >
                      <path
                        d='M20 35 C10 27, 0 20, 0 12 C0 4, 6 0, 12 0 C16 0, 19.2 3.2, 20 6 C20.8 3.2, 24 0, 28 0 C34 0, 40 4, 40 12 C40 20, 30 27, 20 35Z'
                        fill='#D91A1A'
                      />
                    </svg>
                    <p
                      className='text-center font-bold uppercase text-white/80'
                      style={{
                        fontFamily: "var(--font-fraunces), serif",
                        fontSize: "clamp(0.4rem, 1vw, 0.55rem)",
                        letterSpacing: "0.12em",
                        lineHeight: 1.2,
                      }}
                    >
                      14 FÉV
                    </p>
                    <p
                      className='text-center text-white/50'
                      style={{
                        fontFamily: "var(--font-fraunces), serif",
                        fontSize: "clamp(0.3rem, 0.8vw, 0.4rem)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      AMOUR
                    </p>
                  </div>
                )}
              </div>

              {/* Letter paper (slides out when open) */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className='absolute left-[8%] right-[8%] rounded-sm bg-white shadow-lg'
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      zIndex: 5,
                    }}
                    initial={{ top: "30%", height: "40%", opacity: 0 }}
                    animate={{ top: "-55%", height: "80%", opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    }}
                  >
                    <div className='p-6 md:p-8'>
                      <p className='text-lg italic text-ink-red md:text-xl'>Ife mi,</p>
                      <p className='mt-1 text-sm text-ink-red/40'>...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Envelope flap */}
              <motion.div
                className='absolute top-0 left-0 w-full'
                style={{
                  height: "50%",
                  zIndex: isOpen ? 1 : 10,
                  transformOrigin: "top center",
                  background: "#960E0E",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                }}
                animate={isOpen ? { rotateX: 180, opacity: 0.5 } : { rotateX: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              />
            </div>

            {/* Click text */}
            <motion.p
              className='mt-6 text-sm uppercase tracking-widest text-ink-red/50'
              style={{ fontFamily: "var(--font-fraunces), serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {isOpen ? "Click to read" : "Click to open"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className='absolute bottom-0 flex w-full flex-col items-center justify-center pb-8'
        style={{ height: 100 }}
      >
        <div className='staple mb-4' />
        <motion.button
          onClick={() => {
            playSound("switch");
            duck("cruise");
            window.location.href = "/";
          }}
          className='group relative border-none bg-transparent text-sm uppercase tracking-widest text-ink-red'
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 600,
            letterSpacing: "0.1em",
            padding: "8px 20px",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Home to Alex
          <span className='absolute bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-ink-red transition-all duration-300 group-hover:w-full' />
        </motion.button>
      </footer>
    </div>
  );
}
