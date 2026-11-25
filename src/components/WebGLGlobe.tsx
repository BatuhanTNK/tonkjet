"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countriesAtlas from "world-atlas/countries-110m.json";

interface Hub {
  name: string;
  lat: number;
  lon: number;
}

const HUBS: Hub[] = [
  { name: "Istanbul", lat: 41.01, lon: 28.98 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Geneva", lat: 46.2, lon: 6.14 },
  { name: "London", lat: 51.51, lon: -0.13 },
  { name: "Zurich", lat: 47.37, lon: 8.54 },
  { name: "New York", lat: 40.71, lon: -74.01 },
  { name: "Nice", lat: 43.71, lon: 7.26 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Miami", lat: 25.76, lon: -80.19 },
  { name: "São Paulo", lat: -23.55, lon: -46.63 },
  { name: "Seoul", lat: 37.57, lon: 126.98 },
  { name: "Doha", lat: 25.29, lon: 51.53 },
];

const ROUTES: [number, number][] = [
  [0, 2], // Istanbul -> Geneva
  [0, 1], // Istanbul -> Dubai
  [0, 3], // Istanbul -> London
  [0, 5], // Istanbul -> New York
  [1, 3], // Dubai -> London
  [1, 7], // Dubai -> Tokyo
  [1, 8], // Dubai -> Singapore
  [2, 5], // Geneva -> New York
  [3, 9], // London -> Miami
  [5, 10], // New York -> Sao Paulo
  [4, 12], // Zurich -> Doha
  [6, 1], // Nice -> Dubai
  [7, 11], // Tokyo -> Seoul
  [8, 7], // Singapore -> Tokyo
];

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Generates a razor-sharp 4096x2048 vector-rendered equirectangular Earth texture
 * from bundled TopoJSON countries data (zero external network fetches).
 */
function buildVectorEarthTexture(): THREE.CanvasTexture {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Deep obsidian ocean base
  ctx.fillStyle = "#060505";
  ctx.fillRect(0, 0, width, height);

  // Subtle nautical graticule grid
  ctx.strokeStyle = "rgba(255, 248, 237, 0.035)";
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const topo = countriesAtlas as unknown as Topology<{
    countries: GeometryCollection;
    land: GeometryCollection;
  }>;

  const countriesGeo = feature(topo, topo.objects.countries);

  const projectX = (lon: number) => ((lon + 180) / 360) * width;
  const projectY = (lat: number) => ((90 - lat) / 180) * height;

  const drawRing = (ring: number[][]) => {
    if (ring.length < 2) return;
    ctx.moveTo(projectX(ring[0][0]), projectY(ring[0][1]));
    for (let i = 1; i < ring.length; i++) {
      // Avoid horizontal wrap-around artifacts across antimeridian
      if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) {
        ctx.moveTo(projectX(ring[i][0]), projectY(ring[i][1]));
      } else {
        ctx.lineTo(projectX(ring[i][0]), projectY(ring[i][1]));
      }
    }
    ctx.closePath();
  };

  // Fill continents in luxury matte warm taupe-silver
  ctx.fillStyle = "#5C5650";
  ctx.beginPath();
  for (const feat of countriesGeo.features) {
    const geom = feat.geometry;
    if (!geom) continue;
    if (geom.type === "Polygon") {
      for (const ring of geom.coordinates) drawRing(ring);
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates) {
        for (const ring of poly) drawRing(ring);
      }
    }
  }
  ctx.fill();

  // Crisp country borders
  const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b);
  ctx.strokeStyle = "rgba(12, 10, 10, 0.72)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (const line of borders.coordinates) {
    if (line.length < 2) continue;
    ctx.moveTo(projectX(line[0][0]), projectY(line[0][1]));
    for (let i = 1; i < line.length; i++) {
      if (Math.abs(line[i][0] - line[i - 1][0]) > 180) {
        ctx.moveTo(projectX(line[i][0]), projectY(line[i][1]));
      } else {
        ctx.lineTo(projectX(line[i][0]), projectY(line[i][1]));
      }
    }
  }
  ctx.stroke();

  // Subtle luminous warm ivory coastline rim
  const coastlines = mesh(topo, topo.objects.countries, (a, b) => a === b);
  ctx.strokeStyle = "rgba(255, 248, 237, 0.32)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (const line of coastlines.coordinates) {
    if (line.length < 2) continue;
    ctx.moveTo(projectX(line[0][0]), projectY(line[0][1]));
    for (let i = 1; i < line.length; i++) {
      if (Math.abs(line[i][0] - line[i - 1][0]) > 180) {
        ctx.moveTo(projectX(line[i][0]), projectY(line[i][1]));
      } else {
        ctx.lineTo(projectX(line[i][0]), projectY(line[i][1]));
      }
    }
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

export default function WebGLGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 720;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 3.35);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // Subtle luxury studio lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ed, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.35);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa7c7dc, 0.65);
    rimLight.position.set(-5, 2, -3);
    scene.add(rimLight);

    // Root globe group (oriented initially toward Europe / Istanbul / Dubai)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = -2.18;
    globeGroup.rotation.x = 0.28;
    scene.add(globeGroup);

    const RADIUS = 1.0;

    // 1. High-resolution vector Earth sphere
    const earthTexture = buildVectorEarthTexture();
    const sphereGeo = new THREE.SphereGeometry(RADIUS, 96, 96);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.78,
      metalness: 0.16,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // 2. Custom Fresnel atmospheric warm-ivory rim halo
    const atmoGeo = new THREE.SphereGeometry(RADIUS * 1.045, 72, 72);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
          gl_FragColor = vec4(0.96, 0.91, 0.84, 1.0) * intensity * 0.55;
        }
      `,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);

    // 3. Hub City Beacons (glowing ivory dots + subtle halo rings)
    const beaconGeo = new THREE.SphereGeometry(0.011, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xfff8ed });
    const ringGeo = new THREE.RingGeometry(0.016, 0.024, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfff8ed,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });

    const hubPositions: THREE.Vector3[] = [];
    for (const hub of HUBS) {
      const pos = latLonToVec3(hub.lat, hub.lon, RADIUS * 1.004);
      hubPositions.push(pos);

      const dot = new THREE.Mesh(beaconGeo, beaconMat);
      dot.position.copy(pos);
      globeGroup.add(dot);

      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.002));
      ring.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ring);
    }

    // 4. 3D Elevated Great-Circle Flight Arcs + Animated Radar Flight Pulses
    const arcCurves: THREE.QuadraticBezierCurve3[] = [];
    const pulseMeshes: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];
    const pulseGeo = new THREE.SphereGeometry(0.0095, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xfff8ed });

    for (let idx = 0; idx < ROUTES.length; idx++) {
      const [fromIdx, toIdx] = ROUTES[idx];
      const start = hubPositions[fromIdx];
      const end = hubPositions[toIdx];
      const dist = start.distanceTo(end);
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(RADIUS + 0.14 + dist * 0.22);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      arcCurves.push(curve);

      const pts = curve.getPoints(72);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xfff8ed,
        transparent: true,
        opacity: 0.26,
      });
      const arcLine = new THREE.Line(lineGeo, lineMat);
      globeGroup.add(arcLine);

      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulse);
      pulseMeshes.push({
        mesh: pulse,
        speed: 0.16 + (idx % 4) * 0.035,
        offset: (idx * 0.19) % 1,
      });
    }

    // 5. Interactive pointer drag-to-rotate with smooth inertia
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      velY = dx * 0.0045;
      velX = dy * 0.003;
      globeGroup.rotation.y += velY;
      globeGroup.rotation.x = Math.max(
        -0.75,
        Math.min(0.85, globeGroup.rotation.x + velX)
      );
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 720;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
      renderer.setSize(w, h);
    };
    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(container);

    // Animation loop
    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        velY *= 0.94;
        velX *= 0.94;
        globeGroup.rotation.y += 0.0022 + velY;
        globeGroup.rotation.x = Math.max(
          -0.65,
          Math.min(0.75, globeGroup.rotation.x + velX)
        );
      }

      // Move radar light pulses smoothly along 3D flight arcs
      for (let i = 0; i < pulseMeshes.length; i++) {
        const p = pulseMeshes[i];
        const t = (elapsed * p.speed + p.offset) % 1;
        const pos = arcCurves[i].getPoint(t);
        p.mesh.position.copy(pos);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObs.disconnect();
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      sphereGeo.dispose();
      sphereMat.dispose();
      earthTexture.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-full w-full cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 4K WebGL 3D TonkJet global flight network"
    />
  );
}
