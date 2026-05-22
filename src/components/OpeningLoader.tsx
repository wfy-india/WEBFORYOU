"use client";

import { useCallback, useEffect, useState } from "react";

import { CinematicHero } from "@/components/ui/cinematic-landing-hero";

const INTRO_STORAGE_KEY = "webforyou:intro-played";

export function OpeningLoader() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
    setShouldShow(!hasPlayed);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !shouldShow) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isReady, shouldShow]);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
    setShouldShow(false);
  }, []);

  if (!isReady || !shouldShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background">
      <CinematicHero
        autoPlay
        brandName="WEBFORYOU"
        tagline1="Get your dream website"
        tagline2="in days."
        cardHeading="Websites made launch-ready."
        metricValue={7}
        metricLabel="Days to Launch"
        ctaHeading="Entering WebForYou"
        ctaDescription="Strategy, design, and development built for speed."
        onIntroComplete={handleIntroComplete}
      />
    </div>
  );
}
