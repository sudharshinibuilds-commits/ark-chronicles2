"use client";

import { useState, useEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function CommunityPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [activeBoard, setActiveBoard] = useState("General");
  const [discussionComments, setDiscussionComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");

  const boards = ["General", "Tech & Dev", "Research Lab", "Founder Room"];

  const defaultComments = [
    {
      id: "c-1",
      board: "General",
      user: "Siddharth Verma",
      role: "AI Architect",
      text: "Who is heading down to Bengaluru for the Innovation Summit in August? Let's compile a carpool or hotel split list.",
      time: "2 hours ago",
    },
    {
      id: "c-2",
      board: "Tech & Dev",
      user: "Neha Patil",
      role: "Product Manager",
      text: "We just rolled out the closed beta for AutoAgent canvas. We need 10 developers to test complex workflow definitions. Drop a line!",
      time: "4 hours ago",
    },
    {
      id: "c-3",
      board: "Research Lab",
      user: "Dr. Srinivas Rao",
      role: "AI Advisor",
      text: "The new IEEE deadline for edge agent papers is coming up. Ensure all degradation matrix telemetry equations are fully verified.",
      time: "Yesterday",
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ark_community_comments");
    if (saved) {
      setDiscussionComments(JSON.parse(saved));
    } else {
      setDiscussionComments(defaultComments);
    }
  }, []);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      board: activeBoard,
      user: "Anonymous Builder",
      role: "Ecosystem Builder",
      text: commentInput,
      time: "Just now",
    };

    const next = [newComment, ...discussionComments];
    setDiscussionComments(next);
    localStorage.setItem("ark_community_comments", JSON.stringify(next));
    setCommentInput("");
  };

  const filteredComments = discussionComments.filter((c) => c.board === activeBoard);

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
          <h1 className="font-display text-5xl font-bold text-ark-black">Community Hub</h1>
          <p className="mt-2 text-xl text-ark-navy">Interact, Discuss and Stay Synced</p>
        </div>

        {/* Discord CTA Block */}
        <div className="mt-8 rounded-3xl border border-[#5865F2]/30 bg-[#5865F2]/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🧑💻</span>
            <div>
              <h2 className="font-display text-2xl font-bold text-ark-black">Join our Discord Community</h2>
              <p className="text-sm text-zinc-600 mt-1 max-w-lg">
                Connect directly with 5,000+ builders, student founders, researchers, and campus ambassadors. Ask questions, host panels, and find co-founders.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert("Redirecting to Discord invite: discord.gg/ark-chronicles (mock)...")}
            className="rounded-full bg-[#5865F2] hover:bg-[#4752C4] px-6 py-3 text-xs font-bold text-white transition-all shadow-md shrink-0"
          >
            Connect Discord Account
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mt-8">
          {/* Discussion board */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              {/* Board headers */}
              <div className="flex border-b border-black/5 pb-3">
                {boards.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setActiveBoard(b)}
                    className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeBoard === b
                        ? "border-ark-navy text-ark-navy"
                        : "border-transparent text-zinc-400 hover:text-zinc-650"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Input for comments */}
              <form onSubmit={handlePostComment} className="mt-6 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Write a comment in #${activeBoard} board...`}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-xs outline-none focus:border-ark-navy focus:ring-1 focus:ring-ark-navy"
                />
                <button
                  type="submit"
                  className="rounded-full bg-ark-navy px-4 py-2.5 text-xs font-bold text-white hover:bg-[#22378c]"
                >
                  Send
                </button>
              </form>

              {/* Render board comments */}
              <div className="mt-6 space-y-4">
                {filteredComments.map((c) => (
                  <div key={c.id} className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-ark-navy">{c.user}</span>
                        <span className="text-[10px] text-zinc-400 font-semibold ml-2">({c.role})</span>
                      </div>
                      <span className="text-[10px] text-zinc-450">{c.time}</span>
                    </div>
                    <p className="text-xs text-zinc-650 mt-2 leading-relaxed">{c.text}</p>
                  </div>
                ))}
                {filteredComments.length === 0 && (
                  <div className="text-center py-10 text-xs text-zinc-400 italic">
                    No comments in this channel yet. Write your thoughts above!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Announcements board */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              <h3 className="font-display text-lg font-bold text-ark-black border-b border-black/5 pb-2">Announcements</h3>
              <div className="mt-4 space-y-4">
                <div className="p-3 bg-ark-gold/5 rounded-xl border border-ark-gold/20">
                  <span className="text-[9px] font-bold text-ark-gold uppercase tracking-wider">July 11, 2026</span>
                  <h4 className="text-xs font-bold text-ark-navy mt-1">Innovation Summit Registration Open</h4>
                  <p className="text-[10px] text-zinc-600 mt-1 leading-normal">
                    Head to the Events tab to claim your Summit VIP or General pass. Tickets are free but seating is limited.
                  </p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-black/5">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-semibold">July 09, 2026</span>
                  <h4 className="text-xs font-bold text-ark-navy mt-1">Weekly Placements Released</h4>
                  <p className="text-[10px] text-zinc-600 mt-1 leading-normal">
                    Check out the Opportunities board. Internships at Flipkart and Razorpay have active closing counters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
