"use client";

import { useEffect, useRef, useState } from "react";

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  driftSpeed: number;
  opacity: number;
  phase: number;
}

interface SnowflakesProps {
  slowMode?: boolean;
}

export function Snowflakes({ slowMode = false }: SnowflakesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animFrameRef = useRef<number>(0);
  const slowModeRef = useRef(slowMode);
  const targetOpacityRef = useRef(1);
  const currentOpacityRef = useRef(1);

  // Keep ref in sync
  useEffect(() => {
    slowModeRef.current = slowMode;
    targetOpacityRef.current = slowMode ? 0.3 : 1;
  }, [slowMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 45;

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize snowflakes
    const initSnowflakes = () => {
      snowflakesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 4,
        speed: 0.3 + Math.random() * 0.8,
        drift: Math.random() * 2 - 1,
        driftSpeed: 0.005 + Math.random() * 0.01,
        opacity: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    initSnowflakes();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoothly interpolate global opacity
      const diff = targetOpacityRef.current - currentOpacityRef.current;
      currentOpacityRef.current += diff * 0.02;

      const speedMultiplier = slowModeRef.current ? 0.15 : 1;

      snowflakesRef.current.forEach((flake) => {
        // Update position
        flake.phase += flake.driftSpeed * speedMultiplier;
        flake.y += flake.speed * speedMultiplier;
        flake.x += Math.sin(flake.phase) * flake.drift * speedMultiplier;

        // Wrap around
        if (flake.y > canvas.height + 10) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width + 10) flake.x = -10;
        if (flake.x < -10) flake.x = canvas.width + 10;

        // Draw
        const drawOpacity = flake.opacity * currentOpacityRef.current;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${drawOpacity})`;
        ctx.fill();

        // Subtle glow
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${drawOpacity * 0.15})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className='pointer-events-none fixed inset-0' style={{ zIndex: 50 }} />
  );
}
