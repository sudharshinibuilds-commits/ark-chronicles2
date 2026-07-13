"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AudioPlayer from "../../components/AudioPlayer";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LiveTicker from "../../components/LiveTicker";

export default function CollegePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [activeSection, setActiveSection] = useState<"people" | "startups" | "research" | "opportunities">("people");

  // Mock college database
  const collegesDb: Record<string, any> = {
    "klh-hyderabad": {
      name: "KL University, Hyderabad",
      city: "Hyderabad, Telangana",
      logo: "🏫",
      stats: {
        startups: 14,
        publications: 42,
        patents: 6,
        openSource: 18,
        hackathons: 25,
        projects: 38,
      },
      ambassador: {
        name: "Siddharth Verma",
        role: "Lead Ambassador (Verified)",
        avatar: "https://picsum.photos/seed/sidd/100/100",
      },
      builders: [
        { name: "Siddharth Verma", role: "AI Agent Architect", avatar: "https://picsum.photos/seed/sidd/80/80", verified: true },
        { name: "Neha Patil", role: "Product Manager", avatar: "https://picsum.photos/seed/neha/80/80", verified: false },
      ],
      researchers: [
        { name: "Dr. Srinivas Rao", topic: "Agentic Swarm Routing Protocols", citations: 32 },
      ],
      startups: [
        { name: "AutoAgent Labs", stage: "Incubated", pitch: "Customizable LLM workflows on the edge." },
      ],
      opportunities: [
        { title: "Zomato Design Intern", org: "Zomato", deadline: "July 25, 2026" },
      ],
    },
    "iit-bombay": {
      name: "IIT Bombay",
      city: "Mumbai, Maharashtra",
      logo: "🎓",
      stats: {
        startups: 35,
        publications: 120,
        patents: 24,
        openSource: 72,
        hackathons: 64,
        projects: 95,
      },
      ambassador: {
        name: "Ananya Sen",
        role: "Ambassador (Verified)",
        avatar: "https://picsum.photos/seed/ananya/100/100",
      },
      builders: [
        { name: "Ananya Sen", role: "Climate Researcher", avatar: "https://picsum.photos/seed/ananya/80/80", verified: true },
        { name: "Rohan Das", role: "Robotics Dev", avatar: "https://picsum.photos/seed/rohan/80/80", verified: true },
      ],
      researchers: [
        { name: "Ananya Sen", topic: "Biodegradable Organic Polymers", citations: 18 },
      ],
      startups: [
        { name: "BioWrap Solutions", stage: "Seed Stage", pitch: "Agri-waste polymer packaging sheets." },
      ],
      opportunities: [
        { title: "Flipkart Data Intern", org: "Flipkart", deadline: "July 20, 2026" },
      ],
    },
  };

  const college = collegesDb[slug] || collegesDb["klh-hyderabad"];

  // Calculate innovation index score (simple sum metric)
  const indexScore = college.stats.startups * 10 + college.stats.publications * 2 + college.stats.patents * 15 + college.stats.openSource * 3 + college.stats.hackathons * 5 + college.stats.projects * 4;

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
        <div className="relative overflow-hidden rounded-3xl bg-[#1B2A6B] p-8 text-white shadow-xl md:p-12">
          <div className="absolute top-4 left-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
            >
              ◀ Back
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-6xl">{college.logo}</span>
              <div>
                <h1 className="font-display text-3xl font-black text-white sm:text-4xl">{college.name}</h1>
                <p className="text-zinc-300 font-semibold">{college.city}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/15 p-4 text-center">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Innovation Index Score</span>
              <div className="font-display text-3xl font-black text-ark-gold mt-1">{indexScore} pts</div>
              <span className="text-[10px] text-zinc-300">Ranked Top 10% Nationwide</span>
            </div>
          </div>
        </div>

        {/* Innovation Metrics Grid */}
        <section className="mt-8">
          <h3 className="font-display text-xl font-bold text-ark-black border-b border-black/5 pb-2">University Innovation Metrics</h3>
          <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-6">
            <div className="bg-white p-4 rounded-2xl border border-black/8 text-center shadow-sm">
              <span className="text-2xl">🚀</span>
              <div className="font-display text-xl font-black text-ark-navy mt-2">{college.stats.startups}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Startups</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/8 text-center shadow-sm">
              <span className="text-2xl">🔬</span>
              <div className="font-display text-xl font-black text-ark-gold mt-2">{college.stats.publications}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Publications</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/8 text-center shadow-sm">
              <span className="text-2xl">📜</span>
              <div className="font-display text-xl font-black text-ark-navy mt-2">{college.stats.patents}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Patents</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/8 text-center shadow-sm">
              <span className="text-2xl">🌐</span>
              <div className="font-display text-xl font-black text-ark-gold mt-2">{college.stats.openSource}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Open Source</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/8 text-center shadow-sm">
              <span className="text-2xl">💻</span>
              <div className="font-display text-xl font-black text-ark-navy mt-2">{college.stats.hackathons}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Hackathons</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/8 text-center shadow-sm">
              <span className="text-2xl">💡</span>
              <div className="font-display text-xl font-black text-ark-gold mt-2">{college.stats.projects}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Projects</div>
            </div>
          </div>
        </section>

        {/* Content Deck Grid layout */}
        <div className="grid gap-8 lg:grid-cols-3 mt-8">
          {/* Main sections */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              {/* Tabs list */}
              <div className="flex border-b border-black/5 pb-3">
                {["people", "startups", "research", "opportunities"].map((tab: any) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveSection(tab)}
                    className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 ${
                      activeSection === tab
                        ? "border-ark-navy text-ark-navy"
                        : "border-transparent text-zinc-400 hover:text-zinc-650"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Rendering content */}
              <div className="mt-6">
                {activeSection === "people" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Campus Builders Directory</h4>
                    {college.builders.map((b: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-black/5">
                        <div className="flex items-center gap-3">
                          <img src={b.avatar} alt={b.name} className="h-10 w-10 rounded-full object-cover" />
                          <div>
                            <div className="text-sm font-bold text-ark-black flex items-center gap-1">
                              {b.name}
                              {b.verified && <span className="text-[9px] text-ark-gold">✓</span>}
                            </div>
                            <div className="text-xs text-zinc-500">{b.role}</div>
                          </div>
                        </div>
                        <a
                          href={`/builders/${b.name.toLowerCase().replace(" ", "-")}`}
                          className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-ark-navy border border-black/10 hover:bg-zinc-100"
                        >
                          Profile
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "startups" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Campus Startups</h4>
                    {college.startups.map((st: any, i: number) => (
                      <div key={i} className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
                        <div className="flex justify-between items-center">
                          <h5 className="font-display font-bold text-base text-ark-black">{st.name}</h5>
                          <span className="text-[10px] font-bold text-ark-navy bg-ark-navy/5 px-2 py-0.5 rounded-full">
                            {st.stage}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">{st.pitch}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "research" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Publications & Research</h4>
                    {college.researchers.map((res: any, i: number) => (
                      <div key={i} className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
                        <h5 className="font-display font-bold text-sm text-ark-black">{res.topic}</h5>
                        <p className="text-xs text-zinc-500 mt-1">Lead: {res.name}</p>
                        <p className="text-[10px] text-ark-gold font-bold mt-2">Citations: {res.citations} index</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "opportunities" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Opportunities</h4>
                    {college.opportunities.map((opp: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-zinc-50 rounded-2xl border border-black/5">
                        <div>
                          <h5 className="font-bold text-sm text-ark-black">{opp.title}</h5>
                          <p className="text-xs text-zinc-500 mt-0.5">{opp.org}</p>
                        </div>
                        <span className="text-[10px] font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded">
                          Dl: {opp.deadline}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ambassador profile card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Campus Ambassador</span>
              <div className="relative mx-auto mt-4 h-24 w-24 overflow-hidden rounded-full border-2 border-ark-gold shadow-md">
                <img src={college.ambassador.avatar} alt={college.ambassador.name} className="h-full w-full object-cover" />
              </div>
              <h4 className="mt-4 font-display text-lg font-bold text-ark-black">{college.ambassador.name}</h4>
              <p className="text-xs text-ark-navy font-semibold">{college.ambassador.role}</p>

              <div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-ark-gold bg-ark-navy px-3 py-1.5 rounded-full w-fit mx-auto">
                <span>Verified Ambassador Badge ✓</span>
              </div>

              <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
                Connect with Siddharth to set up A.R.K. hackathons, research labs, or guest lectures on campus.
              </p>

              <button
                type="button"
                onClick={() => alert(`Connecting with ambassador ${college.ambassador.name}...`)}
                className="mt-6 w-full rounded-full bg-ark-navy py-2.5 text-xs font-bold text-white hover:bg-[#22378c]"
              >
                Contact Ambassador
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
