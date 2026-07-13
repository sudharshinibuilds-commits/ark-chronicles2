"use client";

import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function SearchPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "People", "Startups", "Research", "Colleges", "Opportunities", "Articles"];

  // Mock global index
  const globalIndex = [
    { type: "People", name: "Siddharth Verma", desc: "AI Agent Architect from KLH Hyderabad building AutoAgent canvas.", link: "/builders/siddharth-verma" },
    { type: "People", name: "Ananya Sen", desc: "Climate Tech Researcher at IIT Bombay modeling polymer degradation.", link: "/builders/ananya-sen" },
    { type: "Startups", name: "PulseForge AI", desc: "Seed-stage enterprise AI assistants for heavy industrial operations.", link: "/founders/founder-1" },
    { type: "Startups", name: "LedgerMint", desc: "Cryptographic invoicing credit lock system for trade compliance.", link: "/founders/founder-3" },
    { type: "Research", name: "Reading founder resilience through execution patterns", desc: "Dr. Naina Kapoor, published study on founder code pushes vs narrative metrics.", link: "/research" },
    { type: "Colleges", name: "KL University, Hyderabad", desc: "Innovation score 645 pts, 14 startups incubated, 42 research publications.", link: "/college/klh-hyderabad" },
    { type: "Opportunities", name: "Product Design Intern at Zomato", desc: "Monthly stipend: ₹25,000, deadline: July 25, 2026.", link: "/opportunities" },
    { type: "Articles", name: "Inside India's new founder playbook: capital discipline", desc: "Naina Kapoor, feature article exploring ARR benchmarks and unit metrics.", link: "/article/chronicle-1" },
  ];

  const filteredResults = globalIndex.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "All" || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
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
          "Zyra Bio closes a $14M seed round to scale climate-first materials for advanced manufacturing.",
          "Founders in Bengaluru launch a cross-border fintech rail for emerging market exporters.",
          "ARK Research briefs investors on AI-native industrial software and deep-tech resilience.",
          "Mumbai mobility startup reports 3x retention growth after rolling out community-led fleet financing.",
          "Delhi health-tech collective opens applications for its women-led diagnostics accelerator cohort.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="font-display text-5xl font-bold text-ark-black">Search Engine</h1>
          <p className="text-xl text-ark-navy">Search across People, Startups, Research, Colleges, Opportunities, and Chronicles</p>

          {/* Search bar */}
          <div className="relative mt-8">
            <input
              type="text"
              autoFocus
              placeholder="Search by keyword (e.g. AI, Bombay, Intern, Siddharth)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white px-6 py-4 text-base outline-none focus:border-ark-navy focus:ring-2 focus:ring-ark-navy shadow-md"
            />
            <span className="absolute right-6 top-4 text-lg">🔍</span>
          </div>
        </div>

        {/* Filter options */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 border-b border-black/5 pb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                selectedFilter === filter
                  ? "bg-ark-navy text-white shadow-md"
                  : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-8 max-w-3xl mx-auto space-y-6">
          {searchQuery.trim() === "" ? (
            <div className="text-center py-16 text-zinc-400">
              <span className="text-5xl">🔍</span>
              <h3 className="mt-4 font-display text-lg font-bold text-ark-black">Type to begin search</h3>
              <p className="mt-1 text-sm text-zinc-550">Filter search metrics across builders, researchers, and startups.</p>
            </div>
          ) : (
            <>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2">
                Found {filteredResults.length} results matching "{searchQuery}"
              </div>

              {filteredResults.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="block rounded-3xl border border-black/8 bg-white p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between border-b border-black/5 pb-2">
                    <span className="inline-flex rounded-full bg-ark-gold/15 border border-ark-gold/30 px-3 py-0.5 text-[9px] font-bold text-ark-navy uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold">View Detail &rarr;</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-ark-black">{item.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                </a>
              ))}

              {filteredResults.length === 0 && (
                <div className="rounded-3xl border border-dashed border-black/10 p-12 text-center">
                  <span className="text-4xl">❌</span>
                  <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No matches found</h3>
                  <p className="mt-1 text-sm text-zinc-500">Try matching on other parameters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
