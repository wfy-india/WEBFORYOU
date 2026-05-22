"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
    Plus, 
    LogOut, 
    LayoutDashboard, 
    Clock, 
    CheckCircle2, 
    Calendar,
    PlusCircle,
    Trash2,
    Lock,
    Edit2,
    Circle,
    Bell,
    ClipboardList,
    Eye,
    FileText,
    Paperclip,
    X,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    XCircle,
    Mail,
    MessageSquare,
    IndianRupee,
    CreditCard,
    Shield,
    Camera
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
// is code by meraj 
type Project = {
  id: string;
  client_name: string;
  business_name: string;
  description: string;
  branding_colors: string;
  deadline: string;
  google_maps_link: string;
  passkey: string;
  status: 'new' | 'ongoing' | 'completed';
  investment_cost: number;
  amount_paid: number;
  created_at: string;
};

type Milestone = {
  id: string;
  project_id: string;
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
  project?: Project;
};

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

type PlanRequest = {
  id: string;
  name: string;
  business_name: string;
  mobile_number: string;
  plan_name: string;
  status: string;
  created_at: string;
};

type ChatbotTicket = {
  id: string;
  name: string;
  mobile: string;
  user_query: string;
  ai_response: string;
  status: string;
  created_at: string;
};

function getDevAuth(): string {
  return localStorage.getItem("dev_password") || "";
}

async function devFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'x-dev-auth': getDevAuth(),
    },
  });
}

function paymentStatus(project: Project): 'paid' | 'partial' | 'pending' {
  const cost = Number(project.investment_cost) || 0;
  const paid = Number(project.amount_paid) || 0;
  if (cost === 0) return 'pending';
  if (paid >= cost) return 'paid';
  if (paid > 0) return 'partial';
  return 'pending';
}

function PaymentBadge({ project }: { project: Project }) {
  const ps = paymentStatus(project);
  if (ps === 'paid') return <Badge className="bg-green-500/10 text-green-600 border border-green-500/30 font-normal">Paid</Badge>;
  if (ps === 'partial') return <Badge className="bg-orange-500/10 text-orange-600 border border-orange-500/30 font-normal">Partial</Badge>;
  return <Badge className="bg-red-500/10 text-red-600 border border-red-500/30 font-normal">Pending</Badge>;
}

function NewProjectDialog({ 
  open, 
  onOpenChange, 
  onProjectCreated 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: Project) => void;
}) {
  const [newProject, setNewProject] = useState({
    client_name: "",
    business_name: "",
    description: "",
    branding_colors: "",
    deadline: "",
    google_maps_link: "",
    passkey: "",
    status: 'new' as const,
    investment_cost: "",
    amount_paid: ""
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await devFetch('/api/developer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'create_project', 
        project: {
          ...newProject,
          investment_cost: newProject.investment_cost ? parseFloat(newProject.investment_cost) : 0,
          amount_paid: newProject.amount_paid ? parseFloat(newProject.amount_paid) : 0,
        }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to create project");
    } else {
      toast.success("Project created successfully");
      onProjectCreated(data.project);
      onOpenChange(false);
      setNewProject({
        client_name: "",
        business_name: "",
        description: "",
        branding_colors: "",
        deadline: "",
        google_maps_link: "",
        passkey: "",
        status: 'new',
        investment_cost: "",
        amount_paid: ""
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input 
              required 
              placeholder="John Doe"
              value={newProject.client_name}
              onChange={e => setNewProject({...newProject, client_name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input 
              required 
              placeholder="Acme Corp"
              value={newProject.business_name}
              onChange={e => setNewProject({...newProject, business_name: e.target.value})}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label>Project Description</Label>
            <Textarea 
              required 
              placeholder="Describe the project scope and requirements..."
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Branding Colors</Label>
            <Input 
              placeholder="e.g. #FF0000, #000000" 
              value={newProject.branding_colors}
              onChange={e => setNewProject({...newProject, branding_colors: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input 
              type="date" 
              required 
              value={newProject.deadline}
              onChange={e => setNewProject({...newProject, deadline: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Google Maps Link</Label>
            <Input 
              placeholder="URL to business location" 
              value={newProject.google_maps_link}
              onChange={e => setNewProject({...newProject, google_maps_link: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Client Passkey</Label>
            <Input 
              required 
              placeholder="Unique passkey for client login" 
              value={newProject.passkey}
              onChange={e => setNewProject({...newProject, passkey: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><IndianRupee size={13} /> Investment Cost (₹)</Label>
            <Input 
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 25000"
              value={newProject.investment_cost}
              onChange={e => setNewProject({...newProject, investment_cost: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><IndianRupee size={13} /> Amount Paid (₹)</Label>
            <Input 
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 10000"
              value={newProject.amount_paid}
              onChange={e => setNewProject({...newProject, amount_paid: e.target.value})}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 pt-4">
            <Button type="submit" className="w-full">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UpdatePaymentDialog({
  project,
  open,
  onOpenChange,
  onUpdated
}: {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (project: Project) => void;
}) {
  const [amountPaid, setAmountPaid] = useState(String(project.amount_paid || 0));
  const [investmentCost, setInvestmentCost] = useState(String(project.investment_cost || 0));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAmountPaid(String(project.amount_paid || 0));
    setInvestmentCost(String(project.investment_cost || 0));
  }, [project]);

  const handleSave = async () => {
    setSaving(true);
    const res = await devFetch('/api/developer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_payment',
        projectId: project.id,
        investment_cost: parseFloat(investmentCost) || 0,
        amount_paid: parseFloat(amountPaid) || 0,
      })
    });
    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to update payment");
    } else {
      toast.success("Payment updated");
      onUpdated({ ...project, investment_cost: parseFloat(investmentCost) || 0, amount_paid: parseFloat(amountPaid) || 0 });
      onOpenChange(false);
    }
  };

  const cost = parseFloat(investmentCost) || 0;
  const paid = parseFloat(amountPaid) || 0;
  const pending = Math.max(0, cost - paid);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> Update Payment — {project.business_name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Investment Cost (₹)</Label>
            <Input type="number" min="0" step="0.01" value={investmentCost} onChange={e => setInvestmentCost(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Amount Paid (₹)</Label>
            <Input type="number" min="0" step="0.01" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
          </div>
          {cost > 0 && (
            <div className="rounded-lg bg-secondary/50 p-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-medium">₹{cost.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="font-medium text-green-600">₹{Math.min(paid, cost).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pending</span><span className="font-medium text-red-600">₹{pending.toLocaleString('en-IN')}</span></div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddMilestoneDialog({ 
  projectId, 
  open, 
  onOpenChange, 
  onMilestoneAdded 
}: { 
  projectId: string;
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onMilestoneAdded: (milestone: Milestone) => void;
  currentMilestoneCount: number;
}) {
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    status: 'pending' as const
  });

  const handleAddMilestone = async () => {
    const res = await devFetch('/api/developer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_milestone',
        milestone: {
          ...newMilestone,
          project_id: projectId,
          order: 0
        }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to add milestone");
    } else {
      toast.success("Milestone added");
      onMilestoneAdded(data.milestone);
      onOpenChange(false);
      setNewMilestone({ title: "", description: "", status: 'pending' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Progress Milestone</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Milestone Title</Label>
            <Input 
              placeholder="e.g. Design Approved" 
              value={newMilestone.title}
              onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea 
              placeholder="Brief details about this step..." 
              value={newMilestone.description}
              onChange={e => setNewMilestone({...newMilestone, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={newMilestone.status} 
              onValueChange={(val: 'pending' | 'ongoing' | 'completed') => setNewMilestone({...newMilestone, status: val as any})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddMilestone} disabled={!newMilestone.title}>Add Milestone</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditMilestoneDialog({ 
  milestone, 
  open, 
  onOpenChange, 
  onMilestoneUpdated 
}: { 
  milestone: Milestone;
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onMilestoneUpdated: (milestone: Milestone) => void;
}) {
  const [editedMilestone, setEditedMilestone] = useState(milestone);

  useEffect(() => {
    setEditedMilestone(milestone);
  }, [milestone]);

  const handleUpdateMilestone = async () => {
    const res = await devFetch('/api/developer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_milestone',
        milestoneId: milestone.id,
        updates: {
          title: editedMilestone.title,
          description: editedMilestone.description,
          status: editedMilestone.status
        }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to update milestone");
    } else {
      toast.success("Milestone updated");
      onMilestoneUpdated(data.milestone);
      onOpenChange(false);
    }
  };

  const handleDeleteMilestone = async () => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    const res = await devFetch(`/api/developer?action=milestone&id=${milestone.id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      toast.error("Failed to delete milestone");
    } else {
      toast.success("Milestone deleted");
      onOpenChange(false);
      onMilestoneUpdated({ ...milestone, title: 'DELETED_SIGNAL' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Milestone Title</Label>
            <Input 
              placeholder="e.g. Design Approved" 
              value={editedMilestone.title}
              onChange={e => setEditedMilestone({...editedMilestone, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea 
              placeholder="Brief details about this step..." 
              value={editedMilestone.description || ""}
              onChange={e => setEditedMilestone({...editedMilestone, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={editedMilestone.status} 
              onValueChange={(val: 'pending' | 'ongoing' | 'completed') => setEditedMilestone({...editedMilestone, status: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="destructive" onClick={handleDeleteMilestone}>Delete</Button>
          <Button onClick={handleUpdateMilestone} disabled={!editedMilestone.title}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DeveloperDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Record<string, Milestone[]>>({});
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [hasFaceData, setHasFaceData] = useState(false);
  const [milestoneDialogProjectId, setMilestoneDialogProjectId] = useState<string | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(new Set());
  const [paymentDialogProject, setPaymentDialogProject] = useState<Project | null>(null);
  const router = useRouter();

  // Maintenance requests state
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [requestsView, setRequestsView] = useState(false);
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'failed'>('all');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [messagesView, setMessagesView] = useState(false);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [planRequests, setPlanRequests] = useState<PlanRequest[]>([]);
  const [chatbotTickets, setChatbotTickets] = useState<ChatbotTicket[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedPlanReq, setSelectedPlanReq] = useState<PlanRequest | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ChatbotTicket | null>(null);

  useEffect(() => {
    fetchProjects();
    setHasFaceData(!!localStorage.getItem("dev_face_data"));
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("dev_auth");
    if (auth !== "true") {
      router.push("/developer/login");
    } else {
      setIsAuth(true);
      fetchProjects();
      fetchAllRequests();
    }
  }, [router]);

  // Real-time subscription for maintenance requests
  useEffect(() => {
    if (!isAuth) return;

    const channel = supabase
      .channel('dev_requests_updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'maintenance_requests'
      }, () => {
        fetchAllRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuth]);

  async function fetchProjects() {
    setLoading(true);
    const res = await devFetch('/api/developer?action=projects');
    const data = await res.json();

    if (!res.ok) {
      toast.error("Failed to fetch projects");
    } else {
      setProjects(data.projects || []);
      data.projects?.forEach((project: Project) => fetchMilestones(project.id));
    }
    setLoading(false);
  }

  async function fetchMilestones(projectId: string) {
    const res = await devFetch(`/api/developer?action=milestones&project_id=${projectId}`);
    const data = await res.json();
    if (res.ok) {
      setMilestones(prev => ({ ...prev, [projectId]: data.milestones || [] }));
    }
  }

  async function fetchAllRequests() {
    const res = await devFetch('/api/developer?action=requests');
    const data = await res.json();
    if (res.ok) {
      setRequests(data.requests || []);
    }
  }

  async function fetchMessages() {
    setMessagesLoading(true);
    const [cRes, pRes, tRes] = await Promise.all([
      devFetch('/api/developer?action=contacts'),
      devFetch('/api/developer?action=plan_requests'),
      devFetch('/api/developer?action=chatbot_tickets'),
    ]);
    const [cData, pData, tData] = await Promise.all([cRes.json(), pRes.json(), tRes.json()]);
    if (cRes.ok) setContacts(cData.contacts || []);
    if (pRes.ok) setPlanRequests(pData.plan_requests || []);
    if (tRes.ok) setChatbotTickets(tData.chatbot_tickets || []);
    setMessagesLoading(false);
  }

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const totalMessages = contacts.length + planRequests.length;

  const updateRequestStatus = async (requestId: string, newStatus: MaintenanceRequest['status']) => {
    const res = await devFetch('/api/developer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_request_status', requestId, status: newStatus })
    });

    if (!res.ok) {
      toast.error("Failed to update request status");
    } else {
      toast.success(`Request marked as ${newStatus.replace('_', ' ')}`);
      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: newStatus } : r
      ));
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
      }
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

  const filteredRequests = requestFilter === 'all' 
    ? requests 
    : requests.filter(r => r.status === requestFilter);

  const handleUpdateStatus = async (projectId: string, status: Project['status']) => {
    const res = await devFetch('/api/developer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_project_status', projectId, status })
    });

    if (!res.ok) {
      toast.error("Failed to update status");
    } else {
      setProjects(projects.map(p => p.id === projectId ? { ...p, status } : p));
      toast.success(`Project moved to ${status}`);
    }
  };

  const handleMilestoneUpdated = (milestone: Milestone) => {
    if (milestone.title === 'DELETED_SIGNAL') {
      setMilestones(prev => ({
        ...prev,
        [milestone.project_id]: (prev[milestone.project_id] || []).filter(m => m.id !== milestone.id)
      }));
      return;
    }

    setMilestones(prev => ({
      ...prev,
      [milestone.project_id]: prev[milestone.project_id].map(m => 
        m.id === milestone.id ? milestone : m
      )
    }));
  };

  const toggleMilestone = async (milestone: Milestone) => {
    let newStatus: Milestone['status'];
    if (milestone.status === 'pending') newStatus = 'ongoing';
    else if (milestone.status === 'ongoing') newStatus = 'completed';
    else newStatus = 'pending';

    const res = await devFetch('/api/developer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_milestone',
        milestoneId: milestone.id,
        updates: { status: newStatus }
      })
    });

    if (!res.ok) {
      toast.error("Failed to update milestone");
    } else {
      setMilestones(prev => ({
        ...prev,
        [milestone.project_id]: prev[milestone.project_id].map(m => 
          m.id === milestone.id ? { ...m, status: newStatus } : m
        )
      }));
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await devFetch(`/api/developer?action=project&id=${id}`, { method: 'DELETE' });
    if (!res.ok) toast.error("Failed to delete project");
    else setProjects(projects.filter(p => p.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("dev_auth");
    localStorage.removeItem("dev_password");
    router.push("/developer/login");
  };

  const toggleCollapse = (projectId: string) => {
    setCollapsedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const toggleCollapseAll = (status: Project['status']) => {
    const statusProjects = projects.filter(p => p.status === status);
    const allCollapsed = statusProjects.every(p => collapsedProjects.has(p.id));
    setCollapsedProjects(prev => {
      const next = new Set(prev);
      statusProjects.forEach(p => {
        if (allCollapsed) next.delete(p.id);
        else next.add(p.id);
      });
      return next;
    });
  };

  if (!isAuth) return null;

  const ProjectCard = ({ project }: { project: Project }) => {
    const status = project.status;
    const isCollapsed = collapsedProjects.has(project.id);
    const cost = Number(project.investment_cost) || 0;
    const paid = Number(project.amount_paid) || 0;
    const pending = Math.max(0, cost - paid);

    return (
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl truncate">{project.business_name}</CardTitle>
              <CardDescription className="truncate">Client: {project.client_name}</CardDescription>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant={status === 'completed' ? 'default' : status === 'ongoing' ? 'secondary' : 'outline'}>
                {status}
              </Badge>
              <PaymentBadge project={project} />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleCollapse(project.id)}>
                {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {!isCollapsed && (
          <>
            <CardContent className="flex-1 space-y-4 px-4 sm:px-6">
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Passkey: <code className="bg-muted px-1 rounded">{project.passkey}</code></span>
              </div>

              {/* Payment Summary */}
              {cost > 0 && (
                <div className="rounded-lg bg-secondary/40 p-3 text-sm space-y-1 border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium flex items-center gap-1"><IndianRupee size={12} />Investment</span>
                    <span className="font-semibold">₹{cost.toLocaleString('en-IN')}</span>
                  </div>
                  {paid > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 text-xs">Paid</span>
                      <span className="text-green-600 font-medium">₹{Math.min(paid, cost).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {pending > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-red-500 text-xs">Pending</span>
                      <span className="text-red-500 font-medium">₹{pending.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Clock size={14} /> Milestones
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => setMilestoneDialogProjectId(project.id)}
                  >
                    <PlusCircle size={16} className="mr-1" /> Add
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {milestones[project.id]?.length ? (
                    milestones[project.id].map(m => (
                      <div key={m.id} className="flex items-center justify-between gap-2 text-sm group p-1.5 rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button 
                            onClick={() => toggleMilestone(m)}
                            className={`transition-colors flex-shrink-0 ${
                              m.status === 'completed' ? 'text-green-500' : 
                              m.status === 'ongoing' ? 'text-blue-500' : 
                              'text-muted-foreground hover:text-primary'
                            }`}
                          >
                            {m.status === 'completed' ? (
                              <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                            ) : m.status === 'ongoing' ? (
                              <Clock size={16} />
                            ) : (
                              <Circle size={16} />
                            )}
                          </button>
                          <span className={`${m.status === 'completed' ? 'line-through text-muted-foreground' : ''} line-clamp-1`}>
                            {m.title}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={() => setEditingMilestone(m)}
                        >
                          <Edit2 size={12} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No milestones yet</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 gap-2 px-4 sm:px-6 flex-wrap">
              {status === 'new' && (
                <Button size="sm" className="flex-1" onClick={() => handleUpdateStatus(project.id, 'ongoing')}>
                  Start Project
                </Button>
              )}
              {status === 'ongoing' && (
                <Button size="sm" className="flex-1" onClick={() => handleUpdateStatus(project.id, 'completed')}>
                  Mark Completed
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setPaymentDialogProject(project)}>
                <CreditCard size={14} /> Payment
              </Button>
              <Button size="sm" variant="ghost" onClick={() => deleteProject(project.id)}>
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    );
  };

  const ProjectList = ({ status }: { status: Project['status'] }) => {
    const statusProjects = projects.filter(p => p.status === status);
    const allCollapsed = statusProjects.length > 0 && statusProjects.every(p => collapsedProjects.has(p.id));
    return (
      <div className="mt-6">
        {statusProjects.length > 0 && (
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => toggleCollapseAll(status)}>
              {allCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              {allCollapsed ? 'Expand All' : 'Compress All'}
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statusProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No {status} projects
            </div>
          ) : (
            statusProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    );
  };

  const currentView = messagesView ? 'messages' : requestsView ? 'requests' : 'projects';

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {currentView !== 'projects' ? (
              <Button variant="ghost" size="icon" onClick={() => { setRequestsView(false); setMessagesView(false); }} className="flex-shrink-0">
                <ArrowLeft size={20} />
              </Button>
            ) : (
              <LayoutDashboard className="text-primary flex-shrink-0" />
            )}
            <h1 className="font-bold text-lg sm:text-xl truncate">
              {currentView === 'messages' ? 'Website Messages' : currentView === 'requests' ? 'Service Requests' : 'Developer Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {currentView === 'projects' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="relative"
                  onClick={() => { setMessagesView(true); fetchMessages(); }}
                >
                  <Mail size={18} className="sm:mr-2" />
                  <span className="hidden sm:inline">Messages</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="relative"
                  onClick={() => setRequestsView(true)}
                >
                  <Bell size={18} className="sm:mr-2" />
                  <span className="hidden sm:inline">Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Button>
                <Button size="sm" onClick={() => setIsNewProjectDialogOpen(true)}>
                  <Plus size={18} className="sm:mr-2" /> <span className="hidden sm:inline">New Project</span>
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={() => setSecurityDialogOpen(true)} className="flex-shrink-0" title="Security Settings">
              <Shield size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="flex-shrink-0" title="Logout">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── MESSAGES VIEW ── */}
        {messagesView && (
          <div className="space-y-4">
            <Tabs defaultValue="contacts">
              <TabsList className="flex flex-wrap h-auto gap-2 p-1">
                <TabsTrigger value="contacts" className="gap-2">
                  <Mail size={14} /> Contact Forms {contacts.length > 0 && <Badge variant="secondary" className="ml-1">{contacts.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="plan" className="gap-2">
                  <MessageSquare size={14} /> Plan Requests {planRequests.length > 0 && <Badge variant="secondary" className="ml-1">{planRequests.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="tickets" className="gap-2">
                  <Bell size={14} /> Chatbot Tickets {chatbotTickets.filter(t => t.status === 'new').length > 0 && <Badge className="ml-1 bg-red-500 text-white">{chatbotTickets.filter(t => t.status === 'new').length}</Badge>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="mt-4">
                {messagesLoading ? (
                  <p className="text-center py-10 text-muted-foreground">Loading...</p>
                ) : contacts.length === 0 ? (
                  <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground"><Mail size={40} className="mx-auto mb-3 opacity-30" /><p>No contact submissions yet.</p></CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {contacts.map(c => (
                      <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedContact(c)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium">{c.name}</span>
                                <span className="text-xs text-muted-foreground">WA: {c.email}</span>
                                <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{c.message}</p>
                            </div>
                            <Eye size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="plan" className="mt-4">
                {messagesLoading ? (
                  <p className="text-center py-10 text-muted-foreground">Loading...</p>
                ) : planRequests.length === 0 ? (
                  <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground"><MessageSquare size={40} className="mx-auto mb-3 opacity-30" /><p>No plan requests yet.</p></CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {planRequests.map(p => (
                      <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPlanReq(p)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium">{p.name}</span>
                                <Badge variant="outline" className="text-xs">{p.plan_name}</Badge>
                                <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{p.business_name} · {p.mobile_number}</p>
                            </div>
                            <Eye size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tickets" className="mt-4">
                {messagesLoading ? (
                  <p className="text-center py-10 text-muted-foreground">Loading...</p>
                ) : chatbotTickets.length === 0 ? (
                  <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground"><Bell size={40} className="mx-auto mb-3 opacity-30" /><p>No chatbot tickets yet.</p></CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {chatbotTickets.map(t => (
                      <Card key={t.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary" onClick={() => setSelectedTicket(t)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium">{t.name}</span>
                                <Badge variant={t.status === 'resolved' ? 'default' : t.status === 'new' ? 'destructive' : 'outline'} className="text-xs">{t.status}</Badge>
                                <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2"><strong className="text-foreground">Query:</strong> {t.user_query}</p>
                            </div>
                            <Eye size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* ── REQUESTS VIEW ── */}
        {requestsView && !messagesView && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={requestFilter} onValueChange={(val: typeof requestFilter) => setRequestFilter(val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No requests found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                            {getStatusBadge(request.status)}
                            <Badge variant="outline" className="font-normal truncate max-w-[150px]">
                              {request.project?.business_name || 'Unknown Project'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(request.created_at).toLocaleDateString()}
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
                          onClick={() => { setSelectedRequest(request); setDetailsOpen(true); }}
                          className="gap-1 flex-shrink-0"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROJECTS VIEW ── */}
        {!requestsView && !messagesView && (
          loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading projects...</p>
            </div>
          ) : (
            <Tabs defaultValue="ongoing" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="new">
                <ProjectList status="new" />
              </TabsContent>
              <TabsContent value="ongoing">
                <ProjectList status="ongoing" />
              </TabsContent>
              <TabsContent value="completed">
                <ProjectList status="completed" />
              </TabsContent>
            </Tabs>
          )
        )}
      </main>

      {/* ── Request Details Dialog ── */}
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
                <span className="text-sm text-muted-foreground">Client / Project</span>
                <p className="font-medium">
                  {selectedRequest.project?.client_name} - {selectedRequest.project?.business_name}
                </p>
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
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer"
                          className="block p-2 bg-secondary/50 rounded-lg border hover:bg-secondary transition-colors">
                          {isPdf ? (
                            <div className="flex items-center gap-2">
                              <FileText size={24} className="text-primary" />
                              <span className="text-xs truncate">PDF Document</span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={url} alt={`Attachment ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <span className="text-sm font-medium">Update Status</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedRequest.status !== 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => updateRequestStatus(selectedRequest.id, 'pending')}>Mark Pending</Button>
                  )}
                  {selectedRequest.status !== 'in_progress' && (
                    <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10" onClick={() => updateRequestStatus(selectedRequest.id, 'in_progress')}>Mark In Progress</Button>
                  )}
                  {selectedRequest.status !== 'resolved' && (
                    <Button size="sm" variant="outline" className="border-green-500/30 text-green-600 hover:bg-green-500/10" onClick={() => updateRequestStatus(selectedRequest.id, 'resolved')}>Mark Completed</Button>
                  )}
                  {selectedRequest.status !== 'failed' && (
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-600 hover:bg-red-500/10" onClick={() => updateRequestStatus(selectedRequest.id, 'failed')}>
                      <XCircle size={14} className="mr-1" /> Mark Failed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Contact Submission Detail Dialog ── */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Mail size={18} className="text-primary" /> Contact Submission</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span className="font-medium">{selectedContact.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">WhatsApp Number</span><span className="font-medium">{selectedContact.email}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date(selectedContact.created_at).toLocaleString()}</span></div>
              <div>
                <span className="text-sm text-muted-foreground">Message</span>
                <p className="mt-1 p-3 bg-secondary/50 rounded-lg text-sm whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setSelectedContact(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Plan Request Detail Dialog ── */}
      <Dialog open={!!selectedPlanReq} onOpenChange={() => setSelectedPlanReq(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MessageSquare size={18} className="text-primary" /> Plan Request</DialogTitle>
          </DialogHeader>
          {selectedPlanReq && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span className="font-medium">{selectedPlanReq.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Business</span><span className="font-medium">{selectedPlanReq.business_name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Mobile</span><span className="font-medium">{selectedPlanReq.mobile_number}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><Badge variant="outline">{selectedPlanReq.plan_name}</Badge></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date(selectedPlanReq.created_at).toLocaleString()}</span></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setSelectedPlanReq(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Chatbot Ticket Detail Dialog ── */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Bell size={18} className="text-primary" /> Chatbot Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span className="font-medium">{selectedTicket.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Mobile</span><span className="font-medium">{selectedTicket.mobile}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge>{selectedTicket.status}</Badge></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date(selectedTicket.created_at).toLocaleString()}</span></div>
              <div className="pt-2">
                <span className="text-sm font-semibold">User Query</span>
                <p className="mt-1 p-3 bg-secondary/50 rounded-lg text-sm whitespace-pre-wrap">{selectedTicket.user_query}</p>
              </div>
              <div className="pt-2">
                <span className="text-sm font-semibold">AI Response</span>
                <p className="mt-1 p-3 bg-secondary/50 rounded-lg text-sm whitespace-pre-wrap">{selectedTicket.ai_response}</p>
              </div>
              <div className="flex gap-2 pt-4 flex-wrap">
                <Button size="sm" variant="outline" onClick={async () => {
                  await devFetch('/api/developer', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({action: 'update_chatbot_ticket', ticketId: selectedTicket.id, status: 'in_progress'}) });
                  setSelectedTicket({...selectedTicket, status: 'in_progress'});
                  setChatbotTickets(prev => prev.map(t => t.id === selectedTicket.id ? {...t, status: 'in_progress'} : t));
                }}>Mark In Progress</Button>
                <Button size="sm" onClick={async () => {
                  await devFetch('/api/developer', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({action: 'update_chatbot_ticket', ticketId: selectedTicket.id, status: 'resolved'}) });
                  setSelectedTicket({...selectedTicket, status: 'resolved'});
                  setChatbotTickets(prev => prev.map(t => t.id === selectedTicket.id ? {...t, status: 'resolved'} : t));
                }}>Mark Resolved</Button>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setSelectedTicket(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Payment Update Dialog ── */}
      {paymentDialogProject && (
        <UpdatePaymentDialog
          project={paymentDialogProject}
          open={!!paymentDialogProject}
          onOpenChange={(open) => !open && setPaymentDialogProject(null)}
          onUpdated={(updated) => {
            setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
            setPaymentDialogProject(null);
          }}
        />
      )}

      <NewProjectDialog 
        open={isNewProjectDialogOpen} 
        onOpenChange={setIsNewProjectDialogOpen}
        onProjectCreated={(project) => setProjects([project, ...projects])}
      />

      {milestoneDialogProjectId && (
        <AddMilestoneDialog
          projectId={milestoneDialogProjectId}
          open={!!milestoneDialogProjectId}
          onOpenChange={(open) => !open && setMilestoneDialogProjectId(null)}
          onMilestoneAdded={(milestone) => {
            setMilestones(prev => ({
              ...prev,
              [milestone.project_id]: [...(prev[milestone.project_id] || []), milestone]
            }));
          }}
          currentMilestoneCount={milestones[milestoneDialogProjectId]?.length || 0}
        />
      )}

      {editingMilestone && (
        <EditMilestoneDialog
          milestone={editingMilestone}
          open={!!editingMilestone}
          onOpenChange={(open) => !open && setEditingMilestone(null)}
          onMilestoneUpdated={handleMilestoneUpdated}
        />
      )}
      {/* Security Dialog */}
      <Dialog open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" /> Security Settings
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">Face ID Login</p>
                  <p className="text-sm text-muted-foreground">
                    {hasFaceData ? "Configured and active" : "Not configured on this device"}
                  </p>
                </div>
              </div>
              {hasFaceData ? (
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                To set up or reset your Face ID and Passkey, you must re-register this device. This will log you out and require the Developer PIN.
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  localStorage.removeItem("dev_face_data");
                  localStorage.removeItem("dev_passkey");
                  localStorage.removeItem("dev_device");
                  localStorage.removeItem("dev_auth");
                  router.push("/developer/login");
                }}
              >
                Re-register Device
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
