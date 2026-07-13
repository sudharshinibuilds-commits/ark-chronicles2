"use client";

import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function PodcastPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [playingEpisode, setPlayingEpisode] = useState<any | null>(null);

  const categories = ["All", "Founder Interviews", "Research Conversations", "AI Discussions"];

  const mockEpisodes = [
    {
      id: "pod-1",
      title: "EP 14: Inside PulseForge AI's Seed Strategy",
      category: "Founder Interviews",
      host: "Naina Kapoor",
      duration: "42 mins",
      date: "July 08, 2026",
      thumbnail: "https://picsum.photos/seed/pod1/300/300",
      description: "Aarav Bedi explains the metrics and valuation models used to close their $2M seed round, and the realities of pitching enterprise AI to conservative buyers.",
    },
    {
      id: "pod-2",
      title: "EP 13: Biomaterials and Circular Packaging Futures",
      category: "Research Conversations",
      host: "Dr. Amit Roy",
      duration: "35 mins",
      date: "July 02, 2026",
      thumbnail: "https://picsum.photos/seed/pod2/300/300",
      description: "Ananya Sen discusses composite bio-degradable sheets and the computational equations tracking degradation curves under high humidity environments.",
    },
    {
      id: "pod-3",
      title: "EP 12: Cognitive Routing with Agentic Swarms",
      category: "AI Discussions",
      host: "Siddharth Verma",
      duration: "48 mins",
      date: "June 25, 2026",
      thumbnail: "https://picsum.photos/seed/pod3/300/300",
      description: "Siddharth breaks down system prompts, socket orchestrators, and planning layers that coordinate edge developers automating routine database pipelines.",
    },
  ];

  const filteredEpisodes = mockEpisodes.filter((ep) => {
    return selectedFilter === "All" || ep.category === selectedFilter;
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
          <h1 className="font-display text-5xl font-bold text-ark-black">Podcast Vault</h1>
          <p className="mt-2 text-xl text-ark-navy">Listen to Founders, Researchers & Innovators</p>
        </div>

        {/* Categories selector */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                selectedFilter === cat
                  ? "bg-ark-navy text-white shadow-md"
                  : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Podcast List */}
        <div className="mt-10 space-y-6">
          {filteredEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="rounded-3xl border border-black/8 bg-white p-6 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-center"
            >
              <img
                src={ep.thumbnail}
                alt={ep.title}
                className="h-32 w-32 rounded-2xl object-cover ring-2 ring-ark-gold/25"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex rounded-full bg-ark-navy px-3 py-1 font-bold text-white uppercase tracking-wider">
                    {ep.category}
                  </span>
                  <span className="text-zinc-400 font-semibold">{ep.date} • {ep.duration}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-ark-black leading-snug">{ep.title}</h3>
                <p className="text-xs text-zinc-500 font-semibold">Hosted by {ep.host}</p>
                <p className="text-sm text-zinc-550 leading-relaxed">{ep.description}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPlayingEpisode(ep);
                      alert(`Playing Podcast Episode: "${ep.title}". Loaded in main player.`);
                    }}
                    className="rounded-full bg-ark-gold px-5 py-2.5 text-xs font-bold text-ark-navy hover:bg-[#e1b54b] shadow-sm flex items-center gap-1.5"
                  >
                    <span>▶</span> Listen Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Audio Playbar if active */}
      {playingEpisode && (
        <div className="fixed bottom-4 right-4 z-40 w-full max-w-sm rounded-3xl bg-zinc-900 text-white p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-4">
          <img src={playingEpisode.thumbnail} alt="" className="h-12 w-12 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold truncate">{playingEpisode.title}</h4>
            <p className="text-[10px] text-zinc-400 truncate">Host: {playingEpisode.host}</p>
            <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-ark-gold w-[35%]" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPlayingEpisode(null)}
            className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-xs font-bold"
          >
            ⏹
          </button>
        </div>
      )}

      <Footer />
      <AudioPlayer />
    </main>
  );
}
