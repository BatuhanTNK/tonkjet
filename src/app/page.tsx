"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import FloatingCTA from "@/components/FloatingCTA";
import HeroScroll from "@/components/HeroScroll";
import AboutSection from "@/components/AboutSection";
import PlaneMorph from "@/components/PlaneMorph";
import AdvantagesSection from "@/components/AdvantagesSection";
import TelemetryBar from "@/components/TelemetryBar";
import GlobalSection from "@/components/GlobalSection";
import BookingDrawer from "@/components/BookingDrawer";

const CORE_4K_ASSETS = [
  "/layers/hero-window-4k.webp",
  "/layers/hero-clouds-4k.webp",
  "/layers/plane-exterior-4k.webp",
  "/layers/plane-interior-4k.webp",
];

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let loaded = 0;
    let cancelled = false;

    CORE_4K_ASSETS.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      const done = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadProgress(loaded / CORE_4K_ASSETS.length);
        if (loaded >= CORE_4K_ASSETS.length) {
          setIsReady(true);
        }
      };
      img.onload = done;
      img.onerror = done;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#050505]">
      {/* Cinematic Mask Preloader */}
      <Preloader progress={loadProgress} isReady={isReady} />

      {/* Dynamic Theme-Inverting Fixed Header */}
      <Header />

      {/* Section 1: 4K Layered Cabin Window Zoom-Through + Drifting Clouds */}
      <HeroScroll />

      {/* Section 2: Sky-to-Ivory Manifesto & 4 Pillars */}
      <AboutSection />

      {/* Section 3: 4K Dual-Layer Gulfstream 650ER Exterior -> Interior CSS Mask Morph */}
      <PlaneMorph />

      {/* Section 4: "A Better Way to Fly" Interactive Accordion & Editorial Photography */}
      <AdvantagesSection />

      {/* Section 5: Live Telemetry Strip */}
      <TelemetryBar />

      {/* Section 6: Global Rolling City Wheel, Live 4K WebGL 3D Globe, Parallax Boarding Pass & Footer */}
      <GlobalSection onOpenBooking={() => setBookingOpen(true)} />

      {/* Persistent Floating Bottom-Center CTA Pill */}
      {!bookingOpen && (
        <FloatingCTA onOpenBooking={() => setBookingOpen(true)} />
      )}

      {/* Bottom-Docked Charter Booking Drawer */}
      <BookingDrawer
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </main>
  );
}
