"use client";

import { LandingNavbar } from "@/components/sections/LandingNavbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { StartSection } from "@/components/sections/StartSection";

import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { StatsSection } from "@/components/sections/StatsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaFooter } from "@/components/sections/CtaFooter";

export default function HomePage() {
  return (
    <div className="bg-[#f5f9fc] min-h-screen text-slate-900 overflow-x-hidden">
      <LandingNavbar />
      <HeroSection />
      <div className="bg-transparent">
        <StartSection />

        <FeaturesGrid />
        <StatsSection />
        <Testimonials />
        <CtaFooter />
      </div>
    </div>
  );
}
