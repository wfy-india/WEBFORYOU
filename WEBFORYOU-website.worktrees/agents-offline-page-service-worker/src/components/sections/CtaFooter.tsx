"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HlsVideo } from "./HlsVideo";
import { BlurText } from "./BlurText";

const CTA_VIDEO =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export function CtaFooter() {
  return (
    <section className="relative pt-40 pb-20">
      {/* HLS Video Background */}
      <HlsVideo
        src={CTA_VIDEO}
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
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <BlurText
          text="Your next website starts here."
          className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-slate-900 leading-[0.85] max-w-3xl block mb-6"
          delay={100}
        />

        <p className="text-slate-600 font-body font-light text-sm md:text-base max-w-lg mb-10 leading-relaxed">
          Book a free strategy call. See what AI-powered design can do. No
          commitment, no pressure. Just possibilities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 text-sm font-body font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
          >
            Book a Call <ArrowUpRight size={16} />
          </Link>
          <Link
            href="/pricing"
            className="bg-white border border-slate-200 text-slate-800 rounded-full px-6 py-3 text-sm font-body font-medium hover:bg-slate-50 transition-all hover:scale-[1.02]"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
