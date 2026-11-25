"use client";

import { useEffect, useRef, useState } from "react";

interface UseImagePreloaderOptions {
  basePath: string;
  frameCount: number;
  filePrefix?: string;
  extension?: string;
  padLength?: number;
  priorityCount?: number;
}

export interface PreloaderState {
  imagesRef: React.MutableRefObject<(HTMLImageElement | null)[]>;
  loadedCount: number;
  progress: number;
  isFirstFrameReady: boolean;
  isCriticalReady: boolean;
}

export function buildFrameUrl(
  basePath: string,
  index: number,
  filePrefix = "ezgif-frame-",
  extension = "jpg",
  padLength = 3
): string {
  const num = String(index + 1).padStart(padLength, "0");
  return `${basePath}/${filePrefix}${num}.${extension}?v=1080p`;
}

export function useImagePreloader({
  basePath,
  frameCount,
  filePrefix = "ezgif-frame-",
  extension = "jpg",
  padLength = 3,
  priorityCount = 24,
}: UseImagePreloaderOptions): PreloaderState {
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(frameCount).fill(null)
  );
  const [loadedCount, setLoadedCount] = useState(0);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadedSet = new Set<number>();

    const loadIndex = (i: number): Promise<void> =>
      new Promise((resolve) => {
        if (cancelled) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.src = buildFrameUrl(basePath, i, filePrefix, extension, padLength);
        img.onload = () => {
          if (cancelled) {
            resolve();
            return;
          }
          imagesRef.current[i] = img;
          if (i === 0) {
            setIsFirstFrameReady(true);
          }
          if (!loadedSet.has(i)) {
            loadedSet.add(i);
            setLoadedCount(loadedSet.size);
          }
          resolve();
        };
        img.onerror = () => {
          if (!cancelled && !loadedSet.has(i)) {
            loadedSet.add(i);
            setLoadedCount(loadedSet.size);
          }
          resolve();
        };
      });

    async function run() {
      // Load frame 0 first so first paint is immediate
      await loadIndex(0);

      // Load evenly spaced key frames next for smooth scrubbing even while loading
      const keyIndices: number[] = [];
      const stride = Math.max(1, Math.floor(frameCount / priorityCount));
      for (let i = stride; i < frameCount; i += stride) {
        keyIndices.push(i);
      }
      if (!keyIndices.includes(frameCount - 1)) {
        keyIndices.push(frameCount - 1);
      }

      await Promise.all(keyIndices.map((idx) => loadIndex(idx)));

      // Load remaining frames in controlled concurrent batches
      const remaining: number[] = [];
      for (let i = 1; i < frameCount; i++) {
        if (!loadedSet.has(i)) remaining.push(i);
      }

      const batchSize = 10;
      for (let b = 0; b < remaining.length && !cancelled; b += batchSize) {
        const batch = remaining.slice(b, b + batchSize);
        await Promise.all(batch.map((idx) => loadIndex(idx)));
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [basePath, frameCount, filePrefix, extension, padLength, priorityCount]);

  const progress = frameCount > 0 ? loadedCount / frameCount : 1;
  const isCriticalReady = loadedCount >= Math.min(priorityCount, frameCount);

  return {
    imagesRef,
    loadedCount,
    progress,
    isFirstFrameReady,
    isCriticalReady,
  };
}

/**
 * Draws an image onto a canvas with CSS object-fit: cover or contain math.
 */
export function drawFrameToCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  mode: "cover" | "contain" = "cover",
  fillBackground?: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (displayWidth === 0 || displayHeight === 0) return;

  const targetWidth = Math.round(displayWidth * dpr);
  const targetHeight = Math.round(displayHeight * dpr);

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (fillBackground) {
    ctx.fillStyle = fillBackground;
    ctx.fillRect(0, 0, displayWidth, displayHeight);
  } else {
    ctx.clearRect(0, 0, displayWidth, displayHeight);
  }

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = displayWidth / displayHeight;

  let drawWidth = displayWidth;
  let drawHeight = displayHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (mode === "cover") {
    if (canvasRatio > imgRatio) {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgRatio;
      offsetY = (displayHeight - drawHeight) / 2;
    } else {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgRatio;
      offsetX = (displayWidth - drawWidth) / 2;
    }
  } else {
    if (canvasRatio > imgRatio) {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imgRatio;
      offsetX = (displayWidth - drawWidth) / 2;
    } else {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imgRatio;
      offsetY = (displayHeight - drawHeight) / 2;
    }
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  ctx.restore();
}

/**
 * Finds the nearest already-loaded frame so scrolling never flashes blank.
 */
export function getNearestLoadedFrame(
  images: (HTMLImageElement | null)[],
  targetIndex: number
): HTMLImageElement | null {
  const clamped = Math.max(0, Math.min(images.length - 1, targetIndex));
  if (images[clamped]) return images[clamped];

  for (let delta = 1; delta < images.length; delta++) {
    if (clamped - delta >= 0 && images[clamped - delta]) {
      return images[clamped - delta];
    }
    if (clamped + delta < images.length && images[clamped + delta]) {
      return images[clamped + delta];
    }
  }
  return null;
}
