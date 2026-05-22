import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development Pricing & Plans | Transparent Agency Costs",
  description: "Find the perfect web development plan for your business. From basic landing pages to elite AI solutions, we offer transparent pricing for all growth stages.",
  alternates: {
    canonical: "https://www.wfy.co.in/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
