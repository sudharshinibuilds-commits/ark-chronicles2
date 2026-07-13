"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function InnovationMapPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [activeNode, setActiveNode] = useState<any | null>(null);

  const mapNodes = [
    {
      id: "bengaluru",
      name: "Bengaluru Cluster",
      x: "48%", // Positioning on SVG grid coordinates
      y: "75%",
      stats: { builders: 4850, startups: 120, researchers: 320, hubs: 8, colleges: 12 },
      keyStartups: ["PulseForge AI", "Zyra Bio", "Northstar Mobility"],
      hubsList: ["ARK Innovation Space", "NSRCEL", "Co-Build Bengaluru"],
    },
    {
      id: "hyderabad",
      name: "Hyderabad Node",
      x: "53%",
      y: "63%",
      stats: { builders: 2420, startups: 65, researchers: 180, hubs: 4, colleges: 8 },
      keyStartups: ["AutoAgent Labs", "LedgerMint"],
      hubsList: ["T-Hub Hub", "KLH Incubator", "C-Web Space"],
    },
    {
      id: "mumbai",
      name: "Mumbai Corridor",
      x: "38%",
      y: "56%",
      stats: { builders: 3100, startups: 82, researchers: 210, hubs: 5, colleges: 9 },
      keyStartups: ["BioWrap Solutions", "Kindred Health"],
      hubsList: ["SINE IITB", "Venture Center Mumbai"],
    },
    {
      id: "delhi",
      name: "Delhi-NCR Region",
      x: "46%",
      y: "32%",
      stats: { builders: 2850, startups: 78, researchers: 195, hubs: 6, colleges: 11 },
      keyStartups: ["Northstar Mobility Delhi", "EcoGrid Hub"],
      hubsList: ["FITT IITD", "NSUT Innovate"],
    },
    {
      id: "pune",
      name: "Pune Hub",
      x: "41%",
      y: "60%",
      stats: { builders: 1850, startups: 42, researchers: 130, hubs: 3, colleges: 6 },
      keyStartups: ["Custom Motors", "CleanEnergy Bio"],
      hubsList: ["Venture Center Pune", "Pune Tech Park"],
    },
  ];

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
          <h1 className="font-display text-5xl font-bold text-ark-black">Innovation Map of India</h1>
          <p className="mt-2 text-xl text-ark-navy">Interactive Clusters of India's Building Momentum</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 mt-10">
          {/* SVG Map Display */}
          <div className="lg:col-span-3 rounded-3xl border border-black/8 bg-white p-6 shadow-lg flex items-center justify-center relative min-h-[550px]">
            {/* Map Canvas Background */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1b2a6b_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Stylized Map Container */}
            <div className="relative w-full max-w-md h-full min-h-[480px]">
              {/* Map Outline Mock SVG */}
              <svg viewBox="0 0 400 500" className="w-full h-full stroke-zinc-200 fill-zinc-50" strokeWidth="1.5">
                {/* Simplified India Borders Path */}
                <path d="M 170 50 L 190 20 L 220 50 L 210 100 L 250 140 L 290 150 L 320 180 L 290 200 L 270 250 L 230 270 L 240 310 L 220 370 L 200 450 L 180 480 L 170 450 L 180 390 L 170 330 L 120 300 L 110 250 L 80 230 L 70 190 L 110 180 L 130 140 Z" />
              </svg>

              {/* Render Map Nodes */}
              {mapNodes.map((node) => {
                const isActive = activeNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNode(node)}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: node.x, top: node.y }}
                  >
                    {/* Ring animation */}
                    <span className="absolute inline-flex h-6 w-6 -left-3 -top-3 animate-ping rounded-full bg-ark-gold opacity-40" />
                    <div
                      className={`h-4 w-4 rounded-full shadow-md transition-all border-2 border-white ${
                        isActive ? "bg-ark-gold scale-125" : "bg-ark-navy group-hover:bg-ark-gold group-hover:scale-115"
                      }`}
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node details side drawer */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="rounded-3xl border border-black/8 bg-white p-8 shadow-lg min-h-[420px] flex flex-col justify-between">
              {activeNode ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={activeNode.id}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ark-gold">Cluster Profile</span>
                    <h2 className="font-display text-3xl font-black text-ark-black mt-1">{activeNode.name}</h2>
                  </div>

                  {/* Core Statistics */}
                  <div className="grid grid-cols-3 gap-2 bg-[#faf9f6] p-4 rounded-2xl border border-black/5">
                    <div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">Builders</div>
                      <div className="font-display text-lg font-black text-ark-navy mt-0.5">{activeNode.stats.builders}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">Startups</div>
                      <div className="font-display text-lg font-black text-ark-gold mt-0.5">{activeNode.stats.startups}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">Researchers</div>
                      <div className="font-display text-lg font-black text-ark-navy mt-0.5">{activeNode.stats.researchers}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Key Spinoff Startups</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeNode.keyStartups.map((st: string) => (
                        <span key={st} className="rounded bg-ark-gold/10 px-2.5 py-1 text-xs font-bold text-ark-navy border border-ark-gold/20">
                          🚀 {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Active Innovation Hubs</h4>
                    <ul className="list-disc pl-5 text-sm text-zinc-650 space-y-1">
                      {activeNode.hubsList.map((hub: string) => (
                        <li key={hub}>{hub}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-16 text-zinc-400">
                  <span className="text-5xl">🗺️</span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ark-black">Select an Innovation Node</h3>
                  <p className="mt-1 text-sm text-zinc-550 max-w-xs">
                    Click on any glowing city node in the map of India to view builder activity, active startups, research databases, and innovation hubs.
                  </p>
                </div>
              )}

              {activeNode && (
                <button
                  type="button"
                  onClick={() => alert(`Redirecting to complete directory search filtered by ${activeNode.name}...`)}
                  className="mt-8 w-full rounded-full bg-ark-navy py-3 text-xs font-bold text-white transition-all hover:bg-[#22378c]"
                >
                  Open Cluster Directory Roster
                </button>
              )}
            </div>

            {/* General Info Box */}
            <div className="mt-6 rounded-3xl border border-black/8 bg-[#1B2A6B] p-6 text-white shadow-md">
              <h3 className="font-display text-lg font-bold">Innovation Corridors</h3>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                India's builder economy maps along high density hubs. The A.R.K. Map logs nodes where students, developers, and micro-VC funds intersect.
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
