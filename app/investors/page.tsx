"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import LoginModal from "../components/LoginModal";
import { Search, Briefcase, Info, AlertCircle } from "lucide-react";
import Link from "next/link";

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

export default function InvestorsPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Connection request modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
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

        // Fetch published investors
        const { data: invs, error } = await supabase
          .from("investors")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (!error && invs) {
          setInvestors(invs);
        } else {
          console.error("Error fetching investors from table:", error);
          setInvestors([]);
        }
      } catch (err) {
        console.error("Failed to load investor data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleConnectClick = (investor: any) => {
    if (!currentUser) {
      setLoginOpen(true);
      return;
    }
    setSelectedInvestor(investor);
    setMessage(`Hi ${investor.name},\n\nI saw your profile on ARK Chronicles and would love to connect to discuss what we are building.`);
    setShowModal(true);
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestor || !currentUser) return;

    setSubmitting(true);
    try {
      // Insert request into connection_requests
      const { error } = await supabase.from("connection_requests").insert({
        from_user_id: currentUser.id,
        to_user_id: selectedInvestor.user_id || selectedInvestor.id, // Fallback to investor profile id if no user_id mapping
        from_role: userProfile?.role || "founder",
        message: message,
        status: "pending"
      });

      if (error) {
        alert(`Failed to submit connection request: ${error.message}`);
      } else {
        alert(`Your expression of interest has been sent to ${selectedInvestor.name}! If they accept, their contact details will be revealed in your Dashboard.`);
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

  // Filtered investors
  const filteredInvestors = investors.filter(inv => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (inv.name || "").toLowerCase().includes(query);
    const firmMatch = (inv.firm || "").toLowerCase().includes(query);
    const bioMatch = (inv.bio || "").toLowerCase().includes(query);
    const focusMatch = getFocusAreas(inv.focus_areas).some((f: string) => f.toLowerCase().includes(query));
    return nameMatch || firmMatch || bioMatch || focusMatch;
  });

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
          "INVESTORS: Connect with the brightest minds across elite Indian institutions.",
          "ARK Chronicle facilitates secure builder-investor matchmaking and deal discovery.",
          "DISCLAIMER: ARK Chronicle is a matching system only; all investment discussions take place directly between parties.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/5 pb-6">
          <div>
            <h1 className="font-display text-4xl font-black text-ark-black sm:text-5xl">Investor Network</h1>
            <p className="text-zinc-500 text-sm mt-1">Discover, read, and connect with premier institutional and angel investors.</p>
          </div>
          
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, firm, or focus areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-2 pl-10 pr-4 text-xs outline-none transition-all focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase tracking-wider">Syncing Investor Network...</p>
          </div>
        ) : filteredInvestors.length === 0 ? (
          <div className="mt-12 text-center py-24 bg-white rounded-3xl border border-black/5">
            <div className="text-4xl mb-3">💼</div>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">No investor profiles published yet.</p>
            {searchQuery && <p className="text-xs text-zinc-400 mt-1">Try adjusting your search criteria.</p>}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInvestors.map((investor) => {
              const focusAreas = getFocusAreas(investor.focus_areas);
              return (
                <div
                  key={investor.id}
                  className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-ark-gold/20 shrink-0">
                        <img
                          src={investor.photo_url || `https://picsum.photos/seed/inv-${investor.id}/200/200`}
                          alt={investor.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/inv-${investor.id}/200/200`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/investors/${investor.id}`} className="hover:underline">
                          <h3 className="font-display text-lg font-black text-ark-black leading-snug truncate">
                            {investor.name}
                          </h3>
                        </Link>
                        <p className="mt-0.5 text-xs font-bold text-[#1B2A6B] uppercase tracking-wider truncate">
                          {investor.firm || "Ecosystem Angel"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-zinc-650 line-clamp-3 leading-relaxed">
                      {investor.bio || "No bio provided."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {focusAreas.map((interest: string) => (
                        <span
                          key={interest}
                          className="rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/15 px-2.5 py-1 text-[10px] font-bold text-[#1B2A6B] uppercase tracking-wider"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-black/5 flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block">Min Check</span>
                        <span className="font-black text-ark-navy">{investor.min_check_size || "$25K"}</span>
                      </div>
                      <div>
                        <span className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block">Max Check</span>
                        <span className="font-black text-ark-gold">{investor.max_check_size || "$500K"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <Link
                      href={`/investors/${investor.id}`}
                      className="w-full text-center rounded-full border border-black/10 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-100 uppercase tracking-wider"
                    >
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleConnectClick(investor)}
                      className="w-full rounded-full border-2 border-ark-navy px-4 py-2 text-xs font-bold text-white uppercase tracking-wider transition-all duration-150 hover:opacity-90 shadow-sm"
                      style={{ backgroundColor: "#1B2A6B" }}
                    >
                      Express Interest
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Express Interest Modal */}
      {showModal && selectedInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B2A6B]/10 px-3 py-1 text-[11px] font-bold text-[#1B2A6B] uppercase tracking-wider mb-2">
              <Briefcase className="h-3 w-3 animate-pulse" /> Direct Connection Request
            </span>
            <h2 className="font-display text-2xl font-black text-ark-black leading-tight">
              Express Interest to {selectedInvestor.name}
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
