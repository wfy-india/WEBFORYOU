"use client";

import { useState } from "react";
import { ExternalLink, Globe, ArrowUpRight, Monitor } from "lucide-react";

interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

const projects: Project[] = [
  {
    title: "Heritage Restaurant",
    description:
      "Heritage modern Indian restaurant site with rich visuals, banquet booking, and cultural storytelling.",
    url: "https://heritage-restaurant-site.vercel.app/",
    tags: ["Restaurant", "Booking", "Cultural"],
  },
  {
    title: "Thrift Farm",
    description:
      "Sustainable fashion e-commerce platform for curated vintage and thrift clothing.",
    url: "https://thrift-farm-site.vercel.app/",
    tags: ["E-Commerce", "Fashion", "Sustainable"],
  },
  {
    title: "Citia Restaurant",
    description:
      "A premium restaurant website featuring elegant design, menu browsing, and immersive ambience showcase.",
    url: "https://citia-restaurant-site.vercel.app/",
    tags: ["Restaurant", "Premium", "Menu"],
  },
  {
    title: "Roast N Toast Club",
    description:
      "Vibrant club & kitchen website with event listings, music socials, and reservation system.",
    url: "https://www.roastntoastclub.com/",
    tags: ["Club", "Events", "Reservations"],
  },
  {
    title: "Global Fitness",
    description:
      "AI-powered gym application with workout programs, trainer profiles, and fitness automation.",
    url: "https://gobal-fitness.vercel.app/",
    tags: ["Fitness", "AI-Powered", "Application"],
  },
  {
    title: "QuantSent",
    description:
      "AI-powered stock market sentiment analyzer with real-time market data and prediction tools.",
    url: "https://quant-sent.vercel.app/",
    tags: ["Finance", "AI-Powered", "Analytics"],
  },
];

function BrowserFrame({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 120}ms`,
        animationFillMode: "both",
      }}
    >
      <div
        className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/8 hover:-translate-y-2 hover:border-blue-200/60"
      >
        {/* Browser chrome bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/80 border-b border-slate-200/50">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 mx-3">
            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1 border border-slate-200/50 text-xs text-slate-400 font-body truncate">
              <Globe size={11} className="text-slate-300 flex-shrink-0" />
              <span className="truncate">{project.url}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-300 group-hover:text-blue-500 transition-colors duration-300">
            <ExternalLink size={13} />
          </div>
        </div>

        {/* Iframe preview */}
        <div className="relative w-full overflow-hidden bg-slate-100" style={{ height: "320px" }}>
          {/* Loading skeleton */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-slate-50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Monitor size={18} className="text-blue-400 animate-pulse" />
              </div>
              <span className="text-xs text-slate-400 font-body">Loading preview…</span>
            </div>
          )}
          <iframe
            src={project.url}
            title={`${project.title} preview`}
            className="w-[1440px] h-[900px] border-0 pointer-events-none select-none"
            style={{
              transform: "scale(0.222)",
              transformOrigin: "top left",
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => setIframeLoaded(true)}
          />

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-400 z-20"
            style={{
              background: isHovered
                ? "rgba(15, 23, 42, 0.55)"
                : "rgba(15, 23, 42, 0)",
              backdropFilter: isHovered ? "blur(2px)" : "blur(0px)",
            }}
          >
            <div
              className="flex items-center gap-2 bg-white text-slate-900 rounded-full px-5 py-2.5 text-sm font-body font-semibold shadow-lg transition-all duration-400"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
              }}
            >
              Visit Website <ArrowUpRight size={15} />
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="px-5 py-4 border-t border-slate-100/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-body font-semibold text-base leading-snug mb-1 group-hover:text-blue-600 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-slate-500 font-body font-light text-sm leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
              <ArrowUpRight
                size={14}
                className="text-blue-500 group-hover:text-white transition-colors duration-300"
              />
            </div>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-body font-medium bg-slate-100/80 text-slate-500 border border-slate-200/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-[#f5f9fc]">
      {/* Header section */}
      <section className="pt-20 pb-6 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-1.5 mb-8 border border-white/40 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-slate-700 text-xs font-semibold font-body tracking-wide uppercase">
              Our Portfolio
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-slate-900 tracking-tight leading-[0.95] mb-5">
            Websites we&apos;ve{" "}
            <span className="text-blue-600">crafted.</span>
          </h1>
          <p className="text-slate-500 font-body font-light text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Every project is built from scratch with custom design, premium
            animations, and a focus on performance. Click on any project to
            explore the live site.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            <div className="liquid-glass rounded-xl px-5 py-3 border border-white/30 shadow-sm">
              <span className="block text-2xl font-heading font-semibold text-slate-900">
                Made with
              </span>
              <span className="text-xs text-slate-500 font-body">
                Detailed engineering
              </span>

            </div>
            <div className="liquid-glass rounded-xl px-5 py-3 border border-white/30 shadow-sm">
              <span className="block text-2xl font-heading font-semibold text-slate-900">
                100%
              </span>
              <span className="text-xs text-slate-500 font-body">
                Custom Built
              </span>
            </div>
            <div className="liquid-glass rounded-xl px-5 py-3 border border-white/30 shadow-sm">
              <span className="block text-2xl font-heading font-semibold text-slate-900">
                7 Days
              </span>
              <span className="text-xs text-slate-500 font-body">
                Avg. Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-24 pt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project, i) => (
              <BrowserFrame key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
