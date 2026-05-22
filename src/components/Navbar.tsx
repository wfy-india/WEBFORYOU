"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home,
  LayoutGrid,
  DollarSign,
  Info,
  Mail,
  ArrowRight,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Services", icon: LayoutGrid, href: "/services" },
  { title: "Pricing", icon: DollarSign, href: "/pricing" },
  { title: "Billing", icon: CreditCard, href: "/billing" },
  { title: "About", icon: Info, href: "/about" },
  { title: "Contact", icon: Mail, href: "/contact" },
  { type: "separator" as const },
  { title: "Portal", icon: LayoutGrid, href: "/client/login" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = tabs.findIndex(tab => tab.href === pathname);

  const handleTabChange = (index: number | null) => {
    if (index !== null) {
      const tab = tabs[index];
      if (tab.href) {
        router.push(tab.href);
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header 
        className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        (isScrolled || mobileMenuOpen) ? "bg-background/80 backdrop-blur-md border-b py-2" : "bg-transparent"
      )}
    >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
<Link href="/" className="flex items-center group">
            <Image 
              src="/logo.jpeg" 
              alt="WebForYou" 
              width={190} 
              height={100} 
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ExpandableTabs 
            tabs={tabs} 
            activeTab={activeIndex >= 0 ? activeIndex : null}
            onChange={handleTabChange}
          />
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button className="rounded-full px-6 group" onClick={() => router.push("/contact")}>
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Morph Glass Backdrop */}
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="fixed inset-0 bg-background/40 z-[-1] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Morphing Mobile Menu Card */}
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95, clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, y: -20, scale: 0.95, clipPath: "inset(0% 0% 100% 0%)" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden absolute top-[calc(100%+1rem)] left-4 right-4 bg-background/80 backdrop-blur-2xl border rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-2 overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {tabs.map((tab, i) => {
                  if (tab.type === "separator") {
                    return <div key={`sep-${i}`} className="h-px bg-border/50 my-2 mx-4" />;
                  }
                  
                  return (
                    <Link 
                      key={tab.title}
                      href={tab.href!}
                      onClick={() => setMobileMenuOpen(false)}
                      onMouseEnter={() => router.prefetch(tab.href!)}
                      className={cn(
                        "flex items-center gap-4 text-lg font-medium p-4 rounded-2xl transition-all duration-300",
                        pathname === tab.href 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "hover:bg-muted/50 active:scale-95"
                      )}
                    >
                      <tab.icon size={22} />
                      {tab.title}
                    </Link>
                  );
                })}
              </div>
              
              <Button 
                className="w-full rounded-2xl py-7 text-lg mt-4 shadow-xl" 
                onClick={() => {
                  router.push("/contact");
                  setMobileMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
