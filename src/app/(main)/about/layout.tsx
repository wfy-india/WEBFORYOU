import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About WebForYou | Our Vision for High-Performance Web Design",
  description: "Learn about WebForYou, our vision, and why we are more than just code. We build trust-focused digital masterpieces that drive real business results.",
  alternates: {
    canonical: "https://www.wfy.co.in/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
