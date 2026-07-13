"use client";

import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function ResourceLibraryPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Guides", "Templates", "Research Resources", "Startup Resources", "AI Resources"];

  const mockResources = [
    {
      id: "res-1",
      title: "University Pitch Deck Template",
      category: "Templates",
      subCategory: "Startup Resources",
      format: "PDF / PPTX",
      size: "4.2 MB",
      description: "Structured specifically for college incubators and micro-VC showcases. Includes templates for unit margin equations and cap-table forecasts.",
    },
    {
      id: "res-2",
      title: "Deep Tech Patent Filing Checklist",
      category: "Guides",
      subCategory: "Research Resources",
      format: "PDF Document",
      size: "1.8 MB",
      description: "Step-by-step breakdown of how to translate lab prototypes into provisional patents, with checklists for Indian patent offices.",
    },
    {
      id: "res-3",
      title: "Multi-Agent System Prompt Book",
      category: "AI Resources",
      subCategory: "Templates",
      format: "Markdown Guide",
      size: "820 KB",
      description: "A set of evaluated system instructions for steering cognitive agents in workflow planning, conflict resolution, and data verification.",
    },
    {
      id: "res-4",
      title: "Indian Micro-VC Database 2026",
      category: "Startup Resources",
      subCategory: "Guides",
      format: "XLSX Spreadsheet",
      size: "2.1 MB",
      description: "An active index of 150+ micro-VCs, angel syndicates, and grant programs actively backing student builders across major hubs.",
    },
  ];

  const filteredResources = mockResources.filter((res) => {
    return selectedCategory === "All" || res.category === selectedCategory || res.subCategory === selectedCategory;
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
        <div>
          <h1 className="font-display text-5xl font-bold text-ark-black">Resource Library</h1>
          <p className="mt-2 text-xl text-ark-navy">Curated Playbooks, Templates & Prompts</p>
        </div>

        {/* Categories selector */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                selectedCategory === cat
                  ? "bg-ark-navy text-white shadow-md"
                  : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid display */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="rounded-3xl border border-black/8 bg-white p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <span className="inline-flex rounded bg-ark-gold/15 border border-ark-gold/30 px-2 py-0.5 text-[9px] font-bold text-ark-navy">
                    {res.category}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-semibold">{res.format} • {res.size}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ark-black leading-snug">{res.title}</h3>
                <p className="mt-2 text-xs text-zinc-550 leading-relaxed">{res.description}</p>
              </div>

              <div className="mt-6 border-t border-black/5 pt-4">
                <button
                  type="button"
                  onClick={() => alert(`Starting download for resource: ${res.title} (${res.format})`)}
                  className="w-full rounded-full bg-ark-navy py-2.5 text-xs font-bold text-white transition-all hover:bg-[#22378c]"
                >
                  Download Resource
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
