"use client";

import { ArrowUpRight } from "lucide-react";
import { BlurText } from "./BlurText";
import { HlsVideo } from "./HlsVideo";
import Link from "next/link";

const START_VIDEO =
  "https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8";

export function StartSection() {
  return (
    <section className="relative" style={{ minHeight: "700px" }}>
      {/* HLS Video Background */}
      <HlsVideo
        src={START_VIDEO}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-multiply"
      />

      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: "200px",
          background: "linear-gradient(to bottom, #f5f9fc, transparent)",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: "200px",
          background: "linear-gradient(to top, #f5f9fc, transparent)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 py-40"
        style={{ minHeight: "500px" }}
      >
        {/* Badge */}
        <div className="liquid-glass rounded-full px-3.5 py-1.5 mb-8 border border-white/40 shadow-sm">
          <span className="text-slate-800 text-xs font-semibold font-body tracking-wide">
            How It Works
          </span>
        </div>

        <BlurText
          text="You dream it. We ship it."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-slate-900 tracking-tight leading-[0.9] max-w-3xl block mb-6"
          delay={120}
        />

        <p className="text-slate-600 font-body font-light text-sm md:text-base max-w-lg mb-10 leading-relaxed">
          Share your vision. Our AI handles the rest — wireframes, design, code,
          launch. All in days, not quarters.
        </p>

        <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 text-sm font-body font-medium flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]">
          Book Now <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
