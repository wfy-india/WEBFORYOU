"use client";

import { useEffect, useRef } from "react";

interface HlsVideoProps {
  src: string;
  className?: string;
  desaturate?: boolean;
}

export function HlsVideo({ src, className, desaturate }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hlsInstance: any = null;
    const video = videoRef.current;
    if (!video) return;

    (async () => {
      const Hls = (await import("hls.js")).default;

      if (Hls.isSupported()) {
        hlsInstance = new Hls({ enableWorker: false });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = src;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch(() => {});
        });
      }
    })();

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={desaturate ? { filter: "saturate(0)" } : undefined}
    />
  );
}
