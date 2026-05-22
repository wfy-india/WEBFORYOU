"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowLeft, Download, ExternalLink, Linkedin } from "lucide-react";
import Link from "next/link";

const INTERN_DATA: Record<string, string> = {
  "wfy9417bsi": "Pratibha",
  "wfy9345bsi": "HIMESH VARMA R",
  "wfy9491bsi": "somireddy chaitanya nag",
  "wfy6383bsi": "Clarita Amala Dharshini J",
  "wfy9628bsi": "Prince Sharma",
  "wfy6268bsi": "Yashwardhan Sisodiya",
  "wfy9840bsi": "Aakash Sriram",
  "wfy7433bsi": "archie agarwal",
  "wfy6264bsi": "Baijayanti Dash",
  "wfy9422bsi": "Sejal patil",
};

export default function CertificatePage() {
  const params = useParams();
  const id = params.id as string;
  const name = INTERN_DATA[id];

  if (!name) {
    return (
      <main className="min-h-screen pt-32 pb-24 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Certificate Not Found</h1>
          <p className="text-muted-foreground mb-8">The certificate ID you are looking for does not exist.</p>
          <Link href="/careers">
            <button className="flex items-center gap-2 text-primary font-bold hover:underline mx-auto">
              <ArrowLeft size={20} /> Back to Careers
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent_40%)]">
      <div className="max-w-4xl mx-auto">
        <Link href="/careers" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group">
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Back to Careers
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/20 border border-primary/10 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8"
            >
              <Award size={48} />
            </motion.div>

            <Badge variant="outline" className="mb-6 px-4 py-1 text-primary border-primary/20">Official Certification</Badge>
            
            <h1 className="text-6xl md:text-8xl font-caveat text-foreground mb-8">
              {name}
            </h1>

            <div className="max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6">
                successfully completed business development and sales internship at <span className="underline decoration-primary/30">webforyou</span> starting from jan xx to feb xx
              </p>
              
              <div className="h-px w-24 bg-primary/20 mx-auto mb-8" />
              
              <p className="text-lg font-medium font-caveat text-foreground mb-12 font-family: var(--font-sans);">
                Claim your certificate <a href="http://www.drive.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">www.drive.com <ExternalLink size={16} /></a>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
                <a 
                  href="https://www.linkedin.com/feed/?shareActive=true" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-primary/20 bg-background px-8 py-4 rounded-2xl font-bold hover:bg-secondary/50 transition-colors"
                >
                   <Linkedin size={20} className="text-[#0077b5]" />
                   Share on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Certificate ID: {id} • Issued by WebForYou Human Resources
          </p>
        </div>
      </div>
    </main>
  );
}
