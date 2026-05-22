"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const navLinks = ["Home", "Services", "Pricing", "Work", "Client Portal"];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <span className="font-heading font-semibold text-slate-900 text-2xl tracking-tight select-none">
            Web<span className="italic text-blue-600">ForYou</span>
          </span>
        </Link>

        {/* Desktop center nav pill */}
        <nav className="hidden md:flex liquid-glass rounded-full px-1.5 py-1 items-center gap-0.5 border border-white/20">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : item === "Client Portal" ? "/client/login" : `/${item.toLowerCase()}`}
              className="px-4 py-2 text-sm font-medium text-slate-700 font-body rounded-full hover:bg-slate-900/5 hover:text-slate-900 transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-2 bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium font-body flex items-center gap-1 hover:bg-blue-700 transition-colors duration-200 shadow-sm shadow-blue-500/10"
          >
            Get Started <ArrowUpRight size={14} />
          </Link>
        </nav>

        {/* Mobile — hamburger */}
        <button
          className="md:hidden text-slate-800 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-slate-800 mb-1.5 transition-all" />
          <span className="block w-6 h-0.5 bg-slate-800 mb-1.5 transition-all" />
          <span className="block w-6 h-0.5 bg-slate-800 transition-all" />
        </button>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="fixed top-20 left-4 right-4 z-40 liquid-glass rounded-2xl p-4 flex flex-col gap-1 border border-white/40">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : item === "Client Portal" ? "/client/login" : `/${item.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-slate-700 font-body rounded-xl hover:bg-slate-900/5 hover:text-slate-900 transition-colors"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 bg-blue-600 text-white rounded-full px-4 py-3 text-sm font-medium font-body flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors"
          >
            Get Started <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
    </>
  );
}
