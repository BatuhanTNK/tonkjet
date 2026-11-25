"use client";

import { motion } from "framer-motion";

const PILLARS = [
  {
    index: "01",
    title: "Direct Access to Private Travel",
    description:
      "Fly beyond commercial schedules with direct tarmac access, private terminals, and immediate dispatch tailored to your itinerary across five continents.",
  },
  {
    index: "02",
    title: "Your Freedom to Enjoy Life",
    description:
      "Reclaim every hour in the air. Bespoke cabin acoustics, high-speed satellite connectivity, and tranquil private zones let you work or unwind effortlessly.",
  },
  {
    index: "03",
    title: "Precision and Excellence",
    description:
      "Every mission is overseen by senior flight operations specialists, pairing immaculate maintenance standards with discreet white-glove flight crews.",
  },
  {
    index: "04",
    title: "Global Reach, Personal Touch",
    description:
      "From Geneva and Istanbul to Dubai, Tokyo, and New York — one dedicated aviation advisor orchestrates your departure, catering, and ground transfers.",
  },
];

const blurReveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full sky-about-bg text-[#141010] pt-32 pb-44 md:pt-44 md:pb-56"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24">
        {/* Eyebrow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={blurReveal}
          className="flex items-center gap-3 text-[11px] font-mono tracking-[0.26em] uppercase text-[#141010]/60"
        >
          <span className="h-[1px] w-8 bg-[#141010]/35" />
          <span>ABOUT TONKJET</span>
        </motion.div>

        {/* Large Manifesto Statement (Jesko-style blur-to-sharp reveal) */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          custom={0.08}
          variants={blurReveal}
          className="mt-8 max-w-5xl font-display text-3xl sm:text-4xl md:text-[52px] lg:text-[58px] font-medium leading-[1.12] tracking-[-0.025em] text-[#141010]"
        >
          TonkJet® is a private aviation operator with over 5,000 missions
          completed across 170+ countries. From international executives to
          visionary founders, our clients rely on us for absolute precision,
          quiet luxury, and complete freedom in the sky.
        </motion.h2>

        {/* 2x2 Hairline Editorial Grid */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 border-t border-[#141010]/15">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i * 0.1}
              variants={blurReveal}
              className={`py-10 md:py-14 border-b border-[#141010]/15 ${
                i % 2 === 0 ? "md:pr-14 md:border-r" : "md:pl-14"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl md:text-2xl font-medium tracking-[-0.015em] text-[#141010]">
                  {pillar.title}
                </h3>
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#141010]/40">
                  {pillar.index}
                </span>
              </div>
              <p className="mt-4 max-w-md text-[14px] md:text-[15px] leading-relaxed text-[#312726]/75">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
