import type { Metadata } from "next";
import { Instrument_Serif, Barlow, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

import { Toaster } from "@/components/ui/sonner";
import { OrganizationSchema, WebsiteSchema } from "@/components/JsonLd";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebForYou | AI-Powered Web Design Agency",
  description:
    "Stunning design. Blazing performance. Built by AI, refined by experts. WebForYou delivers world-class websites in days, not months.",
  keywords: [
    "AI web design agency",
    "premium web design",
    "high conversion websites",
    "web design Hyderabad",
    "AI powered websites",
  ],
  authors: [{ name: "WebForYou Team" }],
  openGraph: {
    title: "WebForYou | AI-Powered Web Design Agency",
    description:
      "Stunning design. Blazing performance. Built by AI, refined by experts.",
    type: "website",
    url: "https://www.wfy.co.in",
    siteName: "WebForYou",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebForYou | AI-Powered Web Design Agency",
    description:
      "Stunning design. Blazing performance. Built by AI, refined by experts.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.wfy.co.in",
  },
  icons: {
    icon: "/logo.jpeg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WebForYou",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${barlow.variable} ${geistMono.variable} antialiased bg-[#f5f9fc] text-slate-900`}
        style={{ fontFamily: "var(--font-barlow), sans-serif" }}
      >
        <OrganizationSchema />
        <WebsiteSchema />

        <ServiceWorkerRegister />
        <Toaster />
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
