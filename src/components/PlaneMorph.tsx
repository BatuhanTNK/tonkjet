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

interface PlaneMorphProps {
  preloader: PreloaderState;
  frameCount?: number;
}

const SPECS = [
  { label: "MAXIMUM OPERATING RANGE", value: "11,263 km" },
  { label: "HIGH-SPEED CRUISE", value: "480 knots" },
  { label: "PASSENGER CAPACITY", value: "Up to 12 seats" },
  { label: "NON-STOP ENDURANCE", value: "14 hrs" },
  { label: "BAGGAGE CAPACITY", value: "5.52 m³" },
  { label: "CRUISING ALTITUDE", value: "15,544 m" },
];

const CABIN_DIMS = [
  { label: "CABIN LENGTH", value: "14.27 m" },
  { label: "CABIN WIDTH", value: "2.49 m" },
  { label: "CABIN HEIGHT", value: "1.91 m" },
];

export default function PlaneMorph({
  preloader,
  frameCount = 120,
}: PlaneMorphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 30,
    mass: 0.35,
  });

  // Phase 1: Exterior ("Fly in" / "Luxury") fades out before roof opens
  const phase1Opacity = useTransform(smoothProgress, [0, 0.3, 0.44], [1, 1, 0]);
  const phase1Blur = useTransform(
    smoothProgress,
    [0.28, 0.44],
    ["blur(0px)", "blur(10px)"]
  );
  const phase1Y = useTransform(smoothProgress, [0.28, 0.46], [0, -28]);

  // Phase 2: Interior cabin floorplan & technical specs emerge as morph completes
  const phase2Opacity = useTransform(
    smoothProgress,
    [0.48, 0.64, 0.96, 1],
    [0, 1, 1, 0.9]
  );
  const phase2Blur = useTransform(
    smoothProgress,
    [0.48, 0.64],
    ["blur(12px)", "blur(0px)"]
  );
  const phase2Y = useTransform(smoothProgress, [0.48, 0.66], [30, 0]);

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
        drawFrameToCanvas(canvas, img, "cover");
      }
    };

    renderAtProgress(smoothProgress.get());

    const unsubscribe = smoothProgress.on("change", (latest) => {
      renderAtProgress(latest);
    });

    const handleResize = () => renderAtProgress(smoothProgress.get());
    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [smoothProgress, preloader.imagesRef, preloader.isFirstFrameReady, preloader.loadedCount, frameCount]);

  return (
    <section
      id="flight"
      ref={containerRef}
      className="relative h-[420vh] w-full light-bg text-[#141010]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background gradient safety layer matching exact sequence-2 studio tones */}
        <div className="absolute inset-0 light-bg" />

        {/* Scrubbed Jet -> Interior Blueprint Canvas */}
        <canvas
          ref={canvasRef}
          className="relative z-[1] h-full w-full block contrast-[1.03]"
          aria-label="TonkJet Gulfstream 650ER exterior to interior cabin morph"
        />

        {/* Ultra-subtle organic cinema grain */}
        <div className="pointer-events-none absolute inset-0 cinema-grain z-[2]" />

        {/* Top & bottom soft color feathers for seamless transition with About & Advantages */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 z-[2]"
          style={{
            background:
              "linear-gradient(180deg, rgba(139,133,125,0.65) 0%, rgba(139,133,125,0) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 z-[2]"
          style={{
            background:
              "linear-gradient(0deg, #FFF8ED 0%, rgba(255,248,237,0) 100%)",
          }}
        />

        {/* PHASE 1 OVERLAY: "Fly in" — Jet — "Luxury" */}
        <motion.div
          style={{
            opacity: phase1Opacity,
            filter: phase1Blur,
            y: phase1Y,
          }}
          className="pointer-events-none absolute inset-0 z-10 mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24 pt-24 pb-24 flex flex-col justify-between"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.26em] uppercase text-[#141010]/65">
            <span>OUR FLAGSHIP FLEET</span>
            <span className="hidden sm:inline">GULFSTREAM · 650ER</span>
          </div>

          {/* Center Flanking Display Titles */}
          <div className="flex items-center justify-between w-full">
            <h2 className="font-display text-4xl sm:text-6xl md:text-[78px] lg:text-[92px] font-medium tracking-[-0.03em] leading-none text-[#141010]">
              Fly in
            </h2>
            <h2 className="font-display text-4xl sm:text-6xl md:text-[78px] lg:text-[92px] font-medium tracking-[-0.03em] leading-none text-[#141010] text-right">
              Luxury
            </h2>
          </div>

          {/* Bottom Split Descriptions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xs">
              <p className="font-display text-xl md:text-2xl font-medium tracking-[-0.01em] text-[#141010]">
                Luxury that moves with you
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#312726]/75">
                Engineered for intercontinental range without compromise —
                connecting global capitals non-stop in whisper-quiet serenity.
              </p>
            </div>

            <div className="max-w-xs md:text-right">
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#141010]/60">
                TONKJET · G650ER
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#312726]/80">
                Powered by twin Rolls-Royce BR725 engines, combining flagship
                aeronautical performance with bespoke hand-stitched cabins.
              </p>
            </div>
          </div>
        </motion.div>

        {/* PHASE 2 OVERLAY: Interior Floorplan Specs & Architecture */}
        <motion.div
          style={{
            opacity: phase2Opacity,
            filter: phase2Blur,
            y: phase2Y,
          }}
          className="pointer-events-none absolute inset-0 z-10 mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24 pt-24 pb-24 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.26em] uppercase text-[#141010]/65">
            <span>CABIN ARCHITECTURE &amp; SPECS</span>
            <span className="hidden sm:inline">4 LIVING ZONES · 12 SEATS</span>
          </div>

          {/* Left Specs Grid & Right Cabin Summary flanking the open-cabin jet */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 my-auto">
            {/* Left Technical Specs */}
            <div className="lg:col-span-3 max-w-[320px] bg-[#FFF8ED]/70 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none p-5 lg:p-0 rounded-2xl lg:rounded-none border border-[#141010]/10 lg:border-0">
              <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 border-t border-[#141010]/20 pt-4">
                {SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="border-b border-[#141010]/15 pb-2.5"
                  >
                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#312726]/65">
                      {spec.label}
                    </p>
                    <p className="mt-1 font-display text-base xl:text-lg font-medium text-[#141010]">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cabin Dimensions Strip */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {CABIN_DIMS.map((dim) => (
                  <div key={dim.label}>
                    <p className="font-mono text-[8.5px] tracking-[0.14em] uppercase text-[#312726]/60">
                      {dim.label}
                    </p>
                    <p className="mt-0.5 text-[13px] font-semibold text-[#141010]">
                      {dim.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Spacer keeping the jet fuselage & swept wings completely unobstructed */}
            <div className="hidden lg:block lg:col-span-6" />

            {/* Right Cabin Highlight Column */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-end text-right">
              <span className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-[#312726]/65">
                ULTRA-LONG-RANGE AIRCRAFT
              </span>
              <h3 className="mt-2 font-display text-4xl font-medium tracking-[-0.02em] text-[#141010]">
                TonkJet G650ER
              </h3>
              <div className="my-5 h-[1px] w-20 bg-[#141010]/25" />
              <p className="max-w-xs text-[14px] leading-relaxed text-[#312726]/80">
                Featuring a forward gourmet galley, dual club seating lounges,
                private aft stateroom sofa, and 100% fresh cabin air replenished
                every two minutes.
              </p>

              <div className="mt-7 flex flex-col items-end gap-2 text-[11px] font-mono tracking-[0.18em] uppercase text-[#141010]/70">
                <span>01 · COCKPIT &amp; FORWARD GALLEY</span>
                <span>02 · EXECUTIVE CLUB SEATING</span>
                <span>03 · PRIVATE AFT LOUNGE SUITE</span>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </motion.div>
      </div>
    </section>
  );
}
