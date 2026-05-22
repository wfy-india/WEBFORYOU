"use client";

import { WordHeroPage } from "@/components/ui/scroll-hero-section";
import { motion } from "framer-motion";
import { Users, Target, Heart, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const values = [
  {
    title: "Results First",
    description: "We don't just build websites; we build engines for business growth.",
    icon: Target,
  },
  {
    title: "Trust & Transparency",
    description: "Honest communication and reliable delivery are our core foundations.",
    icon: Shield,
  },
  {
    title: "Continuous Innovation",
    description: "Staying ahead of trends to ensure your business remains future-proof.",
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Scroll Hero Section */}
      <section className="h-screen bg-black overflow-hidden relative">
        <h1 className="sr-only">About WebForYou | Premium Web Development Agency</h1>
        <WordHeroPage
          items={['Results.', 'Trust.', 'Growth.', 'Credibility.', 'WebForYou.']}
          theme="dark"
          animate
          hue={175}
          startVh={50}
          spaceVh={100}
          taglineHTML={`We don't just sell websites.<br />We sell <span class="bg-gradient-to-r from-[#FF9A8B] to-[#00C9A7] bg-clip-text text-transparent font-bold">Growth</span> and <span class="bg-gradient-to-r from-[#FF9A8B] to-[#00C9A7] bg-clip-text text-transparent font-bold">Trust</span>.`}
        />
      </section>

      {/* About Content */}
      <section className="py-24 px-6 bg-background relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <Badge variant="outline" className="w-fit">Our Philosophy</Badge>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Clients don't buy websites. They buy <span className="bg-gradient-to-r from-[#FF9A8B] to-[#00C9A7] bg-clip-text text-transparent">Credibility.</span>
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                At WebForYou, we understand that your digital presence is the face of your business. Our mission is to bridge the gap between "having a website" and "having a conversion engine."
              </p>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-lg font-medium">Focus on Business Growth</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Users size={24} />
                  </div>
                  <span className="text-lg font-medium">Human-Centric Design</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700">
                <img
                  src="/about-philosophy.png"
                  alt="WebForYou Philosophy Illustration"
                  className="w-full h-full object-cover"
                />
              </div>

            </motion.div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The principles that guide every pixel we design and every line of code we write.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2rem] border border-primary/10 bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary mb-6 shadow-sm">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-32 px-6 bg-secondary/20">
        <div className="container mx-auto text-center">
          <Badge className="mb-8">The Future</Badge>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-12 max-w-5xl mx-auto">
            "We envision a digital world where every business, regardless of size, has the power to inspire trust and drive innovation."
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
      </section>
    </main>
  );
}
