"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, IndianRupee, CheckCircle2, AlertCircle, Clock, CreditCard, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Razorpay type declarations
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

type BillingProject = {
  id: string;
  business_name: string;
  client_name: string;
  investment_cost: number;
  amount_paid: number;
  status: string;
};

function paymentStatus(p: BillingProject): 'paid' | 'partial' | 'pending' {
  const cost = Number(p.investment_cost) || 0;
  const paid = Number(p.amount_paid) || 0;
  if (cost === 0) return 'pending';
  if (paid >= cost) return 'paid';
  if (paid > 0) return 'partial';
  return 'pending';
}

function PaymentStatusBadge({ project }: { project: BillingProject }) {
  const ps = paymentStatus(project);
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
}

export default function BillingPage() {
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BillingProject | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/developer?action=billing')
      .then(r => r.json())
      .then(d => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = projects.filter(p =>
    p.business_name.toLowerCase().includes(query.toLowerCase()) ||
    p.client_name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (p: BillingProject) => {
    setSelected(p);
    setQuery(p.business_name);
    setShowDropdown(false);
    setPaymentSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelected(null);
    setShowDropdown(true);
    setPaymentSuccess(false);
  };

  const handlePayment = useCallback(async () => {
    if (!selected) return;

    const cost = Number(selected.investment_cost) || 0;
    const paid = Number(selected.amount_paid) || 0;
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
          receipt: `rcpt_${selected.id.slice(0, 8)}_${Date.now().toString(36)}`,
          notes: {
            project_id: selected.id,
            business_name: selected.business_name,
            client_name: selected.client_name,
          },
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create payment order');
      }

      const orderData = await orderRes.json();

      // Step 2: Open Razorpay checkout modal
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'WebForYou',
        description: `Payment for ${selected.business_name}`,
        order_id: orderData.order_id,
        handler: async (response: RazorpayResponse) => {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                project_id: selected.id,
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
              try {
                const refreshRes = await fetch('/api/developer?action=billing');
                const refreshData = await refreshRes.json();
                const updatedProjects = refreshData.projects || [];
                setProjects(updatedProjects);

                // Update the selected project with fresh data
                const updatedSelected = updatedProjects.find(
                  (p: BillingProject) => p.id === selected.id
                );
                if (updatedSelected) {
                  setSelected(updatedSelected);
                }
              } catch {
                // UI refresh failed, but payment was successful
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
          name: selected.client_name,
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
      rzp.on('payment.failed', (response: { error: { description: string } }) => {
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
  }, [selected]);

  const cost = Number(selected?.investment_cost) || 0;
  const paid = Number(selected?.amount_paid) || 0;
  const pending = Math.max(0, cost - paid);
  const ps = selected ? paymentStatus(selected) : null;

  return (
    <div className="min-h-screen bg-secondary/20 pt-28 pb-20 px-4">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <CreditCard className="text-primary" size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Search your business to view payment details</p>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search by business or client name..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => { if (query.trim()) setShowDropdown(true); }}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && query.trim().length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 top-full mt-1 w-full bg-background border rounded-xl shadow-lg overflow-hidden max-h-72 overflow-y-auto"
            >
            {loading ? (
                <p className="text-sm text-muted-foreground p-4 text-center">Loading...</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">No businesses found</p>
              ) : (
                filtered.map(p => (
                  <button
                    key={p.id}
                    className="w-full text-left px-4 py-3 hover:bg-muted/60 transition-colors flex items-center justify-between gap-2"
                    onMouseDown={() => handleSelect(p)}
                  >
                    <div>
                      <p className="font-medium">{p.business_name}</p>
                      <p className="text-xs text-muted-foreground">{p.client_name}</p>
                    </div>
                    <PaymentStatusBadge project={p} />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Billing Card */}
        {selected && (
          <Card className="border-2 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-xl">{selected.business_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{selected.client_name}</p>
                </div>
                <PaymentStatusBadge project={selected} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {cost === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No billing information available for this business.</p>
              ) : (
                <>
                  {/* Amount Summary */}
                  <div className="rounded-xl bg-secondary/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm font-medium flex items-center gap-1.5">
                        <IndianRupee size={14} /> Total Payment
                      </span>
                      <span className="text-lg font-bold">₹{cost.toLocaleString('en-IN')}</span>
                    </div>

                    {ps === 'partial' && (
                      <>
                        <div className="h-px bg-border" />
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 text-sm flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Amount Paid
                          </span>
                          <span className="text-green-600 font-semibold">₹{paid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-red-500 text-sm flex items-center gap-1.5">
                            <AlertCircle size={14} /> Amount Pending
                          </span>
                          <span className="text-red-500 font-semibold">₹{pending.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (paid / cost) * 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-right">{Math.round((paid / cost) * 100)}% paid</p>
                        </div>
                      </>
                    )}

                    {ps === 'pending' && (
                      <>
                        <div className="h-px bg-border" />
                        <div className="flex items-center justify-between">
                          <span className="text-red-500 text-sm flex items-center gap-1.5">
                            <AlertCircle size={14} /> Amount Pending
                          </span>
                          <span className="text-red-500 font-semibold">₹{cost.toLocaleString('en-IN')}</span>
                        </div>
                      </>
                    )}

                    {(ps === 'paid' || paymentSuccess) && (
                      <div className="flex items-center gap-2 text-green-600 text-sm pt-1">
                        <CheckCircle2 size={16} />
                        <span>Payment fully received. Thank you!</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Success Banner */}
                  {paymentSuccess && ps !== 'paid' && (
                    <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <ShieldCheck className="text-green-600 shrink-0" size={24} />
                      <div>
                        <p className="font-semibold text-green-700 text-sm">Payment Verified Successfully</p>
                        <p className="text-xs text-green-600/80">Your payment has been securely processed and verified.</p>
                      </div>
                    </div>
                  )}

                  {/* Pay Now Button */}
                  {ps !== 'paid' && !paymentSuccess && (
                    <Button
                      className="w-full h-12 text-base gap-2"
                      size="lg"
                      onClick={handlePayment}
                      disabled={paying}
                      id="razorpay-pay-button"
                    >
                      {paying ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <IndianRupee size={18} />
                          Pay Now — ₹{pending > 0 ? pending.toLocaleString('en-IN') : cost.toLocaleString('en-IN')}
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
