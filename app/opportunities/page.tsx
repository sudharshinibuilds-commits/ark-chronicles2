"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { supabase } from "../lib/supabase";
import { Search, Briefcase, Bookmark, Calendar, Globe, Award, DollarSign } from "lucide-react";

export default function OpportunitiesPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [opps, setOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem("ark_opportunity_bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }

    async function loadOpportunities() {
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("status", "approved")
          .eq("category", "Opportunity");

        if (data) {
          // Map DB opportunities to expected structure
          const mapped = data.map((item) => ({
            id: item.id,
            type: "Ecosystem Partner",
            typeColor: "bg-purple-650",
            title: item.title,
            organization: item.author_name || "Community Partner",
            location: item.college || "Remote",
            stipend: "Grant/Stipend Eligible",
            deadline: "Rolling Applications",
            daysLeft: 15,
            desc: item.content,
          }));
          setOpps(mapped);
        }
      } catch (err) {
        console.error("Failed to load approved opportunities", err);
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, []);

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((bId) => bId !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem("ark_opportunity_bookmarks", JSON.stringify(next));
  };

  const displayOpportunities = opps;

  const filteredOpps = displayOpportunities.filter((opp) => {
    const titleMatch = (opp.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const orgMatch = (opp.organization || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (opp.desc || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === "All" || opp.type === selectedFilter;

    return (titleMatch || orgMatch || descMatch) && matchesFilter;
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
          "OPPORTUNITIES: Vetted student fellowships, incubation grants, and hackathons.",
          "OPPORTUNITY HUB: Submit internships or incubator grants via the submission center.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">Opportunities Hub</h1>
            <p className="mt-2 text-xl text-ark-navy">Vetted Internships, Grants, Fellowships &amp; Hackathons</p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search by role, company, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white pl-5 pr-10 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
            />
            <Search className="absolute right-4 top-3.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Filter categories */}
        <div className="mt-8 border-b border-black/5 pb-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-3">Filter by Category</span>
          <div className="flex flex-wrap gap-2">
            {["All", "Internship", "Grant", "Fellowship", "Hackathon", "Incubator", "Ecosystem Partner"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                  selectedFilter === f
                    ? "bg-[#1B2A6B] text-white shadow-md"
                    : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#1B2A6B] border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase">Syncing Opportunities board...</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOpps.map((opp) => {
              const isBookmarked = bookmarks.includes(opp.id);
              return (
                <div
                  key={opp.id}
                  className="group relative overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-md transition-all duration-150 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-4">
                      <span className={`inline-flex rounded-full text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${opp.typeColor || "bg-[#1B2A6B]"}`}>
                        {opp.type}
                      </span>
                      <button
                        onClick={() => toggleBookmark(opp.id)}
                        className={`rounded-full p-1.5 transition-all ${
                          isBookmarked ? "text-ark-gold bg-ark-gold/10" : "text-zinc-350 hover:text-zinc-650"
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Save Opportunity"}
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                      </button>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-black text-ark-black leading-snug group-hover:text-[#1B2A6B]">
                      {opp.title}
                    </h3>

                    <p className="mt-1.5 text-xs font-bold text-ark-navy">
                      {opp.organization} • <span className="text-zinc-450">{opp.location}</span>
                    </p>

                    <p className="mt-3 text-xs sm:text-[13px] text-zinc-550 leading-relaxed line-clamp-3">
                      {opp.desc}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-black/5 pt-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-4">
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-[#1B2A6B]" /> {opp.stipend}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-zinc-400" /> Deadline: {opp.deadline}</span>
                    </div>

                    <button
                      onClick={() => alert(`Redirecting application flow to ${opp.organization}...`)}
                      className="w-full rounded-full bg-[#1B2A6B] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#22378c]"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}

            {displayOpportunities.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm text-zinc-500 font-medium">
                No opportunities published yet — check back soon.
              </div>
            ) : filteredOpps.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm">
                <span className="text-4xl">💼</span>
                <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No active openings found</h3>
                <p className="mt-1 text-sm text-zinc-500">Try adjusting your filters or search keywords.</p>
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
