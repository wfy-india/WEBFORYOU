"use client";

import { ArrowUpRight } from "lucide-react";
import { BlurText } from "./BlurText";

const FEATURE_GIF_1 =
  "https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif";
const FEATURE_GIF_2 =
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif";

export function FeaturesChess() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex flex-col items-center text-center mb-20">
        <BlurText
          text="Pro features. Zero complexity."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] max-w-2xl block"
          delay={100}
        />
      </div>

      {/* Row 1: text left / gif right */}
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 mb-24">
        <div className="flex-1 flex flex-col gap-6">
          <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-tight">
            Designed to convert. Built to perform.
          </h3>
          <p className="text-white/60 font-body font-light text-sm md:text-base leading-relaxed">
            Every pixel is intentional. Our AI studies what works across
            thousands of top sites — then builds yours to outperform them all.
          </p>
          <button className="liquid-glass-strong rounded-full px-5 py-2.5 text-white font-body font-medium text-sm w-fit flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
            Learn more <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="flex-1 w-full">
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURE_GIF_1}
              alt="Designed to convert — animated preview"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Row 2: gif left / text right */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
        <div className="flex-1 flex flex-col gap-6">
          <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-tight">
            It gets smarter. Automatically.
          </h3>
          <p className="text-white/60 font-body font-light text-sm md:text-base leading-relaxed">
            Your site evolves on its own. AI monitors every click, scroll, and
            conversion — then optimizes in real time. No manual updates. Ever.
          </p>
          <button className="liquid-glass-strong rounded-full px-5 py-2.5 text-white font-body font-medium text-sm w-fit flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
            See how it works <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="flex-1 w-full">
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURE_GIF_2}
              alt="AI that gets smarter — animated preview"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
