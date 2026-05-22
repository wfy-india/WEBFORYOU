"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";



export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex flex-col justify-center items-center px-6"
      style={{ minHeight: "100vh", paddingTop: "140px", paddingBottom: "80px" }}
      aria-label="Hero"
    >
      {/* Background Graphic Rings & Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-transparent">
        {/* Soft background blue blobs */}
        <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute top-[30%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-sky-100/30 blur-3xl" />
        <div className="absolute bottom-[5%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-indigo-50/40 blur-3xl" />

        {/* Concentric orbital rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-blue-100/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] rounded-full border border-blue-100/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-blue-100/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-blue-100/25" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-blue-50/65 border border-blue-100/80 rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 shadow-sm shadow-blue-500/5"
        >
          <span className="text-blue-500 text-xs">✦</span>
          <span className="text-blue-900 text-xs font-semibold tracking-wide font-body">
            AI-Powered Web Design Agency
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-[2.85rem] sm:text-5xl md:text-7xl lg:text-[6.5rem] font-heading font-semibold text-slate-900 leading-[0.95] max-w-[900px] tracking-tight mb-8"
        >
          Websites that make your brand{" "}
          <span className="italic text-blue-600 font-normal">unforgettable</span>.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-base sm:text-lg md:text-xl text-slate-500 font-body font-light leading-relaxed max-w-2xl mb-12"
        >
          Stunning design. Blazing performance. Delivered in days — not months.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link
            href="/contact"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3.5 text-base font-semibold font-body shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Book a Free Call <span className="text-lg">→</span>
          </Link>
          <a
            href="https://www.wfy.co.in/work"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-800 rounded-xl px-8 py-3.5 text-base font-semibold font-body shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            View Our Work
          </a>
        </motion.div>

        {/* Three Capsules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          {["50+ Sites Launched", "5-10 Day Delivery", "100% Client Satisfaction"].map((text) => (
            <span
              key={text}
              className="bg-blue-50/50 border border-blue-100/60 text-slate-800 text-xs sm:text-sm font-medium rounded-full px-5 py-2 font-body"
            >
              {text}
            </span>
          ))}
        </motion.div>

        {/* Bouncing Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex justify-center mb-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-blue-500 cursor-pointer p-2 hover:text-blue-600 transition-colors"
          >
            <ChevronDown size={28} />
          </motion.div>
        </motion.div>


      </div>
    </section>
  );
}
