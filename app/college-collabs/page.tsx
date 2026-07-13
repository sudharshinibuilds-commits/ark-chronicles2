"use client";

import { useState, useEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { supabase } from "../lib/supabase";
import { CheckCircle, AlertTriangle, Building, ArrowRight, MapPin, Users } from "lucide-react";

export default function CollegeCollabsPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [collegeName, setCollegeName] = useState("");
  const [city, setCity] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState<number>(5000);
  const [collabType, setCollabType] = useState("Content Partnership");
  const [proposal, setProposal] = useState("");

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        if (session?.user) {
          setContactName(session.user.user_metadata?.name || "");
          setEmail(session.user.email || "");
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const colleges = [
    { id: "1", name: "IIT Bombay", city: "Mumbai", students: 15000, active: true },
    { id: "2", name: "IIT Delhi", city: "Delhi", students: 12000, active: true },
    { id: "3", name: "IISc Bangalore", city: "Bengaluru", students: 4000, active: true },
    { id: "4", name: "BITS Pilani", city: "Pilani", students: 8000, active: true },
    { id: "5", name: "NIT Trichy", city: "Trichy", students: 6000, active: false },
    { id: "6", name: "VIT Vellore", city: "Vellore", students: 35000, active: true },
    { id: "7", name: "SRM University", city: "Chennai", students: 50000, active: false },
    { id: "8", name: "Manipal Institute", city: "Manipal", students: 28000, active: true },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("Please login to register a collaboration request.");
      return;
    }

    if (!collegeName.trim() || !contactName.trim() || !email.trim() || !proposal.trim()) {
      setErrorMsg("Please fill all required inputs.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/college-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          college_name: collegeName.trim(),
          city: city.trim(),
          contact_name: contactName.trim(),
          email: email.trim(),
          students_count: Number(students),
          collab_type: collabType,
          proposal: proposal.trim(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setShowForm(false);
      } else {
        const err = await response.json();
        setErrorMsg(err.error || "Failed to register application.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network failure. Please retry shortly.");
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
          "COLLEGE COLLABORATIONS: Facilitating research-exchange, startup incubators and builder fellowships.",
          "NETWORK NODES: 8 tier-1 partner colleges are actively running campus channels.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">College Collaborations</h1>
            <p className="mt-2 text-xl text-ark-navy">Partner with India's leading institutions</p>
          </div>
          {!showForm && !submitted && (
            <button
              onClick={() => {
                if (!user) {
                  alert("Please sign in using the top navigation header first.");
                } else {
                  setShowForm(true);
                }
              }}
              className="rounded-full bg-ark-navy px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#22378c] transition-all"
            >
              Apply for College Node
            </button>
          )}
        </div>

        {submitted ? (
          <div className="mt-10 overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center shadow-lg max-w-xl mx-auto">
            <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
            <h2 className="mt-4 font-display text-2xl font-black text-ark-black">Application Logged!</h2>
            <p className="mt-2 text-zinc-700 text-sm max-w-md mx-auto">
              Your college collaboration application has been securely logged into the ecosystem registry. An administrative pass will be issued upon editorial review.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-full bg-ark-navy px-8 py-3 text-xs font-bold text-white hover:bg-[#22378c]"
            >
              Submit Another Application
            </button>
          </div>
        ) : showForm ? (
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-lg max-w-3xl mx-auto">
            <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-6">
              <h2 className="font-display text-2xl font-black text-ark-black">Apply for College Collaboration</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full bg-zinc-100 p-2 text-xs font-bold hover:bg-zinc-250 transition-colors"
              >
                Cancel
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex gap-2 items-center mb-6">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">College Name</label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                    placeholder="Your institution name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                    placeholder="City"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                    placeholder="email@college.edu"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Student Population</label>
                  <input
                    type="number"
                    value={students}
                    onChange={(e) => setStudents(Number(e.target.value))}
                    className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy"
                    placeholder="Approximate number of students"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Collaboration Interest</label>
                  <select
                    value={collabType}
                    onChange={(e) => setCollabType(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-5 py-2.5 text-xs outline-none focus:border-ark-navy bg-white"
                  >
                    <option>Content Partnership</option>
                    <option>Event Sponsorship</option>
                    <option>Research Collaboration</option>
                    <option>Talent Pipeline</option>
                    <option>Startup Incubation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Proposal &amp; Goals</label>
                <textarea
                  rows={4}
                  required
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-xs outline-none focus:border-ark-navy"
                  placeholder="Tell us about your collaboration goals..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full border border-black/10 py-3 text-xs font-bold uppercase text-ark-black transition-all hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-ark-navy py-3 text-xs font-bold uppercase text-white transition-all hover:bg-[#22378c] disabled:opacity-50"
                >
                  {submitting ? "Lodging request..." : "Submit Node Application"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {colleges.map((college) => (
              <div
                key={college.id}
                className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ark-navy/10 text-xl font-black text-ark-navy">
                    {college.name.slice(0, 2)}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-black text-ark-black leading-snug">{college.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500 font-bold flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-zinc-400" /> {college.city}
                  </p>

                  <div className="mt-4 border-t border-black/5 pt-4 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-bold uppercase">Students:</span>
                    <span className="font-black text-ark-navy flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-zinc-400" /> {college.students.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-2">
                  {college.active ? (
                    <div className="mb-4">
                      <span className="inline-flex rounded-full bg-ark-gold/15 border border-ark-gold/30 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-ark-navy shadow-xs">
                        Active Partner Node
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span className="inline-flex rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                        Pending Validation
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        alert("Please sign in using the top navigation header first.");
                      } else {
                        setCollegeName(college.name);
                        setCity(college.city);
                        setShowForm(true);
                      }
                    }}
                    className="w-full rounded-full border border-ark-navy px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ark-navy transition-all duration-150 hover:bg-ark-navy hover:text-white"
                  >
                    Join Chapter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
