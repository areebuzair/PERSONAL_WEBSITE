"use client";

import React, { useEffect, useRef, useState } from "react";

interface PointData {
  x: number;
  y: number;
  fc: number;
  dx: number;
  dy: number;
}

const POINT_LIFETIME = 100;

export default function FluidBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

  // 1. Check and listen for the (pointer: fine) media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // 2. Initialize canvas animation only when pointer is fine
  useEffect(() => {
    if (!isFinePointer) return;

    const cnv = canvasRef.current;
    if (!cnv) return;
    const ctx = cnv.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let points: PointData[] = [];
    let animationFrameId: number;

    const createPoint = (x: number, y: number): PointData => {
      let dx = 0;
      let dy = 0;
      if (points.length > 0) {
        const prevPoint = points[points.length - 1];
        const scale = 20;
        dx = (prevPoint.x - x) / scale;
        dy = (prevPoint.y - y) / scale;
      }
      return { x, y, fc: POINT_LIFETIME, dx, dy };
    };

    const setLineStyle = (fc: number) => {
      const alpha = (fc / POINT_LIFETIME) ** 2 / 10;
      ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`;
    };

    const movePoint = (p: PointData) => {
      const factor = 2;
      p.x += p.dx * factor;
      p.y += p.dy * factor;
    };

    const distanceFrom = (p: PointData, x: number, y: number) => {
      return Math.hypot(p.x - x, p.y - y);
    };

    const midPoint = (p1: PointData, p2: PointData): [number, number] => {
      return [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
    };

    const drawLine = (
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ) => {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };

    const init = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      cnv.width = W;
      cnv.height = H;
      points = [];
    };

    const draw = () => {
      const N = points.length;
      if (N < 2) return;

      let [tx, ty] = midPoint(points[0], points[1]);
      setLineStyle(points[0].fc);
      drawLine(points[0], { x: tx, y: ty });

      for (let i = 1; i < N - 1; i++) {
        const [t1x, t1y] = midPoint(points[i], points[i + 1]);

        setLineStyle(points[i].fc);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo(points[i].x, points[i].y, t1x, t1y);
        ctx.stroke();

        tx = t1x;
        ty = t1y;
      }

      setLineStyle(points[N - 1].fc);
      drawLine({ x: tx, y: ty }, points[N - 1]);
    };

    const update = () => {
      for (let i = 0; i < points.length; i++) {
        points[i].fc -= 1;
        movePoint(points[i]);
        if (points[i].fc <= 0) {
          points.splice(i, 1);
          i -= 1;
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(255, 248, 233, 0.05)";
      ctx.fillRect(0, 0, W, H);

      draw();
      update();

      animationFrameId = window.requestAnimationFrame(animate);
    };

    // Attach listeners to `window` so background captures movement behind UI elements
    const handleMouseDown = (e: MouseEvent) => {
      points.push(createPoint(e.clientX, e.clientY));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (points.length === 0) {
        points.push(createPoint(e.clientX, e.clientY));
      } else if (
        distanceFrom(points[points.length - 1], e.clientX, e.clientY) > 50
      ) {
        points.push(createPoint(e.clientX, e.clientY));
      }
    };

    init();
    animate();

    window.addEventListener("resize", init);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isFinePointer]);

  if (!isFinePointer) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none", // Allows clicks/scrolls to pass through to your foreground content
        backgroundColor: "rgb(255, 248, 233)",
      }}
    />
  );
}