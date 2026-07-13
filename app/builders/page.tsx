"use client";

import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function BuildersPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");

  const skillsList = ["All", "AI/ML", "React", "Rust", "Solidity", "TypeScript", "Python", "UI/UX"];

  const mockBuilders = [
    {
      username: "siddharth-verma",
      name: "Siddharth Verma",
      role: "AI Agent Architect",
      college: "KLH Hyderabad",
      image: "https://picsum.photos/seed/sidd/150/150",
      skills: ["TypeScript", "Python", "AI/ML"],
      interests: ["Cognitive Architectures", "Multi-Agent Systems"],
      verified: true,
      streak: "18 days",
    },
    {
      username: "ananya-sen",
      name: "Ananya Sen",
      role: "Climate Tech Researcher",
      college: "IIT Bombay",
      image: "https://picsum.photos/seed/ananya/150/150",
      skills: ["Python", "UI/UX", "Biomaterials"],
      interests: ["Circular Economy", "Computational Biology"],
      verified: true,
      streak: "12 days",
    },
    {
      username: "vikram-malhotra",
      name: "Vikram Malhotra",
      role: "Solidity Developer",
      college: "BITS Pilani",
      image: "https://picsum.photos/seed/vikram/150/150",
      skills: ["Solidity", "Rust", "TypeScript"],
      interests: ["DeFi Protocols", "ZK-Rollups"],
      verified: false,
      streak: "24 days",
    },
    {
      username: "riya-sharma",
      name: "Riya Sharma",
      role: "Full Stack Engineer",
      college: "NSUT Delhi",
      image: "https://picsum.photos/seed/riya/150/150",
      skills: ["React", "TypeScript", "UI/UX"],
      interests: ["SaaS scaling", "Micro-frontends"],
      verified: true,
      streak: "5 days",
    },
  ];

  const filteredBuilders = mockBuilders.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = selectedSkill === "All" || b.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
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
            <h1 className="font-display text-5xl font-bold text-ark-black">Builders Directory</h1>
            <p className="mt-2 text-xl text-ark-navy">Architects of India's Tech Future</p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search by name, college, interest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm outline-none focus:border-ark-navy focus:ring-1 focus:ring-ark-navy"
            />
            <span className="absolute right-4 top-3 text-zinc-400">🔍</span>
          </div>
        </div>

        {/* Skill filter pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {skillsList.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => setSelectedSkill(skill)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                selectedSkill === skill
                  ? "bg-ark-navy text-white shadow-md"
                  : "border border-black/10 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Builders grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBuilders.map((builder) => (
            <div
              key={builder.username}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-md transition-all duration-150 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={builder.image}
                    alt={builder.name}
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-ark-gold/25"
                  />
                  {builder.verified && (
                    <span
                      title="Verified Builder"
                      className="absolute bottom-0 right-0 rounded-full bg-ark-gold p-1 text-[10px] font-bold text-ark-navy shadow-md ring-2 ring-white"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-ark-black flex items-center gap-1">
                  {builder.name}
                </h3>
                <p className="text-sm font-semibold text-ark-navy">{builder.role}</p>
                <p className="mt-1 text-xs text-zinc-500">{builder.college}</p>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-full">
                  <span>🔥</span>
                  <span>{builder.streak} Streak</span>
                </div>

                {/* Skills tags */}
                <div className="mt-4 flex flex-wrap justify-center gap-1">
                  {builder.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-zinc-150 px-2 py-0.5 text-[10px] font-bold text-zinc-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Interests list */}
                <p className="mt-3 text-xs text-zinc-500 italic line-clamp-2">
                  Building: {builder.interests.join(", ")}
                </p>
              </div>

              <div className="mt-6 border-t border-black/5 pt-4">
                <a
                  href={`/builders/${builder.username}`}
                  className="block w-full text-center rounded-full bg-ark-navy px-4 py-2.5 text-xs font-bold text-white transition-all duration-150 hover:bg-[#22378c] hover:scale-102"
                >
                  View Full Profile
                </a>
              </div>
            </div>
          ))}
          {filteredBuilders.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-black/10 p-12 text-center">
              <span className="text-4xl">👤</span>
              <h3 className="mt-4 font-display text-xl font-bold text-ark-black">No builders found</h3>
              <p className="mt-1 text-sm text-zinc-500">Try matching on other skills or search terms.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
