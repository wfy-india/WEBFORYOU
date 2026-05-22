"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Minimal top bar*/}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 h-14 flex items-center justify-between border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-body">
          <ArrowLeft size={14} />
          Back to site
        </Link>
        <Link href="/">
          <Image src="/logo.jpeg" alt="WebForYou" width={32} height={32} className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
      </div>
      <div className="pt-14">{children}</div>
    </div>
  );
}
