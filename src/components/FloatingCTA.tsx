"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

interface FloatingCTAProps {
  onOpenBooking: () => void;
}

export default function FloatingCTA({ onOpenBooking }: FloatingCTAProps) {
  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <motion.button
        type="button"
        onClick={onOpenBooking}
        whileTap={{ scale: 0.96 }}
        className="group flex items-center gap-1.5 rounded-full bg-[#FFF8ED] p-1.5 pl-6 text-[#141010] cta-ambient-shadow border border-[#141010]/10 transition-transform duration-300 hover:scale-[1.03]"
      >
        <span className="text-[13px] font-medium tracking-[0.01em] pr-2">
          <span className="text-roll">
            <span className="text-roll-inner">Book the Flight</span>
            <span className="text-roll-clone" aria-hidden="true">
              Book the Flight
            </span>
          </span>
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#141010] text-[#FFF8ED] overflow-hidden relative transition-colors duration-300 group-hover:bg-[#312726]">
          <Plane className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
          <Plane
            aria-hidden="true"
            className="h-4 w-4 -rotate-45 absolute -translate-x-5 translate-y-5 transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </span>
      </motion.button>
    </div>
  );
}
