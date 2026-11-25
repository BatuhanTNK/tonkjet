"use client";

import { useState } from "react";
import { useImagePreloader } from "@/hooks/useImagePreloader";
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

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  // Preload both scroll-scrubbed 1080p WebP sequences with priority keyframe caching
  const heroPreloader = useImagePreloader({
    basePath: "/sequence-1",
    frameCount: 158,
    filePrefix: "frame-",
    extension: "webp",
    priorityCount: 32,
  });

  const planePreloader = useImagePreloader({
    basePath: "/sequence-2",
    frameCount: 158,
    filePrefix: "frame-",
    extension: "webp",
    priorityCount: 28,
  });

  const combinedProgress =
    heroPreloader.progress * 0.7 + planePreloader.progress * 0.3;

  return (
    <main className="relative min-h-screen w-full bg-[#050505]">
      {/* Cinematic Mask Preloader */}
      <Preloader
        progress={combinedProgress}
        isReady={heroPreloader.isCriticalReady}
      />

      {/* Dynamic Theme-Inverting Fixed Header */}
      <Header />

      {/* Section 1: Hero Window-to-Clouds Canvas Scrollytelling */}
      <HeroScroll preloader={heroPreloader} frameCount={158} />

      {/* Section 2: Sky-to-Ivory Manifesto & 4 Pillars */}
      <AboutSection />

      {/* Section 3: Gulfstream 650ER Exterior -> Interior Floorplan Morph */}
      <PlaneMorph preloader={planePreloader} frameCount={158} />

      {/* Section 4: "A Better Way to Fly" Interactive Accordion & Editorial Photography */}
      <AdvantagesSection />

      {/* Section 5: Live Telemetry Strip */}
      <TelemetryBar />

      {/* Section 6: Global Rolling City Wheel, 3D Globe Video, Parallax Boarding Pass & Footer */}
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
