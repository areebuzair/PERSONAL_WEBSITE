"use client";

import { log } from "console";
import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface PointData {
  x: number;
  y: number;
  fc: number;
  dx: number;
  dy: number;
}

const POINT_LIFETIME = 100;
// At 0.05 alpha per frame, ~120 frames (~2 seconds at 60fps) reduces remaining trail contrast below 0.2%
const FADE_OUT_FRAMES = 120;

export default function ShatteredSpectraBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Check and listen for the (pointer: fine) media query
  const mediaQueryString = "(pointer: fine)"
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(mediaQueryString);
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }

  const isFinePointer = useSyncExternalStore(subscribe,
    () => window.matchMedia(mediaQueryString).matches,
    () => false
  );

  // 2. Manage on-demand canvas animation when pointer is fine
  useEffect(() => {
    if (!isFinePointer) return;

    const cnv = canvasRef.current;
    if (!cnv) return;
    const ctx = cnv.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let points: PointData[] = [];
    let animationFrameId: number | null = null;
    let fadeFramesRemaining = 0;

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

      if (points.length > 0) {
        // Keep resetting the fade-out tail while points are still active
        fadeFramesRemaining = FADE_OUT_FRAMES;
        animationFrameId = window.requestAnimationFrame(animate);
      } else if (fadeFramesRemaining > 0) {
        // Points have expired; continue filling translucent rect until trails vanish
        fadeFramesRemaining -= 1;
        animationFrameId = window.requestAnimationFrame(animate);
      } else {
        // Trails have completely faded: paint a clean final background and suspend
        ctx.fillStyle = "rgb(255, 248, 233)";
        ctx.fillRect(0, 0, W, H);
        animationFrameId = null;
      }
    };

    const startLoop = () => {
      fadeFramesRemaining = FADE_OUT_FRAMES;
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(animate);
      }
    };

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;

      // Scale the internal drawing buffer to match physical device pixels
      cnv.width = Math.floor(W * dpr);
      cnv.height = Math.floor(H * dpr);

      // Normalize the coordinate system to CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      points = [];
    };

    const handleResize = () => {
      init();
      startLoop();
    };

    const handleMouseDown = (e: MouseEvent) => {
      points.push(createPoint(e.clientX, e.clientY));
      startLoop();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (points.length === 0) {
        points.push(createPoint(e.clientX, e.clientY));
        startLoop();
      } else if (
        distanceFrom(points[points.length - 1], e.clientX, e.clientY) > 50
      ) {
        points.push(createPoint(e.clientX, e.clientY));
        startLoop();
      }
    };

    // Initialize dimensions on mount without starting the animation loop
    init();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
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
        pointerEvents: "none",
        backgroundColor: "rgb(255, 248, 233)",
      }}
    />
  );
}