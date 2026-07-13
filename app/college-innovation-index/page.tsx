"use client";

import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function CollegeInnovationIndexPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [sortField, setSortField] = useState<"score" | "startups" | "publications" | "patents" | "openSource" | "hackathons" | "projects">("score");

  const collegeRanks = [
    {
      rank: 1,
      name: "IIT Bombay",
      slug: "iit-bombay",
      city: "Mumbai, MH",
      startups: 35,
      publications: 120,
      patents: 24,
      openSource: 72,
      hackathons: 64,
      projects: 95,
      score: 1823,
    },
    {
      rank: 2,
      name: "BITS Pilani",
      slug: "bits-pilani",
      city: "Pilani, RJ",
      startups: 28,
      publications: 94,
      patents: 18,
      openSource: 58,
      hackathons: 52,
      projects: 81,
      score: 1475,
    },
    {
      rank: 3,
      name: "KL University, Hyderabad",
      slug: "klh-hyderabad",
      city: "Hyderabad, TS",
      startups: 14,
      publications: 42,
      patents: 6,
      openSource: 18,
      hackathons: 25,
      projects: 38,
      score: 645,
    },
    {
      rank: 4,
      name: "NSUT Delhi",
      slug: "nsut-delhi",
      city: "Delhi",
      startups: 12,
      publications: 38,
      patents: 4,
      openSource: 15,
      hackathons: 20,
      projects: 32,
      score: 512,
    },
    {
      rank: 5,
      name: "RV College of Engineering",
      slug: "rvce-bengaluru",
      city: "Bengaluru, KA",
      startups: 10,
      publications: 30,
      patents: 3,
      openSource: 12,
      hackathons: 18,
      projects: 28,
      score: 418,
    },
  ];

  const sortedColleges = [...collegeRanks].sort((a: any, b: any) => {
    return b[sortField] - a[sortField];
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
          <h1 className="font-display text-5xl font-bold text-ark-black">College Innovation Index</h1>
          <p className="mt-2 text-xl text-ark-navy">National University Innovation Leaderboard</p>
        </div>

        {/* Podium for top 3 */}
        <div className="mt-10 grid gap-6 md:grid-cols-3 items-end">
          {/* Second Place */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md text-center order-2 md:order-1 h-fit">
            <span className="text-3xl">🥈</span>
            <h3 className="font-display font-bold text-lg text-ark-black mt-2">{collegeRanks[1].name}</h3>
            <p className="text-xs text-zinc-500 font-semibold">{collegeRanks[1].city}</p>
            <div className="mt-4 font-display text-2xl font-black text-ark-navy">{collegeRanks[1].score} pts</div>
            <a href={`/college/${collegeRanks[1].slug}`} className="mt-4 inline-block text-xs font-bold text-ark-navy hover:underline">
              Explore Campus Page &rarr;
            </a>
          </div>

          {/* First Place */}
          <div className="rounded-3xl border border-ark-gold/30 bg-white p-8 shadow-lg text-center order-1 md:order-2 ring-2 ring-ark-gold/25 h-fit md:-mt-6">
            <span className="text-4xl">👑</span>
            <h3 className="font-display font-bold text-2xl text-ark-black mt-2">{collegeRanks[0].name}</h3>
            <p className="text-xs text-zinc-500 font-semibold">{collegeRanks[0].city}</p>
            <div className="mt-4 font-display text-3xl font-black text-ark-gold">{collegeRanks[0].score} pts</div>
            <a href={`/college/${collegeRanks[0].slug}`} className="mt-4 inline-block text-xs font-bold text-ark-navy hover:underline">
              Explore Campus Page &rarr;
            </a>
          </div>

          {/* Third Place */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md text-center order-3 h-fit">
            <span className="text-3xl">🥉</span>
            <h3 className="font-display font-bold text-lg text-ark-black mt-2">{collegeRanks[2].name}</h3>
            <p className="text-xs text-zinc-500 font-semibold">{collegeRanks[2].city}</p>
            <div className="mt-4 font-display text-2xl font-black text-ark-navy">{collegeRanks[2].score} pts</div>
            <a href={`/college/${collegeRanks[2].slug}`} className="mt-4 inline-block text-xs font-bold text-ark-navy hover:underline">
              Explore Campus Page &rarr;
            </a>
          </div>
        </div>

        {/* Index Table Grid with metrics sorting */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-black/8 bg-white shadow-lg">
          <div className="p-6 border-b border-black/5 bg-[#faf9f6]">
            <h3 className="font-display text-xl font-bold text-ark-black">Metric Ranks Index</h3>
            <p className="text-xs text-zinc-450 mt-1">Click a column head or selector to re-sort university innovation ranks.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-zinc-400 self-center mr-2">Sort by:</span>
              {[
                { field: "score", label: "Composite Index" },
                { field: "startups", label: "Startups" },
                { field: "publications", label: "Publications" },
                { field: "patents", label: "Patents" },
                { field: "openSource", label: "Open Source" },
                { field: "hackathons", label: "Hackathons" },
                { field: "projects", label: "Projects" },
              ].map((btn) => (
                <button
                  key={btn.field}
                  type="button"
                  onClick={() => setSortField(btn.field as any)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    sortField === btn.field
                      ? "bg-ark-navy text-white shadow-md"
                      : "bg-zinc-100 text-zinc-650 hover:bg-zinc-200"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-black/5 uppercase font-bold text-zinc-450 tracking-wider">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Institution</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4 text-center">Startups</th>
                  <th className="p-4 text-center">Pubs</th>
                  <th className="p-4 text-center">Patents</th>
                  <th className="p-4 text-center">OS Repos</th>
                  <th className="p-4 text-center">Hacks</th>
                  <th className="p-4 text-center">Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {sortedColleges.map((c, idx) => (
                  <tr key={c.slug} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4 font-bold text-ark-navy">{idx + 1}</td>
                    <td className="p-4">
                      <a href={`/college/${c.slug}`} className="font-display font-bold text-sm text-ark-black hover:underline block">
                        {c.name}
                      </a>
                      <span className="text-[10px] text-zinc-400 font-semibold">{c.city}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-ark-gold font-display text-sm">{c.score}</td>
                    <td className="p-4 text-center font-semibold text-zinc-700">{c.startups}</td>
                    <td className="p-4 text-center font-semibold text-zinc-700">{c.publications}</td>
                    <td className="p-4 text-center font-semibold text-zinc-700">{c.patents}</td>
                    <td className="p-4 text-center font-semibold text-zinc-700">{c.openSource}</td>
                    <td className="p-4 text-center font-semibold text-zinc-700">{c.hackathons}</td>
                    <td className="p-4 text-center font-semibold text-zinc-700">{c.projects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
