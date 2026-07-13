"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { BookOpen, Search, Download, Eye, ExternalLink } from "lucide-react";

export default function MagazinesPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [magazinesList, setMagazinesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Flipbook modal state
  const [activeMagazine, setActiveMagazine] = useState<any | null>(null);
  const [flipPage, setFlipPage] = useState(0);

  const categories = ["All", "Startup", "Tech", "Research", "Special Edition"];

  useEffect(() => {
    async function loadMagazines() {
      try {
        const res = await fetch("/api/magazines");
        if (res.ok) {
          const data = await res.json();
          setMagazinesList(data || []);
        }
      } catch (err) {
        console.error("Failed to load magazines", err);
      } finally {
        setLoading(false);
      }
    }
    loadMagazines();
  }, []);

  const displayMagazines = magazinesList;

  const filteredMagazines = displayMagazines.filter((mag) => {
    const titleMatch = (mag.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (mag.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "All" || (mag.category || "Special Edition") === selectedCategory;
    return (titleMatch || descMatch) && matchCategory;
  });

  // Simulated pages for the Flipbook view
  const mockFlipbookPages = [
    {
      title: "Cover Page",
      content: (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-ark-navy to-[#2a3f8a] p-8 text-center text-white">
          <div className="font-display text-2xl font-black text-ark-gold tracking-[0.2em] mb-2">A.R.K. CHRONICLES</div>
          <div className="h-0.5 w-16 bg-white/20 my-4" />
          <h2 className="font-display text-2xl font-extrabold leading-tight text-white px-4">
            Shaping the Next Wave of Indian Tech Abundance
          </h2>
          <p className="mt-8 text-sm text-zinc-300">Edition 12 • Special Compilation</p>
          <p className="mt-2 text-xs text-ark-gold/70 uppercase tracking-widest font-semibold">Architects of Rising Knowledge</p>
        </div>
      ),
    },
    {
      title: "Table of Contents",
      content: (
        <div className="h-full bg-white p-8 text-ark-black">
          <h3 className="font-display text-xl font-bold border-b border-black/10 pb-2">Contents</h3>
          <ul className="mt-6 space-y-4 text-sm font-medium">
            <li className="flex justify-between">
              <span>01. The Second-Time Founder Advantage</span>
              <span className="font-bold text-ark-navy">Page 4</span>
            </li>
            <li className="flex justify-between">
              <span>02. Deep Tech Frontiers: Climate and Biomaterials</span>
              <span className="font-bold text-ark-navy">Page 12</span>
            </li>
            <li className="flex justify-between">
              <span>03. AI Agents: Cognitive Architectures for Enterprise</span>
              <span className="font-bold text-ark-navy">Page 19</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Editorial Briefing",
      content: (
        <div className="h-full bg-[#faf9f6] p-8 text-zinc-700 leading-relaxed text-xs">
          <span className="font-bold text-ark-navy uppercase tracking-wider block mb-2">Editor's Note</span>
          <h4 className="font-display text-base font-bold text-ark-black mb-4">The Discipline of Conviction</h4>
          <p className="mb-3">
            In this issue, we explore the quiet revolution taking place outside the public glare. While valuations reset and spreadsheets dominate investor boards, builders across colleges and tech parks in Bengaluru, Hyderabad, and Pune are writing a different story.
          </p>
          <p>
            Join us as we explore the builders, the scientists, and the student operators building with compound trust.
          </p>
        </div>
      ),
    }
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
          "MAGAZINES: Full archive of periodic newsletters and compilations accessible online.",
          "FLIPBOOK READER: Interact with fully digital magazine layouts natively in sandbox.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">Magazine Archives</h1>
            <p className="mt-2 text-xl text-ark-navy">Curated Quarterly &amp; Special Compilations</p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search by issue title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white pl-5 pr-10 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
            />
            <Search className="absolute right-4 top-3.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Categories selector */}
        <div className="mt-8 border-b border-black/5 pb-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-3">Filter by Topic</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                  selectedCategory === cat
                    ? "bg-[#1B2A6B] text-white shadow-md"
                    : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#1B2A6B] border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase">Syncing Magazine Nodes...</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMagazines.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-150">
                  <img
                    src={item.cover_url || `https://picsum.photos/seed/magcover-${item.id}/400/600`}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-ark-gold text-ark-navy text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                      {item.issue_no || "Edition 12"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-black text-ark-black leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-black/5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFlipPage(0);
                        setActiveMagazine(item);
                      }}
                      className="flex-1 rounded-full bg-[#1B2A6B] text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Eye className="h-3.5 w-3.5" /> Read Issue
                    </button>
                    {item.pdf_url && (
                      <a
                        href={item.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-zinc-100 p-2.5 hover:bg-zinc-200 transition-colors flex items-center justify-center border border-black/5"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4 text-zinc-700" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {displayMagazines.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm text-zinc-500 font-medium">
                No magazines published yet.
              </div>
            ) : filteredMagazines.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm">
                <span className="text-4xl">📚</span>
                <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No issues found</h3>
                <p className="mt-1 text-sm text-zinc-500">Try adjusting your filters or search query.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Dynamic Flipbook Modal */}
      <AnimatePresence>
        {activeMagazine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-zinc-100 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ark-navy">
                    {activeMagazine.issue_no || "Special Compiled Pass"}
                  </span>
                  <h3 className="font-display text-md font-bold text-ark-black mt-0.5">{activeMagazine.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMagazine(null)}
                  className="rounded-full bg-zinc-200 p-2 text-zinc-700 hover:bg-zinc-300 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Flipbook Pages Area */}
              <div className="relative flex min-h-[420px] items-center justify-center p-6 bg-[#eae8e3]">
                {/* Book Layout */}
                <div className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2 border border-black/10">
                  {/* Left Page */}
                  <div className="relative border-r border-black/5 h-[400px]">
                    <div className="absolute top-2 left-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      {mockFlipbookPages[flipPage]?.title}
                    </div>
                    <div className="h-full pt-6">
                      {mockFlipbookPages[flipPage]?.content}
                    </div>
                    <div className="absolute bottom-2 left-4 text-[10px] text-zinc-400 font-bold">
                      Page {flipPage + 1}
                    </div>
                  </div>

                  {/* Right Page */}
                  <div className="relative hidden md:block h-[400px] bg-white">
                    {flipPage + 1 < mockFlipbookPages.length ? (
                      <>
                        <div className="absolute top-2 right-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                          {mockFlipbookPages[flipPage + 1]?.title}
                        </div>
                        <div className="h-full pt-6">
                          {mockFlipbookPages[flipPage + 1]?.content}
                        </div>
                        <div className="absolute bottom-2 right-4 text-[10px] text-zinc-400 font-bold">
                          Page {flipPage + 2}
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-50 text-zinc-300 font-display text-sm font-bold">
                        End of Issue
                      </div>
                    )}
                  </div>
                </div>

                {/* Left Arrow Button */}
                <button
                  type="button"
                  disabled={flipPage === 0}
                  onClick={() => setFlipPage((prev) => Math.max(0, prev - 2))}
                  className="absolute left-2 rounded-full bg-white p-3 shadow-lg hover:bg-zinc-50 disabled:opacity-40 font-bold"
                >
                  ◀
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  disabled={flipPage >= mockFlipbookPages.length - 2}
                  onClick={() => setFlipPage((prev) => Math.min(mockFlipbookPages.length - 2, prev + 2))}
                  className="absolute right-2 rounded-full bg-white p-3 shadow-lg hover:bg-zinc-50 disabled:opacity-40 font-bold"
                >
                  ▶
                </button>
              </div>

              {/* Progress and controls footer */}
              <div className="flex items-center justify-between border-t border-black/5 bg-white px-6 py-4">
                <span className="text-xs font-semibold text-zinc-500">
                  Reading Progress: {Math.round(((flipPage + 2) / mockFlipbookPages.length) * 100)}%
                </span>
                <div className="flex gap-2">
                  <a
                    href={activeMagazine.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-ark-navy px-5 py-2 text-xs font-bold text-white hover:bg-[#22378c] flex items-center gap-1"
                  >
                    Download Issue <ExternalLink className="h-3 w-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveMagazine(null)}
                    className="rounded-full bg-zinc-200 px-5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-300"
                  >
                    Close Reader
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
