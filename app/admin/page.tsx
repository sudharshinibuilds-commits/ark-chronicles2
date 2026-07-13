"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AudioPlayer from "../components/AudioPlayer";
import LiveTicker from "../components/LiveTicker";
import { 
  Check, 
  X, 
  Search, 
  Plus, 
  FileText, 
  Users, 
  BookOpen, 
  Mail, 
  ShieldAlert, 
  GraduationCap, 
  Briefcase, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  BookMarked
} from "lucide-react";

type TabId = 
  | "dashboard"
  | "articles"
  | "submissions"
  | "founders"
  | "investors"
  | "users"
  | "magazines"
  | "research"
  | "collabs"
  | "newsletter";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [token, setToken] = useState<string>("");

  // Stats State
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    pending: 0,
    founders: 0,
    colleges: 0,
    subscribers: 0,
  });

  // Global Lists States
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [foundersList, setFoundersList] = useState<any[]>([]);
  const [investorRequestsList, setInvestorRequestsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [magazinesList, setMagazinesList] = useState<any[]>([]);
  const [researchList, setResearchList] = useState<any[]>([]);
  const [collabsList, setCollabsList] = useState<any[]>([]);
  const [subscribersList, setSubscribersList] = useState<any[]>([]);

  // Search and Filters
  const [userSearch, setUserSearch] = useState("");

  // Rejection Notes
  const [rejectionNotes, setRejectionNotes] = useState<Record<string, string>>({});

  // Forms inputs
  const [articleForm, setArticleForm] = useState({
    title: "", excerpt: "", content: "", author_name: "", category: "Chronicles", image_url: "", featured: false
  });
  const [magazineForm, setMagazineForm] = useState({
    title: "", issue_no: "", description: "", cover_url: "", pdf_url: "", published: true
  });
  const [researchForm, setResearchForm] = useState({
    title: "", authors: "", abstract: "", domain: "", college: "", citation_text: "", pdf_url: "", published: true
  });

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Check admin authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        setToken(session.access_token);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || !profile || profile.role !== "admin") {
          alert("Unauthorized access. Admin privileges required.");
          router.push("/login");
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // Load active tab data
  useEffect(() => {
    if (!isAdmin || !token) return;

    const headers = { Authorization: `Bearer ${token}` };

    async function fetchTabData() {
      try {
        if (activeTab === "dashboard") {
          const res = await fetch("/api/admin/stats", { headers });
          if (res.ok) setStats(await res.json());
        } else if (activeTab === "articles") {
          const res = await fetch("/api/articles?include_unpublished=true", { headers });
          if (res.ok) setArticlesList(await res.json());
        } else if (activeTab === "submissions") {
          const res = await fetch("/api/submissions?status=pending", { headers });
          if (res.ok) setSubmissionsList(await res.json());
        } else if (activeTab === "founders") {
          // Fetch pending founder applications
          const { data, error } = await supabase
            .from("founders")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: false });
          if (!error && data) setFoundersList(data);
        } else if (activeTab === "investors") {
          const res = await fetch("/api/investor-requests", { headers });
          if (res.ok) setInvestorRequestsList(await res.json());
        } else if (activeTab === "users") {
          const res = await fetch(`/api/admin/users${userSearch ? `?q=${encodeURIComponent(userSearch)}` : ""}`, { headers });
          if (res.ok) setUsersList(await res.json());
        } else if (activeTab === "magazines") {
          const res = await fetch("/api/magazines?include_unpublished=true", { headers });
          if (res.ok) setMagazinesList(await res.json());
        } else if (activeTab === "research") {
          const res = await fetch("/api/research?include_unpublished=true", { headers });
          if (res.ok) setResearchList(await res.json());
        } else if (activeTab === "collabs") {
          const res = await fetch("/api/college-applications", { headers });
          if (res.ok) setCollabsList(await res.json());
        } else if (activeTab === "newsletter") {
          const res = await fetch("/api/admin/subscribers", { headers });
          if (res.ok) setSubscribersList(await res.json());
        }
      } catch (err) {
        console.error("Failed to load active tab data", err);
      }
    }

    fetchTabData();
  }, [activeTab, isAdmin, token, userSearch]);

  // Actions handlers
  const handleSubmissionReview = async (id: string, status: "approved" | "rejected") => {
    try {
      const note = rejectionNotes[id] || "";
      const res = await fetch(`/api/submissions/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, note }),
      });

      if (res.ok) {
        alert(`Submission ${status} successfully!`);
        setSubmissionsList(prev => prev.filter(item => item.id !== id));
        // Update stats
        setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1) }));
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to submit review"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }
  };

  const handleFounderReview = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/founders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`Founder application ${status}!`);
        setFoundersList(prev => prev.filter(item => item.id !== id));
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvestorRequestUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/investor-requests`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        alert(`Request marked as ${status === "approved" ? "Connected" : "Rejected"}!`);
        setInvestorRequestsList(prev =>
          prev.map(item => (item.id === id ? { ...item, status } : item))
        );
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserRoleUpdate = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role }),
      });

      if (res.ok) {
        alert("User role updated successfully!");
        setUsersList(prev =>
          prev.map(u => (u.id === userId ? { ...u, role } : u))
        );
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCollegeReview = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/colleges/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`College application ${status}!`);
        setCollabsList(prev =>
          prev.map(c => (c.id === id ? { ...c, status, verified: status === "approved" } : c))
        );
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleArticleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !currentlyPublished }),
      });

      if (res.ok) {
        alert(`Article ${!currentlyPublished ? "Published" : "Unpublished"}!`);
        setArticlesList(prev =>
          prev.map(a => (a.id === id ? { ...a, published: !currentlyPublished } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMagazineTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/magazines/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !currentlyPublished }),
      });

      if (res.ok) {
        alert(`Magazine ${!currentlyPublished ? "Published" : "Unpublished"}!`);
        setMagazinesList(prev =>
          prev.map(m => (m.id === id ? { ...m, published: !currentlyPublished } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResearchTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/research/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !currentlyPublished }),
      });

      if (res.ok) {
        alert(`Research paper ${!currentlyPublished ? "Published" : "Unpublished"}!`);
        setResearchList(prev =>
          prev.map(r => (r.id === id ? { ...r, published: !currentlyPublished } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Forms
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(articleForm),
      });

      if (res.ok) {
        alert("Article published successfully!");
        setArticleForm({
          title: "", excerpt: "", content: "", author_name: "", category: "Chronicles", image_url: "", featured: false
        });
        // Reload articles
        const updatedRes = await fetch("/api/articles?include_unpublished=true", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedRes.ok) setArticlesList(await updatedRes.json());
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to publish article"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMagazineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/magazines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(magazineForm),
      });

      if (res.ok) {
        alert("Magazine issues configured successfully!");
        setMagazineForm({
          title: "", issue_no: "", description: "", cover_url: "", pdf_url: "", published: true
        });
        const updatedRes = await fetch("/api/magazines?include_unpublished=true", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedRes.ok) setMagazinesList(await updatedRes.json());
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to add issue"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(researchForm),
      });

      if (res.ok) {
        alert("Research paper published successfully!");
        setResearchForm({
          title: "", authors: "", abstract: "", domain: "", college: "", citation_text: "", pdf_url: "", published: true
        });
        const updatedRes = await fetch("/api/research?include_unpublished=true", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedRes.ok) setResearchList(await updatedRes.json());
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (subscribersList.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Email", "Status", "Joined Date"].join(",") + "\n"
      + subscribersList.map(s => `"${s.email}","${s.active ? "Active" : "Inactive"}","${s.created_at}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ark_subscribers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
          <p className="font-display font-medium text-ark-navy animate-pulse">Initializing Security Consoles...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Header
        currentDate={currentDate}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Chronicles", href: "/chronicles" },
          { label: "Founders", href: "/founders" },
          { label: "Magazines", href: "/magazines" },
          { label: "Research", href: "/research" },
          { label: "Investors", href: "/investors" },
          { label: "Opportunities", href: "/opportunities" },
          { label: "College Collabs", href: "/college-collabs" },
          { label: "Submit Story", href: "/submit-story" },
          { label: "About Us", href: "/about" },
        ]}
        cityLinks={[
          { label: "Bengaluru", href: "#" },
          { label: "Mumbai", href: "#" },
          { label: "Delhi", href: "#" },
          { label: "Hyderabad", href: "#" },
        ]}
      />
      <LiveTicker
        items={[
          "SYSTEM MONITOR: Deep-tech telemetry active. Moderation systems loaded.",
          "ARK CHRONICLES: Real-time Supabase syncing enabled across all database clusters.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-black/5 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-bold text-red-600 uppercase tracking-wider mb-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              Administrative Root
            </span>
            <h1 className="font-display text-4xl font-bold text-ark-black tracking-tight sm:text-5xl">Ecosystem Command Deck</h1>
            <p className="mt-1.5 text-sm text-zinc-500">Moderation, state management, and real-time network variables.</p>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-xs bg-zinc-150 border border-black/8 px-4 py-2.5 rounded-xl text-zinc-600">
            Node Status: <span className="text-emerald-600 font-bold">Online</span> • Security: <span className="text-ark-gold font-bold">Level-5</span>
          </div>
        </div>

        {/* Global stats deck */}
        <div className="mt-8 grid grid-cols-2 gap-4 rounded-3xl border border-ark-navy/20 bg-ark-navy/[0.03] p-6 sm:grid-cols-3 lg:grid-cols-6 shadow-sm">
          {[
            { value: stats.users, label: "Total Users", icon: Users },
            { value: stats.articles, label: "Articles", icon: FileText },
            { value: stats.pending, label: "Pending Stories", icon: ShieldAlert, highlight: stats.pending > 0 },
            { value: stats.founders, label: "Founders Registered", icon: Award },
            { value: stats.colleges, label: "Pending Collabs", icon: GraduationCap },
            { value: stats.subscribers, label: "Subscribers", icon: Mail },
          ].map((stat, i) => (
            <div key={i} className="text-center p-2 rounded-2xl hover:bg-white/40 transition-colors">
              <div className="mx-auto h-8 w-8 rounded-full bg-white flex items-center justify-center border border-black/5 mb-2 shadow-sm">
                <stat.icon className={`h-4 w-4 ${stat.highlight ? "text-red-500 animate-bounce" : "text-ark-navy"}`} />
              </div>
              <div className="font-display text-2xl font-black text-ark-navy">{stat.value}</div>
              <div className="mt-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Console Navigation Tabs */}
        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-3 flex overflow-x-auto lg:flex-col gap-1.5 pb-4 lg:pb-0 scrollbar-none border-b lg:border-b-0 border-black/10">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "articles", label: "Articles & News", icon: FileText },
              { id: "submissions", label: "Moderation Queue", icon: ShieldAlert, badge: stats.pending },
              { id: "founders", label: "Founder Submissions", icon: Award },
              { id: "investors", label: "Investor Network", icon: Briefcase },
              { id: "users", label: "Roles & Profiles", icon: Users },
              { id: "magazines", label: "Magazines Shelf", icon: BookOpen },
              { id: "research", label: "Research Papers", icon: BookMarked },
              { id: "collabs", label: "College Partners", icon: GraduationCap },
              { id: "newsletter", label: "Newsletter Hub", icon: Mail },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap lg:whitespace-normal ${
                  activeTab === tab.id
                    ? "bg-[#1B2A6B] text-white shadow-lg shadow-[#1B2A6B]/15"
                    : "border border-black/5 bg-white text-zinc-650 hover:bg-zinc-50"
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 ? (
                  <span className="rounded-full bg-red-500 text-white font-mono text-[10px] px-2 py-0.5 animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Console Screen Card */}
          <div className="mt-6 lg:mt-0 lg:col-span-9 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="p-8 space-y-6">
                <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Real-time Telemetry Indicators</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-5 bg-[#1B2A6B]/5 rounded-2xl border border-[#1B2A6B]/10">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Database Latency</h4>
                    <div className="font-display text-3xl font-black text-ark-navy mt-1">~12ms</div>
                    <p className="text-[11px] text-zinc-500 mt-2">Connecting client-side requests directly through SSL endpoints.</p>
                  </div>
                  <div className="p-5 bg-ark-gold/5 rounded-2xl border border-ark-gold/20">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Verified Student Partners</h4>
                    <div className="font-display text-3xl font-black text-ark-gold mt-1">45+ Universities</div>
                    <p className="text-[11px] text-zinc-500 mt-2">Active colleges sending articles, research papers, and startup logs.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-zinc-50 p-6">
                  <h4 className="font-display text-lg font-bold text-ark-black mb-2">Ecosystem Operations Note</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    This admin console interfaces with the backend tables in Supabase bypassing row-level security limits using cryptographic tokens. Any actions taken below (approving stories, assigning roles, updating magazines or research papers) immediately broadcast to index tables live globally.
                  </p>
                </div>
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === "articles" && (
              <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
                  <h3 className="font-display text-2xl font-bold text-ark-black">Ecosystem Editorial Indexes</h3>
                  <span className="text-xs font-bold text-zinc-400 uppercase">{articlesList.length} total articles</span>
                </div>

                {/* Form to publish new article */}
                <form onSubmit={handleArticleSubmit} className="bg-zinc-50 rounded-2xl border border-black/5 p-6 space-y-4">
                  <h4 className="font-display text-md font-bold text-ark-black flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#1B2A6B]" /> Write &amp; Publish New Editorial Article
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={articleForm.title}
                        onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                        placeholder="Article Headline"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Excerpt</label>
                      <input
                        type="text"
                        value={articleForm.excerpt}
                        onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                        placeholder="Brief summary of article"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Content</label>
                    <textarea
                      required
                      rows={4}
                      value={articleForm.content}
                      onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                      placeholder="Write markdown or raw text editorial contents here..."
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B] font-mono"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Author Name</label>
                      <input
                        type="text"
                        required
                        value={articleForm.author_name}
                        onChange={e => setArticleForm({ ...articleForm, author_name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={articleForm.category}
                        onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      >
                        <option>Chronicles</option>
                        <option>Founders</option>
                        <option>Research</option>
                        <option>Opportunities</option>
                        <option>Campus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Image URL</label>
                      <input
                        type="url"
                        value={articleForm.image_url}
                        onChange={e => setArticleForm({ ...articleForm, image_url: e.target.value })}
                        placeholder="https://picsum.photos/..."
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={articleForm.featured}
                        onChange={e => setArticleForm({ ...articleForm, featured: e.target.checked })}
                        className="h-4 w-4 rounded border-black/15 text-[#1B2A6B] focus:ring-[#1B2A6B]/20"
                      />
                      Feature on Home Banner
                    </label>

                    <button
                      type="submit"
                      className="ml-auto rounded-full bg-[#1B2A6B] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      Publish Article Now
                    </button>
                  </div>
                </form>

                {/* List of articles */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">All Editorial Indexes</h4>
                  <div className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white">
                    {articlesList.map((art) => (
                      <div key={art.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#1B2A6B] bg-[#1B2A6B]/10 px-2 py-0.5 rounded-full uppercase">
                              {art.category}
                            </span>
                            {art.featured && (
                              <span className="text-[10px] font-bold text-ark-gold bg-ark-gold/10 px-2 py-0.5 rounded-full uppercase">
                                Featured
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${art.published ? "text-emerald-700 bg-emerald-50" : "text-zinc-500 bg-zinc-100"}`}>
                              {art.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <h5 className="font-display text-sm font-bold text-ark-black">{art.title}</h5>
                          <p className="text-xs text-zinc-550">By {art.author_name} • Views: {art.read_count || 0}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleArticleTogglePublish(art.id, art.published)}
                            className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-all ${
                              art.published
                                ? "bg-zinc-150 text-zinc-600 hover:bg-zinc-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {art.published ? "Unpublish" : "Publish"}
                          </button>
                        </div>
                      </div>
                    ))}
                    {articlesList.length === 0 && (
                      <p className="p-8 text-center text-xs text-zinc-400">No articles registered in index files yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === "submissions" && (
              <div className="p-8 space-y-6">
                <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Moderation Queue (Stories)</h3>
                <div className="divide-y divide-black/5">
                  {submissionsList.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <span className="inline-flex rounded-full bg-[#1B2A6B]/10 border border-[#1B2A6B]/20 px-3 py-0.5 text-[10px] font-bold text-[#1B2A6B] uppercase tracking-wider">
                            {item.category} Submission
                          </span>
                          <h4 className="font-display text-lg font-bold text-ark-black mt-2">{item.title}</h4>
                          <p className="text-xs text-zinc-500 mt-1">
                            By <strong>{item.author_name}</strong> • Email: {item.email} • College: {item.college || "N/A"}
                          </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSubmissionReview(item.id, "approved")}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105"
                          >
                            Approve &amp; Publish
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-650 leading-relaxed font-mono bg-zinc-50 p-4 rounded-xl border border-black/5 max-h-48 overflow-y-auto">
                        {item.content}
                      </p>

                      <div className="flex items-center gap-2 max-w-md pt-1">
                        <input
                          type="text"
                          placeholder="Rejection explanation reason..."
                          value={rejectionNotes[item.id] || ""}
                          onChange={e => setRejectionNotes({ ...rejectionNotes, [item.id]: e.target.value })}
                          className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSubmissionReview(item.id, "rejected")}
                          className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 whitespace-nowrap"
                        >
                          Reject Story
                        </button>
                      </div>
                    </div>
                  ))}

                  {submissionsList.length === 0 && (
                    <div className="py-12 text-center text-zinc-500">
                      <Check className="mx-auto h-12 w-12 text-emerald-500 bg-emerald-50 p-2.5 rounded-full mb-4 animate-bounce" />
                      <h4 className="font-display text-lg font-bold text-ark-black">Submission Queue Clear</h4>
                      <p className="text-xs text-zinc-400 mt-1">No pending student story passes await review.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Founders Tab */}
            {activeTab === "founders" && (
              <div className="p-8 space-y-6">
                <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Founder Verification Queue</h3>
                <div className="divide-y divide-black/5">
                  {foundersList.map((founder) => (
                    <div key={founder.id} className="py-6 first:pt-0 last:pb-0 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h4 className="font-display text-lg font-bold text-ark-black">{founder.name}</h4>
                          <p className="text-xs text-[#1B2A6B] font-bold">Company: {founder.company} • Headline: {founder.headline || "N/A"}</p>
                          <p className="text-xs text-zinc-500 mt-1">Email: {founder.email} | LinkedIn: {founder.linkedin_url || "N/A"}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleFounderReview(founder.id, "approved")}
                            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                          >
                            Approve Founder
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFounderReview(founder.id, "rejected")}
                            className="rounded-full bg-red-650 px-4 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      <div className="p-3.5 bg-zinc-50 rounded-xl border border-black/5 text-xs text-zinc-600 font-mono">
                        "{founder.bio}"
                      </div>
                    </div>
                  ))}

                  {foundersList.length === 0 && (
                    <div className="py-12 text-center text-zinc-450">
                      <Award className="mx-auto h-12 w-12 text-ark-gold bg-ark-gold/10 p-2.5 rounded-full mb-4" />
                      <h4 className="font-display text-lg font-bold text-ark-black">No Pending Founder Applications</h4>
                      <p className="text-xs text-zinc-400 mt-1">All startup submissions are verified.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Investors Tab */}
            {activeTab === "investors" && (
              <div className="p-8 space-y-6">
                <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Investor Connection System</h3>
                <div className="divide-y divide-black/5">
                  {investorRequestsList.map((req) => {
                    let startupData: any = {};
                    try {
                      startupData = JSON.parse(req.message);
                    } catch (e) {
                      startupData = { pitch: req.message };
                    }

                    return (
                      <div key={req.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#1B2A6B] bg-[#1B2A6B]/10 px-2.5 py-0.5 rounded-full uppercase">
                                Connection Request
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                req.status === "approved" ? "text-emerald-700 bg-emerald-50" :
                                req.status === "rejected" ? "text-red-700 bg-red-50" : "text-yellow-700 bg-yellow-50"
                              }`}>
                                {req.status === "approved" ? "Connected" : req.status === "rejected" ? "Rejected" : "Pending"}
                              </span>
                            </div>
                            <h4 className="font-display text-lg font-bold text-ark-black mt-2">
                              Request to connect with: <strong>{req.investor_name}</strong>
                            </h4>
                            <p className="text-xs text-zinc-550 mt-1">
                              Investor Email: {req.email} • Company/Bio: {req.company || "N/A"}
                            </p>
                          </div>

                          {req.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleInvestorRequestUpdate(req.id, "approved")}
                                className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                              >
                                Mark as Connected
                              </button>
                              <button
                                type="button"
                                onClick={() => handleInvestorRequestUpdate(req.id, "rejected")}
                                className="rounded-full bg-red-650 px-4 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="bg-zinc-50 border border-black/5 rounded-2xl p-4 text-xs space-y-2 font-mono">
                          <div><strong>Startup Name:</strong> {startupData.startup_name || "N/A"}</div>
                          <div><strong>Stage:</strong> {startupData.stage || "N/A"}</div>
                          <div><strong>Ask Amount:</strong> {startupData.ask || "N/A"}</div>
                          <div><strong>Founder Pitch:</strong> "{startupData.pitch || req.message}"</div>
                        </div>
                      </div>
                    );
                  })}

                  {investorRequestsList.length === 0 && (
                    <div className="py-12 text-center text-zinc-450">
                      <Briefcase className="mx-auto h-12 w-12 text-[#1B2A6B] bg-[#1B2A6B]/10 p-2.5 rounded-full mb-4" />
                      <h4 className="font-display text-lg font-bold text-ark-black">No Connection Requests yet</h4>
                      <p className="text-xs text-zinc-400 mt-1 font-sans">Active student pitch applications will log here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
                  <h3 className="font-display text-2xl font-bold text-ark-black">Ecosystem Roles Directory</h3>
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search builders by name..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full rounded-full border border-black/10 bg-white pl-9 pr-4 py-1.5 text-xs outline-none focus:border-[#1B2A6B]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/15 text-zinc-500 uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">College</th>
                        <th className="py-3 px-4">Role Role</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-zinc-50/50">
                          <td className="py-3.5 px-4 font-bold text-ark-black">{user.name || "Unnamed user"}</td>
                          <td className="py-3.5 px-4 font-mono text-zinc-500">{user.email}</td>
                          <td className="py-3.5 px-4 text-zinc-650">{user.college || "N/A"}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-full uppercase ${
                              user.role === "admin" ? "text-red-700 bg-red-50" :
                              user.role === "founder" ? "text-ark-gold bg-ark-gold/10" :
                              user.role === "investor" ? "text-[#1B2A6B] bg-[#1B2A6B]/10" : "text-zinc-600 bg-zinc-150"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <select
                                defaultValue={user.role}
                                onChange={e => (user._pendingRole = e.target.value)}
                                className="rounded border border-black/10 bg-white px-2 py-1 text-[11px] outline-none"
                              >
                                <option value="member">Member</option>
                                <option value="founder">Founder</option>
                                <option value="investor">Investor</option>
                                <option value="journalist">Journalist</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleUserRoleUpdate(user.id, user._pendingRole || user.role)}
                                className="rounded bg-[#1B2A6B] text-white px-2.5 py-1 text-[10px] font-bold hover:scale-105 transition-transform"
                              >
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {usersList.length === 0 && (
                    <p className="py-8 text-center text-xs text-zinc-400">No student users found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Magazines Tab */}
            {activeTab === "magazines" && (
              <div className="p-8 space-y-8">
                <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Magazines Editorial Shelf</h3>

                {/* Form */}
                <form onSubmit={handleMagazineSubmit} className="bg-zinc-50 rounded-2xl border border-black/5 p-6 space-y-4">
                  <h4 className="font-display text-md font-bold text-ark-black flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#1B2A6B]" /> Configure &amp; Mount New Magazine Issue
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={magazineForm.title}
                        onChange={e => setMagazineForm({ ...magazineForm, title: e.target.value })}
                        placeholder="e.g. BITS Pilani Edition"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Issue Number</label>
                      <input
                        type="text"
                        required
                        value={magazineForm.issue_no}
                        onChange={e => setMagazineForm({ ...magazineForm, issue_no: e.target.value })}
                        placeholder="e.g. Vol. II Issue IV"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={magazineForm.description}
                      onChange={e => setMagazineForm({ ...magazineForm, description: e.target.value })}
                      placeholder="Highlights, focus vectors, and details of issue..."
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={magazineForm.cover_url}
                        onChange={e => setMagazineForm({ ...magazineForm, cover_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">PDF Download / Viewer URL</label>
                      <input
                        type="url"
                        required
                        value={magazineForm.pdf_url}
                        onChange={e => setMagazineForm({ ...magazineForm, pdf_url: e.target.value })}
                        placeholder="https://host.com/magazine.pdf"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-650 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={magazineForm.published}
                        onChange={e => setMagazineForm({ ...magazineForm, published: e.target.checked })}
                        className="h-4 w-4 rounded border-black/15 text-[#1B2A6B] focus:ring-[#1B2A6B]/20"
                      />
                      Make Immediately Visible
                    </label>

                    <button
                      type="submit"
                      className="rounded-full bg-[#1B2A6B] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      Publish Magazine Issue
                    </button>
                  </div>
                </form>

                {/* List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">All Magazine Volumes</h4>
                  <div className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white">
                    {magazinesList.map((mag) => (
                      <div key={mag.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-ark-gold bg-ark-gold/10 px-2 py-0.5 rounded-full uppercase">
                              Issue: {mag.issue_no}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${mag.published ? "text-emerald-700 bg-emerald-50" : "text-zinc-500 bg-zinc-100"}`}>
                              {mag.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <h5 className="font-display text-sm font-bold text-ark-black mt-1">{mag.title}</h5>
                          <p className="text-[11px] text-zinc-500 truncate max-w-md">{mag.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMagazineTogglePublish(mag.id, mag.published)}
                            className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-all ${
                              mag.published
                                ? "bg-zinc-150 text-zinc-600 hover:bg-zinc-200"
                                : "bg-[#1B2A6B] text-white hover:bg-opacity-90"
                            }`}
                          >
                            {mag.published ? "Unpublish" : "Publish"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Research Tab */}
            {activeTab === "research" && (
              <div className="p-8 space-y-8">
                <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Scientific Research Papers</h3>

                {/* Form */}
                <form onSubmit={handleResearchSubmit} className="bg-zinc-50 rounded-2xl border border-black/5 p-6 space-y-4">
                  <h4 className="font-display text-md font-bold text-ark-black flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#1B2A6B]" /> Log New Peer-Reviewed Research Document
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={researchForm.title}
                        onChange={e => setResearchForm({ ...researchForm, title: e.target.value })}
                        placeholder="e.g. Synthesis of Bio-composite derivatives"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Authors</label>
                      <input
                        type="text"
                        required
                        value={researchForm.authors}
                        onChange={e => setResearchForm({ ...researchForm, authors: e.target.value })}
                        placeholder="e.g. Dr. Ankit Roy, Rahul Sharma"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Abstract Abstract</label>
                    <textarea
                      rows={3}
                      value={researchForm.abstract}
                      onChange={e => setResearchForm({ ...researchForm, abstract: e.target.value })}
                      placeholder="Enter detailed abstract hypothesis statement..."
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Scientific Domain</label>
                      <input
                        type="text"
                        value={researchForm.domain}
                        onChange={e => setResearchForm({ ...researchForm, domain: e.target.value })}
                        placeholder="e.g. Biotechnology"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Partner College</label>
                      <input
                        type="text"
                        value={researchForm.college}
                        onChange={e => setResearchForm({ ...researchForm, college: e.target.value })}
                        placeholder="e.g. KLH Hyderabad"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">PDF Document URL</label>
                      <input
                        type="url"
                        required
                        value={researchForm.pdf_url}
                        onChange={e => setResearchForm({ ...researchForm, pdf_url: e.target.value })}
                        placeholder="https://host.com/research.pdf"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Citation Text Reference</label>
                    <input
                      type="text"
                      value={researchForm.citation_text}
                      onChange={e => setResearchForm({ ...researchForm, citation_text: e.target.value })}
                      placeholder="e.g. Roy A, et al. ARK Research Journals 2026."
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-650 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={researchForm.published}
                        onChange={e => setResearchForm({ ...researchForm, published: e.target.checked })}
                        className="h-4 w-4 rounded border-black/15 text-[#1B2A6B] focus:ring-[#1B2A6B]/20"
                      />
                      Make Immediately Visible
                    </label>

                    <button
                      type="submit"
                      className="rounded-full bg-[#1B2A6B] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      Publish Research Paper
                    </button>
                  </div>
                </form>

                {/* List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">All Logged Publications</h4>
                  <div className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white">
                    {researchList.map((resPaper) => (
                      <div key={resPaper.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-[#1B2A6B] bg-[#1B2A6B]/10 px-2 py-0.5 rounded-full uppercase">
                              {resPaper.domain || "Research"}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${resPaper.published ? "text-emerald-700 bg-emerald-50" : "text-zinc-500 bg-zinc-100"}`}>
                              {resPaper.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <h5 className="font-display text-sm font-bold text-ark-black mt-1">{resPaper.title}</h5>
                          <p className="text-[11px] text-zinc-500">By {resPaper.authors} • {resPaper.college}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleResearchTogglePublish(resPaper.id, resPaper.published)}
                            className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition-all ${
                              resPaper.published
                                ? "bg-zinc-150 text-zinc-600 hover:bg-zinc-200"
                                : "bg-[#1B2A6B] text-white hover:bg-opacity-90"
                            }`}
                          >
                            {resPaper.published ? "Unpublish" : "Publish"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* College Collabs Tab */}
            {activeTab === "collabs" && (
              <div className="p-8 space-y-6">
                <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">College Partner Applications</h3>
                <div className="divide-y divide-black/5">
                  {collabsList.map((collab) => (
                    <div key={collab.id} className="py-6 first:pt-0 last:pb-0 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-lg font-bold text-ark-black">{collab.college_name}</h4>
                            {collab.verified && (
                              <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                                Verified Partner
                              </span>
                            )}
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              collab.status === "approved" ? "text-emerald-700 bg-emerald-50" :
                              collab.status === "rejected" ? "text-red-700 bg-red-50" : "text-yellow-700 bg-yellow-50"
                            }`}>
                              {collab.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-550 mt-1">
                            Rep: {collab.contact_name} • Email: {collab.email} • Site: {collab.website_url || "N/A"}
                          </p>
                        </div>

                        {collab.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleCollegeReview(collab.id, "approved")}
                              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                            >
                              Approve &amp; Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCollegeReview(collab.id, "rejected")}
                              className="rounded-full bg-red-650 px-4 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-zinc-50 border border-black/5 rounded-2xl text-xs text-zinc-600 font-mono">
                        <strong>Proposal Pitch:</strong>
                        <p className="mt-1 leading-relaxed">"{collab.proposal}"</p>
                      </div>
                    </div>
                  ))}

                  {collabsList.length === 0 && (
                    <p className="py-8 text-center text-xs text-zinc-400">No college applications logged yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Newsletter Tab */}
            {activeTab === "newsletter" && (
              <div className="p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
                  <h3 className="font-display text-2xl font-bold text-ark-black">Newsletter Subscribers Hub</h3>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="rounded-full bg-[#1B2A6B] text-white px-5 py-2 text-xs font-bold hover:scale-105 transition-transform shadow-lg shrink-0"
                  >
                    Export Subscribers as CSV
                  </button>
                </div>

                <div className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white">
                  {subscribersList.map((sub) => (
                    <div key={sub.id} className="p-4 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-ark-black">{sub.email}</span>
                        <div className="text-[10px] text-zinc-400 mt-0.5">Joined: {new Date(sub.created_at).toLocaleDateString()}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${sub.active ? "text-emerald-700 bg-emerald-50" : "text-zinc-500 bg-zinc-100"}`}>
                        {sub.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}

                  {subscribersList.length === 0 && (
                    <p className="p-8 text-center text-xs text-zinc-400">No active newsletter subscriptions logged.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
