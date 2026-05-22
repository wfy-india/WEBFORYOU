import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at WebForYou | Join Our Premium Web Agency Team",
  description: "Want to build the future of the web? Explore career opportunities at WebForYou. We're always looking for talented developers and designers.",
  alternates: {
    canonical: "https://www.wfy.co.in/careers",
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
