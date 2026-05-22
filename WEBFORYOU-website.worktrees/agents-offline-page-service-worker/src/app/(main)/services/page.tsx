"use client";

import { motion } from "framer-motion";
import { 
  Monitor, 
  Database, 
  Briefcase, 
  ShoppingCart, 
  Palette, 
  Search, 
  Bot, 
  Settings, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/JsonLd";

const allServices = [
    {
      title: "Static Websites",
      description: "Fast-loading, highly secure, and perfect for informative business sites.",
      icon: Monitor,
      useCases: ["Portfolios", "Landing Pages", "Company Profiles"],
      color: "text-primary",
    },
    {
      title: "Dynamic Websites",
      description: "Interactive sites with backend systems for real-time data management.",
      icon: Database,
      useCases: ["Portals", "Member Sites", "Content Platforms"],
      color: "text-accent",
    },
    {
      title: "Business Websites",
      description: "Professional online presence tailored specifically for corporate growth.",
      icon: Briefcase,
      useCases: ["Clinics", "Law Firms", "Consultancies"],
      color: "text-primary",
    },
    {
      title: "E-commerce",
      description: "Full-scale online stores with secure payments and inventory management.",
      icon: ShoppingCart,
      useCases: ["Retail Brands", "Digital Products", "Subscription Boxes"],
      color: "text-accent",
    },
    {
      title: "Landing Pages",
      description: "High-conversion single pages designed for specific marketing campaigns.",
      icon: Search,
      useCases: ["Ad Campaigns", "Product Launches", "Lead Generation"],
      color: "text-primary",
    },
    {
      title: "UI/UX Design",
      description: "Premium user interfaces and experiences that delight your customers.",
      icon: Palette,
      useCases: ["App Design", "Web Design", "Prototyping"],
      color: "text-accent",
    },
    {
      title: "Website Redesign",
      description: "Modernize your existing site with latest tech and design trends.",
      icon: RefreshCw,
      useCases: ["Legacy Sites", "Rebranding", "Mobile Optimization"],
      color: "text-primary",
    },
    {
      title: "SEO Optimization",
      description: "Rank higher on Google and attract more organic traffic to your business.",
      icon: Search,
      useCases: ["Local SEO", "Content Strategy", "Technical Audit"],
      color: "text-accent",
    },
    {
      title: "Maintenance & Support",
      description: "Continuous care for your website to keep it updated and secure.",
      icon: Settings,
      useCases: ["Updates", "Backups", "Security Monitoring"],
      color: "text-primary",
    },
    {
      title: "AI-Integrated Websites",
      description: "Next-gen websites with AI chatbots, automation, and smart features.",
      icon: Bot,
      useCases: ["AI Chatbots", "Smart Recommendations", "Auto-Forms"],
      color: "text-accent",
    },
];

export default function ServicesPage() {
  return (
    <main className="pt-32 pb-24 px-6">
      <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-6 mb-20">
            <Badge variant="outline" className="px-6 py-1.5 text-sm uppercase tracking-widest font-bold">Services</Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
              Web Development Services to <span className="bg-gradient-to-r from-[#FF9A8B] to-[#00C9A7] bg-clip-text text-transparent">Dominate Your Industry.</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl">
              From premium landing pages to complex AI-integrated ecosystems, we build digital solutions that drive real business growth and results.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-primary/10 hover:border-primary/40 bg-secondary/20 backdrop-blur-sm flex flex-col">
                <CardHeader>
                  <div className={cn("w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-500", service.color)}>
                    <service.icon size={32} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Common Use Cases</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.useCases.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-background/50 hover:bg-primary/10 transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full rounded-xl py-6 group/btn" asChild>
                    <Link href="/contact">
                      Get Started 
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Custom Solution CTA */}
        <section className="mt-32 p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-[#FF9A8B]/10 to-[#00C9A7]/10 border border-primary/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Need a custom solution?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Every business is unique. We offer bespoke digital strategies and development services tailored to your specific goals and challenges.
          </p>
          <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold shadow-xl shadow-primary/20 bg-gradient-to-r from-[#FF9A8B] to-[#00C9A7] border-0 hover:opacity-90 transition-opacity" asChild>
            <Link href="/contact">Book a Strategy Call</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
