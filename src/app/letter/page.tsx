"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTapSound } from "@/hooks/useSound";

export default function LetterPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const playTap = useTapSound();

  const handleEnvelopeClick = () => {
    playTap();
    if (!isOpen) {
      setIsOpen(true);
    } else if (!isReading) {
      setIsReading(true);
    }
  };

  return (
    <div className='relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-cream'>
      <AnimatePresence mode='wait'>
        {isReading ? (
          /* ===== Full Letter View ===== */
          <motion.div
            key='letter-full'
            className='relative flex flex-col items-center'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className='relative bg-white rounded-sm shadow-2xl p-10 md:p-16'
              style={{
                width: "min(90vw, 560px)",
                minHeight: "60vh",
                fontFamily: "var(--font-fraunces), serif",
                boxShadow: "0 25px 60px rgba(139, 0, 0, 0.15), 0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              {/* Decorative red border accent */}
              <div
                className='absolute top-0 left-0 w-full h-1.5 rounded-t-sm'
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
                  className='text-ink-red mb-6 italic'
                  style={{ fontSize: "1.6rem", fontWeight: 400 }}
                >
                  Dear Love,
                </p>

                <div
                  className='space-y-4 text-ink-red/80'
                  style={{ fontSize: "1.05rem", lineHeight: 1.8 }}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Every moment with you feels like the universe conspired to make it perfect. You
                    are the calm in my chaos, the warmth in my coldest days, and the reason I
                    believe in magic.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    This Valentine&apos;s Day, I don&apos;t just want to tell you I love you — I
                    want you to feel it in every word, every heartbeat, every breath.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    You are my favorite chapter in a story I never want to end.
                  </motion.p>
                </div>

                <motion.p
                  className='mt-10 text-ink-red text-right italic'
                  style={{ fontSize: "1.3rem" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Forever yours ❤️
                </motion.p>
              </motion.div>
            </div>

            {/* Back button */}
            <motion.button
              className='mt-8 text-ink-red/60 uppercase tracking-widest text-sm'
              style={{ fontFamily: "var(--font-fraunces), serif" }}
              onClick={() => {
                playTap();
                setIsReading(false);
              }}
              whileHover={{ color: "#D91A1A" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              ← Close letter
            </motion.button>
          </motion.div>
        ) : (
          /* ===== Envelope View ===== */
          <motion.div
            key='envelope'
            className='relative flex flex-col items-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className='relative'
              style={{
                width: "min(85vw, 500px)",
                aspectRatio: "5 / 3.2",
                cursor: "none",
              }}
              onClick={handleEnvelopeClick}
              role='button'
              tabIndex={0}
              aria-label={isOpen ? "Click to read the letter" : "Click to open the envelope"}
            >
              {/* ===== Envelope Back (visible when open) ===== */}
              {/* Main envelope body */}
              <div
                className='absolute inset-0 rounded-sm overflow-hidden'
                style={{ background: "#A31515" }}
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
              </div>

              {/* ===== Letter Paper (slides out when open) ===== */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className='absolute left-[8%] right-[8%] bg-white rounded-sm shadow-lg'
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      zIndex: 5,
                    }}
                    initial={{ top: "30%", height: "40%", opacity: 0 }}
                    animate={{ top: "-55%", height: "80%", opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className='p-6 md:p-8'>
                      <p className='text-ink-red italic text-lg md:text-xl'>Dear Love,</p>
                      <p className='text-ink-red/40 mt-1 text-sm'>...</p>
                    </div>
                    {/* Slight rotation for realism */}
                    <motion.div
                      className='absolute inset-0'
                      initial={{ rotate: 0 }}
                      animate={{ rotate: -2 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      style={{ transformOrigin: "bottom center" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ===== Envelope Flap (top triangle) ===== */}
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
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Click text */}
            <motion.p
              className='mt-6 text-ink-red/50 uppercase tracking-widest text-sm'
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
    </div>
  );
}
