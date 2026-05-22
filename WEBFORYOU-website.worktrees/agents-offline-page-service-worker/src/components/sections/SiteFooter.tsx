"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "Web Design", href: "/services" },
    { label: "AI Integration", href: "/services" },
    { label: "E-commerce", href: "/services" },
    { label: "Pricing", href: "/pricing" },
  ],
  Portals: [
    { label: "Client Portal", href: "/client/login" },
    { label: "Developer Portal", href: "/developer/login" },
  ],
  Legal: [
    { label: "Terms", href: "/terms" },

  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/50 pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-xs">
            <Link href="/" className="flex items-center">
              <span className="font-heading font-semibold text-slate-900 text-2xl tracking-tight select-none">
                Web<span className="italic text-blue-600">ForYou</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm font-body font-light leading-relaxed">
              AI-powered web design. Stunning results. Built in days, not
              months.
            </p>
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 text-sm font-body font-medium flex items-center gap-1.5 w-fit shadow-sm shadow-blue-500/10 transition-colors duration-200"
            >
              Start a project <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <p className="text-slate-900 text-xs font-body font-semibold uppercase tracking-widest">
                  {group}
                </p>
                {links.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-slate-500 text-sm font-body font-light hover:text-blue-600 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-body">
            © 2026 WebForYou. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs font-body">
            Hyderabad, India · wfy.co.in
          </p>
        </div>
      </div>
    </footer>
  );
}
