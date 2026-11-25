"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

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

export default function PlaneMorph() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.35,
  });

  // Subtle majestic scale breathing during the morph
  const jetScale = useTransform(smoothProgress, [0, 1], [1.0, 1.055]);

  // Feathered top-to-bottom CSS mask sweep peeling away the 4K exterior roof to reveal the 4K interior
  const maskLead = useTransform(smoothProgress, [0.22, 0.72], [-18, 108]);
  const maskTrail = useTransform(smoothProgress, [0.22, 0.72], [0, 126]);
  const exteriorMask = useMotionTemplate`linear-gradient(180deg, rgba(0,0,0,0) ${maskLead}%, rgba(0,0,0,1) ${maskTrail}%)`;

  // Delicate luminous scan hairline gliding down the fuselage frontier during the morph
  const scanTop = useTransform(smoothProgress, [0.22, 0.72], ["4%", "96%"]);
  const scanOpacity = useTransform(
    smoothProgress,
    [0.2, 0.3, 0.66, 0.75],
    [0, 0.65, 0.65, 0]
  );

  // Phase 1: Exterior ("Fly in" / "Luxury") fades out before roof peels open
  const phase1Opacity = useTransform(smoothProgress, [0, 0.24, 0.38], [1, 1, 0]);
  const phase1Blur = useTransform(
    smoothProgress,
    [0.24, 0.38],
    ["blur(0px)", "blur(10px)"]
  );
  const phase1Y = useTransform(smoothProgress, [0.24, 0.4], [0, -28]);

  // Phase 2: Interior cabin architecture & specs emerge cleanly
  const phase2Opacity = useTransform(
    smoothProgress,
    [0.48, 0.65, 0.96, 1],
    [0, 1, 1, 0.92]
  );
  const phase2Blur = useTransform(
    smoothProgress,
    [0.48, 0.65],
    ["blur(12px)", "blur(0px)"]
  );
  const phase2Y = useTransform(smoothProgress, [0.48, 0.66], [30, 0]);

  return (
    <section
      id="flight"
      ref={containerRef}
      className="relative h-[360vh] w-full light-bg text-[#141010]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background gradient safety layer matching exact studio tones */}
        <div className="absolute inset-0 light-bg" />

        {/* DUAL 4K LAYERED MORPH STAGE */}
        <motion.div
          style={{ scale: jetScale }}
          className="relative z-[1] h-full w-full will-change-transform"
        >
          {/* Bottom Layer: 4K Open Interior Cabin Plan */}
          <img
            src="/layers/plane-interior-4k.webp"
            alt="TonkJet Gulfstream 650ER 4K interior cabin layout"
            className="absolute inset-0 h-full w-full object-cover contrast-[1.03]"
          />

          {/* Top Layer: 4K Exterior Fuselage peeled away by feathered CSS mask */}
          <motion.div
            style={{
              WebkitMaskImage: exteriorMask,
              maskImage: exteriorMask,
            }}
            className="absolute inset-0 will-change-[mask-image]"
          >
            <img
              src="/layers/plane-exterior-4k.webp"
              alt="TonkJet Gulfstream 650ER 4K exterior top-down view"
              className="h-full w-full object-cover contrast-[1.03]"
            />
          </motion.div>

          {/* Subtle Blueprint Scan Line at the Mask Frontier */}
          <motion.div
            style={{ top: scanTop, opacity: scanOpacity }}
            className="pointer-events-none absolute inset-x-0 z-[3] flex justify-center"
          >
            <div className="h-[1.5px] w-[42%] max-w-[540px] bg-gradient-to-r from-transparent via-[#FFF8ED] to-transparent shadow-[0_0_24px_rgba(255,248,237,0.9)]" />
          </motion.div>
        </motion.div>

        {/* Top & bottom soft color feathers for seamless transition with About & Advantages */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 z-[4]"
          style={{
            background:
              "linear-gradient(180deg, rgba(139,133,125,0.65) 0%, rgba(139,133,125,0) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 z-[4]"
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
          <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.26em] uppercase text-[#141010]/65">
            <span>OUR FLAGSHIP FLEET</span>
            <span className="hidden sm:inline">GULFSTREAM · 650ER</span>
          </div>

          <div className="flex items-center justify-between w-full">
            <h2 className="font-display text-4xl sm:text-6xl md:text-[78px] lg:text-[92px] font-medium tracking-[-0.03em] leading-none text-[#141010]">
              Fly in
            </h2>
            <h2 className="font-display text-4xl sm:text-6xl md:text-[78px] lg:text-[92px] font-medium tracking-[-0.03em] leading-none text-[#141010] text-right">
              Luxury
            </h2>
          </div>

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

        {/* PHASE 2 OVERLAY: Interior Floorplan Specs & Vector CAD Annotations */}
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

            {/* Center Spacer with Subtle Razor-Sharp Vector CAD Dimension Bracket */}
            <div className="hidden lg:flex lg:col-span-6 items-center justify-center">
              <svg
                viewBox="0 0 420 520"
                className="h-[58vh] w-auto opacity-45"
                fill="none"
                aria-hidden="true"
              >
                {/* Vertical Cabin Length Measurement Line (14.27 m) */}
                <line
                  x1="312"
                  y1="92"
                  x2="312"
                  y2="418"
                  stroke="#141010"
                  strokeWidth="0.75"
                  strokeDasharray="3 4"
                />
                <line x1="304" y1="92" x2="320" y2="92" stroke="#141010" strokeWidth="0.9" />
                <line x1="304" y1="418" x2="320" y2="418" stroke="#141010" strokeWidth="0.9" />
                <circle cx="312" cy="170" r="2.2" fill="#141010" />
                <circle cx="312" cy="265" r="2.2" fill="#141010" />
                <circle cx="312" cy="360" r="2.2" fill="#141010" />
                <text
                  x="326"
                  y="260"
                  fill="#141010"
                  fontSize="9"
                  fontFamily="monospace"
                  letterSpacing="2"
                >
                  14.27 M
                </text>
              </svg>
            </div>

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
