"use client";

import { motion } from "framer-motion";
import { 
  Code, 
  Palette, 
  TrendingUp, 
  Mail, 
  ArrowRight,
  Zap,
  Rocket,
  UserCheck,
  Award,
  CheckCircle2,
  XCircle
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const VALID_IDS = [
  "wfy9417bsi",
  "wfy9345bsi",
  "wfy9491bsi",
  "wfy6383bsi",
  "wfy9628bsi",
  "wfy6268bsi",
  "wfy9840bsi",
  "wfy7433bsi",
  "wfy6264bsi",
  "wfy9422bsi"
];

const roles = [
  {
    title: "Web Developer",
    type: "Full-time / Performance-Based",
    description: "Build cutting-edge websites using Next.js, Tailwind, and AI tools.",
    icon: Code,
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "Designer",
    type: "Internship / Full-time",
    description: "Create premium UI/UX designs that set our clients apart.",
    icon: Palette,
    skills: ["Figma", "Adobe Suite", "Prototyping", "UI/UX"],
  },
  {
    title: "Sales Intern",
    type: "Internship / Performance-Based",
    description: "Help us reach more businesses and grow our agency footprint.",
    icon: TrendingUp,
    skills: ["Communication", "Lead Gen", "Strategy", "Persistence"],
  },
];

const timelineData = [
  {
    id: 1,
    title: "Application",
    date: "Step 1",
    content: "Send your portfolio and resume to our email.",
    category: "Process",
    icon: Mail,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Initial Screening",
    date: "Step 2",
    content: "We review your work and cultural fit.",
    category: "Process",
    icon: UserCheck,
    relatedIds: [1, 3],
    status: "in-progress" as const,
    energy: 80,
  },
  {
    id: 3,
    title: "Strategy Session",
    date: "Step 3",
    content: "A deep dive into your skills and how you can contribute.",
    category: "Process",
    icon: Rocket,
    relatedIds: [2, 4],
    status: "pending" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Onboarding",
    date: "Step 4",
    content: "Welcome to the team! Get access to tools and training.",
    category: "Process",
    icon: Zap,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 5,
    title: "First Project",
    date: "Final",
    content: "Start building the future of the web with us.",
    category: "Growth",
    icon: Code,
    relatedIds: [4],
    status: "pending" as const,
    energy: 20,
  },
];

export default function CareersPage() {
  const [internId, setInternId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleVerify = () => {
    const trimmedId = internId.trim();
    if (VALID_IDS.includes(trimmedId)) {
      router.push(`/certificate/${trimmedId}`);
    } else {
      setIsSuccess(false);
      setShowPopup(true);
      // Auto hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  return (
    <main className="pt-32 pb-24">
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 right-10 z-50"
          >
            <Card className={`border-2 ${isSuccess ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'} shadow-2xl backdrop-blur-md`}>
              <CardContent className="p-6 flex items-center gap-4">
                {isSuccess ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white"
                    >
                      <CheckCircle2 size={24} />
                    </motion.div>
                    <div>
                      <p className="font-bold text-green-700 dark:text-green-400">Certified Intern</p>
                      <p className="text-sm text-green-600/80 dark:text-green-400/80">Your ID: {internId}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white">
                      <XCircle size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-red-700 dark:text-red-400">Employee ID not found</p>
                      <p className="text-sm text-red-600/80 dark:text-red-400/80">Please check and try again.</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Careers Hero */}
      <section className="container mx-auto px-6 text-center mb-24">
        <Badge variant="outline" className="mb-6">Join WebForYou</Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Build the future of the <span className="text-primary">digital web.</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          We're looking for ambitious individuals who want to grow, learn, and create world-class digital experiences.
        </p>
      </section>

      {/* Role Cards */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-primary/10 hover:border-primary/40 bg-secondary/20">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-6 shadow-md text-primary group-hover:scale-110 transition-transform">
                    <role.icon size={32} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
                  <CardDescription className="text-primary font-medium">{role.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {role.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-background/50">{skill}</Badge>
                    ))}
                  </div>
                  <Button className="w-full rounded-xl py-6" asChild>
                    <a href="mailto:makemyportfolio3@gmail.com">Apply via Email</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hiring Process / Orbital Timeline */}
      <section className="bg-black py-32 overflow-hidden relative border-y border-white/5">
        <div className="container mx-auto px-6 text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Hiring Journey</h2>
          <p className="text-white/60">Click on the nodes to explore our step-by-step onboarding process.</p>
        </div>
        
        <div className="h-[600px] w-full max-w-5xl mx-auto">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
      </section>

      {/* Work Culture */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Not just a job. <br />A growth accelerator.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe in Performance-Based incentives, flexible work environments, and constant learning. At WebForYou, you don't just work for us; you build your own legacy alongside us.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Performance-Based bonuses",
                  "Flexible working hours",
                  "Access to premium AI tools",
                  "Collaborative high-energy team",
                  "Build a stellar portfolio"
                ].map(perk => (
                  <li key={perk} className="flex items-center gap-3 font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ArrowRight size={14} />
                    </div>
                    {perk}
                  </li>
                ))}
              </ul>

              <Button size="lg" className="w-fit rounded-full px-8" asChild>
                <a href="mailto:makemyportfolio3@gmail.com">Tell us why you're a fit</a>
              </Button>
            </div>

            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80" 
                alt="Modern Workplace" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="container mx-auto px-6 py-24 border-t border-primary/10">
        <div className="max-w-4xl mx-auto bg-secondary/30 rounded-[3rem] p-12 text-center flex flex-col items-center gap-8 shadow-inner">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Award size={40} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Certification Program</h2>
            <p className="text-muted-foreground text-lg">
              Completed your internship or tenure with us? Get your official employment certificate instantly by entering your Intern ID below.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input 
              type="text" 
              placeholder="Enter Intern ID (e.g. wfy1234sdi)" 
              value={internId}
              onChange={(e) => setInternId(e.target.value)}
              className="flex-1 px-6 py-4 rounded-2xl bg-background border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
            />
            <Button 
              size="lg" 
              className="rounded-2xl px-8 py-4 h-auto font-bold"
              onClick={handleVerify}
            >
              Get Certificate
            </Button>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Can't find your ID? Contact HR at makemyportfolio3@gmail.com
          </p>
        </div>
      </section>
    </main>
  );
}
