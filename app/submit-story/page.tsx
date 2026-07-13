"use client";

import { useState, useEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { supabase } from "../lib/supabase";
import { Send, LogIn, CheckCircle, AlertTriangle } from "lucide-react";

export default function SubmitStoryPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [submitType, setSubmitType] = useState("Story");
  const [status, setStatus] = useState<"draft" | "review" | "published">("draft");
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Fields state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    college: "",
    link: "",
    desc: "",
  });

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        if (session?.user) {
          setFormData((prev) => ({
            ...prev,
            author: session.user.user_metadata?.name || "",
          }));
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const handleInputChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("Please login first to submit a story to the ecosystem.");
      return;
    }

    if (formData.desc.trim().length < 100) {
      setErrorMessage("Submission content must be at least 100 characters in length to qualify for review.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          author_name: formData.author,
          email: user.email,
          category: submitType,
          content: formData.desc,
          college: formData.college,
          linkedin_url: formData.link,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setStatus("review");
        setFormData({
          title: "",
          author: user.user_metadata?.name || "",
          college: "",
          link: "",
          desc: "",
        });
      } else {
        const err = await response.json();
        setErrorMessage(err.error || "Failed to log submission.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Networking failure. Please retry shortly.");
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
          "SUBMISSIONS: Share milestones, student insights, and research innovations.",
          "INCENTIVE PROTOCOL: Approved submissions award +50 XP and a verified writer node pass.",
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-5xl font-bold text-ark-black">Submission System</h1>
        <p className="mt-2 text-xl text-ark-navy">Contribute Stories, Research, Startups and Opportunities</p>

        {/* Progress Tracker */}
        <div className="mt-6 flex items-center gap-6 border-b border-black/5 pb-4">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${status === "draft" ? "bg-ark-navy" : "bg-zinc-300"}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${status === "draft" ? "text-ark-navy" : "text-zinc-400"}`}>Drafting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${status === "review" ? "bg-ark-gold animate-pulse" : "bg-zinc-300"}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${status === "review" ? "text-ark-gold" : "text-zinc-400"}`}>Under Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${status === "published" ? "bg-emerald-600" : "bg-zinc-300"}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${status === "published" ? "text-emerald-600" : "text-zinc-400"}`}>Published Pass</span>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase">Booting Submission Sandbox...</p>
          </div>
        ) : !user ? (
          <div className="mt-10 rounded-3xl border border-black/5 bg-white p-12 text-center shadow-lg">
            <span className="text-4xl">🔐</span>
            <h2 className="mt-4 font-display text-2xl font-black text-ark-black">Authentication Required</h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto">
              Please sign in using the top navigation header bar to authenticate before logging database entries.
            </p>
          </div>
        ) : submitted ? (
          <div className="mt-10 overflow-hidden rounded-3xl border border-ark-gold/30 bg-ark-gold/10 p-8 text-center shadow-lg">
            <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
            <h2 className="mt-4 font-display text-2xl font-bold text-ark-black font-black">Submission Logged Successfully!</h2>
            <p className="mt-2 text-zinc-700 text-sm max-w-md mx-auto">
              Your {submitType} has been successfully registered under your UID pass. The editorial board will verify the payload within 12 hours.
            </p>
            <div className="mt-4 text-xs font-bold text-[#1B2A6B]">
              ★ Earning registered: +50 XP will credit automatically on review approval.
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setStatus("draft");
              }}
              className="mt-6 rounded-full bg-ark-navy px-8 py-3 text-xs font-bold text-white hover:bg-[#22378c]"
            >
              Submit Another Entry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-lg space-y-6">
            {/* Submission Type Pill Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Submission Category</label>
              <div className="flex flex-wrap gap-2">
                {["Story", "Startup", "Research", "Opportunity", "Achievement", "Event"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSubmitType(t)}
                    className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                      submitType === t ? "bg-ark-navy text-white shadow-md" : "bg-zinc-100 text-zinc-650 hover:bg-zinc-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex gap-2 items-center">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                {errorMessage}
              </div>
            )}

            {/* Dynamic Inputs Deck */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-zinc-450 uppercase tracking-widest mb-1.5">
                  {submitType === "Research" ? "Research Paper Title" : submitType === "Opportunity" ? "Role/Intership Title" : submitType === "Event" ? "Event / Summit Title" : "Headline / Startup Name"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={`Enter your ${submitType.toLowerCase()} title`}
                  className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-450 uppercase tracking-widest mb-1.5">Author / Lead Name</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-450 uppercase tracking-widest mb-1.5">College/Institution</label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                  placeholder="e.g. BITS Pilani"
                  className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-450 uppercase tracking-widest mb-1.5">Reference / Showcase URL</label>
                <input
                  type="url"
                  required
                  value={formData.link}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-450 uppercase tracking-widest mb-1.5">Content Body (Min 100 Characters)</label>
              <textarea
                rows={6}
                required
                value={formData.desc}
                onChange={(e) => handleInputChange("desc", e.target.value)}
                placeholder="Paste the abstract text, event logs, opportunity specifications, or detailed milestone description here (Must be at least 100 characters long)..."
                className="w-full rounded-2xl border border-black/10 px-4 py-3 text-xs outline-none focus:border-ark-navy font-mono"
              />
              <p className="text-[10px] text-zinc-400 mt-1 font-bold">
                Character count: {formData.desc.length} / 100
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-ark-navy py-4 text-xs font-bold text-white transition-all hover:bg-[#22378c] disabled:opacity-50"
            >
              {submitting ? "Uploading Node Payload..." : "Submit Pass to Ecosystem Review"}
            </button>
          </form>
        )}
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
