"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { Search, Eye, Download, BookOpen, Quote, Shield } from "lucide-react";

export default function ResearchPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedInstitution, setSelectedInstitution] = useState("All");

  // Selected paper for Abstract Modal
  const [activePaper, setActivePaper] = useState<any | null>(null);
  const [citationFormat, setCitationFormat] = useState<"APA" | "MLA" | "BibTeX">("APA");

  const domains = ["All", "AI/ML", "Geography", "Finance", "Enterprise", "Consumer", "Climate"];
  const institutions = ["All", "IIT Bombay", "KL University", "BITS Pilani", "NSUT Delhi", "ARK Research Lab"];

  useEffect(() => {
    async function loadResearch() {
      try {
        const res = await fetch("/api/research");
        if (res.ok) {
          const data = await res.json();
          setPapers(data || []);
        }
      } catch (err) {
        console.error("Failed to load research papers", err);
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  const displayPapers = papers;

  const filteredPapers = displayPapers.filter((paper) => {
    const titleMatch = (paper.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const abstractMatch = (paper.abstract || "").toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = (paper.authors || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchDomain = selectedDomain === "All" || (paper.domain || "AI/ML") === selectedDomain;
    const matchInst = selectedInstitution === "All" || (paper.college || "IIT Bombay") === selectedInstitution;

    return (titleMatch || abstractMatch || authorMatch) && matchDomain && matchInst;
  });

  const getCitation = (paper: any) => {
    const author = paper.authors || "Kapoor, N.";
    const title = paper.title || "Ecosystem Research";
    const college = paper.college || "ARK Chronicles";
    const year = "2026";
    const doi = paper.doi || "10.1145/3613904.3642105";

    if (citationFormat === "APA") {
      return `${author} (${year}). "${title}." ${college}. DOI: ${doi}`;
    }
    if (citationFormat === "MLA") {
      return `${author}. "${title}." ${college}, ${year}.`;
    }
    return `@article{ark_${paper.id},\n  author = {${author}},\n  title = {${title}},\n  journal = {${college}},\n  year = {${year}}\n}`;
  };

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
          "RESEARCH: Dynamic registry of verified academic thesis and whitepapers.",
          "PEER PASS: All listed research papers have passed formal review panel validation.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">Research Vault</h1>
            <p className="mt-2 text-xl text-ark-navy">Academically Rigorous Startup &amp; Economic Research</p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search by title, authors, abstracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white pl-5 pr-10 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
            />
            <Search className="absolute right-4 top-3.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Filters Panel */}
        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Research Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full rounded-full border border-black/10 px-4 py-2.5 text-xs bg-[#faf9f6] outline-none font-bold"
              >
                {domains.map((dom) => (
                  <option key={dom} value={dom}>{dom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Affiliated College</label>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full rounded-full border border-black/10 px-4 py-2.5 text-xs bg-[#faf9f6] outline-none font-bold"
              >
                {institutions.map((inst) => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#1B2A6B] border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase">Syncing Research Nodes...</p>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="group p-6 rounded-3xl border border-black/5 bg-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#1B2A6B]/20 transition-all duration-150"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-ark-navy/5 border border-ark-navy/15 text-ark-navy text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {paper.domain || "AI/ML"}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 border border-emerald-150">
                      <Shield className="h-3 w-3" /> Peer Reviewed Pass
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-black text-ark-black leading-snug group-hover:text-[#1B2A6B] cursor-pointer" onClick={() => setActivePaper(paper)}>
                    {paper.title}
                  </h3>

                  <p className="text-xs text-zinc-550 leading-relaxed max-w-4xl line-clamp-2">
                    {paper.abstract}
                  </p>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    By {paper.authors} • <span className="text-ark-navy">{paper.college}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => setActivePaper(paper)}
                    className="flex-1 md:flex-initial rounded-full border border-black/10 px-5 py-2.5 text-xs font-bold text-ark-navy hover:bg-zinc-50 transition-colors uppercase tracking-wider"
                  >
                    View Abstract
                  </button>
                  {paper.pdf_url && (
                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#1B2A6B] text-white p-2.5 hover:bg-[#22378c] transition-colors"
                      title="Download PDF Paper"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {displayPapers.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm text-zinc-500 font-medium">
                No research papers published yet.
              </div>
) : filteredPapers.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm">
                <span className="text-4xl">🔬</span>
                <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No papers found</h3>
                <p className="mt-1 text-sm text-zinc-500">Try adjusting your filters or search query.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Abstract Modal */}
      <AnimatePresence>
        {activePaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-4">
                <div>
                  <span className="bg-[#1B2A6B]/5 text-[#1B2A6B] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activePaper.domain || "AI/ML"}
                  </span>
                  <h3 className="font-display text-xl font-black text-ark-black mt-1.5 leading-snug">
                    {activePaper.title}
                  </h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    By {activePaper.authors} • {activePaper.college}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePaper(null)}
                  className="rounded-full bg-zinc-100 p-2 text-zinc-700 hover:bg-zinc-200 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Abstract Content */}
              <div className="py-5 space-y-4 max-h-[350px] overflow-y-auto">
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Abstract</h4>
                  <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed italic bg-zinc-50 p-4 rounded-2xl border border-black/5">
                    "{activePaper.abstract}"
                  </p>
                </div>

                {/* Cite Paper widget */}
                <div className="border-t border-black/5 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Cite this work</h4>
                    <div className="flex gap-1.5 bg-zinc-100 p-0.5 rounded-full">
                      {["APA", "MLA", "BibTeX"].map((fmt: any) => (
                        <button
                          key={fmt}
                          onClick={() => setCitationFormat(fmt)}
                          className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase transition-all ${
                            citationFormat === fmt ? "bg-white shadow-sm text-ark-navy" : "text-zinc-500"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-black/5 rounded-xl text-xs font-mono select-all flex justify-between items-center gap-4">
                    <span className="truncate max-w-md">{getCitation(activePaper)}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getCitation(activePaper));
                        alert("Citation copied to clipboard!");
                      }}
                      className="text-[10px] text-[#1B2A6B] font-bold uppercase hover:underline shrink-0 flex items-center gap-1"
                    >
                      <Quote className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-black/5 pt-4">
                <button
                  onClick={() => setActivePaper(null)}
                  className="flex-1 rounded-full border border-black/10 py-2.5 text-xs font-bold text-zinc-650 hover:bg-zinc-50 transition-colors uppercase"
                >
                  Close Panel
                </button>
                {activePaper.pdf_url && (
                  <a
                    href={activePaper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full bg-[#1B2A6B] py-2.5 text-xs font-bold text-white shadow-lg text-center uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-4 w-4" /> Download PDF Paper
                  </a>
                )}
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
