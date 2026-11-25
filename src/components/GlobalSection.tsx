"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plane } from "lucide-react";

const WebGLGlobe = dynamic(() => import("./WebGLGlobe"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-64 w-64 rounded-full border border-[#FFF8ED]/10 animate-pulse" />
    </div>
  ),
});

const CITIES = [
  "Istanbul",
  "Zurich",
  "Dubai",
  "London",
  "New York",
  "Nice",
  "Tokyo",
  "Geneva",
  "Singapore",
  "São Paulo",
  "Seoul",
  "Doha",
];

// Deterministic barcode bars for the authentic boarding pass card
const BARCODE_WEIGHTS = [
  2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 2, 3, 1, 1, 4, 2, 1,
  3, 1, 2, 2, 1, 3,
];

interface GlobalSectionProps {
  onOpenBooking: () => void;
}

export default function GlobalSection({ onOpenBooking }: GlobalSectionProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end end"],
  });

  // Boarding pass glides vertically across the dark 3D globe stage
  const cardY = useTransform(scrollYProgress, [0.15, 0.85], [140, -130]);
  const cardRotate = useTransform(scrollYProgress, [0.15, 0.85], [1.8, -1.2]);
  const globeScale = useTransform(scrollYProgress, [0.1, 0.9], [0.94, 1.06]);

  return (
    <section
      id="global"
      ref={stageRef}
      className="relative w-full dark-bg text-[#FFF8ED] overflow-hidden"
    >
      {/* 1. UPPER CENTERPIECE: "Fly anywhere" + Rolling City Wheel */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24 pt-28 md:pt-40 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
          <motion.h2
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.025em] text-[#FFF8ED]"
          >
            Fly anywhere
          </motion.h2>

          {/* Minimal Aviation Connector Icon */}
          <div className="flex items-center gap-3 text-[#FFF8ED]/45">
            <span className="h-[1px] w-10 bg-[#FFF8ED]/25" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FFF8ED]/20 bg-[#FFF8ED]/5">
              <Plane className="h-4 w-4 rotate-45 text-[#FFF8ED]" />
            </span>
            <span className="h-[1px] w-10 bg-[#FFF8ED]/25" />
          </div>

          {/* Vertically Masked Rolling City Wheel */}
          <div className="relative h-[220px] sm:h-[260px] w-64 sm:w-80 overflow-hidden city-wheel-mask">
            <div className="animate-city-roll flex flex-col items-center md:items-start">
              {[...CITIES, ...CITIES].map((city, idx) => (
                <div
                  key={`${city}-${idx}`}
                  className="py-1.5 font-display text-3xl sm:text-4xl md:text-[42px] font-medium tracking-[-0.02em] text-[#FFF8ED] leading-tight"
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOWER CENTERPIECE: Oversized "Global" + 3D Looping Globe Video + Parallax Boarding Pass */}
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24 pt-10 pb-24 md:pt-16 md:pb-36">
        <div className="relative flex flex-col items-center justify-center min-h-[680px] md:min-h-[840px]">
          {/* Oversized Dark-Fading "Global" Backdrop Typography */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-x-0 top-4 md:top-0 flex justify-center z-0"
          >
            <span
              className="font-display text-[22vw] lg:text-[260px] font-semibold leading-none tracking-[-0.04em] bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,248,237,0.18) 0%, rgba(255,248,237,0.04) 68%, rgba(255,248,237,0) 100%)",
              }}
            >
              Global
            </span>
          </div>

          {/* Live 4K Retina WebGL 3D Globe */}
          <motion.div
            style={{ scale: globeScale }}
            className="relative z-[1] w-full max-w-[760px] aspect-square flex flex-col items-center justify-center"
          >
            <WebGLGlobe />
            <span className="pointer-events-none -mt-6 font-mono text-[10px] tracking-[0.28em] uppercase text-[#FFF8ED]/40">
              DRAG TO ROTATE · LIVE 3D FLIGHT NETWORK
            </span>
          </motion.div>

          {/* Parallax Warm-Ivory Boarding Pass Card ("5K+ flights") */}
          <motion.div
            style={{ y: cardY, rotate: cardRotate }}
            className="relative md:absolute md:right-8 lg:right-16 md:top-1/2 md:-translate-y-1/2 z-20 mt-8 md:mt-0 w-full max-w-[330px] rounded-2xl bg-[#FFF8ED] text-[#141010] shadow-[0_32px_80px_rgba(0,0,0,0.65)] border border-[#141010]/10 overflow-hidden"
          >
            {/* Boarding Pass Top Header */}
            <div className="p-6 pb-5 border-b border-dashed border-[#141010]/20">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-[#312726]/60">
                    PRIVATE BOARDING PASS
                  </span>
                  <div className="mt-2 font-display text-5xl font-semibold tracking-[-0.03em] leading-none text-[#141010]">
                    5K+
                  </div>
                  <p className="mt-1 font-display text-lg font-medium text-[#312726]">
                    flights
                  </p>
                </div>

                {/* Vertical Aviation Barcode */}
                <div
                  className="flex flex-col gap-[2px] pt-1"
                  aria-hidden="true"
                >
                  {BARCODE_WEIGHTS.map((w, i) => (
                    <span
                      key={i}
                      className="block w-8 bg-[#141010]"
                      style={{ height: `${w}px`, opacity: i % 3 === 0 ? 0.9 : 0.72 }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-[#312726]/70">
                <span>SUCCESSFULLY ARRANGED</span>
                <span>TJ · 650ER</span>
              </div>
            </div>

            {/* Ticket Notch Cutouts */}
            <div className="relative flex items-center justify-between -mt-2.5 px-0 pointer-events-none">
              <span className="h-5 w-5 -ml-2.5 rounded-full bg-[#090707]" />
              <span className="h-5 w-5 -mr-2.5 rounded-full bg-[#090707]" />
            </div>

            {/* Boarding Pass Body */}
            <div className="p-6 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#141010] text-[#FFF8ED] font-display text-sm font-semibold tracking-[0.14em]">
                  TJ
                </div>
                <div className="text-right font-mono text-[10px] tracking-[0.18em] uppercase text-[#312726]/65">
                  <div>IST ✈ GVA · DXB</div>
                  <div className="mt-0.5 text-[#141010] font-medium">
                    PRIORITY CLEARANCE
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[13px] leading-relaxed text-[#312726]/80">
                Every route is orchestrated with sovereign discretion, direct
                slot coordination, and bespoke inflight standards across 174
                countries.
              </p>

              <button
                type="button"
                onClick={onOpenBooking}
                className="mt-6 w-full rounded-full bg-[#141010] py-3 text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFF8ED] transition-colors duration-300 hover:bg-[#312726]"
              >
                Request Charter Dispatch
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. EDITORIAL FOOTER */}
      <footer className="relative z-10 border-t border-[#FFF8ED]/10">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24 pt-16 pb-28 md:pt-20 md:pb-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            {/* Left Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.08] tracking-[-0.025em] text-[#FFF8ED]">
                Fly anywhere with total comfort and control
              </h3>
            </motion.div>

            {/* Right Inquiries */}
            <div className="flex flex-col lg:items-end text-left lg:text-right">
              <span className="font-mono text-[10.5px] tracking-[0.26em] uppercase text-[#FFF8ED]/45">
                FOR INQUIRIES
              </span>
              <a
                href="mailto:info@tonkjet.com"
                className="group mt-3 font-display text-xl sm:text-2xl font-medium text-[#FFF8ED] hover:opacity-80 transition-opacity"
              >
                <span className="text-roll">
                  <span className="text-roll-inner">info@tonkjet.com</span>
                  <span className="text-roll-clone" aria-hidden="true">
                    info@tonkjet.com
                  </span>
                </span>
              </a>
              <a
                href="tel:+971548805050"
                className="group mt-1.5 font-display text-xl sm:text-2xl font-medium text-[#FFF8ED]/80 hover:text-[#FFF8ED] transition-colors"
              >
                <span className="text-roll">
                  <span className="text-roll-inner">+971 54 880 5050</span>
                  <span className="text-roll-clone" aria-hidden="true">
                    +971 54 880 5050
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Legal & Signature Strip */}
          <div className="mt-16 pt-8 border-t border-[#FFF8ED]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10.5px] font-mono tracking-[0.2em] uppercase text-[#FFF8ED]/45">
            <div className="flex flex-wrap items-center gap-6">
              <span>© 2026 TONKJET. ALL RIGHTS RESERVED</span>
              <a
                href="#hero"
                className="hover:text-[#FFF8ED] transition-colors"
              >
                PRIVACY POLICY
              </a>
            </div>

            <div className="flex items-center gap-3 text-[#FFF8ED]/60">
              <span>CRAFTED FOR</span>
              <span className="font-display font-semibold tracking-[0.22em] text-[#FFF8ED]">
                TONKJET AVIATION
              </span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
