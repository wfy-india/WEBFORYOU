"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between border-b border-slate-200/40 bg-white/75 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <span className="font-heading font-semibold text-slate-900 text-2xl tracking-tight select-none">
            Web<span className="italic text-blue-600">ForYou</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={[
                  "px-3.5 py-2 rounded-full text-sm font-body font-medium transition-colors duration-200",
                  isActive
                    ? "bg-slate-900/5 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-900/5",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/client/login"
            className="px-3.5 py-2 text-sm font-body font-medium text-slate-600 hover:text-slate-950 transition-colors duration-200 rounded-full hover:bg-slate-900/5"
          >
            Client Portal
          </Link>
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 text-sm font-body font-medium flex items-center gap-1.5 shadow-sm shadow-blue-500/10 transition-colors"
          >
            Book Now<ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-700 hover:text-slate-900"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="fixed top-[65px] left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-lg rounded-2xl p-3 flex flex-col gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "px-4 py-3 rounded-xl text-sm font-body font-medium transition-colors",
                  isActive
                    ? "bg-slate-900/5 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-900/5",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
          <div className="border-t border-slate-200/50 mt-1 pt-2 flex flex-col gap-1">
            <Link
              href="/client/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-body font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-900/5 transition-colors"
            >
              Client Portal
            </Link>
            <Link
              href="/developer/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-body font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-900/5 transition-colors"
            >
              Developer Portal
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-1 bg-blue-600 text-white rounded-xl px-4 py-3 text-sm font-body font-medium flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
            >
              Book Now <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Spacer so content isn't hidden behind fixed header */}
      <div className="h-[65px]" />
    </>
  );
}
