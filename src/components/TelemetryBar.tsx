"use client";

import { useEffect, useState } from "react";

export default function TelemetryBar() {
  const [timeStr, setTimeStr] = useState("--:--");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Istanbul",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setTimeStr(formatted);
      } catch {
        const now = new Date();
        setTimeStr(
          `${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
          ).padStart(2, "0")}`
        );
      }
    };

    updateClock();
    const id = setInterval(updateClock, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="data"
      className="w-full bg-[#FFF8ED] text-[#141010] border-t border-[#141010]/12"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#141010]/12">
          <div className="py-7 sm:pr-8 flex items-baseline justify-between sm:justify-start sm:gap-4">
            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-[#312726]/55">
              COUNTRIES SUPPORTED
            </span>
            <span className="font-display text-lg md:text-xl font-medium tracking-[-0.01em]">
              174
            </span>
          </div>

          <div className="py-7 sm:px-8 flex items-baseline justify-between sm:justify-center sm:gap-4">
            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-[#312726]/55">
              BASED IN
            </span>
            <span className="font-display text-lg md:text-xl font-medium tracking-[-0.01em]">
              ISTANBUL &amp; DUBAI
            </span>
          </div>

          <div className="py-7 sm:pl-8 flex items-baseline justify-between sm:justify-end sm:gap-4">
            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-[#312726]/55">
              LOCAL TIME
            </span>
            <span className="font-mono text-lg md:text-xl font-medium tracking-[0.06em]">
              {timeStr}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
