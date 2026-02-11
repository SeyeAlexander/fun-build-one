"use client";

import { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  driftSpeed: number;
  opacity: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
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

  useEffect(() => {
    slowModeRef.current = slowMode;
    targetOpacityRef.current = slowMode ? 0.25 : 1;
  }, [slowMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize snowflakes
    snowflakesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 4 + Math.random() * 8,
      speed: 0.3 + Math.random() * 0.6,
      drift: Math.random() * 1.5 - 0.75,
      driftSpeed: 0.003 + Math.random() * 0.008,
      opacity: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

    // Draw a 6-pointed snowflake crystal
    const drawSnowflake = (
      x: number,
      y: number,
      size: number,
      opacity: number,
      rotation: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const color = `rgba(140, 170, 220, ${opacity})`;
      const glowColor = `rgba(140, 170, 220, ${opacity * 0.3})`;

      // Glow
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = glowColor;
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.lineCap = "round";

      // 6 main branches
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const branchLen = size;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        const ex = Math.cos(angle) * branchLen;
        const ey = Math.sin(angle) * branchLen;
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Sub-branches (two per main branch)
        for (let j = 1; j <= 2; j++) {
          const frac = j * 0.38;
          const bx = Math.cos(angle) * branchLen * frac;
          const by = Math.sin(angle) * branchLen * frac;
          const subLen = size * 0.35 * (1 - frac * 0.4);

          // Left sub
          const leftAngle = angle + Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(leftAngle) * subLen, by + Math.sin(leftAngle) * subLen);
          ctx.stroke();

          // Right sub
          const rightAngle = angle - Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(rightAngle) * subLen, by + Math.sin(rightAngle) * subLen);
          ctx.stroke();
        }
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const diff = targetOpacityRef.current - currentOpacityRef.current;
      currentOpacityRef.current += diff * 0.02;

      const speedMultiplier = slowModeRef.current ? 0.12 : 1;

      snowflakesRef.current.forEach((flake) => {
        flake.phase += flake.driftSpeed * speedMultiplier;
        flake.y += flake.speed * speedMultiplier;
        flake.x += Math.sin(flake.phase) * flake.drift * speedMultiplier;
        flake.rotation += flake.rotationSpeed * speedMultiplier;

        if (flake.y > canvas.height + 15) {
          flake.y = -15;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width + 15) flake.x = -15;
        if (flake.x < -15) flake.x = canvas.width + 15;

        const drawOpacity = flake.opacity * currentOpacityRef.current;
        drawSnowflake(flake.x, flake.y, flake.size, drawOpacity, flake.rotation);
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
