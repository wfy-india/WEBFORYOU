"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, ArrowRight, ShieldCheck, Clock, Zap, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const contactInfo = [
  {
    title: "WhatsApp Us",
    value: "+91 8106532307",
    icon: MessageCircle,
    description: "Our primary method of communication for all inquiries.",
  },
  {
    title: "Response Time",
    value: "Within 24 Hours",
    icon: Clock,
    description: "We value your time and aim for quick turnarounds.",
  },
  {
    title: "Support",
    value: "Priority Support",
    icon: Zap,
    description: "Dedicated assistance for all our ongoing projects.",
  },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send');
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 mb-20">
          <Badge variant="outline" className="px-6 py-1.5 text-sm uppercase tracking-widest font-bold">Contact</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Contact <span className="text-primary">WebForYou</span> Web Agency Today.
          </h1>
          <p className="text-muted-foreground text-xl">
            Have a premium web development project in mind? We'd love to hear from you. Get in touch and let's start your journey to digital dominance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          {/* Contact Form */}
          <Card className="border-primary/10 bg-secondary/10 backdrop-blur-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  required
                  placeholder="Rajesh k"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Number</label>
                <Input
                  required
                  type="tel"
                  placeholder="+91 910XXXXX05"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  required
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px] bg-background/50"
                />
              </div>
              <Button disabled={loading} type="submit" className="w-full rounded-full h-12 text-lg font-bold">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          {/* Primary Contact CTA */}
          <section className="bg-primary text-primary-foreground p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:40px_40px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center backdrop-blur-xl mb-2">
                <MessageSquare size={32} className="text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Prefer WhatsApp?</h2>
              <p className="text-primary-foreground/80">
                You can also reach us directly via WhatsApp for any urgent matters.
              </p>
              <Button variant="outline" className="  hover:text-primary text-black border-black" asChild>
                <a href="https://wa.me/918106532307" target="_blank" rel="noopener noreferrer">
                  WhatsApp us directly
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <div className="pt-8 mt-8 border-t border-white/10 w-full">
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-medium uppercase tracking-widest">Secure Submission</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-primary/10 bg-secondary/20 backdrop-blur-sm hover:border-primary/30 transition-all duration-500">
                <CardContent className="pt-8 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <info.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold">{info.title}</h3>
                  <p className="text-primary font-medium select-all">{info.value}</p>
                  <p className="text-muted-foreground text-sm">{info.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

