"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  /** Delay between each word in ms (default 100) */
  delay?: number;
  direction?: "bottom" | "top";
}

export function BlurText({
  text,
  className,
  delay = 100,
  direction = "bottom",
}: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  const initial = {
    filter: "blur(10px)",
    opacity: 0,
    y: direction === "bottom" ? 50 : -50,
  };

  const animate = {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
  };

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={initial}
          animate={isVisible ? animate : initial}
          transition={{
            duration: 0.7,
            delay: i * (delay / 1000),
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
