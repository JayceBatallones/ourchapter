'use client';

import { useEffect, useRef } from 'react';

export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    type Star = {
      x: number;
      y: number;
      z: number;
      ox: number;
      oy: number;
      size: number;
      brightness: number;
      speed: number;
    };

    const stars: Star[] = [];
    const STAR_COUNT = 400;
    const DRIFT_SPEED = 0.15;

    function resize() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * window.devicePixelRatio;
      canvas!.height = height * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createStar(): Star {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        ox: (Math.random() - 0.5) * 0.3,
        oy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.3,
        brightness: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
      };
    }

    function init() {
      resize();
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar());
      }
    }

    let time = 0;

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      time += 0.005;

      for (const star of stars) {
        // Gentle drift
        star.x += star.ox * DRIFT_SPEED;
        star.y += star.oy * DRIFT_SPEED;

        // Wrap around
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;

        // Twinkle
        const twinkle = Math.sin(time * star.speed * 4 + star.z * 100) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size * (0.5 + star.z * 0.5), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.fill();

        // Glow for brighter stars
        if (star.size > 1.2) {
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 255, 255, ${alpha * 0.08})`;
          ctx!.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    init();
    draw();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
