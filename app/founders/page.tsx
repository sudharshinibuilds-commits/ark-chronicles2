"use client";

import { useState, useEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { supabase } from "../lib/supabase";
import { Award, Briefcase, Search, Plus, MapPin, GraduationCap, Link2, ExternalLink } from "lucide-react";

export default function FoundersPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");

  // Form State
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    headline: "",
    bio: "",
    email: "",
    linkedin_url: "",
    website_url: "",
    photo_url: "",
  });

  const industries = ["All", "AI/ML", "HealthTech", "Fintech", "ClimateTech", "SaaS", "DeepTech"];
  const stages = ["All", "Bootstrapped", "Pre-seed", "Seed", "Series A"];

  // Fetch approved founders from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        const { data, error } = await supabase
          .from("founders")
          .select("*, profiles(streak, college, role, avatar_url)")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setFounders(data);
        }
      } catch (err) {
        console.error("Failed to load founders database", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to submit a founder verification request.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/founder-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Your application has been logged for admin review! Verification is typically completed within 12 hours.");
        setFormData({
          name: "",
          company: "",
          headline: "",
          bio: "",
          email: "",
          linkedin_url: "",
          website_url: "",
          photo_url: "",
        });
        setShowApplyForm(false);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to submit request"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit request due to networking issues.");
    } finally {
      setSubmitting(false);
    }
  };

  // Client-side heuristics for sorting & filtering missing database columns
  const filteredFounders = founders.filter((f) => {
    const textQuery = searchQuery.toLowerCase();
    const matchesSearch =
      f.name.toLowerCase().includes(textQuery) ||
      f.company.toLowerCase().includes(textQuery) ||
      (f.profiles?.college || "").toLowerCase().includes(textQuery) ||
      (f.bio || "").toLowerCase().includes(textQuery);

    // Heuristics for Industry
    let founderIndustry = "SaaS";
    const bioText = (f.bio || "").toLowerCase() + " " + (f.headline || "").toLowerCase();
    if (bioText.includes("ai") || bioText.includes("machine learning") || bioText.includes("copilot")) founderIndustry = "AI/ML";
    else if (bioText.includes("health") || bioText.includes("medical") || bioText.includes("diagnostics") || bioText.includes("care")) founderIndustry = "HealthTech";
    else if (bioText.includes("fintech") || bioText.includes("finance") || bioText.includes("ledger") || bioText.includes("banking")) founderIndustry = "Fintech";
    else if (bioText.includes("climate") || bioText.includes("ev ") || bioText.includes("battery") || bioText.includes("energy")) founderIndustry = "ClimateTech";
    else if (bioText.includes("deep") || bioText.includes("material") || bioText.includes("physics")) founderIndustry = "DeepTech";

    const matchesIndustry = selectedIndustry === "All" || founderIndustry === selectedIndustry;

    // Heuristics for Stage
    let founderStage = "Pre-seed";
    if (bioText.includes("series a")) founderStage = "Series A";
    else if (bioText.includes("seed")) founderStage = "Seed";
    else if (bioText.includes("bootstrapped") || bioText.includes("self")) founderStage = "Bootstrapped";

    const matchesStage = selectedStage === "All" || founderStage === selectedStage;

    f._resolvedIndustry = founderIndustry;
    f._resolvedStage = founderStage;

    return matchesSearch && matchesIndustry && matchesStage;
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
          "FOUNDER LIST: View verified deep-tech and student builders logging milestones live.",
          "BUILDERS ECOSYSTEM: Apply for verification to list your startup in the elite directory.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">Founders Vault</h1>
            <p className="mt-2 text-xl text-ark-navy">Elite Student Startup Directory</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-md w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search startup, builder, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-black/10 bg-white pl-5 pr-10 py-2.5 text-sm outline-none focus:border-ark-navy"
              />
              <Search className="absolute right-4 top-3.5 h-4 w-4 text-zinc-400" />
            </div>

            <button
              onClick={() => {
                if (!user) {
                  alert("Please sign in to register as a founder.");
                  return;
                }
                setShowApplyForm(!showApplyForm);
              }}
              className="rounded-full bg-[#1B2A6B] text-white px-5 py-2.5 text-xs font-bold shadow-lg transition-transform hover:scale-105 shrink-0"
            >
              {showApplyForm ? "Close Form" : "Join as Founder"}
            </button>
          </div>
        </div>

        {/* Join as Founder Application Form */}
        {showApplyForm && (
          <div className="mt-8 rounded-3xl border border-[#1B2A6B]/20 bg-white p-8 shadow-xl max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B2A6B]/10 px-3 py-1 text-[11px] font-bold text-[#1B2A6B] uppercase tracking-wider mb-3">
              <Award className="h-3 w-3" /> Founder Verification Pass
            </span>
            <h2 className="font-display text-2xl font-black text-ark-black">Register in Ecosystem Directory</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Your profile will be verified by the editorial desk before appearing publicly in the Founders Vault.
            </p>

            <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Bedi"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Company / Startup Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. PulseForge AI"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">One-line Headline</label>
                  <input
                    type="text"
                    required
                    value={formData.headline}
                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Building lightweight AI copilots for industrial logistics"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Professional Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. aarav@pulseforge.ai"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Startup Bio / Detailed Pitch</label>
                <textarea
                  required
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Provide details about your startup milestone, team size, current traction, and what you are building."
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://pulseforge.ai"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Photo / Avatar URL</label>
                  <input
                    type="url"
                    value={formData.photo_url}
                    onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#1B2A6B] px-8 py-3 text-xs font-bold text-white shadow-xl transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Founder Application"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Directory Filters */}
        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Industry Sector</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full rounded-full border border-black/10 px-4 py-2.5 text-xs bg-[#faf9f6] outline-none font-bold"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Funding Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full rounded-full border border-black/10 px-4 py-2.5 text-xs bg-[#faf9f6] outline-none font-bold"
              >
                {stages.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Founders Grid */}
        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase">Fetching Ecosystem Vault...</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFounders.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={item.photo_url || item.profiles?.avatar_url || `https://picsum.photos/seed/${item.id}/200/200`}
                      alt={item.name}
                      className="h-20 w-20 rounded-full object-cover ring-4 ring-ark-gold/20"
                    />
                    <span title="Verified Founder" className="absolute bottom-0 right-0 bg-ark-gold rounded-full p-1 text-[10px] text-ark-navy ring-2 ring-white">
                      ★
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-black text-ark-black">{item.name}</h3>
                  <p className="text-[10px] font-bold text-ark-navy uppercase tracking-wider">{item.headline || "Ecosystem Founder"}</p>
                  <h4 className="mt-1.5 text-sm font-extrabold text-zinc-700">{item.company}</h4>

                  <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600">
                      <GraduationCap className="h-3 w-3" />
                      {item.profiles?.college || "IIT / BITS"}
                    </span>
                    {item.profiles?.streak > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                        🔥 {item.profiles.streak} Days
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-zinc-550 leading-relaxed italic line-clamp-4">
                    "{item.bio}"
                  </p>

                  {/* Metrics */}
                  <div className="mt-6 w-full border-t border-black/5 pt-4 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-400">Industry</span>
                      <span className="text-ark-navy font-bold">{item._resolvedIndustry}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-400">Streak Rate</span>
                      <span className="text-ark-gold font-bold">{item.strike_rate || 90}%</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-400">Funding Stage</span>
                      <span className="text-zinc-700 font-bold">{item._resolvedStage}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-black/5 pt-4 flex gap-2">
                  {item.linkedin_url && (
                    <a
                      href={item.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-full bg-zinc-100 p-2.5 hover:bg-zinc-200 transition-colors shrink-0"
                    >
                      <Link2 className="h-4 w-4 text-zinc-600" />
                    </a>
                  )}
                  <a
                    href={`/builders/${item.profiles?.username || item.id}`}
                    className="flex-1 text-center rounded-full bg-ark-navy py-2.5 text-xs font-bold text-white transition-all hover:bg-[#22378c]"
                  >
                    View Builder Profile
                  </a>
                </div>
              </div>
            ))}

            {founders.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white text-zinc-500 font-medium">
                No founder profiles published yet.
              </div>
) : filteredFounders.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-12 text-center bg-white">
                <span className="text-4xl">🚀</span>
                <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No startups match filters</h3>
                <p className="mt-1 text-xs text-zinc-500">Try matching on another college or industry category.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
