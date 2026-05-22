"use client";

import { HlsVideo } from "./HlsVideo";

const STATS_VIDEO =
  "https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8";

const stats = [
  { value: "200+", label: "Sites launched" },
  { value: "98%", label: "Client satisfaction" },
  { value: "3.2x", label: "More conversions" },
  { value: "5 days", label: "Average delivery" },
];

export function StatsSection() {
  return (
    <section className="relative py-32">
      {/* HLS Video Background — desaturated */}
      <HlsVideo
        src={STATS_VIDEO}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-multiply"
        desaturate
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

      {/* Stats card */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 flex items-center justify-center min-h-[400px]">
        <div className="liquid-glass rounded-3xl p-12 md:p-16 w-full max-w-5xl border border-white/40 shadow-xl shadow-blue-500/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-slate-900 hover:text-blue-600 transition-colors duration-300">
                  {value}
                </span>
                <span className="text-slate-600 font-body font-medium text-sm tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
