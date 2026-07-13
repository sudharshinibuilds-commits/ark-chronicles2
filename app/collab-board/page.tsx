"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function CollabBoardPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [posts, setPosts] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);

  // New post form fields
  const [newTitle, setNewTitle] = useState("");
  const [newRole, setNewRole] = useState("Looking for Co-founder");
  const [newCollege, setNewCollege] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const roles = [
    "All",
    "Looking for Co-founder",
    "Looking for Designer",
    "Looking for Research Partner",
    "Looking for Developer",
  ];

  const defaultPosts = [
    {
      id: "post-1",
      title: "Building climate-first packaging sheets",
      role: "Looking for Co-founder",
      description: "Need a business co-founder from IIT Bombay to help validate product margins and negotiate supply chain contracts with logistics centers.",
      author: "Ananya Sen",
      college: "IIT Bombay",
      date: "2 hours ago",
    },
    {
      id: "post-2",
      title: "Autotuning Edge AI Agent frameworks",
      role: "Looking for Developer",
      description: "Seeking a React/TypeScript specialist to build out drag-and-drop workflow canvases for connecting multi-agent cognitive steps.",
      author: "Siddharth Verma",
      college: "KLH Hyderabad",
      date: "1 day ago",
    },
    {
      id: "post-3",
      title: "Deep Tech Biomaterials paper review",
      role: "Looking for Research Partner",
      description: "Co-authoring a study on degradation metrics. Looking for a bioinformatics major to help parse degradation coefficient data sets.",
      author: "Dr. Srinivas Rao",
      college: "BITS Pilani",
      date: "3 days ago",
    },
  ];

  // Load posts
  useEffect(() => {
    const saved = localStorage.getItem("ark_collab_posts");
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(defaultPosts);
    }
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      role: newRole,
      description: newDescription,
      author: newAuthor || "Anonymous Builder",
      college: newCollege || "Ecosystem Partner",
      date: "Just now",
    };
    const next = [newPost, ...posts];
    setPosts(next);
    localStorage.setItem("ark_collab_posts", JSON.stringify(next));

    // Clear form
    setNewTitle("");
    setNewDescription("");
    setNewAuthor("");
    setNewCollege("");
    setShowPostModal(false);
  };

  const filteredPosts = posts.filter((p) => {
    return selectedRole === "All" || p.role === selectedRole;
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-5xl font-bold text-ark-black">Collaboration Board</h1>
            <p className="mt-2 text-xl text-ark-navy">Find Co-founders, Developers, Designers, and Researchers</p>
          </div>

          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            className="rounded-full bg-ark-navy px-6 py-3.5 text-xs font-bold text-white transition-all hover:scale-105 hover:bg-[#22378c]"
          >
            Post Collab Request +
          </button>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                selectedRole === role
                  ? "bg-ark-navy text-white shadow-md"
                  : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Collab Feed */}
        <div className="mt-10 space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl border border-black/8 bg-white p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3">
                <span className="inline-flex rounded-full bg-ark-gold/15 border border-ark-gold/30 px-3.5 py-1 text-[10px] font-bold text-ark-navy">
                  {post.role}
                </span>
                <span className="text-xs text-zinc-400 font-semibold">{post.date}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ark-black leading-snug">{post.title}</h3>
              <p className="mt-2 text-sm text-zinc-550 leading-relaxed">{post.description}</p>

              <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                <div className="text-xs text-zinc-500 font-semibold">
                  Posted by <span className="font-bold text-ark-navy">{post.author}</span> • {post.college}
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Connecting you to ${post.author} via ecosystem messaging...`)}
                  className="rounded-full bg-ark-navy px-4 py-2 text-xs font-bold text-white hover:bg-[#22378c]"
                >
                  Message Builder &rarr;
                </button>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-black/10 p-12 text-center">
              <span className="text-4xl">🤝</span>
              <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No collaboration posts found</h3>
              <p className="mt-1 text-sm text-zinc-500">Be the first to post a collaboration request!</p>
            </div>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-black/5"
            >
              <h3 className="font-display text-xl font-bold text-ark-black border-b border-black/5 pb-2">
                New Collaboration Post
              </h3>
              <form onSubmit={handleCreatePost} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Passionate Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Building localized LLM search agent"
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-ark-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">What are you looking for?</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm bg-white outline-none focus:border-ark-navy"
                  >
                    <option value="Looking for Co-founder">Looking for Co-founder</option>
                    <option value="Looking for Designer">Looking for Designer</option>
                    <option value="Looking for Research Partner">Looking for Research Partner</option>
                    <option value="Looking for Developer">Looking for Developer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Siddharth Verma"
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-ark-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">University / College</label>
                  <input
                    type="text"
                    required
                    value={newCollege}
                    onChange={(e) => setNewCollege(e.target.value)}
                    placeholder="e.g. KLH Hyderabad"
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-ark-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Detail Requirements</label>
                  <textarea
                    rows={4}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe the stack, constraints, milestones, and how to reach you..."
                    className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-ark-navy"
                  />
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-ark-gold py-3 text-xs font-bold text-ark-navy hover:bg-[#e1b54b]"
                  >
                    Publish Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="rounded-full bg-zinc-100 px-4 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
