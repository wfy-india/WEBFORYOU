"use client";

import { BlurText } from "./BlurText";

const testimonials = [
  {
    quote:
      "A complete rebuild in five days. The result outperformed everything we'd spent months building before.",
    name: "Sarah Chen",
    role: "CEO, Luminary",
  },
  {
    quote:
      "Conversions up 4x. That's not a typo. The design just works differently when it's built on real data.",
    name: "Marcus Webb",
    role: "Head of Growth, Arcline",
  },
  {
    quote:
      "They didn't just design our site. They defined our brand. World-class doesn't begin to cover it.",
    name: "Elena Voss",
    role: "Brand Director, Helix",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="liquid-glass rounded-full px-3.5 py-1.5 mb-6 border border-white/40 shadow-sm">
          <span className="text-slate-800 text-xs font-semibold font-body tracking-wide">
            What They Say
          </span>
        </div>
        <BlurText
          text="Don't take our word for it."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-slate-900 tracking-tight leading-[0.9] block"
          delay={100}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="liquid-glass rounded-2xl p-8 flex flex-col gap-6 border border-white/30 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <p className="text-slate-700 font-body font-light text-sm italic leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="border-t border-slate-200/50 pt-4">
              <p className="text-slate-900 font-body font-semibold text-sm">
                {t.name}
              </p>
              <p className="text-slate-400 font-body font-light text-xs mt-0.5">
                {t.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
