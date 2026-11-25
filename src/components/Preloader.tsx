"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  progress: number;
  isReady: boolean;
}

export default function Preloader({ progress, isReady }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 1150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isReady && minElapsed) {
      const t = setTimeout(() => setVisible(false), 320);
      return () => clearTimeout(t);
    }
  }, [isReady, minElapsed]);

  // Safety fallback so preloader can never hang
  useEffect(() => {
    const hardStop = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(hardStop);
  }, []);

  const displayPercent = Math.min(100, Math.round(progress * 100));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="tonkjet-preloader"
          initial={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            opacity: 0,
            transition: {
              clipPath: { duration: 1.05, ease: [0.76, 0, 0.24, 1] },
              opacity: { duration: 0.65, delay: 0.4, ease: "easeOut" },
            },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center dark-bg text-[#FFF8ED] pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center px-6"
          >
            <div className="font-display text-3xl md:text-5xl font-semibold tracking-[0.22em] uppercase text-[#FFF8ED]">
              TonkJet
            </div>
            <p className="mt-3 text-[11px] md:text-xs tracking-[0.34em] uppercase text-[#FFF8ED]/55">
              Private Jet Charter Worldwide
            </p>

            {/* Minimal hairline loader */}
            <div className="mt-10 w-44 h-[1px] bg-[#FFF8ED]/15 overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#FFF8ED]"
                initial={{ width: "8%" }}
                animate={{ width: `${Math.max(12, displayPercent)}%` }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </div>

            <span className="mt-3 font-mono text-[10px] tracking-[0.24em] text-[#FFF8ED]/45">
              {String(displayPercent).padStart(3, "0")}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
