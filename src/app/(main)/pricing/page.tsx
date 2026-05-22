"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star, Crown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlanRequestDialog } from "@/components/plan-request-dialog";
import { BreadcrumbSchema, FAQSchema } from "@/components/JsonLd";

const plans = [
    {
      name: "Basic Plan",
      tagline: "Static Website",
      price: "₹15,000 – ₹17,000",
      description: "Perfect for portfolios and simple business profiles.",
      icon: Zap,
      color: "bg-primary/10 text-primary",
      features: [
        "Fast-loading site",
        "Responsive design",
        "Basic animations",
        "Fixed number of pages",
        "No backend required",
        "SEO friendly",
        "Free hosting setup",
        "Basic content updates",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium Plan",
      tagline: "Dynamic Website",
      price: "35,000 – ₹60,000",
      description: "Ideal for growing businesses needing complex features.",
      icon: Star,
      color: "bg-accent/10 text-accent",
      features: [
        "Includes everything in Static",
        "Backend + Database",
        "Admin dashboard",
        "Dynamic content",
        "Payments (Razorpay)",
        "Redirected emails & WhatsApp",
        "Advanced animations",
        "Analytics integration",
        "API integrations",
        "Professional UI/UX",
        "Priority maintainance response."
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Elite Plan",
      tagline: "AI-Integrated Website",
      price: "₹75,000 - ₹1,50,000",
      description: "Next-gen solutions with cutting-edge AI power.",
      icon: Crown,
      color: "bg-primary/10 text-primary",
      features: [
        "Includes everything in Dynamic",
        "AI chatbot",
        "AI form assistant",
        "AI recommendations",
        "Automation workflows",
        "Voice assistant options",
        "AI analytics",
        "Smart reminders",
        "AI content generation",
        "Future-proof scalable design",
      ],
      cta: "Get Started",
      popular: false,
      note: "monthly API costs extra",
    },
];

export default function PricingPage() {
  return (
    <main className="pt-32 pb-24 px-6">
      <BreadcrumbSchema 
        items={[
          { name: "Home", item: "/" },
          { name: "Pricing", item: "/pricing" }
        ]} 
      />
      <FAQSchema 
        faqs={[
          { 
            question: "What is included in the Basic Plan?", 
            answer: "The Basic Plan includes a fast-loading static website, responsive design, basic animations, and free hosting setup." 
          },
          { 
            question: "How long does a Premium website take?", 
            answer: "A Premium website typically takes 2-4 weeks to complete, including backend integration and custom UI/UX design." 
          },
          { 
            question: "Can I upgrade my plan later?", 
            answer: "Yes, our websites are built for scalability. You can upgrade from a static site to a dynamic or AI-integrated solution anytime." 
          }
        ]} 
      />
      <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-6 mb-20">
            <Badge variant="outline" className="px-6 py-1.5 text-sm uppercase tracking-widest font-bold">Pricing</Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Web Development Pricing & <span className="bg-gradient-to-r from-[#FF9A8B] to-[#00C9A7] bg-clip-text text-transparent">Growth Investment.</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl">
              Choose the perfect web development plan to scale your business. Transparent pricing for startups to enterprises.
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Card className={cn(
                "relative flex flex-col h-full transition-all duration-500 hover:shadow-2xl border-primary/10",
                plan.popular ? "lg:scale-110 z-10 border-primary/40 shadow-xl bg-gradient-to-b from-primary/5 to-transparent" : "bg-secondary/20"
              )}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">MOST POPULAR</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", plan.color)}>
                    <plan.icon size={24} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-lg font-medium text-foreground/80">{plan.tagline}</CardDescription>
                  <div className="mt-6 flex flex-col">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.note && <span className="text-xs text-muted-foreground mt-1 font-medium italic">({plan.note})</span>}
                  </div>
                  <p className="mt-4 text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What's included</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="pt-8">
                  <PlanRequestDialog 
                    planName={plan.name} 
                    trigger={
                        <Button className={cn(
                          "w-full rounded-xl py-6 text-lg font-bold group",
                          plan.popular ? "shadow-lg shadow-primary/20" : ""
                        )} variant={plan.popular ? "default" : "outline"}>
                        {plan.cta}
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    } 
                  />
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Preview or Trust Section */}
        <section className="mt-32 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by 50+ businesses worldwide</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:opacity-100 transition-all duration-500">
            {/* Using text logos for simplicity as Unsplash isn't for logos */}
            <span className="text-2xl font-black">CLINICFLOW</span>
            <span className="text-2xl font-black">GYMSTRONGER</span>
            <span className="text-2xl font-black">TECHNOVA</span>
            <span className="text-2xl font-black">LUXE RETAIL</span>
            <span className="text-2xl font-black">ROAST N TOAST</span>
          </div>
        </section>
      </div>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
