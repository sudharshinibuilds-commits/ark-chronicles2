"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AudioPlayer from "./components/AudioPlayer";
import CardRow from "./components/CardRow";
import Footer from "./components/Footer";
import Header from "./components/Header";
import StreakBanner from "./components/StreakBanner";
import LiveTicker from "./components/LiveTicker";
import { supabase } from "./lib/supabase";
import { cityLinks, navLinks } from "./components/homepageData";
import { Users, BookOpen, Target, Sparkles, Network } from "lucide-react";

export default function Home() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Interactive Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Statistics counters state
  const [counts, setCounts] = useState({
    builders: 320,
    papers: 54,
    startups: 18,
    colleges: 8,
    visitors: 4,
  });

  // Dynamic content states
  const [chronicles, setChronicles] = useState<any[]>([]);
  const [founders, setFounders] = useState<any[]>([]);
  const [investorSpotlightsState, setInvestorSpotlightsState] = useState<any[]>([]);
  const [magazinesState, setMagazinesState] = useState<any[]>([]);
  const [opportunitiesState, setOpportunitiesState] = useState<any[]>([]);
  const [researchPapersState, setResearchPapersState] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const [
          { data: dbArticles },
          { data: dbFounders },
          { data: dbMagazines },
          { data: dbOpps },
          { data: dbResearch },
        ] = await Promise.all([
          supabase.from("articles").select("*").eq("published", true).order("published_at", { ascending: false }),
          supabase.from("founders").select("*, profiles(streak)").eq("status", "approved").order("created_at", { ascending: false }),
          supabase.from("magazines").select("*").eq("published", true).order("created_at", { ascending: false }),
          supabase.from("submissions").select("*").eq("category", "Opportunity").eq("status", "approved").order("created_at", { ascending: false }),
          supabase.from("research_papers").select("*").eq("published", true).order("created_at", { ascending: false }),
        ]);

        if (dbArticles) {
          // Chronicles: categories NOT in VC Insight, Angel Watch, Thesis
          const chronList = dbArticles.filter(
            (a) => !["VC Insight", "Angel Watch", "Thesis"].includes(a.category)
          );
          setChronicles(
            chronList.map((a) => ({
              id: a.id,
              category: a.category,
              title: a.title,
              author: a.author_name || "ARK Editorial",
              imageSeed: a.id || "default",
            }))
          );

          // Investor Spotlights: categories in VC Insight, Angel Watch, Thesis
          const invList = dbArticles.filter((a) =>
            ["VC Insight", "Angel Watch", "Thesis"].includes(a.category)
          );
          setInvestorSpotlightsState(
            invList.map((a) => ({
              id: a.id,
              category: a.category,
              title: a.title,
              author: a.author_name || "ARK Editorial",
              imageSeed: a.id || "default",
            }))
          );
        }

        if (dbFounders) {
          setFounders(
            dbFounders.map((f) => ({
              id: f.id,
              name: f.name,
              startup: f.company,
              pitch: f.bio,
              imageSeed: f.id || "default",
              streak: `🔥 ${f.profiles?.streak || 0} Days`,
              strikeRate: `🎯 ${f.strike_rate || 90}% Streak`,
            }))
          );
        }

        if (dbMagazines) {
          setMagazinesState(
            dbMagazines.map((m) => ({
              id: m.id,
              category: "ARK Print",
              title: m.title,
              author: "ARK Editorial",
              imageSeed: m.id || "default",
              edition: m.issue_no ? `Issue #${m.issue_no}` : "Special Edition",
              month: m.published_at ? new Date(m.published_at).toLocaleString("default", { month: "long" }) : "July",
              year: m.published_at ? new Date(m.published_at).getFullYear().toString() : "2026",
              description: m.description || "",
            }))
          );
        }

        if (dbOpps) {
          setOpportunitiesState(
            dbOpps.map((o) => ({
              id: o.id,
              category: o.category || "Opportunity",
              title: o.title,
              author: o.author_name || "Ecosystem Partner",
              imageSeed: o.id || "default",
            }))
          );
        }

        if (dbResearch) {
          setResearchPapersState(
            dbResearch.map((r) => ({
              id: r.id,
              category: r.domain || "Research",
              title: r.title,
              author: r.authors || "ARK Research Lab",
              imageSeed: r.id || "default",
            }))
          );
        }

        const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
        const { count: articlesCount } = await supabase.from("articles").select("*", { count: "exact", head: true });
        const { count: foundersCount } = await supabase.from("founders").select("*", { count: "exact", head: true });

        setCounts({
          builders: (usersCount || 0) + 320, // Add pre-seeded nodes
          papers: (articlesCount || 0) + 54,
          startups: (foundersCount || 0) + 18,
          colleges: 8,
          visitors: 12,
        });
      } catch (err) {
        console.error("Failed to count real-time stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        const err = await res.json();
        alert(err.error || "Subscription failed. Please verify formatting.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const partners = [
    { name: "IIT Bombay", logo: "🏫" },
    { name: "BITS Pilani", logo: "🎓" },
    { name: "KL University", logo: "🏫" },
    { name: "T-Hub", logo: "🚀" },
    { name: "NSRCEL", logo: "💡" },
    { name: "AWS Showcase", logo: "☁️" },
    { name: "Google Cloud", logo: "⚡" },
    { name: "Microsoft Founders Hub", logo: "💻" },
  ];

  const upcomingEvents = [
    {
      id: "event-1",
      title: "A.R.K. Innovation Summit 2026",
      type: "Summit",
      date: "August 15, 2026",
      location: "Virtual & Bengaluru",
      desc: "Our annual flagship gathering featuring elite student builders, deep-tech researchers, and top-tier VCs.",
    },
    {
      id: "event-2",
      title: "Deep Tech Founders Meetup",
      type: "Meetup",
      date: "July 25, 2026",
      location: "T-Hub, Hyderabad",
      desc: "An in-person networking event for founders working on hardware, robotics, and climate materials.",
    },
    {
      id: "event-3",
      title: "AI Agent Engineering Workshop",
      type: "Workshop",
      date: "July 28, 2026",
      location: "Virtual Session",
      desc: "Learn from top AI engineers on building production-ready agent workflows with cognitive layers.",
    }
  ];

  const featuredBuilders = [
    {
      id: "builder-1",
      name: "Siddharth Verma",
      role: "AI Agent Architect",
      college: "KLH Hyderabad",
      image: "https://picsum.photos/seed/sidd/150/150",
      skills: ["TypeScript", "Python", "LLMs"],
    },
    {
      id: "builder-2",
      name: "Ananya Sen",
      role: "Climate Tech Researcher",
      college: "IIT Bombay",
      image: "https://picsum.photos/seed/ananya/150/150",
      skills: ["Biomaterials", "Chemical Eng", "MATLAB"],
    },
    {
      id: "builder-3",
      name: "Vikram Malhotra",
      role: "Solidity Developer",
      college: "BITS Pilani",
      image: "https://picsum.photos/seed/vikram/150/150",
      skills: ["Solidity", "Rust", "Web3"],
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Header
        currentDate={currentDate}
        navLinks={navLinks}
        cityLinks={cityLinks}
      />
      <StreakBanner />
      
      <LiveTicker
        items={[
          "Zyra Bio closes a $14M seed round to scale climate-first materials for advanced manufacturing.",
          "Founders in Bengaluru launch a cross-border fintech rail for emerging market exporters.",
          "ARK Research briefs investors on AI-native industrial software and deep-tech resilience.",
          "Mumbai mobility startup reports 3x retention growth after rolling out community-led fleet financing.",
          "Delhi health-tech collective opens applications for its women-led diagnostics accelerator cohort.",
        ]}
      />

      {/* Hero Section Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ark-navy px-8 py-12 text-white shadow-xl sm:px-12 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,160,23,0.15),transparent_60%)]" />
          <div className="relative max-w-3xl">
            <span className="inline-flex rounded-full bg-ark-gold px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ark-navy">
              FEATURED CHRONICLE
            </span>
            <h1 className="mt-6 font-display text-3xl font-black leading-tight sm:text-5xl">
              Inside India's new founder playbook: conviction, capital discipline, and compounding trust.
            </h1>
            <p className="mt-4 text-lg text-zinc-300">
              A daily front page for founders, builders, and believers shaping the next wave of resilient companies.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/chronicles"
                className="rounded-full bg-ark-gold px-6 py-3 text-sm font-semibold text-ark-navy transition-all duration-150 hover:scale-105 hover:bg-[#e1b54b]"
              >
                Read Chronicles
              </a>
              <a
                href="/submit-story"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:scale-105 hover:border-white hover:bg-white/10"
              >
                Submit Story
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Counter Component */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-black/8 bg-white p-8 shadow-md md:grid-cols-5">
          <div className="text-center">
            <div className="font-display text-3xl font-black text-ark-navy md:text-4xl flex items-center justify-center gap-1">
              <Users className="h-5 w-5 text-zinc-400" /> {counts.builders.toLocaleString()}+
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Builders</div>
          </div>
          <div className="text-center border-l border-black/5">
            <div className="font-display text-3xl font-black text-ark-gold md:text-4xl flex items-center justify-center gap-1">
              <BookOpen className="h-5 w-5 text-zinc-400" /> {counts.papers}+
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Publications</div>
          </div>
          <div className="text-center border-l border-black/5">
            <div className="font-display text-3xl font-black text-ark-navy md:text-4xl flex items-center justify-center gap-1">
              <Target className="h-5 w-5 text-zinc-400" /> {counts.startups}+
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Startups</div>
          </div>
          <div className="text-center border-l border-black/5">
            <div className="font-display text-3xl font-black text-ark-gold md:text-4xl flex items-center justify-center gap-1">
              <Network className="h-5 w-5 text-zinc-400" /> {counts.colleges}+
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Colleges</div>
          </div>
          <div className="text-center border-l border-black/5 col-span-2 md:col-span-1 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="font-display text-3xl font-black text-ark-navy md:text-4xl flex items-center justify-center gap-1">
              <Sparkles className="h-5 w-5 text-zinc-400" /> {counts.visitors}K+
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Monthly Node Hits</div>
          </div>
        </div>
      </section>

      {/* Featured Articles & Founder Spotlights */}
      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
          Syncing Trending Chronicles...
        </div>
      ) : chronicles.length > 0 ? (
        <CardRow
          id="trending-chronicles"
          title="🔥 Trending Chronicles"
          seeAllHref="/chronicles"
          variant="article"
          items={chronicles}
        />
      ) : (
        <section id="trending-chronicles" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ark-black">🔥 Trending Chronicles</h2>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-zinc-500 font-medium">
            No chronicles published yet — check back soon.
          </div>
        </section>
      )}

      {/* Featured Builders Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ark-black sm:text-3xl">
            👤 Featured Builders
          </h2>
          <a href="/builders" className="text-sm font-semibold text-ark-navy hover:underline">
            View All Builders &rarr;
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {featuredBuilders.map((builder) => (
            <div
              key={builder.id}
              className="rounded-3xl border border-black/8 bg-white p-5 shadow-lg transition-all duration-150 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <img
                  src={builder.image}
                  alt={builder.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-ark-gold/20"
                />
                <div>
                  <h3 className="font-display text-base font-black text-ark-black">{builder.name}</h3>
                  <p className="text-xs text-ark-navy font-bold uppercase">{builder.role}</p>
                  <p className="text-xs text-zinc-550">{builder.college}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {builder.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] text-zinc-600 font-bold uppercase tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <a
                href="/builders"
                className="mt-4 block w-full rounded-full bg-ark-navy/5 py-2.5 text-center text-xs font-bold text-ark-navy transition-colors hover:bg-ark-navy hover:text-white uppercase tracking-wider"
              >
                View Builder Profile
              </a>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
          Syncing Founder Spotlights...
        </div>
      ) : founders.length > 0 ? (
        <CardRow
          id="founder-spotlights"
          title="👤 Founder Spotlights"
          seeAllHref="/founders"
          variant="founder"
          items={founders}
        />
      ) : (
        <section id="founder-spotlights" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ark-black">👤 Founder Spotlights</h2>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-zinc-500 font-medium">
            No founder profiles published yet.
          </div>
        </section>
      )}

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
          Syncing Latest Magazines...
        </div>
      ) : magazinesState.length > 0 ? (
        <CardRow
          id="latest-magazines"
          title="📚 Latest Magazines"
          seeAllHref="/magazines"
          variant="magazine"
          items={magazinesState}
        />
      ) : (
        <section id="latest-magazines" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ark-black">📚 Latest Magazines</h2>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-zinc-500 font-medium">
            No magazines published yet.
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ark-black sm:text-3xl">
            📅 Upcoming Events
          </h2>
          <a href="#" className="text-sm font-semibold text-ark-navy hover:underline" onClick={(e) => { e.preventDefault(); alert("Interactive calendar opening shortly!"); }}>
            Events Calendar &rarr;
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col justify-between rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.01]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-ark-gold/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ark-navy">
                    {event.type}
                  </span>
                  <span className="text-xs text-zinc-500 font-semibold">{event.date}</span>
                </div>
                <h3 className="mt-4 font-display text-base font-black text-ark-black leading-snug">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs text-ark-navy font-bold uppercase">{event.location}</p>
                <p className="mt-3 text-xs sm:text-[13px] text-zinc-550 leading-relaxed">{event.desc}</p>
              </div>
              <button
                onClick={() => alert(`Registration details for ${event.title} sent to user mailbox.`)}
                className="mt-6 block w-full rounded-full bg-ark-navy py-2.5 text-center text-xs font-bold text-white uppercase tracking-wider transition-all hover:bg-[#22378c]"
              >
                Register For Event
              </button>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
          Syncing Investor Spotlights...
        </div>
      ) : investorSpotlightsState.length > 0 ? (
        <CardRow
          id="investor-spotlights"
          title="💼 Investor Spotlights"
          seeAllHref="/investors"
          variant="article"
          items={investorSpotlightsState}
        />
      ) : (
        <section id="investor-spotlights" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ark-black">💼 Investor Spotlights</h2>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-zinc-500 font-medium">
            No investor spotlights published yet.
          </div>
        </section>
      )}

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
          Syncing Opportunities...
        </div>
      ) : opportunitiesState.length > 0 ? (
        <CardRow
          id="opportunities"
          title="🌟 Opportunities"
          seeAllHref="/opportunities"
          variant="article"
          items={opportunitiesState}
        />
      ) : (
        <section id="opportunities" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ark-black">🌟 Opportunities</h2>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-zinc-500 font-medium">
            No opportunities published yet — check back soon.
          </div>
        </section>
      )}

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
          Syncing Research Papers...
        </div>
      ) : researchPapersState.length > 0 ? (
        <CardRow
          id="research-papers"
          title="🔬 Research Papers"
          seeAllHref="/research"
          variant="article"
          items={researchPapersState}
        />
      ) : (
        <section id="research-papers" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ark-black">🔬 Research Papers</h2>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-zinc-500 font-medium">
            No research papers published yet.
          </div>
        </section>
      )}

      {/* Partners & Collaborators Marquee */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-black/5">
        <h3 className="text-center font-display font-bold text-zinc-400 uppercase tracking-widest text-xs">
          Partners &amp; Collaborators
        </h3>
        <div className="relative mt-8 overflow-hidden py-4">
          <div className="flex gap-4 items-center justify-center flex-wrap">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-5 py-2.5 shadow-sm hover:border-ark-navy/20 transition-all duration-150"
              >
                <span className="text-xl">{partner.logo}</span>
                <span className="text-xs font-bold text-zinc-700 uppercase">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup Form Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.1),transparent_50%)]" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl text-white">
              Stay ahead with A.R.K. Weekly Digest
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
              Get the latest issues, student startups updates, emerging research summaries, and handpicked developer opportunities sent straight to your inbox.
            </p>
            {subscribed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-8 rounded-full bg-ark-gold/15 border border-ark-gold/30 px-6 py-4 text-center font-bold text-ark-gold text-xs uppercase tracking-wider"
              >
                🎉 Thanks for subscribing! Check your inbox for updates next week.
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-auto rounded-full border-0 bg-white/5 px-5 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-ark-gold text-xs font-bold"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-none rounded-full bg-ark-gold px-6 py-3 text-xs font-bold text-ark-navy shadow-sm transition-all duration-150 hover:scale-105 hover:bg-[#e1b54b]"
                >
                  {submitting ? "..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
