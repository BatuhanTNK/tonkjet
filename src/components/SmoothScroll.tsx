"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __tonkLenis?: Lenis;
  }
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    window.__tonkLenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__tonkLenis;
    };
  }, []);

  return <>{children}</>;
}

export function scrollToSection(id: string) {
  const el = document.querySelector(id) as HTMLElement | null;
  if (!el) return;
  if (window.__tonkLenis) {
    window.__tonkLenis.scrollTo(el, { duration: 1.4, offset: 0 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
