"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import AudioPlayer from "../../components/AudioPlayer";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LiveTicker from "../../components/LiveTicker";
import LoginModal from "../../components/LoginModal";
import { Briefcase, ArrowLeft, AlertCircle, Calendar, DollarSign, Target } from "lucide-react";

const Linkedin = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function InvestorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [investor, setInvestor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Modal connection state
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        // Fetch current user and profile
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (prof) {
            setUserProfile(prof);
          }
        }

        // Fetch investor by ID
        const { data: inv, error } = await supabase
          .from("investors")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && inv) {
          setInvestor(inv);
        } else {
          console.error("Error fetching investor:", error);
        }
      } catch (err) {
        console.error("Failed to load investor:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleConnectClick = () => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    setMessage(`Hi ${investor.name},\n\nI saw your detailed profile on ARK Chronicles. I'm building a project in your space and would love to share our progress and get your feedback.`);
    setShowModal(true);
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investor || !currentUser) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("connection_requests").insert({
        from_user_id: currentUser.id,
        to_user_id: investor.user_id || investor.id,
        from_role: userProfile?.role || "founder",
        message: message,
        status: "pending"
      });

      if (error) {
        alert(`Failed to submit connection request: ${error.message}`);
      } else {
        alert(`Your expression of interest has been sent to ${investor.name}! If they accept, their contact details will be revealed in your Dashboard.`);
        setShowModal(false);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to parse focus areas
  const getFocusAreas = (areas: any) => {
    if (!areas) return ["SaaS", "DeepTech"];
    if (typeof areas === "string") {
      return areas.split(",").map(a => a.trim()).filter(Boolean);
    }
    if (Array.isArray(areas)) return areas;
    return ["SaaS", "DeepTech"];
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Header currentDate={currentDate} navLinks={[]} cityLinks={[]} />
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B2A6B] border-t-transparent" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-zinc-500 animate-pulse">Syncing Investor Profile...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!investor) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Header currentDate={currentDate} navLinks={[]} cityLinks={[]} />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-2xl font-black text-zinc-800">Investor Profile Not Found</h1>
          <p className="text-zinc-500 text-sm mt-2">The profile may have been unpublished or removed by the platform administration.</p>
          <button
            onClick={() => router.push("/investors")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1B2A6B] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const focusAreas = getFocusAreas(investor.focus_areas);

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
          `Viewing premium investor briefing: ${investor.name} (${investor.firm || "Ecosystem Angel"}).`,
          "ARK Bridge facilitators ready to verify connection approvals.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/investors")}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-ark-navy hover:underline uppercase tracking-wider"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Directory
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar Info Card */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg">
              <div className="relative h-56 w-full overflow-hidden rounded-2xl ring-2 ring-black/5">
                <img
                  src={investor.photo_url || `https://picsum.photos/seed/inv-${investor.id}/400/400`}
                  alt={investor.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/inv-${investor.id}/400/400`;
                  }}
                />
              </div>

              <h1 className="mt-5 font-display text-2xl font-black text-ark-black leading-tight flex items-center gap-2">
                {investor.name}
              </h1>
              <p className="mt-1 text-md font-bold text-ark-navy">{investor.firm || "Ecosystem Angel"}</p>
              
              <div className="mt-6 border-t border-black/5 pt-5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 text-zinc-400" /> Min Check Size
                  </span>
                  <span className="font-black text-zinc-850">{investor.min_check_size || "$25K"}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> Max Check Size
                  </span>
                  <span className="font-black text-ark-gold">{investor.max_check_size || "$500K"}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Onboarded
                  </span>
                  <span className="font-bold text-zinc-700">
                    {investor.created_at ? new Date(investor.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Recently"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-black/5 flex flex-col gap-2.5">
                {investor.linkedin_url && (
                  <a
                    href={investor.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-all hover:scale-105 shadow-sm"
                    style={{ backgroundColor: "#0077B5" }}
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn Profile
                  </a>
                )}
                <button
                  onClick={handleConnectClick}
                  className="w-full rounded-full border-2 border-ark-navy px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider transition-all duration-150 hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: "#1B2A6B" }}
                >
                  Express Interest
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Bio & Focus Areas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-lg">
              <h2 className="font-display text-2xl font-black text-ark-black border-b border-black/5 pb-4">Professional Brief</h2>
              <p className="mt-5 leading-7 text-zinc-700 text-sm whitespace-pre-line">
                {investor.bio || "No biography provided."}
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-lg">
              <h2 className="font-display text-2xl font-black text-ark-black border-b border-black/5 pb-4">Focus Sectors & Core Thesis</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {focusAreas.map((area: string) => (
                  <span
                    key={area}
                    className="rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/15 px-3.5 py-2 text-xs font-bold text-ark-navy uppercase tracking-wider"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400 italic">
                This investor focuses on opportunities in the sectors outlined above. When submitting requests, align your introduction with these priorities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Express Interest Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B2A6B]/10 px-3 py-1 text-[11px] font-bold text-[#1B2A6B] uppercase tracking-wider mb-2">
              <Briefcase className="h-3 w-3 animate-pulse" /> Direct Connection Request
            </span>
            <h2 className="font-display text-2xl font-black text-ark-black leading-tight">
              Express Interest to {investor.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Your connection message and profile details will be shared. Once accepted, both parties can view each other's emails.
            </p>

            <form onSubmit={handleSubmitInterest} className="mt-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Introduction Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-xs outline-none focus:border-[#1B2A6B] text-zinc-800 leading-relaxed"
                  placeholder="Explain why you are interested in connecting..."
                />
              </div>
              
              <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/15 text-[11px] text-amber-800 leading-normal flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> ARK Chronicle facilitates introductions only. All deal terms and transactions happen directly between parties.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-xs font-bold text-zinc-650 hover:bg-zinc-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-[#1B2A6B] px-4 py-2.5 text-xs font-bold text-white shadow-lg disabled:opacity-50 uppercase tracking-wider"
                >
                  {submitting ? "Sending..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login modal fallback */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => {
          setLoginOpen(false);
          window.location.reload();
        }}
        initialMode="login"
      />

      <Footer />
      <AudioPlayer />
    </main>
  );
}
