"use client";

import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function MediaKitPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const assets = [
    { name: "A.R.K. Chronicles Primary Logo (Dark)", format: "PNG / SVG", size: "1.2 MB", type: "Logo" },
    { name: "A.R.K. Chronicles Monogram (Gold)", format: "PNG / SVG", size: "840 KB", type: "Logo" },
    { name: "A.R.K. Media Brand Guidelines Book", format: "PDF Document", size: "5.4 MB", type: "Guidelines" },
    { name: "July 2026 Press Release Templates", format: "DOCX Document", size: "320 KB", type: "Press" },
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
          <h1 className="font-display text-5xl font-bold text-ark-black">Media Kit</h1>
          <p className="mt-2 text-xl text-ark-navy">Brand Assets & Guidelines</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mt-10">
          {/* Brand colors info */}
          <div className="lg:col-span-1 rounded-3xl border border-black/8 bg-white p-6 shadow-md space-y-6">
            <h3 className="font-display text-xl font-bold text-ark-black border-b border-black/5 pb-2">Brand Palette</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-ark-navy shadow-sm border border-black/10" />
                <div>
                  <div className="text-xs font-bold text-ark-black">ARK Navy</div>
                  <div className="text-[10px] text-zinc-450 font-mono">#1B2A6B (Primary)</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-ark-gold shadow-sm border border-black/10" />
                <div>
                  <div className="text-xs font-bold text-ark-black">ARK Gold</div>
                  <div className="text-[10px] text-zinc-450 font-mono">#D4A017 (Accent)</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 shadow-sm border border-black/10" />
                <div>
                  <div className="text-xs font-bold text-ark-black">ARK Charcoal</div>
                  <div className="text-[10px] text-zinc-450 font-mono">#0A0A0A (Text)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Asset download deck */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-md">
              <h3 className="font-display text-xl font-bold text-ark-black border-b border-black/5 pb-2">Official Assets</h3>
              <div className="mt-4 space-y-4">
                {assets.map((asset, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-black/5 gap-4"
                  >
                    <div>
                      <span className="inline-flex rounded bg-ark-navy/5 px-2 py-0.5 text-[9px] font-bold text-ark-navy mb-1.5 uppercase">
                        {asset.type}
                      </span>
                      <h4 className="font-semibold text-xs text-ark-black">{asset.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{asset.format} • {asset.size}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Starting download for media asset: ${asset.name}`)}
                      className="rounded-full bg-ark-navy px-4 py-2 text-xs font-bold text-white hover:bg-[#22378c]"
                    >
                      Download
                    </button>
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
