# TonkJet — Private Jet Charter Worldwide

[**Canlı Siteyi Aç ↗ (https://tonkjet.netlify.app)**](https://tonkjet.netlify.app)

A cinematic, scroll-driven luxury private aviation experience built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Lenis**, and **Three.js (WebGL)**.

## Live Demo

- **Production URL:** https://tonkjet.netlify.app
- **Repository:** https://github.com/BatuhanTNK/tonkjet

## Highlights & Architecture

- **Cinematic Preloader & Custom Favicon:** Radial `clip-path` reveal with priority preloading of core 4K WebP layers (`~1.4 MB` total) and bespoke SVG monogram favicon.
- **4K Layered Cabin Window Zoom-Through:** Transparent oval cabin window (`3840×2160` RGBA WebP) zooming through the exact window center into an animated 4K sunlit cloud sea while the brand wordmark docks into the header.
- **Dynamic Theme-Inverting Navigation:** Fixed header smoothly transitioning between light and dark palettes across sections with dual-layer vertical text-roll hover animations.
- **4K Exterior → Interior CSS Mask Morph:** Pixel-aligned top-down Gulfstream 650ER exterior and open interior cabin (`3840×2160` WebP) revealed via feathered scroll-driven `mask-image`, glowing scan line, technical specification grid, and vector CAD dimension callouts.
- **Interactive Advantages & Live Telemetry:** 4-item luxury editorial accordion with dynamic photo transitions and a live international time/telemetry strip.
- **Interactive 4K Retina WebGL 3D Globe:** Real-time Three.js sphere rendered from bundled TopoJSON vector world data (`world-atlas`), custom Fresnel atmospheric rim shader, 14 animated 3D great-circle flight arcs, glowing hub beacons, and inertial drag-to-rotate controls paired with a parallax boarding-pass card and bottom-docked Charter Booking drawer.

## Tech Stack

`Next.js 14` · `TypeScript` · `Tailwind CSS` · `Framer Motion` · `Three.js` · `Lenis` · `TopoJSON` · `Netlify`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
