"use client";

import { useParams, useRouter } from "next/navigation";
import AudioPlayer from "../../components/AudioPlayer";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LiveTicker from "../../components/LiveTicker";

export default function FounderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Mock startup database
  const startupsDb: Record<string, any> = {
    "founder-1": {
      name: "Aarav Bedi",
      startup: "PulseForge AI",
      role: "Founder & CEO",
      college: "IIT Bombay",
      city: "Bengaluru",
      avatarSeed: "founder-1",
      coverSeed: "cover-1",
      industry: "AI/ML",
      stage: "Seed",
      funding: "$2.0M",
      teamSize: "18 members",
      website: "https://pulseforge.ai",
      linkedin: "https://linkedin.com/in/aarav-bedi-mock",
      email: "aarav@pulseforge.ai",
      story: "From a small dorm room at IIT Bombay to building one of India's most promising AI startups, Aarav's journey is a testament to persistence and vision. Starting with just a laptop and a dream to revolutionize industrial operations, he bootstrapped PulseForge AI for 18 months before securing seed funding. Today, the company serves over 50 enterprise clients across Asia.",
      timeline: [
        { year: "2024", title: "Founded PulseForge AI", desc: "Started bootstrapping from college cell." },
        { year: "2025", title: "Beta Product & Traction", desc: "Onboarded first 5 manufacturing units in Pune." },
        { year: "2026", title: "Seed Round Closure", desc: "Raised $2M led by top tier deep tech micro VC." },
      ],
      badges: ["🏆 Top Builder", "📈 3x Growth", "⭐ Featured"],
    },
    "founder-2": {
      name: "Ishita Rao",
      startup: "Kindred Health",
      role: "Co-Founder",
      college: "KL University",
      city: "Mumbai",
      avatarSeed: "founder-2",
      coverSeed: "cover-2",
      industry: "HealthTech",
      stage: "Pre-seed",
      funding: "$400K",
      teamSize: "6 members",
      website: "https://kindredhealth.co.in",
      linkedin: "https://linkedin.com/in/ishita-rao-mock",
      email: "ishita@kindredhealth.co.in",
      story: "Ishita noticed deep-seated scheduling and screening gaps in tier-2 clinics. Harnessing automated diagnostic queues, Kindred Health streamlines patient diagnostic records for rural and urban community networks.",
      timeline: [
        { year: "2025", title: "Clinic Research", desc: "Conducted clinic audits in Hyderabad suburbs." },
        { year: "2026", title: "Pre-seed Raise & Platform Launch", desc: "Secured $400K and deployed core clinical pipeline to 12 centers." },
      ],
      badges: ["🌿 Social Impact", "🚀 Rising Star"],
    },
    "founder-3": {
      name: "Kabir Sethi",
      startup: "LedgerMint",
      role: "Co-Founder & CTO",
      college: "BITS Pilani",
      city: "Hyderabad",
      avatarSeed: "founder-3",
      coverSeed: "cover-3",
      industry: "Fintech",
      stage: "Seed",
      funding: "$1.5M",
      teamSize: "12 members",
      website: "https://ledgermint.com",
      linkedin: "https://linkedin.com/in/kabir-sethi-mock",
      email: "kabir@ledgermint.com",
      story: "Cross-border export financing has historically been locked behind legacy bank gates. LedgerMint provides student startups and SMEs with compliance-first digital credit lockers to speed up trade transactions.",
      timeline: [
        { year: "2024", title: "Inception at BITS", desc: "Won college FinTech track prize." },
        { year: "2025", title: "Product Launch", desc: "Partnered with 3 local exporter collectives." },
        { year: "2026", title: "Seed Round", desc: "Raised $1.5M to scale operations to Singapore trade corridors." },
      ],
      badges: ["💻 Code Pioneer", "💰 Finance Tech"],
    },
    "founder-4": {
      name: "Rhea Thomas",
      startup: "Northstar Mobility",
      role: "Founder & CEO",
      college: "IIT Delhi",
      city: "Delhi",
      avatarSeed: "founder-4",
      coverSeed: "cover-4",
      industry: "ClimateTech",
      stage: "Bootstrapped",
      funding: "$0 (Self)",
      teamSize: "4 members",
      website: "https://northstarmobility.in",
      linkedin: "https://linkedin.com/in/rhea-thomas-mock",
      email: "rhea@northstarmobility.in",
      story: "Rhea designed a battery swapping scheduler that minimizes wait times for commercial EV fleet logistics. The company is actively piloting swapping pods across North Delhi corridors.",
      timeline: [
        { year: "2025", title: "Designed swap controller", desc: "Simulated load distribution equations." },
        { year: "2026", title: "Delivered first swap pod", desc: "Currently running field validation trials." },
      ],
      badges: ["🔋 Climate Builder"],
    },
  };

  const founder = startupsDb[id] || startupsDb["founder-1"];

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
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar Profiler */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                <img
                  src={`https://picsum.photos/seed/founder-${founder.avatarSeed}/400/400`}
                  alt={founder.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-xs font-bold"
                >
                  ◀
                </button>
              </div>

              <h1 className="mt-4 font-display text-2xl font-bold text-ark-black flex items-center gap-2">
                {founder.name}
                <span className="text-sm font-bold text-ark-gold">★</span>
              </h1>
              <p className="mt-1 text-md font-semibold text-ark-navy">{founder.startup}</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{founder.role}</p>
              <p className="mt-2 text-xs text-zinc-500">{founder.college} • {founder.city}</p>

              {/* Startup Metadata Details */}
              <div className="mt-6 border-t border-black/5 pt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Industry</span>
                  <span className="font-bold text-ark-navy">{founder.industry}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Stage</span>
                  <span className="font-bold text-zinc-700">{founder.stage}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Funding</span>
                  <span className="font-bold text-ark-gold">{founder.funding}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Team Size</span>
                  <span className="font-bold text-zinc-700">{founder.teamSize}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Website</span>
                  <a href={founder.website} target="_blank" rel="noreferrer" className="font-bold text-ark-navy hover:underline">
                    Visit Site &rarr;
                  </a>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: "#0077B5" }}
                >
                  LinkedIn Connection
                </a>
                <a
                  href={`mailto:${founder.email}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-ark-navy transition-all hover:scale-105 hover:bg-zinc-100"
                >
                  Email Founder
                </a>
              </div>

              <div className="mt-6 border-t border-black/5 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ark-navy">Badges</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {founder.badges.map((badge: string, index: number) => (
                    <span key={index} className="rounded-full bg-ark-gold/15 border border-ark-gold/30 px-3 py-1.5 text-[10px] font-bold text-ark-navy">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main story Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-lg">
              <h2 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Founder Story</h2>
              <p className="mt-4 leading-7 text-zinc-700 text-sm">
                {founder.story}
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-lg">
              <h2 className="font-display text-2xl font-bold text-ark-black border-b border-black/5 pb-3">Milestone Timeline</h2>
              <div className="mt-6 space-y-6">
                {founder.timeline.map((milestone: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-4 w-4 rounded-full ${index % 2 === 0 ? 'bg-ark-navy' : 'bg-ark-gold'}`} />
                      {index < founder.timeline.length - 1 && <div className="mt-2 h-12 w-0.5 bg-black/10" />}
                    </div>
                    <div>
                      <span className="inline-flex rounded bg-zinc-100 px-2 py-0.5 text-xs font-bold text-ark-navy">
                        {milestone.year}
                      </span>
                      <h3 className="font-display text-lg font-bold text-ark-black mt-1">{milestone.title}</h3>
                      <p className="text-sm text-zinc-650 mt-1">{milestone.desc}</p>
                    </div>
                  </div>
                ))}
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
