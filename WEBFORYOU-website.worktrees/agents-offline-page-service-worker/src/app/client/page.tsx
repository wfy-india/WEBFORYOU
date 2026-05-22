"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle2, 
  Clock, 
  LayoutDashboard, 
  LogOut, 
  Calendar,
  MapPin,
  Palette,
  ArrowRight,
  Wrench,
  Paperclip,
  X,
  Loader2,
  FileText,
  ImageIcon,
  ClipboardList,
  Eye,
  IndianRupee,
  ShieldCheck,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Project = {
  id: string;
  client_name: string;
  business_name: string;
  description: string;
  branding_colors: string;
  deadline: string;
  google_maps_link: string;
  status: 'new' | 'ongoing' | 'completed';
  investment_cost?: number;
  amount_paid?: number;
};

type Milestone = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'ongoing' | 'completed';
  order: number;
};

type MaintenanceRequest = {
  id: string;
  project_id: string;
  message: string;
  attachments: string[];
  status: 'pending' | 'in_progress' | 'resolved' | 'failed';
  created_at: string;
  updated_at: string;
};

type AttachedFile = {
  file: File;
  preview?: string;
  type: 'image' | 'pdf';
};

export default function ClientDashboard() {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Maintenance request state
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Requests list state
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Billing states
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getPaymentStatus = (p: Project) => {
    const cost = Number(p.investment_cost) || 0;
    const paid = Number(p.amount_paid) || 0;
    if (cost === 0) return 'pending';
    if (paid >= cost) return 'paid';
    if (paid > 0) return 'partial';
    return 'pending';
  };

  const getPaymentStatusBadge = (p: Project) => {
    const ps = getPaymentStatus(p);
    if (ps === 'paid') return (
      <Badge className="bg-green-500/10 text-green-700 border border-green-500/30 gap-1">
        <CheckCircle2 size={12} /> Paid
      </Badge>
    );
    if (ps === 'partial') return (
      <Badge className="bg-orange-500/10 text-orange-700 border border-orange-500/30 gap-1">
        <Clock size={12} /> Partial
      </Badge>
    );
    return (
      <Badge className="bg-red-500/10 text-red-700 border border-red-500/30 gap-1">
        <AlertCircle size={12} /> Pending
      </Badge>
    );
  };

  const handlePayment = async () => {
    if (!project) return;

    const cost = Number(project.investment_cost) || 0;
    const paid = Number(project.amount_paid) || 0;
    const amountDue = Math.max(0, cost - paid);

    if (amountDue <= 0) {
      toast.info("No payment due for this project.");
      return;
    }

    // Convert to paise (₹1 = 100 paise)
    const amountInPaise = Math.round(amountDue * 100);

    if (amountInPaise < 100) {
      toast.error("Minimum payment amount is ₹1.");
      return;
    }

    // Check if Razorpay script is loaded
    if (typeof window.Razorpay === 'undefined') {
      toast.error("Payment system is loading. Please try again in a moment.");
      return;
    }

    setPaying(true);

    try {
      // Step 1: Create order on backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${project.id.slice(0, 8)}_${Date.now().toString(36)}`,
          notes: {
            project_id: project.id,
            business_name: project.business_name,
            client_name: project.client_name,
          },
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create payment order');
      }

      const orderData = await orderRes.json();

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'WebForYou',
        description: `Payment for ${project.business_name}`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                project_id: project.id,
                amount_paid_paise: amountInPaise,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              setPaymentSuccess(true);
              toast.success("Payment successful! Thank you.", {
                description: `Payment ID: ${response.razorpay_payment_id}`,
                duration: 6000,
              });

              // Refresh project data from database to update the UI
              const passkey = getPasskey();
              if (passkey) {
                fetchProjectData(passkey);
              }
            } else {
              toast.error("Payment verification failed.", {
                description: verifyData.error || "Please contact support if amount was deducted.",
              });
            }
          } catch {
            toast.error("Could not verify payment. Please contact support.", {
              description: `Reference: ${response.razorpay_payment_id}`,
            });
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: project.client_name,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast.info("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failures
      rzp.on('payment.failed', (response: any) => {
        setPaying(false);
        toast.error("Payment failed.", {
          description: response.error.description || "Please try again.",
        });
      });

      rzp.open();
    } catch (error: unknown) {
      setPaying(false);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
    }
  };

  function getPasskey() {
    return localStorage.getItem("client_passkey") || "";
  }

  async function fetchMilestones(passkey: string) {
    const res = await fetch(`/api/client?passkey=${encodeURIComponent(passkey)}&milestones=true`);
    if (res.ok) {
      const data = await res.json();
      setMilestones(data.milestones || []);
    }
  }

  async function fetchRequests(passkey: string) {
    setRequestsLoading(true);
    const res = await fetch(`/api/client?passkey=${encodeURIComponent(passkey)}&requests=true`);
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests || []);
    }
    setRequestsLoading(false);
  }

  async function fetchProjectData(passkey: string) {
    setLoading(true);
    const res = await fetch(`/api/client?passkey=${encodeURIComponent(passkey)}`);
    
    if (!res.ok) {
      localStorage.removeItem("client_passkey");
      router.push("/client/login");
      return;
    }

    const data = await res.json();
    setProject(data.project);
    await fetchMilestones(passkey);
    await fetchRequests(passkey);
    setLoading(false);
  }

  useEffect(() => {
    const passkey = localStorage.getItem("client_passkey");
    if (!passkey) {
      router.push("/client/login");
    } else {
      fetchProjectData(passkey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Subscribe to realtime changes (anon key is safe for this)
  useEffect(() => {
    if (!project) return;
    const passkey = getPasskey();

    const channel = supabase
      .channel('client_portal_updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `id=eq.${project.id}`
      }, (payload) => {
        const { passkey: _, ...safeProject } = payload.new as Project & { passkey?: string };
        setProject(safeProject as Project);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'milestones',
        filter: `project_id=eq.${project.id}`
      }, () => {
        fetchMilestones(passkey);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'maintenance_requests',
        filter: `project_id=eq.${project.id}`
      }, () => {
        fetchRequests(passkey);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const logout = () => {
    localStorage.removeItem("client_passkey");
    router.push("/client/login");
  };

  // Maintenance request handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: AttachedFile[] = [];
    
    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      if (!isImage && !isPdf) {
        toast.error(`${file.name} is not a valid file type. Only images and PDFs are allowed.`);
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit.`);
        continue;
      }
      
      const attachedFile: AttachedFile = {
        file,
        type: isImage ? 'image' : 'pdf',
        preview: isImage ? URL.createObjectURL(file) : undefined
      };
      
      validFiles.push(attachedFile);
    }
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const submitMaintenanceRequest = async () => {
    if (!maintenanceMessage.trim()) {
      toast.error("Please describe your maintenance request.");
      return;
    }
    
    if (!project) return;
    const passkey = getPasskey();
    
    setSubmitting(true);
    
    try {
      // Upload attachments via API route
      const uploadedUrls: string[] = [];
      
      for (const attachedFile of attachedFiles) {
        const formData = new FormData();
        formData.append('file', attachedFile.file);
        formData.append('project_id', project.id);
        
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        
        if (!uploadRes.ok) {
          toast.error(`Failed to upload ${attachedFile.file.name}`);
          continue;
        }
        
        const uploadData = await uploadRes.json();
        uploadedUrls.push(uploadData.url);
      }
      
      // Submit maintenance request via API route
      const res = await fetch('/api/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passkey,
          message: maintenanceMessage.trim(),
          attachments: uploadedUrls
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit');
      
      toast.success("Request submitted successfully!");
      setMaintenanceMessage("");
      setAttachedFiles([]);
      setMaintenanceOpen(false);
      fetchRequests(passkey);
      
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'pending':
          return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Pending</Badge>;
        case 'in_progress':
          return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/30">In Progress</Badge>;
        case 'resolved':
          return <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge>;
        case 'failed':
          return <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/30">Failed</Badge>;
        default:
          return <Badge variant="secondary">{status}</Badge>;
      }
    };

  const viewRequestDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <p className="text-muted-foreground animate-pulse">Loading project details...</p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <LayoutDashboard className="text-primary flex-shrink-0" />
            <h1 className="font-bold text-lg sm:text-xl truncate">{project.business_name}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        {/* Project Info Card */}
        <Card className="mb-8 sm:mb-12 border-primary/10 shadow-lg bg-gradient-to-br from-background to-secondary/50">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
              <Badge className="px-3 py-1 text-sm capitalize w-fit">
                {project.status} Project
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar size={16} />
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-4xl font-bold tracking-tight mb-2">
              Hello, {project.client_name}!
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Here is the real-time progress of your project.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t px-4 sm:px-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Palette size={18} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold">Branding Colors</h4>
                  <p className="text-muted-foreground break-words">{project.branding_colors || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Location</h4>
                  {project.google_maps_link ? (
                    <a href={project.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      View on Maps <ArrowRight size={14} />
                    </a>
                  ) : (
                    <p className="text-muted-foreground">No link provided</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Billing & Payments Card */}
        {project.investment_cost !== undefined && Number(project.investment_cost) > 0 && (
          <Card className="mb-8 sm:mb-12 border-primary/10 shadow-lg bg-gradient-to-br from-background to-secondary/50 overflow-hidden">
            <CardHeader className="p-4 sm:p-6 border-b border-primary/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Billing & Payments</CardTitle>
                    <CardDescription className="text-sm">Manage invoices and securely pay online via Razorpay</CardDescription>
                  </div>
                </div>
                {getPaymentStatusBadge(project)}
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="rounded-2xl bg-secondary/30 border border-primary/5 p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium flex items-center gap-1.5">
                    <IndianRupee size={15} className="text-muted-foreground" /> Total Project Cost
                  </span>
                  <span className="text-xl font-bold">₹{Number(project.investment_cost).toLocaleString('en-IN')}</span>
                </div>

                {getPaymentStatus(project) === 'partial' && (
                  <>
                    <div className="h-px bg-border/40" />
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={15} /> Amount Paid
                      </span>
                      <span className="text-green-600 font-semibold">₹{Number(project.amount_paid).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-500 text-sm font-medium flex items-center gap-1.5">
                        <AlertCircle size={15} /> Amount Pending
                      </span>
                      <span className="text-red-500 font-semibold">
                        ₹{Math.max(0, Number(project.investment_cost) - Number(project.amount_paid)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (Number(project.amount_paid) / Number(project.investment_cost)) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right font-medium">
                        {Math.round((Number(project.amount_paid) / Number(project.investment_cost)) * 100)}% paid
                      </p>
                    </div>
                  </>
                )}

                {getPaymentStatus(project) === 'pending' && (
                  <>
                    <div className="h-px bg-border/40" />
                    <div className="flex items-center justify-between">
                      <span className="text-red-500 text-sm font-medium flex items-center gap-1.5">
                        <AlertCircle size={15} /> Amount Pending
                      </span>
                      <span className="text-red-500 font-semibold">₹{Number(project.investment_cost).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}

                {(getPaymentStatus(project) === 'paid' || paymentSuccess) && (
                  <div className="flex items-center gap-2 text-green-600 text-sm pt-1 font-medium bg-green-500/5 border border-green-500/10 rounded-xl p-3">
                    <CheckCircle2 size={18} />
                    <span>Payment fully received. Thank you for your business!</span>
                  </div>
                )}
              </div>

              {/* Payment Success Banner */}
              {paymentSuccess && getPaymentStatus(project) !== 'paid' && (
                <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <ShieldCheck className="text-green-600 shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-green-700 text-sm">Payment Verified Successfully</p>
                    <p className="text-xs text-green-600/80">Your payment has been securely processed and verified.</p>
                  </div>
                </div>
              )}

              {/* Pay Now Button */}
              {getPaymentStatus(project) !== 'paid' && !paymentSuccess && (
                <Button
                  className="w-full h-12 text-base gap-2 rounded-xl shadow-md bg-primary hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                  size="lg"
                  onClick={handlePayment}
                  disabled={paying}
                >
                  {paying ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing Secure Payment...
                    </>
                  ) : (
                    <>
                      <IndianRupee size={18} />
                      Pay Now — ₹{Math.max(0, Number(project.investment_cost) - Number(project.amount_paid)).toLocaleString('en-IN')}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Visual Progress Flow */}
        <div className="space-y-6 sm:space-y-8">
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
            <Clock className="text-primary" /> Project Journey
          </h3>

          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="text-center py-12 bg-background/50 rounded-2xl border border-dashed">
                <p className="text-muted-foreground italic">Project is being initialized. Check back soon!</p>
              </div>
            ) : (
              milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`relative transition-all duration-500 ${
                      milestone.status === 'completed' 
                        ? 'border-green-500/30 bg-green-500/5 shadow-sm' 
                        : milestone.status === 'ongoing'
                        ? 'border-blue-500/50 bg-blue-500/5 shadow-md ring-1 ring-blue-500/20'
                        : 'border-muted opacity-60'
                    }`}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                          <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-colors ${
                            milestone.status === 'completed' 
                              ? 'bg-green-500 text-white' 
                              : milestone.status === 'ongoing'
                              ? 'bg-blue-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {milestone.status === 'completed' ? (
                              <CheckCircle2 size={24} />
                            ) : milestone.status === 'ongoing' ? (
                              <Clock size={24} className="animate-spin-slow" />
                            ) : (
                              <span className="text-lg font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
                              <h4 className={`text-base sm:text-xl font-bold ${
                                milestone.status === 'completed' ? 'text-green-700' : 
                                milestone.status === 'ongoing' ? 'text-blue-700' : 
                                ''
                              }`}>
                                {milestone.title}
                              </h4>
                              <Badge 
                                variant={milestone.status === 'completed' ? 'default' : 'secondary'} 
                                className={`w-fit ${
                                  milestone.status === 'completed' ? 'bg-green-500' : 
                                  milestone.status === 'ongoing' ? 'bg-blue-500 text-white' : 
                                  ''
                                }`}
                              >
                                {milestone.status === 'completed' ? 'Completed' : 
                                 milestone.status === 'ongoing' ? 'Ongoing' : 
                                 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {milestone.description || "The team is working on this milestone."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

              ))
            )}
          </div>
        </div>

          {/* Support CTA */}
          <div className="mt-12 sm:mt-16 text-center p-6 sm:p-12 bg-primary/5 rounded-2xl sm:rounded-[3rem] border border-primary/10">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Have questions about your project?</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base">
              We&apos;re here to help! Feel free to reach out to our team anytime for clarifications or updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href="https://wa.me/918106532307" target="_blank" rel="noopener noreferrer">Contact Support</a>
              </Button>
              
              <Dialog open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="rounded-full px-8 gap-2">
                    <Wrench size={18} />
                    Raise Service Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Wrench className="text-primary" size={20} />
                      New Service Request
                    </DialogTitle>
                    <DialogDescription>
                      Describe the issue or update you need. You can attach images and PDFs to help explain.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="maintenance-message">Describe your request *</Label>
                      <Textarea
                        id="maintenance-message"
                        placeholder="Please describe the maintenance or update you need..."
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Attachments (optional)</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2"
                        >
                          <Paperclip size={16} />
                          Attach Files
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Images & PDFs (max 10MB each)
                        </span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {attachedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {attachedFiles.map((attachedFile, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg border"
                            >
                              {attachedFile.type === 'image' && attachedFile.preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={attachedFile.preview}
                                  alt={attachedFile.file.name}
                                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  {attachedFile.type === 'pdf' ? (
                                    <FileText size={20} className="text-primary" />
                                  ) : (
                                    <ImageIcon size={20} className="text-primary" />
                                  )}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {attachedFile.file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(attachedFile.file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                                onClick={() => removeFile(index)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMaintenanceOpen(false);
                        setMaintenanceMessage("");
                        setAttachedFiles([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitMaintenanceRequest}
                      disabled={submitting || !maintenanceMessage.trim()}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* My Requests Section */}
          <div className="mt-12 sm:mt-16 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              <ClipboardList className="text-primary" /> My Requests
            </h3>

            {requestsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No service requests yet.</p>
                  <p className="text-sm text-muted-foreground">Click &quot;Raise Service Request&quot; above to submit one.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                              {getStatusBadge(request.status)}
                              <span className="text-xs text-muted-foreground">
                                {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm line-clamp-2">{request.message}</p>
                            {request.attachments && request.attachments.length > 0 && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <Paperclip size={12} />
                                {request.attachments.length} attachment{request.attachments.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewRequestDetails(request)}
                            className="gap-1 flex-shrink-0"
                          >
                            <Eye size={16} />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Request Details Dialog */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ClipboardList className="text-primary" size={20} />
                  Request Details
                </DialogTitle>
              </DialogHeader>
              
              {selectedRequest && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <p className="font-medium">
                      {new Date(selectedRequest.created_at).toLocaleDateString()} at {new Date(selectedRequest.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Description</span>
                    <p className="mt-1 p-3 bg-secondary/50 rounded-lg text-sm whitespace-pre-wrap">
                      {selectedRequest.message}
                    </p>
                  </div>
                  
                  {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Attachments</span>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {selectedRequest.attachments.map((url, index) => {
                          const isPdf = url.toLowerCase().endsWith('.pdf');
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-secondary/50 rounded-lg border hover:bg-secondary transition-colors"
                            >
                              {isPdf ? (
                                <div className="flex items-center gap-2">
                                  <FileText size={24} className="text-primary" />
                                  <span className="text-xs truncate">PDF Document</span>
                                </div>
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={url}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    );
  }
