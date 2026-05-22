"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { toast } from "sonner";

export default function ClientLoginPage() {
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedPasskey = localStorage.getItem("client_passkey");
    if (savedPasskey) {
      router.push("/client");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/client?passkey=${encodeURIComponent(passkey)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        toast.error("Invalid passkey. Please check and try again.");
      } else {
        localStorage.setItem("client_passkey", passkey);
        toast.success("Welcome back!");
        router.push("/client");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Key className="text-primary" size={32} />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Client Portal</CardTitle>
          <CardDescription className="text-base">
            Enter your unique passkey to track your project&apos;s progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your passkey"
                className="h-12 text-lg text-center tracking-widest font-mono"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
              {loading ? "Verifying..." : "View Project Progress"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
