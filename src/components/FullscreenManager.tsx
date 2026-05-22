"use client";

import { useEffect } from "react";

export function FullscreenManager() {
  useEffect(() => {
    const handleAction = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      }
    };

    // Add listeners for click and scroll
    window.addEventListener("click", handleAction, { once: true });
    window.addEventListener("scroll", handleAction, { once: true });

    return () => {
      window.removeEventListener("click", handleAction);
      window.removeEventListener("scroll", handleAction);
    };
  }, []);

  return null;
}
