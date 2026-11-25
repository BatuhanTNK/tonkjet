"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scrollToSection } from "./SmoothScroll";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Our Fleet", href: "#flight" },
  { label: "Advantages", href: "#benefits" },
  { label: "Global", href: "#global" },
];

export default function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState<string>("");
  const [showDockedBrand, setShowDockedBrand] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      // Dock brand into header once Hero window zoom passes ~35% of hero
      setShowDockedBrand(y > vh * 0.65);

      const aboutEl = document.getElementById("about");
      const flightEl = document.getElementById("flight");
      const benefitsEl = document.getElementById("benefits");
      const dataEl = document.getElementById("data");
      const globalEl = document.getElementById("global");

      const probeY = y + 80;

      // Determine active section for frosted pill highlight
      if (globalEl && probeY >= globalEl.offsetTop - 80) {
        setActiveSection("#global");
      } else if (benefitsEl && probeY >= benefitsEl.offsetTop - 80) {
        setActiveSection("#benefits");
      } else if (flightEl && probeY >= flightEl.offsetTop - 80) {
        setActiveSection("#flight");
      } else if (aboutEl && probeY >= aboutEl.offsetTop - 80) {
        setActiveSection("#about");
      } else {
        setActiveSection("");
      }

      // Dynamic theme inversion: dark ink over light Ivory/Taupe/Cloud sections, white ink over Hero & Global
      const lightStart = aboutEl ? aboutEl.offsetTop - 60 : vh * 3.5;
      const lightEnd = globalEl
        ? globalEl.offsetTop - 40
        : dataEl
        ? dataEl.offsetTop + dataEl.offsetHeight
        : Infinity;

      if (probeY >= lightStart && probeY < lightEnd) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const isLight = theme === "light";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-500 ${
        isLight
          ? "text-[#141010] bg-[#FFF8ED]/45 backdrop-blur-md"
          : showDockedBrand
          ? "text-[#FFF8ED] bg-[#050505]/25 backdrop-blur-md"
          : "text-[#FFF8ED]"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-14 lg:px-24">
        {/* Left Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className={`group relative rounded-full px-3.5 py-1.5 text-[12px] md:text-[13px] font-medium tracking-[0.02em] transition-all duration-300 ${
                  isActive
                    ? isLight
                      ? "bg-[#141010]/10 backdrop-blur-md"
                      : "bg-[#FFF8ED]/15 backdrop-blur-md"
                    : isLight
                    ? "hover:bg-[#141010]/5"
                    : "hover:bg-[#FFF8ED]/10"
                }`}
              >
                <span className="text-roll">
                  <span className="text-roll-inner">{item.label}</span>
                  <span className="text-roll-clone" aria-hidden="true">
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Center Docked Brand Wordmark */}
        <motion.button
          type="button"
          onClick={() => scrollToSection("#hero")}
          initial={false}
          animate={{
            opacity: showDockedBrand ? 1 : 0,
            y: showDockedBrand ? 0 : 10,
            pointerEvents: showDockedBrand ? "auto" : "none",
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 font-display text-[17px] md:text-[19px] font-semibold tracking-[0.18em] uppercase cursor-pointer"
        >
          TonkJet
        </motion.button>

        {/* Right Direct Charter Contact */}
        <div className="hidden lg:flex items-center gap-6 text-[12.5px] font-medium tracking-[0.02em]">
          <a
            href="mailto:info@tonkjet.com"
            className="group opacity-85 hover:opacity-100 transition-opacity"
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
            className="group opacity-85 hover:opacity-100 transition-opacity"
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
    </header>
  );
}
