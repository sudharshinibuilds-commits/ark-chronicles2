import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function RewardsPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const badges = [
    { id: "1", name: "First Chronicle", icon: "📝", earned: true, description: "Published your first article" },
    { id: "2", name: "Rising Star", icon: "⭐", earned: true, description: "Reached 1000 reads" },
    { id: "3", name: "Consistent Builder", icon: "🔥", earned: true, description: "7-day reading streak" },
    { id: "4", name: "Community Leader", icon: "👑", earned: true, description: "Top 10% contributors" },
    { id: "5", name: "Research Pioneer", icon: "🔬", earned: false, description: "Published 5 research papers" },
    { id: "6", name: "Network Builder", icon: "🤝", earned: false, description: "Connected with 50+ founders" },
    { id: "7", name: "Mentor", icon: "🎓", earned: false, description: "Mentored 10+ startups" },
    { id: "8", name: "Investor Eye", icon: "💰", earned: false, description: "Identified 3 successful investments" },
    { id: "9", name: "Storyteller", icon: "✍️", earned: false, description: "Published 10+ articles" },
    { id: "10", name: "Elite Founder", icon: "🏆", earned: false, description: "Featured in Founders Vault" },
    { id: "11", name: "Opportunity Scout", icon: "🎯", earned: false, description: "Shared 20+ opportunities" },
    { id: "12", name: "Legend", icon: "🌟", earned: false, description: "All badges unlocked" },
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
        <h1 className="font-display text-5xl font-bold text-ark-black">Your Rewards</h1>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/8 bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ark-black">XP Progress</h2>
              <p className="mt-1 text-sm text-zinc-600">Level 5 • 2,450 / 5,000 XP</p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
          <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-black/10">
            <div className="h-full bg-ark-gold" style={{ width: "49%" }} />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/8 bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ark-black">Reading Streak</h2>
              <p className="mt-1 text-sm text-zinc-600">Keep it going!</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">🔥</span>
              <div className="font-display text-4xl font-bold text-ark-navy">5 Days</div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-3xl font-bold text-ark-black">Badges</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`overflow-hidden rounded-2xl border p-6 shadow-lg transition-all duration-150 hover:scale-[1.02] ${
                  badge.earned
                    ? "border-ark-gold/30 bg-white"
                    : "border-black/8 bg-zinc-100 opacity-60"
                }`}
              >
                <div className="text-5xl">{badge.icon}</div>
                <h3 className={`mt-3 font-display text-lg font-bold ${badge.earned ? "text-ark-black" : "text-zinc-500"}`}>
                  {badge.name}
                </h3>
                <p className={`mt-2 text-sm ${badge.earned ? "text-zinc-600" : "text-zinc-400"}`}>
                  {badge.description}
                </p>
                {badge.earned && (
                  <div className="mt-3">
                    <span className="inline-flex rounded-full bg-ark-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-ark-navy">
                      Earned
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-ark-navy/20 bg-gradient-to-r from-ark-navy to-[#2a3f8a] p-8 text-white">
          <h2 className="font-display text-3xl font-bold">Download Certificate</h2>
          <p className="mt-2 text-white/80">
            You've earned a certificate for your contributions to the ARK Chronicles community.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex rounded-full bg-ark-gold px-6 py-3 text-sm font-semibold text-ark-navy transition-all duration-150 hover:scale-105 hover:bg-[#e1b54b]"
          >
            Download Certificate
          </button>
        </div>
      </div>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
