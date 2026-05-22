import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | WebForYou Agency",
  description: "Read the terms of service and conditions for working with WebForYou web development agency.",
  alternates: {
    canonical: "https://www.wfy.co.in/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
