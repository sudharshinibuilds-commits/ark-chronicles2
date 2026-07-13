"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AudioPlayer from "../../components/AudioPlayer";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LiveTicker from "../../components/LiveTicker";
import { supabase } from "../../lib/supabase";
import { Bookmark, Share2, Award, Calendar, Clock, ChevronLeft } from "lucide-react";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const fallbackArticles: Record<string, any> = {
    "chronicle-1": {
      id: "chronicle-1",
      title: "Building Lightweight AI Copilots for Industrial Teams",
      author_name: "Aarav Bedi",
      category: "Founder Stories",
      excerpt: "Inside the journey of PulseForge AI, deploying LLM agents in compliance-heavy steel factories.",
      tags: ["SaaS", "Execution", "AI Agents"],
      image_url: "https://picsum.photos/seed/ind-ai/1200/600",
      content: "The common narrative around second-time founders focuses on speed—the ability to move faster, raise quicker, and ship sooner. But the real advantage lies elsewhere. After interviewing over 50 second-time founders across India's startup ecosystem, a pattern emerges: their edge isn't velocity. It's decision quality. They make better choices because they've seen the consequences of bad ones.\n\nFirst-time founders often optimize for the wrong metrics. They chase vanity metrics, over-engineer products, and hire for roles that don't exist yet. Second-time founders skip these mistakes not because they're smarter, but because they've paid the tuition.",
      published_at: "2026-07-10T12:00:00Z"
    },
    "chronicle-2": {
      id: "chronicle-2",
      title: "Organic Polymer Sheets and the Circular Economy",
      author_name: "Ananya Sen",
      category: "Innovation Reports",
      excerpt: "How IIT Bombay researchers are using agricultural waste to synthesize bio-degradable shipping wraps.",
      tags: ["ClimateTech", "DeepTech", "Capital"],
      image_url: "https://picsum.photos/seed/organ/1200/600",
      content: "What happens when product validation falls behind customer signups? We look at scaling friction in growing deep tech startups. Operating velocity is a function of clear delegation and structured rituals. Yet when scale hits, the first casualty is almost always internal communication cadence.\n\nTeams that sustain 30%+ month-over-month growth do not work longer hours. They design rigid operational cycles: weekly syncs, daily tickers, and bi-weekly product retrospectives that align tech goals directly to active sales pipelines.",
      published_at: "2026-07-05T12:00:00Z"
    },
    "chronicle-3": {
      id: "chronicle-3",
      title: "Export Finance as a Founder-Friendly Operating System",
      author_name: "Kabir Sethi",
      category: "Editorials",
      excerpt: "Exploring the compliance rails and fintech pipelines helping emerging builders secure bridge loans.",
      tags: ["Capital", "SaaS"],
      image_url: "https://picsum.photos/seed/fin/1200/600",
      content: "In our editorial this month, we look past the aggregate capital raises and map the value of patient capital stories in specialist ecosystems. Disciplined storytelling is not about creating narrative hype. It is about laying out the verifiable steps your team has taken and proving that capital efficiency is a design feature, not an afterthought.\n\nSpecialist VCs are leaning in on startups that can double down on unit margins. Moving forward, the check size will be directly linked to how quickly a team can build a repeatable product loop without burning cash.",
      published_at: "2026-06-28T12:00:00Z"
    }
  };

  useEffect(() => {
    if (!id) return;

    async function fetchArticle() {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          const res = await fetch(`/api/articles/${id}`);
          if (res.ok) {
            const data = await res.json();
            setArticle(data);
            setLoading(false);

            // Register read activity in background
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user) {
                fetch("/app/api/activity/read", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: session.user.id, entityId: id })
                }).catch(err => console.log(err));
              }
            });
            return;
          }
        }

        // Check fallback / mock databases
        if (fallbackArticles[id]) {
          setArticle(fallbackArticles[id]);
        } else {
          setArticle(fallbackArticles["chronicle-1"]);
        }
      } catch (err) {
        console.error("Failed to load specific article", err);
        setArticle(fallbackArticles["chronicle-1"]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ark-navy border-t-transparent" />
          <p className="font-display font-medium text-ark-navy animate-pulse">Syncing Editorial Node...</p>
        </div>
      </div>
    );
  }

  const formatPublishDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
          "CHRONICLES: Deep-dive startup analysis, regional tech briefs, and collegiate columns.",
          "INTELLIGENCE REPORT: Track active builder indices across ecosystem nodes.",
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/8 bg-white p-4 shadow-lg mb-8 flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ark-black transition-all hover:scale-105 hover:bg-zinc-50 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Audio Briefing:</span>
            <AudioPlayer />
          </div>
        </div>

        <article className="space-y-6">
          <div>
            <span className="inline-flex rounded-full bg-ark-gold px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ark-navy shadow-md border border-ark-gold/20">
              {article.category || "Ecosystem Chronicles"}
            </span>
          </div>

          <h1 className="font-display text-4xl font-black text-ark-black sm:text-5xl leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-black/5 pb-4">
            <span className="text-ark-navy">By {article.author_name || "Editorial desk"}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-zinc-400" /> 6 min read</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-zinc-400" /> {formatPublishDate(article.published_at || article.created_at || "2026-07-12")}</span>
          </div>

          {/* Featured Image */}
          <div className="overflow-hidden rounded-3xl border border-black/10 shadow-lg aspect-video w-full">
            <img
              src={article.image_url || `https://picsum.photos/seed/${article.id}/1200/600`}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Article Social share & bookmark actions */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Article link copied to clipboard!");
              }}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-bold text-ark-black transition-all hover:scale-105"
            >
              <Share2 className="h-3.5 w-3.5 text-zinc-650" /> Copy Share Link
            </button>
            <button
              type="button"
              onClick={() => {
                setBookmarked(!bookmarked);
                alert(bookmarked ? "Removed from bookmarks" : "Saved in your bookmark ledger!");
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all hover:scale-105 ${
                bookmarked
                  ? "bg-ark-gold text-ark-navy border border-ark-gold/20 shadow-md"
                  : "bg-white border border-black/10 text-ark-black"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5 shrink-0" />
              {bookmarked ? "Bookmarked ✓" : "Bookmark Pass"}
            </button>
          </div>

          <div className="prose prose-lg max-w-none font-sans leading-relaxed text-zinc-700 text-sm md:text-base whitespace-pre-wrap pt-4">
            {article.content}
          </div>
        </article>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
