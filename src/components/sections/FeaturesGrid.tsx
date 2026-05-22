"use client";

import { Zap, Palette, BarChart3, Shield } from "lucide-react";
import { BlurText } from "./BlurText";
import { type LucideIcon } from "lucide-react";
import React from "react";

interface Feature {
  Icon: LucideIcon;
  title: string;
  body: React.ReactNode;
}

// Custom onboarding and payment steps
const features: Feature[] = [
  {
    Icon: Zap,
    title: "Requirement Discussion",
    body: (
      <div className="flex flex-col gap-2">
        <p>Direct meeting or Google Meet session to understand your business requirements, goals, and vision.</p>
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Discussion and analysis of your brand, target audience, and website expectations.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Creation of a structured website development plan tailored to your needs.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Clear overview of the website design, features, functionality, and workflow.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Step-by-step explanation of the development process, timeline, and execution strategy.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Palette,
    title: "Planning, Inputs & Initial Development",
    body: (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>After confirmation, we collect the required assets such as photos, videos, branding materials, and design preferences.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>A fully custom website is planned and designed based on your vision and business goals.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Project agreement and contract signing process is completed.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>30% advance payment is collected to initiate the development process.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Website development begins immediately after onboarding completion.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>First implementation and initial website version are completed within 4 days.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>A second meeting is conducted to review the progress and live implementation.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Feedback, improvements, and refinements are discussed and applied based on your requirements.</span>
          </div>
        </div>
      </div>
    )
  },
  {
    Icon: BarChart3,
    title: "Final Development & Approval",
    body: (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>During the second meeting, we present all implemented changes and updates to the website.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Website structure, design, features, and functionality are finalized based on your feedback.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Final refinements and optimizations are completed for a polished user experience.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>The website becomes fully completed and ready for launch.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>40% payment of the total agreed project amount is collected at this stage.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>We connect the domain and deliver the website to you.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold flex-shrink-0">→</span>
            <span>Final payment of the work (30%) is paid at this point.</span>
          </div>
        </div>
      </div>
    )
  },

];

export function FeaturesGrid() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="liquid-glass rounded-full px-3.5 py-1.5 mb-6 border border-white/40 shadow-sm">
          <span className="text-slate-800 text-xs font-semibold font-body tracking-wide">
            Client Onboarding & Payment
          </span>
        </div>
        <BlurText
          text="The difference is everything."
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-slate-900 tracking-tight leading-[0.9] block"
          delay={100}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
        {features.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="liquid-glass rounded-2xl p-6 flex flex-col gap-4 border border-white/30 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/5">
              <Icon size={20} className="text-blue-600 animate-pulse" style={{ animationDuration: "3s" }} />
            </div>
            <h3 className="text-slate-900 font-body font-semibold text-base leading-snug">
              {title}
            </h3>
            <div className="text-slate-600 font-body font-light text-sm leading-relaxed">
              {body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
