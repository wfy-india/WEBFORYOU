"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
  "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80",
];

// Triple the images for a seamless infinite loop
const ROW1 = [...IMAGES, ...IMAGES, ...IMAGES];
const ROW2 = [...IMAGES.slice(5), ...IMAGES.slice(0, 5), ...IMAGES.slice(5), ...IMAGES.slice(0, 5), ...IMAGES.slice(5), ...IMAGES.slice(0, 5)];

// Card dimensions + gap
const CARD_W = 140; // px
const CARD_H = 96;  // px
const GAP = 12;     // gap-3
const ONE_SET_PX = IMAGES.length * (CARD_W + GAP); // width of one original set

function MarqueeRow({ images, reverse = false, duration = 22 }: { images: string[]; reverse?: boolean; duration?: number }) {
  return (
    <div className="flex overflow-hidden w-full">
      <motion.div
        className="flex gap-3 shrink-0"
        animate={{ x: reverse ? [0, ONE_SET_PX] : [0, -ONE_SET_PX] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="shrink-0 rounded-2xl overflow-hidden border border-primary/10 shadow-sm"
            style={{ width: CARD_W, height: CARD_H }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function MobilePortfolioSection() {
  return (
    <section className="py-16 overflow-hidden md:hidden">
      {/* Heading */}
      <div className="container mx-auto px-6 text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <Badge variant="outline" className="mb-4">Our Vision</Badge>
          <h2 className="text-3xl font-black tracking-tighter text-foreground mb-3">
            Crafting digital{" "}
            <span className="text-primary">masterpieces</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            Every project is built with precision, creativity, and a relentless focus on results.
          </p>
        </motion.div>
      </div>

      {/* Dual marquee rows */}
      <motion.div
        className="flex flex-col gap-3 mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <MarqueeRow images={ROW1} duration={22} />
        <MarqueeRow images={ROW2} reverse duration={18} />
        <MarqueeRow images={ROW1.slice(3)} duration={26} />
      </motion.div>

      {/* CTA */}
      <div className="flex justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <Button variant="outline" className="rounded-full px-8 h-12" asChild>
            <Link href="/contact">
              Start Your Project <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
