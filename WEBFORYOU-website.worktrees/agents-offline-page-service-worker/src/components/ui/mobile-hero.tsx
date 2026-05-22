"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TITLES = ["High-Performance", "Trust-Focused", "Conversion-Optimized", "Growth-Driven", "Future-Proof"];

const CHIPS = [
  { label: "⚡ Lightning Fast", delay: 1.1 },
  { label: "🛡 Secure", delay: 1.25 },
  { label: "🚀 High Converting", delay: 1.4 },
  { label: "📱 Mobile-First", delay: 1.55 },
];

const STATS = [
  { value: "50+", label: "Clients" },
  { value: "100%", label: "Satisfaction" },
  { value: "3×", label: "Avg. Growth" },
];

export function MobileHero() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTitleIndex((i) => (i + 1) % TITLES.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-12 md:hidden">

      {/* Background blobs */}
      <motion.div
        className="absolute top-[-5%] right-[-20%] w-72 h-72 rounded-full -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.2) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.25, 1], rotate: [0, 60, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[5%] left-[-25%] w-80 h-80 rounded-full -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)/0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute top-[45%] left-[20%] w-56 h-56 rounded-full -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Agency badge */}
      <motion.div
        className="mb-8 bg-primary/10 text-primary text-[11px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-full border border-primary/20"
        initial={{ opacity: 0, y: -24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
      >
        Web Agency · Hyderabad 🇮🇳
      </motion.div>

      {/* Headline — each line slides up from clipped container */}
      <div className="text-center mb-5 flex flex-col items-center gap-1">
        {["Premium Web", "Development"].map((line, i) => (
          <div key={line} className="overflow-hidden">
            <motion.h1
              className="text-[46px] font-black tracking-tighter text-foreground leading-[1.05]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 70, damping: 16 }}
            >
              {line}
            </motion.h1>
          </div>
        ))}
        <div className="overflow-hidden">
          <motion.h1
            className="text-[46px] font-black tracking-tighter text-primary leading-[1.05]"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 70, damping: 16 }}
          >
            Agency
          </motion.h1>
        </div>
      </div>

      {/* Cycling subtitle word */}
      <motion.div
        className="flex items-center gap-2 mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span className="text-[15px] text-muted-foreground">Websites that are</span>
        <div className="relative h-[1.4em] overflow-hidden w-44">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={titleIndex}
              className="absolute text-[15px] font-bold text-primary left-0 whitespace-nowrap"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {TITLES[titleIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Paragraph */}
      <motion.p
        className="text-center text-muted-foreground text-[14px] leading-relaxed max-w-[300px] mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
      >
        We design and build high-performance websites that help businesses grow, convert leads, and build trust online.
      </motion.p>

      {/* Floating chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-9">
        {CHIPS.map((chip) => (
          <motion.span
            key={chip.label}
            className="bg-background border border-border/80 px-3 py-1.5 rounded-full text-[12px] font-medium shadow-sm text-foreground"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              y: [0, -4, 0],
            }}
            transition={{
              opacity: { delay: chip.delay, duration: 0.3 },
              scale: { delay: chip.delay, type: "spring", stiffness: 200 },
              rotate: { delay: chip.delay, duration: 0.3 },
              y: { delay: chip.delay + 0.4, duration: 2.5 + chip.delay * 0.3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {chip.label}
          </motion.span>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        className="flex gap-10 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.75 + i * 0.1, type: "spring", stiffness: 150 }}
          >
            <p className="text-3xl font-black text-primary leading-none mb-1">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col gap-3 w-full max-w-[300px]"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, type: "spring", stiffness: 80 }}
      >
        <Button
          size="lg"
          className="w-full rounded-full h-14 text-base font-bold shadow-lg shadow-primary/20"
          asChild
        >
          <Link href="/contact">
            Get Started <MoveRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full rounded-full h-14 text-base"
          asChild
        >
          <Link href="/pricing">
            View Pricing <PhoneCall className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
