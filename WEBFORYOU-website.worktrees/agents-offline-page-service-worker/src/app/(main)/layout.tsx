"use client";

import { usePathname } from "next/navigation";
import { SiteNavbar } from "@/components/sections/SiteNavbar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <SiteNavbar />}
      {children}
      <SiteFooter />
      <ChatbotWidget />
    </>
  );
}
