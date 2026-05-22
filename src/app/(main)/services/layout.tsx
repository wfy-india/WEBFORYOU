import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development Services | E-commerce, AI & Custom Web Apps",
  description: "Explore our expert web development services including static sites, dynamic apps, e-commerce stores, and AI integration. We help businesses dominate online.",
  alternates: {
    canonical: "https://www.wfy.co.in/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
