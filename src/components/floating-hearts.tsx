"use client";

import { useEffect, useRef } from "react";

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  phase: number;
  driftSpeed: number;
}

export function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<FloatingHeart[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 6 hearts on each side = 12 total
    const createHearts = (): FloatingHeart[] => {
      const hearts: FloatingHeart[] = [];
      const margin = 100;

      // Left side
      for (let i = 0; i < 6; i++) {
        hearts.push({
          x: 30 + Math.random() * margin,
          y: canvas.height + Math.random() * canvas.height,
          size: 8 + Math.random() * 14,
          speed: 0.4 + Math.random() * 0.6,
          opacity: 0.15 + Math.random() * 0.35,
          drift: Math.random() * 0.6 - 0.3,
          phase: Math.random() * Math.PI * 2,
          driftSpeed: 0.005 + Math.random() * 0.01,
        });
      }
      // Right side
      for (let i = 0; i < 6; i++) {
        hearts.push({
          x: canvas.width - 30 - Math.random() * margin,
          y: canvas.height + Math.random() * canvas.height,
          size: 8 + Math.random() * 14,
          speed: 0.4 + Math.random() * 0.6,
          opacity: 0.15 + Math.random() * 0.35,
          drift: Math.random() * 0.6 - 0.3,
          phase: Math.random() * Math.PI * 2,
          driftSpeed: 0.005 + Math.random() * 0.01,
        });
      }
      return hearts;
    };

    heartsRef.current = createHearts();

    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 15, size / 15);

      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(-5, -3, -15, -3, -15, 5);
      ctx.bezierCurveTo(-15, 12, 0, 18, 0, 22);
      ctx.bezierCurveTo(0, 18, 15, 12, 15, 5);
      ctx.bezierCurveTo(15, -3, 5, -3, 0, 3);
      ctx.closePath();

      ctx.fillStyle = `rgba(217, 26, 26, ${opacity})`;
      ctx.fill();

      // Subtle glow
      ctx.shadowColor = `rgba(217, 26, 26, ${opacity * 0.5})`;
      ctx.shadowBlur = size * 0.5;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      heartsRef.current.forEach((heart) => {
        heart.phase += heart.driftSpeed;
        heart.y -= heart.speed;
        heart.x += Math.sin(heart.phase) * heart.drift;

        // Loop when off top
        if (heart.y < -30) {
          heart.y = canvas.height + 20;
        }

        drawHeart(heart.x, heart.y, heart.size, heart.opacity);
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className='pointer-events-none fixed inset-0' style={{ zIndex: 55 }} />
  );
}
