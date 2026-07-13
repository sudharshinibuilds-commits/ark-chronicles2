"use client";

import { useState, useEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";
import { BookOpen, Search, Filter } from "lucide-react";

export default function ChroniclesPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const categories = [
    "All",
    "Feature Stories",
    "Founder Stories",
    "Research Stories",
    "AI Articles",
    "Innovation Reports",
    "Editorials",
  ];

  const tags = ["All", "SaaS", "ClimateTech", "DeepTech", "AI Agents", "Capital", "Execution"];

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          setArticles(data || []);
        }
      } catch (err) {
        console.error("Failed to load articles", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  const displayArticles = articles;

  const filteredChronicles = displayArticles.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesTag = selectedTag === "All" || (c.tags || []).includes(selectedTag);
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.author_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
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
          "CHRONICLES: Deep-dive startup analysis, regional tech briefs, and collegiate columns.",
          "INTELLIGENCE REPORT: Track active builder indices across ecosystem nodes.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">The Chronicles</h1>
            <p className="mt-2 text-xl text-[#1B2A6B]">Deep Stories &amp; Analysis</p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white pl-5 pr-10 py-2.5 text-sm outline-none focus:border-[#1B2A6B]"
            />
            <Search className="absolute right-4 top-3.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Categories selector */}
        <div className="mt-8 border-b border-black/5 pb-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-3">Filter by Category</span>
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

        {/* Tags filter */}
        <div className="mt-4 border-b border-black/5 pb-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 block mb-3">Filter by Tag</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150 ${
                  selectedTag === tag
                    ? "bg-ark-gold text-ark-navy shadow-sm"
                    : "border border-black/5 bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-black/5">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
            <p className="text-xs text-zinc-500 mt-3 font-bold animate-pulse uppercase">Syncing Chronicles Feed...</p>
          </div>
        ) : (
          /* Articles list grid */
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChronicles.map((item) => (
              <a
                key={item.id}
                href={`/article/${item.id}`}
                className="group block overflow-hidden rounded-3xl border border-black/8 bg-white shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image_url || `https://picsum.photos/seed/${item.id}/600/400`}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex rounded-full bg-ark-gold px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ark-navy shadow-sm border border-ark-gold/20">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-black text-ark-black leading-snug group-hover:text-[#1B2A6B]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                      {item.excerpt || "Ecosystem article contribution."}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {item.tags.map((t: string) => (
                          <span key={t} className="text-[10px] font-bold text-ark-navy bg-ark-navy/5 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-zinc-400 font-bold uppercase">
                  <span>By {item.author_name || "Editorial"}</span>
                  <span className="flex items-center gap-1 text-[#1B2A6B]">
                    Read Article <BookOpen className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}

            {displayArticles.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm text-zinc-500 font-medium">
                No chronicles published yet — check back soon.
              </div>
            ) : filteredChronicles.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-12 text-center bg-white shadow-sm">
                <span className="text-4xl">🔍</span>
                <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No articles found</h3>
                <p className="mt-1 text-sm text-zinc-500">Try adjusting your filters or search query.</p>
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
