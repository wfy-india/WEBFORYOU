"use client";

import { useRef, useState, useCallback } from "react";

const CDN_SCRIPT =
  "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

export type FaceApiStatus = "idle" | "loading" | "ready" | "error";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function getFaceApi(): any {
  return (window as any).faceapi ?? null;
}

export function useFaceApi() {
  const [status, setStatus] = useState<FaceApiStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  const loadModels = useCallback(async () => {
    if (loadedRef.current) return;
    setStatus("loading");
    setProgress(10);
    setError(null);
    try {
      await loadScript(CDN_SCRIPT);
      setProgress(30);
      const faceapi = getFaceApi();
      if (!faceapi) throw new Error("face-api.js not available on window");
      
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setProgress(50);
      
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      setProgress(75);
      
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setProgress(100);
      
      loadedRef.current = true;
      setStatus("ready");
    } catch (err: any) {
      console.error("face-api load error:", err);
      setStatus("error");
      setProgress(0);
      setError(`Model Error: ${err.message || "Network issue"}`);
    }
  }, []);

  /** Detect face and return descriptor. Returns null if no face found. */
  const detectFace = useCallback(
    async (video: HTMLVideoElement): Promise<Float32Array | null> => {
      const faceapi = getFaceApi();
      if (!faceapi || !loadedRef.current) return null;
      try {
        const result = await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 160,
              scoreThreshold: 0.4,
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptor();
        return result?.descriptor ?? null;
      } catch {
        return null;
      }
    },
    []
  );

  /** Detect face and return raw detection (for UI feedback). */
  const detectRaw = useCallback(async (video: HTMLVideoElement) => {
    const faceapi = getFaceApi();
    if (!faceapi || !loadedRef.current) return null;
    try {
      return await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.4,
          })
        )
        .withFaceLandmarks();
    } catch {
      return null;
    }
  }, []);

  /**
   * Compare a live descriptor against multiple stored descriptors.
   * Returns true if the euclidean distance to the averaged stored descriptor
   * is below the threshold (0.5 is standard for face-api.js).
   */
  const matchFace = useCallback(
    (live: Float32Array, stored: number[][]): boolean => {
      const faceapi = getFaceApi();
      if (!faceapi || !stored.length) return false;
      const avg = new Float32Array(128);
      stored.forEach((d) => d.forEach((v, i) => (avg[i] += v)));
      avg.forEach((_, i) => (avg[i] /= stored.length));
      const dist: number = faceapi.euclideanDistance(live, avg);
      return dist < 0.5;
    },
    []
  );

  /** Analyse average pixel brightness of a video frame (0–255). */
  const getBrightness = useCallback((video: HTMLVideoElement): number => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (!ctx) return 128;
      ctx.drawImage(video, 0, 0, 64, 64);
      const data = ctx.getImageData(0, 0, 64, 64).data;
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      return sum / (64 * 64);
    } catch {
      return 128;
    }
  }, []);

  return { status, progress, error, loadModels, detectFace, detectRaw, matchFace, getBrightness };
}
