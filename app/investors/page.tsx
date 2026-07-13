"use client";

import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Briefcase, CheckCircle2, AlertCircle } from "lucide-react";

export default function InvestorsPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startup_name: "",
    stage: "Seed",
    ask: "",
    pitch: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // Fetch user profiles who are registered as investors
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "investor");

        if (!error && data && data.length > 0) {
          const formatted = data.map((p, index) => ({
            id: p.id,
            name: p.name || "Anonymous Investor",
            fund: p.bio || "Ecosystem Angel Fund",
            interests: p.interests && p.interests.length > 0 ? p.interests : ["DeepTech", "SaaS"],
            ticket: "$100K - $1M",
          }));
          setInvestors(formatted);
        } else {
          setInvestors([]);
        }
      } catch (err) {
        console.error("Failed to fetch investors list", err);
        setInvestors([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleConnectClick = (investor: any) => {
    if (!user) {
      alert("Please login or create an account to initiate pitch connections.");
      return;
    }
    setSelectedInvestor(investor);
    setShowModal(true);
  };

  const handleSubmitPitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestor || !user) return;

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/investor-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          investor_id: selectedInvestor.id,
          startup_name: formData.startup_name,
          stage: formData.stage,
          ask: formData.ask,
          pitch: formData.pitch,
        }),
      });

      if (res.ok) {
        alert(`Your connection request with ${selectedInvestor.name} has been submitted! Our bridge team will schedule details shortly.`);
        setFormData({
          startup_name: "",
          stage: "Seed",
          ask: "",
          pitch: "",
        });
        setShowModal(false);
      } else {
        const err = await res.json();
        alert(`Failed to submit connection pitch: ${err.error || "Please try again."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error logging request. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

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
          "INVESTORS: Matchmaking system online. Express interest to trigger direct deal routing.",
          "BRIDGE PROTOCOL: Verify matching criteria. A 2% bridge fee applies to successful rounds.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-5xl font-bold text-ark-black">Investor Network</h1>
        
        <div className="mt-6 grid grid-cols-3 gap-4 rounded-3xl border border-ark-navy/20 bg-ark-navy/5 p-6 sm:grid-cols-6 shadow-sm">
          <div className="text-center p-2">
            <div className="font-display text-2xl sm:text-3xl font-black text-ark-navy">₹4500Cr</div>
            <div className="mt-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Total AUM</div>
          </div>
          <div className="text-center p-2">
            <div className="font-display text-2xl sm:text-3xl font-black text-ark-navy">120+</div>
            <div className="mt-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Verified Angels</div>
          </div>
          <div className="text-center p-2">
            <div className="font-display text-2xl sm:text-3xl font-black text-[#1B2A6B]">45</div>
            <div className="mt-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">VC Funds</div>
          </div>
          <div className="text-center p-2">
            <div className="font-display text-2xl sm:text-3xl font-black text-[#1B2A6B]">850+</div>
            <div className="mt-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Deals Closed</div>
          </div>
          <div className="text-center p-2">
            <div className="font-display text-2xl sm:text-3xl font-black text-ark-navy">28</div>
            <div className="mt-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Cities Covered</div>
          </div>
          <div className="text-center p-2">
            <div className="font-display text-2xl sm:text-3xl font-black text-ark-gold">92%</div>
            <div className="mt-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Success Rate</div>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase">Syncing Investor Matrix...</p>
          </div>
        ) : investors.length === 0 ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5 text-zinc-500 font-medium">
            No investor spotlights published yet.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {investors.map((investor) => (
              <div
                key={investor.id}
                className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-ark-gold/20 shrink-0">
                      <img
                        src={`https://picsum.photos/seed/inv-${investor.name}/200/200`}
                        alt={investor.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-black text-ark-black leading-snug">{investor.name}</h3>
                      <p className="mt-0.5 text-xs font-bold text-[#1B2A6B] uppercase tracking-wider">{investor.fund}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {investor.interests.map((interest: string) => (
                      <span
                        key={interest}
                        className="rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/15 px-2.5 py-1 text-[10px] font-bold text-[#1B2A6B] uppercase tracking-wider"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 text-xs">
                    <span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Ticket Size:</span>
                    <span className="ml-2 font-black text-ark-navy">{investor.ticket}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConnectClick(investor)}
                  className="mt-6 w-full rounded-full border-2 border-ark-navy px-4 py-2.5 text-xs font-bold text-ark-navy uppercase tracking-wider transition-all duration-150 hover:bg-[#1B2A6B] hover:border-[#1B2A6B] hover:text-white"
                >
                  I'm Interested
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B2A6B]/10 px-3 py-1 text-[11px] font-bold text-[#1B2A6B] uppercase tracking-wider mb-2">
              <Briefcase className="h-3 w-3 animate-pulse" /> Express Pitch Interest
            </span>
            <h2 className="font-display text-2xl font-black text-ark-black leading-tight">
              Pitch to {selectedInvestor.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Provide your details to initiate a secure investment bridge pass.
            </p>

            <form onSubmit={handleSubmitPitch} className="mt-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Startup / Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.startup_name}
                  onChange={e => setFormData({ ...formData, startup_name: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  placeholder="e.g. PulseForge AI"
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Funding Stage</label>
                  <select
                    value={formData.stage}
                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B] bg-white font-bold"
                  >
                    <option>Pre-seed</option>
                    <option>Seed</option>
                    <option>Series A</option>
                    <option>Series B+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Target Ask Amount</label>
                  <input
                    type="text"
                    required
                    value={formData.ask}
                    onChange={e => setFormData({ ...formData, ask: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                    placeholder="e.g. $500K"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Brief Elevator Pitch</label>
                <textarea
                  required
                  rows={3}
                  value={formData.pitch}
                  onChange={e => setFormData({ ...formData, pitch: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  placeholder="Explain what major breakthrough you are building and current milestones..."
                />
              </div>
              
              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[10px] text-amber-800 leading-normal flex gap-1.5 items-start">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                <span>Note: A 2% bridge assistance advisory fee applies on successful deal closures.</span>
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
                  className="flex-1 rounded-full bg-[#1B2A6B] px-4 py-2.5 text-xs font-bold text-white shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Routing..." : "Submit Pitch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <AudioPlayer />
    </main>
  );
}
