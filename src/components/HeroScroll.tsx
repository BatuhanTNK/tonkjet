"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  drawFrameToCanvas,
  getNearestLoadedFrame,
  PreloaderState,
} from "@/hooks/useImagePreloader";

interface HeroScrollProps {
  preloader: PreloaderState;
  frameCount?: number;
}

export default function HeroScroll({
  preloader,
  frameCount = 120,
}: HeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastIndexRef = useRef<number>(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring-scrubbed progress for buttery frame transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.35,
  });

  // Typographic choreography tied to scroll progress
  const initialOverlayOpacity = useTransform(smoothProgress, [0, 0.22], [1, 0]);
  const initialOverlayBlur = useTransform(
    smoothProgress,
    [0, 0.22],
    ["blur(0px)", "blur(10px)"]
  );
  const wordmarkY = useTransform(smoothProgress, [0, 0.26], [0, -160]);
  const wordmarkScale = useTransform(smoothProgress, [0, 0.26], [1, 0.48]);
  const wordmarkOpacity = useTransform(smoothProgress, [0, 0.18, 0.25], [1, 0.85, 0]);

  const leftTitleX = useTransform(smoothProgress, [0, 0.24], [0, -60]);
  const rightTitleX = useTransform(smoothProgress, [0, 0.24], [0, 60]);

  // Mid-cloud emergence subtle caption
  const cloudCaptionOpacity = useTransform(
    smoothProgress,
    [0.66, 0.78, 0.93, 1],
    [0, 1, 1, 0]
  );
  const cloudCaptionY = useTransform(smoothProgress, [0.66, 0.82], [28, 0]);

  // Render initial frame once loaded & keep synced on resize / scroll
  useEffect(() => {
    const renderAtProgress = (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(progress * (frameCount - 1)))
      );
      const img = getNearestLoadedFrame(preloader.imagesRef.current, frameIndex);
      if (img) {
        drawFrameToCanvas(canvas, img, "cover", "#141010");
        lastIndexRef.current = frameIndex;
      }
    };

    renderAtProgress(smoothProgress.get());

    const unsubscribe = smoothProgress.on("change", (latest) => {
      renderAtProgress(latest);
    });

    const handleResize = () => {
      renderAtProgress(smoothProgress.get());
    };
    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [smoothProgress, preloader.imagesRef, preloader.isFirstFrameReady, preloader.loadedCount, frameCount]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[400vh] w-full bg-[#050505]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Scrollytelling Canvas */}
        <canvas
          ref={canvasRef}
          className="h-full w-full block contrast-[1.03] saturate-[1.04]"
          aria-label="TonkJet cabin window transition into clouds"
        />

        {/* Ultra-subtle organic cinema grain */}
        <div className="pointer-events-none absolute inset-0 cinema-grain z-[1]" />

        {/* Subtle atmospheric vignette that softens as we break into open sky */}
        <motion.div
          style={{ opacity: initialOverlayOpacity }}
          className="pointer-events-none absolute inset-0 hero-vignette"
        />

        {/* Seamless bottom mist feather into About section sky */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, rgba(155,200,220,0) 0%, rgba(155,200,220,0.22) 100%)",
          }}
        />

        {/* Centered Brand Wordmark inside cabin window (docks into header on scroll) */}
        <motion.div
          style={{
            y: wordmarkY,
            scale: wordmarkScale,
            opacity: wordmarkOpacity,
          }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
        >
          <span className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.22em] uppercase text-[#FFF8ED] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
            TonkJet
          </span>
        </motion.div>

        {/* Hero Editorial Typography Layer */}
        <motion.div
          style={{
            opacity: initialOverlayOpacity,
            filter: initialOverlayBlur,
          }}
          className="pointer-events-none absolute inset-0 z-10 mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24 pt-24 pb-24 flex flex-col justify-between"
        >
          {/* Top-Left Statement */}
          <motion.div style={{ x: leftTitleX }} className="max-w-lg">
            <h1 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] tracking-[-0.02em] font-medium text-[#FFF8ED] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
              We are
              <br />
              movement
            </h1>
          </motion.div>

          {/* Bottom Split Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Bottom-Left Editorial Copy */}
            <div className="max-w-xs">
              <p className="text-lg md:text-xl font-medium leading-snug text-[#FFF8ED] drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                Your freedom to
                <br />
                enjoy life
              </p>
              <div className="my-3.5 h-[1px] w-16 bg-[#FFF8ED]/45" />
              <p className="text-[12.5px] leading-relaxed text-[#FFF8ED]/80 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
                Every flight is designed around your comfort, time, and
                ambitions — so you can focus on what truly matters, while we
                take care of everything else.
              </p>
            </div>

            {/* Bottom-Right Statement + Scroll Prompt */}
            <motion.div
              style={{ x: rightTitleX }}
              className="flex flex-col items-start md:items-end text-left md:text-right"
            >
              <p className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] tracking-[-0.02em] font-medium text-[#FFF8ED] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
                We are
                <br />
                distinction
              </p>

              <div className="mt-7 flex items-center gap-3 text-[10px] tracking-[0.26em] uppercase text-[#FFF8ED]/85">
                <span>Scroll down to start the journey</span>
                <span className="relative flex h-6 w-3.5 items-start justify-center rounded-full border border-[#FFF8ED]/60 p-0.5">
                  <motion.span
                    animate={{ y: [0, 9, 0], opacity: [1, 0.25, 1] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-1.5 w-1 rounded-full bg-[#FFF8ED]"
                  />
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Cloud-Sea Emergence Whisper */}
        <motion.div
          style={{ opacity: cloudCaptionOpacity, y: cloudCaptionY }}
          className="pointer-events-none absolute inset-x-0 bottom-28 z-10 flex flex-col items-center text-center px-6"
        >
          <span className="text-[11px] font-mono tracking-[0.32em] uppercase text-[#141010]/70">
            FL 450 · ABOVE THE ORDINARY
          </span>
          <p className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-[-0.01em] text-[#141010]/90">
            Beyond boundaries, above every cloud.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
