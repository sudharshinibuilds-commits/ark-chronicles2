"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import LoginModal from "../components/LoginModal";
import { Briefcase, Mail, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, any>>({});
  const [loginOpen, setLoginOpen] = useState(false);

  // Load user data and connection requests
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Fetch user profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (prof) {
        setProfile(prof);
      }

      // Fetch sent requests
      const { data: sent, error: sentErr } = await supabase
        .from("connection_requests")
        .select("*")
        .eq("from_user_id", session.user.id)
        .order("created_at", { ascending: false });

      // Fetch received requests
      const { data: received, error: recErr } = await supabase
        .from("connection_requests")
        .select("*")
        .eq("to_user_id", session.user.id)
        .order("created_at", { ascending: false });

      const allSent = sent || [];
      const allReceived = received || [];

      setSentRequests(allSent);
      setReceivedRequests(allReceived);

      // Gather unique IDs to fetch profiles
      const uniqueIds = Array.from(new Set([
        ...allSent.map(r => r.to_user_id),
        ...allReceived.map(r => r.from_user_id)
      ])).filter(Boolean);

      if (uniqueIds.length > 0) {
        const { data: profs, error: profsErr } = await supabase
          .from("profiles")
          .select("id, name, email, role, college")
          .in("id", uniqueIds);

        if (!profsErr && profs) {
          const map: Record<string, any> = {};
          profs.forEach(p => {
            map[p.id] = p;
          });
          setProfilesMap(map);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateStatus = async (requestId: string, newStatus: "accepted" | "declined") => {
    try {
      const { error } = await supabase
        .from("connection_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (error) {
        alert(`Error updating connection request status: ${error.message}`);
      } else {
        alert(`Connection request successfully ${newStatus}!`);
        loadDashboardData(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Header currentDate={currentDate} navLinks={[]} cityLinks={[]} />
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B2A6B] border-t-transparent" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-zinc-500 animate-pulse">Syncing Dashboard Interface...</p>
        </div>
        <Footer />
      </main>
    );
  }

  // Not logged in UI
  if (!user) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Header currentDate={currentDate} navLinks={[]} cityLinks={[]} />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-display text-3xl font-black text-ark-black">Dashboard Secure Gate</h1>
          <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">
            You must be logged in to view your customized matches, sent pitches, and introduction request pipelines.
          </p>
          <button
            onClick={() => setLoginOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1B2A6B] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
          >
            Access Dashboard Account
          </button>
        </div>

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
      </main>
    );
  }

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
          `Welcome to your ARK Dashboard, ${profile?.name || user.email?.split("@")[0]}.`,
          "Intelligent introductions unlocked upon consensus matching.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-b border-black/5 pb-6 mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B2A6B]/10 px-3 py-1 text-[11px] font-bold text-[#1B2A6B] uppercase tracking-wider mb-2">
            🚀 Member Dashboard
          </span>
          <h1 className="font-display text-4xl font-black text-ark-black sm:text-5xl">Your Connections</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage and respond to introduction pipelines across founders and investors.</p>
        </div>

        {/* Global Disclaimer Banner */}
        <div className="mb-8 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/15 text-xs text-amber-900 flex gap-2 items-start shadow-sm">
          <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5">Off-Platform Deal Terms Warning</span>
            ARK Chronicle facilitates introductions only. All deal terms, transactions, and formal agreements happen directly between parties off-platform.
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Section 1: Received Requests */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
              <span className="p-1.5 bg-[#1B2A6B]/10 rounded-lg text-[#1B2A6B]">
                <ArrowDownLeft className="h-4 w-4" />
              </span>
              <h2 className="font-display text-xl font-bold text-ark-black">Requests Received</h2>
            </div>

            {receivedRequests.length === 0 ? (
              <div className="py-12 bg-white rounded-3xl border border-black/5 text-center text-zinc-500 text-sm font-medium">
                No requests received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map((req) => {
                  const senderProfile = profilesMap[req.from_user_id] || {
                    name: "ARK Member",
                    email: "Hidden until accepted",
                    role: req.from_role || "member",
                    college: "Elite Institution"
                  };

                  return (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-black/8 bg-white p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-zinc-850">{senderProfile.name}</h3>
                            <span className="inline-block mt-1 rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/15 px-2 py-0.5 text-[9px] font-bold text-[#1B2A6B] uppercase tracking-wider">
                              {senderProfile.role}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-2">
                              {senderProfile.college}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            req.status === "accepted" ? "bg-emerald-50 text-emerald-700" :
                            req.status === "declined" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {req.status === "accepted" && <CheckCircle2 className="h-3 w-3" />}
                            {req.status === "declined" && <XCircle className="h-3 w-3" />}
                            {req.status}
                          </span>
                        </div>

                        <p className="mt-3.5 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-650 italic leading-relaxed whitespace-pre-line">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      </div>

                      {/* Connection Unlocks / Action Buttons */}
                      <div className="mt-4 pt-4 border-t border-black/5">
                        {req.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(req.id, "declined")}
                              className="flex-1 py-2 text-xs font-bold border border-red-200 text-red-650 bg-red-50/50 rounded-full hover:bg-red-50 transition"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "accepted")}
                              className="flex-1 py-2 text-xs font-bold text-white bg-[#1B2A6B] rounded-full hover:opacity-90 shadow-sm transition"
                            >
                              Accept Intro
                            </button>
                          </div>
                        ) : req.status === "accepted" ? (
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                            <Mail className="h-4 w-4 text-emerald-700" />
                            <div className="text-xs">
                              <span className="font-bold text-zinc-400 text-[10px] uppercase block tracking-wider">Unlocked Contact Email</span>
                              <a href={`mailto:${senderProfile.email}`} className="font-black text-emerald-800 underline break-all">
                                {senderProfile.email}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-400 font-medium">Request has been declined.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Sent Requests */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-black/5 pb-3">
              <span className="p-1.5 bg-[#D4A017]/10 rounded-lg text-[#D4A017]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <h2 className="font-display text-xl font-bold text-ark-black">Requests Sent</h2>
            </div>

            {sentRequests.length === 0 ? (
              <div className="py-12 bg-white rounded-3xl border border-black/5 text-center text-zinc-500 text-sm font-medium">
                No requests sent yet.
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.map((req) => {
                  const recipientProfile = profilesMap[req.to_user_id] || {
                    name: "ARK Member",
                    email: "Hidden until accepted",
                    role: req.from_role === "founder" ? "investor" : "founder",
                    college: "Elite Institution"
                  };

                  return (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-black/8 bg-white p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-zinc-850">{recipientProfile.name}</h3>
                            <span className="inline-block mt-1 rounded-full bg-[#D4A017]/5 border border-[#D4A017]/20 px-2 py-0.5 text-[9px] font-bold text-[#D4A017] uppercase tracking-wider">
                              {recipientProfile.role}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-2">
                              {recipientProfile.college}
                            </span>
                          </div>

                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            req.status === "accepted" ? "bg-emerald-50 text-emerald-700" :
                            req.status === "declined" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        <p className="mt-3.5 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-650 italic leading-relaxed whitespace-pre-line">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-black/5">
                        {req.status === "accepted" ? (
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                            <Mail className="h-4 w-4 text-emerald-700" />
                            <div className="text-xs">
                              <span className="font-bold text-zinc-400 text-[10px] uppercase block tracking-wider">Recipient Contact Email</span>
                              <a href={`mailto:${recipientProfile.email}`} className="font-black text-emerald-800 underline break-all">
                                {recipientProfile.email}
                              </a>
                            </div>
                          </div>
                        ) : req.status === "pending" ? (
                          <span className="text-xs text-amber-700 bg-amber-500/5 px-3 py-2 rounded-xl border border-amber-500/10 inline-block">
                            Waiting for recipient to review and unlock introduction.
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400 font-medium">Request has been declined.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
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
