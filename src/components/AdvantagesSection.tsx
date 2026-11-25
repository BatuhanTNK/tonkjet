"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  caption: string;
}

const ADVANTAGES: AdvantageItem[] = [
  {
    id: "pets",
    title: "Pets",
    description:
      "Traveling with pets on a private jet means zero compromises. Your companions relax right beside you in the cabin — with bespoke comfort bedding, tailored cabin preparation, and seamless international clearance.",
    image: "/images/advantage-pets.jpg",
    alt: "Pet relaxing in a luxury TonkJet private cabin",
    caption: "CABIN COMPANION · ZERO COMPROMISES",
  },
  {
    id: "availability",
    title: "24/7 availability",
    description:
      "Our flight operations desk stands ready around the clock, 365 days a year. Confirm an urgent departure and be wheels-up from private terminals in as little as four hours.",
    image: "/images/advantage-availability.jpg",
    alt: "TonkJet aircraft prepared outside twilight hangar",
    caption: "FLIGHT DESK · 365 DAYS DISPATCH",
  },
  {
    id: "onboard",
    title: "Onboard services",
    description:
      "Every detail in the air reflects your taste — from Michelin-caliber dining curated before departure to fine vintages, high-speed global Wi-Fi, and serene cabin acoustics.",
    image: "/images/advantage-onboard.jpg",
    alt: "Serene passenger enjoying TonkJet onboard hospitality",
    caption: "BESPOKE HOSPITALITY · AT 45,000 FT",
  },
  {
    id: "efficient",
    title: "Efficient",
    description:
      "Arrive fifteen minutes before takeoff, bypass commercial queues entirely, and land at executive airfields closer to your final destination — turning travel time into pure momentum.",
    image: "/images/advantage-efficient.jpg",
    alt: "Swept aircraft wing gliding above golden-hour clouds",
    caption: "DIRECT ROUTING · 5,000+ AIRPORTS",
  },
];

export default function AdvantagesSection() {
  const [activeId, setActiveId] = useState<string>(ADVANTAGES[0].id);
  const activeItem =
    ADVANTAGES.find((item) => item.id === activeId) ?? ADVANTAGES[0];

  return (
    <section
      id="benefits"
      className="relative w-full bg-[#FFF8ED] text-[#141010] border-t border-[#141010]/12"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Eyebrow + 4-Item Accordion */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.26em] uppercase text-[#312726]/65">
                <span className="h-[1px] w-8 bg-[#141010]/30" />
                <span>A BETTER WAY TO FLY</span>
              </div>

              <div className="mt-10 border-t border-[#141010]/15">
                {ADVANTAGES.map((item) => {
                  const isOpen = item.id === activeId;
                  return (
                    <div
                      key={item.id}
                      className="border-b border-[#141010]/15 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        className="group flex w-full items-center justify-between py-6 md:py-7 text-left cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span
                          className={`font-display text-2xl sm:text-3xl md:text-[34px] font-medium tracking-[-0.02em] transition-colors duration-300 ${
                            isOpen
                              ? "text-[#141010]"
                              : "text-[#141010]/45 group-hover:text-[#141010]/80"
                          }`}
                        >
                          {item.title}
                        </span>

                        {/* Animated + / - indicator */}
                        <span className="relative ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#141010]/15 transition-colors duration-300 group-hover:border-[#141010]/45">
                          <span className="h-[1.5px] w-3 bg-[#141010]" />
                          <span
                            className={`absolute h-3 w-[1.5px] bg-[#141010] transition-transform duration-300 ${
                              isOpen ? "scale-y-0 rotate-90" : "scale-y-100"
                            }`}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key={`${item.id}-content`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.48,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="pb-7 pr-8 max-w-lg text-[14.5px] md:text-[15px] leading-relaxed text-[#312726]/80">
                              {item.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 hidden lg:flex items-center justify-between text-[11px] font-mono tracking-[0.22em] uppercase text-[#312726]/50">
              <span>TONKJET PRIVATE STANDARDS</span>
              <span>
                0{ADVANTAGES.findIndex((i) => i.id === activeId) + 1} / 0
                {ADVANTAGES.length}
              </span>
            </div>
          </div>

          {/* Right Column: Full-Height Editorial Photo Swap */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[680px] w-full overflow-hidden rounded-sm bg-[#E9E0D2]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeItem.image}
                    alt={activeItem.alt}
                    className="h-full w-full object-cover"
                  />
                  {/* Subtle editorial gradient footer inside image */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(20,16,16,0) 0%, rgba(20,16,16,0.45) 100%)",
                    }}
                  />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px] font-mono tracking-[0.24em] uppercase text-[#FFF8ED]/90">
                    <span>{activeItem.caption}</span>
                    <span>TONKJET®</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
