"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AudioPlayer from "../../components/AudioPlayer";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LiveTicker from "../../components/LiveTicker";
import { supabase } from "../../lib/supabase";
import { 
  Award, 
  MapPin, 
  GraduationCap, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Mail, 
  ExternalLink, 
  BookOpen, 
  Clock, 
  Compass, 
  ChevronRight,
  TrendingUp,
  Bookmark
} from "lucide-react";

export default function BuilderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [activeTab, setActiveTab] = useState<"achievements" | "startup" | "activity">("achievements");
  const [profile, setProfile] = useState<any>(null);
  const [founder, setFounder] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    async function loadBuilderProfile() {
      try {
        // Detect if UUID or username string
        let query = supabase.from("profiles").select("*");
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username);
        
        if (isUuid) {
          query = query.eq("id", username);
        } else {
          query = query.eq("username", username);
        }

        const { data: prof, error } = await query.maybeSingle();

        if (error || !prof) {
          // Fallback check: if UUID doesn't match id, maybe search by name or first profile
          const { data: firstProf } = await supabase.from("profiles").select("*").limit(1).single();
          if (firstProf) {
            setProfile(firstProf);
            loadRelatedData(firstProf.id);
          } else {
            setLoading(false);
          }
          return;
        }

        setProfile(prof);
        await loadRelatedData(prof.id);
      } catch (err) {
        console.error("Failed to load user profile", err);
        setLoading(false);
      }
    }

    async function loadRelatedData(userId: string) {
      try {
        // 1. Fetch founder profile
        const { data: found } = await supabase
          .from("founders")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        setFounder(found);

        // 2. Fetch badges
        const { data: bgs } = await supabase
          .from("user_badges")
          .select("earned_at, badge_id, badges(*)")
          .eq("user_id", userId);
        if (bgs) setBadges(bgs);

        // 3. Fetch activity events
        const { data: acts } = await supabase
          .from("activity_events")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);
        if (acts) setActivities(acts);

        // 4. Fetch articles authored
        const { data: arts } = await supabase
          .from("articles")
          .select("*")
          .eq("author_id", userId)
          .order("published_at", { ascending: false });
        if (arts) setArticles(arts);

      } catch (e) {
        console.error("Error loading related data", e);
      } finally {
        setLoading(false);
      }
    }

    loadBuilderProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
          <p className="font-display font-medium text-ark-navy animate-pulse">Retrieving Ecosystem Passports...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] p-4 text-center">
        <h1 className="font-display text-4xl font-black text-ark-navy">Profile Not Found</h1>
        <p className="text-zinc-550 mt-2 max-w-md">The requested user node does not exist in the active clusters database yet.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-full bg-[#1B2A6B] px-6 py-2.5 text-xs font-bold text-white shadow-lg"
        >
          Return to Hub
        </button>
      </div>
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
          `MEMBER LOG: Active telemetry for ${profile.name || 'Student Builder'} verified.`,
          `XP LEDGER: ${profile.xp || 0} XP registered across ecosystem interactions.`,
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-3xl border border-black/10 shadow-lg bg-gradient-to-r from-ark-navy to-[#22378c]">
          {profile.cover_url ? (
            <img
              src={profile.cover_url}
              alt="Cover Banner"
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B2A6B] to-[#3a4ea8] opacity-80" />
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ark-black transition-all hover:scale-105 shadow-md text-xs font-bold"
          >
            ◀
          </button>
        </div>

        {/* Profile Card & Bio Info */}
        <div className="relative -mt-16 px-6 sm:px-12 flex flex-col md:flex-row md:items-end gap-6 pb-6 border-b border-black/5">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-[#faf9f6] bg-white shadow-xl">
            <img
              src={profile.avatar_url || `https://picsum.photos/seed/${profile.id}/200/200`}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 mt-2 md:mt-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-3xl font-black text-ark-black">{profile.name}</h1>
              {founder && (
                <span className="inline-flex items-center gap-1 rounded-full bg-ark-gold px-3 py-0.5 text-[10px] font-bold text-ark-navy uppercase shadow-sm border border-ark-gold/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Founder
                </span>
              )}
            </div>
            <p className="text-base font-bold text-ark-navy mt-1">@{profile.username || "member"}</p>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
              <GraduationCap className="h-4 w-4 text-ark-navy shrink-0" />
              {profile.college || "Ecosystem Partner College"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-[#0077B5] px-4 py-2 text-xs font-bold text-white transition-all hover:scale-105 shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
              </a>
            )}
            <a
              href={`mailto:${profile.contact_email || profile.email}`}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-ark-navy transition-all hover:scale-105 shadow-sm"
            >
              <Mail className="h-3.5 w-3.5" /> Email Node
            </a>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mt-8">
          {/* Left Column: Stats, Skills, and Badges */}
          <div className="space-y-6 lg:col-span-1">
            {/* XP & Streak Ledger */}
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md space-y-4">
              <h3 className="font-display text-lg font-bold text-ark-black border-b border-black/5 pb-2">XP Ledger</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1B2A6B]/5 rounded-2xl border border-[#1B2A6B]/10 p-4 text-center">
                  <Zap className="h-5 w-5 text-ark-gold mx-auto mb-1 animate-pulse" />
                  <div className="font-display text-2xl font-black text-ark-navy">{profile.xp || 0}</div>
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">Total XP</div>
                </div>
                <div className="bg-orange-500/5 rounded-2xl border border-orange-500/10 p-4 text-center">
                  <Flame className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <div className="font-display text-2xl font-black text-orange-600">{profile.streak || 0}</div>
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">Active Streak</div>
                </div>
              </div>
            </div>

            {/* Badges Vault */}
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              <h3 className="font-display text-lg font-bold text-ark-black border-b border-black/5 pb-2">Badges Showcase</h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {badges.map((b) => (
                  <div key={b.badge_id} className="text-center p-2 rounded-xl bg-zinc-50 border border-black/5 hover:scale-105 transition-transform" title={b.badges?.description}>
                    <div className="text-2xl mb-1">{b.badges?.icon || "🏆"}</div>
                    <div className="text-[10px] font-black text-ark-navy leading-tight truncate">{b.badges?.name}</div>
                  </div>
                ))}
                {badges.length === 0 && (
                  <div className="col-span-3 text-center py-6">
                    <Award className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">No badges unlocked yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills & Fields */}
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              <h3 className="font-display text-lg font-bold text-ark-black border-b border-black/5 pb-2">Skills &amp; Interests</h3>
              <div className="mt-4 space-y-4">
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Expertise</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map((s: string) => (
                        <span key={s} className="rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/15 px-3 py-1 text-[11px] font-bold text-[#1B2A6B]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Interests</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interests.map((i: string) => (
                        <span key={i} className="rounded-full bg-zinc-100 border border-black/5 px-3 py-1 text-[11px] font-bold text-zinc-650">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Timelines & Activities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              {/* Tab selector */}
              <div className="flex border-b border-black/5 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("achievements")}
                  className={`flex-1 text-center py-2 text-xs font-bold border-b-2 uppercase tracking-wider transition-all duration-150 ${
                    activeTab === "achievements"
                      ? "border-ark-navy text-ark-navy"
                      : "border-transparent text-zinc-400 hover:text-zinc-650"
                  }`}
                >
                  🏆 Milestone Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("startup")}
                  className={`flex-1 text-center py-2 text-xs font-bold border-b-2 uppercase tracking-wider transition-all duration-150 ${
                    activeTab === "startup"
                      ? "border-ark-navy text-ark-navy"
                      : "border-transparent text-zinc-400 hover:text-zinc-650"
                  }`}
                >
                  🚀 Startup Ventures
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 text-center py-2 text-xs font-bold border-b-2 uppercase tracking-wider transition-all duration-150 ${
                    activeTab === "activity"
                      ? "border-ark-navy text-ark-navy"
                      : "border-transparent text-zinc-400 hover:text-zinc-650"
                  }`}
                >
                  ⚡ Active telemetry log
                </button>
              </div>

              {/* Tab Contents */}
              <div className="mt-6 space-y-6">
                {activeTab === "achievements" && (
                  <div className="space-y-6">
                    {/* Real Articles written */}
                    {articles.map((art) => (
                      <div key={art.id} className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                          <div className="mt-2 h-10 w-0.5 bg-black/10" />
                        </div>
                        <div>
                          <span className="inline-flex rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                            {new Date(art.published_at || art.created_at).getFullYear()} • Published Editorial
                          </span>
                          <h4 className="font-display text-sm font-bold text-ark-black mt-1 hover:underline">
                            <a href={`/article/${art.id}`}>{art.title}</a>
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">{art.excerpt || "Editorial contribution to ecosystem archives."}</p>
                        </div>
                      </div>
                    ))}

                    {/* Badge Milestone */}
                    {badges.map((b, idx) => (
                      <div key={b.badge_id || idx} className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="h-4 w-4 rounded-full bg-ark-gold border-2 border-white shadow-sm" />
                          <div className="mt-2 h-10 w-0.5 bg-black/10" />
                        </div>
                        <div>
                          <span className="inline-flex rounded bg-ark-gold/15 px-2 py-0.5 text-[9px] font-bold text-ark-gold uppercase tracking-wider">
                            Badge Unlocked
                          </span>
                          <h4 className="font-display text-sm font-black text-ark-black mt-1">
                            Earned the "{b.badges?.name}" Recognition Badge
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">{b.badges?.description}</p>
                        </div>
                      </div>
                    ))}

                    {articles.length === 0 && badges.length === 0 && (
                      <p className="py-8 text-center text-xs text-zinc-400">No active milestones logged in directories yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "startup" && (
                  <div className="space-y-6">
                    {founder ? (
                      <div className="space-y-4">
                        <div className="bg-[#1B2A6B]/5 border border-[#1B2A6B]/10 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-display text-lg font-black text-[#1B2A6B]">{founder.company}</h4>
                              <p className="text-xs text-zinc-500 font-bold mt-0.5">{founder.headline}</p>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                              Active Venture
                            </span>
                          </div>

                          <p className="text-xs text-zinc-650 leading-relaxed font-mono">
                            "{founder.bio}"
                          </p>

                          <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-3.5 mt-2">
                            <div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase">Verification Level</div>
                              <div className="text-xs font-bold text-ark-black mt-0.5">Ecosystem Member (Lv-5)</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase">Strike Rate</div>
                              <div className="text-xs font-bold text-ark-gold mt-0.5">{founder.strike_rate || 90}% Efficiency</div>
                            </div>
                          </div>

                          {founder.website_url && (
                            <div className="pt-2">
                              <a
                                href={founder.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#1B2A6B] font-bold hover:underline"
                              >
                                Visit Pitch Page <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <span className="text-3xl">🚀</span>
                        <h4 className="font-display text-md font-bold text-ark-black mt-2">Not Registered as Founder</h4>
                        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                          Register inside the Founders page with startup details to instantiate a digital pitch sandbox card.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "activity" && (
                  <div className="space-y-4 font-mono text-xs">
                    {activities.map((act) => (
                      <div key={act.id} className="p-3 bg-zinc-50 border border-black/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-ark-black uppercase text-[10px] tracking-wider">
                            Event: {act.event_type}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Logged: {new Date(act.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                        <span className="text-emerald-600 font-bold shrink-0">
                          +{act.xp_delta} XP
                        </span>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="py-8 text-center text-xs text-zinc-400 font-sans">No recent telemetry logs recorded.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile bio summary */}
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              <h3 className="font-display text-lg font-bold text-ark-black border-b border-black/5 pb-2">
                Ecosystem Pitch
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-zinc-600 italic leading-relaxed bg-[#faf9f6] p-4 rounded-2xl border border-black/5">
                "{profile.bio || "This user is a quiet student builder in the ARK Chronicles ecosystem, silently expanding intellectual depth."}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
