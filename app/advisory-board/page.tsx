"use client";

import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function AdvisoryBoardPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const advisors = [
    {
      name: "Dr. Srinivas Rao",
      role: "AI & Deep-Tech Advisor",
      affiliation: "Professor, AI Swarm Lab",
      image: "https://picsum.photos/seed/sri/150/150",
      bio: "20+ years researching distributed networking architectures and computational physics. Advises the A.R.K. council on deep-tech validation strategies.",
    },
    {
      name: "Aditya Vora",
      role: "Capital & Scale Advisor",
      affiliation: "Managing Partner, Vora Cap",
      image: "https://picsum.photos/seed/aditya/150/150",
      bio: "Venture capitalist backing early deep tech spin-offs. Mentors student teams on capitalization and export-import compliance.",
    },
  ];

  const partners = [
    { name: "IIT Bombay Incubator (SINE)", type: "Incubator Hub", logo: "🏫" },
    { name: "T-Hub Hyderabad", type: "Ecosystem Partner", logo: "🚀" },
    { name: "BITS Pilani Innovation Cell", type: "Incubator Partner", logo: "🎓" },
    { name: "Zyra Bio Materials", type: "Industry Partner", logo: "⚡" },
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
          "Zyra Bio closes a $14M seed round to scale climate-first materials for advanced manufacturing.",
          "Founders in Bengaluru launch a cross-border fintech rail for emerging market exporters.",
          "ARK Research briefs investors on AI-native industrial software and deep-tech resilience.",
          "Mumbai mobility startup reports 3x retention growth after rolling out community-led fleet financing.",
          "Delhi health-tech collective opens applications for its women-led diagnostics accelerator cohort.",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="font-display text-5xl font-bold text-ark-black">Advisory Board</h1>
          <p className="mt-2 text-xl text-ark-navy">Steering the Architects of Rising Knowledge</p>
        </div>

        {/* Board grid */}
        <section className="mt-10">
          <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-2">Academic & Venture Advisors</h3>
          <div className="grid gap-6 sm:grid-cols-2 mt-6">
            {advisors.map((adv, i) => (
              <div
                key={i}
                className="rounded-3xl border border-black/8 bg-white p-6 shadow-md hover:shadow-lg transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start"
              >
                <img
                  src={adv.image}
                  alt={adv.name}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-ark-gold/20 shrink-0"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-display text-xl font-bold text-ark-black">{adv.name}</h4>
                  <p className="text-xs font-bold text-ark-navy uppercase tracking-wider">{adv.role}</p>
                  <p className="text-[10px] text-zinc-400 font-semibold">{adv.affiliation}</p>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-2">{adv.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ecosystem partners */}
        <section className="mt-12">
          <h3 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-2">Ecosystem Partners</h3>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 mt-6">
            {partners.map((p, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-black/8 shadow-sm text-center flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl block">{p.logo}</span>
                  <h4 className="text-sm font-bold text-ark-black mt-3 leading-snug">{p.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">{p.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
