import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact WebForYou | Get a High-Conversion Website Today",
  description: "Ready to scale your business? Contact WebForYou web agency today for a strategy call and get a high-performance website that converts.",
  alternates: {
    canonical: "https://www.wfy.co.in/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
