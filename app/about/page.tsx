import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function AboutPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const team = [
    { name: "Arjun Mehta", role: "Founder & CEO", initials: "AM" },
    { name: "Riya Kapoor", role: "Editor-in-Chief", initials: "RK" },
    { name: "Vikram Singh", role: "Head of Research", initials: "VS" },
    { name: "Sanya Gupta", role: "Community Lead", initials: "SG" },
    { name: "Karan Patel", role: "Tech Lead", initials: "KP" },
    { name: "Meera Nair", role: "Content Director", initials: "MN" },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Header
        currentDate={currentDate}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Chronicles", href: "/chronicles" },
          { label: "Founders", href: "/founders" },
          { label: "Research", href: "/research" },
          { label: "Investors", href: "/investors" },
          { label: "Opportunities", href: "/opportunities" },
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
        <h1 className="font-display text-5xl font-bold text-ark-black">About ARK Chronicles</h1>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white p-8 shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ark-navy/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B2A6B" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-ark-black">Mission</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              To empower founders, investors, and builders with actionable insights that transform ambition into sustainable success.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white p-8 shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ark-gold/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-ark-black">Vision</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              To become India's most trusted platform for startup intelligence, connecting knowledge with opportunity across the ecosystem.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white p-8 shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ark-navy/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B2A6B" strokeWidth="2" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-ark-black">Values</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              Integrity, Excellence, Community, and Innovation drive everything we do. We believe in rising together.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-ark-navy/20 bg-ark-navy/5 p-8 sm:grid-cols-4">
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-ark-navy">50K+</div>
            <div className="mt-1 text-sm text-zinc-600">Readers</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-ark-navy">1,200+</div>
            <div className="mt-1 text-sm text-zinc-600">Articles</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-ark-navy">80+</div>
            <div className="mt-1 text-sm text-zinc-600">Colleges</div>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-ark-navy">28</div>
            <div className="mt-1 text-sm text-zinc-600">Cities</div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-3xl font-bold text-ark-black">Our Team</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ark-navy text-2xl font-bold text-white">
                  {member.initials}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ark-black">{member.name}</h3>
                <p className="mt-1 text-sm text-zinc-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-ark-navy/20 bg-gradient-to-r from-ark-navy to-[#2a3f8a] p-8 text-white">
          <h2 className="font-display text-3xl font-bold">Join Our Mission</h2>
          <p className="mt-2 text-white/80">
            We're always looking for passionate individuals who want to build the future of startup intelligence.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex rounded-full bg-ark-gold px-6 py-3 text-sm font-semibold text-ark-navy transition-all duration-150 hover:scale-105 hover:bg-[#e1b54b]"
          >
            View Open Positions
          </button>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
