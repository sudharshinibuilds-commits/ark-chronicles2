"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LiveTicker from "../components/LiveTicker";

export default function EventsPage() {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [registeringEvent, setRegisteringEvent] = useState<any | null>(null);
  const [ticketTier, setTicketTier] = useState("General");
  const [ticketGenerated, setTicketGenerated] = useState<any | null>(null);

  const categories = ["All", "Summit", "Meetup", "Webinar", "Workshop", "Demo Day"];

  const mockEvents = [
    {
      id: "event-1",
      title: "A.R.K. Innovation Summit 2026",
      category: "Summit",
      date: "August 15, 2026",
      time: "10:00 AM - 6:00 PM IST",
      location: "Virtual & Bengaluru Physical",
      speakers: ["Dr. Srinivas Rao", "Aarav Bedi", "Naina Kapoor"],
      description: "Our flagship annual summit gathering 500+ builders, researchers, and leading VCs to discuss edge cognitive architectures and circular deep-tech infrastructure.",
    },
    {
      id: "event-2",
      title: "Deep Tech Founders Meetup",
      category: "Meetup",
      date: "July 25, 2026",
      time: "4:00 PM - 7:00 PM IST",
      location: "T-Hub, Hyderabad",
      speakers: ["Kabir Sethi", "Ishita Rao"],
      description: "An in-person networking mixer for student founders working in SaaS, hardware engineering, and logistics scaling.",
    },
    {
      id: "event-3",
      title: "AI Agent Engineering Workshop",
      category: "Workshop",
      date: "July 28, 2026",
      time: "2:00 PM - 5:00 PM IST",
      location: "Virtual (Zoom/Discord)",
      speakers: ["Siddharth Verma"],
      description: "A hands-on codealong session on building autonomous multi-agent systems using TypeScript and LangChain telemetry.",
    },
    {
      id: "event-4",
      title: "BioWrap Product Demo Day",
      category: "Demo Day",
      date: "August 02, 2026",
      time: "11:00 AM - 1:00 PM IST",
      location: "IIT Bombay Incubator",
      speakers: ["Ananya Sen", "Dr. Amit Roy"],
      description: "Showcasing active degradation prototypes of biodegradables to partner packaging conglomerates.",
    },
  ];

  const filteredEvents = mockEvents.filter((ev) => {
    return selectedCategory === "All" || ev.category === selectedCategory;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      eventTitle: registeringEvent.title,
      date: registeringEvent.date,
      location: registeringEvent.location,
      tier: ticketTier,
      ticketNo: `ARK-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setTicketGenerated(data);
    setRegisteringEvent(null);
  };

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
          <h1 className="font-display text-5xl font-bold text-ark-black">Events Portal</h1>
          <p className="mt-2 text-xl text-ark-navy">National Summit, Meetups & Sprints</p>
        </div>

        {/* Category Toggles */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                selectedCategory === cat
                  ? "bg-ark-navy text-white shadow-md"
                  : "border border-black/10 bg-white text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-ark-gold/15 border border-ark-gold/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ark-navy">
                    {ev.category}
                  </span>
                  <span className="text-xs font-semibold text-zinc-450">{ev.date}</span>
                </div>

                <h3 className="mt-4 font-display text-2xl font-bold text-ark-black leading-snug">{ev.title}</h3>
                <p className="mt-1 text-xs text-ark-navy font-bold uppercase tracking-wide">{ev.time} • {ev.location}</p>

                <p className="mt-3 text-sm text-zinc-550 leading-relaxed">{ev.description}</p>

                <div className="mt-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Featured Speakers</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {ev.speakers.map((sp) => (
                      <span key={sp} className="rounded bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 font-semibold">
                        🎙️ {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-black/5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setRegisteringEvent(ev);
                    setTicketTier("General");
                  }}
                  className="w-full rounded-full bg-ark-navy py-3 text-xs font-bold text-white transition-all hover:bg-[#22378c] hover:scale-102"
                >
                  Register & Claim Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Registration Modal */}
      <AnimatePresence>
        {registeringEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-black/5"
            >
              <h3 className="font-display text-xl font-bold text-ark-black border-b border-black/5 pb-2">
                Event Registration
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Claim your pass for: {registeringEvent.title}</p>

              <form onSubmit={handleRegister} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-ark-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-ark-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Ticket Pass Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["General", "VIP Pass", "Builder Tier"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTicketTier(t)}
                        className={`rounded-full py-2 text-xs font-bold transition-all border ${
                          ticketTier === t ? "bg-ark-navy text-white border-ark-navy" : "bg-white border-black/10 text-zinc-600"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-ark-gold py-3 text-xs font-bold text-ark-navy hover:bg-[#e1b54b]"
                  >
                    Confirm & Generate Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
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

      {/* Generated Ticket View Modal */}
      <AnimatePresence>
        {ticketGenerated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#1B2A6B] text-white p-6 shadow-2xl border border-white/10"
            >
              <div className="text-center">
                <span className="text-xs font-bold text-ark-gold tracking-[0.2em] uppercase">A.R.K. EVENT PASS</span>
                <div className="h-px bg-white/20 my-4" />
                <h3 className="font-display text-xl font-bold px-2">{ticketGenerated.eventTitle}</h3>
                <p className="text-xs text-zinc-300 mt-1">{ticketGenerated.date} • {ticketGenerated.location}</p>

                <div className="my-6 rounded-2xl bg-white p-4 text-ark-black inline-block shadow-md">
                  {/* Simulated QR Code */}
                  <div className="h-32 w-32 bg-zinc-100 border border-zinc-200 flex flex-col justify-center items-center text-center p-2 rounded-lg">
                    <span className="text-2xl">📱</span>
                    <span className="text-[10px] font-mono mt-2 font-bold text-zinc-500">{ticketGenerated.ticketNo}</span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-white/10 pt-4 text-left text-xs font-semibold px-4">
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Tier Pass</span>
                    <span className="text-ark-gold font-bold">{ticketGenerated.tier}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Ticket Number</span>
                    <span className="font-bold">{ticketGenerated.ticketNo}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTicketGenerated(null)}
                  className="mt-6 w-full rounded-full bg-white text-ark-navy py-3 text-xs font-bold hover:bg-zinc-100"
                >
                  Save Pass to Device
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <AudioPlayer />
    </main>
  );
}
