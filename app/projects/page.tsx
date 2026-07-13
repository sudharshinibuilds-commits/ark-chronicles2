"use client";

import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function ProjectsPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [activeTab, setActiveTab] = useState<"projects" | "openSource">("projects");
  const [searchQuery, setSearchQuery] = useState("");

  const mockProjects = [
    {
      id: "proj-1",
      name: "AutoAgent Orchestrator",
      description: "A drag-and-drop workflow designer to coordinate multiple localized LLM execution subagents on edge devices.",
      demoLink: "https://autoagent-demo.mock",
      github: "https://github.com/autoagent/orchestrator",
      screenshot: "https://picsum.photos/seed/autoagent/600/400",
      team: ["Siddharth Verma", "Ananya Sen"],
      tech: ["React", "TypeScript", "LangChain", "TailwindCSS"],
    },
    {
      id: "proj-2",
      name: "BioWrap Degradation Tracker",
      description: "Visual computer vision mapping app predicting degradation states in bio-degradable polymer sheets.",
      demoLink: "https://biowrap-tracker.mock",
      github: "https://github.com/biowrap/degrade-cv",
      screenshot: "https://picsum.photos/seed/biowrap/600/400",
      team: ["Ananya Sen", "Rahul Dev"],
      tech: ["Python", "PyTorch", "Next.js", "OpenCV"],
    },
    {
      id: "proj-3",
      name: "LedgerMint Smart Escrow",
      description: "Automated cryptographic invoice matching checks to verify cross-border custom trade documents.",
      demoLink: "https://ledgermint-escrow.mock",
      github: "https://github.com/ledgermint/smart-escrow",
      screenshot: "https://picsum.photos/seed/ledger/600/400",
      team: ["Kabir Sethi", "Saira Anand"],
      tech: ["Solidity", "Hardhat", "TypeScript", "Ethers.js"],
    },
  ];

  const mockOpenSource = [
    {
      id: "os-1",
      repository: "autoagent/core-engine",
      stars: 1250,
      contributors: ["Siddharth Verma", "Amit K.", "Sara T."],
      description: "Lightweight runtime engine for agent-to-agent sockets communication protocols. Extremely fast and low latency.",
      documentation: "https://autoagent.github.io/core-docs",
      github: "https://github.com/autoagent/core-engine",
    },
    {
      id: "os-2",
      repository: "biopolymer/predict-models",
      stars: 340,
      contributors: ["Ananya Sen", "Pranav D."],
      description: "A Python package containing trained pre-degradation coefficients for organic composite structures.",
      documentation: "https://biopolymer.github.io/models-docs",
      github: "https://github.com/biopolymer/predict-models",
    },
    {
      id: "os-3",
      repository: "ledgermint/compliance-rules",
      stars: 890,
      contributors: ["Kabir Sethi", "Girish P."],
      description: "Pre-compiled rule matrices evaluating tax and border parameters for 12 major export lanes.",
      documentation: "https://ledgermint.github.io/rules-docs",
      github: "https://github.com/ledgermint/compliance-rules",
    },
  ];

  const filteredProjects = mockProjects.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredOS = mockOpenSource.filter((os) => {
    return (
      os.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      os.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">Showcase Vault</h1>
            <p className="mt-2 text-xl text-ark-navy">Compounding Creations & Repositories</p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search showcase by name, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm outline-none focus:border-ark-navy focus:ring-1 focus:ring-ark-navy"
            />
            <span className="absolute right-4 top-3 text-zinc-400">🔍</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="mt-8 border-b border-black/5 flex">
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === "projects"
                ? "border-ark-navy text-ark-navy"
                : "border-transparent text-zinc-400 hover:text-zinc-650"
            }`}
          >
            💡 Project Showcase
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("openSource")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all duration-150 ${
              activeTab === "openSource"
                ? "border-ark-navy text-ark-navy"
                : "border-transparent text-zinc-400 hover:text-zinc-650"
            }`}
          >
            🌐 Open Source Showcase
          </button>
        </div>

        {/* Dynamic Display Rendering */}
        <div className="mt-8">
          {activeTab === "projects" ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white shadow-lg transition-all duration-150 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-150">
                      <img
                        src={p.screenshot}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-350 group-hover:scale-103"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-ark-black leading-snug">{p.name}</h3>
                      <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{p.description}</p>

                      <div className="mt-4">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Team</span>
                        <p className="text-xs text-ark-navy font-semibold">{p.team.join(", ")}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1">
                        {p.tech.map((t) => (
                          <span key={t} className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-650">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-black/5 mt-4">
                    <div className="mt-4 flex gap-2">
                      <a
                        href={p.demoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center rounded-full bg-ark-navy px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#22378c]"
                      >
                        ⚡ Live Demo
                      </a>
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center rounded-full border border-black/10 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-ark-navy transition-all hover:bg-zinc-100"
                      >
                        💻 GitHub
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-12 text-center">
                  <span className="text-4xl">💡</span>
                  <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No projects matched</h3>
                  <p className="mt-1 text-sm text-zinc-500">Try modifying your filter or search search tags.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOS.map((os) => (
                <div
                  key={os.id}
                  className="flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono text-base font-bold text-ark-navy select-all">{os.repository}</h3>
                      <div className="flex items-center gap-1 text-xs text-ark-gold font-bold">
                        <span>⭐</span>
                        <span>{os.stars.toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-zinc-555 leading-relaxed">{os.description}</p>

                    <div className="mt-4">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Key Contributors</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {os.contributors.map((contrib) => (
                          <span key={contrib} className="rounded bg-ark-navy/5 px-2 py-0.5 text-[10px] font-bold text-ark-navy">
                            {contrib}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-black/5 pt-4">
                    <div className="flex gap-2">
                      <a
                        href={os.documentation}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center rounded-full bg-ark-navy px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#22378c]"
                      >
                        📖 Docs Portal
                      </a>
                      <a
                        href={os.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center rounded-full border border-black/10 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-ark-navy transition-all hover:bg-zinc-100"
                      >
                        💻 Repository
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOS.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-12 text-center">
                  <span className="text-4xl">🌐</span>
                  <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No open-source repositories found</h3>
                  <p className="mt-1 text-sm text-zinc-500">Try modifying your query options.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submission CTA */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-ark-gold/30 bg-ark-gold/10 p-8 text-center">
          <span className="text-4xl">🚀</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-ark-black">Have something to showcase?</h2>
          <p className="mt-2 text-zinc-700 max-w-md mx-auto text-sm">
            Whether it's a student project built at a weekend hackathon or an open-source repository you've scaled to 1K+ stars, publish it here.
          </p>
          <a
            href="/submit-story"
            className="mt-6 inline-block rounded-full bg-ark-navy px-6 py-3 text-xs font-bold text-white transition-all hover:scale-105 hover:bg-[#22378c] shadow-sm"
          >
            Submit Project / Repository
          </a>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
